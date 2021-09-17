<template>
	<div>
<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>司机预警</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片视图区 -->
		<el-card class="box-card">	
		  <el-input v-model="queryInfo.dirver" placeholder="司机名" clearable style="width: 200px;"></el-input>
			<el-input v-model="queryInfo.chepai" placeholder="车牌号" clearable style="width: 200px;margin-left: 30px;"></el-input>
			<el-input v-model="queryInfo.peiguan" placeholder="配管" clearable style="width: 200px;margin-left: 30px;"></el-input>
			<el-input v-model="queryInfo.startnumber" placeholder="开始利润" clearable style="width: 150px;margin-left: 40px;" sortable="custom"></el-input>
			<span style="margin-left: 5px;margin-right: 5px;">-</span>
			<el-input v-model="queryInfo.endnumber" placeholder="结束利润" clearable style="width: 150px;"></el-input>
		  <el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
		  <el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			<div style="margin-top: 20px;">
						<el-button type="primary" icon="el-icon-download" plain @click="handleExport" >导出选中</el-button>
						<el-button type="primary" plain @click="handleClearBtn" style="margin-left: 30px;">清空选中</el-button>
			</div>
			
			<el-table :data="driverList" ref="table" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @sort-change="sortChange" @selection-change="handleSelectionChange"
			 :row-key="getLicense">
			 <el-table-column type="selection" width="55" :reserve-selection="true">
			 </el-table-column>
				<el-table-column prop="司机名" label="司机名" >
				</el-table-column>
				<el-table-column prop="车牌号" label="车牌号" >
				</el-table-column>
				<el-table-column prop="调度" label="配管" >
				</el-table-column>
				<el-table-column prop="平均利润" label="平均利润" sortable="custom">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.平均利润-0 >= 650?'black':'red'}">{{scope.row.平均利润}}</span>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 分页区域 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
		 :page-sizes="[10, 50, 100, 200]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total" style="margin-top: 5px;">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				sijiyujing:[],
				// 查询参数对象
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					dirver:'',
					chepai:'',
					peiguan:'',
					startnumber:'',
					endnumber:'',
					asc:'',
					desc:'',
				},
				driverList: [],
				total: 0,
			}
		},
		created() {
			this.getList()
		},
		methods:{
			// 多选框保持选中
			getLicense(row) {
				return row.车牌号
			},
			// 清空选中
			handleClearBtn() {
				this.$refs.table.clearSelection()
			},
			// 多选框变化
			handleSelectionChange(e) {
				// console.log(e)
				this.sijiyujing = []
				e.forEach(v => {
					this.sijiyujing.push(v.车牌号)
				})
			},
			// 导出
			async handleExport() {
				if (!this.sijiyujing[0]) {
					return this.$message.warning('请选择需要导出的数据！')
				}
				const {
					data: res
				} = await this.$http({
					url: 'SumController/sjiyujing',
					method: "post",
					data: {
						sijiyujing: this.sijiyujing
					},
					responseType: 'blob',
				})
				// console.log(res)
				var blob = res
				console.log('blob',blob)
				const fileName = '司机预警报表.xlsx'
				var a = document.createElement("a");
				a.href = window.URL.createObjectURL(blob);
				console.log(a.href)
				a.download = fileName
				a.click()
				a.remove()
			},
			
			sortChange(e){
				// console.log(e)
				// this.queryInfo.column = e.prop
				if(e.order == "descending"){
					this.queryInfo.desc = "desc"
					this.queryInfo.asc = ""
				}else if(e.order == "ascending"){
					this.queryInfo.asc = "asc"
					this.queryInfo.desc = ""
				}
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getList();
			},
			// 根据分页查询列表
			async getList() {
				const {
					data: res
				} = await this.$http.get('driveryj/list', {
					params: this.queryInfo
				})

				this.driverList = res.rows
				this.total = res.total
			},
			
			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getList()
			},
			
			// 页码值改变事件
			handleCurrentChange(pageNo) {
				this.queryInfo.pageNo = pageNo
				this.getList()
			},
						
			// 点击查询按钮
			handleQueryBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.dirver = ''
				this.queryInfo.chepai = ''
				this.queryInfo.peiguan = ''
				this.queryInfo.startnumber = ''
				this.queryInfo.endnumber = ''
				this.queryInfo.asc = ""
				this.queryInfo.desc = ""
				this.$refs.table.clearSort()
				this.getList()
			},
		}
	}
</script>

<style scoped>

</style>