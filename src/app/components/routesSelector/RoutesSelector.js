import React from "react";

function RoutesSelector({
  routes,
  label,
  updateState,
  disabled,
  checkAllFields,
}) {
  const handleRoutesChange = (event) => {
    const value = Number(event.target.value);
    const isChecked = event.target.checked;

    if (isChecked) {
      // Add the value to the array if checked
      updateState((prevFormData) => ({
        ...prevFormData,
        routes: [...prevFormData.routes, value],
      }));
    } else {
      // Remove the value from the array if unchecked
      updateState((prevFormData) => ({
        ...prevFormData,
        routes: prevFormData.routes.filter((item) => item !== value),
      }));
    }
  };

  return (
    <div>
      {label && (
        <p className="mb-0">
          {label}
          {checkAllFields !== undefined ? "*" : ""}
        </p>
      )}
      <div className="flex gap-3">
        <div className="flex gap-1 items-center">
          <input
            type="checkbox"
            id="option1"
            value="1"
            checked={routes.includes(1)}
            onChange={handleRoutesChange}
            disabled={disabled}
          />
          <label htmlFor="option1">CA HWY</label>
        </div>
        <div className="flex gap-1 items-center">
          <input
            type="checkbox"
            id="option2"
            value="2"
            checked={routes.includes(2)}
            onChange={handleRoutesChange}
            disabled={disabled}
          />
          <label htmlFor="option2">USA</label>
        </div>
        <div className="flex gap-1 items-center">
          <input
            type="checkbox"
            id="option3"
            value="3"
            checked={routes.includes(3)}
            onChange={handleRoutesChange}
            disabled={disabled}
          />
          <label htmlFor="option3">City</label>
        </div>
        <div className="flex gap-1 items-center">
          <input
            type="checkbox"
            id="option4"
            value="4"
            checked={routes.includes(4)}
            onChange={handleRoutesChange}
            disabled={disabled}
          />
          <label htmlFor="option4">Regional</label>
        </div>
      </div>
    </div>
  );
}

export default RoutesSelector;
