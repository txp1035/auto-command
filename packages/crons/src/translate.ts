import { transformFrequency, transformBase, base, range } from './transform';
import { transformRange } from './utils';

const translateEmum = {
  '0 0 0 * * ? *': '每天',
  '0 0 * * * ? *': '每一小时',
  '0 * * * * ? *': '每一分钟',
  '* * * * * ? *': '每秒',
};

export function translateBase(params: string, unit: string = '') {
  const obj = transformBase(params) as base;
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
    if (typeof element === 'object' && element.step) {
      steps.push(element);
    }
    if (typeof element === 'object' && !element.step) {
      ranges.push(element);
    }
  });
  // 获得不带步长的值
  const newAppoints = transformRange([...appoints, ...ranges]);
  const newSteps: { [key: string]: range[] } = {};
  // 分类步长[{step:2},{step:2},{step:3}]->{2:[{},{}],3:[{}]}
  steps.forEach(element => {
    if (element.step in newSteps) {
      newSteps[element.step].push(element);
    } else {
      newSteps[element.step] = [element];
    }
  });
  // 去重处理
  Object.entries(newSteps).forEach(([key, value]) => {
    newSteps[key] = transformRange(value);
  });
  // 翻译
  const appointStr = newAppoints.reduce((pre, cur, index, arr) => {
    if (typeof cur === 'string') {
      return `${pre}、${cur}${unit}`;
    }
    if (index === arr.length - 1) {
      return `${pre}从${cur.start}到${cur.end}${unit};`;
    }
    return `${pre}从${cur.start}到${cur.end}${unit}、`;
  }, '');
  const stepStr = Object.entries(newSteps).reduce((pre, [step, cur], index, arr) => {
    const str = cur.reduce((pres, curs, indexs, arrs) => {
      if (indexs === arrs.length - 1 && index === arr.length - 1) {
        return `${pres}从${curs.start}到${curs.end}每${step}${unit};`;
      }
      return `${pres}从${curs.start}到${curs.end}每${step}${unit}、`;
    }, '');
    return `${pre}${str}`;
  }, '');
  return appointStr + stepStr;
}
export function translateSecond(params: string) {
  return translateBase(params, '秒');
}
export function translateMinute(params: string) {
  return translateBase(params, '分');
}
export function translateHour(params: string) {
  return translateBase(params, '小时');
}
export function translateDay(params: string) {
  if (params === '?') {
    return '';
  }
  if (params === 'L') {
    return '本月最后一天';
  }
  const weekReg = /^([1-9][0-9]*)W$/;
  if (weekReg.test(params)) {
    return `离${(weekReg.exec(params) as string[])[1]}日最近的工作日`;
  }
  return translateBase(params, '天');
}
export function translateMoth(params: string) {
  return translateBase(params, '月');
}
export function translateWeek(params: string) {
  if (params === '?') {
    return '';
  }
  const appointReg = /^(1-7)#(1-5)$/;
  if (appointReg.test(params)) {
    return `第${(appointReg.exec(params) as string[])[2]}周的周${
      (appointReg.exec(params) as string[])[1]
    }`;
  }
  const lastReg = /^([1-7])L$/;
  if (lastReg.test(params)) {
    return `最后一周的周${(lastReg.exec(params) as string[])[1]}`;
  }
  return translateBase(params, '周');
}
export function translateYear(params: string) {
  return translateBase(params, '年');
}

/**
 * 描述
 * @author ShawDanon
 * @date 2020-06-18
 * @param {any} params:string
 * @param {any} options:语言配置
 * @returns {any}
 */
export default function translate(params: string, options: object) {
  const obj = transformFrequency(params);
  if (!obj) {
    return 'cron表达式不合法';
  }
  // 枚举匹配
  if (translateEmum[params]) {
    return translateEmum[params];
  }
  // 通用匹配
  const { second, minute, hour, day, moth, week, year } = obj;
  return `${translateSecond(second)} ${translateMinute(minute)} ${translateHour(
    hour,
  )} ${translateDay(day)} ${translateMoth(moth)} ${translateWeek(week)} ${translateYear(year)}`;
}
