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
      {issueDate && issueDate.length > 0 && (
        <>
          <p className="text-right text-xs font-light text-slate-300">Issue date</p>
          <p className="text-right">{issueDate}</p>
        </>
      )}
      {expiryDate && expiryDate.length > 0 && (
        <>
          <p className="text-right text-xs font-light text-slate-300">Expiry date</p>
          <p className="text-right">{expiryDate}</p>
        </>
      )}
    </div>
  );
}

export default defineDateBlock;
