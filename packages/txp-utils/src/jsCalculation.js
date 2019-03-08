export default function(type, ...arr) {
  let count;
  if (arr.length >= 2) {
    arr.forEach(element => {
      if (count === undefined) {
        count = element;
      } else {
        switch (type) {
          case '+': {
            count += element;
            break;
          }
          case '-': {
            count -= element;
            break;
          }
          case '*': {
            count *= element;
            break;
          }
          case '/': {
            count /= element;
            break;
          }
          default:
            break;
        }
        count = Number(count.toFixed(2));
      }
    });
  }
  return count;
}
