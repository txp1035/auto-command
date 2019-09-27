export default {
  add(...arr: number[]) {
    if (arr.length >= 2) {
      let count = arr[0];
      arr.forEach(element => {
        count += element;
        count = Number(count.toFixed(2));
      });
      return count;
    }
    return null;
  },
  sub(...arr: number[]) {
    if (arr.length >= 2) {
      let count = arr[0];
      arr.forEach(element => {
        count -= element;
        count = Number(count.toFixed(2));
      });
      return count;
    }
    return null;
  },
  mul(...arr: number[]) {
    if (arr.length >= 2) {
      let count = arr[0];
      arr.forEach(element => {
        if (count === undefined) {
          count = element;
        } else {
          count *= element;
          count = Number(count.toFixed(2));
        }
      });
      return count;
    }
    return null;
  },
  div(...arr: number[]) {
    if (arr.length >= 2) {
      let count = arr[0];
      arr.forEach(element => {
        if (count === undefined) {
          count = element;
        } else {
          count /= element;
          count = Number(count.toFixed(2));
        }
      });
      return count;
    }
    return null;
  },
};
