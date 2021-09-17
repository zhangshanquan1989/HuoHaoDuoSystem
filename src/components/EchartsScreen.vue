<template>
	<div class="box">
		<div class="header">
			<div class="header_text">数据可视化</div>
			<div class="showTime">{{nowTime}}</div>
		</div>
		<div class="mainbox">
			<div class="column">
				<div class="panel"></div>
			</div>
			<div class="column">2</div>
			<div class="column">3</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				nowTime: '',
				timerId: null,
			}
		},
		created() {
			this.getNowTime()
		},
		destroyed() {
			clearInterval(this.timerId) //组件销毁的时候销毁定时器
		},
		methods: {
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
					this.nowTime ="当前时间：" + y +	"年" +	mt +	"月" +	day+	"日" +	" " +	h +	"时" +	m +	"分" +	s +	"秒";
				}, 1000)
			},
		}
	}
</script>

<style lang="less" scoped>
	.box {
		background: url(../assets/echartsScreen/bgNew.jpg) no-repeat top center;
		width: 100%;
		height: 100%;
		line-height: 1.15;
	}

	.header {
		position: relative;
		height: 1rem;
		.header_text {
			font-size: 0.475rem;
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
		.column {
		  flex: 3;
			&:nth-child(2){
				flex: 5;
		}
		
		}
	}
</style>
