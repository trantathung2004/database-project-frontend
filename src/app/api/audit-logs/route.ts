import { NextResponse } from "next/server";
import { handleResponse } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: Request) {
  try {
    console.log("[DEBUG] Audit logs route hit");
    const authHeader = request.headers.get("Authorization");
    console.log("[DEBUG] Auth header present:", !!authHeader);

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("[DEBUG] Making request to:", `${API_URL}/audit-logs`);
    const response = await fetch(`${API_URL}/audit-logs`, {
      headers: {
        Authorization: authHeader,
      },
    });

    console.log("[DEBUG] Audit logs API response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("[DEBUG] Audit logs error:", errorData);
      
      // If the error message contains "403", return a 403 status
      if (errorData.detail?.includes("403")) {
        return NextResponse.json(
          { detail: "Only administrators can view audit logs" },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { detail: errorData.detail || "Failed to fetch audit logs" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("[DEBUG] Audit logs data received:", data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[DEBUG] Audit logs error:", error);
    return NextResponse.json(
      { detail: error.message || "Failed to fetch audit logs" },
      { status: error.status || 500 }
    );
  }
} 