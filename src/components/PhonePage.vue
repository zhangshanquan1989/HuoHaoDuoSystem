<template>
	<div style="width: 23.4375rem;background-color: ;">
		<el-container>
			<el-header class="header">
				<div>订单详情</div>
			</el-header>
			<el-main>
				<el-card class="box-card">
					<!-- <el-form  ref="form" :model="phoneInfo">
						<el-form-item>
							<div style="font-size: 3.75rem;">装驾驶员：{{phoneInfo.liensess.driver}}</div>
						</el-form-item>
						<el-form-item>
							<div style="font-size: 3.75rem;">发车时间：{{phoneInfo.apoints[0].stime}}</div>
						</el-form-item>
						<el-form-item class="form1">
							<div style="font-size: 3.75rem;">提醒您：长途主意安全，雨季切记封好篷布，有问题找我不可与现场发生矛盾冲突，注意货物三不超！行车过程中注意安全，谨慎驾驶！杜绝疲劳驾驶！</div>
						</el-form-item>
					</el-form>
 -->

					<div>装驾驶员：{{phoneInfo.apoints[0].driver}}</div>
					<div>发车时间：{{phoneInfo.apoints[0].stime}}</div>
					<div>装货地址：{{phoneInfo.apoints[0].scity}}{{phoneInfo.apoints[0].sarea}}{{phoneInfo.apoints[0].saddress}}</div>
					<div>联系电话：{{phoneInfo.apoints[0].spointphone}}</div>
					<div>卸货地址：{{phoneInfo.upoints[0].dprovince}}{{phoneInfo.upoints[0].dcity}}{{phoneInfo.upoints[0].darea}}</div>
					<div>吨 位：{{phoneInfo.goodsweight}}吨（三不超）</div>
					<div>货 物：{{phoneInfo.goodsname}}</div>
					<div>运输距离：高速{{phoneInfo.highspeed}}下道{{phoneInfo.estimatedistance}}</div>
					<div>放空距离：{{phoneInfo.emptydistance}}</div>
					<div>建议运输方式：一半高速一半下道</div>
					<div>建议到达装货地时间：电话联系装货</div>
					<div>到车运费：{{phoneInfo.car}}</div>
					<div>定金：{{phoneInfo.deposit}}</div>
					<div>付款方式及金额：到付{{phoneInfo.pay}}</div>
					<div>装卸货是否禁行：{{phoneInfo.ban}}</div>
					<div>卸车时间：{{phoneInfo.upoints[0].dtime}}</div>
					<div>卸货方式：叉车</div>
					<div style="height: 18.75rem;border-bottom: 0;">提醒您：长途主意安全，雨季切记封好篷布，有问题找我不可与现场发生矛盾冲突，注意货物三不超！行车过程中注意安全，谨慎驾驶！杜绝疲劳驾驶！</div>
				</el-card>
			</el-main>
		</el-container>



	</div>
</template>

<script>
	import wx from 'weixin-js-sdk';
	export default {
		data() {
			return {
				// lienses: '',
				// driver: '',
				phoneInfo: {
					goodsweight: '',
					goodsname: '',
					emptydistance: '',
					car: '',
					highspeed: '',
					estimatedistance: '',
					deposit: '',
					pay: '',
					ban: '',

					liensess: {
						driver: ''
					},
					apoints: [{
						stime: '',
						scity: '',
						sarea: '',
						saddress: '',
						spointphone: '',
					}],
					upoints: [{
						dprovince: '',
						dcity: '',
						darea: '',
						dtime: '',
					}]
				},
			}
		},
		created() {
			console.log('local',window.location.href)
			// 获取code
			
			
			// console.log("url--info", this.$route.path);
			// // 订单号加密
			// let encodeData = window.btoa("0000045")
			// console.log('encodeData' + encodeData)
			// // 订单号解密
			// let decodeData = window.atob(encodeData)
			// console.log('decodeData' + decodeData)
			this.getUserInfo()
			this.getInfo()
			this.handleConfig()
			
		},
		methods: {
			handleConfig(){
				wx.config({
				  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				  appId: 'wx46f6d9e34185a909', // 必填，公众号的唯一标识
				  timestamp: "1625561094", // 必填，生成签名的时间戳
				  nonceStr: '0c15a378-4ed5-48f8-8586-393334e8c40d', // 必填，生成签名的随机串
				  signature: 'f1fbe176c5ee9d310df552dfb47306167164a78e',// 必填，签名
				  jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
				});
				wx.ready(function(){
				  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
					console.log('config成功')
				});
				wx.error(function(res){
				  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
					console.log('config失败')
				});
			},
			
			async getUserInfo(){
				var url = window.location.href
				console.log(url);
				var code = url.split("?")[1].split("&")[0].split("=")[1]
				console.log(code)
				const {data:res} = await this.$http.get('wxt/userInfo?code='+code)
				console.log('res',res)
				
			},
			async getInfo() {
				let noList = this.$route.path.split("/")
				// console.log(noList)
				let no = noList[noList.length - 1]
				// console.log('no',no)
				// console.log(this.$route.params)
				// let id = this.$route.params.id;
				// console.log('id'+id)				
				const {
					data: res
				} = await this.$http.get('waybill/lianjie?plistNo=' + no)
				console.log(res)
				this.phoneInfo = res.result
				
				// this.lienses = res.result.lienses
				// const {
				// 	data: res1
				// } = await this.$http.get('waybill/findDriverByLicense?license=' + this.lienses)
				// console.log(res1)
				// this.driver = res1.result.driver
			},


		}
	}
</script>

<style lang="less" scoped>
	.header {
		width: 100%;
		height: 5rem !important;
		background-color: #0f4f7d;
		font-size: 1.5rem;
		text-align: center;

		div {
			margin-top: 1.875rem;
		}

		color: #FFFFFF;
	}

	.box-card {
		width: 100%;
		height: 100%;
		font-size: 0.9375rem;

		div {
			width: 90%;
			height: 1.25rem;
			margin-left: 1.25rem;
			margin-top: 1.25rem;
			border-bottom: 0.0625rem solid;
		}
	}
</style>
