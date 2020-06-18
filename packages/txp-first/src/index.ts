import moment from 'txp/util/moment';
import { join } from 'txp/util';
import { date } from 'txp/util/constants';
// import { join } from 'txp-utils';

export function main() {
  console.log('moment测试', moment().format(date));
  console.log('join测试', join([1, 2, 3]));
}
