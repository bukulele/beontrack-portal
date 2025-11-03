import formatDate from "./formatDate";

function defineDateBlock(data) {
  // Prisma structure: dates are in metadata JSONB field
  const metadata = data?.metadata || {};

  let expiryDate =
    formatDate(metadata.expiryDate) ||
    formatDate(metadata.expiration_date) ||
    formatDate(metadata.expiry_date);

  let issueDate =
    formatDate(metadata.issueDate) ||
    formatDate(metadata.issue_date);

  return (
    <div className="w-fit ml-auto">
      <p className="text-right text-xs font-light text-slate-300">
        {expiryDate && expiryDate.length > 0
          ? "Expiry date"
          : issueDate && issueDate.length > 0
          ? "Issue date"
          : ""}
      </p>
      <p className="text-right">
        {expiryDate && expiryDate.length > 0
          ? expiryDate
          : issueDate && issueDate.length > 0
          ? issueDate
          : ""}
      </p>
    </div>
  );
}

export default defineDateBlock;
