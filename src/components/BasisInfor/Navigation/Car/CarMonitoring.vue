<template>
	<div>
		<el-container>
			<!-- <el-header>车辆实时监控</el-header> -->
			<el-container>
				<el-aside width="230px" style="height: 800px;">
					<el-card class="box-card" >
						<div>
						<el-input placeholder="车牌号" v-model="license" clearable @clear="inputClear">
						    <el-button slot="append" icon="el-icon-search" @click="searchCarNo"></el-button>
						  </el-input>
							</div>
						<!-- <el-select  v-model="carLicense" clearable filterable remote placeholder="请输入车牌号"
						 :remote-method="chooseCarLicense" :loading="carLicenseLoading" @change="editChooseCarLicense">
							<el-option v-for="item in carLicenseOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select> -->
						 <!-- <el-input placeholder="请输入车牌号" v-model="input3" >
						    <el-button slot="append" icon="el-icon-search" @click="searchCarNo"></el-button>
						  </el-input> -->
						<div style="margin-top: 8px;">
						<el-button type="primary" plain size="mini" @click="handleQuery" v-loading.fullscreen.lock="fullscreenLoading" style="">查询选中</el-button>
						<el-button type="primary" plain size="mini" @click="handleClear" style="margin-left: 10px;">清除选中</el-button>
						</div>
						<div style="margin-top: 10px;margin-left: 10px;padding-left: 10px;">
						<el-checkbox-group v-model="chooseCarData" :max="30" >
							<el-checkbox v-for="carNo in checkBoxData" :label="carNo" :key="carNo">{{carNo}}</el-checkbox>
						</el-checkbox-group>
						</div>

					</el-card>
				</el-aside>
				<el-main style="padding: 0;margin-left: 10px;">
					<!-- 位置 -->
					<el-card class="box-card" style="height: 800px;">
						<div id="allCarLocition" style="width: 100%;height: 760px"></div>
					</el-card>
				</el-main>
			</el-container>
		</el-container>


	</div>
</template>

<script>
	export default {
		data() {
			return {
				allList:[],
				chooseCarData:[],
				checkBoxData: [],
				carJointList: [],
				newmap:{},
				// 加载查询CarCurrentStatus
				fullscreenLoading: false,
				// 创建页面选择车牌号数据
				carLicense:'',
				carLicenseOptions: [],
				allCarLicenseList: [],
				carLicenseLoading: false,
				license:'',
			}
		},
		created() {

			this.findAllCarLicense()
		},
		methods: {

			// 获取所有车牌res1.result.anyType.CarCurrentStatus.map
			async findAllCarLicense(){
				const {
					data: res
				} = await this.$http.get('waybill/findAllLicense')
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.allList = res.result
				this.checkBoxData = this.allList
				// this.allCarLicenseList = res.result.map(item => {
				// 	return {
				// 		value: `${item}`,
				// 		label: `${item}`
				// 	};
				// });
				// this.carLicenseOptions = this.allCarLicenseList
				setTimeout(() =>{
					this.initMap()
				},200)
			},
			// 更改了车牌号查询方法！需要输入后模糊查询所有！！！！
			// // 创建页面选择车牌号方法
			// chooseCarLicense(query) {
			// 	if (query !== '') {
			// 		this.carLicenseLoading = true;
			// 		setTimeout(() => {
			// 			this.carLicenseLoading = false;
			// 			this.carLicenseOptions = this.allCarLicenseList.filter(item => {
			// 				return item.value.indexOf(query) > -1;
			// 			});
			// 		}, 300)
			// 	} else {
			// 		this.carLicenseOptions = this.allCarLicenseList
			// 	}
			// },
			// // 创建选择车牌号后发起请求 editChooseCarLicense
			// async editChooseCarLicense(carLicense) {
			// 	if (carLicense !== '') {
			// 		this.checkBoxData = []
			// 		this.checkBoxData.push(carLicense)
			// 		this.carLicenseOptions = this.allCarLicenseList
					
			// 	} else {
			// 		this.carLicenseOptions = this.allCarLicenseList
			// 		this.checkBoxData = this.allList
					
			// 	}
			// },
			// 模糊查询
			async searchCarNo(){
				const {
					data: res
				} = await this.$http.get('waybill/findAllLicense?license='+this.license)
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.checkBoxData = res.result
			},
			// 清空查询
			inputClear(){
				this.checkBoxData = this.allList
			},
			// 点击查询
			async handleQuery(){
				this.newmap.clearMap();
				var list = []
				var allLocationList = []
				this.carJointList = []
				if(!this.chooseCarData[0] ) { return this.$message.error('请选择车牌！')}
				// conso/le.log(this.chooseCarData)
				this.chooseCarData.forEach(v => {
					this.carJointList.push('货好多' + v)
				})
				// console.log(this.carJointList)

				this.fullscreenLoading = true;
				const {
					data: res1
				} = await this.$http.get('kCarinformation/GetCarCurrentStatusBycarMark?s=' + this.carJointList)
				// console.log('res1', res1.result)
				this.fullscreenLoading = false;
				if (res1.code !== 200) {
					return this.$message.error(res1.message)
				}
				if (!res1.result.anyType.CarCurrentStatus){
					return this.$message.warning('未查询到数据！')
					}else if(!res1.result.anyType.CarCurrentStatus[0].length){
						list = res1.result.anyType.CarCurrentStatus
						allLocationList = res1.result.anyType.CarCurrentStatus.map(item => {
							return [item.last_lon, item.last_lat]
						})
					}else{
						list = res1.result.anyType.CarCurrentStatus[0]
						allLocationList = res1.result.anyType.CarCurrentStatus[0].map(item => {
							return [item.last_lon, item.last_lat]
						})
					}
							
				setTimeout(() => {
					for (var i = 0, markerList; i < allLocationList.length; i++) {
						var markerList = new AMap.Marker({
							icon: "https://tkhhd.com/imgs/kache.png",
							position: allLocationList[i],
							offset: new AMap.Pixel(-13, -30),
							map: this.newmap
						});
						// console.log(list[i].location)
						markerList.setTitle(list[i].carMark + ":" + list[i].location)				
					}
					// console.log(markerList)
					this.newmap.add(markerList)
				}, 500)
			},
			// 初始化地图
			initMap(){
				this.newmap = new AMap.Map("allCarLocition", {
					resizeEnable: true, //窗口大小调整
					center: [116.478935, 39.997761], //中心 firstArr: [116.478935, 39.997761],
					zoom: 6
				});
			},
			
			// 点击清空
			handleClear(){
				this.newmap.clearMap();
				this.carJointList = []
				this.chooseCarData = []
			},
			
			
			// // 获取所有车牌号 并查询(以下代码为第一版，默认查询所有车辆，但接口最多只能查30辆，)
			// async findAllCarNo() {
			// 	const {
			// 		data: res
			// 	} = await this.$http.get('waybill/findAllLicense')
			// 	console.log(res)
			// 	if (res.code !== 200) {
			// 		return
			// 	}
			// 	this.checkBoxData = res.result
			// 	res.result.forEach(v => {
			// 		this.carJointList.push('货好多' + v)
			// 	})
			// 	console.log("carJointList" + this.carJointList)
			// 	const {
			// 		data: res1
			// 	} = await this.$http.get('kCarinformation/GetCarCurrentStatusBycarMark?s=' + this.carJointList)
			// 	console.log('res1', res1)
			// 	const list = res1.result.anyType.CarCurrentStatus
			// 	const allLocationList = res1.result.anyType.CarCurrentStatus.map(item => {
			// 		return [item.last_lon, item.last_lat]
			// 	})
			// 	setTimeout(() => {
			// 		var map1 = new AMap.Map("allCarLocition", {
			// 			resizeEnable: true, //窗口大小调整
			// 			center: [116.478935, 39.997761], //中心 firstArr: [116.478935, 39.997761],
			// 			zoom: 6
			// 		});
			// 		for (var i = 0, markerList; i < allLocationList.length; i++) {
			// 			var markerList = new AMap.Marker({
			// 				icon: "https://webapi.amap.com/images/car.png",
			// 				position: allLocationList[i],
			// 				offset: new AMap.Pixel(-13, -30),
			// 				map: map1
			// 			});
			// 			console.log(list[i].location)
			// 			markerList.setTitle(list[i].carMark + ":" + list[i].location)

			// 		}
			// 		console.log(markerList)
			// 		map1.add(markerList)
			// 	}, 500)
			// },
			// async getCarStatusList() {
			// 	const {
			// 		data: res
			// 	} = await this.$http.get('kCarinformation/GetCarCurrentStatusBycarMark?s=' + this.carJointList)
			// 	console.log('res'+res.result.anyType.CarCurrentStatus)
			// 	const list = res.result.anyType.CarCurrentStatus
			// 	const allLocationList = res.result.anyType.CarCurrentStatus.map(item => {
			// 		return [item.last_lon, item.last_lat]
			// 	})
			// 	setTimeout(() => {
			// 		var map1 = new AMap.Map("allCarLocition", {
			// 			resizeEnable: true, //窗口大小调整
			// 			center: [116.478935, 39.997761], //中心 firstArr: [116.478935, 39.997761],
			// 			zoom: 6
			// 		});
			// 		for (var i = 0, markerList; i < allLocationList.length; i++) {
			// 			var markerList = new AMap.Marker({
			// 				icon: "https://webapi.amap.com/images/car.png",
			// 				position: allLocationList[i],
			// 				offset: new AMap.Pixel(-13, -30),
			// 				map: map1
			// 			});
			// 			console.log(list[i].location)
			// 			markerList.setTitle(list[i].carMark +""+ list[i].location)
			// 			// markerList.Cname = list[i].location
			// 			//点标注的点击事件
			// 			// markerList.on('click', (e)=>{
			// 			// 	console.log(e)
			// 			// 	alert(e.target.Cname);
			// 			// });
			// 			// marker.content = '我是第' + (i + 1) + '个Marker';
			// 			// marker.on('click', markerClick);
			// 			// marker.emit('click', {target: marker});
			// 		}
			// 		console.log(markerList)
			// 		// var marker1 = new AMap.Marker({
			// 		// 	icon: "https://webapi.amap.com/images/car.png",
			// 		// 	position: [last_lon, last_lat],
			// 		// 	offset: new AMap.Pixel(-13, -30)
			// 		// });
			// 		// var markerList = [marker1,marker2]
			// 		// marker1.setMap(map1);
			// 		map1.add(markerList)
			// 	}, 200)
			// },
		}
	}
</script>

<style scoped>

</style>
