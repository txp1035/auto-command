export default {
  add(...arr: number[]) {
    let count: number;
    if (arr.length >= 2) {
      arr.forEach(element => {
        if (count === undefined) {
          count = element;
        } else {
          count += element;
          count = Number(count.toFixed(2));
        }
      });
    }
    return count;
  },
  sub(...arr: number[]) {
    let count: number;
    if (arr.length >= 2) {
      arr.forEach(element => {
        if (count === undefined) {
          count = element;
        } else {
          count -= element;
          count = Number(count.toFixed(2));
        }
      });
    }
    return count;
  },
  mul(...arr: number[]) {
    let count: number;
    if (arr.length >= 2) {
      arr.forEach(element => {
        if (count === undefined) {
          count = element;
        } else {
          count *= element;
          count = Number(count.toFixed(2));
        }
      });
    }
    return count;
  },
  div(...arr: number[]) {
    let count: number;
    if (arr.length >= 2) {
      arr.forEach(element => {
        if (count === undefined) {
          count = element;
        } else {
          count /= element;
          count = Number(count.toFixed(2));
        }
      });
    }
    return count;
  },
};
