export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function POST(request) {
  const requestBody = await request.formData();

  let apiUrl = `${process.env.API_BASE_URL}${process.env.API_EMPLOYEE_UPDATE_ATTENDANCE}`;

  const apiResponse = await fetch(apiUrl, {
    method: "POST",
    body: requestBody,
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
