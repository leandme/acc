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

  const system_prompt = `You are a careful facial-attractiveness estimation assistant.
Return ONLY valid JSON. No markdown. No extra text.`;

  const prompt = `
Estimate perceived facial attractiveness from the image.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "attractiveness_assessment": {
    "attractiveness_score": number | null,
    "attractiveness_band": "very_low" | "low" | "moderate" | "above_average" | "high" | "very_high" | "exceptional" | "uncertain",
    "confidence_rating": "low" | "medium" | "high",
    "confidence_score": number,
    "attractiveness_rationale": "string",
    "positive_cues": ["string"],
    "style_tips": ["string"],
    "retake_tips": ["string"]
  }
}

Rules:
- attractiveness_score is an integer from 0 to 100.
- confidence_score is an integer from 0 to 100.
- If a clear frontal face is not visible, use attractiveness_band "uncertain", set attractiveness_score to null, confidence_rating to "low", and confidence_score to 0-35.
- Keep positive_cues, style_tips, and retake_tips to 3-6 items each.
- Keep language neutral and non-harmful.
- Do not provide medical advice, diagnosis, legal recommendations, or identity claims.
- This is an appearance-based estimate from a single image.
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
      console.error("Replicate create prediction error (attractiveness):", createJson);
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
      console.error("Unexpected Replicate response (attractiveness):", createJson);
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
    console.error("Replicate call failed (attractiveness):", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}
