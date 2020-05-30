export function add(...arr: number[]) {
  if (arr.length >= 2) {
    let count = arr[0];
    arr.forEach(element => {
      count += element;
      count = Number(count.toFixed(2));
    });
    return count;
  }
  return null;
}
export function sub(...arr: number[]) {
  if (arr.length >= 2) {
    let count = arr[0];
    arr.forEach(element => {
      count -= element;
      count = Number(count.toFixed(2));
    });
    return count;
  }
  return null;
}
export function mul(...arr: number[]) {
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
}
export function div(...arr: number[]) {
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
}
