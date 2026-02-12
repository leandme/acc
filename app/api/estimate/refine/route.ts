import { NextRequest, NextResponse } from "next/server";

type ReqBody = {
  imageBase64?: string; // data URL
  extraImages?: string[]; // data URLs (optional)
  units?: "metric" | "imperial";
  age?: number;
  height?: number;
  weight?: number;
  waist?: number | null;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ReqBody;

  const {
    imageBase64,
    extraImages = [],
    units,
    age,
    height,
    weight,
    waist,
  } = body;

  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "Missing REPLICATE_API_TOKEN" },
      { status: 500 }
    );
  }

  if (!imageBase64) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 });
  }

  const system_prompt = `You are a careful body-composition assistant.
Return ONLY valid JSON. No markdown. No extra text.`;

  // ✅ include user-provided stats inside the prompt
  const statsBlock = `
User-provided stats (more reliable than guessing):
- Units: ${units ?? "unknown"}
- Age: ${Number.isFinite(age as number) ? age : "unknown"}
- Height: ${Number.isFinite(height as number) ? height : "unknown"}
- Weight: ${Number.isFinite(weight as number) ? weight : "unknown"}
- Waist circumference: ${
    waist != null && Number.isFinite(waist as number) ? waist : "not provided"
  }

Photos:
- There may be up to 3 images: front / side / back.
- Use all images together to judge fat distribution and reduce uncertainty.
`.trim();

  const prompt = `
${statsBlock}

Determine the perceived age and gender of the human in the images.
Then estimate body fat percentage using BOTH:
1) Visual evidence from all provided images (fat distribution, muscle definition, posture, lighting)
2) The user-provided stats above (age/height/weight/waist)

Determine the accuracy of your estimate and provide an explanation as to why you provided that estimate based on the visuals. Return accuracy as "high" if you recieve 3 images (front / side / back), height, weight, age and waist circumference AND if these seem reasonable and what you think they should be based on the images you have received.
Do not mention validated methods like DEXA or multi-frequency BIA.
Do not mention muscle or fat history or weight trends.
Provide the explanation in a talkative manner as though you are talking to the person.
Provide a list of things the person can do to help you provide an even more accurate estimate next time.

Return JSON exactly in this shape:
{
  "version": "1.0",
  "photo_assessment": {
    "perceived_gender": "string",
    "perceived_age": "string"
  },
  "estimation": {
    "body_fat_percent": number | null,
    "accuracy_rating": "low" | "medium" | "high",
    "estimation_rationale": "string",
    "accuracy_improvements": ["string"]
  }
}

Rules:
- Estimate age to the nearest year. Be as specific as possible.
- Estimate body fat percentage as accurate as possible with 1 decimal place. Be as specific as possible.
- Use all images provided. If images disagree due to lighting/pose, explain briefly in rationale.
- Do not provide medical advice or diagnosis. Provide an approximate, appearance-based estimate for fitness tracking.
`.trim();

  try {
    const images = [imageBase64, ...(Array.isArray(extraImages) ? extraImages : [])].slice(0, 3);

    const createRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // ✅ Use the same model version for now.
        // Swap to your “costlier” version later — the UX plumbing won’t change.
        version:
          "e526a4c7f3e940fa28e7e6bdf3a00ac35e11f004e10c5fb12b51f576663de814",
        input: {
          prompt,
          system_prompt,
          image_input: images,
          reasoning_effort: "low",
          max_completion_tokens: 20000,
        },
      }),
    });

    const createJson = await createRes.json();

    if (!createRes.ok) {
      console.error("Replicate create prediction error:", createJson);
      return NextResponse.json(
        { error: "Replicate create prediction failed", details: createJson },
        { status: 502 }
      );
    }

    if (!createJson?.urls?.get) {
      console.error("Unexpected Replicate response:", createJson);
      return NextResponse.json(
        { error: "Invalid Replicate response", details: createJson },
        { status: 500 }
      );
    }

    // ✅ Return immediately — client will poll status (same as your estimate flow)
    return NextResponse.json({
      predictionId: createJson.id,
      getUrl: createJson.urls.get,
    });
  } catch (err) {
    console.error("Replicate call failed:", err);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}
