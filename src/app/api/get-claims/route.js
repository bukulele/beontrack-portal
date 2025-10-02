import sanitizeData from "@/app/functions/sanitizeData";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function POST(request) {
  const requestBody = await request.json();
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_CLAIMS}`;

  const apiResponse = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!apiResponse.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const data = await apiResponse.json();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PATCH(request) {
  const requestBody = await request.json();
  const incidentId = requestBody.id;
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_CLAIMS}${incidentId}/`;

  const apiResponse = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!apiResponse.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const data = await apiResponse.json();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function GET() {
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_CLAIMS}`;

  const apiResponse = await fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!apiResponse.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const data = await apiResponse.json();
  const sanitizedData = sanitizeData(data);

  let filteredData = sanitizedData.map((item) => {
    let filteredItem = {};
    Object.entries(item).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        filteredItem[key] = findHighestIdObject(value);
      } else {
        filteredItem[key] = value;
      }
    });
    return filteredItem;
  });

  return new Response(JSON.stringify(filteredData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request) {
  const requestBody = await request.json();
  const claimId = requestBody.id;

  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_CLAIMS}${claimId}/`;

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
