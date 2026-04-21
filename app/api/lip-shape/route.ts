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

  const system_prompt = `You are a careful lip-shape analysis assistant.
Return ONLY valid JSON. No markdown. No extra text.`;

  const prompt = `
Analyze the lips in the face image and estimate lip-shape traits.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "lip_assessment": {
    "primary_shape": "full" | "thin" | "top_heavy" | "bottom_heavy" | "heart_shaped" | "wide" | "round" | "downturned" | "uncertain",
    "alternative_shapes": ["string"],
    "upper_lower_balance": "balanced" | "upper_dominant" | "lower_dominant" | "uncertain",
    "cupid_bow_definition": "defined" | "soft" | "flat" | "uncertain",
    "mouth_width_category": "narrow" | "balanced" | "wide" | "uncertain",
    "confidence_rating": "low" | "medium" | "high",
    "confidence_score": number,
    "symmetry_score": number | null,
    "fullness_score": number | null,
    "shape_rationale": "string",
    "observation_notes": ["string"],
    "style_suggestions": ["string"],
    "retake_tips": ["string"]
  }
}

Rules:
- confidence_score, symmetry_score, and fullness_score are integers 0-100 when available.
- If lips are obscured (hands, hair, blur, masks, heavy overdraw), use "uncertain" values and lower confidence.
- Keep observation_notes, style_suggestions, and retake_tips to 3-6 items.
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
      console.error("Replicate create prediction error (lip-shape):", createJson);
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
      console.error("Unexpected Replicate response (lip-shape):", createJson);
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
    console.error("Replicate call failed (lip-shape):", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}
