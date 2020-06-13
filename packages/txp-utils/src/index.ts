import * as object from './object';
import * as jsCalculation from './jsCalculation';
import * as other from './other';

const utils = { ...object, ...jsCalculation, ...other };
export default utils;
