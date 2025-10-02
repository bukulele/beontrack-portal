// utils/getGlobalComparator.js
import { gridStringOrNumberComparator } from "@mui/x-data-grid-pro";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export default function globalComparator(v1, v2) {
  // booleans
  if (typeof v1 === "boolean" && typeof v2 === "boolean") {
    return v1 === v2 ? 0 : v1 ? 1 : -1; // asc
  }

  // numbers
  const n1 = Number(v1);
  const n2 = Number(v2);
  if (!isNaN(n1) && !isNaN(n2)) return n1 - n2;

  // empty values to the bottom
  if (v1 == null || v1 === "") return 1;
  if (v2 == null || v2 === "") return -1;

  // strings
  if (typeof v1 === "string" && typeof v2 === "string") {
    return collator.compare(v1, v2);
  }

  // fallback
  return gridStringOrNumberComparator(v1, v2);
}
