import { getType, cronType } from './utils';
/**
 * 描述 验证指定值和区间是否在指定范围内
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:频率字符串
 * @param {any} options:区间范围和步长区间范围
 * @returns {any} 返回正常（基础正常）、不属于基础验证的数组（基础正常需要继续验证）、不正常
 */
export function checkBase(
  params: string,
  options: {
    rangeStart: number;
    rangeEnd: number;
    stepStart: number;
    stepEnd: number;
  },
): boolean | string[] {
  // 是否是星号
  const regCommon = /^\*$/;
  if (regCommon.test(params)) {
    regCommon.test(params);
    return true;
  }
  // 获取list
  const list = params.split(',');
  // 错误list存放
  const otherList: string[] = [];
  const { rangeStart, rangeEnd, stepStart, stepEnd } = options;
  let isRight = true;
  list.forEach(item => {
    let isOther = true;
    // 是否是段时间
    const regRange = /^(0|[1-9][0-9]*)-(0|[1-9][0-9]*)(\/[1-9][0-9]*)?$/;
    if (regRange.test(item)) {
      isOther = false;
      // 验证区间开始和结束
      const start = (regRange.exec(item) as string[])[1];
      const end = (regRange.exec(item) as string[])[2];
      // 开始必须小于结束
      if (start > end) {
        isRight = false;
      }
      // 开始和结束值都必须在区间内
      if (Number(start) > rangeEnd || Number(start) < rangeStart) {
        isRight = false;
      }
      if (Number(end) > rangeEnd || Number(end) < rangeStart) {
        isRight = false;
      }
      // 验证步长
      const stepParams = (regRange.exec(item) as string[])[3];
      const stepReg = /^\/([1-9][0-9]*)$/;
      if (stepParams && stepReg.test(stepParams)) {
        const step = (stepReg.exec(stepParams) as string[])[1];
        if (Number(step) > stepEnd || Number(step) < stepStart) {
          isRight = false;
        }
      }
    }
    // 是否是指定时间
    const regValue = /^(0|[1-9][0-9]*)$/;
    if (regValue.test(item)) {
      isOther = false;
      if (Number(item) > rangeEnd || Number(item) < rangeStart) {
        isRight = false;
      }
    }
    if (isOther) {
      otherList.push(item);
    }
  });
  // 基础验证失败
  if (!isRight) {
    return false;
  }
  // 基础验证成功且没有其他需要验证的
  if (otherList.length === 0) {
    return true;
  }
  // 基础验证成功但有其他需要验证的
  return otherList;
}

/**
 * 描述：只有基础验证
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:频率字符串
 * @returns {boolean} 正常、不正常
 */
export function checkSecond(params: string): boolean {
  const check = checkBase(params, {
    rangeStart: 0,
    rangeEnd: 59,
    stepStart: 1,
    stepEnd: 59,
  });
  // 秒只需要基础验证成功，其他情况都是错误
  if (check === true) {
    return true;
  }
  return false;
}

/**
 * 描述：只有基础验证
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:频率字符串
 * @returns {boolean} 正常、不正常
 */
export function checkMinute(params: string): boolean {
  // 分验证同秒一样
  return checkSecond(params);
}

/**
 * 描述：只有基础验证
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:频率字符串
 * @returns {boolean} 正常、不正常
 */
export function checkHour(params: string): boolean {
  const check = checkBase(params, {
    rangeStart: 0,
    rangeEnd: 23,
    stepStart: 1,
    stepEnd: 23,
  });
  // 小时只需要基础验证成功，其他情况都是错误
  if (check === true) {
    return true;
  }
  return false;
}

/**
 * 描述：(quartz和spring验证?LW)+基础验证
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:频率字符串
 * @param {any} type:cron表达式解析器类型
 * @returns {boolean} 正常、不正常
 */
export function checkDay(params: string, type: cronType): boolean {
  if (type === 'quartz' || type === 'spring') {
    // quartz或者spring需要验证?LW
    if (params === '?') {
      return true;
    }
    if (params === 'L') {
      return true;
    }
    const weekReg = /^([1-9][0-9]*)W$/;
    if (weekReg.test(params)) {
      const week = weekReg.exec(params);
      if (Number(week) < 1 || Number(week) > 31) {
        return false;
      }
      return true;
    }
  }
  // 基础验证
  const check = checkBase(params, {
    rangeStart: 1,
    rangeEnd: 31,
    stepStart: 1,
    stepEnd: 31,
  });
  // 日在特殊验证后只需要基础验证成功，其他情况都是错误
  if (check === true) {
    return true;
  }
  return false;
}

/**
 * 描述 替换JAN–DEC为数字，进行基础校验
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:频率字符串
 * @returns {boolean} 正常、不正常
 */
export function checkMoth(params: string): boolean {
  // 替换月为数字
  const newParams = params
    .replace(/JAN/gi, '1')
    .replace(/FEB/gi, '2')
    .replace(/MAR/gi, '3')
    .replace(/APR/gi, '4')
    .replace(/MAY/gi, '5')
    .replace(/JUN/gi, '6')
    .replace(/JUL/gi, '7')
    .replace(/AUG/gi, '8')
    .replace(/SEP/gi, '9')
    .replace(/OCT/gi, '10')
    .replace(/NOV/gi, '11')
    .replace(/DEC/gi, '12');
  const check = checkBase(newParams, {
    rangeStart: 1,
    rangeEnd: 12,
    stepStart: 1,
    stepEnd: 12,
  });
  // 月只需要基础验证成功，其他情况都是错误
  if (check === true) {
    return true;
  }
  return false;
}

/**
 * 描述 (quartz和spring验证?L#)+基础验证(两种类型)
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:频率字符串
 * @returns {boolean} 正常、不正常
 */
export function checkWeek(params: string, type: cronType): boolean {
  if (type === 'quartz' || type === 'spring') {
    // quartz或者spring需要验证?LW
    if (params === '?') {
      return true;
    }
    // 第几周(1-5)的星期几(1-7)
    const appointReg = /^([1-7])#([1-5])$/;
    if (appointReg.test(params)) {
      return true;
    }
    // 最后一个星期几
    const lastReg = /^([1-7])L$/;
    if (lastReg.test(params)) {
      return true;
    }
    // 替换月为数字
    const newParams = params
      .replace(/Sun/gi, '1')
      .replace(/Mon/gi, '2')
      .replace(/Tue/gi, '3')
      .replace(/Wed/gi, '4')
      .replace(/Thu/gi, '5')
      .replace(/Fri/gi, '6')
      .replace(/Sat/gi, '7');
    // 基础验证
    const check = checkBase(newParams, {
      rangeStart: 1,
      rangeEnd: 7,
      stepStart: 1,
      stepEnd: 6,
    });
    if (check === true) {
      return true;
    }
  }
  if (type === 'linux') {
    // 替换月为数字
    const newParams = params
      .replace(/Sun/gi, '0')
      .replace(/Mon/gi, '1')
      .replace(/Tue/gi, '2')
      .replace(/Wed/gi, '3')
      .replace(/Thu/gi, '4')
      .replace(/Fri/gi, '5')
      .replace(/Sat/gi, '6');
    const check = checkBase(newParams, {
      rangeStart: 0,
      rangeEnd: 6,
      stepStart: 1,
      stepEnd: 6,
    });
    if (check === true) {
      return true;
    }
  }
  return false;
}

/**
 * 描述：只有基础验证
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:频率字符串
 * @returns {boolean} 正常、不正常
 */
export function checkYear(params: string): boolean {
  const check = checkBase(params, {
    rangeStart: 1970,
    rangeEnd: 2099,
    stepStart: 1,
    stepEnd: 10,
  });
  // 年只需要基础验证成功，其他情况都是错误
  if (check === true) {
    return true;
  }
  return false;
}

/**
 * 描述：接受cron字符串返回false为不通过，true为通过，对象为部分不通过
 * @author ShawDanon
 * @date 2020-06-14
 * @param {any} params:string
 * @returns {any}
 */
export function checkString(params: string): boolean {
  const reg = /^([0-9*/,-]+ )?([0-9*/,-]+) ([0-9*/,-]+) ([0-9*/,-?LW]+) ([A-Za-z0-9*/,-]+) ([A-Za-z0-6*/,-?L#]+)( [0-9*/,-]+)?$/;
  if (typeof params === 'string' && reg.test(params)) {
    return true;
  }
  return false;
}

export function checkFrequency(params: string): object {
  const list = params.split(' ');
  const type = getType(params);
  const obj: any = {};
  if (type === 'linux') {
    obj.minute = checkMinute(list[0]);
    obj.hour = checkHour(list[1]);
    obj.day = checkDay(list[2], type);
    obj.moth = checkMoth(list[3]);
    obj.week = checkWeek(list[4], type);
  }
  if (type === 'spring') {
    obj.second = checkSecond(list[0]);
    obj.minute = checkMinute(list[1]);
    obj.hour = checkHour(list[2]);
    obj.day = checkDay(list[3], type);
    obj.moth = checkMoth(list[4]);
    obj.week = checkWeek(list[5], type);
  }
  if (type === 'quartz') {
    obj.second = checkSecond(list[0]);
    obj.minute = checkMinute(list[1]);
    obj.hour = checkHour(list[2]);
    obj.day = checkDay(list[3], type);
    obj.moth = checkMoth(list[4]);
    obj.week = checkWeek(list[5], type);
    obj.year = checkYear(list[6]);
  }
  return obj;
}

export function check(params: string): boolean | object {
  const isCron = checkString(params);
  if (isCron) {
    const obj = checkFrequency(params);
    let isRight = true;
    Object.values(obj).forEach(item => {
      if (!item) {
        isRight = false;
      }
    });
    if (isRight) {
      return true;
    }
    return obj;
  }
  return false;
}
// 用来value进入组件时检查，不正确就给默认值
// 用来cron专业模式检查，不正确提示是哪儿个不正确
// 3种模式，更具字符串自动判断
export default check;
