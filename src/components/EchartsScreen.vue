<template>
	<div class="box">
		<div class="header">
			<div class="header_text">天康智能运力实时监控系统</div>
			<div class="showTime">{{nowTime}}</div>
		</div>
		<div class="mainbox">
			<!-- 左3份 -->
			<div class="column">
				<div class="panel bar" style="height: 7.5rem;">
					<h2>当月里程排行</h2>
					<div class="chart" style="height: 6.5rem;">
						<monthDistance></monthDistance>
					</div>
					<div class="panel-footer"></div>
				</div>
				<div class="panel bar" >
					<h2>第一个标题</h2>
					<div class="chart"></div>
					<div class="panel-footer"></div>
				</div>
			</div>
			<!-- 中5份 -->
			<div class="column">
				<!-- 中部数字模块 -->
				<div class="no">
					<div class="no-hd">
						<ul>
							<li>{{carTotalNum}}</li>
							<li>{{distanceTotalNum}}</li>
						</ul>
					</div>
					<div class="no-bd">
						<ul>
							<li>车辆总数</li>
							<li>行驶总里程</li>
						</ul>
					</div>
				</div>
				<!-- 中部地图模块 -->
				<div class="map">
					<div class="map1"></div>
					<div class="map2"></div>
					<div class="map3"></div>
					<div class="chart" ref="mapRef"></div>
				</div>
			</div>
			<!-- 右3份 -->
			<div class="column">
				<div class="panel bar">
					<h2>第一个标题</h2>
					<div class="chart"></div>
					<div class="panel-footer"></div>
				</div>
				<div class="panel bar" style="height: 7.5rem;">
					<h2>第一个标题</h2>
					<div class="chart"></div>
					<div class="panel-footer"></div>
				</div>
				<!-- <dv-scroll-board :config="config" style="width:300px;height:220px" /> -->
			</div>
		</div>
	</div>
</template>

<script>
	import china from '../assets/echartsScreen/china.js'
	import MonthDistance from './EchartsComp/MonthDistance.vue'
	export default {
		components: {
		  MonthDistance,
		},
		data() {
			return {
				mapInstane: null,
				nowTime: '',
				timerId: null,
				distanceTiId: null,
				carTotalNum:null,
				distanceTotalNum:null,
				config: {
					header: ['列1', '列2', '列3'],
					data: [
						['行1列1', '行1列2', '行1列3'],
						['行2列1', '行2列2', '行2列3'],
						['行3列1', '行3列2', '行3列3'],
						['行4列1', '行4列2', '行4列3'],
						['行5列1', '行5列2', '行5列3'],
						['行6列1', '行6列2', '行6列3'],
						['行7列1', '行7列2', '行7列3'],
						['行8列1', '行8列2', '行8列3'],
						['行9列1', '行9列2', '行9列3'],
						['行10列1', '行10列2', '行10列3']
					],
					headerBGC: 'rgba(0, 132, 255, .3)',
					oddRowBGC: 'rgba(19, 73, 129, 0.4)',
					evenRowBGC: 'rgba(11, 26, 82, 0.24)',
					waitTime: 3000, // 轮播时间间隔(ms)
				}
			}
		},
		mounted(){
		       this.initChart()

		    },
		created() {
			this.getNowTime()
			this.getCarTotalNum()
			this.getDistanceTotalNum()
		},
		destroyed() {
			clearInterval(this.timerId) //组件销毁的时候销毁定时器
			clearInterval(this.distanceTiId) //组件销毁的时候销毁定时器
		},
		methods: {
			// 获取车辆总数
			async getCarTotalNum(){
				const {
					data: res
				} = await this.$http.get('data/findCarNumber')
				console.log('车总数',res)
				this.carTotalNum = res[0].value
			},
			// 获取总公里数
			 getDistanceTotalNum(){
				if (this.distanceTiId) {
					clearInterval(this.distanceTiId)
				} // 保险操作，先判断是否存在定时器，存在的话关闭
				this.distanceTiId = setInterval(async () => {
					const {
						data: res
					} = await this.$http.get('data/findNumber')
					// console.log('里程总数',res)
					this.distanceTotalNum = res[0].value
				},1000)
				
			},
			getNowTime() {
				if (this.timerId) {
					clearInterval(this.timerId)
				} // 保险操作，先判断是否存在定时器，存在的话关闭
				this.timerId = setInterval(() => {
					let dt = new Date();
					var y = dt.getFullYear();
					var mt = dt.getMonth() + 1;
					var day = dt.getDate();
					var h = dt.getHours(); //获取时
					var m = dt.getMinutes(); //获取分
					var s = dt.getSeconds(); //获取秒
					this.nowTime = "当前时间：" + y + "年" + mt + "月" + day + "日" + " " + h + "时" + m + "分" + s + "秒";
				}, 1000)
			},
			// 初始化图表 
			initChart() {
				// 1. 实例化对象
				this.mapInstane = this.$echarts.init(document.querySelector(".map .chart"));
				// 2. 指定配置和数据
				var geoCoordMap = {
					上海: [121.4648, 31.2891],
					东莞: [113.8953, 22.901],
					东营: [118.7073, 37.5513],
					中山: [113.4229, 22.478],
					临汾: [111.4783, 36.1615],
					临沂: [118.3118, 35.2936],
					丹东: [124.541, 40.4242],
					丽水: [119.5642, 28.1854],
					乌鲁木齐: [87.9236, 43.5883],
					佛山: [112.8955, 23.1097],
					保定: [115.0488, 39.0948],
					兰州: [103.5901, 36.3043],
					包头: [110.3467, 41.4899],
					北京: [116.4551, 40.2539],
					北海: [109.314, 21.6211],
					南京: [118.8062, 31.9208],
					南宁: [108.479, 23.1152],
					南昌: [116.0046, 28.6633],
					南通: [121.1023, 32.1625],
					厦门: [118.1689, 24.6478],
					台州: [121.1353, 28.6688],
					合肥: [117.29, 32.0581],
					呼和浩特: [111.4124, 40.4901],
					咸阳: [108.4131, 34.8706],
					哈尔滨: [127.9688, 45.368],
					唐山: [118.4766, 39.6826],
					嘉兴: [120.9155, 30.6354],
					大同: [113.7854, 39.8035],
					大连: [122.2229, 39.4409],
					天津: [117.4219, 39.4189],
					太原: [112.3352, 37.9413],
					威海: [121.9482, 37.1393],
					宁波: [121.5967, 29.6466],
					宝鸡: [107.1826, 34.3433],
					宿迁: [118.5535, 33.7775],
					常州: [119.4543, 31.5582],
					广州: [113.5107, 23.2196],
					廊坊: [116.521, 39.0509],
					延安: [109.1052, 36.4252],
					张家口: [115.1477, 40.8527],
					徐州: [117.5208, 34.3268],
					德州: [116.6858, 37.2107],
					惠州: [114.6204, 23.1647],
					成都: [103.9526, 30.7617],
					扬州: [119.4653, 32.8162],
					承德: [117.5757, 41.4075],
					拉萨: [91.1865, 30.1465],
					无锡: [120.3442, 31.5527],
					日照: [119.2786, 35.5023],
					昆明: [102.9199, 25.4663],
					杭州: [119.5313, 29.8773],
					枣庄: [117.323, 34.8926],
					柳州: [109.3799, 24.9774],
					株洲: [113.5327, 27.0319],
					武汉: [114.3896, 30.6628],
					汕头: [117.1692, 23.3405],
					江门: [112.6318, 22.1484],
					沈阳: [123.1238, 42.1216],
					沧州: [116.8286, 38.2104],
					河源: [114.917, 23.9722],
					泉州: [118.3228, 25.1147],
					泰安: [117.0264, 36.0516],
					泰州: [120.0586, 32.5525],
					济南: [117.1582, 36.8701],
					济宁: [116.8286, 35.3375],
					海口: [110.3893, 19.8516],
					淄博: [118.0371, 36.6064],
					淮安: [118.927, 33.4039],
					深圳: [114.5435, 22.5439],
					清远: [112.9175, 24.3292],
					温州: [120.498, 27.8119],
					渭南: [109.7864, 35.0299],
					湖州: [119.8608, 30.7782],
					湘潭: [112.5439, 27.7075],
					滨州: [117.8174, 37.4963],
					潍坊: [119.0918, 36.524],
					烟台: [120.7397, 37.5128],
					玉溪: [101.9312, 23.8898],
					珠海: [113.7305, 22.1155],
					盐城: [120.2234, 33.5577],
					盘锦: [121.9482, 41.0449],
					石家庄: [114.4995, 38.1006],
					福州: [119.4543, 25.9222],
					秦皇岛: [119.2126, 40.0232],
					绍兴: [120.564, 29.7565],
					聊城: [115.9167, 36.4032],
					肇庆: [112.1265, 23.5822],
					舟山: [122.2559, 30.2234],
					苏州: [120.6519, 31.3989],
					莱芜: [117.6526, 36.2714],
					菏泽: [115.6201, 35.2057],
					营口: [122.4316, 40.4297],
					葫芦岛: [120.1575, 40.578],
					衡水: [115.8838, 37.7161],
					衢州: [118.6853, 28.8666],
					西宁: [101.4038, 36.8207],
					西安: [109.1162, 34.2004],
					贵阳: [106.6992, 26.7682],
					连云港: [119.1248, 34.552],
					邢台: [114.8071, 37.2821],
					邯郸: [114.4775, 36.535],
					郑州: [113.4668, 34.6234],
					鄂尔多斯: [108.9734, 39.2487],
					重庆: [107.7539, 30.1904],
					金华: [120.0037, 29.1028],
					铜川: [109.0393, 35.1947],
					银川: [106.3586, 38.1775],
					镇江: [119.4763, 31.9702],
					长春: [125.8154, 44.2584],
					长沙: [113.0823, 28.2568],
					长治: [112.8625, 36.4746],
					阳泉: [113.4778, 38.0951],
					青岛: [120.4651, 36.3373],
					韶关: [113.7964, 24.7028]
				};

				var XAData = [
					[{
						name: "西安"
					}, {
						name: "北京",
						value: 100
					}],
					[{
						name: "西安"
					}, {
						name: "上海",
						value: 100
					}],
					[{
						name: "西安"
					}, {
						name: "广州",
						value: 100
					}],
					[{
						name: "西安"
					}, {
						name: "西宁",
						value: 100
					}],
					[{
						name: "西安"
					}, {
						name: "拉萨",
						value: 100
					}]
				];

				var XNData = [
					[{
						name: "西宁"
					}, {
						name: "北京",
						value: 100
					}],
					[{
						name: "西宁"
					}, {
						name: "上海",
						value: 100
					}],
					[{
						name: "西宁"
					}, {
						name: "广州",
						value: 100
					}],
					[{
						name: "西宁"
					}, {
						name: "西安",
						value: 100
					}],
					[{
						name: "西宁"
					}, {
						name: "银川",
						value: 100
					}]
				];

				var YCData = [
					[{
						name: "拉萨"
					}, {
						name: "北京",
						value: 100
					}],
					[{
						name: "拉萨"
					}, {
						name: "潍坊",
						value: 100
					}],
					[{
						name: "拉萨"
					}, {
						name: "哈尔滨",
						value: 100
					}]
				];

				var planePath =
					"path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
				//var planePath = 'arrow';
				var convertData = function(data) {
					var res = [];
					for (var i = 0; i < data.length; i++) {
						var dataItem = data[i];

						var fromCoord = geoCoordMap[dataItem[0].name];
						var toCoord = geoCoordMap[dataItem[1].name];
						if (fromCoord && toCoord) {
							res.push({
								fromName: dataItem[0].name,
								toName: dataItem[1].name,
								coords: [fromCoord, toCoord],
								value: dataItem[1].value
							});
						}
					}
					return res;
				};

				var color = ["#fff", "#fff", "#fff"]; //航线的颜色
				var series = [];
				[
					["西安", XAData],
					["西宁", XNData],
					["银川", YCData]
				].forEach(function(item, i) {
					series.push({
						name: item[0] + " Top3",
						type: "lines",
						zlevel: 1,
						effect: {
							show: true,
							period: 6,
							trailLength: 0.7,
							color: "red", //arrow箭头的颜色
							symbolSize: 3
						},
						lineStyle: {
							normal: {
								color: color[i],
								width: 0,
								curveness: 0.2
							}
						},
						data: convertData(item[1])
					}, {
						name: item[0] + " Top3",
						type: "lines",
						zlevel: 2,
						symbol: ["none", "arrow"],
						symbolSize: 10,
						effect: {
							show: true,
							period: 6,
							trailLength: 0,
							symbol: planePath,
							symbolSize: 15
						},
						lineStyle: {
							normal: {
								color: color[i],
								width: 1,
								opacity: 0.6,
								curveness: 0.2
							}
						},
						data: convertData(item[1])
					}, {
						name: item[0] + " Top3",
						type: "effectScatter",
						coordinateSystem: "geo",
						zlevel: 2,
						rippleEffect: {
							brushType: "stroke"
						},
						label: {
							normal: {
								show: true,
								position: "right",
								formatter: "{b}"
							}
						},
						symbolSize: function(val) {
							return val[2] / 8;
						},
						itemStyle: {
							normal: {
								color: color[i]
							},
							emphasis: {
								areaColor: "#2B91B7"
							}
						},
						data: item[1].map(function(dataItem) {
							return {
								name: dataItem[1].name,
								value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
							};
						})
					});
				});
				var option = {
					tooltip: {
						trigger: "item",
						formatter: function(params, ticket, callback) {
							if (params.seriesType == "effectScatter") {
								return "线路：" + params.data.name + "" + params.data.value[2];
							} else if (params.seriesType == "lines") {
								return (
									params.data.fromName +
									">" +
									params.data.toName +
									"<br />" +
									params.data.value
								);
							} else {
								return params.name;
							}
						}
					},

					geo: {
						map: "china",
						label: {
							emphasis: {
								show: true,
								color: "#fff"
							}
						},
						roam: false,
						//   放大我们的地图
						zoom: 1,
						itemStyle: {
							normal: {
								areaColor: "rgba(43, 196, 243, 0.42)",
								borderColor: "rgba(43, 196, 243, 1)",
								borderWidth: 1
							},
							emphasis: {
								areaColor: "#2B91B7"
							}
						}
					},
					series: series
				};
				this.mapInstane.setOption(option)
				// myChart.setOption(option);
				window.addEventListener("resize", () => {
					this.mapInstane.resize();
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.box {
		background: url(../assets/echartsScreen/bgNew.jpg) no-repeat top center;
		width: 100%;
		// height: 100%;
		line-height: 1.15;
	}

	// 初始化li，不要前面圆点
	li {
		list-style: none;
	}

	// 引入图标字体
	@font-face {
		font-family: electronicFont;
		src: url(../assets/echartsScreen/DS-DIGIT.TTF);
	}

	.header {
		position: relative;
		height: 1rem;

		.header_text {
			font-size: 0.65rem;
			color: #FFFFFF;
			text-align: center;
			line-height: 1rem;
		}

		.showTime {
			position: absolute;
			top: 0;
			right: 0.375rem;
			line-height: 0.75rem;
			color: rgba(255, 255, 255);
			font-size: 0.25rem;
		}
	}

	.mainbox {
		min-width: 1024px;
		max-width: 1920px;
		padding: 0.125rem 0.125rem 0;
		display: flex;
		overflow: hidden;
		.column {
			flex: 3;

			&:nth-child(2) {
				flex: 5;
				margin: 0 .125rem .1875rem;
			}

		}
	}

	.panel {
		position: relative;
		height: 3.4rem;
		border: 1px solid rgba(25, 186, 139, 0.17);
		background: rgba(255, 255, 255, 0.04) url(../assets/echartsScreen/line.png);
		padding: 0 0.1875rem 0.5rem;
		margin-bottom: 0.1875rem;

		&::before {
			position: absolute;
			top: 0;
			left: 0;
			content: "";
			width: 10px;
			height: 10px;
			border-top: 2px solid #02a6b5;
			border-left: 2px solid #02a6b5;
		}

		&::after {
			position: absolute;
			top: 0;
			right: 0;
			content: "";
			width: 10px;
			height: 10px;
			border-top: 2px solid #02a6b5;
			border-right: 2px solid #02a6b5;
		}

		.panel-footer {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;

			&::before {
				position: absolute;
				bottom: 0;
				left: 0;
				content: "";
				width: 10px;
				height: 10px;
				border-bottom: 2px solid #02a6b5;
				border-left: 2px solid #02a6b5;
			}

			&::after {
				position: absolute;
				bottom: 0;
				right: 0;
				content: "";
				width: 10px;
				height: 10px;
				border-bottom: 2px solid #02a6b5;
				border-right: 2px solid #02a6b5;
			}
		}

		h2 {
			height: 0.6rem;
			line-height: 0.6rem;
			text-align: center;
			color: #fff;
			font-size: 0.25rem;
			font-weight: 400;

			a {
				margin: 0 0.1875rem;
				color: #fff;
				text-decoration: underline;
			}
		}

		.chart {
			height: 3rem;
		}
	}

	.no {
		background: rgba(101, 132, 226, 0.1);
		padding: 0.1875rem;

		.no-hd {
			position: relative;
			border: 1px solid rgba(25, 186, 139, 0.17);

			&::before {
				content: "";
				position: absolute;
				width: 30px;
				height: 10px;
				border-top: 2px solid #02a6b5;
				border-left: 2px solid #02a6b5;
				top: 0;
				left: 0;
			}

			&::after {
				content: "";
				position: absolute;
				width: 30px;
				height: 10px;
				border-bottom: 2px solid #02a6b5;
				border-right: 2px solid #02a6b5;
				right: 0;
				bottom: 0;
			}

			ul {
				display: flex;

				li {
					position: relative;
					flex: 1;
					text-align: center;
					height: 1rem;
					line-height: 1rem;
					font-size: 0.875rem;
					color: #ffeb7b;
					padding: 0.05rem 0;
					font-family: electronicFont;
					font-weight: bold;

					&:first-child::after {
						content: "";
						position: absolute;
						height: 50%;
						width: 1px;
						background: rgba(255, 255, 255, 0.2);
						right: 0;
						top: 25%;
					}
				}
			}
		}

		.no-bd ul {
			display: flex;

			li {
				flex: 1;
				height: 0.5rem;
				line-height: 0.5rem;
				text-align: center;
				font-size: 0.275rem;
				color: rgba(255, 255, 255, 0.8);
				padding-top: 0.125rem;
			}
		}
	}

	.map {
		position: relative;
		height: 9.125rem;
		.chart {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 5;
			height: 10.125rem;
			width: 100%;
		}

		.map1,
		.map2,
		.map3 {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 6.475rem;
			height: 6.475rem;
			background: url(../assets/echartsScreen/map.png) no-repeat;
			background-size: 100% 100%;
			opacity: 0.3;
			
		}

		.map2 {
			width: 8.0375rem;
			height: 8.0375rem;
			background-image: url(../assets/echartsScreen/lbx.png);
			opacity: 0.6;
			//动画的使用  使用哪个 速度 匀速 无限循环
			animation: rotate 15s linear infinite;
			z-index: 2;
		}

		.map3 {
			width: 7.075rem;
			height: 7.075rem;
			background-image: url(../assets/echartsScreen/jt.png);
			animation: rotate1 10s linear infinite;
			opacity: 0.9;
		}

		@keyframes rotate {
			from {
				transform: translate(-50%, -50%) rotate(0deg);
			}

			to {
				transform: translate(-50%, -50%) rotate(360deg);
			}
		}

		@keyframes rotate1 {
			from {
				transform: translate(-50%, -50%) rotate(0deg);
			}

			to {
				transform: translate(-50%, -50%) rotate(-360deg);
			}
		}
	}
</style>
