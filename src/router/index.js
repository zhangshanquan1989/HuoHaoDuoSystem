import Vue from 'vue'
import VueRouter from 'vue-router'
// 登录，home，手机分享页面
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import PhonePage from '../components/PhonePage.vue'
import EchartsScreen from '../components/EchartsScreen.vue'

import Assembly from '../components/Assembly/Assembly.vue'
import BasisInfor from '../components/BasisInfor/BasisInfor.vue'
import DataFactory from '../components/DataFactory/DataFactory.vue'
import PerformanceInfor from '../components/PerformanceInfor/PerformanceInfor.vue'
// 首页
import Welcome from '../components/Welcome/Welcome.vue'
import ImageWelcome from '../components/Welcome/ImageWelcome.vue'
import MyDriver from '../components/MyDriver/MyDriver.vue'
import MonthDistance from '../components/EchartsComp/MonthDistance.vue'
import DriverScore from '../components/DriverScore/DriverScore.vue'
// 订单管理
import WaybillManage from '../components/OrderManagement/WaybillManage.vue'
import DistributionManage from '../components/OrderManagement/DistributionManage.vue'
import OrderManage from '../components/OrderManagement/OrderManage.vue'
import OutTime from '../components/OrderManagement/OutTime.vue'
import CarDistribution from '../components/OrderManagement/CarDistribution.vue'
import CarAttendance from '../components/OrderManagement/CarAttendance.vue'
import DriverWarning from '../components/OrderManagement/DriverWarning.vue'
import LowPriceWaybill from '../components/OrderManagement/LowPriceWaybill.vue'

// Basis基础子组件
import CompanyInfor from '../components/BasisInfor/Navigation/CompanyInfor.vue'
import WorkerInfor from '../components/BasisInfor/Navigation/WorkerInfor.vue'
import DriverQuery from '../components/BasisInfor/Navigation/DriverQuery.vue'
import CustomerInfor from '../components/BasisInfor/Navigation/CustomerInfor.vue'
import RegionInfor from '../components/BasisInfor/Navigation/RegionInfor.vue'
import CarInfo from '../components/BasisInfor/Navigation/Car/CarInfo.vue'
import Illegal from '../components/BasisInfor/Navigation/Car/Illegal.vue'
import EarnestMoney  from '../components/BasisInfor/Navigation/Car/EarnestMoney .vue'
import ManagementFee from '../components/BasisInfor/Navigation/Car/ManagementFee.vue'
import CarMonitoring from '../components/BasisInfor/Navigation/Car/CarMonitoring.vue'
import CarMileage from '../components/BasisInfor/Navigation/Car/carMileage.vue'
import CarEnergy from '../components/BasisInfor/Navigation/Car/carEnergy.vue'

// 权限子组件
import DepartManage from '../components/RightsManage/DepartManage.vue'
import UserManage from '../components/RightsManage/UserManage.vue'
import RightsManage from '../components/RightsManage/RightsManage.vue'
import RoleManage from '../components/RightsManage/RoleManage.vue'

// 数据汇总
import DataAggregation from '../components/DataAggregation/DataAggregation.vue'

// 低价单
import LowPrice from '../components/Welcome/EchartsComps/LowPrice.vue'



import Text from '../components/text/text.vue'
import Test2 from '../components/text/test2.vue'

Vue.use(VueRouter)

const routes = [
	{path:'/',redirect:'/login'},
  {path: '/login',component: Login},
  {path: '/phonePage/:id',component: PhonePage},
  {path: '/echartsScreen',component: EchartsScreen},
  // {path: '/home',component: Home,redirect:'/welcome',
	// 路由重定向，可以接受一个函数
  {path: '/home',component: Home,redirect: to => {
		if(window.sessionStorage.getItem('role') == '调度主管' || window.sessionStorage.getItem('role') == '调度配送' ){
			return '/MyDriver'
		}else if(window.sessionStorage.getItem('role') == '调度运单'){
			return '/imageWelcome'
		}else if(window.sessionStorage.getItem('role') == '分公司'){
			return '/imageWelcome'
		}else{
			return '/welcome'
		}
	},
	children:[
		{path:'/welcome', component:Welcome},
		{path:'/imageWelcome', component:ImageWelcome},
		{path:'/MyDriver', component:MyDriver},
		{path:'/MonthDistance', component:MonthDistance},
		{path:'/driverScore', component:DriverScore},
	  {path:'/basis', component:BasisInfor,
			children:[
				{path: '/basis/company',component: CompanyInfor},
				{path: '/basis/worker',component: WorkerInfor},
				{path: '/basis/car/carInfo',component: CarInfo},
				{path: '/basis/car/illegal',component: Illegal},
				{path: '/basis/car/carMonitoring',component: CarMonitoring},
				{path: '/basis/car/carMileage',component: CarMileage},
				{path: '/basis/car/carEnergy',component: CarEnergy},
				{path: '/basis/car/earnestMoney',component: EarnestMoney},
				{path: '/basis/car/managementFee',component: ManagementFee},
				{path: '/basis/driver',component: DriverQuery},
				{path: '/basis/customer',component: CustomerInfor},
				{path: '/basis/region',component: RegionInfor},
				]},
		{path:'/assembly', component:Assembly},
		{path:'/dataFactory', component:DataFactory},
		{path:'/performance', component:PerformanceInfor},
		{path:'/distributionManage', component:DistributionManage},
		{path:'/waybillManage', component:WaybillManage},		
		{path:'/orderManage', component:OrderManage},		
		{path:'/outTime', component:OutTime},		
		{path:'/carDistribution', component:CarDistribution},		
		{path:'/carAttendance', component:CarAttendance},		
		{path:'/driverWarning', component:DriverWarning},		
		{path:'/LowPriceWaybill', component:LowPriceWaybill},		
		{path:'/rights', component:RightsManage},
		{path:'/manage/departManage', component:DepartManage},
		{path:'/manage/userManage', component:UserManage},
		{path:'/manage/roleManage', component:RoleManage},
		{path:'/dataAggregation', component:DataAggregation},
		{path:'/LowPrice', component:LowPrice},
		{path:'/text', component:Text},
		{path:'/test2', component:Test2}
		]
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
	
]

const router = new VueRouter({
  routes
})

export default router
