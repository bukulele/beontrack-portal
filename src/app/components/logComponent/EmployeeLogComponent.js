import React, { useState, useContext, useEffect, useRef } from "react";
import TextareaInput from "../textareaInput/TextareaInput";
import { useLoader } from "@/app/context/LoaderContext";
import { EmployeeContext } from "@/app/context/EmployeeContext";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useVirtualizer } from "@tanstack/react-virtual";
// import formatDate from "@/app/functions/formatDate";
import DateInput from "../dateInput/DateInput";
import moment from "moment-timezone";
import { useSession } from "next-auth/react";

function EmployeeLogComponent() {
  const [customEmployeeData, setCustomEmployeeData] = useState({
    status_note: "",
    remarks_comments: "",
    reason_for_leaving: "",
    date_of_leaving: "",
  });
  const [employeeLog, setEmployeeLog] = useState(null);

  const { userData, loadEmployeeData } = useContext(EmployeeContext);
  const { startLoading, stopLoading } = useLoader();
  const { data: session } = useSession();

  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: employeeLog?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const handleCustomFieldSave = (field) => {
    startLoading();

    const data = new FormData();

    if (field === "routes") {
      customEmployeeData[field].forEach((id) => {
        data.append(field, id);
      });
    } else {
      data.append(field, customEmployeeData[field]);
    }

    data.append("changed_by", session.user.name);

    fetch(`/api/upload-employee-data/${userData.id}`, {
      method: "PATCH",
      body: data,
    }).then((response) => {
      stopLoading();
      if (response.ok) {
        loadEmployeeData();
      }
    });
  };

  const loadEmployeeLog = () => {
    fetch(`/api/get-employee-log/${userData.id}`, {
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
          // .filter((item) => item.employee === userData.id)
          .sort((a, b) => b.id - a.id);
        setEmployeeLog(dataToSet);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    if (!userData) return;

    loadEmployeeLog();
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    for (let key in customEmployeeData) {
      setCustomEmployeeData((prevData) => {
        return { ...prevData, [key]: userData[key] };
      });
    }
  }, [userData]);

  return (
    userData && (
      <div className="flex flex-col flex-1 h-3/4 gap-1 ">
        {Object.keys(customEmployeeData).map((key, index) => {
          const labels = {
            status_note: "Status Note",
            remarks_comments: "Remarks",
            reason_for_leaving: "Reason For Leaving",
            date_of_leaving: "Leaving Date",
          };

          return (
            <div
              key={`log_${key}_${index}`}
              className="flex gap-1 items-end px-5"
            >
              {key === "date_of_leaving" ? (
                <DateInput
                  label={labels[key]}
                  name={"date_of_leaving"}
                  value={customEmployeeData[key]}
                  updateState={setCustomEmployeeData}
                  style="minimalistic"
                />
              ) : (
                <TextareaInput
                  name={key}
                  label={labels[key]}
                  value={customEmployeeData[key]}
                  updateState={setCustomEmployeeData}
                  style={"compact"}
                />
              )}
              {customEmployeeData[key] !== userData[key] && (
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
        {/* The scrollable element for your list */}
        {employeeLog && employeeLog.length > 0 && (
          <>
            <p className="text-lg font-bold px-5 pt-5 pb-2">
              employee&apos;s change log
            </p>
            <div className="flex gap-1 divide-x pl-5 pr-9">
              <div className="font-bold text-center w-1/4 px-1">
                <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                  Field Name
                </p>
              </div>
              <div className="font-bold text-center w-1/6 px-1">
                <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                  Old Value
                </p>
              </div>
              <div className="font-bold text-center w-1/6 px-1">
                <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                  New Value
                </p>
              </div>
              <div className="font-bold text-center w-1/4 px-1">
                <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                  Changed By
                </p>
              </div>
              <div className="font-bold text-center w-1/6 px-1">
                <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                  Timestamp
                </p>
              </div>
            </div>
            <div
              ref={parentRef}
              className="flex-grow px-5"
              style={{
                overflow: "auto",
              }}
            >
              {/* The large inner element to hold all of the items */}
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {/* Only the visible items in the virtualizer, manually positioned to be in view */}
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const rowData = employeeLog[virtualItem.index];
                  return (
                    <div
                      key={virtualItem.key}
                      className="gap-1 divide-x border-dotted border-b-2 border-slate-300 flex items-center"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <div className="px-1 text-center w-1/4">
                        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                          {rowData.field_name || "_"}
                        </p>
                      </div>
                      <div className="px-1 text-center w-1/6">
                        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                          {rowData.old_value || "_"}
                        </p>
                      </div>
                      <div className="px-1 text-center w-1/6">
                        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                          {rowData.new_value || "_"}
                        </p>
                      </div>
                      <div className="px-1 text-center w-1/4">
                        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                          {rowData.changed_by || "_"}
                        </p>
                      </div>
                      <div className="px-1 text-center w-1/6">
                        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                          {moment(rowData.timestamp).format(
                            "DD MMM YYYY, hh:mm"
                          ) || "_"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    )
  );
}

export default EmployeeLogComponent;
