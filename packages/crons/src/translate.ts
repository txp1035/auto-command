import { join } from 'txp/util';
import { transformRange } from './utils';
import { transformFrequency, transformBase, base, range } from './transform';
import check from './check';

const defaultTranslateEmum = {
  '0 0 0 * * ? *': '每天',
  '0 0 * * * ? *': '每一小时',
  '0 * * * * ? *': '每一分钟',
  '* * * * * ? *': '每秒',
};

export function translateBase(
  params: string,
  type: string,
  { appointMode, stepMode }: { appointMode?; stepMode? } = {},
) {
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
  // 指定类翻译
  const appointStr = newAppoints.reduce((pre, cur, index, arr) => {
    const curStr = appointMode({ cur, index, arr, type });
    return `${pre}${curStr}`;
  }, '');
  // 步长类翻译
  const stepStr = Object.entries(newSteps).reduce((pre, [step, cur], index, arr) => {
    const str = cur.reduce((pres, curs, indexs, arrs) => {
      const curStr = stepMode({ pres, curs, indexs, arrs, type, step, index, arr });
      return `${pres}${curStr}`;
    }, '');
    return `${pre}${str}`;
  }, '');
  return appointStr + stepStr;
}
export function translateSecond(params: string, translateMode) {
  return translateBase(params, '秒', translateMode);
}
export function translateMinute(params: string, translateMode) {
  return translateBase(params, '分', translateMode);
}
export function translateHour(params: string, translateMode) {
  return translateBase(params, '小时', translateMode);
}
export function translateDay(params: string, translateMode) {
  if (translateMode.day) {
    return translateMode.day(params);
  }
  return translateBase(params, '天', translateMode);
}
export function translateMoth(params: string, translateMode) {
  return translateBase(params, '月', translateMode);
}
export function translateWeek(params: string, translateMode) {
  if (translateMode.week) {
    return translateMode.week(params);
  }
  return translateBase(params, '周', translateMode);
}
export function translateYear(params: string, translateMode) {
  return translateBase(params, '年', translateMode);
}

export interface options {
  translateEmum: {};
  translateMode: {
    week: any;
    day: any;
    appointMode: any;
    stepMode: any;
  };
}
/**
 * 描述
 * @author ShawDanon
 * @date 2020-06-18
 * @param {any} params:string
 * @param {any} options:语言配置
 * @returns {any}
 */
export default function translate(
  params: string,
  {
    translateEmum = {},
    translateMode = {
      week: (str: any) => {
        if (params === '?') {
          return '';
        }
        const appointReg = /^(1-7)#(1-5)$/;
        if (appointReg.test(str)) {
          return `第${(appointReg.exec(str) as string[])[2]}周的周${
            (appointReg.exec(str) as string[])[1]
          }`;
        }
        const lastReg = /^([1-7])L$/;
        if (lastReg.test(str)) {
          return `最后一周的周${(lastReg.exec(str) as string[])[1]}`;
        }
        return '';
      },
      day: (str: any) => {
        if (str === '?') {
          return '';
        }
        if (str === 'L') {
          return '本月最后一天';
        }
        const weekReg = /^([1-9][0-9]*)W$/;
        if (weekReg.test(str)) {
          return `离${(weekReg.exec(str) as string[])[1]}日最近的工作日`;
        }
        return '';
      },
      appointMode: ({ cur, index, arr, type }) => {
        let mark = '、';
        if (index === arr.length - 1) {
          mark = ';';
        }
        if (typeof cur === 'string' || typeof cur === 'number') {
          return `${cur}${mark}`;
        }
        const curStr = `从${cur.start}到${cur.end}${mark}`;
        return curStr;
      },
      stepMode: ({ curs, indexs, arrs, type, step, index, arr }) => {
        let mark = '、';
        if (indexs === arrs.length - 1 && index === arr.length - 1) {
          mark = ';';
        }
        const curStr = `从${curs.start}到${curs.end}每${step}${mark}`;
        return curStr;
      },
    },
  }: options,
) {
  const obj = transformFrequency(params);
  if (obj === undefined || check(params) !== true) {
    return 'cron表达式不合法';
  }
  // 枚举匹配
  const newTranslateEmum = { ...defaultTranslateEmum, ...translateEmum };
  if (newTranslateEmum[params]) {
    return newTranslateEmum[params];
  }
  // 通用匹配
  const { second, minute, hour, day, moth, week, year } = obj;
  return join(
    [
      translateSecond(second, translateMode),
      translateMinute(minute, translateMode),
      translateHour(hour, translateMode),
      translateDay(day, translateMode),
      translateMoth(moth, translateMode),
      translateWeek(week, translateMode),
      translateYear(year, translateMode),
    ],
    ' ',
  );
}
