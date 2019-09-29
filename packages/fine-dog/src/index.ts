export default function main() {
  const code = getCode();
  appendScript(code);
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
function getCode() {
  const code = {
    PosTest: 'c19649af12cb73de53b0f4ba717ae927',
    Pos: 'd94cd395390c9b72ed33667c613aad4e',
  };
  const { host } = window.location;
  if (host === 'partner.depotnextdoor.com') {
    return code.Pos;
  }
  if (host === 'partner-test.depotnextdoor.com') {
    return code.PosTest;
  }
  if (host === 'localhost:8000') {
    return code.PosTest;
  }
  return 'null';
}
