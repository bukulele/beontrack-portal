import React, { useState, useEffect } from "react";
import Button from "../button/Button";
import DateInput from "../dateInput/DateInput";
import { useLoader } from "@/app/context/LoaderContext";
import ModalContainer from "../modalContainer/ModalContainer";
import compressFile from "@/app/functions/compressFile";
import convertHeicToJpeg from "@/app/functions/convertHeicToJpeg";
import TextInput from "../textInput/TextInput";
import OptionsSelector from "../optionsSelector/OptionsSelector";
import { CANADIAN_PROVINCES } from "@/app/assets/tableData";
import NumericInput from "../numericInput/NumericInput";
import defineMinDate from "@/app/functions/defineMinDate";
import { useSession } from "next-auth/react";

function FileLoader({
  driverId,
  data,
  apiRoute,
  keyName,
  label,
  checkAllFields,
  accept,
  issueDateOn,
  expiryDateOn,
  commentOn,
  numberOn,
  file2On,
  numberAnyOn,
  dLProvinceOn,
  dateOfReviewOn,
  dateOfCompletionOn,
  companyOn,
  loadData,
}) {
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileSent, setFileSent] = useState(false);
  const [fileIssueDate, setFileIssueDate] = useState("");
  const [fileExpiryDate, setFileExpiryDate] = useState("");
  const [comment, setComment] = useState("");
  const [number, setNumber] = useState("");
  const [numberAny, setNumberAny] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [dateOfReview, setDateOfReview] = useState("");
  const [dateOfCompletion, setDateOfCompletion] = useState("");
  const [company, setCompany] = useState("");
  const [checkSubmitAvailable, setCheckSubmitAvailable] = useState(false);
  const [warned, setWarned] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { startLoading, stopLoading } = useLoader();
  const { data: session } = useSession();

  const closeLoadFileModal = () => {
    setFileSent(false);
    setModalIsOpen(false);
  };

  const handleFileChange = async (event) => {
    startLoading();
    const { name, files } = event.target;
    const file = files[0];
    let processedFile = file;

    try {
      if (file.type.startsWith("image/")) {
        if (file.type === "image/heic" || file.type === "image/heif") {
          processedFile = await convertHeicToJpeg(file);
        }
        processedFile = await compressFile(processedFile);
      }

      if (name === keyName) {
        setFile(processedFile);
      }

      if (name === `${keyName}2`) {
        setFile2(processedFile);
      }
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      stopLoading();
    }
  };

  const uploadFile = () => {
    startLoading();
    const data = new FormData();

    data.append("file", file);
    data.append("driver", driverId);
    data.append("last_changed_by", session.user.name);
    data.append("endpointIdentifier", keyName);

    if (file2On) {
      data.append("file2", file2);
    }

    if (dLProvinceOn) {
      data.append("dl_number", numberAny);
      data.append("dl_province", selectedProvince);
    }

    if (commentOn) {
      data.append("comment", comment);
    }

    if (numberOn) {
      data.append("number", number);
    }

    if (numberAnyOn && !dLProvinceOn) {
      data.append("number", numberAny);
    }

    if (dateOfReviewOn) {
      // data.append("date_of_review", dateOfReview);
      data.append("issue_date", dateOfReview);
    }
    if (dateOfCompletionOn) {
      // data.append("date_of_completion", dateOfCompletion);
      data.append("issue_date", dateOfCompletion);
    }

    if (companyOn) {
      data.append("company", company);
    }

    if (issueDateOn) {
      data.append("issue_date", fileIssueDate);
    }

    if (expiryDateOn) {
      data.append("expiry_date", fileExpiryDate);
    }

    fetch(apiRoute, {
      method: "POST",
      body: data,
    })
      .then((response) => {
        stopLoading();
        if (response.ok) {
          loadData();
          setFileSent(true);
        } else {
          console.error("Error submitting form");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  useEffect(() => {
    let submitAvailable = true;
    if (
      (issueDateOn && fileIssueDate.length === 0) ||
      (expiryDateOn && fileExpiryDate.length === 0) ||
      (commentOn && comment.length === 0) ||
      (numberOn && number.length === 0) ||
      (file2On && !file2) ||
      (numberAnyOn && numberAny.length === 0) ||
      (dLProvinceOn && selectedProvince.length === 0) ||
      (dateOfReviewOn && dateOfReview.length === 0) ||
      (dateOfCompletionOn && dateOfCompletion.length === 0) ||
      (companyOn && company.length === 0) ||
      !file
    ) {
      submitAvailable = false;
    }

    setCheckSubmitAvailable(submitAvailable);
  }, [
    file,
    fileIssueDate,
    fileExpiryDate,
    comment,
    number,
    file2,
    numberAny,
    selectedProvince,
    dateOfReview,
    dateOfCompletion,
    company,
  ]);

  useEffect(() => {
    if (file === null && checkAllFields) {
      setWarned(true);
    } else {
      setWarned(false);
    }
  }, [checkAllFields, file]);

  useEffect(() => {
    if (!data) return;

    if (data.file) {
      let fileName = "";
      let fileNameArr = data.file.split("/");
      fileName = fileNameArr[fileNameArr.length - 1];
      setFile(fileName);
    }

    if (file2On && data.file2) {
      let fileName2 = "";
      let fileNameArr2 = data.file2.split("/");
      fileName2 = fileNameArr2[fileNameArr2.length - 1];
      setFile2(fileName2);
    }
  }, [data]);

  return (
    <div
      className={`flex flex-col border shadow-inner rounded px-5 pb-5 ${
        warned ? "border-pink-500" : ""
      }`}
    >
      <h4>
        {label}
        {checkAllFields !== undefined ? "*" : ""}
      </h4>
      {file ? (
        <div className="flex gap-1">
          <p className="font-medium m-0">File loaded:</p>
          <p className="break-all m-0">{file.name}</p>
          {file2 && file2.name && <p className="break-all m-0">{file2.name}</p>}
        </div>
      ) : (
        <p>No file loaded</p>
      )}
      <Button
        content={"Load file"}
        style={"classicButton"}
        fn={() => setModalIsOpen(true)}
      />
      <ModalContainer modalIsOpen={modalIsOpen}>
        {fileSent ? (
          <>
            <p>File sent successfully</p>
            <Button
              content={"OK"}
              style={"classicButton"}
              fn={closeLoadFileModal}
            />
          </>
        ) : (
          <div className="prose flex flex-col gap-2">
            <h4 className="text-center">{label}</h4>
            {numberAnyOn && (
              <TextInput
                name={`${keyName}_number_any`}
                label={"Please, enter the number of document"}
                value={numberAny}
                updateState={setNumberAny}
              />
            )}
            {dLProvinceOn && (
              <OptionsSelector
                value={selectedProvince}
                updateState={setSelectedProvince}
                label={"Choose a province:"}
                name={"province"}
                data={CANADIAN_PROVINCES}
              />
            )}
            {issueDateOn && (
              <DateInput
                name={`date${keyName}`}
                label={"Please, enter the issue date of document"}
                value={fileIssueDate}
                updateState={setFileIssueDate}
                maxDate={defineMinDate(0)}
              />
            )}
            {expiryDateOn && (
              <DateInput
                name={`date${keyName}`}
                label={"Please, enter the expiry date of document"}
                value={fileExpiryDate}
                updateState={setFileExpiryDate}
                minDate={defineMinDate(-5)}
              />
            )}
            {commentOn && (
              <TextInput
                name={"comment"}
                label={"Comment"}
                value={comment}
                updateState={setComment}
              />
            )}
            {numberOn && (
              <NumericInput
                name={`${keyName}_number`}
                label={"Please enter the number of document"}
                value={number}
                updateState={setNumber}
                formatted={true}
                max={9}
              />
            )}
            {companyOn && (
              <TextInput
                name={"company"}
                label={"Company"}
                value={company}
                updateState={setCompany}
              />
            )}
            <input
              className="rounded border-gray-300"
              id={keyName}
              name={keyName}
              type={"file"}
              onChange={handleFileChange}
              accept={accept}
            />
            {file2On && (
              <input
                className="rounded border-gray-300"
                id={`${keyName}2`}
                name={`${keyName}2`}
                type={"file"}
                onChange={handleFileChange}
                accept={accept}
              />
            )}
            {dateOfReviewOn && (
              <DateInput
                name={`review_date_${keyName}`}
                label={"Please, enter the date of review"}
                value={dateOfReview}
                updateState={setDateOfReview}
              />
            )}
            {dateOfCompletionOn && (
              <DateInput
                name={`completion_date_${keyName}`}
                label={"Please, enter the date of completion"}
                value={dateOfReview}
                updateState={setDateOfCompletion}
              />
            )}
            <div className="flex gap-3 mt-3">
              <Button
                content={"Close"}
                style={"classicButton"}
                fn={closeLoadFileModal}
              />
              <Button
                content={"Send file"}
                style={"classicButton"}
                fn={uploadFile}
                disabled={!checkSubmitAvailable}
              />
            </div>
          </div>
        )}
      </ModalContainer>
    </div>
  );
}

export default FileLoader;
