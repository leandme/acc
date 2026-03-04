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

  const system_prompt = `You are a careful skin-type analysis assistant.
Return ONLY valid JSON. No markdown. No extra text.`;

const prompt = `
Analyze visible skin characteristics in the face image and estimate skin type.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "skin_assessment": {
    "primary_type": "dry" | "oily" | "combination" | "normal" | "sensitive" | "dehydrated" | "uncertain",
    "alternative_types": ["string"],
    "skin_tone_depth": "very-fair" | "fair-light" | "light-medium" | "medium" | "tan-olive" | "deep" | "very-deep" | "uncertain",
    "undertone": "warm" | "cool" | "neutral" | "olive" | "mixed" | "uncertain",
    "tone_evenness": "low" | "medium" | "high" | "uncertain",
    "pigmentation_visibility": "low" | "medium" | "high" | "uncertain",
    "texture_uniformity": "low" | "medium" | "high" | "uncertain",
    "sebum_level": "low" | "medium" | "high" | "uncertain",
    "hydration_level": "low" | "medium" | "high" | "uncertain",
    "pore_visibility": "low" | "medium" | "high" | "uncertain",
    "redness_level": "low" | "medium" | "high" | "uncertain",
    "barrier_support": "low" | "medium" | "high" | "uncertain",
    "confidence_rating": "low" | "medium" | "high",
    "confidence_score": number,
    "type_rationale": "string",
    "color_rationale": "string",
    "observation_notes": ["string"],
    "care_suggestions": ["string"],
    "retake_tips": ["string"]
  }
}

Rules:
- confidence_score is an integer 0-100.
- If lighting, heavy makeup, or filters reduce reliability, use "uncertain" values and lower confidence.
- Keep observation_notes, care_suggestions, and retake_tips to 3-6 items each.
- If tone/undertone cannot be estimated from the image, return "uncertain" for those fields.
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
      console.error("Replicate create prediction error (skin-type):", createJson);
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
      console.error("Unexpected Replicate response (skin-type):", createJson);
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
    console.error("Replicate call failed (skin-type):", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}
