const endpointMapping = {
  driver_photo: process.env.API_DRIVER_PHOTO_ENDPOINT,
  licenses: process.env.API_DRIVER_LICENSES_ENDPOINT,
  immigration_doc: process.env.API_IMMIGRATION_DOC_ENDPOINT,
  abstracts: process.env.API_DRIVER_ABSTRACTS_ENDPOINT,
  tdg_cards: process.env.API_TRANSPORTATION_DANGEROUS_GOODS_CARDS_ENDPOINT,
  good_to_go_cards: process.env.API_GOOD_TO_GO_CARDS_ENDPOINT,
  lcv_certificates: process.env.API_LCV_CERTIFICATES_ENDPOINT,
  lcv_licenses: process.env.API_LCV_LICENSES_ENDPOINT,
  winter_courses: process.env.API_WINTER_COURSES_ENDPOINT,
  pdic_certificates: process.env.API_PDIC_CERTIFICATES_ENDPOINT,
  abstract_request_forms: process.env.API_ABSTRACT_REQUEST_FORMS_ENDPOINT,
  criminal_records: process.env.API_CRIMINAL_RECORD_SCANS_ENDPOINT,
  log_books: process.env.API_LOG_BOOKS_HISTORIES_ENDPOINT,
  annual_performance_reviews:
    process.env.API_ANNUAL_DRIVER_PERFORMANCE_REVIEWS_ENDPOINT,
  driver_memos: process.env.API_DRIVER_MEMOS_ENDPOINT,
  driver_statements: process.env.API_DRIVER_STATEMENTS_ENDPOINT,
  certificates_of_violations:
    process.env.API_CERTIFICATE_OF_VIOLATIONS_ENDPOINT,
  passports: process.env.API_PASSPORT_SCANS_ENDPOINT,
  us_visas: process.env.API_US_VISA_SCANS_ENDPOINT,
  activity_history: process.env.API_DRIVER_ACTIVITY_HISTORY_ENDPOINT,
  consents: process.env.API_CONSENTS_ENDPOINT,
  reference_checks: process.env.API_REFERENCE_CHECKS_ENDPOINT,
  mentor_forms: process.env.API_MENTOR_FORMS_ENDPOINT,
  employment_contracts: process.env.API_EMPLOYMENT_CONTRACTS_ENDPOINT,
  driver_prescreenings: process.env.API_PRE_SCREENINGS_ENDPOINT,
  gtg_quizes: process.env.API_GTG_QUIZZES_ENDPOINT,
  knowledge_tests: process.env.API_KNOWLEDGE_TESTS_ENDPOINT,
  road_tests: process.env.API_ROAD_TEST_SCANS_ENDPOINT,
  other_documents: process.env.API_OTHER_DOCUMENTS_ENDPOINT,
  sin: process.env.API_SIN_ENDPOINT,
  void_check: process.env.API_VOID_CHECK_ENDPOINT,
  tax_papers: process.env.API_TAX_PAPERS_ENDPOINT,
  incorp_docs: process.env.API_INCORP_DOCS_ENDPOINT,
  gst_docs: process.env.API_GST_REGISTRATION_ENDPOINT,
  driver_rates: process.env.API_DRIVER_RATES_ENDPOINT,
  driver_background: process.env.API_DRIVER_BACKGROUND_ENDPOINT,
  prehire_quizes: process.env.API_PRE_HIRE_QUIZZES_ENDPOINT,
  truck_license_plates: process.env.API_TRUCK_PLATES_ENDPOINT,
  truck_safety_docs: process.env.API_TRUCK_SAFETY_DOCS_ENDPOINT,
  truck_registration_docs: process.env.API_TRUCK_REGISTRATION_DOCS_ENDPOINT,
  truck_bill_of_sales: process.env.API_TRUCK_BILL_OF_SALES_DOCS_ENDPOINT,
  truck_other_documents: process.env.API_TRUCK_OTHER_DOCS_ENDPOINT,
  equipment_license_plates: process.env.API_EQUIPMENT_PLATES_ENDPOINT,
  equipment_safety_docs: process.env.API_EQUIPMENT_SAFETY_DOCS_ENDPOINT,
  equipment_registration_docs:
    process.env.API_EQUIPMENT_REGISTRATION_DOCS_ENDPOINT,
  equipment_bill_of_sales:
    process.env.API_EQUIPMENT_BILL_OF_SALES_DOCS_ENDPOINT,
  equipment_other_documents: process.env.API_EQUIPMENT_OTHER_DOCS_ENDPOINT,
  claim_documents: process.env.API_INCIDENTS_CLAIM_DOCS_ENDPOINT,
  violation_documents: process.env.API_VIOLATIONS_UPLOAD_DOCUMENTS,
  inspection_documents: process.env.API_VIOLATIONS_UPLOAD_INSPECTION_DOCUMENTS,
  ticket_documents: process.env.API_VIOLATIONS_UPLOAD_TICKET_DOCUMENTS,
  incident_documents: process.env.API_INCIDENT_UPLOAD_DOCUMENTS,
  wcbclaim_documents: process.env.API_WCB_UPLOAD_DOCUMENTS,
  ctpat_papers: process.env.API_DRIVER_CTPAT_PAPERS_ENDPOINT,
  ctpat_quiz: process.env.API_DRIVER_CTPAT_QUIZ_ENDPOINT,
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
