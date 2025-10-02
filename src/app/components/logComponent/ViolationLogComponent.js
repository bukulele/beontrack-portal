import React, { useState, useContext, useEffect, useRef } from "react";
import { useLoader } from "@/app/context/LoaderContext";
import Button from "../button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useVirtualizer } from "@tanstack/react-virtual";
import formatDate from "@/app/functions/formatDate";
import TextInput from "../textInput/TextInput";
import { useSession } from "next-auth/react";
import { ViolationContext } from "@/app/context/ViolationContext";
import moment from "moment-timezone";

function ViolationLogComponent() {
  const [violationLog, setViolationLog] = useState(null);
  const [newLogRecord, setNewLogRecord] = useState("");

  const { violationData, loadViolationData } = useContext(ViolationContext);
  const { startLoading, stopLoading } = useLoader();

  const { data: session } = useSession();

  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: violationLog?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const addLogRecord = () => {
    startLoading();
    const data = new FormData();
    data.append("updated_by", session.user.name);
    data.append("text", newLogRecord);
    data.append("violation", violationData.id);

    fetch("/api/update-violations-log", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        setNewLogRecord("");
        loadViolationData();
      })
      .finally(() => stopLoading())
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (!violationData) return;

    const dataToSet = violationData.updates_log.sort((a, b) => b.id - a.id);
    setViolationLog(dataToSet);
  }, [violationData]);

  return (
    violationData && (
      <div className="flex flex-col h-full gap-1">
        <div className="w-full flex items-end gap-2 px-5">
          <div className="w-full">
            <TextInput
              name={"add_log_text"}
              label={"Add log record"}
              value={newLogRecord}
              updateState={setNewLogRecord}
            />
          </div>
          <Button
            content={<FontAwesomeIcon icon={faPlus} />}
            style={"classicButton"}
            fn={addLogRecord}
            tooltipId={"add_log_record_button"}
            tooltipContent={"Add log record"}
            highlighted={newLogRecord.length !== 0}
            disabled={newLogRecord.length === 0}
          />
        </div>
        {violationLog && violationLog.length > 0 && (
          <>
            <p className="text-lg font-bold px-5 pt-5 pb-2">
              Violation&apos;s change log
            </p>
            <div className="flex gap-1 divide-x px-5">
              <div className="font-bold text-center w-1/6 px-1">
                <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                  Timestamp
                </p>
              </div>
              <div className="font-bold text-center w-1/4 px-1">
                <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                  Updated By
                </p>
              </div>
              <div className="font-bold text-center w-7/12 px-1">
                <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                  Text
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
                  const rowData = violationLog[virtualItem.index];
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
                      <div className="px-1 text-center w-1/6">
                        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                          {moment(rowData.timestamp).format(
                            "MMM DD YYYY, hh:mm"
                          ) || "_"}
                        </p>
                      </div>
                      <div className="px-1 text-center w-1/4">
                        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                          {rowData.updated_by || "_"}
                        </p>
                      </div>
                      <div className="px-1 text-center w-7/12">
                        <p className="text-xs whitespace-nowrap text-ellipsis overflow-hidden">
                          {rowData.text || "_"}
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

export default ViolationLogComponent;
