// app/api/update-seals/[driverId]/route.js
export const dynamic = "force-dynamic";
export const revalidate = 0;

const JSON_HEADERS = { "Content-Type": "application/json" };

// ---- helpers ----

const relayBackend = async (res) => {
  let data;
  try {
    data = await res.json();
  } catch {
    data = { errors: { detail: "Upstream error without JSON body." } };
  }

  // If upstream already provides { errors: {...} }, pass it through.
  if (data && typeof data === "object" && data.errors) {
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: JSON_HEADERS,
    });
  }

  // Otherwise wrap the whole payload under { errors: ... }
  return new Response(
    JSON.stringify({ errors: data ?? { detail: "Request failed." } }),
    {
      status: res.status,
      headers: JSON_HEADERS,
    }
  );
};

export async function GET(request) {
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_GET_DRIVER_SEALS}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      method: "GET",
      headers: JSON_HEADERS,
    });

    // ★ if upstream failed, relay its JSON/errors untouched
    if (!apiResponse.ok) {
      return await relayBackend(apiResponse); // ★
    }

    let payload;
    try {
      payload = await apiResponse.json();
    } catch {
      payload = null;
    }

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ errors: { network: err?.message || "Network error" } }),
      { status: 502, headers: JSON_HEADERS }
    );
  }
}
