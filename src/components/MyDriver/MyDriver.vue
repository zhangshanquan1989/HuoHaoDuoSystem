<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>我的司机</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片视图区 -->
		<el-card class="box-card" v-loading.fullscreen.lock="fullscreenLoading">
			<!-- 创建司机  weichuqinDay--> 
			<div>
				<el-input v-model="queryInfo.dirver" placeholder="司机名" clearable style="width: 200px;"></el-input>
				<el-input v-model="queryInfo.chepai" placeholder="车牌号" clearable style="width: 200px;margin-left: 30px;"></el-input>
				<el-input v-model="queryInfo.peiguan" placeholder="配管" clearable style="width: 200px;margin-left: 30px;"></el-input>
				<el-input v-model="queryInfo.company" placeholder="分公司名" clearable style="width: 200px;margin-left: 30px;"></el-input>
				
				<el-input v-model="queryInfo.atten" placeholder="车辆考勤" clearable style="width: 200px;margin-left: 30px;"></el-input>
				<el-input v-model="queryInfo.staute" placeholder="考勤详情" clearable style="width: 200px;margin-left: 30px;"></el-input>
				<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
					
			</div>
			<div style="margin-top: 8px;">
				<el-input v-model="queryInfo.shen" placeholder="卸货地省" clearable style="width: 200px;"></el-input>
				<el-input v-model="queryInfo.shi" placeholder="卸货地市" clearable style="width: 200px;margin-left: 30px;"></el-input>
				<el-input v-model="queryInfo.qu" placeholder="卸货地区" clearable style="width: 200px;margin-left: 30px;"></el-input>
				<el-input v-model="queryInfo.add" placeholder="卸货地详细地址" clearable style="width: 200px;margin-left: 30px;"></el-input>
				<el-input v-model="queryInfo.grade" placeholder="卸货地等级" clearable style="width: 200px;margin-left: 30px;"></el-input>
				<el-select v-model="queryInfo.state" placeholder="订单状态" style="margin-left: 30px;width: 200px;">
					<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			</div>			
			<div style="margin-top: 8px;">
			<el-button type="primary" plain @click="allExportBtn">导出全部</el-button>
			</div>
			
			<el-table :data="driverList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="driver" label="司机姓名" width="120px">
				</el-table-column>
				<el-table-column prop="lp" label="车牌号" width="140px">
				</el-table-column>
				<el-table-column prop="weichuqinDay" label="订单未更新天数" width="140px">
				</el-table-column>
				<el-table-column prop="companyl" label="分公司" width="250px">
				</el-table-column>
				<el-table-column prop="attendance" label="车辆考勤" width="100px">
				</el-table-column>
				<el-table-column prop="staute" label="考勤详情" width="100px">
				</el-table-column>
				<el-table-column prop="stateText" label="订单状态" width="100px">
				</el-table-column>
				<el-table-column prop="dateapiont" label="预计发车时间" width="200px">
				</el-table-column>
				<el-table-column prop="dtime" label="预计可卸车时间" width="200px">
				</el-table-column>
				<el-table-column prop="dprovince" label="省" width="100px">
					</el-table-column>
				<el-table-column prop="dcity" label="市" width="100px">
				</el-table-column>
				<el-table-column prop="darea" label="区" width="100px">
				</el-table-column>
				<el-table-column prop="dgrade" label="市场等级" width="100px">
				</el-table-column>
				<el-table-column prop="daddress	" label="详细地址" width="200px">
				</el-table-column>
				<el-table-column prop="diaodu" label="配送管理人员" width="120px">
				</el-table-column>
				<!-- <el-table-column label="操作" width="200px" fixed="right">
					<template slot-scope="scope">
						<el-button v-if="showBtn" type="primary" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
						<el-button v-else type="primary" size="mini" @click="showEditDialog(scope.row.id)">查看详情</el-button>
						<el-popconfirm v-if="showBtn" title="确定删除吗？" @confirm="removeById(scope.row.id)" style="margin-left: 10px;">
							<el-button  type="danger" size="mini" slot="reference">删除</el-button>
						</el-popconfirm>
					</template>
				</el-table-column> -->
			</el-table>
		</el-card>
		
		<!-- 分页区域 -->
		<el-col>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 5px;">
			</el-pagination>
		</el-col>
		
	</div>
</template>

<script>
	export default {
		data(){
			return{
				// 遮罩层
				fullscreenLoading:false,
				// 分页查询数据
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					dirver:'',
					chepai:'',
					peiguan:'',
					company:'',
					atten:'',
					staute:'',
					shen:'',
					shi:'',
					qu:'',
					add:'',
					grade:'',
					state:'',
				},
				driverList:[],
				total:0,
				stateOptions: [{
						value: '0',
						label: '已驳回'
					},
					{
						value: '1',
						label: '审核中'
					},
					{
						value: '2',
						label: '审核完成'
					}, {
						value: '3',
						label: '司机接单'
					}, {
						value: '4',
						label: '司机拒单'
					},
					{
						value: '5',
						label: '待完结'
					},
					{
						value: '6',
						label: '订单取消'
					}
				],
			}
		},
		created() {
			this.getDriverList()
		},
		methods:{
			// 根据分页查询列表
			async getDriverList() {
				const {
					data: res
				} = await this.$http.get('mydriver/list', {
					params: this.queryInfo
				})
				console.log('res',res)
				// this.$message.success('获取信息成功') 
				this.driverList = res.rows
				this.total = res.total
				this.driverList.forEach(v => {
					if (v.state == 0) {
						v.stateText = "已驳回"
					} else if (v.state == 1) {
						v.stateText = "审核中"
					} else if (v.state == 2) {
						v.stateText = "审核完成"
					} else if (v.state == 3) {
						v.stateText = "司机已接单"
					} else if (v.state == 4) {
						v.stateText = "司机已拒单"
					} else if (v.state == 5) {
						v.stateText = "待完结"
					} else if (v.state == 6) {
						v.stateText = "订单取消"
					}
					})
			},
			
			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getDriverList()
			},
			
			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getDriverList()
			},
			
			// 点击查询按钮 licensePlateNew
			handleQueryBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getDriverList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.dirver = ''
				this.queryInfo.chepai = ''
				this.queryInfo.peiguan = ''
				this.queryInfo.shen = ''
				this.queryInfo.shi = ''
				this.queryInfo.qu = ''
				this.queryInfo.atten = ''
				this.queryInfo.company = ''
				this.queryInfo.add = ''
				this.queryInfo.grade = ''
				this.queryInfo.staute = ''
				this.queryInfo.state = ''
				this.getDriverList()
			},
			async allExportBtn() {
				this.fullscreenLoading = true;
				let url = this.$baseUploadUrl+'/mydriveExcel/MydriveExcel?dirver=' + this.queryInfo.dirver + '&chepai=' + this.queryInfo.chepai + '&peiguan=' + this.queryInfo.peiguan + '&company=' + this.queryInfo.company + '&atten=' + this.queryInfo.atten + '&staute=' + this.queryInfo.staute + '&shen=' + this.queryInfo.shen + '&shi=' + this.queryInfo.shi + '&qu=' + this.queryInfo.qu + '&add=' + this.queryInfo.add + '&grade=' + this.queryInfo.grade + '&state=' + this.queryInfo.state
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
						a.download = "我的司机报表.xlsx" // 文件名
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