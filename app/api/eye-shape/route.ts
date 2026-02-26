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

  const system_prompt = `You are a careful eye-feature analysis assistant.
Return ONLY valid JSON. No markdown. No extra text.`;

  const prompt = `
Analyze the eyes in the image and estimate eye shape, canthal tilt, and eye color.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "eye_assessment": {
    "primary_eye_shape": "almond" | "round" | "hooded" | "monolid" | "upturned" | "downturned" | "deep_set" | "protruding" | "uncertain",
    "alternative_eye_shapes": ["string"],
    "eye_color": {
      "primary": "brown" | "hazel" | "blue" | "green" | "gray" | "amber" | "black" | "mixed" | "uncertain",
      "secondary_tones": ["string"],
      "confidence_score": number
    },
    "canthal_tilt": {
      "category": "positive" | "neutral" | "negative" | "uncertain",
      "angle_degrees": number | null,
      "confidence_score": number
    },
    "confidence_rating": "low" | "medium" | "high",
    "confidence_score": number,
    "shape_rationale": "string",
    "observation_notes": ["string"],
    "style_suggestions": ["string"],
    "retake_tips": ["string"]
  }
}

Rules:
- confidence_score values are integers 0-100.
- canthal tilt angle is in degrees and may be negative, neutral, or positive.
- If eyes are obscured, closed, low-resolution, or heavily filtered, use "uncertain" values and reduce confidence.
- Keep observation_notes, style_suggestions, and retake_tips to 3-6 items each.
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
      console.error("Replicate create prediction error (eye-shape):", createJson);
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
      console.error("Unexpected Replicate response (eye-shape):", createJson);
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
    console.error("Replicate call failed (eye-shape):", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}
