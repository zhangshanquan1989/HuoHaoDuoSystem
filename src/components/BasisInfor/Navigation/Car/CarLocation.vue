<template>
	<div>
		<!-- <el-card class="box-card"> -->
			<div style="font-size: 14px;text-align: center;color: darkred">注意：此页面数据接口为数据流模式，打开页面后需要等待一段时间待数据同步以后再查询。</div>
		<!-- </el-card> -->
		<el-container style="margin-top: 10px;">
			<el-aside width="230px" style="height: 800px;">
				<el-card class="box-card">
					<div>
						<el-input placeholder="车牌号" v-model="license" clearable @clear="inputClear">
							<el-button slot="append" icon="el-icon-search" @click="searchCarNo"></el-button>
						</el-input>
					</div>
					<div style="margin-top: 8px;">
						<el-button type="primary" plain size="mini" @click="handleQuery" v-loading.fullscreen.lock="fullscreenLoading">查询选中</el-button>
						<el-button type="primary" plain size="mini" @click="handleClear" style="margin-left: 10px;">清除选中</el-button>
					</div>
					<div style="margin-top: 10px;margin-left: 10px;padding-left: 10px;">
						<el-checkbox-group v-model="chooseCarData" :max="40">
							<el-checkbox v-for="item in checkBoxData" :label="item.licenseplate" :key="item.index">{{item.licenseplate}}</el-checkbox>
						</el-checkbox-group>
					</div>

				</el-card>
			</el-aside>
			<el-main style="padding: 0;margin-left: 10px;">
				<el-card class="box-card" style="height: 800px;">
					<div id="allCarLocition" style="width: 100%;height: 760px"></div>
				</el-card>
			</el-main>
		</el-container>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				allList: [],
				newmap: {},
				timerId: null, //标识
				firstID: null, //标识
				license: '',
				// 加载查询CarCurrentStatus
				fullscreenLoading: false,
				chooseCarData: [],
				checkBoxData: [],
				// carJointList: [],
				findOutArray: [],
			}
		},
		created() {
			this.getBeginData()
			this.connect()
			// console.log(this.getAAddress(116.396574, 39.992706))
		},
		destroyed() {
			clearInterval(this.timerId) //组件销毁的时候销毁定时器

		},
		mounted() {
			this.initMap()
		},
		methods: {
			// async findAllCarLicense() {
			// 	const {
			// 		data: res
			// 	} = await this.$http.get('yk_carinformation/listall')
			// 	// console.log(res)
			// 	if (res.code !== 200) {
			// 		return this.$message.error(res.message)
			// 	}
			// 	this.allList = res.result
			// 	this.checkBoxData = this.allList
			// 	// this.allCarLicenseList = res.result.map(item => {
			// 	// 	return {
			// 	// 		value: `${item}`,
			// 	// 		label: `${item}`
			// 	// 	};
			// 	// });
			// 	// this.carLicenseOptions = this.allCarLicenseList

			// },
			// 清空查询
			inputClear() {
				this.checkBoxData = this.allList
			},
			// 模糊查询
			async searchCarNo() {
				const {
					data: res
				} = await this.$http.get('yk_carinformation/listall?license=' + this.license)
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.checkBoxData = res.result
			},
			// 点击清空
			handleClear() {
				this.newmap.clearMap();
				this.findOutArray = []
				this.chooseCarData = []
			},
			// 查询
			async handleQuery() {
				this.newmap.clearMap();
				this.findOutArray = []
				// console.log('选择的数组', this.chooseCarData)
				if (!this.chooseCarData[0]) {
					return this.$message.error('请选择车牌！')
				}
				this.chooseCarData.forEach(v => {
					this.allList.forEach(j => {
						if (v == j.licenseplate && j.longitude) {
							this.findOutArray.push(j)
							// console.log('查询后的数组', this.findOutArray)
						}
					})
				})



				setTimeout(() => {
					this.allLocationList = this.findOutArray.map(item => {
						return [item.longitude, item.latitude]
					})
					// console.log('组合的经纬度', this.allLocationList)
					if (!this.allLocationList[0]) {
						return this.$message.warning('还未查询到数据，稍后再试。')
					} else {
						for (var i = 0, markerList; i < this.allLocationList.length; i++) {
							var markerList = new AMap.Marker({
								icon: "https://tkhhd.com/imgs/kache.png",
								position: this.allLocationList[i],
								offset: new AMap.Pixel(-13, -30),
								map: this.newmap
							});
							// console.log(allList[i].location)
							// markerList.setLabel({
							// 	offset: new AMap.Pixel(0, -25), //设置文本标注偏移量
							// 	content: "<div class='info'>" + this.findOutArray[i].licenseplate + "</div>", //设置文本标注内容
							// 	direction: 'center' //设置文本标注方位
							// });
							markerList.setTitle('车牌号：' + this.findOutArray[i].licenseplate + '\n' + '总里程：' + this.findOutArray[i].mileageDD +
								'KM' + '\n' + '总油耗：' + this.findOutArray[i].totalFuelConsumption + 'L')
						}
						this.newmap.add(markerList)
					}


				}, 2000)
			},


			// 逆地理编码
			getAAddress(lon, lat) {
				const Geocoder = new AMap.Geocoder();
				Geocoder.getAddress([lon, lat], (status, result) => {
					if (status === 'complete' && result.regeocode) {
						// address即经纬度转换后的地点名称 
						// console.log('result', result.regeocode.formattedAddress)
						return result.regeocode.formattedAddress
					}
				});
			},
			// 分割tcp数据字符串
			splitStr(start, end, str) {
				let temp = str.split(start);
				let content = temp[2].split(end, 2);
				return '{' + content[0] + '}';
			},
			// 获取车辆位置信息
			async connect() {
				// console.log('点击链接')
				//测试
				// const ws = new WebSocket('ws://82.157.15.221:8080/jeecg-boot/websocket')
				//线上
				const ws = new WebSocket('wss://tkhhd.com/jeecg-boot/websocket')

				ws.onopen = () => {
					// console.log('连接成功。。。')
				}
				ws.onmessage = msg => {
					// console.log('从服务端接收到数据了')
					// const recvData = JSON.parse(msg.data)
					const recvData = JSON.parse(this.splitStr('{', '}', msg.data));
					this.allList.forEach(v => {
						if (v.devicenumber == recvData.terminal) {
							// 纬度
							v.latitude = recvData.latitude / 1000000
							// 经度
							v.longitude = recvData.longitude / 1000000
							// 仪表总里程(单位:km)
							v.mileageDD = recvData.mileageDD
							// ECU总油耗(单位:L)
							v.totalFuelConsumption = recvData.totalFuelConsumption
						}
					})
					// console.log('newallList',this.allList)
					// console.log('recvData',recvData)
					// console.log('msg.data',msg.data)
				}
			},
			// 获取所有车辆原始数据
			async getBeginData() {
				const {
					data: res
				} = await this.$http.get('yk_carinformation/listall')
				// console.log('res', res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.allList = res.result
				this.allList.forEach(v => {
					v.latitude = null
					v.longitude = null
					v.tripDistanceDD = null
					v.totalFuelConsumption = null
				})
				this.checkBoxData = this.allList
				// this.firstInterval()
				// this.startInterval()
				// console.log('allList', this.allList)
			},

			// 初始化地图
			initMap() {
				this.newmap = new AMap.Map("allCarLocition", {
					resizeEnable: true, //窗口大小调整
					center: [116.478935, 39.997761], //中心 firstArr: [116.478935, 39.997761],
					zoom: 5
				});
				this.newmap.addControl(new AMap.ToolBar());
			},

			firstInterval() {
				var timesRun = 0;
				this.firstID = setInterval(() => {
					timesRun += 2;
					if (timesRun === 10) {
						clearInterval(this.firstID);
					}
					//do whatever here..
					this.newmap.clearMap();
					this.allList.forEach(v => {
						if (!v.longitude) {
							return
						}
						var markerList = new AMap.Marker({
							icon: "https://tkhhd.com/imgs/kache.png",
							position: [v.longitude, v.latitude],
							offset: new AMap.Pixel(-13, -30),
							map: this.newmap
						});
						markerList.setTitle('车牌号：' + v.licenseplate + '\n' + '总里程：' + v.mileageDD + 'KM' + '\n' + '总油耗：' + v.totalFuelConsumption +
							'L')
						markerList.setLabel({
							offset: new AMap.Pixel(0, -25), //设置文本标注偏移量
							content: "<div class='info'>" + v.licenseplate + "</div>", //设置文本标注内容
							direction: 'center' //设置文本标注方位
						});
						this.newmap.add(markerList)
					})
				}, 2000);
			},

			startInterval() {
				if (this.timerId) {
					clearInterval(this.timerId)
				} // 保险操作，先判断是否存在定时器，存在的话关闭 serInterval
				this.timerId = setInterval(() => {
					// 要执行的操作
					this.newmap.clearMap();
					this.allList.forEach(v => {
						if (!v.longitude) {
							return
						}
						var markerList = new AMap.Marker({
							icon: "https://tkhhd.com/imgs/kache.png",
							position: [v.longitude, v.latitude],
							offset: new AMap.Pixel(-13, -30),
							map: this.newmap
						});
						markerList.setTitle('车牌号：' + v.licenseplate + '\n' + '总里程：' + v.mileageDD + 'KM' + '\n' + '总油耗：' + v.totalFuelConsumption +
							'L')
						markerList.setLabel({
							offset: new AMap.Pixel(0, -25), //设置文本标注偏移量
							content: "<div class='info'>" + v.licenseplate + "</div>", //设置文本标注内容
							direction: 'center' //设置文本标注方位
						});
						this.newmap.add(markerList)
					})
				}, 10000)
			},
		}
	}
</script>

<style scoped>
	#allCarLocition .amap-marker-label {
		position: absolute;
		z-index: 2;
		border: 1px solid #ccc;
		background-color: blue;
		white-space: nowrap;
		cursor: default;
		padding: 3px;
		font-size: 12px;
		line-height: 14px;
		color: #fff;
		margin-left: -2px;
	}

	.amap-marker-label:after {
		position: absolute;
		border: 5px solid transparent;
		border-top-color: #fff;
		top: 19px;
		left: 43%;
		content: '';
		width: 0;
		height: 0;
	}

	.info {
		background-color: red;
		color: #0000FF;
	}
</style>
