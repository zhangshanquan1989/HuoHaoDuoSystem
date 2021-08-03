<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆保证金</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card">
			<div style="display: flex;">
			<div >
				<el-button type="primary" plain icon="el-icon-download" @click="baozhengjinExport">导出</el-button>
				<el-button type="primary" plain @click="handleClearBtn" style="margin-left: 14px;">清空选中</el-button>
				<el-input v-model="queryInfo.carName" placeholder="车牌号" clearable style="width: 200px;margin-left: 14px;"></el-input>
				<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 14px;">查询</el-button>
				<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 14px;">返回</el-button>
				</div>
				<div style="width: 300px;height: 40px;border: 1px solid #DCDFE6;opacity: 1;margin-left: 30px;display: flex;">
					<img style="width: 26px;height: 26px;margin-left: 16px;margin-top: 7px;" src="../../../../assets/car/组2013.png" />
					<div style="font-size: 16px;font-weight: 400;color: #909399;margin-left: 16px;margin-top: 9.5px;">保证金合计</div>
					<div style="width: 90px;font-size: 23px;font-weight: bold;color: #303133;margin-left: 16px;margin-top: 5px;text-align: center;">{{combinedData.selectmargin}}</div>
					<div style="font-size: 16px;font-weight: 400;color: #909399;margin-left: 16px;margin-top: 9.5px;">元</div>
				</div>
				<div style="width: 300px;height: 40px;border: 1px solid #DCDFE6;opacity: 1;margin-left: 13px;display: flex;">
					<img style="width: 26px;height: 26px;margin-left: 16px;margin-top: 7px;" src="../../../../assets/car/组2066.png" />
					<div style="font-size: 16px;font-weight: 400;color: #909399;margin-left: 16px;margin-top: 9.5px;">罚款合计</div>
					<div style="width: 90px;font-size: 23px;font-weight: bold;color: #303133;margin-left: 16px;margin-top: 5px;text-align: center;">{{combinedData.selectfines}}</div>
					<div style="font-size: 16px;font-weight: 400;color: #909399;margin-left: 16px;margin-top: 9.5px;">元</div>
				</div>
				<div style="width: 300px;height: 40px;border: 1px solid #DCDFE6;opacity: 1;margin-left: 13px;display: flex;">
					<img style="width: 26px;height: 26px;margin-left: 16px;margin-top: 7px;" src="../../../../assets/car/组2062.png" />
					<div style="font-size: 16px;font-weight: 400;color: #909399;margin-left: 16px;margin-top: 9.5px;">余额合计</div>
					<div style="width: 90px;font-size: 23px;font-weight: bold;color: #303133;margin-left: 16px;margin-top: 5px;text-align: center;">{{combinedData.selectremain}}</div>
					<div style="font-size: 16px;font-weight: 400;color: #909399;margin-left: 16px;margin-top: 9.5px;">元</div>
				</div>
				<!-- <span style="margin-left: 450px;font-size: 18px;">保证金合计：{{combinedData.selectmargin}}元</span>
				<span style="margin-left: 30px;font-size: 18px;">罚款合计：{{combinedData.selectfines}}元</span>
				<span style="margin-left: 30px;font-size: 18px;">余额合计：{{combinedData.selectremain}}元</span> -->
			</div>
			
			
			<el-table :data="pageList" ref="tableRef" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @selection-change="baozhengjinSelectionChange" :row-key="getLicense">
			 <el-table-column type="selection" :reserve-selection="true" width="55">
			 </el-table-column>
				<el-table-column prop="id" label="id" v-if="false">
				</el-table-column>
				<el-table-column prop="license" label="车牌号">
				</el-table-column>
				<el-table-column prop="margin" label="保证金">
				</el-table-column>
				<el-table-column prop="fines" label="罚款">
				</el-table-column>
				<el-table-column prop="remain" label="保证金余额">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.remain < 500?'#EC2941FF':'#303133FF'}">{{scope.row.remain}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="statue" label="车辆状态">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.statue=='正常'?'#303133FF':'#EC2941FF'}">{{scope.row.statue}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<!-- 充值按钮 -->
						<el-button type="primary" size="mini" @click="showRechargeDialog(scope.row.id,scope.row.license)">充值</el-button>
						<!-- 罚款按钮 -->
						<el-button type="warning" size="mini" @click="showFineDialog(scope.row.id,scope.row.license)">罚款</el-button>
						<!-- 修改按钮 -->
						<!-- <el-button type="primary" size="mini" @click="showEditDialog(scope.row.id)">记录</el-button> -->
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

		<!-- 充值的对话框 -->
		<el-dialog title="充值页面" :visible.sync="rechargeDialogVisible" width="45%" @close="rechargeDialogClosed">
			<!-- 充值的表单 -->
			<el-form :model="addRechargeForm" ref="addRechargeFormRef" label-width="100px">
				<el-form-item v-if="false" label="充值id:" prop="parentid">
					<el-input v-model="addRechargeForm.parentid"></el-input>
				</el-form-item>
				<el-form-item label="车牌号:" prop="license">
					{{addRechargeForm.license}}
				</el-form-item>
				<el-form-item label="充值金额:" prop="amountS" >
					<el-input v-model="addRechargeForm.amountS" style="width: 350px;"></el-input>
				</el-form-item>
			</el-form>	
			
			<!-- <span slot="footer" class="dialog-footer"> -->
			<span style="float:right">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRechargeInfo">确 定</el-button>
			</span>	
						
			<!-- 充值的记录 -->
			<el-table :data="rechargeRecordList" border stripe style="width: 100%;margin-top: 100px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column type="index" width="100" label="序号">
				</el-table-column>
				<el-table-column prop="amount" label="充值金额">
				</el-table-column>
				<el-table-column prop="people" label="充值人">
				</el-table-column>
				<el-table-column prop="time" label="充值时间">
				</el-table-column>
			</el-table>
			
		
		</el-dialog>

		<!-- 罚款的对话框 -->
		<el-dialog title="罚款页面" :visible.sync="fineDialogVisible" width="45%" @close="fineDialogClosed">
			<!-- 罚款的表单 -->
			<el-form :model="fineForm" ref="fineFormFormRef" label-width="100px">
				<el-form-item v-if="false" label="充值id:" prop="parentid">
					<el-input v-model="fineForm.parentid"></el-input>
				</el-form-item>
				<el-form-item label="车牌号:" prop="license">
					{{fineForm.license}}
				</el-form-item>
				<el-form-item label="罚款金额:" prop="fine">
					<el-input v-model="fineForm.fine"></el-input>
				</el-form-item>
				<el-form-item label="罚款原因:" prop="finecase">
					<el-input v-model="fineForm.finecase"></el-input>
				</el-form-item>
			</el-form>
			
			<!-- <span slot="footer" class="dialog-footer"> -->
				<span style="float:right">
				<el-button @click="fineDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="fineInfo">确 定</el-button>
			</span>
			
			<!-- 罚款的记录 -->
			<el-table :data="fineRecordList" border stripe style="width: 100%;margin-top: 100px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column type="index" width="100" label="序号">
				</el-table-column>
				<el-table-column prop="fine" label="罚款金额">
				</el-table-column>
				<el-table-column prop="finecase" label="罚款原因">
				</el-table-column>
				<el-table-column prop="people" label="罚款处理人">
				</el-table-column>
				<el-table-column prop="finetime" label="罚款时间">
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
					// // 倒叙必填
					order: "desc",
					column: "id"
				},
				// 分页列表
				pageList: [],
				total: 0,
				// 充值页面显示
				rechargeDialogVisible: false,
				// 充值记录
				rechargeRecordList: [],
				addRechargeForm: {},
				// 罚款页面显示
				fineDialogVisible: false,
				// 罚款记录
				fineRecordList: [],
				fineForm: {},
				// 导出
				baozhengjinExcel:[],
				// 车辆合计数据
				combinedData:{},
			}
		},
		created() {
			this.getPageList();
			this.getCombinedData();
		},
		methods: {
			// 多选框保持选中
			getLicense(row){
				return row.license
			},
			
			// 根据分页查询列表
			async getPageList() {
				const {
					data: res
				} = await this.$http.get('base/margin/list', {
					params: this.queryInfo
				})
				// console.log(res)
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
				this.queryInfo.license = "*" + this.queryInfo.carName + "*"
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getPageList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.order = "desc"
				this.queryInfo.column = "id"
				this.queryInfo.license = ''
				this.queryInfo.carName = ''
				this.getPageList()
			},

			// 显示充值页面
			async showRechargeDialog(id,license) {
				const {
					data: res
				} = await this.$http.get('base/margin/selecttop?id=' + id)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.rechargeRecordList = res.result
				this.addRechargeForm.parentid = id
				this.addRechargeForm.license = license
				this.rechargeDialogVisible = true
			},
			// 充值
			async addRechargeInfo() {
				this.$refs.addRechargeFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					this.addRechargeForm.amount = this.addRechargeForm.amountS - 0
					// console.log(this.addRechargeForm)
					const {
						data: res
					} = await this.$http.post('base/top/add', this.addRechargeForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.rechargeDialogVisible = false
					this.getPageList()
					this.getCombinedData()
					this.$message.success(res.message)
				})
			},

			// 监听充值对话框关闭事件
			rechargeDialogClosed() {
				this.$refs.addRechargeFormRef.resetFields()
			},

			// 显示罚款页面
			async showFineDialog(id,license) {
				const {
					data: res
				} = await this.$http.get('base/margin/selectdown?id=' + id)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.fineRecordList = res.result
				this.fineForm.parentid = id
				this.fineForm.license = license
				this.fineDialogVisible = true
			},
			// 罚款
			async fineInfo() {
				this.$refs.fineFormFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					this.fineForm.fine = this.fineForm.fine - 0
					// console.log(this.fineForm)
					const {
						data: res
					} = await this.$http.post('base/down/add', this.fineForm)
					// console.log(this.fineForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.fineDialogVisible = false
					this.getPageList()
					this.getCombinedData()
					this.$message.success(res.message)
				})
			},

			// 监听罚款对话框关闭事件
			fineDialogClosed() {
				this.$refs.fineFormFormRef.resetFields()
			},
			
			//导出所需的数据
			 // 选择框变化
			 baozhengjinSelectionChange(e){
				 console.log(e)
				this.baozhengjinExcel = []
				e.forEach(v=>{
				this.baozhengjinExcel.push(v.license)
				})
			},
			// 导出
			async baozhengjinExport(){
				if(!this.baozhengjinExcel[0]){return this.$message.warning('请选择需要导出的数据！')}
				const {data:res} = await this.$http.get('SumController/YouHaodaochu?'+this.$qs.stringify({ YouHaodaochu: this.baozhengjinExcel }, { arrayFormat: 'repeat' }))
				window.location.href = 'http://81.70.151.121:8080/jeecg-boot/SumController/YouHaodaochu?'+this.$qs.stringify({ YouHaodaochu: this.baozhengjinExcel }, { arrayFormat: 'repeat' })
				
			},
			// 清空选中
			handleClearBtn(){
				this.$refs.tableRef.clearSelection()
			},
			
			// 获取所有车辆合计数据
			async getCombinedData(){
				const {
					data: res
				} = await this.$http.get('SumController/selectBaozhengjin')
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.combinedData = res.result
			},
		}
	}
</script>

<style scoped>

</style>
