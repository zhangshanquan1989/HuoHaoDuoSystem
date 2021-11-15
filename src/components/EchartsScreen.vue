<template>
	<div class="page">
	<div class="box">
		<div class="header">
			<div class="header_text">天 康 智 能 运 力 实 时 监 控 系 统</div>
			<div class="showTime">{{nowTime}}</div>
		</div>
		<div class="mainbox">
			<!-- 左3份 -->
			<div class="column">
				<div class="panel bar1">
					<div class="h2Text">近 30 天 收 入 比 例</div>
					<div class="chart" style="height: 3rem;">
						<IncomePie></IncomePie>
					</div>
					<div class="panel-footer"></div>
				</div>
				<div class="panel line1">
				  <div class="h2Text">近 30 天 里 程 排 行</div>
				  <div class="chart" style="height: 3rem;">
				  	<MonthDistance></MonthDistance>
				  </div>
				  <div class="panel-footer"></div>
				</div>
				<div class="panel pie1">
				  <div class="h2Text">近 30 天 日 均 收 入 排 行</div>
				  <div class="chart" style="height: 3rem;">
				  	<IncomeRanking></IncomeRanking>
				  </div>
				  <div class="panel-footer"></div>
				</div>
				<!-- <div class="panel bar" style="height: 7.75rem;">
					<div class="h2Text">当 月 里 程 排 行</div>
					<div class="chart" style="height: 7.025rem;">
						<monthDistance></monthDistance>
					</div>
					<div class="panel-footer"></div>
				</div>
				<div class="panel bar" style="height: 3.818rem;">
					<div class="h2Text">当 月 日 均 收 入 排 行</div>
					<div class="chart" style="height: 3.093rem;">
						<incomeRanking></incomeRanking>
					</div>
					<div class="panel-footer"></div>
				</div> -->
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
					<div class="chart" ref="mapRef">
						<div style="height: 100%;width: 100%;">
							<CenterMapTwo></CenterMapTwo>
						</div>
						
					</div>
				</div>
			</div>
			<!-- 右3份 -->
			<div class="column">
				<div class="panel bar" style="height: 3.818rem;">
					<div class="chart" style="height: 100%;width: 100%;">
						<Video></Video>
					</div>
					<div class="panel-footer"></div>
				</div>
				<div class="panel bar" style="height: 7.75rem;">
					<div class="h2Text" >货 好 多 分 公 司 展 示</div>
					<div class="chart" style="height: 7.025rem;">
						<rolling></rolling>
					</div>
					<div class="panel-footer"></div>
				</div>
				
			</div>
		</div>
	</div>
	</div>
</template>

<script>
	import china from '../assets/echartsScreen/china.js'
	import MonthDistance from './EchartsComp/MonthDistance.vue'
	import IncomePie from './EchartsComp/IncomePie.vue'
	import IncomeRanking from './EchartsComp/IncomeRanking.vue'
	import Rolling from './EchartsComp/Rolling.vue'
	import Video from './EchartsComp/Video.vue'
	import CenterMap from './EchartsComp/CenterMap.vue'
	import CenterMapTwo from './EchartsComp/CenterMapTwo.vue'
	export default {
		components: {
		  MonthDistance,
		  IncomePie,
		  IncomeRanking,
		  Rolling,
		  Video,
		  CenterMap,
		  CenterMapTwo,
		},
		data() {
			return {
				nowTime: '',
				timerId: null,
				distanceTiId: null,
				carNumId: null,
				carTotalNum:null,
				distanceTotalNum:null,
			}
		},
		mounted(){
			
		    },
		created() {
			this.getDTNum()
			this.getCarTNum()
			this.getNowTime()
			this.getCarTotalNum()
			this.getDistanceTotalNum()
		},
		beforeDestroy () {
		  
		  },
		destroyed() {
			clearInterval(this.timerId) //组件销毁的时候销毁定时器
			clearInterval(this.distanceTiId) //组件销毁的时候销毁定时器
			clearInterval(this.carNumId) //组件销毁的时候销毁定时器
		},
		methods: {
			// 获取车辆总数
			async getCarTNum(){
				const {
					data: res
				} = await this.$http.get('data/findCarNumber')
				// console.log('车总数',res)
				this.carTotalNum = res[0].value
			},
			// 定时获取车辆总数
			getCarTotalNum(){
				if (this.carNumId) {
					clearInterval(this.carNumId)
				} // 保险操作，先判断是否存在定时器，存在的话关闭
				this.carNumId = setInterval( () => {
					this.getCarTNum()
				},3600000)
				
			},
			// 获取总公里数
			async getDTNum(){
				const {
					data: res
				} = await this.$http.get('data/findNumber')
				// console.log('里程总数',res)
				this.distanceTotalNum = res[0].value
			},
			// 定时获取总公里数
			 getDistanceTotalNum(){
				if (this.distanceTiId) {
					clearInterval(this.distanceTiId)
				} // 保险操作，先判断是否存在定时器，存在的话关闭
				this.distanceTiId = setInterval( () => {
					this.getDTNum()
				},60000)
				
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
			}
	}
</script>

<style lang="less" scoped>
	.page{
		margin: 0;
		padding: 0;
		background: url(../assets/echartsScreen/bgNew.jpg) no-repeat top center;
		height: 100%;
		width: 100%;
	}
	.box {
		margin: 0;
		padding: 0;
		// height: 100%;
		background: url(../assets/echartsScreen/bgNew.jpg) no-repeat top center;
		// background: url(../assets/echartsScreen/bgNew.jpg) no-repeat #000;
		background-size: 100% 100%;
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
			font-size: 0.62rem;
			font-family: electronicFont; //使用引入字体
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			line-height: 1rem;
		}

		.showTime {
			position: absolute;
			top: 0;
			right: 0.375rem;
			line-height: 0.75rem;
			color: rgba(255, 255, 255,0.8);
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
		height: 3.72rem;
		border: 1px solid rgba(25, 186, 139, 0.17);
		background: rgba(255, 255, 255, 0.04) url(../assets/echartsScreen/line.png);
		padding: 0 0.1875rem 0.1875rem;
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

		.h2Text {
			height: 0.6rem;
			line-height: 0.6rem;
			text-align: center;
			color: #fff;
			font-size: 0.3125rem;
			font-weight: 400;
			margin: 0.0625rem 0 ;
			// a {
			// 	margin: 0 0.1875rem;
			// 	color: #fff;
			// 	text-decoration: underline;
			// }
		}

		.chart {
			height: 2.8rem;
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
			top: -0.1875rem;
			left: -0.5rem;
			z-index: 5;
			height:10.375rem;
			width: 110%;
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
