<template>
	<!-- 当月日均 -->
	<!-- 该class内样式为宽高100% -->
	<div class="com-container">
		<div class="com-chart" ref="trendRef"></div>
	</div>
</template>

<script>
	import chalk from '../../assets/echartsTheme/chalk.js'
	let chartInstane = null
	export default {
		data() {
			return {
				// chartInstane: null,
				allData: null, // 从服务器获取的所有数据
				startValue:9, //区域缩放起点值
				endValue:5, //区域缩放终点值
			}
		},
		mounted() {
			this.initChart()
			this.getData()
			// window.addEventListener('resize',this.screenAdapter) //监听分辨率变化
			// this.screenAdapter() //第一次主动触发分辨率计算
		},
		beforeDestroy () {		
		  chartInstane.clear()		
		  },
		destroyed() {
			window.removeEventListener('resize', this.screenAdapter) //取消监听
		},
		methods: {
			// 初始化图表
			initChart() {
				chartInstane = this.$echarts.init(this.$refs.trendRef,'chalk')

				// chartInstane.setOption(initOption)
				//在此处可以监听鼠标移入移出事件
				chartInstane.on('mouseover', () => {
					//鼠标移入图表进行的操作，如暂停计时器，定时器可以看第10条
				})
				chartInstane.on('mouseout', () => {
					//鼠标移出进行的操作，如开始计时器
				})
			},
			// 发请求获取数据
			async getData() {
				const {
					data: res
				} = await this.$http.get('data/findmileage')
				console.log('里程排行', res)
				// 对allData进行赋值
				this.allData = res
				this.updateChart()
				this.startInterval() //启动定时器
			},
			updateChart() {
				// 先处理数据
				const distanceNames = this.allData.map((item) => {
					return item.Y
				})
				const distanceValues = this.allData.map((item) => {
					return item.X
				})
				const dataOption = {
					grid:{
						top:'1%',
						left:'1%',
						right:'5%',
						bottom:'1%',
						containLabel:true
					},
					xAxis: {
						type: 'value',
						axisLabel:{
							color:'#FFF'
						}
					},
					yAxis: {
						type: 'category',
						data: distanceNames,
						axisLabel:{
							color:'#FFF'
						}
					},
					// 区域缩放
					dataZoom:{
						show:false,
						startValue:this.startValue,
						endValue:this.endValue,
						yAxisIndex: [0],
					},
					series: [{
						data: distanceValues,
						type: 'bar',
						// showBackground: true,
						// barWidth: 66,
						label:{
							show:true,
							position:'right',
							textStyle:{
								color:'white'
							}
						},
						itemStyle:{
							barBorderRadius:[0,33,33,0],
							color:new this.$echarts.graphic.LinearGradient(0,0,1,0,[
								{
									offset:0,
									color:'#00f9f9'
								},
								{
									offset:1,
									color:'#0067cf'
								}
							])
						},
					}]
				}
				chartInstane.setOption(dataOption)
				window.addEventListener("resize", () => {
					chartInstane.resize();
				});
			},
			//分辨率适配 
			screenAdapter() {
				//通过this.$refs.map_ref.offsetWidth可以监听浏览器窗口宽度变化，然后再根据变化进行赋值
				const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
				const adapterOption = {}
				chartInstane.setOption(adapterOption)
				chartInstane.resize() //调用该方法实现适配
			},
			startInterval(){
				setInterval(()=>{
					this.startValue--
					this.endValue--
					if(this.endValue < 0){
						this.startValue = 9
						this.endValue = 5
					}
					this.updateChart()
				},4000)
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
