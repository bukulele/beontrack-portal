import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function DELETE(request, { params }) {
  const recordId = params.recordId;

  let apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_EMPLOYEE_ADJUSTMENTS}${recordId}/`;

  const apiResponse = await fetch(apiUrl, {
    method: "DELETE",
  });

  if (!apiResponse.ok) {
    // Attempt to parse error details if available
    let errorData = { error: "Failed to process request" };
    try {
      errorData = await apiResponse.json();
    } catch (e) {
      // If parsing fails, retain the default error message
    }
    return new NextResponse(JSON.stringify(errorData), {
      status: apiResponse.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Handle 204 No Content response separately
  if (apiResponse.status === 204) {
    // Return a 200 OK response with a success message
    return new NextResponse(
      JSON.stringify({ message: "Resource deleted successfully." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // For other successful responses, parse the JSON
  const result = await apiResponse.json();
  return new NextResponse(JSON.stringify(result), {
    status: apiResponse.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
