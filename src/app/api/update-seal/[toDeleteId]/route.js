// app/api/update-seal/[toDeleteId]/route.js
export const dynamic = "force-dynamic";
export const revalidate = 0;
import { NextResponse } from "next/server";

const JSON_HEADERS = { "Content-Type": "application/json" };

// Human-readable labels for known error keys
const ERROR_LABELS = {
  missing_seal_number_indexes: "Missing seal numbers at positions",
  duplicates_in_request: "Duplicate seal numbers in request",
  not_found: "Seal numbers not found",
  already_assigned: "Seal numbers already assigned",
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

// ---- helpers ----
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

export async function PATCH(request, { params }) {
  const toDeleteId = params.toDeleteId;
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_DRIVER_SEALS}${toDeleteId}/`;

  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest({ json: "Request body must be valid JSON." });
  }

  if (!(Array.isArray(body) || (body && typeof body === "object"))) {
    return badRequest({
      json: "Body must be an object or an array of objects.",
    });
  }

  try {
    const apiResponse = await fetch(apiUrl, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
    });

    // ★ if upstream failed, just relay whatever it returned (incl. { errors })
    if (!apiResponse.ok) {
      return await relayBackend(apiResponse); // ★
    }

    // success — pass through
    let payload;
    try {
      payload = await apiResponse.json();
    } catch {
      payload = {};
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (err) {
    const out = withHumanErrors({ network: err?.message || "Network error" });
    return new Response(JSON.stringify(out), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
