import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topic: string }> }
) {
  try {
    // Extract topic from params - await the Promise
    const { topic } = await params;
    console.log("[DEBUG] Charts route hit with topic:", topic);

    // Make a request to the backend for the topic
    console.log(`[DEBUG] Fetching data for topic: ${topic}`);
    const response = await fetch(`${API_URL}/charts/${topic}`, {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[DEBUG] Backend error for ${topic}:`, errorData);
      throw new Error(
        errorData.detail ||
          errorData.message ||
          `Backend returned ${response.status}`
      );
    }

    const data = await response.json();
    console.log(`[DEBUG] Received data for ${topic}:`, data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[DEBUG] Chart API error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch chart data" },
      { status: error.status || 500 }
    );
  }
}
