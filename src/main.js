import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

//导入全局样式
import './assets/css/global.css'
// 导入复制文本
import Clipboard from 'clipboard'; 

// 引入echarts
import * as echarts from 'echarts';

// 引入二维码生成qrcodejs2
import QRCode from "qrcodejs2";


// 设置element ui中 Dialog 层级问题
import elementui from 'element-ui'
Vue.use(elementui, { zIndex: 500 })

// 导入axios
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://81.70.151.121:8080/jeecg-boot/'
// axios.defaults.baseURL = 'http://tkhhd.com/jeecg-boot/'

// 挂在复制文本
Vue.prototype.Clipboard=Clipboard;
// 挂载echarts
Vue.prototype.$echarts = echarts

// axios 请求拦截器 ，为请求头添加token权限
//     request方法是请求拦截器  通过use挂载一个回调函数  config为请求对象
axios.interceptors.request.use(config => {
	config.headers.satoken = window.sessionStorage.getItem('satoken')
	// 在最后必须 return config
	return config
})

// 把axios包挂在到vue原型对象上
Vue.prototype.$http = axios

import qs from 'qs'
Vue.prototype.$qs = qs;

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
