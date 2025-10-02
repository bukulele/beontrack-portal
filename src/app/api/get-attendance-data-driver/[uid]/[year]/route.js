export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET(request, { params }) {
  const userId = params.uid;
  const year = params.year;
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_DRIVER_GET_ATTENDANCE}${userId}/${year}`;

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

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
