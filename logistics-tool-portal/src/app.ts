import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import * as Icons from '@ant-design/icons-vue';
import 'ant-design-vue/dist/reset.css';
import './style.scss';

import App from './App.vue';
import { createAppRouter } from './router';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  const router = createAppRouter();

  Object.entries(Icons).forEach(([key, component]) => {
    app.component(key, component);
  });

  app.use(pinia);
  app.use(router);
  app.use(Antd);

  return { app, pinia, router };
}
