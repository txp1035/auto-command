import { range } from 'txp/util/lodash';
import { transformFrequency, transformBase } from './transform';
import { transformRange } from './utils';

export function translateBase(params: string) {
  const obj = transformBase(params);
  const { isCommon, list } = obj;
  if (isCommon) {
    return '';
  }
  // 分类list：指定类、段时间类、步长类
  const appoints = [];
  const ranges = [];
  const steps = [];
  list.forEach(element => {
    if (typeof element === 'string') {
      appoints.push(element);
    }
    if (element.step) {
      steps.push(element);
    }
    ranges.push(element);
  });
  // 打散range合并为指定
  const newAppoints = transformRange([...appoints, ...ranges]);
}
export function translate(params: string, options: object) {
  const obj = transformFrequency(params);
  if (!obj) {
    return 'cron表达式不合法';
  }
  const { second, minute, hour, day, moth, week, year } = obj;
  return 123;
}
