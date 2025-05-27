import { NextResponse } from "next/server";
import { handleResponse } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    console.log("[DEBUG] Registration route hit");
    const body = await request.json();
    console.log(
      "[DEBUG] Registration request body:",
      JSON.stringify(body, null, 2)
    );

    // Log the request URL and method
    console.log("[DEBUG] Making request to:", `${API_URL}/auth/`);
    console.log("[DEBUG] Request method:", "POST");
    console.log("[DEBUG] Request headers:", {
      "Content-Type": "application/json",
    });

    const response = await fetch(`${API_URL}/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("[DEBUG] Registration response status:", response.status);
    console.log(
      "[DEBUG] Registration response status text:",
      response.statusText
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[DEBUG] Registration error details:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: response.url,
      });
      throw new Error(
        errorData.message ||
          `Registration failed with status ${response.status}`
      );
    }

    // Clone the response before reading it
    const responseToLog = response.clone();
    const responseData = await responseToLog.json().catch(() => null);
    console.log("[DEBUG] Registration successful response:", responseData);

    // Now handle the original response
    await handleResponse(response);

    console.log("[DEBUG] Registration successful");
    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[DEBUG] Registration error full details:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
      name: error.name,
    });
    return NextResponse.json(
      { message: error.message || "Registration failed" },
      { status: error.status || 500 }
    );
  }
}
