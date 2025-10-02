import React, { useState, useContext, useEffect, useMemo } from "react";
import TextareaInput from "../textareaInput/TextareaInput";
import { useLoader } from "@/app/context/LoaderContext";
import { DriverContext } from "@/app/context/DriverContext";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import DateInput from "../dateInput/DateInput";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { DRIVER_LOG_COLUMNS } from "@/data/tables/drivers";

function DriverLogComponent() {
  const [customDriverData, setCustomDriverData] = useState({
    status_note: "",
    remarks_comments: "",
    reason_for_leaving: "",
    date_of_leaving: "",
  });
  const [driverLog, setDriverLog] = useState([]);

  const rows = useMemo(
    () =>
      driverLog?.map((row) => ({
        id: row.id,
        ...row,
      })) ?? [],
    [driverLog]
  );

  const { userData, loadData } = useContext(DriverContext);
  const { startLoading, stopLoading } = useLoader();

  const handleCustomFieldSave = (field) => {
    startLoading();

    const data = new FormData();

    if (field === "routes") {
      customDriverData[field].forEach((id) => {
        data.append(field, id);
      });
    } else {
      data.append(field, customDriverData[field]);
    }

    fetch(`/api/upload-driver-data/${userData.id}`, {
      method: "PATCH",
      body: data,
    }).then((response) => {
      stopLoading();
      if (response.ok) {
        loadData();
      }
    });
  };

  const loadDriverLog = () => {
    fetch(`/api/get-driver-log/${userData.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 403) {
          return response.json().then((data) => {
            router.push("/no-access-section");
            throw new Error(data.message);
          });
        }
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      })
      .then((data) => {
        const dataToSet = data
          // .filter((item) => item.driver === userData.id)
          .sort((a, b) => b.id - a.id);
        setDriverLog(dataToSet);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    if (!userData) return;

    loadDriverLog();
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    for (let key in customDriverData) {
      setCustomDriverData((prevData) => {
        return { ...prevData, [key]: userData[key] };
      });
    }
  }, [userData]);

  return (
    userData && (
      <div
        style={{ height: "calc(100% - 80px)" }}
        className="flex flex-col gap-1 px-5"
      >
        <div className="flex flex-col mb-2 shrink-0">
          {Object.keys(customDriverData).map((key, index) => {
            const labels = {
              status_note: "Status Note",
              remarks_comments: "Remarks",
              reason_for_leaving: "Reason For Leaving",
              date_of_leaving: "Leaving Date",
            };

            return (
              <div key={`log_${key}_${index}`} className="flex gap-1 items-end">
                {key === "date_of_leaving" ? (
                  <DateInput
                    label={labels[key]}
                    name={"date_of_leaving"}
                    value={customDriverData[key]}
                    updateState={setCustomDriverData}
                    style="minimalistic"
                  />
                ) : (
                  <TextareaInput
                    name={key}
                    label={labels[key]}
                    value={customDriverData[key]}
                    updateState={setCustomDriverData}
                    style={"compact"}
                  />
                )}
                {customDriverData[key] !== userData[key] && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave(key)}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_${key}_tooltip`}
                  />
                )}
              </div>
            );
          })}
          <p className="text-lg font-bold pt-2">Driver&#39;s change log</p>
        </div>
        {/* The scrollable element for your list */}
        {driverLog && driverLog.length > 0 && (
          <DataGridPro
            rows={rows}
            columns={DRIVER_LOG_COLUMNS}
            density="compact" // keeps row height similar to your 35 px estimate
            disableRowSelectionOnClick // optional: no checkbox column
            disableColumnMenu
            hideFooter
            className="flex-1 min-h-0" /* flex-grow + allowed to shrink */
            sx={{
              "--DataGrid-minHeight": "0px",
            }} /* removes built-in 400 px floor */
          />
        )}
      </div>
    )
  );
}

export default DriverLogComponent;
