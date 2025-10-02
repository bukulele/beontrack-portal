function escapeCsvCell(cell) {
  if (cell == null) {
    return "";
  }
  const sc = cell.toString().trim();
  if (sc === "" || sc === '""') {
    return sc;
  }
  if (
    sc.includes('"') ||
    sc.includes(",") ||
    sc.includes("\n") ||
    sc.includes("\r")
  ) {
    return '"' + sc.replace(/"/g, '""') + '"';
  }
  return sc;
}

function makeCsvData(columns, data) {
  return data.reduce((csvString, rowItem) => {
    return (
      csvString +
      columns
        .map(({ accessor }) => escapeCsvCell(accessor(rowItem)))
        .join(",") +
      "\r\n"
    );
  }, columns.map(({ name }) => escapeCsvCell(name)).join(",") + "\r\n");
}

function downloadAsCsv(columns, data, filename) {
  const csvData = makeCsvData(columns, data);
  const csvFile = new Blob([csvData], { type: "text/csv" });
  const downloadLink = document.createElement("a");

  downloadLink.display = "none";
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export default downloadAsCsv;
