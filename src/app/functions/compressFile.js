"use client";

const isClient = typeof window !== "undefined";
let Compressor;
if (isClient) {
  Compressor = require("compressorjs");
}

const compressFile = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      maxWidth: 1280,
      success(result) {
        // Manually set the name property from the original file
        const compressedFile = new File([result], file.name, {
          type: result.type,
          lastModified: result.lastModified,
        });
        resolve(compressedFile);
      },
      error(reject) {
        reject(error);
      },
    });
  });
};

export default compressFile;
