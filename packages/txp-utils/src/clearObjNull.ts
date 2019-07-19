export default function (object: {}) {
  const obj = {};
  Object.keys(object).forEach(key => {
    const element = object[key];
    if (element) {
      obj[key] = element;
    }
  });
  return obj;
}
