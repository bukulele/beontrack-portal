"use client";

const isClient = typeof window !== "undefined";
let heic2any;
if (isClient) {
  heic2any = require("heic2any");
}

const convertHeicToJpeg = (file) => {
  return heic2any({ blob: file, toType: "image/jpeg" }).then(
    (convertedBlob) => {
      // Create a new File object to preserve the name
      const convertedFile = new File(
        [convertedBlob],
        file.name.replace(/\.\w+$/, ".jpeg"),
        {
          type: "image/jpeg",
          lastModified: file.lastModified,
        }
      );
      return convertedFile;
    }
  );
};

export default convertHeicToJpeg;
