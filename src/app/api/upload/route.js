import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Handle POST request
export async function POST(req) {
  try {
    const body = await req.json();
    const fileStr = body.data; // base64 encoded image/file

    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "uploads",
    });

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
