export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function POST(request) {
  const data = await request.formData(); // Handle FormData from the client

  // Other preparations for the request can go here

  const apiResponse = await fetch(
    `${process.env.API_BASE_URL}${process.env.API_UPLOAD_FUEL_REPORT}`,
    {
      method: "POST",
      body: data,
    }
  );

  if (!apiResponse.ok) {
    return new Response(JSON.stringify({ error: "Failed to process" }), {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await apiResponse.json();
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
