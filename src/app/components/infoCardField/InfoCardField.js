import React from "react";
import moment from "moment-timezone";

function InfoCardField({ label, value, side, valueType }) {
  return (
    <div className="flex gap-2 w-full items-center border-b-2 border-dotted border-slate-300 py-1">
      <p className="w-40 shrink-0 font-semibold">{label}:</p>
      <div className="grow">
        {valueType === "date_time"
          ? moment(value).format("MMMM Do YYYY, hh:mm:ss")
          : value}
      </div>
      <div className="flex gap-1">{side}</div>
    </div>
  );
}

export default InfoCardField;
