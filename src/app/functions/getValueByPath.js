function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : ""), obj);
}

export default getValueByPath;
