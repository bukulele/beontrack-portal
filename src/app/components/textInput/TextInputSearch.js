import React, { useEffect, useState } from "react";

function TextInputSearch({
  name,
  label,
  value,
  placeholder,
  updateState,
  checkAllFields,
  disabled,
  mandatory,
  style,
  searchableData,
  searchableFields,
}) {
  const [fieldText, setFieldText] = useState("");
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChangeText = (event) => {
    const { value } = event.target;
    setFieldText(value);

    if (Object.keys(searchableData).length > 0 && value) {
      const filtered = Object.keys(searchableData).filter((key) =>
        searchableFields.some((field) =>
          searchableData[key][field]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        )
      );
      setFilteredKeys(filtered);
      setShowDropdown(filtered.length > 0);
    } else {
      updateState((prev) => {
        return typeof prev === "object" && prev !== null
          ? { ...prev, [name]: value }
          : value;
      });
      setShowDropdown(false);
    }
  };

  const handleSelect = (selectedKey) => {
    updateState((prev) => {
      return typeof prev === "object" && prev !== null
        ? { ...prev, [name]: selectedKey }
        : selectedKey;
    });
    setShowDropdown(false);
  };

  useEffect(() => {
    if (!value) return;

    setFieldText(searchableFields.map((item) => value[item]).join(" "));
  }, [value]);

  return (
    <div className="flex flex-col relative">
      {label && (
        <label htmlFor={name}>
          {label}
          {mandatory ? "*" : ""}
        </label>
      )}
      <input
        className={`rounded ${
          checkAllFields && mandatory && value.length === 0
            ? "border-pink-500"
            : "border-gray-300"
        } ${style === "small" ? "p-0" : ""}`}
        id={name}
        name={name}
        type={"text"}
        value={fieldText}
        onChange={handleChangeText}
        placeholder={placeholder}
        disabled={disabled}
      />
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 z-10 max-h-60 overflow-y-auto">
          {filteredKeys.map((key) => (
            <div
              key={key}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(key)}
            >
              {searchableFields.map((field) => (
                <span key={field}>{searchableData[key][field]} </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TextInputSearch;
