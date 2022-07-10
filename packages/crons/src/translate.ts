// @ts-ignore
import { join } from 'txp-utils';
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
  // @ts-ignore
  { appointMode, stepMode, baseMode }: { appointMode; stepMode; baseMode },
) {
  const obj = transformBase(params) as base;
  const { isCommon, list } = obj;
  if (isCommon) {
    return '';
  }
  // 分类list：指定类、段时间类、步长类
  // @ts-ignore
  const appoints = [];
  // @ts-ignore
  const ranges = [];
  // @ts-ignore
  const steps = [];
  // @ts-ignore
  list.forEach((element) => {
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
  // @ts-ignore
  const newAppoints = transformRange([...appoints, ...ranges]);
  const newSteps: { [key: string]: range[] } = {};
  // 分类步长[{step:2},{step:2},{step:3}]->{2:[{},{}],3:[{}]}
  // @ts-ignore
  steps.forEach((element) => {
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
  return baseMode({ appointStr, stepStr });
}
// @ts-ignore
export function translateSecond(params: string, translateMode) {
  return translateBase(params, 'second', translateMode);
}
// @ts-ignore
export function translateMinute(params: string, translateMode) {
  return translateBase(params, 'minute', translateMode);
}
// @ts-ignore
export function translateHour(params: string, translateMode) {
  return translateBase(params, 'hour', translateMode);
}
// @ts-ignore
export function translateDay(params: string, translateMode) {
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
  return translateBase(params, 'day', translateMode);
}
// @ts-ignore
export function translateMoth(params: string, translateMode) {
  return translateBase(params, 'moth', translateMode);
}
// @ts-ignore
export function translateWeek(params: string, translateMode) {
  if (params === '?') {
    return '';
  }
  const appointReg = /^([1-7])#([1-5])$/;
  if (appointReg.test(params)) {
    return `第${(appointReg.exec(params) as string[])[2]}周的周${
      (appointReg.exec(params) as string[])[1]
    }`;
  }
  const lastReg = /^([1-7])L$/;
  if (lastReg.test(params)) {
    return `最后一周的周${(lastReg.exec(params) as string[])[1]}`;
  }
  return translateBase(params, 'week', translateMode);
}
// @ts-ignore
export function translateYear(params: string, translateMode) {
  return translateBase(params, 'year', translateMode);
}
const getTimeValue = (value: string, unit: string) => {
  if (unit === '周') {
    return `${unit}${value}`;
  }
  return `${value}${unit}`;
};
const defaultOptions = {
  translateEmum: {},
  translateMode: {
    // @ts-ignore
    appointMode: ({ cur, index, arr, type }) => {
      let mark = '，';
      const appointUnit = {
        second: '秒',
        minute: '分',
        hour: '点',
        day: '日',
        moth: '月',
        week: '周',
        year: '年',
      };
      if (index === arr.length - 1) {
        mark = '';
      }
      if (typeof cur === 'string' || typeof cur === 'number') {
        // @ts-ignore
        return `${getTimeValue(String(cur), appointUnit[type])}${mark}`;
      }
      // @ts-ignore
      const curStr = `${getTimeValue(cur.start, appointUnit[type])}到${getTimeValue(
        cur.end,
        // @ts-ignore
        appointUnit[type],
      )}${mark}`;
      return curStr;
    },
    // @ts-ignore
    stepMode: ({ curs, indexs, arrs, type, step, index, arr }) => {
      let mark = '，';
      if (indexs === arrs.length - 1 && index === arr.length - 1) {
        mark = '';
      }
      const appointUnit = {
        second: '秒',
        minute: '分',
        hour: '点',
        day: '日',
        moth: '月',
        week: '周',
        year: '年',
      };
      const stepUnit = {
        second: '秒',
        minute: '分钟',
        hour: '小时',
        day: '天',
        moth: '月',
        week: '周',
        year: '年',
      };
      // @ts-ignore
      const curStr = `${getTimeValue(curs.start, appointUnit[type])}到${getTimeValue(
        curs.end,
        // @ts-ignore
        appointUnit[type],
        // @ts-ignore
      )}每隔${step - 1}${stepUnit[type]}${mark}`;
      return curStr;
    },
    // @ts-ignore
    baseMode: ({ appointStr, stepStr }) => {
      const str = join([appointStr, stepStr], '，');
      return str;
    },
    // @ts-ignore
    allMode: ({ second, minute, hour, day, moth, week, year }) => {
      const str = join([year, moth, week, day, hour, minute, second], '的');
      return `${str}执行`;
    },
  },
};
export interface options {
  translateEmum?: {};
  translateMode?: {
    week?: any;
    day?: any;
    appointMode?: any;
    stepMode?: any;
    baseMode?: any;
    allMode?: any;
  };
}
/**
 * 描述
 * @author DaoYuan
 * @date 2020-06-18
 * @param {any} params:string
 * @param {any} options:语言配置
 * @returns {any}
 */
export default function translate(params: string, options: options = {}) {
  const {
    translateEmum = defaultOptions.translateEmum,
    translateMode = defaultOptions.translateMode,
  } = options;
  if (check(params) !== true) {
    return 'cron表达式不合法';
  }
  const obj = transformFrequency(params);
  // 枚举匹配
  const newTranslateEmum = { ...defaultTranslateEmum, ...translateEmum };
  // @ts-ignore
  if (newTranslateEmum[params]) {
    // @ts-ignore
    return newTranslateEmum[params];
  }
  // 通用匹配
  // @ts-ignore
  const { second, minute, hour, day, moth, week, year } = obj;
  return translateMode.allMode({
    second: second && translateSecond(second, translateMode),
    minute: translateMinute(minute, translateMode),
    hour: translateHour(hour, translateMode),
    day: translateDay(day, translateMode),
    moth: translateMoth(moth, translateMode),
    week: translateWeek(week, translateMode),
    year: year && translateYear(year, translateMode),
  });
}
