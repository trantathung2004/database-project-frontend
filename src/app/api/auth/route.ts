import { NextResponse } from "next/server";
import { handleResponse, getAuthHeaders } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: Request) {
  try {
    const response = await fetch(`${API_URL}/auth`, {
      headers: getAuthHeaders(),
    });

    const data = await handleResponse(response);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to check auth status" },
      { status: error.status || 500 }
    );
  }
}
