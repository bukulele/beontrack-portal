export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET(request, { params }) {
  const employeeId = params.employeeId;

  const apiUrl = `${process.env.API_BASE_URL}/${process.env.API_GET_EMPLOYEE_PDF_CARD}${employeeId}`;

  try {
    const apiResponse = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/pdf", // Assuming the API directly sends a PDF
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!apiResponse.ok) {
      throw new Error("Failed to fetch PDF");
    }

    // Extract the filename from the Content-Disposition header
    const contentDisposition = apiResponse.headers.get("Content-Disposition");
    let fileName = `4Tracks_employee_card_${employeeId}.pdf`;

    if (contentDisposition && contentDisposition.includes("filename=")) {
      const match = contentDisposition.match(/filename="(.+?)"/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }
    // Forward the PDF content directly to the client
    const pdfBuffer = await apiResponse.arrayBuffer(); // Get the PDF data as a buffer
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  }
}
