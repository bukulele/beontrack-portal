import { useState } from "react";
import Button from "../button/Button";
import FileLoaderMultipleM from "../fileLoader/FileLoaderMultipleM";
import { useLoader } from "@/app/context/LoaderContext";
import ModalContainer from "../modalContainer/ModalContainer"; // ← NEW

function SealsUploader({ closeModal, loadData }) {
  const [sealsFiles, setSealsFiles] = useState({});
  const [fileSent, setFileSent] = useState(false);
  const [uploadError, setUploadError] = useState(""); // ← NEW

  const { startLoading, stopLoading } = useLoader();

  const uploadFiles = () => {
    startLoading();
    const data = new FormData();
    data.append("file", sealsFiles.seals[0]);

    fetch("/api/upload-seals-file", {
      method: "POST",
      body: data,
    })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
          // Prefer humanized messages from the API route
          if (
            Array.isArray(body?.error_messages) &&
            body.error_messages.length > 0
          ) {
            throw new Error(body.error_messages.join("; "));
          }

          // Fall back to machine errors or single error field
          const errors = body?.errors || {};
          const errorMsg =
            Object.keys(errors).length > 0
              ? JSON.stringify(errors)
              : body?.error || "Upload failed";

          throw new Error(errorMsg);
        }

        setFileSent(true);
      })
      .catch((error) => {
        console.error("Error sending files:", error);
        setUploadError(error.message || "Error sending files"); // ← show in modal
      })
      .finally(() => stopLoading());
  };

  const closeLoadFileModal = () => {
    setFileSent(false);
    closeModal();
    loadData();
  };

  return fileSent ? (
    <>
      <p>File sent successfully</p>
      <Button content={"OK"} style={"classicButton"} fn={closeLoadFileModal} />
    </>
  ) : (
    <>
      <p className="font-bold text-xl text-center">Upload Seals CSV File</p>
      <FileLoaderMultipleM
        name={"seals"}
        accept={".csv"}
        updateState={setSealsFiles}
        data={sealsFiles.seals || []}
      />
      <div className="flex justify-between items-center">
        <Button content={"Close"} fn={closeModal} style={"classicButton"} />
        <Button
          content={"Upload"}
          style={"classicButton"}
          fn={uploadFiles}
          tooltipContent={
            Object.keys(sealsFiles).length === 0 && (
              <p>Please attach the file(s) first</p>
            )
          }
          tooltipId={"upload_seals_files_tooltip"}
          highlighted={Object.keys(sealsFiles).length > 0}
          disabled={Object.keys(sealsFiles).length === 0}
        />
      </div>

      {/* Error Modal (additional) */}
      {uploadError && (
        <ModalContainer modalIsOpen={true}>
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Upload Failed
          </h2>
          <p className="mb-4 break-words whitespace-pre-wrap">{uploadError}</p>
          <div className="flex justify-end">
            <Button
              content="Close"
              style="classicButton"
              fn={() => setUploadError("")}
            />
          </div>
        </ModalContainer>
      )}
    </>
  );
}

export default SealsUploader;
