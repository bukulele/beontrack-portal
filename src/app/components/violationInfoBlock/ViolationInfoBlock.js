// import { useContext } from "react";
// import { ViolationContext } from "@/app/context/ViolationContext";

function ViolationInfoBlock({
  violationData,
  title,
  template,
  side,
  optional,
}) {
  // const { violationData } = useContext(ViolationContext);

  if (
    optional &&
    Object.values(template).every((item) => {
      return (
        violationData[item.key] === false ||
        violationData[item.key].length === 0
      );
    })
  ) {
    return null;
  }

  return (
    <div className="w-full border border-slate-300 shadow rounded-md overflow-clip">
      <div className="flex items-center justify-between w-full p-1 border-b border-slate-300 bg-slate-100">
        <p className="text-lg font-semibold">{title}</p>
        {side}
      </div>
      <div className="p-1">
        {Object.values(template).map((item, index) => {
          let text = violationData[item.key];

          if ("type" in item && item.type === "boolean") {
            text = text === true ? "Yes" : "No";
          }

          if ("type" in item && item.type === "selector") {
            text = item.data[text];
          }

          return (
            <div className="flex gap-1" key={`${item.key}_${index}`}>
              <p className="font-semibold w-1/3">{item.name}:</p>
              <p>{text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ViolationInfoBlock;
