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

  const system_prompt = `You are a careful nutrition and calorie estimation assistant.
Return ONLY valid JSON. No markdown. No extra text.`;

  const prompt = `
Analyze the meal or food visible in the image and estimate total calories.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "meal_assessment": {
    "meal_name": "string",
    "calorie_estimate_kcal": number | null,
    "calorie_range_kcal": {
      "min": number,
      "max": number
    },
    "confidence_rating": "low" | "medium" | "high",
    "detected_items": [
      {
        "name": "string",
        "estimated_calories_kcal": number,
        "portion_note": "string"
      }
    ],
    "macro_split_percent": {
      "protein": number,
      "carbs": number,
      "fat": number
    },
    "serving_assumptions": ["string"],
    "estimate_rationale": "string",
    "accuracy_improvements": ["string"]
  }
}

Rules:
- Estimate calories in kcal.
- Provide a realistic range even when confidence is low.
- Use 2 to 8 detected_items max.
- If details are unclear, lower confidence and state key assumptions.
- Keep macro_split_percent values non-negative and roughly summing to 100.
- Do not provide medical advice or diagnosis.
- This is a visual estimate for meal tracking, not a lab measurement.
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
      console.error("Replicate create prediction error (calorie-estimate):", createJson);
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
      console.error("Unexpected Replicate response (calorie-estimate):", createJson);
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
    console.error("Replicate call failed (calorie-estimate):", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}

