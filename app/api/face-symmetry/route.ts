import { NextRequest, NextResponse } from "next/server";

type ReqBody = {
  imageBase64?: string; // data URL
};

const REPLICATE_MODEL_VERSION =
  "e526a4c7f3e940fa28e7e6bdf3a00ac35e11f004e10c5fb12b51f576663de814";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ReqBody;
  const { imageBase64 } = body;

  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "Missing REPLICATE_API_TOKEN" },
      { status: 500 }
    );
  }

  if (!imageBase64) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 });
  }

  const system_prompt = `You are a careful face-symmetry analyst.
Return ONLY valid JSON. No markdown. No extra text.`;

  const prompt = `
Analyze the face in the image and estimate visual facial symmetry.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "symmetry_assessment": {
    "symmetry_score": number | null,
    "confidence_rating": "low" | "medium" | "high",
    "facial_midline_x_percent": number,
    "asymmetry_summary": "string",
    "key_observations": ["string"],
    "improvement_tips": ["string"]
  }
}

Rules:
- symmetry_score is an integer from 0 to 100 (100 = very symmetric).
- facial_midline_x_percent is a decimal from 0.35 to 0.65 representing where the vertical facial midline falls across the image width.
- If a clear frontal face is not visible, set symmetry_score to null, confidence_rating to "low", and explain the issue in asymmetry_summary.
- Keep key_observations and improvement_tips to 3-6 items each.
- Do not provide medical advice or diagnosis.
- This is a visual estimate only, not a clinical measurement.
`.trim();

  try {
    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: REPLICATE_MODEL_VERSION,
        input: {
          prompt,
          system_prompt,
          image_input: [imageBase64],
          reasoning_effort: "low",
          max_completion_tokens: 14000,
        },
      }),
    });

    const createJson = await createRes.json();

    if (!createRes.ok) {
      console.error("Replicate create prediction error (face-symmetry):", createJson);
      const upstreamStatus =
        createRes.status >= 400 && createRes.status <= 599 ? createRes.status : 502;

      const detail =
        createJson?.detail ||
        createJson?.error ||
        createJson?.message ||
        null;

      return NextResponse.json(
        {
          error: "Replicate create prediction failed",
          detail,
          details: createJson,
        },
        { status: upstreamStatus }
      );
    }

    if (!createJson?.urls?.get) {
      console.error("Unexpected Replicate response (face-symmetry):", createJson);
      return NextResponse.json(
        { error: "Invalid Replicate response", details: createJson },
        { status: 500 }
      );
    }

    return NextResponse.json({
      predictionId: createJson.id,
      getUrl: createJson.urls.get,
    });
  } catch (err) {
    console.error("Replicate call failed (face-symmetry):", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}
