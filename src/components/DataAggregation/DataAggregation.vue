<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据汇总</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card" v-loading.fullscreen.lock="fullscreenLoading">
			<el-date-picker v-model="exportDate" type="daterange" range-separator="至" start-placeholder="导出的开始日期"
			 end-placeholder="导出的结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
			</el-date-picker>
			<el-input v-model="queryInfo.chepai" placeholder="车牌号查询" clearable style="width: 200px;margin-left: 30px;"></el-input>
			<el-input v-model="queryInfo.peiguan" placeholder="配管查询" clearable style="width: 200px;margin-left: 30px;"></el-input>
			<el-button type="primary" plain icon="el-icon-search" style="margin-left: 30px;" @click="search">搜索</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			
			<el-button type="primary" plain @click="allExportBtn" style="margin-left: 100px;">全部导出</el-button>

			<el-table :data="dataList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="licenseplate" label="车牌号" width="110px">
				</el-table-column>
				<el-table-column prop="driver" label="司机名" width="90px">
				</el-table-column>
				<el-table-column prop="companyl" label="公司名" width="250px">
				</el-table-column>
				<el-table-column prop="fuzepeiguan" label="负责配管" width="90px">
				</el-table-column>
				<el-table-column prop="people" label="当日负责配管" width="120px">
				</el-table-column>
				<el-table-column prop="creatime" label="创建时间" width="180px">
				</el-table-column>
				<el-table-column prop="creater" label="创建者" width="90px">
				</el-table-column>
				<el-table-column prop="attendance" label="车辆状态" width="100px">
				</el-table-column>
				<el-table-column prop="staute" label="状态详情" width="100px">
				</el-table-column>
				<el-table-column prop="waybilltype" label="派单类型" width="100px">
				</el-table-column>
				<el-table-column prop="staute" label="货物名称" width="100px">
				</el-table-column>
				<el-table-column prop="goodsweight" label="货物重量" width="100px">
				</el-table-column>
				<el-table-column prop="emptydistance" label="放空距离" width="100px">
				</el-table-column>
				<el-table-column prop="highspeed" label="高速预估距离" width="130px">
				</el-table-column>
				<el-table-column prop="estimatedistance" label="下道预估距离" width="130px">
				</el-table-column>
				<el-table-column prop="km" label="全程公里数" width="130px">
				</el-table-column>
				<el-table-column prop="deposit" label="定金" width="100px">
				</el-table-column>
				<el-table-column prop="car" label="到车" width="100px">
				</el-table-column>
				<el-table-column prop="pay" label="到付" width="100px">
				</el-table-column>
				<el-table-column prop="cost" label="费用" width="100px">
				</el-table-column>
				<el-table-column prop="nearcost" label="利润" width="100px">
				</el-table-column>
				<el-table-column prop="profits" label="调整后利润" width="130px">
				</el-table-column>
			</el-table>

		</el-card>

		<!-- 分页区域 -->
		<el-col>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
			 :page-sizes="[10, 20, 50, 100]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" style="margin-top: 5px;">
			</el-pagination>
		</el-col>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 导出的时间
				exportDate: [],
				// 查询参数对象
				queryInfo: {
					chepai: '',
					peiguan: '',
					startime: '',
					endtime: '',
					pageNo: 1,
					pageSize: 10,
				},
				total: 0,
				// 遮罩层
				fullscreenLoading:false,
				dataList: [],
				// 导出所需数据
				// allExportInfo: {
				// 	chepai: '',
				// 	peiguan: '',
				// 	startime: '',
				// 	endtime: '',
				// },
			}
		},
		created() {
			// this.getDataList()
		},
		methods: {
			// 根据分页查询列表
			async getDataList() {
				const {
					data: res
				} = await this.$http.get('statistics/findstatistics', {
					params: this.queryInfo
				})
				// console.log(res)
				// if (res.code !== 200) {
				// 	return this.$message.error(res.message)
				// }
				// // this.$message.success('获取信息成功')
				this.dataList = res.rows
				this.total = res.total
				// // console.log(this.driverList)
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getDataList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getDataList()
			},

			// 点击查询按钮
			async search() {
				console.log(this.exportDate)
				if(!this.exportDate[0] ){
					return this.$message.warning('请选择导出时间！')
				}
				this.queryInfo.startime = this.exportDate[0]
				this.queryInfo.endtime = this.exportDate[1]
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				// console.log(this.queryInfo)
				this.getDataList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.chepai = ''
				this.queryInfo.peiguan = ''
				this.queryInfo.startime = ''
				this.queryInfo.endtime = ''
				this.exportDate = ''
				this.getDataList()
			},
			
			async allExportBtn() {
				if (!this.exportDate[0]) {
					return this.$message.warning('请选择时间段！')
				}
				this.queryInfo.startime = this.exportDate[0]
				this.queryInfo.endtime = this.exportDate[1]
				this.fullscreenLoading = true;
				let url = this.$baseUploadUrl +'/SumController/pageQuery?startime=' + this.queryInfo.startime + '&endtime=' + this.queryInfo.endtime + '&chepai=' + this.queryInfo.chepai + '&peiguan=' + this.queryInfo.peiguan
					var xhr = new XMLHttpRequest(); //定义http请求对象
					xhr.open("get", url, true);
					xhr.responseType = "blob"; // 转换流
					xhr.setRequestHeader("satoken", window.sessionStorage.getItem('satoken'));
					let that = this
					xhr.onload = function() {
						
						// console.log(this)
						var blob = this.response;
						var a = document.createElement("a")
						var url = window.URL.createObjectURL(blob)
						a.href = url
						a.download = "数据汇总.xlsx" // 文件名
						a.click()
						window.URL.revokeObjectURL(url)
						a.remove()
						that.fullscreenLoading = false;
					}
				xhr.send();

			},

		}
	}
</script>

<style scoped>

</style>
