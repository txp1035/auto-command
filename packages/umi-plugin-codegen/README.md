# umi-plugin-codegen

这是一个用来快速生成 mock 和 services 的 umi 插件

## 使用方法

一、安装

```js
npm i umi-plugin-codegen -D
```

二、配置.umirc.js

```js
export default {
  plugins: [
    [
      'umi-plugin-codegen',
      {
        swaggerUrl: '', //必填，用于获取数据
        plugins: [
          {
            outPath: '', //输出目录路径
            handelData: params => {
              return [{ fileName: 'api.ts', fileStr: params }];
            } //传入swagger数据，返回集合fileName是生成的文件名，fileStr是生成的文件内容
          }
        ] //可选的，用于自定义输出文件
      }
    ]
  ]
};
```

三、通过`umi codegen`快速生成代码
