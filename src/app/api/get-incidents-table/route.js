import sanitizeData from "@/app/functions/sanitizeData";
import findHighestIdObject from "@/app/functions/findHighestIdObject";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET() {
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_INCIDENTS_TABLE}`;

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
