function extractFileNameFromURL(url) {
  let fileNameArr = url.split("/");
  return fileNameArr[fileNameArr.length - 1];
}

export default extractFileNameFromURL;
