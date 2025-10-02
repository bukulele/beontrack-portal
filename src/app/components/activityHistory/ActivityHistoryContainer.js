import React, { useState, useEffect } from "react";
import ActivityHistory from "./ActivityHistory";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useLoader } from "@/app/context/LoaderContext";
import checkActivityPeriod from "@/app/functions/checkActivityPeriod";

function ActivityHistoryContainer({
  activityHistoryData,
  userId,
  closeActivityHistory,
  loadData,
  period,
  dataType,
}) {
  const ACTIVITY_HISTORY_TEMPLATE = {
    activity_type: "",
    description: "", // (DETAILS) OPTIONAL FOR ALL
    start_date: "", // EMPLOYED UNEMPLOYED SCHOOLING MILITARY
    end_date: "", // (till now) EMPLOYED UNEMPLOYED SCHOOLING MILITARY
    organization_name: "", // EMPLOYED (COMPANY) SCHOOLING (SCHOOL NAME)
    role_or_position: "", // EMPLOYED
    location: "", // EMPLOYED SCHOOLING MILITARY
    email_address: "", // EMPLOYED
    till_now: false,
  };

  const [activityHistory, setActivityHistory] = useState(
    activityHistoryData.map((item) => ({ ...item }))
  );

  const { startLoading, stopLoading } = useLoader();

  const addActivityHistoryBlock = () => {
    setActivityHistory([...activityHistory, { ...ACTIVITY_HISTORY_TEMPLATE }]);
  };

  const uploadActivityHistory = async () => {
    if (activityHistory.length > 0) {
      startLoading();
      for (const item of activityHistory) {
        if (!item) continue;
        const data = new FormData();

        let method;

        data.append(dataType, userId);
        data.append("endpointIdentifier", dataType);

        // Append each field of the object to the FormData
        for (const [key, value] of Object.entries(item)) {
          if (key === "end_date" && item.till_now) {
            data.append(`${key}`, "");
          } else {
            data.append(`${key}`, value);
          }
        }

        if (item.id && !item.delete) {
          method = "PATCH";
        } else if (!item.id && !item.delete) {
          method = "POST";
        } else if (item.delete) {
          method = "DELETE";
        }

        const response = await fetch("/api/activity-history", {
          method: method,
          body: data,
        });

        if (!response.ok) {
          throw new Error("A fetch request failed");
        }

        await response.json();
      }
      loadData();
      stopLoading();
      closeActivityHistory();
    }
  };

  useEffect(() => {
    setActivityHistory(activityHistoryData.map((item) => ({ ...item })));
  }, [activityHistoryData]);

  return (
    <div className="w-96 max-w-full p-2 space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 justify-start w-full pr-1">
            <p className="font-medium">{`Activity History (last ${period} years)`}</p>
            {checkActivityPeriod(activityHistory, period).length > 0 && (
              <Button
                tooltipId={"activityHistoryWarnTooltip"}
                tooltipContent={
                  <>
                    <p className="font-bold">Activity history gaps:</p>
                    {checkActivityPeriod(activityHistory, period).map(
                      (item, idx) => (
                        <p key={`activity_gaps_${idx}`}>
                          from {item.start} to {item.end}
                        </p>
                      )
                    )}
                  </>
                }
                content={
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="text-red-500 text-xl"
                  />
                }
                style={"warnButton"}
              />
            )}
          </div>
        </div>
      </div>
      {activityHistory.map((item, idx) => {
        return (
          item &&
          !item.delete && (
            <ActivityHistory
              key={`activityHistory_${idx}`}
              idx={idx}
              activityHistoryData={[...activityHistory]}
              activity_type={item.activity_type}
              description={item.description}
              start_date={item.start_date}
              end_date={item.end_date}
              organization_name={item.organization_name}
              role_or_position={item.role_or_position}
              location={item.location}
              email_address={item.email_address}
              till_now={item.till_now}
              updateState={setActivityHistory}
            />
          )
        );
      })}
      <div className="pb-5">
        <Button
          content={
            <div className="flex gap-1 items-center w-fit">
              <p className="m-0">Add entry</p>
              <FontAwesomeIcon icon={faPlus} size="1x" />
            </div>
          }
          style={"wideButton"}
          fn={addActivityHistoryBlock}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button
          style={"classicButton"}
          fn={closeActivityHistory}
          content={"Close"}
        />
        <Button
          style={"classicButton"}
          fn={uploadActivityHistory}
          content={"Save"}
          highlighted={true}
        />
      </div>
    </div>
  );
}

export default ActivityHistoryContainer;
