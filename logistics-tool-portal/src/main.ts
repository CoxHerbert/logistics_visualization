import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import * as Icons from '@ant-design/icons-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import './style.css'

const app = createApp(App)

Object.entries(Icons).forEach(([key, component]) => {
  app.component(key, component)
})

app.use(Antd)
app.mount('#app')
