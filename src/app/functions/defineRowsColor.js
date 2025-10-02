function defineRowsColor(status) {
  let bg = "";

  switch (status) {
    case "TE":
      bg = "!bg-red-300";
      break;
    case "TL":
    case "LE":
      bg = "!bg-gray-100 !text-gray-400";
      break;
  }

  return bg;
}

export default defineRowsColor;
