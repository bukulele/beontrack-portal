import React, { use, useContext, useEffect, useState } from "react";
import { EmployeeContext } from "@/app/context/EmployeeContext";
import CheckListField from "../checklistField/CheckListField";
import Button from "../button/Button";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import { useLoader } from "@/app/context/LoaderContext";
import { SettingsContext } from "@/app/context/SettingsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle } from "@fortawesome/free-solid-svg-icons";
import useUserRoles from "@/app/functions/useUserRoles";
import CheckListFieldFrame from "../checklistField/CheckListFieldFrame";
import DateInput from "../dateInput/DateInput";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import {
  TERMINAL_CHOICES,
  IMMIGRATION_STATUS,
  DEPARTMENT_CHOICES,
} from "@/app/assets/tableData";
import checkActivityPeriod from "@/app/functions/checkActivityPeriod";
import ModalContainer from "../modalContainer/ModalContainer";
import TextareaInput from "../textareaInput/TextareaInput";
import TextInput from "../textInput/TextInput";
import NumericInput from "../numericInput/NumericInput";
import { useSession } from "next-auth/react";

function EmployeeChecklist({ template }) {
  const [fieldsList, setFieldsList] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [buttonsToShow, setButtonsToShow] = useState(null);
  const [customEmployeeData, setCustomEmployeeData] = useState({
    employee_id: "",
    hiring_date: "",
    terminal: "",
    immigration_status: "",
    rate: "",
    card_number: "",
    title: "",
    department: "",
  });
  const [readyToActive, setReadyToActive] = useState(false);
  const [showMessageToEmployeeModal, setShowMessageToEmployeeModal] =
    useState(false);
  const [messageToEmployee, setMessageToEmployee] = useState("");

  const { userData, loadEmployeeData } = useContext(EmployeeContext);
  const { buttonsSettings } = useContext(SettingsContext);
  const userRoles = useUserRoles();
  const { data: session } = useSession();

  const { startLoading, stopLoading } = useLoader();

  const handleStatusChange = (status) => {
    startLoading();

    const data = new FormData();

    data.append("status", status);
    data.append("changed_by", session.user.name);

    fetch(`/api/upload-employee-data/${userData.id}`, {
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
        loadEmployeeData();
      })
      .catch((error) => {
        console.error("Error while updating employee data:", error.message);
        alert(error.message);
        loadEmployeeData();
      });
  };

  const handleUpdateStatusChange = () => {
    startLoading();

    const data = new FormData();

    data.append("update_status", "UR");
    data.append("update_status_message", messageToEmployee);
    data.append("changed_by", session.user.name);

    fetch(`/api/upload-employee-data/${userData.id}`, {
      method: "PATCH",
      body: data,
    }).then((response) => {
      stopLoading();
      setShowMessageToEmployeeModal(false);
      if (response.ok) {
        loadEmployeeData();
      }
    });
  };

  const handleCustomFieldSave = (field) => {
    startLoading();

    const data = new FormData();
    data.append(field, customEmployeeData[field]);
    data.append("changed_by", session.user.name);
    // }

    fetch(`/api/upload-employee-data/${userData.id}`, {
      method: "PATCH",
      headers: {
        "x-user-roles": JSON.stringify(userRoles),
      },
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
        loadEmployeeData();
      })
      .catch((error) => {
        console.error(error.message);
        alert(error.message);
        loadEmployeeData();
      });
  };

  // const handleTrueFalseChange = (event) => {
  //   const { name } = event.target;

  //   setCustomEmployeeData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: !prevFormData[name],
  //   }));
  // };

  useEffect(() => {
    if (!userData) return;

    for (let key in customEmployeeData) {
      if (Array.isArray(customEmployeeData[key])) {
        setCustomEmployeeData((prevData) => {
          return { ...prevData, [key]: [...userData[key]] };
        });
      } else {
        setCustomEmployeeData((prevData) => {
          return { ...prevData, [key]: userData[key] };
        });
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    setMessageToEmployee(userData.update_status_message);

    const list = Object.values(template).map((item) => {
      let settings = { ...item };
      if (
        userData.terminal !== "MB" &&
        settings.key === "abstract_request_forms"
      ) {
        settings.optional = true;
      }
      if (
        userData.immigration_status === "CIT" &&
        settings.key === "immigration_doc"
      ) {
        return null;
      }
      return (
        <CheckListField
          checklistType={1}
          dataId={userData.id}
          loadData={loadEmployeeData}
          value={userData[settings.key]}
          key={`checklist_field_${settings.key}`}
          settings={settings}
          dataType="employee"
          apiRoute={"/api/update-file-employee"}
          activityHistoryPeriod={3}
        />
      );
    });
    setFieldsList(list);
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    let ready = true;

    for (let value of Object.values(template)) {
      if (
        userData.terminal !== "MB" &&
        value.key === "abstract_request_forms"
      ) {
        continue;
      }

      if (value.optional === true) continue;

      if (
        userData.immigration_status === "CIT" &&
        value.key === "immigration_doc"
      ) {
        continue;
      }
      if (!findHighestIdObject(userData[value.key]).was_reviewed) {
        ready = false;
        break;
      }
    }

    for (let key in customEmployeeData) {
      if (userData[key].length === 0) {
        ready = false;
        break;
      }
    }

    // if (
    //   userData.employee_id.length === 0 ||
    //   userData.hiring_date.length === 0
    // ) {
    //   ready = false;
    // }

    if (checkActivityPeriod(userData.activity_history, 3).length > 0) {
      ready = false;
    }

    setAllChecked(ready);
  }, [userData]);

  useEffect(() => {
    // SPECIFIC CHECK FOR SET TO ACTIVE
    if (!userData) return;

    let ready = true;

    if (!allChecked) {
      ready = false;
    }

    if (
      (userData.status === "TR" || userData.status === "RO") &&
      !findHighestIdObject(userData.mentor_forms).was_reviewed
    ) {
      ready = false;
    }

    setReadyToActive(ready);
  }, [userData, allChecked, customEmployeeData]);

  useEffect(() => {
    if (!userData || !buttonsSettings.employee) return;

    let filteredButtons = buttonsSettings.employee.filter(
      (item) => item.status === userData.status
    );

    setButtonsToShow(filteredButtons[0]);
  }, [userData, buttonsSettings]);

  return (
    userData && (
      <>
        <div className="w-full overflow-y-scroll flex-auto pb-5">
          <>
            <CheckListFieldFrame fieldName={"Terminal:"}>
              <OptionsSelector
                value={customEmployeeData.terminal}
                updateState={setCustomEmployeeData}
                name={"terminal"}
                data={TERMINAL_CHOICES}
                style={"small"}
              />
              {customEmployeeData.terminal !== userData.terminal && (
                <Button
                  style={"iconButton"}
                  fn={() => handleCustomFieldSave("terminal")}
                  content={<FontAwesomeIcon icon={faCheck} />}
                  tooltipContent={"Save"}
                  tooltipId={`save_new_employee_terminal_tooltip`}
                />
              )}
            </CheckListFieldFrame>
            <CheckListFieldFrame fieldName={"Employee Id:"}>
              <TextInput
                name={"employee_id"}
                value={customEmployeeData.employee_id}
                updateState={setCustomEmployeeData}
                style="small"
              />
              {customEmployeeData.employee_id !== userData.employee_id && (
                <Button
                  style={"iconButton"}
                  fn={() => handleCustomFieldSave("employee_id")}
                  content={<FontAwesomeIcon icon={faCheck} />}
                  tooltipContent={"Save"}
                  tooltipId={`save_new_employee_id_tooltip`}
                />
              )}
              {userData.employee_id.length === 0 && (
                <div className="flex items-center justify-center self-center">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-red-600 text-xs"
                  />
                </div>
              )}
            </CheckListFieldFrame>
            <CheckListFieldFrame fieldName={"Card Number:"}>
              <TextInput
                name={"card_number"}
                value={customEmployeeData.card_number}
                updateState={setCustomEmployeeData}
                style="small"
              />
              {customEmployeeData.card_number !== userData.card_number && (
                <Button
                  style={"iconButton"}
                  fn={() => handleCustomFieldSave("card_number")}
                  content={<FontAwesomeIcon icon={faCheck} />}
                  tooltipContent={"Save"}
                  tooltipId={`save_new_card_number_tooltip`}
                />
              )}
              {userData.card_number.length === 0 && (
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
                value={customEmployeeData.hiring_date}
                updateState={setCustomEmployeeData}
                style="minimalistic"
              />
              {customEmployeeData.hiring_date !== userData.hiring_date && (
                <Button
                  style={"iconButton"}
                  fn={() => handleCustomFieldSave("hiring_date")}
                  content={<FontAwesomeIcon icon={faCheck} />}
                  tooltipContent={"Save"}
                  tooltipId={`save_new_employee_hiring_date_tooltip`}
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
            <CheckListFieldFrame fieldName={"Title:"}>
              <TextInput
                name={"title"}
                value={customEmployeeData.title}
                updateState={setCustomEmployeeData}
                style="small"
              />
              {customEmployeeData.title !== userData.title && (
                <Button
                  style={"iconButton"}
                  fn={() => handleCustomFieldSave("title")}
                  content={<FontAwesomeIcon icon={faCheck} />}
                  tooltipContent={"Save"}
                  tooltipId={`save_new_employee_title_tooltip`}
                />
              )}
              {userData.title.length === 0 && (
                <div className="flex items-center justify-center self-center">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-red-600 text-xs"
                  />
                </div>
              )}
            </CheckListFieldFrame>
            <CheckListFieldFrame fieldName={"Department:"}>
              <OptionsSelector
                value={customEmployeeData.department}
                updateState={setCustomEmployeeData}
                name={"department"}
                data={DEPARTMENT_CHOICES}
                style={"small"}
              />
              {customEmployeeData.department !== userData.department && (
                <Button
                  style={"iconButton"}
                  fn={() => handleCustomFieldSave("department")}
                  content={<FontAwesomeIcon icon={faCheck} />}
                  tooltipContent={"Save"}
                  tooltipId={`save_new_employee_department_tooltip`}
                />
              )}
              {userData.department.length === 0 && (
                <div className="flex items-center justify-center self-center">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-red-600 text-xs"
                  />
                </div>
              )}
            </CheckListFieldFrame>
            <CheckListFieldFrame fieldName={"Rate:"}>
              <NumericInput
                name={"rate"}
                value={
                  userRoles.includes(
                    process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
                  )
                    ? customEmployeeData.rate
                    : " - "
                }
                updateState={setCustomEmployeeData}
                style="small"
                allowDecimals={true}
                disabled={
                  !userRoles.includes(
                    process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
                  )
                }
              />
              {customEmployeeData.rate !== userData.rate && (
                <Button
                  style={"iconButton"}
                  fn={() => handleCustomFieldSave("rate")}
                  content={<FontAwesomeIcon icon={faCheck} />}
                  tooltipContent={"Save"}
                  tooltipId={`save_new_rate_tooltip`}
                />
              )}
              {userData.rate.length === 0 && (
                <div className="flex items-center justify-center self-center">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-red-600 text-xs"
                  />
                </div>
              )}
            </CheckListFieldFrame>
            <CheckListFieldFrame fieldName={"Immigration Status:"}>
              <OptionsSelector
                value={customEmployeeData.immigration_status}
                updateState={setCustomEmployeeData}
                name={"immigration_status"}
                data={IMMIGRATION_STATUS}
                style={"small"}
              />
              {customEmployeeData.immigration_status !==
                userData.immigration_status && (
                <Button
                  style={"iconButton"}
                  fn={() => handleCustomFieldSave("immigration_status")}
                  content={<FontAwesomeIcon icon={faCheck} />}
                  tooltipContent={"Save"}
                  tooltipId={`save_new_immigration_status_tooltip`}
                />
              )}
              {userData.immigration_status.length === 0 && (
                <div className="flex items-center justify-center self-center">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-red-600 text-xs"
                  />
                </div>
              )}
            </CheckListFieldFrame>
          </>
          {fieldsList}
        </div>
        {buttonsToShow && (
          <div className="flex gap-3 justify-end items-center p-3">
            {(userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR
              )) &&
              buttonsToShow.acd && (
                <Button
                  content={"Allow Changes For Employee"}
                  style={"classicButton"}
                  fn={() => handleStatusChange("NW")}
                />
              )}
            {(userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR
              )) &&
              buttonsToShow.sdt && (
                <Button
                  content={"Set Employee To Trainee"}
                  style={"classicButton"}
                  fn={() => handleStatusChange("TR")}
                  disabled={!allChecked}
                  tooltipId={"set_employee_to_trainee_button_tooltip"}
                  tooltipContent={
                    !allChecked && <p>Please check all documents first</p>
                  }
                />
              )}
            {(userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR
              )) &&
              buttonsToShow.sda && (
                <Button
                  content={"Set employee To Active"}
                  style={"classicButton"}
                  fn={() => handleStatusChange("AC")}
                  disabled={!readyToActive}
                  tooltipId={"set_employee_to_active_button_tooltip"}
                  tooltipContent={
                    !readyToActive && <p>Please check all documents first</p>
                  }
                />
              )}
            {(userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR
              )) &&
              buttonsToShow.rcd && (
                <>
                  <Button
                    content={"Request Change From Employee"}
                    style={"classicButton"}
                    fn={() => setShowMessageToEmployeeModal(true)}
                    disabled={userData.update_status === "UR"}
                    tooltipId={"request_change_from_employee_button_tooltip"}
                    tooltipContent={
                      userData.update_status === "UR"
                        ? "Change has been requested"
                        : ""
                    }
                  />
                  <ModalContainer modalIsOpen={showMessageToEmployeeModal}>
                    <TextareaInput
                      name={"update_status_message"}
                      label={"Message for employee"}
                      value={messageToEmployee}
                      updateState={setMessageToEmployee}
                    />
                    <div className="flex justify-between items-center">
                      <Button
                        content={"Cancel"}
                        style={"classicButton"}
                        fn={() => setShowMessageToEmployeeModal(false)}
                      />
                      <Button
                        content={"Send"}
                        style={"classicButton"}
                        fn={handleUpdateStatusChange}
                        highlighted={true}
                        disabled={messageToEmployee.length === 0}
                        tooltipId={"update_status_message_tooltip"}
                        tooltipContent={
                          messageToEmployee.length === 0
                            ? "Please input the message for employee first"
                            : "Send message to employee and save data"
                        }
                      />
                    </div>
                  </ModalContainer>
                </>
              )}
            {(userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_ADMIN
            ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL_MANAGER
              ) ||
              userRoles.includes(
                process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR
              )) &&
              buttonsToShow.rfo && (
                <Button
                  content={"Ready for Orientation"}
                  style={"classicButton"}
                  fn={() => handleStatusChange("RO")}
                  disabled={!allChecked}
                  tooltipId={"ro_button_tooltip"}
                  tooltipContent={
                    !allChecked && <p>Please check all documents first</p>
                  }
                />
              )}
          </div>
        )}
      </>
    )
  );
}

export default EmployeeChecklist;
