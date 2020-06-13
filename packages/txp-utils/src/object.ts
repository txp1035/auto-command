/**
 * 描述：过滤对象，过滤掉值为null、undefined、NaN的键
 * @author ShawDanon
 * @date 2020-06-13
 * @param {any} param:需要过滤的对象
 * @param {any} fun:扩展过滤的方法
 * @param {any} key?:string
 * @param {any} obj?:object
 * @returns {any}
 */
export function filterObj(
  param: object,
  fun?: (value: any, key?: string, obj?: object) => boolean,
) {
  const obj = {};
  Object.entries(param).forEach(([key, value]) => {
    // 默认过滤
    if (value !== null && value !== undefined && !Number.isNaN(value)) {
      obj[key] = value;
    }
    // 扩展过滤
    if (fun && fun(value, key, param)) {
      obj[key] = value;
    }
  });
  return obj;
}

/**
 * 描述
 * @author ShawDanon
 * @date 2020-06-13
 * @param {any} obj:对象值,如：obj
 * @param {any} str:链式字符串，如：obj.a.b.c
 * @returns {any}
 */
export function getChainObj(obj: object, str: string) {
  const arr = str.split('.');
  let value: any = obj;
  try {
    arr.forEach((element, index) => {
      if (index > 0) {
        if (value[element] !== undefined) {
          value = value[element];
        } else {
          throw new Error('访问的值为undefined');
        }
      }
    });
  } catch (error) {
    value = '';
    console.error(`访问对象:${str}错误`, `错误信息:${error}`);
  }
  return value;
}
