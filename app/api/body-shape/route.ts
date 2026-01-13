import { NextRequest, NextResponse } from "next/server";

const MODEL_VERSION =
  "80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb";

const ALLOWED = new Set([
  "Rectangle",
  "Triangle (Pear)",
  "Inverted Triangle",
  "Hourglass",
  "Oval (Round)",
]);

function normalizeShape(output: unknown): string | null {
  // Replicate outputs vary: string, array of strings, etc.
  const text =
    Array.isArray(output) ? output.join(" ") : output != null ? String(output) : "";

  const cleaned = text.trim();

  // If model obeys prompt perfectly:
  if (ALLOWED.has(cleaned)) return cleaned;

  // If it added extra junk, try to find a label substring:
  for (const label of ALLOWED) {
    if (cleaned.toLowerCase().includes(label.toLowerCase())) return label;
  }

  return cleaned.length ? cleaned : null;
}

export async function POST(req: NextRequest) {
  const { imageBase64 } = await req.json();

  if (!imageBase64) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 });
  }

  try {
    const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          top_p: 1,
          temperature: 0.1,
          prompt: `Classify this person's body shape based on the photo. Choose exactly ONE label from this list and respond with only that label:
- Rectangle
- Triangle (Pear)
- Inverted Triangle
- Hourglass
- Oval (Round)

Rules:
- Respond with ONLY the label text (exactly as written above).
- Do not include any extra words, punctuation, percentages, or explanations.`,
          image: imageBase64,
        },
      }),
    });

    if (!replicateRes.ok) {
      const errText = await replicateRes.text();
      console.error("Replicate create failed:", replicateRes.status, errText);
      return NextResponse.json({ error: "Replicate request failed" }, { status: 500 });
    }

    const replicateData = await replicateRes.json();

    const predictionUrl = replicateData?.urls?.get;
    if (!predictionUrl) {
      console.error("Unexpected Replicate response:", replicateData);
      return NextResponse.json({ error: "Invalid Replicate response" }, { status: 500 });
    }

    // Poll until done (with cap)
    let output: any = null;
    const MAX_POLLS = 60;

    for (let i = 0; i < MAX_POLLS; i++) {
      const pollRes = await fetch(predictionUrl, {
        headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
      });

      if (!pollRes.ok) {
        const errText = await pollRes.text();
        console.error("Replicate poll failed:", pollRes.status, errText);
        return NextResponse.json({ error: "Replicate polling failed" }, { status: 500 });
      }

      output = await pollRes.json();

      if (output.status === "failed") {
        console.error("Prediction failed:", output);
        return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
      }

      if (output.status === "succeeded") {
        const shape = normalizeShape(output.output);
        if (!shape) return NextResponse.json({ error: "No output shape" }, { status: 500 });
        return NextResponse.json({ shape });
      }

      // starting/processing/etc
      await new Promise((res) => setTimeout(res, 1000));
    }

    return NextResponse.json({ error: "Prediction timed out" }, { status: 504 });
  } catch (err) {
    console.error("Replicate call failed:", err);
    return NextResponse.json({ error: "Failed to analyze body shape" }, { status: 500 });
  }


}
