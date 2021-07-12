<template>
	<el-container class="home_container">
		<!-- 头部区域 -->
		<el-header>
			<div>
				<img src="../assets/天康系统3.png" alt="">
				<!-- <span>天康系统</span> -->
			</div>
			<div>
				<span style="font-size: 18px ;margin-right: 10px;margin-top: 5px;">欢迎您：{{name}}</span>
				<el-badge :value="daibanData"  style="margin-right: 30px;margin-top: 5px;font-size: 18px ;">
					
				  <span >待办事项</span>
					<!-- <el-button style="font-size: 18px ;color: #FFFFFF;"  type="text" @click="turnTo">待办事项</el-button> -->
				</el-badge>
				<el-button type="info" @click="logout">退出</el-button>
			</div>
			
		</el-header>
		<!-- 页面主体 -->
		<el-container>
			<el-aside width="200px" style="background-color: #0f4f7d;">
				<!-- 侧边栏菜单区域 -->
				<el-menu background-color="#0f4f7d" text-color="#fff" active-text-color="#FFFFFF" :unique-opened="true" :router="true" :default-active="activePath">
					<template v-for="one in menulist">
						<template v-if="one.children">
							<el-submenu :index="one.path" :key="one.id" @click="saveNavState(one.path)">
								<template slot="title">
									<i :class="one.icon"></i>
									<span style="font-size: 18px;">{{one.authName}}</span>
								</template>
								<template v-for="two in one.children">
									<template v-if="two.children">
										<el-submenu :key='two.id' :index="two.path" @click="saveNavState(two.path)">
											<template slot="title">
												<i :class="two.icon"></i>
												<span style="font-size: 16px;">{{two.authName}}</span>
											</template>
											<template v-for="three in two.children">
												<el-menu-item :key='three.id' :index='three.path' style="font-size: 15px;" @click="saveNavState(three.path)">
													<i :class="three.icon"></i>
													<span>{{three.authName}}</span></el-menu-item>
											</template>
										</el-submenu>
									</template>
									<template v-else>
										<el-menu-item :index="two.path" :key="two.id" style="font-size: 16px;" @click="saveNavState(two.path)">
											<i :class="two.icon"></i>
											<span>{{two.authName}}</span>
										</el-menu-item>
									</template>
								</template>
							</el-submenu>
						</template>
						<template v-else>
							<el-menu-item :index="one.path" :key="one.id" @click="saveNavState(one.path)">
								<template>
									<i :class="one.icon"></i>
									<span style="font-size: 18px;">{{one.authName}}</span>
								</template>
							</el-menu-item>
						</template>
					</template>
				</el-menu>
			</el-aside>
			<!-- 右侧内容主体 -->
			<el-main>
				<!-- 路由占位符 -->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	export default {
		data() {
			return {
				// 用户名
				name:'',
				// 左侧菜单数据
				menulist: [{
						id: 0,
						authName: '首页',
						path: '/welcome',
						icon: "el-icon-s-open"
					},
					{
						id: 1,
						authName: '基础信息管理',
						icon: "el-icon-s-order",
						path: '/basis',
						children: [{
								id: 11,
								authName: '公司信息',
								path: '/basis/company',
								icon: "el-icon-caret-right"
							},
							{
								id: 12,
								authName: '员工信息',
								path: '/basis/worker',
								icon: "el-icon-caret-right"
							},
							{
								id: 13,
								authName: '司机信息',
								path: '/basis/driver',
								icon: "el-icon-caret-right"
							},
							{
								id: 15,
								authName: '客户信息',
								path: '/basis/customer',
								icon: "el-icon-caret-right"
							},
							// {
							// 	id: 16,
							// 	authName: '地区信息',
							// 	path: '/basis/region',
							// 	icon: "el-icon-caret-right"
							// },
							{
								id: 14,
								authName: '车辆管理',
								icon: "el-icon-menu",
								children: [{
										id: 111,
										authName: '车辆信息',
										path: '/basis/car/carInfo',
										icon: "el-icon-caret-right"
									},
									{
										id: 112,
										authName: '车辆保证金',
										path: '/basis/car/earnestMoney',
										icon: "el-icon-caret-right"
									},
									{
										id: 113,
										authName: '车辆管理费',
										path: '/basis/car/managementFee',
										icon: "el-icon-caret-right"
									},
									{
										id: 114,
										authName: '实时监控',
										path: '/basis/car/CarMonitoring',
										icon: "el-icon-caret-right"
									},
									{
										id: 115,
										authName: '车辆里程',
										path: '/basis/car/carMileage',
										icon: "el-icon-caret-right"
									},
									{
										id: 116,
										authName: '车辆能耗',
										path: '/basis/car/carEnergy',
										icon: "el-icon-caret-right"
									},
									// {
									// 	id: 114,
									// 	authName: '违章信息',
									// 	path: '/basis/car/illegal',
									// 	icon: "el-icon-caret-right"
									// }
								],
								path: '/basis/car'
							},
						]
						// path:'basis'
					},
					{
						id: 2,
						authName: '订单管理',
						path: '/orderManage',
						icon: "el-icon-document",
						children: [{
								id: 21,
								authName: '订单查询',
								path: '/orderManage',
								icon: "el-icon-caret-right"
							},
							{
								id: 22,
								authName: '运单管理',
								path: '/waybillManage',
								icon: "el-icon-caret-right"
							},
							{
								id: 23,
								authName: '配送管理',
								path: '/distributionManage',
								icon: "el-icon-caret-right",
							}
						]
					},
					{
						id: 4,
						authName: '权限管理',
						icon: "el-icon-unlock",
						path: '/manage',
						children: [{
								id: 41,
								authName: '部门管理',
								path: '/manage/departManage',
								icon: "el-icon-caret-right"
							},
							{
								id: 42,
								authName: '角色管理',
								path: '/manage/roleManage',
								icon: "el-icon-caret-right"
							},
							{
								id: 43,
								authName: '用户管理',
								path: '/manage/userManage',
								icon: "el-icon-caret-right"
							}
						]
					},
					// {
					// 	id: 5,
					// 	authName: '数据工厂',
					// 	path: '/dataFactory',
					// 	icon: "el-icon-data-line",
					// },
					// {
					// 	id: 6,
					// 	authName: 'text',
					// 	path: '/text',
					// 	icon: "el-icon-orange",
					// },
					// {
					// 	id: 7,
					// 	authName: 'test2',
					// 	path: '/test2',
					// 	icon: "el-icon-orange",
					// },
					// {
					// 	id: 8,
					// 	authName: '转发页面',
					// 	path: '/phonePage/MDAwMDA5Ng==',
					// 	icon: "el-icon-orange",
					// },
				],

				// 被激活的链接地址
				activePath: '',
				// 用户id
				userid:'',
				// 代办数量
				daibanData:''
			}
		},
		created() {
			// this.getMenuList()userID
			this.userid = window.sessionStorage.getItem('userID')
			this.name = window.sessionStorage.getItem('name')
			this.activePath = window.sessionStorage.getItem('activePath')
			this.getDaiBan()
			// this.jiaMi()
		},
		methods: {
			logout() {
				window.sessionStorage.clear()
				this.$router.push('/login')
			},
			//获取所有菜单
			// async getMenuList(){
			// 	const {data: res} = await this.$http.get('menus')
			// 	if(res.meta.status !== 200) return this.$message.error('res.meta.msg')
			// 	this.menulist = res.data
			// 	console.log(res);
			// },

			// 保持链接的激活状态
			saveNavState(activePath) {
				window.sessionStorage.setItem('activePath', activePath)
				this.activePath = activePath
			},
			// 获取代办提醒
			async getDaiBan(){
				const {data:res} = await this.$http.get('waybill/daiban?id='+this.userid)
				// console.log(res)
				this.daibanData = res.result.代办流程数量
			},
			// 跳转到待办事项功能，目前跳转地址不明确
			// turnTo(){
			// 	this.$router.push('/distributionManage')
			// 	this.activePath = '/distributionManage'
			// },
			
			// // 加密订单号
			// async jiaMi(){
			// 	const {data:res} = await this.$http.get('waybill/jiami?plistNo=0000096')
			// 	console.log('加密',res)
			// 	this.jiami = res.result.加密后订单号
			// },
		}
	}
</script>

<style lang="less" scoped>
	.home_container {
		height: 100%;
	}

	.el-header {
		background-color: #03395f;
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;
		color: #FFFFFF;
		font-size: 20px;
		height: 75px !important;

		div {
			display: flex;
			align-items: center;

			img {
				width: 190px;
				height: 32px;
				margin-left: 10px;
				// border-radius: 50%;
			}

			span {
				margin-left: 15px;
			}
		}
	}

	.el-menu {
		width: 200px;
	}

	.el-aside {
		background-color: #536080;
		// border-right: none;
	}

	.el-main {
		background-color: #eaedf1;
		font-size: 25px !important;
	}

	.el-menu-item.is-active {
		background-color: #03395f !important;
	}
	
	.el-badge /deep/.el-badge__content.is-fixed{
	       right: 5px
	    }


	// .el-submenu {
	// 	padding-left: 30px !important;
	// 	font-size: 18px;
	// }

	// .el-menu-item {
	// 	padding-left: 30px !important;
	// 	font-size: 18px;
	// }
</style>
