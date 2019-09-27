function isValidKey(key: string, obj: {}): key is keyof typeof obj {
  return key in obj;
}
export default function main(object: {}) {
  const obj = object;
  Object.keys(object).forEach(key => {
    const element = isValidKey(key, object) && object[key];
    if (element === null) {
      if (isValidKey(key, object)) delete obj[key];
    }
  });
  return obj;
}
