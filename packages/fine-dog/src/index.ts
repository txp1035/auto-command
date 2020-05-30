declare global {
  interface Window {
    finddog: object;
  }
}
export default function main() {
  if (checkCode()) {
    return;
  }
  const { host } = window.location;
  const code = getCode(host);
  appendScript(code);
  logger();
}
function logger() {
  window.finddog = {
    version: require('../package').version,
  };
}
function checkCode() {
  const head = document.querySelector('head');
  if (head && !head.firstElementChild) {
    return false;
  }
  if (
    head &&
    head.firstElementChild &&
    head.firstElementChild.innerHTML === 'var _hmt = _hmt || []'
  ) {
    return true;
  }
  return false;
}
function appendScript(code: string) {
  // 定义元素
  const hmtScript = document.createElement('script');
  hmtScript.innerHTML = 'var _hmt = _hmt || []';
  const codeScript = document.createElement('script');
  codeScript.async = true;
  codeScript.src = `//hm.baidu.com/hm.js?${code}`;
  // 插入元素
  const head = document.querySelector('head');
  if (head && !head.firstElementChild) {
    const title = document.createElement('title');
    head.appendChild(title);
  }
  if (head) {
    head.insertBefore(codeScript, head && head.firstElementChild);
    head.insertBefore(hmtScript, head && head.firstElementChild);
  }
}
export function getCode(host: string) {
  const config = require('./config.json');
  const code = config[host];
  return code;
}
