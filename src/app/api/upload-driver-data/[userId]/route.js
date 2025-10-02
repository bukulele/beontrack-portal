// File path: app/api/upload-driver-data/[userId]/route.js
export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function PATCH(request, { params }) {
  const userId = params.userId; // Retrieving the user ID from the URL parameter
  const data = await request.formData(); // Assuming the client sends FormData

  // Sending the request to the external API with the user ID in the URL
  const apiResponse = await fetch(
    `${process.env.API_BASE_URL}${process.env.API_DRIVERS_ENDPOINT}${userId}/`,
    {
      method: "PATCH",
      body: data,
    }
  );

  if (!apiResponse.ok) {
    // Handle non-2xx HTTP responses
    const errorDetails = await apiResponse.json();
    return new Response(
      JSON.stringify({
        error: `External API error: ${apiResponse.status}`,
        details: errorDetails,
      }),
      {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const result = await apiResponse.json();
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
