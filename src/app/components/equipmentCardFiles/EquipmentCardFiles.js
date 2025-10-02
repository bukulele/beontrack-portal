import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import findHighestIdObject from "@/app/functions/findHighestIdObject";
import Link from "next/link";
import Button from "../button/Button";
import ModalContainer from "../modalContainer/ModalContainer";
import formatDate from "@/app/functions/formatDate";
import { EquipmentContext } from "@/app/context/EquipmentContext";
import extractFileNameFromURL from "@/app/functions/extractFileNameFromURL";

function EquipmentCardFiles({ header, fields }) {
  const [isOpen, setIsOpen] = useState(false);
  const [docsList, setDocsList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { equipmentData } = useContext(EquipmentContext);

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
    if (!equipmentData) return;
    let list = Object.values(fields).map((field) => {
      if (!equipmentData[field.key] || equipmentData[field.key].length === 0)
        return null;

      return (
        <div
          key={field.key}
          className="flex h-11 gap-1 px-2 py-1 border-b border-slate-300 justify-between items-center"
        >
          <Link
            href={"#"}
            className="font-semibold capitalize"
            onClick={() => handleModalOpening(field.key)}
          >
            {field.key === "equipment_license_plates"
              ? field.name +
                ": " +
                findHighestIdObject(equipmentData[field.key]).plate_number
              : field.name}
          </Link>
          {findHighestIdObject(equipmentData[field.key]).expiry_date ? (
            <div className="w-fit">
              <p className="text-right text-xs font-light text-slate-300">
                Expiry date
              </p>
              <p className="text-right">
                {formatDate(
                  findHighestIdObject(equipmentData[field.key]).expiry_date
                )}
              </p>
            </div>
          ) : findHighestIdObject(equipmentData[field.key]).issue_date ? (
            <div className="w-fit">
              <p className="text-right text-xs font-light text-slate-300">
                Issue date
              </p>
              <p className="text-right">
                {formatDate(
                  findHighestIdObject(equipmentData[field.key]).issue_date
                )}
              </p>
            </div>
          ) : null}
        </div>
      );
    });
    setDocsList(list);
  }, [equipmentData]);

  return (
    equipmentData && (
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
            {modalContent.length &&
              equipmentData[modalContent]
                .sort((a, b) => b.id - a.id)
                .map((item, itemIndex) => {
                  return (
                    <Link
                      target="_blank"
                      className="border rounded border-gray-300 p-2"
                      href={item.file || "#"}
                      key={`document_${itemIndex}`}
                    >
                      <p className="font-semibold m-0 capitalize">
                        {item?.comment?.length
                          ? item.comment
                          : item.file
                          ? extractFileNameFromURL(item.file)
                          : item.plate_number
                          ? item.plate_number
                          : "Document_" + (itemIndex + 1)}
                      </p>
                    </Link>
                  );
                })}
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

export default EquipmentCardFiles;
