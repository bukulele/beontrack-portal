import { DriverContext } from "@/app/context/DriverContext";
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import Link from "next/link";
import Button from "../button/Button";
import ModalContainer from "../modalContainer/ModalContainer";
import useUserRoles from "@/app/functions/useUserRoles";
import extractFileNameFromURL from "@/app/functions/extractFileNameFromURL";
import defineDateBlock from "@/app/functions/defineDateBlock";
import sortObjectsByDateOrId from "@/app/functions/sortObjectsByDateOrId";
import checkNumericInput from "@/app/functions/checkNumericInput";

function DriverCardFiles({ header, fields }) {
  const [isOpen, setIsOpen] = useState(false);
  const [docsList, setDocsList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { userData } = useContext(DriverContext);

  const userRoles = useUserRoles();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const variants = {
    open: { height: "auto", opacity: 1 },
    closed: { height: 0, opacity: 0 },
  };

  const handleModalOpening = (field) => {
    setModalOpen(true);
    setModalContent(field);
  };

  const handleModalClosing = () => {
    setModalOpen(false);
    setModalContent("");
  };

  useEffect(() => {
    if (!userData) return;
    let list = fields.map((field) => {
      if (!userData[field] || userData[field].length === 0) return null;

      let fieldName = "";

      // DEFINE FIELD NAMES
      if (field === "licenses") {
        fieldName = `DL: ${findHighestIdObject(userData[field]).dl_number}`;
      } else if (field === "rates_ca_single") {
        fieldName = `CA single rate: ${userData[field]}`;
      } else if (field === "rates_ca_team") {
        fieldName = `CA team rate: ${userData[field]}`;
      } else if (field === "rates_city") {
        fieldName = `City rate: ${userData[field]}`;
      } else if (field === "rates_lcv_single") {
        fieldName = `LCV single rate: ${userData[field]}`;
      } else if (field === "rates_lcv_team") {
        fieldName = `LCV team rate: ${userData[field]}`;
      } else if (field === "rates_us_team") {
        fieldName = `US team rate: ${userData[field]}`;
      } else if (field === "gst_docs") {
        fieldName = "GST Docs";
      } else if (field === "tdg_cards") {
        fieldName = "TDG Cards";
      } else if (field === "lcv_certificates") {
        fieldName = "LCV Certificates";
      } else if (field === "us_visas") {
        fieldName = "US Visas";
      } else if (field === "sin") {
        fieldName = `SIN: ${checkNumericInput(
          findHighestIdObject(userData[field]).number
        )}`;
      } else if (field === "lcv_licenses") {
        fieldName = "LCV Licenses";
      } else if (field === "pdic_certificates") {
        fieldName = "PDIC Certificates";
      } else if (field === "gtg_quizes") {
        fieldName = "GTG Quizes";
      } else if (field === "annual_performance_reviews") {
        fieldName = "Annual perf. review";
      } else {
        let fieldArr = field.split("_");
        fieldName = fieldArr.join(" ");
      }

      if (
        field.includes("rates_") &&
        !userRoles.includes(
          process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
        ) &&
        !userRoles.includes(process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR)
      ) {
        return null;
      }

      return (
        <div
          key={field}
          className="flex h-11 gap-1 px-2 py-1 border-b border-slate-300 justify-between items-center"
        >
          {field.includes("rates_") ? (
            <p className="font-semibold capitalize">{fieldName}</p>
          ) : field === "sin" &&
            !userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_PAYROLL
            ) &&
            !userRoles.includes(
              process.env.NEXT_PUBLIC_AZURE_ROLE_PORTAL_HR
            ) ? (
            <p className="font-semibold capitalize">{fieldName}</p>
          ) : (
            <Link
              href={"#"}
              className="font-semibold capitalize"
              onClick={() => handleModalOpening(field)}
            >
              {fieldName}
            </Link>
          )}
          {(header === "Docs & Dates" || header === "Driver Docs") &&
            defineDateBlock(userData[field])}
        </div>
      );
    });
    setDocsList(list);
  }, [userData, userRoles]);

  return (
    userData && (
      <div className="border-x border-t border-slate-300 shadow">
        <div
          onClick={handleClick}
          className="p-2 flex gap-2 items-center border-b border-slate-300 cursor-pointer select-none"
        >
          <FontAwesomeIcon
            className="text-lg"
            icon={isOpen ? faCircleMinus : faCirclePlus}
          />
          <p className="text-lg font-semibold">{header}</p>
        </div>
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={variants}
          transition={{ duration: 0.1 }}
          className="flex flex-col overflow-hidden"
        >
          {docsList}
        </motion.div>
        <ModalContainer modalIsOpen={modalOpen}>
          <>
            {modalContent === "activity_history" &&
            userData.activity_history.length > 0
              ? userData.activity_history.map((item, itemIndex) => (
                  <div
                    key={`activity_${itemIndex}`}
                    className="border rounded border-gray-300 p-2"
                  >
                    {Object.entries(item).map(([key, value], index) => {
                      if (!value || key === "id" || key === "driver") return;

                      let fieldName = "";
                      let keyArr = key.split("_");
                      fieldName = keyArr.join(" ");
                      return (
                        <div
                          className="flex items-center gap-2"
                          key={`employer_${key}_${index}`}
                        >
                          <p className="font-semibold m-0 capitalize">
                            {fieldName}:
                          </p>
                          <p className="m-0">
                            {value === true ? "Yes" : value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ))
              : modalContent.length > 0
              ? sortObjectsByDateOrId(userData[modalContent]).map(
                  (item, itemIndex) => {
                    return (
                      <div
                        key={`${modalContent}_${itemIndex}`}
                        className="flex h-11 gap-5 px-2 py-1 border-b border-slate-300 justify-between items-center"
                      >
                        <Link
                          href={item.file}
                          target="_blank"
                          className="font-semibold capitalize"
                        >
                          {item.dl_number
                            ? item.dl_number
                            : item.number
                            ? item.number
                            : item.comment
                            ? item.comment
                            : item.company
                            ? item.company
                            : extractFileNameFromURL(item.file)}
                        </Link>
                        {defineDateBlock(item)}
                      </div>
                    );
                  }
                )
              : null}
            <Button
              content={"Close"}
              style={"classicButton"}
              fn={handleModalClosing}
            />
          </>
        </ModalContainer>
      </div>
    )
  );
}

export default DriverCardFiles;
