import sanitizeData from "@/app/functions/sanitizeData";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET(request, { params }) {
  const incidentId = params.uid; // Retrieving the user ID from the URL parameter
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_INCIDENTS}/${incidentId}`;

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

  let sanitizedData = sanitizeData(data);

  return new Response(JSON.stringify(sanitizedData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
