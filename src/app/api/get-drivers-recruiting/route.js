import sanitizeData from "@/app/functions/sanitizeData";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/route";
// import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET(req) {
  // const fetchStartTime = performance.now();
  // const secret = process.env.AZURE_AD_CLIENT_SECRET;
  // const session = await getServerSession(authOptions);
  // const token = await getToken({ req, secret });
  // console.log(session);
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_DRIVERS_RECRUITING_URL}`;

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
  // const fetchEndTime = performance.now();

  const data = await apiResponse.json();

  // const reworkStartTime = performance.now();

  // const sanitizedData = sanitizeData(
  //   data.filter((driver) => driver.status === "NW" || driver.status === "AR")
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

  // const reworkEndTime = performance.now();

  // Calculate time taken for fetching data and reworking data
  // const fetchTime = (fetchEndTime - fetchStartTime) / 1000;
  // const reworkTime = (reworkEndTime - reworkStartTime) / 1000;

  // Log the time taken for each process
  // console.log("Time taken to fetch data:", fetchTime, "seconds");
  // console.log("Time taken to rework data:", reworkTime, "seconds");

  return new Response(JSON.stringify(filteredData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
