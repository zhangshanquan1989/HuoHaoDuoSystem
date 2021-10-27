<template>
	<div class="rollingMain">
		<vue-seamless-scroll :data="listData" class="seamless-warp">
			<div class="item">
				<div class="item-row" v-for="item in listData" style="display: flex;">
					<div class="item-row-title" v-text="item.address" style="flex: 1;"></div>
					<div class="item-row-date" style="flex: 4;" v-text="item.company"></div>
				</div>
			</div>
		</vue-seamless-scroll>
	</div>
</template>

<script>
	import vueSeamlessScroll from 'vue-seamless-scroll'
	export default {
		components: {
			vueSeamlessScroll
		},
		data() {
			return {
				listData: []
			}
		},
		computed: {
			optionSingleHeightTime() {
				return {
					singleHeight: 50,
					waitTime: 2500
				}
			}
		},
		created() {
			console.log('载入滚动')
			this.getData()
		},
		methods: {
			async getData() {
				const {
					data: res
				} = await this.$http.get('data/findfengongsi')
				// console.log('滚动', res)
				this.listData = res
			}
		}
	}
</script>

<style lang="less" scoped>
	.rollingMain{
		width: 100%;
		height: 100%;
	}
	.seamless-warp {
		height: 100%;
		overflow: hidden;
		color: #fff;
		line-height: 0.75rem;
		font-size: 18px;
		.item{
			.item-row{
				border: 0.0125rem solid #1370FB;
				.item-row-title{
					margin-left: 0.25rem;
					color: #f99b30;
					overflow: hidden;
				}
			}
		}
	}
</style>
