export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET() {
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_DRIVER_GET_SCHEDULE}`;

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

export async function POST(request) {
  const requestBody = await request.json();
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_DRIVER_GET_SCHEDULE}`;

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

export async function PATCH(request, { params }) {
  const [id] = [...params.id];
  const requestBody = await request.json();

  let apiUrl = `${process.env.API_BASE_URL}${process.env.API_DRIVER_GET_SCHEDULE}${id}/`;

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
