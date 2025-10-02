import sanitizeData from "@/app/functions/sanitizeData";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET(request, { params }) {
  const userId = params.uid; // Retrieving the user ID from the URL parameter
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_DRIVERS_GET_DRIVER}${userId}`;

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

  for (let key in sanitizedData) {
    if (sanitizedData[key] === "") continue;

    if (key === "consents" || key === "road_tests") {
      sanitizedData[key] = [sanitizedData[key]];
    }

    if (key === "driver_rates") {
      for (let subKey in sanitizedData[key]) {
        if (subKey === "id" || subKey === "driver") continue;
        let newKeyName = `rates_${subKey}`;
        sanitizedData[newKeyName] = sanitizedData[key][subKey];
      }
    }
  }

  return new Response(JSON.stringify(sanitizedData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
