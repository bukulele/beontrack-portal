const endpointMapping = {
  driver: process.env.API_DRIVER_ACTIVITY_HISTORY_ENDPOINT,
  employee: process.env.API_EMPLOYEE_ACTIVITY_HISTORY_ENDPOINT,
};

export async function POST(request) {
  const data = await request.formData(); // Handle FormData from the client
  const endpointIdentifier = data.get("endpointIdentifier"); // Get the identifier from the form data
  const apiEndpoint = endpointMapping[endpointIdentifier];

  data.delete("endpointIdentifier");

  const apiResponse = await fetch(`${process.env.API_BASE_URL}${apiEndpoint}`, {
    method: "POST",
    body: data,
  });

  const result = await apiResponse.json();
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function PATCH(request) {
  const data = await request.formData();
  const id = data.get("id"); // Assuming 'id' is part of the form data sent

  const endpointIdentifier = data.get("endpointIdentifier"); // Get the identifier from the form data
  const apiEndpoint = endpointMapping[endpointIdentifier];

  data.delete("endpointIdentifier");

  const apiResponse = await fetch(
    `${process.env.API_BASE_URL}${apiEndpoint}${id}/`,
    {
      method: "PATCH",
      body: data,
    }
  );

  const result = await apiResponse.json();
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request) {
  const data = await request.formData();
  const id = data.get("id");

  const endpointIdentifier = data.get("endpointIdentifier"); // Get the identifier from the form data
  const apiEndpoint = endpointMapping[endpointIdentifier];

  data.delete("endpointIdentifier");

  const apiResponse = await fetch(
    `${process.env.API_BASE_URL}${apiEndpoint}${id}/`,
    {
      method: "DELETE",
      body: data,
    }
  );

  const result = await apiResponse.json();
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
