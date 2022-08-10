/** 对象类 start */
/**
 * 描述：过滤对象，过滤掉值为null、undefined、NaN的键
 * @author DaoYuan
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
  const obj: Record<string, any> = {};
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
 * @author DaoYuan
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
/** 对象类 end */
/** 数组类 start */
export function removal(
  list: (string | Record<string, string | number | boolean>)[],
  key?: string,
) {
  // 对象去重
  if (key) {
    return list.filter(
      (item, index, arr) =>
        typeof item === 'object' &&
        arr.findIndex((childItem: any) => childItem[key] === item.key) === index,
    );
  }
  // 字符串去重
  return [...new Set(list)];
}
/** 数组类 start */
/** 其他类 start */
/**
 * 描述:把数组里的除''和NaN的字符串和数字连接成字符串
 * @author DaoYuan
 * @date 2020-06-13
 * @param {any} list:any[]=[]
 * @param {any} mark:string='_'
 * @returns {any}
 */
export function join(list: any[] = [], mark: string = '_'): string {
  const arr = list.filter((item) => {
    if (typeof item === 'string' || typeof item === 'number') {
      if (item === '' || Number.isNaN(item)) {
        return false;
      }
      return true;
    }
    return false;
  });
  const str = arr.join(mark);
  return str;
}
export type jsType =
  | 'Number' // 原始类型
  | 'String' // 原始类型
  | 'Boolean' // 原始类型
  | 'Null' // 原始类型
  | 'Undefined' // 原始类型
  | 'Symbol' // 原始类型
  | 'BigInt' // 原始类型
  | 'Object'
  | 'Function'
  | 'Array'
  | 'Date';

/**
 * 描述 获取数据类型
 * @author DaoYuan
 * @date 2020-06-24
 * @param {any} params:any
 * @returns {any}
 */
export function getType(params: any): jsType {
  const str = Object.prototype.toString.call(params);
  const reg = /\[object ([a-zA-Z]*)\]/;
  // @ts-ignore
  const type = reg.exec(str)[1] as jsType;
  return type;
}
export function contrast(
  [main, assistant]: [Record<string, any>, Record<string, any>],
  fun: (params: any) => any,
) {
  const newMain: Record<string, any> = {};
  const newAssistant: Record<string, any> = {};
  Object.entries(main).map(([key, value]) => {
    if (key in assistant) {
      const [mainValue, assistantValue] = fun([value, assistant[key]]);
      newMain[key] = mainValue;
      newAssistant[key] = assistantValue;
    }
  });
  return [newMain, newAssistant];
}
export function getValidValues(params: any, defaultValues: string = '') {
  if (['', null, NaN, undefined].includes(params)) {
    return defaultValues;
  }
  return params;
}

/** 其他类 end */
export default {
  filterObj,
  getChainObj,
  join,
  removal,
  contrast,
  getValidValues,
};
