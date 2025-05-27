import { NextResponse } from "next/server";
import { handleResponse } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Validate required fields
function validateSurveyData(data: any) {
  const requiredFields = [
    "Age",
    "Country",
    "EdLevel",
    "Employment",
    "MainBranch",
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Validate data types
  if (typeof data.Age !== "string" || !data.Age) {
    throw new Error("Age must be a non-empty string");
  }

  if (typeof data.Country !== "string" || !data.Country) {
    throw new Error("Country must be a non-empty string");
  }

  if (typeof data.EdLevel !== "string" || !data.EdLevel) {
    throw new Error("Education Level must be a non-empty string");
  }

  if (typeof data.Employment !== "string" || !data.Employment) {
    throw new Error("Employment must be a non-empty string");
  }

  if (typeof data.MainBranch !== "string" || !data.MainBranch) {
    throw new Error("Main Branch must be a non-empty string");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validate the survey data
    try {
      validateSurveyData(body);
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 422 });
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await handleResponse(response);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to submit survey data" },
      { status: error.status || 500 }
    );
  }
}
