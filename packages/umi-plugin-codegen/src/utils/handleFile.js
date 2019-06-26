import fs from 'fs';
import { join } from 'path';
import { servicesGet, servicesPost, mock } from './antDesignProTemp';
/**
 * @dec 检查目录是否存在，不存在则创建目录
 * @param  {String} url 项目的根目录
 */
export function checkDir(url) {
  const mock = join(url, 'mock');
  const services = join(url, 'src/services');
  const hasMock = fs.existsSync(mock);
  const hasServices = fs.existsSync(services);
  if (!hasMock) {
    fs.mkdir(mock, function(err) {
      if (err) {
        return console.error('Mock目录创建失败', err);
      }
      console.log('Mock目录创建成功');
    });
  } else {
    console.log('Mock目录已存在');
  }
  if (!hasServices) {
    fs.mkdir(services, function(err) {
      if (err) {
        return console.error('Services目录创建失败', err);
      }
      console.log('Services目录创建成功');
    });
  } else {
    console.log('Services目录已存在');
  }
}

/**
 * @dec 写入文件
 * @param  {String} name 文件名，包括后缀。
 * @param  {String} str 输入文件的字符串。
 */
export function writeFile(dir, name, str) {
  fs.writeFile(join(dir, name), str, function(err) {
    if (err) console.log('写文件操作失败', err);
    else console.log('写文件操作成功');
  });
}
export function generateFiles(data, url) {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const array = data[key];
      let strMock = '';
      let strServices = '';
      array.forEach(element => {
        switch (element.method) {
          case 'get':
            strServices = strServices + servicesGet(element.api.replace(/\//g, '_'), element.api, element.description);
            break;
          case 'post':
            strServices = strServices + servicesPost(element.api.replace(/\//g, '_'), element.api, element.description);
            break;

          default:
            break;
        }
        strMock = strMock + mock(element.method, element.api, element.resData);
      });
      strMock = `export default {` + strMock + `\n}`;
      strServices = `import { stringify } from 'qs';\nimport request from '@/utils/request';` + strServices;
      const mockUrl = join(url, 'mock');
      const servicesUrl = join(url, 'src/services');
      writeFile(mockUrl, `${key}.js`, strMock);
      writeFile(servicesUrl, `${key}.js`, strServices);
    }
  }
}
