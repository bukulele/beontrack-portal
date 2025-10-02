import formatDate from "./formatDate";
import findHighestIdObject from "./findHighestIdObject";

function defineDateBlock(data) {
  let expiryDate =
    formatDate(findHighestIdObject(data).expiration_date) ||
    formatDate(findHighestIdObject(data).expiry_date);
  let issueDate = formatDate(findHighestIdObject(data).issue_date);

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
