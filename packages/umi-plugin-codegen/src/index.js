import { getData, convertData } from './utils/handleData';
import { checkDir, generateFiles } from './utils/handleFile';

export default function(api, opts = {}) {
  const { paths } = api;
  api.registerCommand('txp', {}, args => {
    getData(opts.url).then(json => {
      let data;
      try {
        data = convertData(json);
      } catch (error) {
        console.log('转换数据出错/n', error);
      }
      checkDir(paths.cwd);
      generateFiles(data, paths.cwd);
    });
    // handelData();
    // writeData();
    // console.log(args);

    // console.log('txp');
    // console.log(paths.absSrcPath);
    // console.log(paths.cwd);
  });
}
