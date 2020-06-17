import lodash from 'txp/util/lodash';
import { range } from './transform';

export type cronType = 'linux' | 'spring' | 'quartz';

/**
 * 描述:把数组里的除''和NaN的字符串和数字连接成字符串
 * @author ShawDanon
 * @date 2020-06-13
 * @param {any} list:any[]=[]
 * @param {any} mark:string='_'
 * @returns {any}
 */
export function join(list: any[] = [], mark: string = '_'): string {
  const arr = list.filter(item => {
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

/**
 * 描述：输入字符正确的corn字符串得到类型
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:string
 * @returns {any}
 */
export function getType(params: string): cronType | '' {
  const { length } = params.split(' ');
  if (length === 5) {
    return 'linux';
  }
  if (length === 6) {
    return 'spring';
  }
  if (length === 7) {
    return 'quartz';
  }
  return '';
}

export function transformRange(params: (string | number | range)[], length: number = 2) {
  let arr = [];
  // 转换为指定
  params.forEach(element => {
    if (typeof element === 'string' || typeof element === 'number') {
      arr.push(Number(element));
    } else {
      arr = arr.concat(lodash.range(Number(element.start), Number(element.end) + 1));
    }
  });
  // 去重
  arr = removal(arr);
  // 排序
  arr = arr.sort((a, b) => Number(a) - Number(b));
  // 分组[1,2,3,5,6]->[[1,2,3],[5,6]]
  arr = arr.reduce(
    (pre, cur) => {
      const last = pre[pre.length - 1];
      const lastStr = last[last.length - 1];
      if (cur === lastStr + 1) {
        pre.pop();
        return [...pre, [...last, cur]];
      }
      return [...pre, [cur]];
    },
    [[]],
  );
  // 分组中元素大于2才转换成对象[1,2,3]->{start:1,end:3}
  const rangeArr = [];
  const appointArr = [];
  arr.forEach(element => {
    if (element.length > length) {
      rangeArr.push(element);
    } else {
      appointArr.push(element);
    }
  });
  const newArr = [
    ...appointArr.flat(),
    ...rangeArr.map(item => ({ start: item[0], end: item[item.length - 1] })),
  ];
  return newArr;
}

export function removal(list: (string | { key: string })[], key?: string) {
  // 对象去重
  if (key) {
    return list.filter(
      (item, index, arr) =>
        typeof item === 'object' &&
        arr.findIndex(childItem => childItem[key] === item.key) === index,
    );
  }
  // 字符串去重
  return [...new Set(list)];
}
