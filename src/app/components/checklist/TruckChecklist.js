import React, { useContext, useEffect, useState } from "react";
import { TruckContext } from "@/app/context/TruckContext";
import CheckListField from "../checklistField/CheckListField";
import Button from "../button/Button";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import { useLoader } from "@/app/context/LoaderContext";
import NumericInput from "../numericInput/NumericInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle } from "@fortawesome/free-solid-svg-icons";
import CheckListFieldFrame from "../checklistField/CheckListFieldFrame";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import TextInput from "../textInput/TextInput";
import TextareaInput from "../textareaInput/TextareaInput";

function TruckChecklist({
  fieldsTemplateSettings,
  filesTemplate,
  apiEndpoint,
}) {
  const [allChecked, setAllChecked] = useState(false);
  const [customData, setCustomData] = useState({
    unit_number: "",
    make: "",
    model: "",
    vin: "",
    year: "",
    terminal: "",
    value_in_cad: "",
    vehicle_type: "",
    owned_by: "",
    remarks: "",
  });

  const { truckData, loadData } = useContext(TruckContext);

  const { startLoading, stopLoading } = useLoader();

  const handleStatusChange = (status) => {
    startLoading();

    const data = new FormData();

    data.append("status", status);

    fetch(`${apiEndpoint}/${truckData.id}`, {
      method: "PATCH",
      body: data,
    }).then((response) => {
      stopLoading();
      if (response.ok) {
        loadData();
      }
    });
  };

  const handleCustomFieldSave = (field) => {
    startLoading();

    const data = new FormData();
    data.append(field, customData[field]);

    fetch(`${apiEndpoint}/${truckData.id}`, {
      method: "PATCH",
      body: data,
    }).then((response) => {
      stopLoading();
      if (response.ok) {
        loadData();
      }
    });
  };

  const createFieldsList = () => {
    return Object.values(fieldsTemplateSettings).map((item, index) => {
      let field = null;
      let name = item.key;
      let label = item.name;

      if (item.type === "text") {
        field = (
          <TextInput
            name={name}
            value={customData[item.key]}
            updateState={setCustomData}
            mandatory={item.mandatory}
            style="small"
          />
        );
      }

      if (item.type === "number") {
        field = (
          <NumericInput
            name={name}
            value={customData[item.key]}
            updateState={setCustomData}
            mandatory={item.mandatory}
            style="small"
          />
        );
      }

      if (item.type === "selector") {
        field = (
          <OptionsSelector
            name={name}
            value={customData[item.key]}
            updateState={setCustomData}
            mandatory={item.mandatory}
            data={item.data}
            setDefault={!!item.setDefault}
            style="small"
          />
        );
      }

      if (item.type === "textarea") {
        field = (
          <TextareaInput
            name={name}
            value={customData[item.key]}
            updateState={setCustomData}
            mandatory={item.mandatory}
            style="small"
          />
        );
      }
      return (
        <CheckListFieldFrame
          key={`${item.key}_${index}`}
          fieldName={`${label}:`}
        >
          {field}
          {customData[name] !== truckData[name] && (
            <Button
              style={"iconButton"}
              fn={() => handleCustomFieldSave(name)}
              content={<FontAwesomeIcon icon={faCheck} />}
              tooltipContent={"Save"}
              tooltipId={`save_new_${name}_tooltip`}
            />
          )}
          {truckData[name].length === 0 && item.mandatory && (
            <div className="flex items-center justify-center self-center">
              <FontAwesomeIcon
                icon={faCircle}
                className="text-red-600 text-xs"
              />
            </div>
          )}
        </CheckListFieldFrame>
      );
    });
  };

  const createFilesFieldsList = () => {
    return Object.values(filesTemplate).map((settings) => {
      return (
        <CheckListField
          dataId={truckData.id}
          loadData={loadData}
          value={truckData[settings.key]}
          key={`checklist_field_${settings.key}`}
          settings={settings}
          dataType="truck"
          apiRoute={"/api/update-file"}
        />
      );
    });
  };

  useEffect(() => {
    if (!truckData) return;

    for (let key in customData) {
      setCustomData((prevData) => {
        return { ...prevData, [key]: truckData[key] };
      });
    }
  }, [truckData]);

  useEffect(() => {
    if (!truckData) return;
    let ready = true;

    for (let value of Object.values(filesTemplate)) {
      if (!findHighestIdObject(truckData[value.key]).was_reviewed) {
        ready = false;
        break;
      }
    }

    setAllChecked(ready);
  }, [truckData]);

  useEffect(() => {
    if (!truckData) return;
    let ready = true;

    for (let value of Object.values(filesTemplate)) {
      if (
        !findHighestIdObject(truckData[value.key]).was_reviewed &&
        !value.optional
      ) {
        ready = false;
        break;
      }
    }

    for (let key in customData) {
      if (
        findHighestIdObject(truckData[key]).length === 0 &&
        fieldsTemplateSettings[key].mandatory
      ) {
        ready = false;
        break;
      }
    }

    setAllChecked(ready);
  }, [truckData]);

  return (
    truckData && (
      <>
        <div className="w-full overflow-y-scroll flex-auto pb-5">
          {createFieldsList()}
          {createFilesFieldsList()}
        </div>
        {truckData.status === "NW" && (
          <div className="flex gap-3 justify-end items-center p-3">
            <Button
              content={"Set To Active"}
              style={"classicButton"}
              fn={() => handleStatusChange("AC")}
              disabled={!allChecked}
              tooltipId={"set_to_active_button_tooltip"}
              tooltipContent={
                !allChecked && <p>Please check all documents first</p>
              }
            />
          </div>
        )}
      </>
    )
  );
}

export default TruckChecklist;
