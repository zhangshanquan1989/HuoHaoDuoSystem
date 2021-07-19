<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆分配</el-breadcrumb-item>
		</el-breadcrumb>
		
		<el-card class="box-card">

			<el-select v-model="queryInfo.lpl" clearable filterable remote placeholder="请输入车牌号" :remote-method="remotePlateNumberMethod" :loading="plateNumberLoading" style="width: 293px;">
				<el-option v-for="item in plateNumberOptions" :key="item.index" :label="item.label" :value="item.value">
				</el-option>
			</el-select>			
	
			<el-button type="primary"  plain icon="el-icon-search" style="margin-left: 30px;" @click="search">搜索</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			
			<el-table :data="carList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
			 <el-table-column v-if="false" prop="id" label="ID" width="250px">
			 </el-table-column>
				<el-table-column prop="lp" label="车牌号" width="250px">
				</el-table-column>
				<el-table-column prop="diaodu" label="负责调度" width="250">
				</el-table-column>	
				<el-table-column label="操作"  >
					<template slot-scope="scope">
						<!-- 修改按钮 -->
						<el-button type="primary" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>				
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 分页区域 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
		 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total" style="margin-top: 5px;">
		</el-pagination>
		
		<!-- 编辑公司的对话框 -->
		<el-dialog title="编辑车辆信息" :visible.sync="editDialogVisible" width="35%" @close="editCompanyDialogClosed">
			<!-- 编辑公司的表单 -->
			<el-form :model="editForm" ref="editFormRef" label-width="120px">
				<el-form-item label="id">
					<el-input disabled v-model="editForm.id" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="车牌号" prop="lp">
					<el-input disabled  v-model="editForm.lp" style="width: 350px;"></el-input>
				</el-form-item>
				
				<el-form-item label="负责调度:" prop="diaodu">
					<el-select v-model="editForm.diaodu" clearable filterable remote placeholder="请选择" :remote-method="remoteDispatchMethod" :loading="dispatchLoading"  style="width: 350px;">
						<el-option v-for="item in dispatchOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editCompanyInfo">确 定</el-button>
			</span>
		
		</el-dialog>

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
					order: 'desc',
					column: 'id',
				},
				carList:[],
				total:0,
				
				// 编辑对话框数据
				// 编辑对话框显示与隐藏
				editDialogVisible: false,
				editForm: {},
				newEditForm: {},
				
				// 调度选择框数据
				dispatchOptions: [],
				dispatchList: [],
				dispatchLoading: false,
				dispatchStates: [],
				
				// 选择车牌数据
				plateNumberLoading: false,
				plateNumberOptions: [],
				plateNumberStates: [],
				plateNumberList: [],
							
			}
		},
		created() {
			this.getCarList()
			this.getAllDispatchList()
			this.getAllPlateNumberList()
		},
		methods:{
			// 根据分页查询列表
			async getCarList() {
				const {
					data: res
				} = await this.$http.get('lpdis/list', {
					params: this.queryInfo
				})
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.carList = res.result.records
				this.total = res.result.total
			},
			
			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getCarList()
			},
			
			// 页码值改变事件
			handleCurrentChange(pageNo) {
				this.queryInfo.pageNo = pageNo
				this.getCarList()
			},
			
			// 编辑对话框操作
			// 展示编辑公司的对话框
			async showEditDialog(id) {
				const {
					data: res
				} = await this.$http.get('lpdis/xq?id=' + id)
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.editForm = res.result
				// 显示对话框
				this.editDialogVisible = true
			},
			// 监听修改用户对话框关闭事件
			editCompanyDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},
			// 修改公司信息并提交
			editCompanyInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改用户信息的数据请求
					this.newEditForm.id = this.editForm.id
					this.newEditForm.user = this.editForm.diaodu
					this.newEditForm.chepai = this.editForm.lp
					const {
						data: res
					} = await this.$http.get('lpdis/add',  {
					params: this.newEditForm
				})
			
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getCarList()
					this.$message.success(res.message)
				})
			},
			
			// 点击查询按钮
			search() {
				this.queryInfo.lp = "*" + this.queryInfo.lpl + "*"
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				// console.log(this.queryInfo)
				this.getCarList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.lp = ''
				this.queryInfo.lpl = ''
				this.getCarList()
			},
			
			
			// 获取所有员工
			async getAllDispatchList() {
				const {
					data: res
				} = await this.$http.get('kuser/findALLname')
				// console.log(res)
				if (res.code !== 200) {
					return
				}
				this.dispatchStates = res.result
			
				this.dispatchList = this.dispatchStates.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.dispatchOptions = this.dispatchList
			},
			
			// 选择员工方法
			remoteDispatchMethod(query) {
				if (query !== '') {
					this.dispatchLoading = true;
					setTimeout(() => {
						this.dispatchLoading = false;
						this.dispatchOptions = this.dispatchList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.dispatchOptions = this.dispatchList
				}
			},
			
			// 获取所有车牌号
			async getAllPlateNumberList() {
				const {
					data: res
				} = await this.$http.get('kCarinformation/findplate')
				if (res.code !== 200) {
					return
				}
				// console.log(res)
				// res.result.forEach(v => {
				// 	this.plateNumberStates.push(v.driverLicense)
				// })
				this.plateNumberList = res.result.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.plateNumberOptions = this.plateNumberList
			},
			
			// 选择车牌的方法
			remotePlateNumberMethod(query) {
				if (query !== '') {
					this.plateNumberLoading = true;
					setTimeout(() => {
						this.plateNumberLoading = false;
						this.plateNumberOptions = this.plateNumberList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.plateNumberOptions = this.plateNumberList
				}
			},
			
		},
	}
</script>

<style scoped>

</style>