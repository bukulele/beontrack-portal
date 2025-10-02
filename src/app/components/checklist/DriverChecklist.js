import React, { useContext, useEffect, useState } from "react";
import { DriverContext } from "@/app/context/DriverContext";
import CheckListField from "../checklistField/CheckListField";
import Button from "../button/Button";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import { useLoader } from "@/app/context/LoaderContext";
import { SettingsContext } from "@/app/context/SettingsContext";
import NumericInput from "../numericInput/NumericInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCircle,
  faSquareCheck,
  faSquare,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import useUserRoles from "@/app/functions/useUserRoles";
import CheckListFieldFrame from "../checklistField/CheckListFieldFrame";
import DateInput from "../dateInput/DateInput";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import {
  TERMINAL_CHOICES,
  DRIVERTYPE_CHOICES,
  IMMIGRATION_STATUS,
  WEEK_DAYS,
} from "@/app/assets/tableData";
import RoutesSelector from "../routesSelector/RoutesSelector";
import checkActivityPeriod from "@/app/functions/checkActivityPeriod";
import ModalContainer from "../modalContainer/ModalContainer";
import TextareaInput from "../textareaInput/TextareaInput";
import { Tooltip } from "@mui/material";
import DriverScheduleComponent from "../driverSchedule/DriverScheduleComponent";

function DriverChecklist({ template, checklistType }) {
  const [fieldsList, setFieldsList] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [allCheckedMessage, setAllCheckedMessage] = useState("");
  const [buttonsToShow, setButtonsToShow] = useState(null);
  const [customDriverData, setCustomDriverData] = useState({
    driver_id: "",
    hiring_date: "",
    terminal: "",
    routes: [],
    driver_type: "",
    immigration_status: "",
    lcv_certified: false,
    cp_driver: false,
    drug_test_done: false,
    eligible_to_enter_usa: false,
  });
  const [readyToActive, setReadyToActive] = useState(false);
  const [readyToActiveMessage, setReadyToActiveMessage] = useState("");
  const [showMessageToDriverModal, setShowMessageToDriverModal] =
    useState(false);
  const [messageToDriver, setMessageToDriver] = useState("");
  const [showDriverSchedule, setShowDriverSchedule] = useState(false);

  const { userData, loadData } = useContext(DriverContext);
  const { buttonsSettings } = useContext(SettingsContext);
  const userRoles = useUserRoles();

  const { startLoading, stopLoading } = useLoader();

  const handleStatusChange = (status) => {
    startLoading();

    const data = new FormData();

    data.append("status", status);

    fetch(`/api/upload-driver-data/${userData.id}`, {
      method: "PATCH",
      body: data,
    })
      .finally(() => stopLoading())
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response JSON if the request was successful
        } else {
          // Handle non-2xx HTTP responses
          return response.json().then((errorDetails) => {
            throw new Error(
              errorDetails.details.error || "An unknown error occurred."
            );
          });
        }
      })
      .then(() => {
        loadData();
      })
      .catch((error) => {
        console.error("Error while updating driver data:", error.message);
        alert(error.message);
        loadData();
      });
  };

  const handleUpdateStatusChange = () => {
    startLoading();

    const data = new FormData();

    data.append("update_status", "UR");
    data.append("update_status_message", messageToDriver);

    fetch(`/api/upload-driver-data/${userData.id}`, {
      method: "PATCH",
      body: data,
    }).then((response) => {
      stopLoading();
      setShowMessageToDriverModal(false);
      if (response.ok) {
        loadData();
      }
    });
  };

  const handleCustomFieldSave = (field) => {
    startLoading();

    const data = new FormData();

    if (field === "routes") {
      customDriverData[field].forEach((id) => {
        data.append(field, id);
      });
    } else {
      if (field === "driver_type" && userData[field] === "OD") {
        data.append("work_for_driver", "");
      }
      data.append(field, customDriverData[field]);
    }

    fetch(`/api/upload-driver-data/${userData.id}`, {
      method: "PATCH",
      body: data,
    })
      .finally(() => stopLoading())
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response JSON if the request was successful
        } else {
          // Handle non-2xx HTTP responses
          return response.json().then((errorDetails) => {
            throw new Error(
              errorDetails.details.error || "An unknown error occurred."
            );
          });
        }
      })
      .then(() => {
        loadData();
      })
      .catch((error) => {
        console.error(error.message);
        alert(error.message);
        loadData();
      });
  };

  const handleTrueFalseChange = (event) => {
    const { name } = event.target;

    setCustomDriverData((prevFormData) => ({
      ...prevFormData,
      [name]: !prevFormData[name],
    }));
  };

  useEffect(() => {
    if (!userData) return;

    for (let key in customDriverData) {
      if (Array.isArray(customDriverData[key])) {
        setCustomDriverData((prevData) => {
          return { ...prevData, [key]: [...userData[key]] };
        });
      } else {
        setCustomDriverData((prevData) => {
          return { ...prevData, [key]: userData[key] };
        });
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    setMessageToDriver(userData.update_status_message);

    const list = Object.values(template).map((item) => {
      let settings = { ...item };
      if (
        userData.terminal !== "MB" &&
        userData.terminal !== "SK" &&
        settings.key === "abstract_request_forms"
      ) {
        settings.optional = true;
      }

      if (
        userData.driver_type !== "OO" &&
        (settings.key === "incorp_docs" || settings.key === "gst_docs")
      ) {
        return null;
      }
      if (
        !userData.lcv_certified &&
        (settings.key === "lcv_certificates" || settings.key === "lcv_licenses")
      ) {
        return null;
      }
      if (
        !userData.eligible_to_enter_usa &&
        (settings.key === "us_visas" || settings.key === "passports")
      ) {
        return null;
      }
      if (userData.driver_type === "OD" && settings.key === "driver_rates") {
        return null;
      }
      if (
        userData.immigration_status === "CIT" &&
        settings.key === "immigration_doc"
      ) {
        return null;
      }
      if (
        (userData.driver_type === "OO" || userData.driver_type === "OD") &&
        settings.key === "tax_papers"
      ) {
        return null;
      }

      if (settings.key === "driver_background") {
        let backgroundObject = {
          id: userData.driver_background[0].id,
          file_box_number: userData.file_box_number,
          highest_level_of_education: userData.highest_level_of_education,
          name_of_school: userData.name_of_school,
          school_location: userData.school_location,
          certificates_additional_training:
            userData.certificates_additional_training,
          accidents_history: userData.accidents_history,
          traffic_convictions: userData.traffic_convictions,
          denied_license: userData.denied_license,
          denied_license_reason: userData.denied_license_reason,
          license_suspended_or_revoked: userData.license_suspended_or_revoked,
          suspension_or_revocation_reason:
            userData.suspension_or_revocation_reason,
          last_changed_by: userData.driver_background[0].last_changed_by,
          last_reviewed_by: userData.driver_background[0].last_reviewed_by,
          was_reviewed: userData.driver_background[0].was_reviewed,
        };
        return (
          <CheckListField
            checklistType={checklistType}
            dataId={userData.id}
            loadData={loadData}
            value={[backgroundObject]}
            key={`checklist_field_${settings.key}`}
            settings={settings}
            apiRoute={"/api/update-file"}
          />
        );
      }
      return (
        <CheckListField
          checklistType={checklistType}
          dataId={userData.id}
          loadData={loadData}
          value={userData[settings.key]}
          key={`checklist_field_${settings.key}`}
          settings={settings}
          dataType="driver"
          apiRoute={"/api/update-file"}
          activityHistoryPeriod={10}
        />
      );
    });
    setFieldsList(list);
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    let ready = true;
    let rfoMessage = "";

    for (let value of Object.values(template)) {
      if (
        userData.driver_type !== "OO" &&
        (value.key === "incorp_docs" || value.key === "gst_docs")
      )
        continue;

      if (
        !userData.lcv_certified &&
        (value.key === "lcv_certificates" || value.key === "lcv_licenses")
      )
        continue;

      if (
        !userData.eligible_to_enter_usa &&
        (value.key === "us_visas" || value.key === "passports")
      )
        continue;

      if (userData.driver_type === "OD" && value.key === "driver_rates")
        continue;

      if (
        (userData.driver_type === "OO" || userData.driver_type === "OD") &&
        value.key === "tax_papers"
      ) {
        continue;
      }

      if (
        userData.terminal !== "MB" &&
        value.key === "abstract_request_forms"
      ) {
        continue;
      }

      if (
        value.key === "winter_courses" ||
        value.key === "annual_performance_reviews" ||
        value.key === "certificates_of_violations" ||
        value.key === "pdic_certificates" ||
        value.key === "driver_statements" ||
        value.key === "other_documents" ||
        value.key === "mentor_forms" ||
        value.key === "ctpat_papers" ||
        value.key === "ctpat_quiz"
      )
        continue;

      if (
        userData.immigration_status === "CIT" &&
        value.key === "immigration_doc"
      ) {
        continue;
      }

      if (!findHighestIdObject(userData[value.key]).was_reviewed) {
        rfoMessage = `NOT REVIEWED: ${value.name}`;
        ready = false;
        break;
      }
    }

    if (
      checklistType === 2 &&
      (userData.driver_id.length === 0 || userData.hiring_date.length === 0)
    ) {
      rfoMessage = "NO DRIVER ID OR HIRING DATE";
      ready = false;
    }

    if (
      checklistType === 2 &&
      userData.schedule === "" &&
      userData.routes.includes(3)
    ) {
      rfoMessage = "NO SCHEDULE";
      ready = false;
    }

    if (
      checklistType === 1 &&
      checkActivityPeriod(userData.activity_history, 10).length > 0
    ) {
      rfoMessage = "ACTIVITY PERIOD NOT FULFILLED";
      ready = false;
    }

    setAllCheckedMessage(rfoMessage);
    setAllChecked(ready);
  }, [userData]);

  useEffect(() => {
    // SPECIFIC CHECK FOR SET TO ACTIVE
    if (!userData) return;

    let ready = true;
    let activeMessage = "";

    if (!allChecked) {
      activeMessage = "Not all documents have been checked!";
      ready = false;
    }

    if (
      (userData.status === "TR" || userData.status === "RO") &&
      !findHighestIdObject(userData.mentor_forms).was_reviewed
    ) {
      activeMessage = "Mentor forms document is not checked!";
      ready = false;
    }

    if (
      (userData.routes.includes(2) && !userData.drug_test_done) ||
      (userData.routes.includes(2) && !customDriverData.drug_test_done)
    ) {
      activeMessage = "Drug test absent!";
      ready = false;
    }

    if (userData.schedule === "" && userData.routes.includes(3)) {
      activeMessage = "Driver schedule is empty!";
      ready = false;
    }

    setReadyToActiveMessage(activeMessage);
    setReadyToActive(ready);
  }, [userData, allChecked, customDriverData]);

  useEffect(() => {
    if (!userData || !buttonsSettings.driver) return;

    let filteredButtons = buttonsSettings.driver.filter(
      (item) => item.status === userData.status
    );

    setButtonsToShow(filteredButtons[0]);
  }, [userData, buttonsSettings]);

  return (
    userData &&
    buttonsToShow && (
      <>
        <div className="w-full overflow-y-scroll flex-auto pb-5">
          {checklistType === 1 && (
            <>
              <CheckListFieldFrame fieldName={"Terminal:"}>
                <OptionsSelector
                  value={customDriverData.terminal}
                  updateState={setCustomDriverData}
                  name={"terminal"}
                  data={TERMINAL_CHOICES}
                  style={"small"}
                />
                {customDriverData.terminal !== userData.terminal && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("terminal")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_driver_terminal_tooltip`}
                  />
                )}
              </CheckListFieldFrame>
              <CheckListFieldFrame fieldName={"Routes:"}>
                <RoutesSelector
                  routes={customDriverData.routes}
                  updateState={setCustomDriverData}
                />
                {JSON.stringify(customDriverData.routes) !==
                  JSON.stringify(userData.routes) && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("routes")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_driver_routes_tooltip`}
                  />
                )}
              </CheckListFieldFrame>
              <CheckListFieldFrame fieldName={"Current USA driver:"}>
                <div>
                  <input
                    name={"eligible_to_enter_usa"}
                    type="checkbox"
                    value={customDriverData.eligible_to_enter_usa}
                    onChange={handleTrueFalseChange}
                    checked={customDriverData.eligible_to_enter_usa}
                  />
                </div>
                {customDriverData.eligible_to_enter_usa !==
                  userData.eligible_to_enter_usa && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("eligible_to_enter_usa")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_driver_eligible_to_enter_usa_tooltip`}
                  />
                )}
              </CheckListFieldFrame>
              <CheckListFieldFrame fieldName={"Driver Type:"}>
                <OptionsSelector
                  value={customDriverData.driver_type}
                  updateState={setCustomDriverData}
                  name={"driver_type"}
                  data={DRIVERTYPE_CHOICES}
                  style={"small"}
                />
                {customDriverData.driver_type !== userData.driver_type && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("driver_type")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_driver_type_tooltip`}
                  />
                )}
              </CheckListFieldFrame>
            </>
          )}
          {checklistType === 2 && (
            <>
              <CheckListFieldFrame fieldName={"Driver Id:"}>
                <NumericInput
                  name={"driver_id"}
                  value={customDriverData.driver_id}
                  updateState={setCustomDriverData}
                  style="small"
                />
                {customDriverData.driver_id !== userData.driver_id && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("driver_id")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_driver_id_tooltip`}
                  />
                )}
                {userData.driver_id.length === 0 && (
                  <div className="flex items-center justify-center self-center">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="text-red-600 text-xs"
                    />
                  </div>
                )}
              </CheckListFieldFrame>
              <CheckListFieldFrame fieldName={"Hiring Date:"}>
                <DateInput
                  name={"hiring_date"}
                  value={customDriverData.hiring_date}
                  updateState={setCustomDriverData}
                  style="minimalistic"
                />
                {customDriverData.hiring_date !== userData.hiring_date && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("hiring_date")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_driver_hiring_date_tooltip`}
                  />
                )}
                {userData.hiring_date.length === 0 && (
                  <div className="flex items-center justify-center self-center">
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="text-red-600 text-xs"
                    />
                  </div>
                )}
              </CheckListFieldFrame>
              <CheckListFieldFrame fieldName={"LCV Driver:"}>
                <div>
                  <input
                    name={"lcv_certified"}
                    type="checkbox"
                    value={customDriverData.lcv_certified}
                    onChange={handleTrueFalseChange}
                    checked={customDriverData.lcv_certified}
                  />
                </div>
                {customDriverData.lcv_certified !== userData.lcv_certified && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("lcv_certified")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_driver_lcv_certified_tooltip`}
                  />
                )}
              </CheckListFieldFrame>
              <CheckListFieldFrame fieldName={"CP Driver:"}>
                <div>
                  <input
                    name={"cp_driver"}
                    type="checkbox"
                    value={customDriverData.cp_driver}
                    onChange={handleTrueFalseChange}
                    checked={customDriverData.cp_driver}
                  />
                </div>
                {customDriverData.cp_driver !== userData.cp_driver && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("cp_driver")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_driver_cp_driver_tooltip`}
                  />
                )}
              </CheckListFieldFrame>
              <CheckListFieldFrame fieldName={"Immigration Status:"}>
                <OptionsSelector
                  value={customDriverData.immigration_status}
                  updateState={setCustomDriverData}
                  name={"immigration_status"}
                  data={IMMIGRATION_STATUS}
                  style={"small"}
                />
                {customDriverData.immigration_status !==
                  userData.immigration_status && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("immigration_status")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_immigration_status_tooltip`}
                  />
                )}
              </CheckListFieldFrame>
              <CheckListFieldFrame
                fieldName={"Drug Test Done:"}
                optional={!customDriverData.routes.includes(2)}
              >
                <div>
                  <input
                    name={"drug_test_done"}
                    type="checkbox"
                    value={customDriverData.drug_test_done}
                    onChange={handleTrueFalseChange}
                    checked={customDriverData.drug_test_done}
                  />
                </div>
                {customDriverData.drug_test_done !==
                  userData.drug_test_done && (
                  <Button
                    style={"iconButton"}
                    fn={() => handleCustomFieldSave("drug_test_done")}
                    content={<FontAwesomeIcon icon={faCheck} />}
                    tooltipContent={"Save"}
                    tooltipId={`save_new_driver_drug_test_done_tooltip`}
                  />
                )}
              </CheckListFieldFrame>
              {userData.routes.includes(3) && (
                <CheckListFieldFrame fieldName={"City Driver Schedule:"}>
                  <div className="flex items-center gap-1 w-full h-full justify-center">
                    {Object.keys(WEEK_DAYS).map((day, index) => {
                      return (
                        <Tooltip
                          title={day}
                          key={`${userData.id}-${day}-${index}`}
                        >
                          <FontAwesomeIcon
                            icon={
                              userData.schedule[day] ? faSquareCheck : faSquare
                            }
                            color={
                              userData.schedule === ""
                                ? "#cbd5e1"
                                : userData.schedule[day]
                                ? "#22c55e"
                                : "#f87171"
                            }
                            className="text-xl"
                          />
                        </Tooltip>
                      );
                    })}
                    <div className="flex items-center justify-center ml-3">
                      <Button
                        style={"iconButton"}
                        fn={() => setShowDriverSchedule(true)}
                        content={
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="pointer-events-none"
                          />
                        }
                        tooltipContent={"Edit driver schedule"}
                        tooltipId={`schedule_edit_${userData.id}`}
                      />
                    </div>
                    {userData.schedule === "" && (
                      <div className="flex items-center justify-center self-center">
                        <FontAwesomeIcon
                          icon={faCircle}
                          className="text-red-600 text-xs"
                        />
                      </div>
                    )}
                  </div>
                  <ModalContainer modalIsOpen={showDriverSchedule}>
                    <DriverScheduleComponent
                      closeScheduleModal={() => setShowDriverSchedule(false)}
                    />
                  </ModalContainer>
                </CheckListFieldFrame>
              )}
            </>
          )}
          {fieldsList}
        </div>
        <div className="flex gap-3 justify-end items-center p-3">
          {checklistType === 1 &&
            (userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
              )) &&
            buttonsToShow.acd && (
              <Button
                content={"Allow Changes For Driver"}
                style={"classicButton"}
                fn={() => handleStatusChange("NW")}
              />
            )}
          {checklistType === 2 &&
            (userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
              )) &&
            buttonsToShow.sdt && (
              <Button
                content={"Set Driver To Trainee"}
                style={"classicButton"}
                fn={() => handleStatusChange("TR")}
                disabled={!allChecked}
                tooltipId={"set_driver_to_trainee_button_tooltip"}
                tooltipContent={!allChecked && <p>{readyToActiveMessage}</p>}
              />
            )}
          {checklistType === 2 &&
            (userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
              )) &&
            buttonsToShow.sda && (
              <Button
                content={"Set Driver To Active"}
                style={"classicButton"}
                fn={() => handleStatusChange("AC")}
                disabled={!readyToActive}
                tooltipId={"set_driver_to_active_button_tooltip"}
                tooltipContent={!readyToActive && <p>{readyToActiveMessage}</p>}
              />
            )}
          {checklistType === 2 &&
            userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
            ) &&
            buttonsToShow.rcd && (
              <>
                <Button
                  content={"Request Change From Driver"}
                  style={"classicButton"}
                  fn={() => setShowMessageToDriverModal(true)}
                  disabled={userData.update_status === "UR"}
                  tooltipId={"request_change_from_driver_button_tooltip"}
                  tooltipContent={
                    userData.update_status === "UR"
                      ? "Change has been requested"
                      : ""
                  }
                />
                <ModalContainer modalIsOpen={showMessageToDriverModal}>
                  <TextareaInput
                    name={"update_status_message"}
                    label={"Message for driver"}
                    value={messageToDriver}
                    updateState={setMessageToDriver}
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      content={"Cancel"}
                      style={"classicButton"}
                      fn={() => setShowMessageToDriverModal(false)}
                    />
                    <Button
                      content={"Send"}
                      style={"classicButton"}
                      fn={handleUpdateStatusChange}
                      highlighted={true}
                      disabled={messageToDriver.length === 0}
                      tooltipId={"update_status_message_tooltip"}
                      tooltipContent={
                        messageToDriver.length === 0
                          ? "Please input the message for driver first"
                          : "Send message to driver and save data"
                      }
                    />
                  </div>
                </ModalContainer>
              </>
            )}
          {checklistType === 1 &&
            (userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_SAFETY
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_RECRUITING
              )) &&
            buttonsToShow.rfo && (
              <Button
                content={"Ready for Orientation"}
                style={"classicButton"}
                fn={() => handleStatusChange("RO")}
                disabled={!allChecked}
                tooltipId={"ro_button_tooltip"}
                tooltipContent={!allChecked && <p>{allCheckedMessage}</p>}
              />
            )}
        </div>
      </>
    )
  );
}

export default DriverChecklist;
