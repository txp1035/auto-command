/**
 * @param  {String} name 模板方法名字
 * @param  {String} api 模板方法对应的api
 * @param  {String} desc 模板方法对应的注释
 */
export function servicesGet(name, api, desc) {
  return `\nexport async function ${name}(params) {\n  return request(\`${api}?\${stringify(params)}\`);\n} // ${desc}\n`;
} //get请求模板
/**
 * @param  {String} name 模板方法名字
 * @param  {String} api 模板方法对应的api
 * @param  {String} desc 模板方法对应的注释
 */
export function servicesPost(name, api, desc) {
  return `\nexport async function ${name}(params) {\n  return request(\`${api}\`, {\n    method: 'POST',\n    body: params\n  });\n} // ${desc}\n`;
} //post请求模板
export function mock(method, api, obj) {
  return `\n'${method.toUpperCase()} ${api}':${JSON.stringify(obj)},`;
}
