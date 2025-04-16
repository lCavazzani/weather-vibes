// src/app/api/generate-image/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let prompt: string;
  let output_format: string = "png";
  let model: string = "sd3";
  let seed: string | undefined;
  let negative_prompt: string | undefined;
  let cfg_scale: string = "7";
  let style_preset: string | undefined;

  const ct = req.headers.get("content-type") || "";

  if (ct.includes("application/json")) {
    // parse JSON body
    const body = await req.json();
    prompt = body.prompt;
    output_format = body.output_format ?? output_format;
    model = body.model ?? model;
    seed = body.seed?.toString();
    negative_prompt = body.negative_prompt;
    cfg_scale = body.cfg_scale?.toString() ?? cfg_scale;
    style_preset = body.style_preset;
  } else if (ct.includes("multipart/form-data")) {
    // parse form-data body
    const form = await req.formData();
    prompt = form.get("prompt") as string;
    output_format = (form.get("output_format") as string) || output_format;
    model = (form.get("model") as string) || model;
    seed = form.get("seed")?.toString() || undefined;
    negative_prompt = form.get("negative_prompt") as string;
    cfg_scale = form.get("cfg_scale")?.toString() || cfg_scale;
    style_preset = form.get("style_preset") as string;
  } else {
    return NextResponse.json(
      { error: 'Content-Type must be "application/json" or "multipart/form-data"' },
      { status: 400 }
    );
  }

  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  // Build the multipart/form-data to send *to* Stability
  const out = new FormData();
  out.append("prompt", prompt);
  out.append("output_format", output_format);
  out.append("cfg_scale", cfg_scale);
  if (seed) out.append("seed", seed);
  if (negative_prompt) out.append("negative_prompt", negative_prompt);
  if (style_preset) out.append("style_preset", style_preset);

  const url = `https://api.stability.ai/v2beta/stable-image/generate/${model}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`,
      Accept: "image/*",
    },
    body: out,
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("Stability API error:", res.status, txt);
    return NextResponse.json(
      { error: "Stability API error", details: txt },
      { status: res.status }
    );
  }

  // convert binary to base64
  const buffer = await res.arrayBuffer();
  const b64 = Buffer.from(buffer).toString("base64");
  const mime = res.headers.get("content-type") || "image/png";
  return NextResponse.json({ image_url: `data:${mime};base64,${b64}` });
}
