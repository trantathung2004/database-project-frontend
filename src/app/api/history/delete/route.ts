import { NextResponse } from "next/server";
import { handleResponse } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function DELETE(request: Request) {
  try {
    console.log("[DEBUG] Delete history route hit");
    const authHeader = request.headers.get("Authorization");
    console.log("[DEBUG] Auth header present:", !!authHeader);

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "[DEBUG] Making delete request to:",
      `${API_URL}/history/delete`
    );
    const response = await fetch(`${API_URL}/history/delete`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    console.log("[DEBUG] Delete API response status:", response.status);
    const data = await handleResponse(response);
    console.log("[DEBUG] Delete response received:", data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[DEBUG] Delete history error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete submission" },
      { status: error.status || 500 }
    );
  }
}
