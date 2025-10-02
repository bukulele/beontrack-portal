import React, { useState, useEffect } from "react";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import { ACTIVITY_CHOICES } from "@/app/assets/tableData";

function ActivityHistory({
  idx,
  activityHistoryData,
  activity_type,
  description,
  start_date,
  end_date,
  organization_name,
  role_or_position,
  location,
  email_address,
  till_now,
  updateState,
  checkAllFields,
  disabled,
}) {
  const [activityType, setActivityType] = useState("");

  const handleEmploymentHistory = (event) => {
    const { name, value } = event.target;
    updateState((prevData) => {
      let newData = [...prevData];
      newData[idx][name] = value;
      return newData;
    });
  };

  const handleTillNow = (event) => {
    const { name, checked } = event.target;
    updateState((prevData) => {
      let newData = [...prevData];
      newData[idx][name] = checked;
      return newData;
    });
  };

  const removeEmploymentHistoryBlock = () => {
    updateState((prevData) => {
      let activityHistoryDataCleaned = [];
      let newData = [...prevData];
      if (newData[idx].id) {
        newData[idx].delete = true;
      } else {
        newData[idx] = null;
      }
      activityHistoryDataCleaned = newData.filter((value) => value !== null);
      return activityHistoryDataCleaned;
    });
  };

  useEffect(() => {
    if (activityType.length === 0) {
      return;
    }

    updateState((prevData) => {
      let newData = [...prevData];
      newData[idx].activity_type = activityType;

      return newData;
    });
  }, [activityType]);

  return (
    <div className="flex flex-col border shadow-inner rounded p-5">
      <div className="flex justify-end">
        <Button
          content={
            <div className="flex items-center gap-1">
              <p className="m-0 text-sm">Remove</p>
              <FontAwesomeIcon icon={faTrash} size="xs" />
            </div>
          }
          style={"smallButton"}
          fn={removeEmploymentHistoryBlock}
          disabled={disabled}
        />
      </div>
      <OptionsSelector
        value={activity_type}
        updateState={setActivityType}
        label={"Please, choose the type of activity"}
        name={"activity_type"}
        data={ACTIVITY_CHOICES}
        disabled={disabled}
        checkAllFields={checkAllFields}
        setDefault={true}
      />
      {(activity_type === "EMPLOYED" || activity_type === "SCHOOLING") && (
        <div className="flex flex-col">
          <label htmlFor={`organization_name_${idx}`}>
            {activity_type === "EMPLOYED" ? "Company " : "School "} Name
            {checkAllFields !== undefined ? "*" : ""}
          </label>
          <input
            className={`rounded ${
              checkAllFields && organization_name.length === 0
                ? "border-pink-500"
                : "border-gray-300"
            }`}
            id={`organization_name_${idx}`}
            name={`organization_name`}
            type={"text"}
            value={organization_name}
            onChange={handleEmploymentHistory}
            disabled={disabled}
          />
        </div>
      )}
      {activity_type === "EMPLOYED" && (
        <div className="flex flex-col">
          <label htmlFor={`role_or_position_${idx}`}>
            Job Title{checkAllFields !== undefined ? "*" : ""}
          </label>
          <input
            className={`rounded ${
              checkAllFields && role_or_position.length === 0
                ? "border-pink-500"
                : "border-gray-300"
            }`}
            id={`role_or_position_${idx}`}
            name={`role_or_position`}
            type={"text"}
            value={role_or_position}
            onChange={handleEmploymentHistory}
            disabled={disabled}
          />
        </div>
      )}
      <div className="flex flex-col">
        <label htmlFor={`start_date_${idx}`}>
          Start Date{checkAllFields !== undefined ? "*" : ""}
        </label>
        <input
          className={`rounded ${
            checkAllFields && start_date.length === 0
              ? "border-pink-500"
              : "border-gray-300"
          }`}
          id={`start_date_${idx}`}
          name={`start_date`}
          type={"date"}
          value={start_date}
          onChange={handleEmploymentHistory}
          disabled={disabled}
        />
      </div>
      <div className="flex gap-3 items-end">
        <div className="flex flex-col w-full">
          <label htmlFor={`end_date_${idx}`}>
            End Date{checkAllFields !== undefined ? "*" : ""}
          </label>
          <input
            className={`rounded ${
              checkAllFields && end_date.length === 0 && !till_now
                ? "border-pink-500"
                : "border-gray-300"
            }`}
            id={`end_date_${idx}`}
            name={`end_date`}
            type={"date"}
            value={end_date}
            onChange={handleEmploymentHistory}
            disabled={disabled || till_now}
          />
        </div>
        <div className="flex justify-end items-center mb-2">
          <input
            type="checkbox"
            id={`till_now_${idx}`}
            name="till_now"
            checked={till_now}
            onChange={handleTillNow}
            className="mr-2"
            disabled={disabled}
          />
          <label className="whitespace-nowrap" htmlFor={`till_now_${idx}`}>
            Till now
          </label>
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor={`description_${idx}`}>Description</label>
        <input
          className={`rounded border-gray-300`}
          id={`description_${idx}`}
          name={`description`}
          type={"text"}
          value={description}
          onChange={handleEmploymentHistory}
          disabled={disabled}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor={`location_${idx}`}>
          Location{checkAllFields !== undefined ? "*" : ""}
        </label>
        <input
          className={`rounded ${
            checkAllFields && location.length === 0
              ? "border-pink-500"
              : "border-gray-300"
          }`}
          id={`location_${idx}`}
          name={`location`}
          type={"text"}
          value={location}
          onChange={handleEmploymentHistory}
          disabled={disabled}
        />
      </div>
      {activity_type === "EMPLOYED" && (
        <div className="flex flex-col">
          <label htmlFor={`email_address_${idx}`}>
            Employer contact Email{checkAllFields !== undefined ? "*" : ""}
          </label>
          <input
            className={`rounded ${
              checkAllFields && email_address.length === 0
                ? "border-pink-500"
                : "border-gray-300"
            }`}
            id={`email_address_${idx}`}
            name={`email_address`}
            type={"email"}
            value={email_address}
            onChange={handleEmploymentHistory}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}

export default ActivityHistory;
