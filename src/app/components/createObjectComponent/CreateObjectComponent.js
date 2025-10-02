import { useEffect, useState, useContext, useMemo } from "react";
import NumericInput from "../numericInput/NumericInput";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import TextareaInput from "../textareaInput/TextareaInput";
import TextInput from "../textInput/TextInput";
import Button from "../button/Button";
import DateTimeInput from "../dateInput/DateTimeInput";
import { TrucksDriversContext } from "@/app/context/TrucksDriversContext";
import TextInputSearch from "../textInput/TextInputSearch";
import { useCreateObject } from "@/app/context/CreateObjectContext";
import { OBJECT_TYPES } from "@/app/assets/tableData";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MapModalContainer from "../modalContainer/MapModalContainer";
import dynamic from "next/dynamic";
import { DriverReportsListContext } from "@/app/context/DriverReportsListContext";
import moment from "moment-timezone";
import { useSession } from "next-auth/react";
import DateInput from "../dateInput/DateInput";
import defineMinDate from "@/app/functions/defineMinDate";
import PhoneNumberInput from "../phoneNumberInput/PhoneNumberInput";
import PostalCodeInput from "../postalCodeInput/PostalCodeInput";
import EmailInput from "../emailInput/EmailInput";
import testEmail from "@/app/functions/testEmail";
import InfoMessageModalContainer from "../modalContainer/InfoMessageModalContainer";
import useUserRoles from "@/app/functions/useUserRoles";
import RadioOptionsSelector from "../radioOptionsSelector/RadioOptionsSelector";
import { HiredEmployeesContext } from "@/app/context/HiredEmployeesContext";

const MapComponent = dynamic(() => import("../mapComponent/MapComponent"), {
  ssr: false,
});

function CreateObjectComponent({
  createObjectApi,
  objectTemplate,
  objectTemplateSettings,
}) {
  const [objectData, setObjectData] = useState(objectTemplate);
  const [initialFormData, setInitialFormData] = useState(objectTemplate);
  const [checkAllFields, setCheckAllFields] = useState(false);
  const [formDataReady, setFormDataReady] = useState(false);
  const [initialCoordinates, setInitialCoordinates] = useState("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [emailIsCorrect, setEmailCorrect] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState({
    show: false,
    message: "",
  });

  const { hiredDriversList, activeTrucksList } =
    useContext(TrucksDriversContext);
  const { driverReportsList } = useContext(DriverReportsListContext);
  const { hiredEmployeesList } = useContext(HiredEmployeesContext);

  const {
    handleCreateObjectModalClose,
    serverData,
    objectType,
    afterCreateCallback,
    updateObject,
  } = useCreateObject();

  const { data: session } = useSession();

  const userRoles = useUserRoles();

  const saveObject = () => {
    let method = updateObject ? "PATCH" : "POST";
    let objectBody = { ...objectData };

    if (updateObject && serverData) {
      objectBody.id = serverData.id;
    }

    if (
      !updateObject &&
      (objectType === "claim_mpi" ||
        objectType === "claim_ll" ||
        objectType === "claim_tp")
    ) {
      objectBody.incident = serverData.id;
    }

    if (
      !updateObject &&
      (objectType === "inspection" || objectType === "ticket")
    ) {
      objectBody.violation = serverData.id;
    }

    const fieldsToUpperCase = ["first_name", "last_name", "emergency_contact"];

    fieldsToUpperCase.forEach((field) => {
      if (field in objectBody) {
        objectBody[field] = objectBody[field].toUpperCase();
      }
    });

    const phoneNumbersFields = ["phone_number", "emergency_phone"];

    phoneNumbersFields.forEach((field) => {
      if (field in objectBody) {
        objectBody[field] = "+1" + objectBody[field];
      }
    });

    fetch(createObjectApi, {
      method,
      body: JSON.stringify({ ...objectBody, changed_by: session.user.name }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        response.json();
      })
      .then((data) => {
        afterCreateCallback(data);
      })
      .then(() => {
        if (objectType !== "driver" || !updateObject) return;
        // Create change log
        let changeLog = {};

        Object.entries(objectData).forEach(([key, value]) => {
          if (typeof value !== "object" && value !== initialFormData[key]) {
            changeLog[key] = {
              old: initialFormData[key],
              new: value,
              changed_by: session.user.name,
            };
          } else if (key === "routes") {
            if (
              JSON.stringify(value) !== JSON.stringify(initialFormData[key])
            ) {
              changeLog[key] = {
                old: initialFormData[key],
                new: value,
                changed_by: session.user.name,
              };
            }
          }
        });

        // Send change log
        fetch(`/api/send-change-log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver_id: serverData.id,
            changes: changeLog,
          }),
        })
          .then((logResponse) => {
            if (!logResponse.ok) {
              throw new Error("Error logging changes");
            }
            return logResponse.json();
          })
          .then(() => {
            // Update the user data and stop loading
            changeLog = {};
          });
      })
      .catch((error) => {
        console.error("Error:", error);
        setShowInfoModal({
          show: true,
          message: "Something went wrong. Please try to save changes again.",
        });
      });
  };

  const openMap = (coords) => {
    setInitialCoordinates(coords);
    setShowMapModal(true);
  };

  const closeMap = () => {
    setInitialCoordinates("");
    setShowMapModal(false);
  };

  const handleSetCoordinates = (objectDataKey, coords) => {
    setObjectData((prev) => {
      return { ...prev, [objectDataKey]: coords.join(", ") };
    });
    closeMap();
  };

  const newFields = useMemo(() => {
    if (
      !hiredDriversList ||
      !activeTrucksList ||
      !driverReportsList ||
      !hiredEmployeesList
    )
      return [];

    return Object.values(objectTemplateSettings).map((item, index) => {
      let field = null;
      let name = item.key;
      let label = item.name;
      let value = objectData[item.key];

      if (item.type === "text") {
        field = (
          <TextInput
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={value}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            mandatory={item.mandatory}
            disabled={item.disabled}
            lettersOnly={item.lettersOnly}
          />
        );
      }

      if (item.type === "number") {
        field = (
          <NumericInput
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={value}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            mandatory={item.mandatory}
            disabled={item.disabled}
            formatted={item.formatted}
            max={item.max}
          />
        );
      }

      if (item.type === "selector") {
        let data = null;

        if (
          item.key === "province" &&
          "country" in objectData &&
          objectData.country === "USA"
        ) {
          data = item.data_opt;
        } else {
          data = item.data;
        }

        field = (
          <OptionsSelector
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={value}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            mandatory={item.mandatory}
            data={data}
            setDefault={!!item.setDefault}
            disabled={item.disabled}
          />
        );
      }

      if (item.type === "radio") {
        field = (
          <RadioOptionsSelector
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={value}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            mandatory={item.mandatory}
            data={item.data}
            setDefault={!!item.setDefault}
            disabled={item.disabled}
          />
        );
      }

      if (item.type === "phone") {
        field = (
          <PhoneNumberInput
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={value}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            mandatory={item.mandatory}
            disabled={item.disabled}
          />
        );
      }

      if (item.type === "postal_code") {
        field = (
          <PostalCodeInput
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={value}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            disabled={item.disabled}
            mandatory={item.mandatory}
          />
        );
      }

      if (item.type === "selector-context") {
        let contextData = null;
        let searchableFields = null;
        if (item.contextValues === "driver") {
          contextData = hiredDriversList;
          searchableFields = ["first_name", "last_name", "driver_id"];
        }
        if (item.contextValues === "truck") {
          contextData = activeTrucksList;
          searchableFields = ["unit_number", "plate_number", "make", "model"];
        }
        if (item.contextValues === "driverReportsList") {
          contextData = driverReportsList;
          searchableFields = ["id", "driver_name", "driver_id", "date_time"];
        }
        if (item.contextValues === "employee") {
          contextData = hiredEmployeesList;
          searchableFields = ["first_name", "last_name", "employee_id"];
        }

        if (
          "select_driver_employee" in objectData &&
          objectData.select_driver_employee === "DR" &&
          item.key === "main_employee_id"
        ) {
          return null;
        } else if (
          "select_driver_employee" in objectData &&
          objectData.select_driver_employee === "EM" &&
          (item.key === "main_driver_id" || item.key === "report")
        ) {
          return null;
        }
        field = (
          <TextInputSearch
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={contextData[value] || ""}
            updateState={setObjectData}
            searchableData={contextData}
            searchableFields={searchableFields}
            checkAllFields={checkAllFields}
            mandatory={item.mandatory}
            disabled={item.disabled}
          />
        );
      }

      if (item.type === "textarea") {
        field = (
          <TextareaInput
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={value}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            mandatory={item.mandatory}
            disabled={item.disabled}
          />
        );
      }

      if (item.type === "date-time") {
        field = (
          <DateTimeInput
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={moment(value).format("YYYY-MM-DDTHH:mm")}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            mandatory={item.mandatory}
            disabled={item.disabled}
          />
        );
      }

      if (item.type === "date") {
        field = (
          <DateInput
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={value}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            disabled={item.disabled}
            mandatory={item.mandatory}
            minDate={"minDate" in item ? defineMinDate(item.minDate) : null}
            maxDate={"maxDate" in item ? defineMinDate(item.maxDate) : null}
          />
        );
      }

      if (item.type === "email") {
        let fieldIsDisabled = false;

        if (
          item.disabled ||
          (updateObject &&
            item.adminOnly &&
            !userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ))
        ) {
          fieldIsDisabled = true;
        }

        field = (
          <EmailInput
            key={`${item.key}_${index}`}
            name={name}
            label={label}
            value={value}
            updateState={setObjectData}
            checkAllFields={checkAllFields}
            disabled={fieldIsDisabled}
            mandatory={item.mandatory}
            emailIsCorrect={emailIsCorrect}
          />
        );
      }

      if (item.type === "gps") {
        field = (
          <div key={`${item.key}_${index}`} className="flex gap-2 items-end">
            <div className="flex-auto">
              <TextInput
                name={name}
                label={label}
                value={value}
                checkAllFields={checkAllFields}
                mandatory={item.mandatory}
                disabled={item.disabled}
              />
            </div>
            <Button
              content={<FontAwesomeIcon icon={faGlobe} />}
              style={"classicButton-s"}
              highlighted={true}
              tooltipContent={"Set coordinates"}
              tooltipId={"set_coordinates_icon"}
              fn={() => openMap(value)}
            />
          </div>
        );
      }

      if (
        (item.key === "police_report_number" ||
          item.key === "officer_and_department") &&
        (!objectData.police_involved || objectData.police_involved === "false")
      ) {
        return null;
      }

      if (
        item.key === "unit_number" &&
        (objectData.claim_type === "CR1" || objectData.claim_type === "CR2")
      ) {
        return null;
      }
      return field;
    });
  }, [
    objectData,
    activeTrucksList,
    hiredDriversList,
    hiredEmployeesList,
    driverReportsList,
    checkAllFields,
    emailIsCorrect,
  ]);

  useEffect(() => {
    // CUSTOMIZATION FOR ASSIGNED_TO VALUE
    if (!session) return;

    if ("assigned_to" in objectData && objectData.assigned_to.length === 0) {
      setObjectData((prev) => {
        return { ...prev, assigned_to: session.user.name };
      });
    }
  }, [session]);

  useEffect(() => {
    let ready = true;

    for (let key in objectTemplateSettings) {
      // CUSTOM SETTINGS FOR THIRD PARTY CLAIM
      if (objectData.claim_to && objectData.claim_to === "TP") {
        break;
      }

      // CUSTOM SETTINGS FOR WCB DRIVER/EMPLOYEE CHOICE
      if (
        "select_driver_employee" in objectData &&
        objectData.select_driver_employee === "DR" &&
        key === "main_employee_id"
      ) {
        break;
      } else if (
        "select_driver_employee" in objectData &&
        objectData.select_driver_employee === "EM" &&
        (key === "main_driver_id" || key === "report")
      ) {
        break;
      }

      if (
        objectTemplateSettings[key].mandatory &&
        objectData[key].length === 0
      ) {
        ready = false;
        break;
      }
    }

    // CUSTOM SETTINGS FOR THIRD PARTY CLAIM
    if (objectData.claim_to && objectData.claim_to === "TP") {
      let objectData_TP = { ...objectData };
      delete objectData_TP.claim_to;
      delete objectData_TP.claim_type;

      if (Object.values(objectData_TP).every((value) => value.length === 0)) {
        ready = false;
      }
    }

    Object.keys(objectData).forEach((key) => {
      if (key.includes("email")) {
        let emailIsCorrect = testEmail(objectData[key]);
        setEmailCorrect(emailIsCorrect);

        if (!emailIsCorrect && objectData[key].length > 0) {
          ready = false;
        }
      }
    });

    setFormDataReady(ready);
  }, [objectData]);

  useEffect(() => {
    if (serverData || !objectTemplate) return;

    //THIS IS WORKAROUND TO BE REMOVED IN THE FUTURE
    if ("date_available" in objectTemplate) {
      let today = new Date();

      setObjectData((prev) => {
        return {
          ...prev,
          date_available: moment(today).format("YYYY-MM-DD"),
        };
      });
    }
  }, [serverData, objectTemplate]);

  useEffect(() => {
    if (!serverData) return;

    let initialFormDataToSet = {};
    let newObjectData = { ...objectData };

    Object.keys(objectTemplate).forEach((key) => {
      if (key in serverData) {
        if (
          key === "main_driver_id" &&
          String(serverData[key]).length === 0 &&
          serverData.main_employee_id &&
          String(serverData.main_employee_id).length > 0
        ) {
          initialFormDataToSet.select_driver_employee = "EM";
          newObjectData.select_driver_employee = "EM";
        }

        if (
          key === "main_employee_id" &&
          String(serverData[key]).length === 0 &&
          serverData.main_driver_id &&
          String(serverData.main_driver_id).length > 0
        ) {
          initialFormDataToSet.select_driver_employee = "DR";
          newObjectData.select_driver_employee = "DR";
        }

        if (key === "phone_number" || key === "emergency_phone") {
          let int = serverData[key].slice(-10);
          initialFormDataToSet[key] = int;
          newObjectData[key] = int;
        } else if (key === "date_available") {
          //THIS IS WORKAROUND TO BE REMOVED IN THE FUTURE
          let today = new Date();

          initialFormDataToSet[key] =
            serverData[key].length === 0
              ? moment(today).format("YYYY-MM-DD")
              : serverData[key];
          newObjectData[key] =
            serverData[key].length === 0
              ? moment(today).format("YYYY-MM-DD")
              : serverData[key];
        } else {
          initialFormDataToSet[key] = serverData[key];
          newObjectData[key] = serverData[key];
        }
      }
    });

    setObjectData(newObjectData);
    setInitialFormData(initialFormDataToSet);
  }, [serverData]);

  useEffect(() => {
    // CUSTOMIZATION FOR CREATION AND EDITING THE CLAIM
    if (
      !serverData ||
      !objectData.claim_type ||
      objectData.claim_type.length === 0 ||
      updateObject
    )
      return;

    const UNIT_NUMBER_MAPPING = {
      TRK: "truck_unit_number",
      TR1: "trailer_1_unit_number",
      TR2: "trailer_2_unit_number",
      CVR: "converter_unit_number",
    };

    setObjectData((prev) => {
      let unitNumberToSet = "";

      if (objectData.claim_type === "TRK") {
        unitNumberToSet = activeTrucksList[serverData.truck].unit_number || "";
      } else {
        unitNumberToSet =
          serverData[UNIT_NUMBER_MAPPING[objectData.claim_type]] || "";
      }

      return {
        ...prev,
        unit_number: unitNumberToSet,
      };
    });
  }, [objectData.claim_type, serverData, updateObject]);

  useEffect(() => {
    // CUSTOMIZATION FOR WCB DRIVER/EMPLOYEE CHOICE
    if (!("select_driver_employee" in objectData)) return;

    if (
      "select_driver_employee" in objectData &&
      objectData.select_driver_employee === "DR"
    ) {
      setObjectData((prev) => {
        return { ...prev, main_employee_id: "" };
      });
    } else if (
      "select_driver_employee" in objectData &&
      objectData.select_driver_employee === "EM"
    ) {
      setObjectData((prev) => {
        return { ...prev, main_driver_id: "", report: "" };
      });
    }
  }, [objectData.select_driver_employee]);

  return (
    <div className="prose max-w-full space-y-3 grid grid-cols-1 grid-rows-[min-content_auto_min-content] gap-3 text-slate-700 w-96 h-full max-h-full overflow-hidden">
      <p className="font-bold text-center m-0">
        {objectType === "indicate_violations"
          ? "Please fulfill at least one field"
          : `${updateObject ? "Update" : "Create"} ${OBJECT_TYPES[objectType]}`}
      </p>
      <div className="overflow-y-auto h-full px-3">{newFields}</div>
      <div className="flex items-center justify-between px-3">
        <Button
          content={"Close"}
          style={"classicButton"}
          fn={handleCreateObjectModalClose}
        />
        <Button
          content={"Save"}
          style={"classicButton"}
          fn={formDataReady ? saveObject : () => setCheckAllFields(true)}
          highlighted={formDataReady}
          tooltipId={"create_new_object_save_tooltip"}
          tooltipContent={
            !formDataReady && (
              <p>
                {objectData.claim_to && objectData.claim_to === "TP"
                  ? "Please fulfill at least one field"
                  : "Please fulfill all the required fields"}
              </p>
            )
          }
        />
      </div>
      {"gps_coordinates" in objectData && (
        <MapModalContainer modalIsOpen={showMapModal} setModalClose={closeMap}>
          <MapComponent
            location={objectData.location}
            initialCoordinates={initialCoordinates}
            onSaveCoordinates={handleSetCoordinates}
            objectDataKey={"gps_coordinates"}
          />
        </MapModalContainer>
      )}
      <InfoMessageModalContainer modalIsOpen={showInfoModal.show}>
        <p className="font-bold text-red-600">{showInfoModal.message}</p>
        <Button
          content={"Cancel"}
          style={"classicButton"}
          fn={() => setShowInfoModal({ show: false, message: "" })}
        />
      </InfoMessageModalContainer>
    </div>
  );
}

export default CreateObjectComponent;
