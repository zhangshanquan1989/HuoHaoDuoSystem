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
		  <el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
		  <el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			
			<el-table :data="driverList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="司机名" label="司机名" >
				</el-table-column>
				<el-table-column prop="车牌号" label="车牌号" >
				</el-table-column>
				<el-table-column prop="调度" label="配管" >
				</el-table-column>
				<el-table-column prop="平均利润" label="平均利润" >
					<template slot-scope="scope">
						<span :style="{'color':scope.row.平均利润-0 >= 650?'black':'red'}">{{scope.row.平均利润}}</span>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 分页区域 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
		 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total" style="margin-top: 5px;">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				// 查询参数对象
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					dirver:'',
					chepai:'',
					peiguan:'',
				},
				driverList: [],
				total: 0,
			}
		},
		created() {
			this.getList()
		},
		methods:{
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
				
				this.getList()
			},
		}
	}
</script>

<style scoped>

</style>