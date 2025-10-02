import sanitizeData from "@/app/functions/sanitizeData";
import findHighestIdObject from "@/app/functions/findHighestIdObject";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET() {
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_DRIVERS_SAFETY_URL}`;
  // console.log("SAFETY DRIVERS:");
  // console.log(process.env);

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
  // const sanitizedData = sanitizeData(
  //   data.filter((driver) => driver.status !== "NW" && driver.status !== "AR")
  // );
  const sanitizedData = sanitizeData(data);

  let filteredData = sanitizedData.map((item) => {
    let filteredDriver = {};
    Object.entries(item).forEach(([key, value]) => {
      if (
        key !== "routes" &&
        key !== "activity_history" &&
        Array.isArray(value)
      ) {
        filteredDriver[key] = findHighestIdObject(value);
      } else {
        filteredDriver[key] = value;
      }
    });
    return filteredDriver;
  });
  return new Response(JSON.stringify(filteredData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
