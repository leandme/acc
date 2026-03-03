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

  const system_prompt = `You are a careful facial-profile analysis assistant.
Return ONLY valid JSON. No markdown. No extra text.`;

  const prompt = `
Analyze the side-profile jawline in this photo and estimate jawline angle/type.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "jawline_assessment": {
    "side_profile_visible": boolean,
    "profile_quality": "good" | "moderate" | "poor",
    "jawline_type": "very_sharp" | "sharp" | "balanced" | "soft" | "rounded" | "uncertain",
    "jawline_angle_degrees": number | null,
    "angle_score": number,
    "confidence_rating": "low" | "medium" | "high",
    "confidence_score": number,
    "shape_rationale": "string",
    "measurement_notes": ["string"],
    "style_recommendations": ["string"],
    "retake_tips": ["string"],
    "alternative_types": ["string"],
    "landmarks": {
      "ramus_point": { "x": number, "y": number } | null,
      "gonion_point": { "x": number, "y": number } | null,
      "menton_point": { "x": number, "y": number } | null
    }
  }
}

Rules:
- jawline_angle_degrees is the interior mandibular angle at gonion between the posterior ramus line and mandibular body line.
- jawline_angle_degrees should usually be between 80 and 170 when available.
- angle_score must be an integer from 0 to 100 where higher means a sharper (more acute) visual jawline angle.
- confidence_score must be an integer from 0 to 100.
- landmark x and y values must be normalized to [0,1], where (0,0)=top-left and (1,1)=bottom-right.
- If a clear side profile is not visible, set side_profile_visible=false, jawline_type="uncertain", jawline_angle_degrees=null, confidence_rating="low", and confidence_score<=40.
- Keep measurement_notes/style_recommendations/retake_tips to 3-6 items each.
- Do not provide medical advice or diagnosis.
- This is visual estimation from one image only.
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
      console.error("Replicate create prediction error (jawline-check):", createJson);
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
      console.error("Unexpected Replicate response (jawline-check):", createJson);
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
    console.error("Replicate call failed (jawline-check):", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}
