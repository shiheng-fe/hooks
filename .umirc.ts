import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'hooks',
  favicon: 'https://bi.shihengtech.com/favicon.png',
  logo: 'https://bi.shihengtech.com/favicon.png',
  outputPath: 'docs-dist',
  mode: 'site',
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/shiheng-fe/hooks',
    },
  ],

  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
  ],

  // more config: https://d.umijs.org/config
});
