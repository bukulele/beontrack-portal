// app/api/send-change-log/route.js

export async function POST(request) {
  const requestBody = await request.json();
  const apiUrl = `${process.env.API_BASE_URL}${process.env.API_SEND_DRIVER_CHANGE_LOG_ENDPOINT}`;
  const apiResponse = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await apiResponse.json();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
