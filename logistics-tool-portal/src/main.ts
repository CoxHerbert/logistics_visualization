import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import * as Icons from '@ant-design/icons-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue';
import router from './router';
import './style.scss';

const DEFAULT_TITLE = '中美货运转运平台 | 中美线国际货运代理';
const DEFAULT_DESCRIPTION =
  '中美货运转运平台，提供中美线海运、FBA头程、清关与派送服务，覆盖报价咨询、装柜测算与运输方案建议。';
const DEFAULT_KEYWORDS =
  '中美货运,国际物流,FBA头程,海运,清关,派送,装柜测算,物流咨询';

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    document.head.append(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.append(link);
  }
  link.setAttribute('href', url);
}

router.afterEach((to) => {
  const title = (to.meta.title as string) || DEFAULT_TITLE;
  const description = (to.meta.description as string) || DEFAULT_DESCRIPTION;
  const keywords = (to.meta.keywords as string) || DEFAULT_KEYWORDS;

  document.title = title;
  upsertMeta('description', description);
  upsertMeta('keywords', keywords);

  upsertMeta('og:title', title, 'property');
  upsertMeta('og:description', description, 'property');
  upsertMeta('og:url', `${window.location.origin}${to.fullPath}`, 'property');

  upsertMeta('twitter:title', title);
  upsertMeta('twitter:description', description);

  upsertCanonical(`${window.location.origin}${to.fullPath}`);
});

const app = createApp(App);

Object.entries(Icons).forEach(([key, component]) => {
  app.component(key, component);
});

app.use(createPinia());
app.use(router);
app.use(Antd);
app.mount('#app');
