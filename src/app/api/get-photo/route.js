import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const photoPath = searchParams.get("photoPath");
    const url = `${process.env.BASE_URL}${photoPath}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch the photo");
    }

    const imageData = await response.blob(); // You can also use response.buffer() if you need a buffer

    return new NextResponse(imageData, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg", // or the appropriate content type for your image
      },
    });
  } catch (error) {
    return new NextResponse("Failed to fetch the photo", { status: 500 });
  }
}
