import { defineConfig } from 'dumi';
import menus from './hooks';

export default defineConfig({
  title: 'hooks',
  base: 'hooks',
  favicon: 'https://bi.shihengtech.com/favicon.png',
  logo: 'https://bi.shihengtech.com/favicon.png',
  outputPath: 'docs-dist',
  mode: 'site',
  navs: [
    {
      title: 'hooks',
      path: '/hooks',
    },
    {
      title: 'GitHub',
      path: 'https://github.com/shiheng-fe/hooks',
    },
  ],
  menus: {
    '/': [
      {
        title: 'Home',
        path: 'index',
      },
    ],
    '/hooks': menus,
  },

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
