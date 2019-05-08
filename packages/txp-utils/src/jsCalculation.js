export default {
  add: function(...arr) {
    let count;
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
  sub: function(...arr) {
    let count;
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
  mul: function(...arr) {
    let count;
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
  div: function(...arr) {
    let count;
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
  }
};
