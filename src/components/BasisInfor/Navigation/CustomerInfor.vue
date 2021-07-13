<template>
	<div>
		<!-- 司机信息页面 -->
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item >首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>客户信息</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<!-- 创建 -->
			<el-button type="primary" plain @click="addDialogVisible = true">创建</el-button>
			<el-input v-model="queryInfo.customerName" placeholder="客户名称" clearable style="width: 200px;margin-left: 100px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			
			<el-table :data="customerList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column v-if="false" prop="id" label="id">
				</el-table-column>
				<el-table-column prop="no" label="客户编号" width="100px">
				</el-table-column>
				<el-table-column prop="company" label="客户名称" width="150px">
				</el-table-column>
				<el-table-column prop="type" label="客户类型" width="150px">
				</el-table-column>
				<el-table-column prop="source" label="客户来源" width="150px">
				</el-table-column>
				<el-table-column prop="name" label="联系人姓名" width="150px">
				</el-table-column>
				<el-table-column prop="phone" label="手机号" width="150px">
				</el-table-column>
				<el-table-column prop="position" label="职位" width="150px">
				</el-table-column>
				<el-table-column prop="address" label="公司地址" width="150px">
				</el-table-column>
				<el-table-column prop="price" label="单公里运价" width="150px">
				</el-table-column>
				<el-table-column prop="stauts" label="客户合作状态" width="150px">
				</el-table-column>
				<el-table-column prop="area" label="发货区域" width="150px">
				</el-table-column>
				<el-table-column prop="note" label="备注" width="150px">
				</el-table-column>
				<el-table-column prop="cartype" label="需要车型" width="200px">
				</el-table-column>
				<el-table-column prop="grade" label="客户等级" width="150px">
				</el-table-column>
				<el-table-column prop="need" label="用车需求" width="150px">
				</el-table-column>
				<el-table-column prop="schedul" label="调度负责人" width="150px">
				</el-table-column>
				<el-table-column prop="creater" label="创建人" width="150px">
				</el-table-column>
				<el-table-column prop="creatime" label="创建时间" width="180px">
				</el-table-column>
				<el-table-column prop="neartime" label="最近更新时间" width="180px">
				</el-table-column>
				<el-table-column label="操作" width="200px" fixed="right">
					<template slot-scope="scope">
						<!-- 修改按钮 -->
						<el-button type="primary" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
						<!-- 删除按钮 -->
						<el-popconfirm title="确定删除吗？" @confirm="removeById(scope.row.id)" style="margin-left: 10px;">
							<el-button type="danger" size="mini" slot="reference">删除</el-button>
						</el-popconfirm>

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

		<!-- 创建的对话框 -->
		<el-dialog title="创建客户信息" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed">
			<!-- 创建的表单 -->
			<el-form :model="addForm" ref="addFormRef" label-width="120px">
				<el-form-item label="客户名称:" prop="company">
					<el-input v-model="addForm.company" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="客户类型:" prop="type">
					<el-select v-model="addForm.type" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="客户来源:" prop="source">
					<el-select v-model="addForm.source" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in sourceList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系人姓名:" prop="name">
					<el-input v-model="addForm.name" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="手机号:" prop="phone">
					<el-input v-model="addForm.phone" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="职位:" prop="position">
					<el-input v-model="addForm.position" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="公司地址:" prop="address">
					<el-input v-model="addForm.address" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="单公里运价:" prop="price">
					<el-input v-model="addForm.price" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="客户合作状态:" prop="stauts">
					<el-select v-model="addForm.stauts" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in stautsList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发货区域:" prop="area">
					<el-input v-model="addForm.area" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="备注:" prop="note">
					<el-input v-model="addForm.note" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="需要车型:" prop="cartypeArray">
					<el-select v-model="addForm.cartypeArray" placeholder="全部" clearable multiple @change="multiple" style="width: 350px;">
						<el-option v-for="item in cartypeList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="客户等级:" prop="grade">
					<el-select v-model="addForm.grade" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用车需求:" prop="need">
					<el-select v-model="addForm.need" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in needList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="调度负责人:" prop="schedul">
					<el-select v-model="addForm.schedul" clearable filterable remote placeholder="请选择调度员" :remote-method="remoteSchedulMethod" :loading="schedulLoading"  style="width: 350px;">
						<el-option v-for="item in schedulOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<!-- 操作区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addInfo">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 编辑的对话框 -->
		<el-dialog title="编辑客户信息" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed">
			<!-- 编辑的表单 -->
			<el-form :model="editForm" ref="editFormRef" label-width="120px">
				<el-form-item label="客户名称:" prop="company">
					<el-input v-model="editForm.company" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="客户类型:" prop="type">
					<el-select v-model="editForm.type" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="客户来源:" prop="source">
					<el-select v-model="editForm.source" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in sourceList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系人姓名:" prop="name">
					<el-input v-model="editForm.name" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="手机号:" prop="phone">
					<el-input v-model="editForm.phone" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="职位:" prop="position">
					<el-input v-model="editForm.position" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="公司地址:" prop="address">
					<el-input v-model="editForm.address" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="单公里运价:" prop="price">
					<el-input v-model="editForm.price" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="客户合作状态:" prop="stauts">
					<el-select v-model="editForm.stauts" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in stautsList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发货区域:" prop="area">
					<el-input v-model="editForm.area" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="备注:" prop="note">
					<el-input v-model="editForm.note" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="需要车型:" prop="cartypeArray">
					<el-select v-model="editForm.cartypeArray" placeholder="全部" clearable multiple @change="multiple" style="width: 350px;">
						<el-option v-for="item in cartypeList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>					
				</el-form-item>
				<el-form-item label="客户等级:" prop="grade">
					<el-select v-model="editForm.grade" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="用车需求:" prop="need">
					<el-select v-model="editForm.need" placeholder="全部" clearable style="width: 350px;">
						<el-option v-for="item in needList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="调度负责人:" prop="schedul">
					<el-select v-model="editForm.schedul" clearable filterable remote placeholder="请选择调度员" :remote-method="remoteSchedulMethod" :loading="schedulLoading"  style="width: 350px;">
						<el-option v-for="item in schedulOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editInfo">确 定</el-button>
			</span>
		
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 创建对话框显示
				addDialogVisible: false,
				// 创建
				addForm: {
					company: "",
					type: "",
					source: "",
					name: "",
					phone: "",
					position: "",
					address: "",
					price: "",
					stauts: "",
					area: "",
					cartype: "",
					grade: "",
					need: "",
					schedul: "",
					cartypeArray:[]
				},
				// 客户状态
				typeList: [{
					value: '三方物流',
					label: '三方物流'
				}, {
					value: '货站',
					label: '货站'
				}, {
					value: '工厂',
					label: '工厂'
				}],
				// 客户来源
				sourceList: [{
					value: '货运平台',
					label: '货运平台'
				}, {
					value: '企业信息查询平台',
					label: '企业信息查询平台'
				}, {
					value: '分公司',
					label: '分公司'
				}, {
					value: '线下',
					label: '线下'
				}, {
					value: '转介绍',
					label: '转介绍'
				}, {
					value: '其他',
					label: '其他'
				}],
				// 客户合作状态
				stautsList: [{
					value: '初步接触',
					label: '初步接触'
				}, {
					value: '持续跟进',
					label: '持续跟进'
				}, {
					value: '成交客户',
					label: '成交客户'
				}, {
					value: '无效客户',
					label: '无效客户'
				}],
				// 需要车型
				cartypeList: [{
					value: '6.8米',
					label: '6.8米'
				}, {
					value: '9.6米',
					label: '9.6米'
				}, {
					value: '13米及以上',
					label: '13米及以上'
				}],
				// 客户等级
				gradeList: [{
					value: '优质',
					label: '优质'
				}, {
					value: '良好',
					label: '良好'
				}, {
					value: '一般',
					label: '一般'
				}, {
					value: '差',
					label: '差'
				}],
				// 用车需求
				needList: [{
					value: '每天1-3辆',
					label: '每天1-3辆'
				}, {
					value: '每天4-6辆',
					label: '每天4-6辆'
				}, {
					value: '每天7辆以上',
					label: '每天7辆以上'
				}, {
					value: '每周1-2辆',
					label: '每周1-2辆'
				}, {
					value: '每周3-5辆',
					label: '每周3-5辆'
				}, {
					value: '每月1-3辆',
					label: '每月1-3辆'
				}],
				
				// 分页查询数据
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id"
				},
				// 分页列表
				customerList: [],
				total: 0,			
				// 编辑数据
				editDialogVisible:false,
				editForm:{
					company: "",
					type: "",
					source: "",
					name: "",
					phone: "",
					position: "",
					address: "",
					price: "",
					stauts: "",
					area: "",
					cartype: "",
					grade: "",
					need: "",
					schedul: "",
					cartypeArray:[],
					cartypeArray2:[],
					
				},
				// 调度选择框数据
				schedulOptions: [],
				schedulList: [],
				schedulLoading: false,
				schedulStates: [],
				
			}
		},
		created() {
			this.getList()
			this.getAllSchedulList()
		},
		methods: {
			multiple(e){
				// console.log(e)
				this.editForm.cartypeArray=[]
				this.editForm.cartypeArray = e
				this.$forceUpdate(); // 调用此函数方法
			},
			clickshouye(){
				// console.log("点击首页")
			},
			
			// 获取所有员工
			async getAllSchedulList() {
				const {
					data: res
				} = await this.$http.get('kuser/findALLname')
				// console.log(res)
				if (res.code !== 200) {
					return
				}
				this.schedulStates = res.result
			
				this.schedulList = this.schedulStates.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.schedulOptions = this.schedulList
			},
			
			// 选择员工方法
			remoteSchedulMethod(query) {
				if (query !== '') {
					this.schedulLoading = true;
					setTimeout(() => {
						this.schedulLoading = false;
						this.schedulOptions = this.schedulList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.schedulOptions = this.schedulList
				}
			},
			change(e){e},
			// 根据分页查询列表
			async getList() {
				const {
					data: res
				} = await this.$http.get('base/client/list', {
					params: this.queryInfo
				})
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// this.$message.success('获取信息成功')
				this.customerList = res.result.records
				this.total = res.result.total
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getList()
			},
			
			// 点击查询按钮
			handleQueryBtn() {
				this.queryInfo.company = "*" + this.queryInfo.customerName + "*"
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				// console.log(this.queryInfo)
				this.getList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.customerName = ''
				this.queryInfo.company = ''
				this.getList()
			},

			// 创建对话框
			addInfo() {
				this.addForm.cartype = this.addForm.cartypeArray.toString()
				// console.log(this.addForm)
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					// 发起添加信息的数据请求
					const {
						data: res
					} = await this.$http.post('base/client/add', this.addForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 添加成功，关闭对话框，刷新数据列表，提示添加成功
					this.addDialogVisible = false
					this.getList()
					this.$message.success(res.message)
				})
			},

			// 监听创建对话框关闭
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
			},

			// 展示编辑的对话框
			async showEditDialog(id) {
				// console.log(driverNo)
				const {
					data: res
				} = await this.$http.get('base/client/selectone?id=' + id)
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.editForm = res.result
				this.editForm.cartypeArray = res.result.cartype.split(",")
				this.editForm.cartypeArray2 = res.result.cartype.split(",")
				// 显示对话框
				this.editDialogVisible = true
			},

			// 监听修改用户对话框关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},

			// 修改信息并提交
			editInfo() {
				this.editForm.cartype = this.editForm.cartypeArray.toString()
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.put('/base/client/edit', this.editForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getList()
					this.$message.success(res.message)
				})
			},

			// 删除操作
			async removeById(id) {
				const {
					data: res
				} = await this.$http.get('base/client/deleteById?id=' + id)

				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// 删除成功，刷新数据列表，提示删除成功
				this.getList()
				this.$message.success(res.message)
			},
		}
	}
</script>

<style scoped>

</style>
