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
