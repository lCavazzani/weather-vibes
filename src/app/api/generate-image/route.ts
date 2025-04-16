import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { image_prompt } = await req.json();

  if (!image_prompt) {
    return NextResponse.json(
      { error: "Missing image prompt" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024x1024/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: image_prompt }],
          cfg_scale: 7, // controls creativity vs prompt adherence
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stability API error: ${error}`);
    }

    const data = await response.json();
    const imageBase64 = data.artifacts[0]?.base64;

    if (!imageBase64) {
      throw new Error("No image returned by Stability API");
    }

    const imageUrl = `data:image/png;base64,${imageBase64}`;
    return NextResponse.json({ image_url: imageUrl });
  } catch (err) {
    console.error("[STABILITY AI ERROR]", err);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
