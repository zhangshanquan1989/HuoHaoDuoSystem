<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆管理费</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card" v-loading.fullscreen.lock="fullscreenLoading">
			<el-button type="primary" plain @click="handleQueryNearBtn">显示快到期车辆</el-button>
			<el-input v-model="queryInfo.carName" placeholder="车牌号" clearable style="width: 200px;margin-left: 80px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 20px;">返回</el-button>
			<!-- <div style="margin-top: 15px;"> -->
			<el-button type="primary" plain icon="el-icon-download" style="margin-left: 80px;"  @click="allExport">导出全部</el-button>
			<el-button type="primary" plain icon="el-icon-download" style="margin-left: 20px;" @click="singleExport">导出选中</el-button>
			<el-button type="primary" plain style="margin-left: 20px;" @click="clearExport">清除选中</el-button>
			<!-- </div> -->
			<el-table :data="pageList" ref="table" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @sort-change="sortChange" @selection-change="selectionChange" :row-key="getLicense">
			 <el-table-column type="selection" width="55" :reserve-selection="true">
			 </el-table-column>
				<el-table-column prop="id" label="id" v-if="false">
				</el-table-column>
				<el-table-column prop="licensePlate" label="车牌号">
				</el-table-column>
				<el-table-column prop="managementcycle" label="缴费周期">
				</el-table-column>
				<el-table-column prop="paytime" label="缴费时间" sortable="custom">
				</el-table-column>
				<el-table-column prop="asoftime" label="到期时间" sortable="custom">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.owe == '是'?'red':'black'}">{{scope.row.asoftime}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="owe" label="是否快到期">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.owe == '是'?'red':'black'}">{{scope.row.owe}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="starttime" label="出车时间" sortable="custom">
				</el-table-column>
				<el-table-column prop="carstate" label="车辆状态">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.carstate=='正常'?'#303133FF':'red'}">{{scope.row.carstate}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180px">
					<template slot-scope="scope">
						<!-- 缴费按钮 -->
						<el-button style="margin-left: 10px;" type="primary" size="mini" @click="handlePayCostDialog(scope.row)">缴费</el-button>
						<el-button style="margin-left: 10px;" type="primary" size="mini" @click="handleStopDialog(scope.row)">报停</el-button>
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
		<el-dialog title="缴费页面" :visible.sync="payCostDialogVisible" width="70%" @close="payCostDialogClosed" :close-on-click-modal="false">
			<!-- 缴费的表单 -->
			<el-card style="width: 60%;margin-left: 20%;">
				<el-form :model="payCostForm" ref="payCostFormRef" label-width="200px" style="margin-top: 20px;">
					<el-form-item label="车牌号:" prop="asoftime" class="rt-input">
						<el-input v-model="payCostForm.licensePlate" disabled style="width: 250px;"></el-input>
					</el-form-item>
					<el-form-item label="缴费时间:" prop="paytime">
						<el-date-picker v-model="selectPaytime" type="date" clearable @change="paytimeChange" placeholder="请选择缴费日期"
						 format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 250px;">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="缴费周期:" prop="managementcycle">
						<el-select v-model="selectManagementcycle" clearable placeholder="请选择缴费周期" @change="managementcycleChange" style="width: 250px;">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="报停开始时间:" prop="stoptime">
					<el-date-picker v-model="selectStoptime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 250px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="报停时长:" prop="stopmonth">
					<el-select v-model="selectStopmonth" clearable filterable remote placeholder="请选择报停时长"  @change="stopmonthChange" style="width: 250px;" >
						<el-option v-for="item in monthOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
					<el-form-item label="到期时间:" prop="asoftime">
						<el-date-picker v-model="selectAsoftime" type="date" clearable placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
						 value-format="yyyy-MM-dd" style="width: 250px;">
						</el-date-picker>
					</el-form-item>

					<el-form-item label="备注信息:" prop="note">
						<el-input v-model="selectNote" clearable style="width: 70%;"></el-input>
					</el-form-item>
				</el-form>

				<!-- <span slot="footer" class="dialog-footer"> -->
				<span style="float: right;margin-bottom: 20px;">
					<el-button @click="payCostDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="payCostInfo">确 定</el-button>
				</span>
			</el-card>
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
				<el-table-column prop="stoptime" label="报停开始时间" width="170px">
				</el-table-column>
				<el-table-column prop="stopday" label="报停天数">
					<template slot-scope="scope">
						{{scope.row.stopday}}
					</template>
				</el-table-column>
				<el-table-column prop="stopmonth" label="报停月数">
					<template slot-scope="scope">
						{{scope.row.stopmonth}}
					</template>
				</el-table-column>
				<el-table-column prop="endtime" label="报停结束时间" width="170px">
				</el-table-column>
				<el-table-column prop="adduser" label="操作人">
				</el-table-column>
				<el-table-column prop="operationtime" label="操作时间" width="170px">
				</el-table-column>
				<el-table-column prop="note" label="备注">
				</el-table-column>
			</el-table>
		</el-dialog>

		<!-- 报停的对话框 -->
		<el-dialog title="报停页面" :visible.sync="stopDialogVisible" width="70%" @close="stopDialogClosed" :close-on-click-modal="false">
			<el-card style="width: 60%;margin-left: 20%;">
				<!-- 报停的表单 -->
				<el-form :model="stopNewForm" ref="stopFormRef" label-width="200px" style="margin-top: 20px;">
					<el-form-item label="车牌号:" prop="asoftime" class="rt-input">
						<el-input v-model="stopNewForm.licensePlate" disabled style="width: 250px;"></el-input>
					</el-form-item>
					<!-- <el-form-item label="缴费时间:" prop="paytime">
					<el-date-picker v-model="selectPaytime" type="date" @change="paytimeChange" placeholder="请选择缴费日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd" style="width: 250px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="缴费周期:" prop="managementcycle">
					<el-select v-model="selectManagementcycle" clearable placeholder="请选择缴费周期" @change="managementcycleChange" style="width: 250px;">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
					<el-form-item label="报停开始时间:" prop="stoptime">
						<el-date-picker :disabled="canSelect" v-model="selectStoptime" clearable type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
						 value-format="yyyy-MM-dd" style="width: 250px;" >
						</el-date-picker>
					</el-form-item>
					<el-form-item label="报停天数:" prop="stopday">
						<el-input :disabled="dayCanSelect" v-model="selectStopday" clearable style="width: 250px;" @change="stopdayChange"></el-input>
						<span style="margin-left: 5px;font-size: 16px;">天</span>
					</el-form-item>
					<el-form-item label="报停时长:" prop="stopmonth">
						<el-select :disabled="monthCanSelect" v-model="selectStopmonth" clearable filterable remote placeholder="请选择报停时长"
						 @change="stopmonthChange" style="width: 250px;">
							<el-option v-for="item in monthOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="报停结束时间:" prop="endtime">
						<el-date-picker :disabled="canSelect" v-model="selectEndtime" clearable type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
						 value-format="yyyy-MM-dd" style="width: 250px;">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="到期时间:" prop="asoftime">
						<el-date-picker :disabled="canSelect" v-model="selectStopAsoftime" clearable type="date" placeholder="选择日期"
						 format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 250px;">
						</el-date-picker>
					</el-form-item>

					<el-form-item label="备注信息:" prop="note">
						<el-input :disabled="canSelect" v-model="selectStopNote" clearable style="width: 70%;"></el-input>
					</el-form-item>
				</el-form>

				<!-- <span slot="footer" class="dialog-footer"> -->
				<span style="float:right;margin-bottom: 20px;">
					<el-button @click="stopDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="stopInfo">确 定</el-button>
				</span>
			</el-card>
			<!-- 缴费的记录 -->
			<el-table :data="payCostList" border stripe style="width: 100%;margin-top: 100px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column type="index" width="100" label="序号">
				</el-table-column>
				<el-table-column prop="managementcycle" label="缴费周期">
				</el-table-column>
				<el-table-column prop="paytime" label="缴费时间" width="110px">
				</el-table-column>
				<el-table-column prop="asoftime" label="到期时间" width="110px">
				</el-table-column>
				<el-table-column prop="stoptime" label="报停开始时间" width="110px">
				</el-table-column>
				<el-table-column prop="stopday" label="报停天数">
					<template slot-scope="scope">
						{{scope.row.stopday}}
					</template>
				</el-table-column>
				<el-table-column prop="stopmonth" label="报停月数">
					<template slot-scope="scope">
						{{scope.row.stopmonth}}
					</template>
				</el-table-column>
				<el-table-column prop="endtime" label="报停结束时间" width="110px">
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
				aaaa: 0,
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
				// 报停
				stopDialogVisible: false,
				selectStopday: '',
				selectStoptime: '',
				selectStopmonth: '',
				selectEndtime: '',
				selectStopAsoftime: '',
				selectStopNote: '',
				// 保亭页面不可以操作
				canSelect: false,
				dayCanSelect: false,
				monthCanSelect: false,
				// 充值记录
				payCostList: [],
				stopForm: {},
				stopNewForm: {},
				payCostForm: {
					managementcycle: '',
					asoftime: '',
					note: ''
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
				// 加载查询
				fullscreenLoading: false,
				licenseplateList:[],
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
					},
				],
			}
		},
		created() {
			this.getPageList();
		},
		methods: {
			// 多选框保持选中
			getLicense(row) {
				return row.licensePlate
			},
			
			// 导出全部
			async allExport(){
				this.fullscreenLoading = true;				
				let url = 'https://tkhhd.com/jeecg-boot/kmanagement/exportKmanagement'
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
						a.download = "全部管理费报表.xlsx" // 文件名
						a.click()
						window.URL.revokeObjectURL(url)
						a.remove()
						that.fullscreenLoading = false;
					}
				xhr.send();
			},
			
			//导出所需的数据
			// 选择框变化
			selectionChange(e) {
				this.licenseplateList = []
				e.forEach(v => {
					this.licenseplateList.push(v.licensePlate)
				})
			},
			// 导出选中部分
			async singleExport() {
				if (!this.licenseplateList[0]) {
					return this.$message.warning('请选择需要导出的数据！')
				}
				const {
					data: res
				} = await this.$http({
					url: 'kmanagement/exportKmanagementlist',
					method: "post",
					data: {
						licenseplate: this.licenseplateList
					},
					responseType: 'blob',
				})
			
				var blob = res
				// console.log(blob)
				const fileName = '选中管理费报表.xlsx'
				var a = document.createElement("a");
				a.href = window.URL.createObjectURL(blob);
				// console.log(a.href)
				a.download = fileName
				a.click()
				a.remove()
			},
			
			// 清除选中
			clearExport(){
				this.$refs.table.clearSelection()
			},
			
			sortChange(e){
				// console.log(e)
				this.queryInfo.column = e.prop
				if(e.order == "descending"){
					this.queryInfo.order = "desc"
				}else if(e.order == "ascending"){
					this.queryInfo.order = "asc"
				}
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getPageList();
			},
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
				this.$refs.table.clearSort()
			},
			handleQueryNearBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.owe = "*是*"
				this.queryInfo.carstate = "*正常*"
				this.getPageList()
			},
			// 返回按钮order: 
			handleQueryBackBtn() {
				this.$refs.table.clearSort()
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.order = "desc"
				this.queryInfo.column = "id"
				this.queryInfo.licensePlate = ''
				this.queryInfo.carName = ''
				this.queryInfo.owe = ""
				this.queryInfo.carstate = ""
				this.getPageList()
			},

			// 显示缴费页面
			async handlePayCostDialog(row) {
				// console.log('显示')
				// console.log('row',row)
				const {
					data: res
				} = await this.$http.get('kmanagementRecords/list?licensePlate=' + row.licensePlate)
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.payCostList = res.result.records
				this.payCostForm.id = row.id
				this.payCostForm.licensePlate = row.licensePlate
				if (!row.asoftime) {
					this.selectAsoftime = ''
				} else {
					this.selectAsoftime = row.asoftime
				}

				this.payCostDialogVisible = true
			},
			// ！！新需求，根据缴费日期和缴费周期判断到期时间 
			async paytimeChange(e) {
				// console.log(e)
				if (!this.selectManagementcycle) {
					return
				}
				// if(!this.selectStopmonth){
				if (!e) {
					this.selectAsoftime = ''

				} else if (this.selectManagementcycle == '月付') {
					this.selectAsoftime = this.getAfterDate(this.addDate(new Date(this.selectPaytime), 1), -1)
				} else if (this.selectManagementcycle == '季度付') {
					this.selectAsoftime = this.getAfterDate(this.addDate(new Date(this.selectPaytime), 3), -1)
				} else if (this.selectManagementcycle == '半年付') {
					this.selectAsoftime = this.getAfterDate(this.addDate(new Date(this.selectPaytime), 6), -1)
				} else if (this.selectManagementcycle == '年付') {
					this.selectAsoftime = this.getAfterDate(this.addDate(new Date(this.selectPaytime), 12), -1)
				}
				// }else{
				// 	if (!e) {
				// 		 this.selectAsoftime = ''
				// 	} else if (this.selectManagementcycle == '月付') {
				// 		this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+1)
				// 	} else if (this.selectManagementcycle == '季度付') {
				// 		this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+3)
				// 	} else if (this.selectManagementcycle == '半年付') {
				// 		this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+6)
				// 	} else if (this.selectManagementcycle == '年付') {
				// 		this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+12)
				// 	} 
				// }

			},
			// 选择缴费周期变化
			async managementcycleChange(e) {
				// console.log(e)
				// ！！！新的需求是根据选择的缴费日期判断到期时间
				if (!this.selectPaytime) {
					return
				}
				// if(!this.selectStopmonth){
				if (e == '月付') {
					this.selectAsoftime = this.getAfterDate(this.addDate(new Date(this.selectPaytime), 1), -1)
					// console.log(this.selectAsoftime)
				} else if (e == '季度付') {
					this.selectAsoftime = this.getAfterDate(this.addDate(new Date(this.selectPaytime), 3), -1)
				} else if (e == '半年付') {
					this.selectAsoftime = this.getAfterDate(this.addDate(new Date(this.selectPaytime), 6), -1)
				} else if (e == '年付') {
					this.selectAsoftime = this.getAfterDate(this.addDate(new Date(this.selectPaytime), 12), -1)
				} else if (!e) {
					this.selectAsoftime = ''
				}
				// }else{
				// 	if (e == '月付') {
				// 		this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+1)
				// 	} else if (e == '季度付') {
				// 		this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+3)
				// 	} else if (e == '半年付') {
				// 		this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+6)
				// 	} else if (e == '年付') {
				// 		this.selectAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+12)
				// 	} else if (!e) {
				// 		this.selectAsoftime = ''
				// 	}
				// }

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

			// 计算增加天数后的日期
			getAfterDate(newdate, addDate) { //当前为0，前一天为-1，后一天为1
				var date = new Date(newdate);
				var year, month, day;
				date.setDate(date.getDate() + addDate);
				year = date.getFullYear();
				month = date.getMonth() + 1;
				day = date.getDate();
				var t = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
				return t;
			},

			// 充值
			async payCostInfo() {
				// console.log('充值')
				this.payCostForm.managementcycle = this.selectManagementcycle
				this.payCostForm.asoftime = this.selectAsoftime
				this.payCostForm.paytime = this.selectPaytime
				this.payCostForm.note = this.selectNote
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

			// 显示报停页面
			async handleStopDialog(row) {
				const {
					data: res
				} = await this.$http.get('kmanagementRecords/list?licensePlate=' + row.licensePlate)
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.payCostList = res.result.records
				this.stopForm = row
				this.stopNewForm.licensePlate = row.licensePlate
				this.stopNewForm.id = row.id
				if (!row.asoftime) {
					this.selectStopAsoftime = ''
					this.canSelect = true
					this.dayCanSelect = true
					this.monthCanSelect = true
				} else {
					this.selectStopAsoftime = row.asoftime
					this.canSelect = false
					this.dayCanSelect = false
					this.monthCanSelect = false
				}
				this.stopDialogVisible = true
			},
			// 报停开始时间变化
			// stoptimeChange(e) {
			// 	if (new Date(e) - new Date(this.selectStopAsoftime) > 0) {
			// 		this.selectStoptime = ""
			// 		return this.$message.warning("报停开始时间不能晚于到期时间！")
			// 	}
			// },
			// 报停天数变化
			async stopdayChange(e) {
				if (!this.selectStoptime) {
					this.selectStopday = ""
					return this.$message.warning("请先选择报停开始时间！")
				}
				if (!this.selectStopday) {
					this.monthCanSelect = false
					this.selectEndtime = ""
				} else {
					this.monthCanSelect = true
					this.selectEndtime = this.getAfterDate(new Date(this.selectStoptime), e - 0)
				}
				this.selectStopAsoftime = this.getAfterDate(new Date(this.stopForm.asoftime), e - 0)

			},
			// 报停月数变化
			async stopmonthChange() {
				if (!this.selectStoptime) {
					this.selectStopmonth = ""
					return this.$message.warning("请先选择报停开始时间！")
				}
				if (!this.selectStopmonth) {
					this.dayCanSelect = false
					this.selectEndtime = ""
				} else {
					this.dayCanSelect = true
					// 报停结束时间
					this.selectEndtime = this.getAfterDate(this.addDate(new Date(this.selectStoptime), this.selectStopmonth - 0), -1)
				}
				// 到期时间
				this.selectStopAsoftime = this.getAfterDate(this.addDate(new Date(this.stopForm.asoftime), this.selectStopmonth -
					0), -1)

				// if (this.stopForm.managementcycle == '月付') {
				// 	this.selectStopAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+1)
				// } else if (this.selectManagementcycle == '季度付') {
				// 	this.selectStopAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+3)
				// } else if (this.selectManagementcycle == '半年付') {
				// 	this.selectStopAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+6)
				// } else if (this.selectManagementcycle == '年付') {
				// 	this.selectStopAsoftime = this.addDate(new Date(this.selectPaytime), this.selectStopmonth-0+12)
				// } 
			},


			// 报停确定
			async stopInfo() {
				this.stopNewForm.stoptime = this.selectStoptime
				this.stopNewForm.stopday = this.selectStopday
				this.stopNewForm.stopmonth = this.selectStopmonth
				this.stopNewForm.endtime = this.selectEndtime
				this.stopNewForm.asoftime = this.selectStopAsoftime
				this.stopNewForm.note = this.selectStopNote
				this.$refs.stopFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.post('kmanagement/edits', this.stopNewForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.stopDialogVisible = false
					this.getPageList()
					this.$message.success(res.message)
				})
			},
			// 报停对话框关闭
			stopDialogClosed() {
				this.selectStoptime = ''
				this.selectStopday = ''
				this.selectStopmonth = ''
				this.selectEndtime = ''
				this.selectStopAsoftime = ''
				this.selectStopNote = ''
			},
		}
	}
</script>

<style scoped>
	.rt-input /deep/ .el-input__inner {
		color: #606266 !important;

	}
</style>
