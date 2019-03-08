export default function(object) {
  const obj = {};
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const element = object[key];
      if (element) {
        obj[key] = element;
      }
    }
  }
  return obj;
}
