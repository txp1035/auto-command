import moment from 'txp/util/moment';
import { date } from 'txp/util/constants';
import { join } from 'txp-utils';
// import moment from 'moment';

// export { moment };
// export { utils };
export function main() {
  console.log('moment测试', moment().format(date));
  console.log('join测试', join([1, 2, 3]));
}
