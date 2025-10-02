export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET(request, { params }) {
  const userId = params.uid;
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_EMPLOYEE_CHANGE_LOG}?employee=${userId}`;

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

  // Filter out objects where field_name is "rate"
  const filteredData = data.filter((item) => item.field_name !== "rate");

  return new Response(JSON.stringify(filteredData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
