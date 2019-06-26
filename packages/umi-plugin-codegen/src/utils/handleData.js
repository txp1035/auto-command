import fetch from 'node-fetch';
import { writeFile } from './handleFile';
export function getData(url) {
  return fetch(url).then(res => res.json());
}

export function convertData(data) {
  let newData = {};
  const apiData = data.paths;
  for (const key in apiData) {
    if (apiData.hasOwnProperty(key)) {
      const itemData = apiData[key];
      const api = key;
      for (const key in itemData) {
        if (itemData.hasOwnProperty(key)) {
          const element = itemData[key];
          const method = key;
          let resData = null;
          if ('schema' in element.responses['200']) {
            if ('$ref' in element.responses['200'].schema) {
              const definitionsKey = handleDefinitionsKey(element.responses['200'].schema.$ref);
              resData = getResData(definitionsKey, data.definitions);
            }
          }
          const obj = {
            ...element,
            api,
            method,
            resData
          };
          if (!newData[element.tags[0]]) {
            newData[element.tags[0]] = [];
          }
          newData[element.tags[0]].push(obj);
          // if (tag === element.tags[0]) {
          //   str = generateString(str, api, method, element, apiData);
          // }
        }
      }
    }
  }
  return newData;
}
function getResData(keyD, definitions) {
  let dataModel = definitions[keyD].properties;
  let resData = {};
  for (const key in dataModel) {
    if (dataModel.hasOwnProperty(key)) {
      const element = dataModel[key];
      switch (element.type) {
        case 'array': {
          resData[key] = [];
          // try {
          //   if ('items' in element) {
          //     if ('$ref' in element.items) {
          //       const definitionsKey = handleDefinitionsKey(element.items.$ref);
          //       resData[key] = getResData(definitionsKey, definitions);
          //     } else {
          //       resData[key] = [];
          //     }
          //   } else {
          //     resData[key] = [];
          //   }
          // } catch (error) {
          //   return;
          // }
          break;
        }
        case 'string':
          resData[key] = '1';
          break;
        case 'integer':
          resData[key] = 1;
          break;
        case 'boolean':
          resData[key] = true;
          break;
        case 'object':
          resData[key] = {};
          break;
        case 'number':
          resData[key] = 1;
          break;
        case 'undefined':
          resData[key] = undefined;
          break;

        default:
          console.log('其他类型', element.type);
          break;
      }
    }
  }
  return resData;
}

function handleDefinitionsKey(key) {
  const reg = /(\#\/definitions\/)(.*)/;
  return reg.exec(key)[2];
} //处理字符串得到definitions的key值
