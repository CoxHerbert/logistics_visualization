import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import appStyle from './style.scss?raw'

const styleEl = document.createElement('style')
styleEl.textContent = appStyle
document.head.appendChild(styleEl)

const app = createApp(App)

Object.entries(Icons).forEach(([key, component]) => {
  app.component(key, component)
})

app.use(createPinia())
app.use(router)
app.use(Antd)
app.mount('#app')
