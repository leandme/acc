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

  const system_prompt = `You are a careful facial-proportion analyst.
Return ONLY valid JSON. No markdown. No extra text.`;

  const prompt = `
Analyze the face in the image for golden-ratio style proportion alignment.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "golden_ratio_assessment": {
    "overall_score": number | null,
    "estimated_phi_ratio": number | null,
    "phi_difference_percent": number | null,
    "confidence_rating": "low" | "medium" | "high",
    "confidence_score": number,
    "face_shape_hint": "string",
    "analysis_summary": "string",
    "key_measurements": [
      {
        "measurement": "string",
        "observed_ratio": number | null,
        "target_ratio": number | null,
        "closeness_score": number | null,
        "note": "string"
      }
    ],
    "improvement_tips": ["string"]
  }
}

Rules:
- overall_score is an integer 0 to 100 where higher means closer to golden-ratio style proportions in this image.
- estimated_phi_ratio is a decimal ratio estimate, usually between 1.0 and 2.2 when available.
- phi_difference_percent is absolute percentage difference from 1.618 when ratio is available.
- confidence_score is an integer from 0 to 100.
- key_measurements should include 4 to 8 rows when a frontal face is visible.
- If a clear frontal face is not visible, set overall_score to null, confidence_rating to "low", and explain in analysis_summary.
- Do not provide medical advice or diagnosis.
- This is appearance-based estimation only from one image.
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
      console.error("Replicate create prediction error (golden-face-ratio):", createJson);
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
      console.error("Unexpected Replicate response (golden-face-ratio):", createJson);
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
    console.error("Replicate call failed (golden-face-ratio):", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}
