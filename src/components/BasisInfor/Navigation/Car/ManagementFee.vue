<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆管理费</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card">
			<el-button type="primary" plain @click="handleQueryNearBtn">显示快到期车辆</el-button>
			<el-input v-model="queryInfo.carName" placeholder="车牌号" clearable style="width: 200px;margin-left: 100px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>

			<el-table :data="pageList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="id" label="id" v-if="false">
				</el-table-column>
				<el-table-column prop="licensePlate" label="车牌号">
				</el-table-column>
				<el-table-column prop="managementcycle" label="缴费周期">
				</el-table-column>
				<el-table-column prop="paytime" label="缴费时间">
				</el-table-column>
				<el-table-column prop="asoftime" label="到期时间">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.owe == '是'?'red':'black'}">{{scope.row.asoftime}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="owe" label="是否快到期">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.owe == '是'?'red':'black'}">{{scope.row.owe}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="starttime" label="出车时间">
				</el-table-column>
				<el-table-column prop="carstate" label="车辆状态">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.carstate=='正常'?'#303133FF':'red'}">{{scope.row.carstate}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!-- 缴费按钮 -->
						<el-button style="margin-left: 10px;" type="primary" size="mini" @click="handlePayCostDialog(scope.row)">缴费</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 分页区域 -->
		<el-col>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
			 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" style="margin-top: 5px;">
			</el-pagination>
		</el-col>

		<!-- 缴费的对话框 -->
		<el-dialog title="缴费页面" :visible.sync="payCostDialogVisible" width="70%" @close="payCostDialogClosed">
			<!-- 缴费的表单 -->
			<el-form :model="payCostForm" ref="payCostFormRef" label-width="200px">
				<el-form-item label="车牌号:" prop="asoftime" class="rt-input">
					<el-input v-model="payCostForm.licensePlate" disabled style="width: 250px;"></el-input>
				</el-form-item>
				<el-form-item label="缴费时间:" prop="paytime">
					<el-date-picker v-model="selectPaytime" type="date" @change="paytimeChange" placeholder="请选择缴费日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd" style="width: 250px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="缴费周期:" prop="managementcycle">
					<el-select v-model="selectManagementcycle" clearable placeholder="请选择缴费周期" @change="managementcycleChange" style="width: 250px;">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="报停开始时间:" prop="stoptime">
					<el-date-picker v-model="selectStoptime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 250px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="报停时长:" prop="stopmonth">
					<el-select v-model="selectStopmonth" clearable filterable remote placeholder="请选择报停时长"  @change="stopmonthChange" style="width: 250px;" >
						<el-option v-for="item in monthOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="到期时间:" prop="asoftime">
					<el-date-picker v-model="selectAsoftime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 250px;">
					</el-date-picker>
				</el-form-item>
				
				<el-form-item label="备注信息:" prop="note">
					<el-input v-model="selectNote" clearable style="width: 70%;"></el-input>
				</el-form-item>
			</el-form>

			<!-- <span slot="footer" class="dialog-footer"> -->
			<span style="float:right">
				<el-button @click="payCostDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="payCostInfo">确 定</el-button>
			</span>

			<!-- 缴费的记录 -->
			<el-table :data="payCostList" border stripe style="width: 100%;margin-top: 100px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column type="index" width="100" label="序号">
				</el-table-column>
				<el-table-column prop="managementcycle" label="缴费周期">
				</el-table-column>
				<el-table-column prop="paytime" label="缴费时间">
				</el-table-column>
				<el-table-column prop="asoftime" label="到期时间">
				</el-table-column>
				<el-table-column prop="stoptime" label="报停时间" width="170px">
				</el-table-column>
				<el-table-column prop="stopmonth" label="报停时长">
					<template slot-scope="scope">
						{{scope.row.stopmonth}}个月
					</template>
				</el-table-column>
				<el-table-column prop="adduser" label="操作人">
				</el-table-column>
				<el-table-column prop="operationtime" label="操作时间" width="170px">
				</el-table-column>
				<el-table-column prop="note" label="备注">
				</el-table-column>
			</el-table>


		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 分页查询数据
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id"
				},
				// 分页列表
				pageList: [],
				total: 0,
				// 充值页面显示
				payCostDialogVisible: false,
				selectManagementcycle: '',
				selectAsoftime: '',
				selectPaytime: '',
				selectNote: '',
				selectStoptime:'',
				selectStopmonth:'',
				// 充值记录
				payCostList: [],
				payCostForm: {
					managementcycle: '',
					asoftime: '',
					note:''
				},
				// 选择缴费周期
				options: [{
					value: '月付',
					label: '月付'
				}, {
					value: '季度付',
					label: '季度付'
				}, {
					value: '半年付',
					label: '半年付'
				}, {
					value: '年付',
					label: '年付'
				}],
				
				// 报停时长
				monthOptions: [{
					value: '1',
					label: '一个月'
				},
				{
					value: '2',
					label: '二个月'
				},
				{
					value: '3',
					label: '三个月'
				},
				{
					value: '4',
					label: '四个月'
				},
				{
					value: '5',
					label: '五个月'
				},
				{
					value: '6',
					label: '六个月'
				},
				{
					value: '7',
					label: '七个月'
				},
				{
					value: '8',
					label: '八个月'
				},
				{
					value: '9',
					label: '九个月'
				},
				{
					value: '10',
					label: '十个月'
				},
				{
					value: '11',
					label: '十一个月'
				},
				{
					value: '12',
					label: '十二个月'
				},],
			}
		},
		created() {
			this.getPageList();
		},
		methods: {
			// 根据分页查询列表
			async getPageList() {
				const {
					data: res
				} = await this.$http.get('kmanagement/list', {
					params: this.queryInfo
				})
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// this.$message.success('获取信息成功')
				this.pageList = res.result.records
				this.total = res.result.total
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getPageList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getPageList()
			},

			// 点击查询按钮
			handleQueryBtn() {
				this.queryInfo.licensePlate = "*" + this.queryInfo.carName + "*"
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getPageList()
			},
			handleQueryNearBtn() {
				this.queryInfo.owe = "*是*"
				this.getPageList()
			},
			// 返回按钮order: 
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.order = "desc"
				this.queryInfo.column = "id"
				this.queryInfo.licensePlate = ''
				this.queryInfo.carName = ''
				this.queryInfo.owe = ""
				this.getPageList()
			},

			// 显示缴费页面
			async handlePayCostDialog(row) {
				// console.log('显示')
				// console.log('row',row)
				const {
					data: res
				} = await this.$http.get('kmanagementRecords/list?licensePlate=' + row.licensePlate)
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.payCostList = res.result.records
				this.payCostForm = row
				if (!row.asoftime) {
					this.selectAsoftime = ''
				} else {
					this.selectAsoftime = row.asoftime
				}

				this.payCostDialogVisible = true
			},
			// ！！新需求，根据缴费日期和缴费周期判断到期时间 
			async paytimeChange(e) {
				console.log(e)
				if (!this.selectManagementcycle) {
					return 
				}
				if(!this.selectStopmonth){
					if (!e) {
						 this.selectAsoftime = ''
	
					} else if (this.selectManagementcycle == '月付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), 1)
					} else if (this.selectManagementcycle == '季度付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), 3)
					} else if (this.selectManagementcycle == '半年付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), 6)
					} else if (this.selectManagementcycle == '年付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), 12)
					} 
				}else{
					if (!e) {
						 this.selectAsoftime = ''
					} else if (this.selectManagementcycle == '月付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+1)
					} else if (this.selectManagementcycle == '季度付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+3)
					} else if (this.selectManagementcycle == '半年付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+6)
					} else if (this.selectManagementcycle == '年付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+12)
					} 
				}
				
			},
			// 选择缴费周期变化
			async managementcycleChange(e) {
				// console.log(e)
				// ！！！新的需求是根据选择的缴费日期判断到期时间
				if (!this.selectPaytime) {
					return
				}
				if(!this.selectStopmonth){
					if (e == '月付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), 1)
					} else if (e == '季度付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), 3)
					} else if (e == '半年付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), 6)
					} else if (e == '年付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), 12)
					} else if (!e) {
						this.selectAsoftime = ''
					}
				}else{
					if (e == '月付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+1)
					} else if (e == '季度付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+3)
					} else if (e == '半年付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+6)
					} else if (e == '年付') {
						this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+12)
					} else if (!e) {
						this.selectAsoftime = ''
					}
				}
				
				// ！！！下面是根据判断是否又到期时间自动生成续费后到期时间，没有起始日期是今天，有的话是到期时间
				// if(!this.payCostForm.asoftime){		
				// 	if(e == '月付'){
				// 		this.selectAsoftime = this.addDate(new Date(),1)
				// 	}else if(e == '季度付'){
				// 		this.selectAsoftime = this.addDate(new Date(),3)
				// 	}else if(e == '半年付'){
				// 		this.selectAsoftime = this.addDate(new Date(),6)
				// 	}else if(e == '年付'){
				// 		this.selectAsoftime = this.addDate(new Date(),12)
				// 	}else if(e == ''){
				// 		this.selectAsoftime = ''
				// 	}
				// }else{
				// 	if(e == '月付'){
				// 		this.selectAsoftime = this.addDate(new Date(this.payCostForm.asoftime),1)
				// 	}else if(e == '季度付'){
				// 		this.selectAsoftime = this.addDate(new Date(this.payCostForm.asoftime),3)
				// 	}else if(e == '半年付'){
				// 		this.selectAsoftime = this.addDate(new Date(this.payCostForm.asoftime),6)
				// 	}else if(e == '年付'){
				// 		this.selectAsoftime = this.addDate(new Date(this.payCostForm.asoftime),12)
				// 	}else if(e == ''){
				// 		this.selectAsoftime = this.payCostForm.asoftime
				// 	}
				// }
			},
			
			// 报停时长变化
			async stopmonthChange(){
				if(!this.selectAsoftime){return}
				if (this.selectManagementcycle == '月付') {
					this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+1)
				} else if (this.selectManagementcycle == '季度付') {
					this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+3)
				} else if (this.selectManagementcycle == '半年付') {
					this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+6)
				} else if (this.selectManagementcycle == '年付') {
					this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+12)
				} 
			},

			// 根据缴费周期增加月份
			addDate(newdate, addMonth) {
				var Dates = newdate;
				Dates.setMonth(Dates.getMonth() + addMonth);
				var mon = Dates.getMonth() + 1,
					day = Dates.getDate();
				if (mon < 10) {
					mon = "0" + mon; //月份小于10，在前面补充0
				}
				if (day < 10) {
					day = "0" + day; //日小于10，在前面补充0
				}
				// console.log(Dates.getFullYear() + "-" + mon + "-" +day)
				return Dates.getFullYear() + "-" + mon + "-" + day
			},

			// 充值
			async payCostInfo() {
				// console.log('充值')
				this.payCostForm.managementcycle = this.selectManagementcycle
				this.payCostForm.asoftime = this.selectAsoftime
				this.payCostForm.paytime = this.selectPaytime
				this.payCostForm.note = this.selectNote
				this.payCostForm.stoptime = this.selectStoptime
				this.payCostForm.stopmonth = this.selectStopmonth

				this.$refs.payCostFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.post('kmanagement/edit', this.payCostForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.payCostDialogVisible = false
					this.getPageList()
					this.$message.success(res.message)
				})
			},

			// 监听充值对话框关闭事件
			payCostDialogClosed() {
				// console.log('关闭')
				// this.$refs.payCostFormRef.resetFields()
				this.payCostForm = {}
				this.payCostList = []
				this.selectManagementcycle = ''
				this.selectAsoftime = ''
				this.selectPaytime = ''
				this.selectNote = ''
				this.selectStoptime = ''
				this.selectStopmonth = ''
				// this.getPageList()
			},

		}
	}
</script>

<style scoped>
	.rt-input /deep/ .el-input__inner {
		color: #606266 !important;

	}
</style>
