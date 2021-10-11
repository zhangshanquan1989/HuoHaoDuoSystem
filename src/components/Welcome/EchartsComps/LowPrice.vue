<template>
	<!-- 该class内样式为宽高100% 需要设置两个div的宽高-->
	<div class="com-container">
		<div class="com-chart" ref="trendRef">
		</div>
	</div>
</template>

<script>
	import walden from '../../../assets/echartsTheme/walden.js'
	export default {
		data() {
			return {
				chartInstane: null,
				allData: null, // 从服务器获取的所有数据
				// 起止时间
				queryInfo: {
					plistCtime1: '', // 开始时间  例如：2020-09-16 14:25:23  
					plistCtime2: '' // 结束时间  例如：2020-10-16 14:25:23  
				},
				// 当日动销车辆折线图
				lowPriceData: [],
				xDataLowPrice: [],
				yDataLowPrice: [],
			}
		},
		mounted() {
			this.initTime()
			this.initChart()
			this.getData()
			// window.addEventListener('resize',this.screenAdapter) //监听分辨率变化
			// this.screenAdapter() //第一次主动触发分辨率计算
		},
		destroyed() {
			window.removeEventListener('resize', this.screenAdapter) //取消监听
		},
		methods: {
			// 获取时间
			// 初始化时间
			initTime() {
				const plistCtime2 = this.getFormatDate(new Date(new Date() - 3600 * 1000 * 24)).substr(0, 11) + '23:59:59'
				const plistCtime1 = this.getFormatDate(new Date(new Date() - 3600 * 1000 * 24 * 29)).substr(0, 11) + '00:00:00'
				this.queryInfo = {
					'plistCtime1': plistCtime1,
					'plistCtime2': plistCtime2
				}
			},
			// 获取当前时间
			getFormatDate(date) {
				var month = date.getMonth() + 1
				var strDate = date.getDate()
				if (month >= 1 && month <= 9) {
					month = '0' + month
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = '0' + strDate
				}
				var currentDate = date.getFullYear() + '-' + month + '-' + strDate + ' ' + date.getHours() + ':' + date.getMinutes() +
					':' + date.getSeconds()
				return currentDate
			},

			// 初始化图表
			initChart() {
				this.chartInstane = this.$echarts.init(this.$refs.trendRef, 'walden')
				const initOption = {
					xAxis: {
						name: '时间',
						nameTextStyle: {
							fontWeight: 600,
							fontSize: 16,
							color:'black',
						},
						type: 'category',
						data: this.xDataLowPrice
					},
					yAxis: {
						name: '当日低价运单数',
						nameTextStyle: {
							fontWeight: 600,
							fontSize: 16,
							align: 'center',
							lineHeight: 56,
							color:'black',
						},
						type: 'value'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					series: [{
						name: '数量',
						type: 'line',
						smooth: true,
						data: this.yDataLowPrice,
						// color: '#E6AE5C',
						lineStyle: {
								  width: 3,
								},
						emphasis: {
							lineStyle: {
								width: 2,
							},
						}
					}, ],
				}
				this.chartInstane.setOption(initOption)
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
				} = await this.$http.get('data/findlowerpiceNumber', {
					params: this.queryInfo
				})
				console.log('低价', res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.lowPriceData = res.result
				this.lowPriceData.forEach(v => {
					this.xDataLowPrice.push(v.总日期)
					this.yDataLowPrice.push(v.每天低价运单数量)
				})
				// 对allData进行赋值
				this.updateChart()
			},
			updateChart() {
				// 先处理数据
				const dataOption = {
					xAxis: {
						name: '时间',
						nameTextStyle: {
							fontWeight: 600,
							fontSize: 16,
							color:'black',
						},
						type: 'category',
						data: this.xDataLowPrice
					},
					yAxis: {
						name: '当日低价运单数',
						nameTextStyle: {
							fontWeight: 600,
							fontSize: 16,
							align: 'center',
							lineHeight: 56,
							color:'black',
						},
						type: 'value'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					series: [{
						name: '数量',
						type: 'line',
						smooth: true,
						data: this.yDataLowPrice,
						// color: '#E6AE5C',
						emphasis: {
							lineStyle: {
								width: 2,
							},
						}
					}, ],
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
