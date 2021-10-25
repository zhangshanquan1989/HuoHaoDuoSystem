<template>
	<!-- 饼图 -->
	<!-- 该class内样式为宽高100% 需要设置两个div的宽高-->
	<div class="com-container">
		<div class="com-chart" ref="trendRef">
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				chartInstane: null,
				allData: null, // 从服务器获取的所有数据
			}
		},
		mounted() {
			this.initChart()
			this.getData()
			// window.addEventListener('resize',this.screenAdapter) //监听分辨率变化
			// this.screenAdapter() //第一次主动触发分辨率计算
		},
		destroyed() {
			window.removeEventListener('resize', this.screenAdapter) //取消监听
		},
		methods: {
			// 初始化图表
			initChart() {
				this.chartInstane = this.$echarts.init(this.$refs.trendRef)
				// const initOption = {}
				// this.chartInstane.setOption(initOption)
				//在此处可以监听鼠标移入移出事件
				this.chartInstane.on('mouseover', () => {
					//鼠标移入图表进行的操作，如暂停计时器，定时器可以看第10条
				})
				this.chartInstane.on('mouseout', () => {
					//鼠标移出进行的操作，如开始计时器
				})
			},
			// 发请求获取数据
			async getData() {
				const {
					data: res
				} = await this.$http.get('data/findavg')
				console.log('收入比例', res)
				this.allData = res
				// 对allData进行赋值
				this.updateChart()
			},
			updateChart() {
				// 先处理数据
				const seriesData = this.allData.map(item => {
					return {
						name: item.X,
						value: item.y
					}
				})
				const dataOption = {
					title: {
						show: true,
						text: '平均利润比例',
						left: '42%',
						textAlign: 'top'
					},
					legend: {
						bottom: '1%',
						left: 'center',
						textStyle: {
							color: '#000000'
						}
					},

					series: [{
						type: 'pie',
						radius: ['40%', '70%'],
						// avoidLabelOverlap: false,
						itemStyle: {
							borderRadius: 4,
							borderColor: '#fff',
							borderWidth: 2
						},
						label: {
							normal: {
								show: true,
								formatter: '{d}%',
								textStyle: {
									color: "#000000",
									fontSize: 18
								}
							}
						},
						data: seriesData
					}]
				}
				this.chartInstane.setOption(dataOption)
			},
			//分辨率适配
			screenAdapter() {
				//通过this.$refs.map_ref.offsetWidth可以监听浏览器窗口宽度变化，然后再根据变化进行赋值
				const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
				const adapterOption = {}
				this.chartInstane.setOption(adapterOption)
				this.chartInstane.resize() //调用该方法实现适配
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
