import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageBase64 } = await req.json();

  if (!imageBase64) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 });
  }

  try {
    const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb", // llava-13b version slug
        input: {
          top_p: 1,
          temperature: 0.1,
          prompt: `Estimate this person's body fat percentage to the nearest integer based on the image. Take as much time as you need to be as accurate as you can. Look at all aspects of the person's physique to help make the most accurate estimate possible. Respond with only the number followed by a percent sign "%". Do not include any explanation or extra text.`,

          image: imageBase64,
        },
      }),
    });

    const replicateData = await replicateRes.json();

    // ✅ Add better error handling here
    if (!replicateData || !replicateData.urls?.get) {
      console.error("Unexpected Replicate response:", replicateData);
      return NextResponse.json({ error: "Invalid Replicate response" }, { status: 500 });
    }

    const predictionUrl = replicateData.urls.get;

    // Polling until prediction is done
    let output = null;
    while (!output || output.status === "starting" || output.status === "processing") {
      const pollRes = await fetch(predictionUrl, {
        headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
      });
      output = await pollRes.json();

      if (output.status === "failed") {
        console.error("Prediction failed:", output);
        return NextResponse.json({ error: "Prediction failed" }, { status: 500 });
      }

      if (output.status !== "succeeded") {
        await new Promise((res) => setTimeout(res, 1000)); // wait 1s
      }
    }

    return NextResponse.json({ estimate: output.output });
  } catch (err) {
    console.error("Replicate call failed:", err);
    return NextResponse.json({ error: "Failed to estimate body fat" }, { status: 500 });
  }
  
}
