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
				pieTotal:0,
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
		beforeDestroy() {
			this.chartInstane.clear()
		},
		destroyed() {
			
			window.removeEventListener('resize', this.screenAdapter) //取消监听
		},
		methods: {
			// 初始化图表
			initChart() {
				if(this.chartInstane){
					this.chartInstane.clear()
				} 
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
				} = await this.$http.get('data/findincome')
				this.allData = res
				// 对allData进行赋值
				this.updateChart()
			},
			updateChart() {
				// 先处理数据
				this.pieTotal = 0
				this.allData.forEach(v=>{
					this.pieTotal = this.pieTotal + v.y 
				})
				const seriesData = this.allData.map(item => {
					return {
						name: item.X,
						value: item.y
					}
				})
				const dataOption = {
					legend: {
						bottom: '1%',
						left: 'center',
						textStyle:{
							color:'#fff'
						}
					},
					
					series: [{
						type: 'pie',
						radius: ['40%', '70%'],
						// avoidLabelOverlap: false,
						itemStyle: {
							borderRadius: 3,
							borderColor: '#fff',
							borderWidth: 1.5
						},
						label:{
							normal:{
								show: true,
								formatter:'{d}%',
								 textStyle:{
									 color:"#fff",
									 fontSize:18
								 }
							}
						},
						data: seriesData
					}]
				}
				this.chartInstane.setOption(dataOption)
				window.addEventListener("resize", () => {
					this.chartInstane.resize();
				});
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
