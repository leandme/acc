import { NextRequest, NextResponse } from "next/server";

type ReqBody = {
  imageBase64?: string;
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

  const system_prompt = `You are a careful eyebrow-shape analysis assistant.
Return ONLY valid JSON. No markdown. No extra text.`;

  const prompt = `
Analyze eyebrow shape in the face image and classify eyebrow type.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "eyebrow_assessment": {
    "primary_type": "straight" | "soft_angled" | "hard_angled" | "rounded" | "high_arched" | "s_shaped" | "flat" | "uncertain",
    "alternative_types": ["string"],
    "confidence_rating": "low" | "medium" | "high",
    "confidence_score": number,
    "arch_height_score": number | null,
    "symmetry_score": number | null,
    "thickness_category": "thin" | "medium" | "thick" | "uncertain",
    "shape_rationale": "string",
    "observation_notes": ["string"],
    "grooming_suggestions": ["string"],
    "retake_tips": ["string"]
  }
}

Rules:
- confidence_score, arch_height_score, and symmetry_score are integers 0-100 when available.
- If eyebrows are occluded or not clearly visible, set primary_type to "uncertain", confidence_rating to "low", and confidence_score <= 35.
- Keep observation_notes, grooming_suggestions, and retake_tips to 3-6 items.
- Do not provide medical advice or diagnosis.
- This is an appearance-based estimate only.
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
      console.error("Replicate create prediction error (eyebrow-type):", createJson);
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
      console.error("Unexpected Replicate response (eyebrow-type):", createJson);
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
    console.error("Replicate call failed (eyebrow-type):", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}
