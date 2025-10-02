const endpointMapping = {
  employee_photo: process.env.API_EMPLOYEE_PHOTO_ENDPOINT,
  licenses: process.env.API_EMPLOYEE_LICENSES_ENDPOINT,
  immigration_doc: process.env.API_EMPLOYEE_IMMIGRATION_DOC_ENDPOINT,
  sin: process.env.API_EMPLOYEE_SIN_ENDPOINT,
  void_check: process.env.API_EMPLOYEE_VOID_CHECK_ENDPOINT,
  passports: process.env.API_EMPLOYEE_PASSPORT_SCANS_ENDPOINT,
  us_visas: process.env.API_EMPLOYEE_US_VISA_SCANS_ENDPOINT,
  consents: process.env.API_EMPLOYEE_CONSENTS_ENDPOINT,
  employment_contracts: process.env.API_EMPLOYEE_EMPLOYMENT_CONTRACTS_ENDPOINT,
  abstract_request_forms:
    process.env.API_EMPLOYEE_ABSTRACT_REQUEST_FORMS_ENDPOINT,
  employee_memos: process.env.API_EMPLOYEE_MEMOS_ENDPOINT,
  tax_papers: process.env.API_EMPLOYEE_TAX_PAPERS_ENDPOINT,
  other_documents: process.env.API_EMPLOYEE_OTHER_DOCUMENTS_ENDPOINT,
  id_documents: process.env.API_OFFICE_ID_DOCUMENT_ENDPOINT,
  activity_history: process.env.API_EMPLOYEE_ACTIVITY_HISTORY_ENDPOINT,
  employee_resumes: process.env.API_EMPLOYEE_RESUMES_ENDPOINT,
  employee_ctpat_papers: process.env.API_OFFICE_CTPAT_PAPERS_ENDPOINT,
};

export async function POST(request) {
  const data = await request.formData(); // Assuming you're sending FormData
  const endpointIdentifier = data.get("endpointIdentifier"); // Get the identifier from the form data

  // Get the corresponding API endpoint from the mapping
  const apiEndpoint = endpointMapping[endpointIdentifier];
  if (!apiEndpoint) {
    return new Response(
      JSON.stringify({ error: "Invalid API endpoint identifier" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Construct the API URL
  const apiUrl = `${process.env.API_BASE_URL}${apiEndpoint}`;

  // Remove the identifier field from the FormData before forwarding the request
  data.delete("endpointIdentifier");

  // Fetch data to the external API
  const apiResponse = await fetch(apiUrl, {
    method: "POST",
    body: data,
  });

  if (!apiResponse.ok) {
    return new Response(JSON.stringify({ error: "Failed to process" }), {
      status: apiResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await apiResponse.json();
  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { endpointIdentifier, id, username } = body;

    if (!endpointIdentifier || !id) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiEndpoint = endpointMapping[endpointIdentifier];
    if (!apiEndpoint) {
      return new Response(
        JSON.stringify({ error: "Invalid API endpoint identifier" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiUrl = `${process.env.API_BASE_URL}${apiEndpoint}${id}/`;

    const apiResponse = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });

    if (!apiResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to delete" }), {
        status: apiResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to parse request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { endpointIdentifier, id } = body;

    if (!endpointIdentifier || !id) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiEndpoint = endpointMapping[endpointIdentifier];
    if (!apiEndpoint) {
      return new Response(
        JSON.stringify({ error: "Invalid API endpoint identifier" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiUrl = `${process.env.API_BASE_URL}${apiEndpoint}${id}/`;

    delete body.endpointIdentifier;
    delete body.id;

    const apiResponse = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!apiResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to update" }), {
        status: apiResponse.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await apiResponse.json();
    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to parse request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
