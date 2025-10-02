export async function POST(request) {
  const body = await request.json();

  // Construct the API URL
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_DRIVER_RATES_ENDPOINT}`;

  // Fetch data to the external API
  const apiResponse = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

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
