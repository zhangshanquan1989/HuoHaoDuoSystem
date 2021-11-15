<template>
	<!-- 该class内样式为宽高100%   需要设置两个div的宽高-->
	<div class="com-container">
		<!-- <div style="font-size: 24px;">地图地图地图地图</div> -->
		<div class="com-chart" ref="trendRef"></div>
	</div>
</template>

<script>
	let mapInstane = null
	export default {
		data() {
			return {
				chartInstane: null,
				allData: null, // 从服务器获取的所有数据
			}
		},
		mounted() {
			console.log('载入地图')
			this.initChart()
			// this.getData()
			// window.addEventListener('resize',this.screenAdapter) //监听分辨率变化
			// this.screenAdapter() //第一次主动触发分辨率计算
		},
		beforeDestroy() {
			mapInstane.clear()
		},
		destroyed() {

			window.removeEventListener('resize', this.screenAdapter) //取消监听
		},
		methods: {
			// 初始化图表
			initChart() {
				if(mapInstane){
					mapInstane.clear()
				}
				mapInstane = this.$echarts.init(this.$refs.trendRef)
				// 2. 指定配置和数据    china

				var mapName = 'china'
				var data = [
					{
						name: "烟台",
						value: '烟台'
					},
					{
						name: "兰州",
						value: '兰州'
					},
					{
						name: "天津",
						value: '天津'
					},
					{
						name: "宝鸡",
						value: '宝鸡'
					},
					{
						name: "汉中",
						value: '汉中'
					},
					{
						name: "西安",
						value: '西安'
					},
					{
						name: "晋中",
						value: '晋中'
					},
					{
						name: "运城",
						value: '运城'
					},
					{
						name: "临汾",
						value: '临汾'
					},
					{
						name: "太原",
						value: '太原'
					},
					{
						name: "临朐",
						value: '临朐'
					},
					{
						name: "即墨",
						value: '即墨'
					},
					{
						name: "平度",
						value: '平度'
					},
					{
						name: "高密",
						value: '高密'
					},
					{
						name: "济宁",
						value: '济宁'
					},
					{
						name: "黄岛",
						value: '黄岛'
					},
					{
						name: "济南",
						value: '济南'
					},
					{
						name: "菏泽",
						value: '菏泽'
					},
					{
						name: "淄博",
						value: '淄博'
					},
					{
						name: "莒县",
						value: '莒县'
					},
					{
						name: "日照",
						value: '日照'
					},
					{
						name: "沂水",
						value: '沂水'
					},
					{
						name: "沂源",
						value: '沂源'
					},
					{
						name: "安丘",
						value: '安丘'
					},
					{
						name: "海阳",
						value: '海阳'
					},
					{
						name: "龙口",
						value: '龙口'
					},
					{
						name: "烟台",
						value: '烟台'
					},
					{
						name: "德州",
						value: '德州'
					},
					{
						name: "滨州",
						value: '滨州'
					},
					{
						name: "邹城",
						value: '邹城'
					},
					{
						name: "威海",
						value: '威海'
					},
					{
						name: "巨野",
						value: '巨野'
					},
					{
						name: "微山",
						value: '微山'
					},
					{
						name: "金乡",
						value: '金乡'
					},
					{
						name: "东营",
						value: '东营'
					},
					{
						name: "青州",
						value: '青州'
					},
					{
						name: "枣庄",
						value: '枣庄'
					},
					{
						name: "昌乐",
						value: '昌乐'
					},
					{
						name: "章丘",
						value: '章丘'
					},
					{
						name: "长清",
						value: '长清'
					},
					{
						name: "邹平",
						value: '邹平'
					},
					{
						name: "莱芜",
						value: '莱芜'
					},
					{
						name: "齐河",
						value: '齐河'
					},
					{
						name: "肥城",
						value: '肥城'
					},
					{
						name: "聊城",
						value: '聊城'
					},
					{
						name: "郓城",
						value: '郓城'
					},
					{
						name: "平阴",
						value: '平阴'
					},
					{
						name: "蒙阴",
						value: '蒙阴'
					},
					{
						name: "平邑",
						value: '平邑'
					},
					{
						name: "泰安",
						value: '泰安'
					},
					{
						name: "临沂",
						value: '临沂'
					},
					{
						name: "呼市",
						value: '呼市'
					},
					{
						name: "赤峰",
						value: '赤峰'
					},
					{
						name: "赣州",
						value: '赣州'
					},
					{
						name: "南昌",
						value: '南昌'
					},
					{
						name: "徐州",
						value: '徐州'
					},
					{
						name: "无锡",
						value: '无锡'
					},
					{
						name: "南京",
						value: '南京'
					},
					{
						name: "南通",
						value: '南通'
					},
					{
						name: "苏州",
						value: '苏州'
					},
					{
						name: "徐州",
						value: '徐州'
					},
					{
						name: "长沙",
						value: '长沙'
					},
					{
						name: "邵阳",
						value: '邵阳'
					},
					{
						name: "衡阳",
						value: '衡阳'
					},
					{
						name: "随州",
						value: '随州'
					},
					{
						name: "黄冈",
						value: '黄冈'
					},
					{
						name: "武汉",
						value: '武汉'
					},
					{
						name: "郑州",
						value: '郑州'
					},
					{
						name: "开封",
						value: '开封'
					},
					{
						name: "安阳",
						value: '安阳'
					},
					{
						name: "新乡",
						value: '新乡'
					},
					{
						name: "濮阳",
						value: '濮阳'
					},
					{
						name: "信阳",
						value: '信阳'
					},
					{
						name: "郑州",
						value: '郑州'
					},
					{
						name: "洛阳",
						value: '洛阳'
					},
					{
						name: "南阳",
						value: '南阳'
					},
					{
						name: "鹤壁",
						value: '鹤壁'
					},
					{
						name: "商丘",
						value: '商丘'
					},
					{
						name: "周口",
						value: '周口'
					},
					{
						name: "驻马店",
						value: '驻马店'
					},
					{
						name: "许昌",
						value: '许昌'
					},
					{
						name: "平顶山",
						value: '平顶山'
					},
					{
						name: "张家口",
						value: '张家口'
					},
					{
						name: "秦皇岛",
						value: '秦皇岛'
					},
					{
						name: "唐山",
						value: '唐山'
					},
					{
						name: "石家庄",
						value: '石家庄'
					},
					{
						name: "保定",
						value: '保定'
					},
					{
						name: "霸州",
						value: '霸州'
					},
					{
						name: "邯郸",
						value: '邯郸'
					},
					{
						name: "承德",
						value: '承德'
					},
					{
						name: "玉田",
						value: '玉田'
					},
					{
						name: "沧州",
						value: '沧州'
					},
					{
						name: "邢台",
						value: '邢台'
					},
					{
						name: "廊坊",
						value: '廊坊'
					},
					{
						name: "赵县",
						value: '赵县'
					},
					{
						name: "磐石",
						value: '磐石'
					},
					{
						name: "长春",
						value: '长春'
					},
					{
						name: "葫芦岛",
						value: '葫芦岛'
					},
					{
						name: "大东",
						value: '大东'
					},
					{
						name: "苏家屯",
						value: '苏家屯'
					},
					{
						name: "白城",
						value: '白城'
					},
					{
						name: "宾县",
						value: '宾县'
					},
					{
						name: "大庆",
						value: '大庆'
					},
					{
						name: "香坊",
						value: '香坊'
					},
					{
						name: "双城",
						value: '双城'
					},
					{
						name: "阿城",
						value: '阿城'
					},
					{
						name: "铁岭",
						value: '铁岭'
					},
					{
						name: "阜阳",
						value: '阜阳'
					},
					{
						name: "亳州",
						value: '亳州'
					},
					{
						name: "淮北",
						value: '淮北'
					},
					{
						name: "合肥",
						value: '合肥'
					},
					{
						name: "宿州",
						value: '宿州'
					},
					{
						name: "蚌埠",
						value: '蚌埠'
					},
					{
						name: "滁州",
						value: '滁州'
					},
					{
						name: "淮南",
						value: '淮南'
					},
					{
						name: "芜湖",
						value: '芜湖'
					},
					{
						name: "呼和浩特",
						value: '呼和浩特'
					},
					
					
					
				];

				var geoCoordMap = {
					芜湖: [117.025449, 32.645947],
					淮南: [117.025449, 32.645947],
					滁州: [118.316264, 32.303627],
					蚌埠: [117.36237, 32.934037],
					宿州: [116.984084, 33.633891],
					淮北: [116.794664, 33.971707],
					亳州: [115.782939, 33.869338],
					阜阳: [115.819729, 32.896969],
					铁岭: [123.844279, 42.290585],
					阿城: [126.97525, 45.54144],
					双城: [126.308784, 45.377942],
					香坊: [126.67968, 45.72383],
					大庆: [125.11272, 46.590734],
					宾县: [127.48675, 45.75504],
					白城: [122.841114, 45.619026],
					苏家屯: [123.34405, 41.66475],
					大东: [123.46997, 41.80539],
					磐石: [126.0625, 42.94628],
					赵县: [114.77612, 37.75628],
					玉田: [117.7388, 39.90049],
					霸州: [116.39154, 39.12569],
					平顶山: [113.307718, 33.735241],
					许昌: [113.826063, 34.022956],
					驻马店: [114.024736, 32.980169],
					周口: [114.649653, 33.620357],
					商丘: [115.650497, 34.437054],
					鹤壁: [114.295444, 35.748236],
					南阳: [112.540918, 32.999082],
					洛阳: [112.434468, 34.663041],
					信阳: [114.075031, 32.123274],
					濮阳: [115.041299, 35.768234],
					新乡: [113.883991, 35.302616],
					安阳: [114.352482, 36.103442],
					开封: [114.341447, 34.797049],
					黄冈: [114.879365, 30.447711],
					随州: [113.37377, 31.717497],
					衡阳: [112.607693, 26.900358],
					邵阳: [111.46923, 27.237842],
					赣州: [114.940278, 25.85097],
					赤峰: [118.956806, 42.275317],
					平邑: [117.63867, 35.50573],
					蒙阴: [117.94592, 35.70996],
					平阴: [116.45587, 36.28955],
					郓城: [115.94439, 35.60044],
					肥城: [116.76815, 36.18247],
					齐河: [116.75515, 36.79532],
					邹平: [117.74307, 36.86295],
					长清: [116.75192, 36.55352],
					章丘: [117.53677, 36.71392],
					昌乐: [118.83017, 36.7078],
					青州: [118.47915, 36.68505],
					金乡: [116.31146, 35.065],
					微山: [117.12875, 34.80712],
					巨野: [116.09497, 35.39788],
					邹城: [116.97335, 35.40531],
					龙口: [120.50634, 37.64064],
					海阳: [121.1597, 36.7762],
					安丘: [119.2189, 36.4784],
					沂源: [118.1711, 36.1853],
					沂水: [118.6301, 35.7873],
					莒县: [118.8378, 35.5805],
					黄岛: [120.1977, 35.9606],
					高密: [119.7571, 36.3839],
					平度: [119.9599, 36.7868],
					即墨: [120.4469, 36.3891],
					临朐: [118.544, 36.5121],
					运城: [111.0039, 35.0227],
					晋中: [112.7364, 37.6964],
					汉中: [107.0286, 33.0776],
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
				var max = 480,
					min = 9; // todo 
				var maxSize4Pin = 100,
					minSize4Pin = 20;

				var convertData = function(data) {
					var res = [];
					for (var i = 0; i < data.length; i++) {
						var geoCoord = geoCoordMap[data[i].name];
						if (geoCoord) {
							res.push({
								name: data[i].name,
								value: geoCoord.concat(data[i].value),
							});
						}
					}
					return res;
				};
				var option = {
					// backgroundColor: {
					//        type: 'linear',
					//        x: 0,
					//        y: 0,
					//        x2: 1,
					//        y2: 1,
					//        colorStops: [{
					//            offset: 0, color: '#0f378f' // 0% 处的颜色
					//        }, {
					//            offset: 1, color: '#00091a' // 100% 处的颜色
					//        }],
					//        globalCoord: false // 缺省为 false
					//    },
					// title: {
					//     top:20,
					//     text: '“会员活跃度” - 山东省',
					//     subtext: '',
					//     x: 'center',
					//     textStyle: {
					//         color: '#ccc'
					//     }
					// },    

					// tooltip: {
					//      trigger: 'item',
					//      formatter: function (params) {
					//        if(typeof(params.value)[2] == "undefined"){
					//        	return params.name + ' : ' + params.value;
					//        }else{
					//        	return params.name + ' : ' + params.value[2];
					//        }
					//      }
					//  },
					/*   legend: {
					       orient: 'vertical',
					       y: 'bottom',
					       x: 'right',
					        data:['pm2.5'],
					       textStyle: {
					           color: '#fff'
					       }
					   },*/
					legend: {
						orient: 'vertical',
						y: 'bottom',
						x: 'right',
						data: ['pm2.5'],
						textStyle: {
							color: '#fff'
						}
					},
					visualMap: {
						show: false,
						min: 0,
						max: 500,
						left: 'left',
						top: 'bottom',
						text: ['高', '低'], // 文本，默认为数值文本
						calculable: true,
						seriesIndex: [1],
						inRange: {

						}
					},
					geo: {
						map: 'china',
						show: true,
						roam: false,
						label: {
							normal: {
								show: false
							},
							emphasis: {
								show: false,
							}
						},
						itemStyle: {
							normal: {
								areaColor: "rgba(11, 65, 190, 0.6)",
								borderColor: "rgba(43, 196, 243, 1)",
								shadowColor: '#173398', //外发光
								borderWidth: 1.5,
								shadowBlur: 5
							},
							emphasis: {
								areaColor: "#2B91B7"
							}
						}
					},
					series: [
						
						{
							type: 'map',
							map: 'china',
							geoIndex: 0,
							// zoom:1.8,
							aspectScale: 0.75, //长宽比
							showLegendSymbol: false, // 存在legend时显示
							label: {
								normal: {
									show: false
								},
								emphasis: {
									show: false,
									textStyle: {
										color: '#fff'
									}
								}
							},
							roam: false,
							itemStyle: {
								normal: {
									areaColor: "rgba(43, 196, 243, 0.42)",
									borderColor: '#FFFFFF',
								},
								emphasis: {
									areaColor: '#b72438'
								}
							},
							animation: false,
							data: data
						},
						{
							symbolSize: 5,
							label: {
								normal: {
									formatter: '{b}',
									position: 'right',
									show: false
								},
								emphasis: {
									show: true
								}
							},
							itemStyle: {
								normal: {
									color: '#ffaa00'
								}
							},
							name: 'light',
							type: 'scatter',
							coordinateSystem: 'geo',
							data: convertData(data),
						},
						{
							name: 'Top 5',
							type: 'scatter',
							coordinateSystem: 'geo',
							symbol: 'pin',
							symbolSize: [40, 40],
							label: {
								normal: {
									show: true,
									textStyle: {
										color: '#fff',
										fontSize: 9,
									},
									formatter(value) {
										return value.data.value[2]
									}
								}
							},
							itemStyle: {
								normal: {
									color: '#ffaa00', //标志颜色
								}
							},
							data: convertData(data),
							showEffectOn: 'render',
							rippleEffect: {
								brushType: 'stroke'
							},
							hoverAnimation: true,
							zlevel: 1
						},

					]
				};

				mapInstane.setOption(option)
				// myChart.setOption(option);
				window.addEventListener("resize", () => {
					mapInstane.resize();
				});
				//在此处可以监听鼠标移入移出事件
				mapInstane.on('mouseover', () => {
					//鼠标移入图表进行的操作，如暂停计时器，定时器可以看第10条
				})
				mapInstane.on('mouseout', () => {
					//鼠标移出进行的操作，如开始计时器 
				})
			},
			// 发请求获取数据
			async getData() {
				//  const {
				// 	data: res
				// } = await this.$http.get('data/findCarNumberEveryday', {
				// 	params: this.queryInfo
				// })
				// 对allData进行赋值
				this.updateChart()
			},
			updateChart() {
				// 先处理数据
				const dataOption = {}
				mapInstane.setOption(dataOption)
			},
			//分辨率适配
			screenAdapter() {
				//通过this.$refs.map_ref.offsetWidth可以监听浏览器窗口宽度变化，然后再根据变化进行赋值
				const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
				const adapterOption = {}
				mapInstane.setOption(adapterOption)
				mapInstane.resize() //调用该方法实现适配
			},
		}
	}
</script>

<style lang="less" scoped>
	.com-container {
		width: 100%;
		height: 100%;
	}

	.com-chart {
		width: 100%;
		height: 100%;
	}
</style>
