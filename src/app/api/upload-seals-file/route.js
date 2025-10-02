export const dynamic = "force-dynamic";
export const revalidate = 0;

const JSON_HEADERS = { "Content-Type": "application/json" };

// Human-readable labels for known error keys
const ERROR_LABELS = {
  existing_in_db: "Seal numbers already exist",
  duplicates_in_csv: "Duplicate seal numbers in CSV",
  csv: "CSV format error",
  file: "File error",
  detail: "Error",
  network: "Network error",
  json: "JSON error",
};

// Build a human readable payload while preserving machine-readable `errors`
function withHumanErrors(errors) {
  const messages = [];
  const readable = {};

  Object.entries(errors ?? {}).forEach(([key, value]) => {
    const label = ERROR_LABELS[key] ?? key.replace(/_/g, " ");
    let pretty;
    if (typeof value === "string") {
      pretty = value;
    } else if (Array.isArray(value)) {
      pretty = value
        .map((v) =>
          typeof v === "string"
            ? v
            : typeof v === "number"
            ? String(v)
            : JSON.stringify(v)
        )
        .join(", ");
    } else if (value && typeof value === "object") {
      pretty = JSON.stringify(value);
    } else {
      pretty = String(value);
    }
    messages.push(`${label}: ${pretty}`);
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    readable[camel] = { label, value };
  });

  return {
    errors: errors ?? {},
    error_messages: messages,
    errors_human: readable,
  };
}

// Helpers
const badRequest = (errors) =>
  new Response(JSON.stringify(withHumanErrors(errors)), {
    status: 400,
    headers: JSON_HEADERS,
  });

const relayBackend = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    const out = withHumanErrors({
      detail: "Upstream error without JSON body.",
    });
    return new Response(JSON.stringify(out), {
      status: res.status,
      headers: JSON_HEADERS,
    });
  }

  if (data && typeof data === "object" && data.errors) {
    const out = withHumanErrors(data.errors);
    return new Response(JSON.stringify(out), {
      status: res.status,
      headers: JSON_HEADERS,
    });
  }

  const out = withHumanErrors(data ?? { detail: "Request failed." });
  return new Response(JSON.stringify(out), {
    status: res.status,
    headers: JSON_HEADERS,
  });
};

export async function POST(request) {
  // Parse form-data; ensure there's a 'file' field
  let form;
  try {
    form = await request.formData();
  } catch {
    return badRequest({
      file: "Body must be multipart/form-data with a 'file' field.",
    });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return badRequest({ file: "CSV file is required in the 'file' field." });
  }

  try {
    const apiResponse = await fetch(
      `${process.env.API_BASE_URL}${process.env.API_UPLOAD_SEALS_FILE}`,
      {
        method: "POST",
        body: form, // keep multipart boundary intact
      }
    );

    if (!apiResponse.ok) {
      return await relayBackend(apiResponse);
    }

    const result = await apiResponse.json();
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const out = withHumanErrors({ network: err?.message || "Network error" });
    return new Response(JSON.stringify(out), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
