export async function POST(request) {
  const data = await request.formData(); // Assuming you're sending FormData

  // Construct the API URL from environment variables
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_VIOLATIONS_UPLOAD_PHOTOS}`;

  // Fetch data to the external API
  const apiResponse = await fetch(apiUrl, {
    method: "POST",
    body: data,
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
