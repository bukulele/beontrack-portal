export const dynamic = "force-dynamic";
export const revalidate = 0;

const payrollManager =
  process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER;

export async function PATCH(request, { params }) {
  const userId = params.userId; // Retrieving the user ID from the URL parameter
  const userRolesHeader = request.headers.get("x-user-roles"); // Retrieve the roles header
  const userRoles = userRolesHeader ? JSON.parse(userRolesHeader) : []; // Parse roles into an array

  const data = await request.formData(); // Assuming the client sends FormData

  // Check if the user has the payrollManager role
  if (!userRoles.includes(payrollManager)) {
    // If the user doesn't have the payrollManager role, delete the "rate" field
    data.delete("rate");
  }

  // Sending the request to the external API with the user ID in the URL
  const apiResponse = await fetch(
    `${process.env.API_BASE_URL}${process.env.API_OFFICE_EMPLOYEES_URL}${userId}/`,
    {
      method: "PATCH",
      body: data,
    }
  );

  if (!apiResponse.ok) {
    // Handle non-2xx HTTP responses
    const errorDetails = await apiResponse.json();
    return new Response(
      JSON.stringify({
        error: `External API error: ${apiResponse.status}`,
        details: errorDetails,
      }),
      {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const result = await apiResponse.json();
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
