import { NextResponse } from "next/server";
import { handleResponse } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: Request) {
  try {
    console.log("[DEBUG] History route hit");
    const authHeader = request.headers.get("Authorization");
    console.log("[DEBUG] Auth header present:", !!authHeader);

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("[DEBUG] Making request to:", `${API_URL}/history`);
    const response = await fetch(`${API_URL}/history`, {
      headers: {
        Authorization: authHeader,
      },
    });

    console.log("[DEBUG] History API response status:", response.status);
    const data = await handleResponse(response);
    console.log("[DEBUG] History data received:", data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[DEBUG] History error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch history data" },
      { status: error.status || 500 }
    );
  }
}
