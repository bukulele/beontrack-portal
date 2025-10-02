function CheckListFieldFrame({ fieldName, children, optional }) {
  return (
    <div className="flex hover:bg-slate-100 border-dotted border-b-2 border-slate-300 py-1 px-2">
      <div className="flex items-center cursor-pointer w-full">
        <div
          className={`font-semibold whitespace-nowrap w-2/5 ${
            optional ? "text-slate-400" : ""
          }`}
        >
          {fieldName}
        </div>
        <div className="flex gap-1 items-center">{children}</div>
      </div>
    </div>
  );
}

export default CheckListFieldFrame;
