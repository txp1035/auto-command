function isValidKey(key: string, obj: {}): key is keyof typeof obj {
  return key in obj;
}

export function clearObjNull(object: {}) {
  const obj = object;
  Object.keys(object).forEach(key => {
    const element = isValidKey(key, object) && object[key];
    if (element === null) {
      if (isValidKey(key, object)) delete obj[key];
    }
  });
  return obj;
}

export function hasObj(obj: Object, str: string) {
  const arr = str.split('.');
  let value = obj;
  try {
    arr.forEach((element, index) => {
      if (index > 0) {
        if (value[element] !== undefined) {
          value = value[element];
        } else {
          throw new Error('对象错误');
        }
      }
    });
  } catch (error) {
    value = '';
    // console.log(`访问对象:${str}错误`, obj);
  }
  return value;
}
