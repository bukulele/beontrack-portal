import sanitizeData from "@/app/functions/sanitizeData";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function POST(request) {
  const requestBody = await request.json();
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_AVAILABLE_DRIVERS}`;

  const apiResponse = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
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

export async function GET(request, { params }) {
  const [route, terminal] = [...params.params];

  const query = new URLSearchParams();
  if (route !== "null") query.set("routes", route);
  if (terminal !== "null") query.set("terminal", terminal);

  const apiUrl = `${process.env.API_BASE_URL}${
    process.env.API_GET_AVAILABLE_DRIVERS
  }?${query.toString()}`;

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

  return new Response(JSON.stringify(sanitizedData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PATCH(request) {
  const requestBody = await request.json();
  const driverId = requestBody.id;
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_AVAILABLE_DRIVERS}${driverId}/`;

  const apiResponse = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
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
