export default function main() {
  const script = document.createElement('script');
  const head = document.querySelector('head');
  const test = 'c19649af12cb73de53b0f4ba717ae927';
  const formal = 'd94cd395390c9b72ed33667c613aad4e';
  script.innerHTML = `var _hmt = _hmt || [];
  (function() {
    const hm = document.createElement('script');
    const { host } = window.location;
    if (host === 'partner.depotnextdoor.com') {
      hm.src = 'https://hm.baidu.com/hm.js?${formal}';
    }
    if (host === 'partner-test.depotnextdoor.com') {
      hm.src = 'https://hm.baidu.com/hm.js?${test}';
    }
    if (host === 'localhost:8000') {
      hm.src = 'https://hm.baidu.com/hm.js?${test}';
    }
    const s = document.getElementsByTagName('head')[0];
    s.parentNode.insertBefore(hm, s);
  })();`;
  if (head) {
    head.appendChild(script);
  }
}
