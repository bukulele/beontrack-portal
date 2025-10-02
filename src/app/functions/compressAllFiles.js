import convertHeicToJpeg from "./convertHeicToJpeg";
import compressFile from "./compressFile";

const compressAllFiles = async (files) => {
  const compressedFiles = [];
  for (let file of files) {
    try {
      let compressedFile = null;
      if (file.type === "image/heic" || file.type === "image/heif") {
        file = await convertHeicToJpeg(file);
        compressedFile = await compressFile(file);
      } else {
        compressedFile = file;
      }
      // const compressedFile = await compressFile(file);
      compressedFiles.push(compressedFile);
    } catch (error) {
      console.error("Compression error:", error);
    }
  }
  return compressedFiles;
};

export default compressAllFiles;
