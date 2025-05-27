import { NextResponse } from "next/server";
import { handleResponse } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    console.log("[DEBUG] Token route hit");

    // Parse form data instead of JSON
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const grantType = formData.get("grant_type") || "password";

    console.log("[DEBUG] Token request form data:", {
      username,
      password: password ? "[REDACTED]" : undefined,
      grant_type: grantType,
    });

    // Forward the form data as is
    const forwardFormData = new URLSearchParams();
    forwardFormData.append("username", username as string);
    forwardFormData.append("password", password as string);
    forwardFormData.append("grant_type", grantType as string);

    console.log("[DEBUG] Making request to:", `${API_URL}/auth/token`);
    console.log(
      "[DEBUG] Form data:",
      forwardFormData.toString().replace(password as string, "[REDACTED]")
    );

    const response = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: forwardFormData,
    });

    console.log("[DEBUG] Token response status:", response.status);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[DEBUG] Token error:", errorData);
      throw new Error(errorData.message || "Authentication failed");
    }

    const data = await handleResponse<{
      access_token: string;
      token_type: string;
    }>(response);

    console.log("[DEBUG] Token generated successfully");
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[DEBUG] Token error:", error);
    return NextResponse.json(
      { message: error.message || "Authentication failed" },
      { status: error.status || 500 }
    );
  }
}
