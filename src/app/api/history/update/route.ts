import { NextResponse } from "next/server";
import { handleResponse } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function PUT(request: Request) {
  try {
    console.log("[DEBUG] History update route hit");
    const authHeader = request.headers.get("Authorization");
    console.log("[DEBUG] Auth header present:", !!authHeader);

    if (!authHeader) {
      console.log("[DEBUG] No Authorization header found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("[DEBUG] Update request body:", JSON.stringify(body, null, 2));

    // Validate request body according to API schema
    if (!body.qname || typeof body.new_answer === "undefined") {
      console.log("[DEBUG] Validation failed:", {
        hasQname: !!body.qname,
        hasNewAnswer: typeof body.new_answer !== "undefined",
      });
      return NextResponse.json(
        { message: "Missing required fields: qname and new_answer" },
        { status: 400 }
      );
    }

    // First check if the user has a submission
    console.log("[DEBUG] Checking for existing submission");
    console.log("[DEBUG] Making GET request to:", `${API_URL}/history`);
    console.log("[DEBUG] Request headers:", {
      Authorization: authHeader,
    });

    const historyResponse = await fetch(`${API_URL}/history`, {
      headers: {
        Authorization: authHeader,
      },
    });

    console.log(
      "[DEBUG] History check response status:",
      historyResponse.status
    );
    console.log(
      "[DEBUG] History check status text:",
      historyResponse.statusText
    );

    if (!historyResponse.ok) {
      const historyError = await historyResponse.json().catch(() => ({}));
      console.error("[DEBUG] History check error details:", {
        status: historyResponse.status,
        statusText: historyResponse.statusText,
        error: historyError,
        url: historyResponse.url,
      });

      if (historyResponse.status === 404) {
        return NextResponse.json(
          {
            message:
              "No existing submission found. Please submit a survey first.",
          },
          { status: 404 }
        );
      }
      throw new Error(`Failed to check history: ${historyResponse.status}`);
    }

    // If we have a submission, proceed with the update
    console.log(
      "[DEBUG] Making update request to:",
      `${API_URL}/history/update`
    );
    console.log(
      "[DEBUG] Update request body:",
      JSON.stringify(
        {
          qname: body.qname,
          new_answer: body.new_answer,
        },
        null,
        2
      )
    );
    console.log("[DEBUG] Update request headers:", {
      "Content-Type": "application/json",
      Authorization: authHeader,
    });

    const response = await fetch(`${API_URL}/history/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        qname: body.qname,
        new_answer: body.new_answer,
      }),
    });

    console.log("[DEBUG] Update response status:", response.status);
    console.log("[DEBUG] Update response status text:", response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[DEBUG] Update error details:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: response.url,
      });
      throw new Error(
        errorData.message || `Backend returned ${response.status}`
      );
    }

    const data = await handleResponse(response);
    console.log("[DEBUG] Update successful response:", data);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[DEBUG] History update error full details:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
      name: error.name,
    });
    return NextResponse.json(
      { message: error.message || "Failed to update history" },
      { status: error.status || 500 }
    );
  }
}
