<template>
	<!-- 员工信息页面 -->
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>员工信息</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 创建搜索区 -->
		<el-row>
			<!-- 创建按钮 -->
			<!-- <el-col :span="2">
				<el-button type="info" @click="addDialogVisible = true">创建</el-button>
			</el-col> -->
			
			<!-- 员工搜索框 -->
			<!-- 			<el-col :span="3">
				<el-input v-model="queryInfo.employeeName" placeholder="员工姓名查询" clearable></el-input>
			</el-col> -->


			<!-- 公司下拉框 -->
			<!-- 			<el-col :span="1" style="margin-left: 20px;" class="queryCompanyInfo">
				<span >公司：</span>
			</el-col>
			<el-col :span="3" >
				<el-select v-model="queryInfo.employeeCompany" placeholder="公司名称查询" clearable>
					<el-option v-for="item in companyList" :key="item.index" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-col> -->


			<!-- 状态下拉框 -->
			<!-- 			<el-col :span="1" style="margin-left: 15px;" class="queryStatusInfo"><span>状态：</span></el-col>
			<el-col :span="3">
				<el-select v-model="queryInfo.employeeStatus" placeholder="状态查询" clearable>
					<el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-col> -->

			<!-- 查询按钮 -->
			<!-- 			<el-col :span="2" style="margin-left: 15px;">
				<el-button type="info"  @click="handleQueryBtn">查询</el-button>
			</el-col> -->

			<!-- 返回按钮 -->
			<!-- 			<el-col :span="3" style="margin-left: 15px;">
				<el-button type="info"  @click="handleQueryBackBtn">返回</el-button>
			</el-col> -->

		</el-row>
		<!-- 卡片视图区 el-select -->
		<el-card class="box-card">
			<el-button type="primary" plain @click="addDialogVisible = true">创建</el-button>
			<el-input v-model="queryInfo.selectUsername" placeholder="员工名" clearable style="width: 200px;margin-left: 100px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			
			<el-table :data="employeeList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="id" label="ID" width="150px">
				</el-table-column>
				<el-table-column prop="username" label="员工姓名" width="130px">
				</el-table-column>
				<el-table-column v-if="false" prop="department" label="部门" width="150px">
				</el-table-column>
				<el-table-column v-if="false" prop="position" label="职位" width="150px">
				</el-table-column>
				<el-table-column prop="company" label="所属公司">
				</el-table-column>
				<el-table-column prop="phone" label="联系方式" width="150px">
				</el-table-column>
				<el-table-column prop="email" label="邮箱" width="200px">
				</el-table-column>
				<el-table-column prop="userimg" label="身份证照片" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
							<el-image style="width: 80px; height: 40px" :src="scope.row.userimg" :preview-src-list="srcList" @click="handleClickImage(scope.row.userimg)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>

				<el-table-column label="操作" width="200px">
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
		<el-dialog title="新增员工信息" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed" :close-on-click-modal="false">
			<!-- 创建表单 -->
			<el-form :model="addForm"  ref="addFormRef" label-width="120px">
				<el-form-item label="员工ID:" v-if="false">
					<el-input  disabled style="width: 400px;" placeholder="自动生成"></el-input>
				</el-form-item>
				<el-form-item label="员工姓名:" prop="username">
					<el-input v-model="addForm.username" style="width: 300px;"></el-input>
				</el-form-item>
<!-- 				<el-form-item label="部门:" prop="department">
					<el-input v-model="addForm.department" style="width: 50%;"></el-input>
				</el-form-item>
				<el-form-item label="岗位" prop="position">
					<el-input v-model="addForm.position" style="width: 50%;"></el-input>
				</el-form-item> -->
				<el-form-item label="所属公司" prop="company">
					<el-select v-model="addForm.company" clearable filterable remote placeholder="请输入公司名称" :remote-method="remoteCompanyMethod" :loading="companyLoading" @change="companyChange" style="width: 300px;">
						<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系方式" prop="phone">
					<el-input v-model="addForm.phone" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="身份证照片" prop="userimg">
					<el-image v-if="addForm.userimg" style="width: 150px;" :src="addForm.userimg" :preview-src-list="srcList" @click="handleClickImage(addForm.userimg)"></el-image>
					<el-upload name="imgFile" :action="updateIdCardUrl" :headers="myHeaders" :auto-upload="true" :on-success="handlePictureUrlSuccess" :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传身份证</el-button>
					</el-upload>
				</el-form-item>
				
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addInfo">确 定</el-button>
			</span>

		</el-dialog>


		<!-- 编辑对话框 -->
		<el-dialog title="编辑员工信息" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed" :close-on-click-modal="false">
			<!-- 编辑表单 -->
			<el-form :model="editForm"  ref="editFormRef" label-width="100px">
				<el-form-item label="员工ID:">{{editForm.id}}</el-form-item>
				<el-form-item label="员工姓名:" prop="username">
					<el-input v-model="editForm.username" style="width: 300px;"></el-input>
				</el-form-item>
				<!-- <el-form-item label="部门:" prop="department">
					<el-input v-model="editForm.department" style="width: 90%;"></el-input>
				</el-form-item>
				<el-form-item label="岗位:" prop="position">
					<el-input v-model="editForm.position" style="width: 90%;"></el-input>
				</el-form-item> -->
				<el-form-item label="所属公司" prop="employeeCompany">
					<el-select v-model="editForm.company" clearable filterable remote placeholder="请输入公司名称" :remote-method="remoteCompanyMethod" :loading="companyLoading" @change="companyChange" style="width: 300px;">
						<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系方式:" prop="phone">
					<el-input v-model="editForm.phone" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="邮箱:" prop="email">
					<el-input v-model="editForm.email" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="身份证照片:" prop="phone">
					<el-image v-if="editForm.userimg" style="width: 150px;" :src="editForm.userimg" :preview-src-list="srcList" @click="handleClickImage(editForm.userimg)"></el-image>
					<el-upload name="imgFile" :action="updateIdCardUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditPictureSuccess" :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传身份证</el-button>
					</el-upload>
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
				// 上传图片需要携带token
				myHeaders:{
					satoken:window.sessionStorage.getItem('satoken')
				},
				// 放大图片
				srcList: [],
				// 查询数据column=id&order=desc
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					column: 'id',
					order: 'desc',
					username:'',
					selectUsername:''
				},
				// 员工列表
				allEmployeeList: [],
				// 员工列表
				employeeList: [],
				// 员工总条数
				total: 0,
				// 添加表单的状态选项
				// status: [{
				// 	value: '在职',
				// 	label: '在职'
				// }, {
				// 	value: '离职',
				// 	label: '离职'
				// }, {
				// 	value: '休假',
				// 	label: '休假'
				// }],
				// 创建员工对话框数据
				addDialogVisible: false,
				addForm: {
					username:'',
					company:'',
					phone:'',
					email:'',
					userimg:'',
					// 下面两个暂时不填
					position:null,
					department:null,					
				},
				// // 创建表单验证规则
				// addFormRules: {
				// 	username: [{
				// 		required: true,
				// 		message: "请输入员工姓名",
				// 		trigger: 'blur'
				// 	}],
				// 	employeeDepartment: [{
				// 		required: true,
				// 		message: "请输入所属部门",
				// 		trigger: 'blur'
				// 	}],
				// 	employeePost: [{
				// 		required: true,
				// 		message: "请输入岗位",
				// 		trigger: 'blur'
				// 	}],
				// 	employeeCompany: [{
				// 		required: true,
				// 		message: "请输入所属公司",
				// 		trigger: 'blur'
				// 	}],
				// 	employeeTel: [{
				// 		required: true,
				// 		message: "请输入电话",
				// 		trigger: 'blur'
				// 	}],
				// 	employeeStatus: [{
				// 		required: true,
				// 		message: "请选择状态",
				// 		trigger: 'blur'
				// 	}],
				// },
				// editFormRules: {
				// 	username: [{
				// 		required: true,
				// 		message: "请输入员工姓名",
				// 		trigger: 'blur'
				// 	}],
				// 	employeeDepartment: [{
				// 		required: true,
				// 		message: "请输入所属部门",
				// 		trigger: 'blur'
				// 	}],
				// 	employeePost: [{
				// 		required: true,
				// 		message: "请输入岗位",
				// 		trigger: 'blur'
				// 	}],
				// 	employeeCompany: [{
				// 		required: true,
				// 		message: "请输入所属公司",
				// 		trigger: 'blur'
				// 	}],
				// 	employeeTel: [{
				// 		required: true,
				// 		message: "请输入电话",
				// 		trigger: 'blur'
				// 	}],
				// 	employeeStatus: [{
				// 		required: true,
				// 		message: "请选择状态",
				// 		trigger: 'blur'
				// 	}],
				// },
				// 编辑员工对话框数据
				// 编辑员工对话框显示与隐藏
				editDialogVisible: false,
				editForm: {},
				
				// 公司选择框数据remoteMethod
				queryCompanyName: '',
				companyOptions: [],
				companyList: [],
				companyLoading: false,
				companyStates: [],
				
				// 上传身份证
				updateIdCardUrl:'http://81.70.151.121:8080/jeecg-boot/kuser/uploadImageusering',
			}
		},

		created() {
			this.getEmployeeList()
			// this.getAllEmployeeList()
			this.getAllCompanyList()
		},
		mounted() {},

		methods: {
			// 上传图片限制
			beforeAvatarUpload(file) {
				console.log(file)
				const isLt10M = file.size / 1024 / 1024 < 10;
				if (!isLt10M) {
					this.$message.error('上传图片大小不能超过 10MB!');
				}
				return isLt10M;
			},

			//点击查看放大图片
			handleClickImage(src) {
				// this.srcList = []
				this.srcList.push(src)
			},
			
			// 获取所有公司名称
			async getAllCompanyList() {
				const {
					data: res
				} = await this.$http.get('base/company/getAllCompanyName')
				// console.log(res)
				if (res.code !== 200) {
					return
				}
				res.result.forEach(v => {
			      this.companyStates.push(v.name)
				})
				// console.log(this.companyStates)
				this.companyList = this.companyStates.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.companyOptions = this.companyList
			},
			
			// 选择公司方法
			remoteCompanyMethod(query) {
				if (query !== '') {
					this.companyLoading = true;
					setTimeout(() => {
						this.companyLoading = false;
						this.companyOptions = this.companyList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.companyOptions = this.companyList
				}
			},
			// 选择公司变化
			companyChange(e){
				if(!e){
					this.companyOptions = this.companyList
				}
			},
			

			// 查询总数据
			// async getAllEmployeeList() {
			// 	const {
			// 		data: res
			// 	} = await this.$http.get('base/tBaEmployee/list')
			// 	if (res.code !== 200) {
			// 		return
			// 	}
			// 	this.allEmployeeList = res.result.records

			// },

			//分页区域 
			// 根据分页查询列表
			async getEmployeeList() {
				const {
					data: res
				} = await this.$http.get('kuser/list', {
					params: this.queryInfo
				})
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.employeeList = res.result.records
				this.total = res.result.total
			},
			
			// 点击查询按钮
			handleQueryBtn() {
				this.queryInfo.username = "*" + this.queryInfo.selectUsername + "*"
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getEmployeeList()
				// this.options = this.companyList
			},

			// 点击返回按钮
			handleQueryBackBtn() {
				this.queryInfo.username = ''
				this.queryInfo.column = 'id'
				this.queryInfo.order = 'desc'
				this.queryInfo.selectUsername = ''
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getEmployeeList()
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getEmployeeList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getEmployeeList()
			},

			// 创建员工对话框
			addInfo() {
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					// 发起添加信息的数据请求
					const {
						data: res
					} = await this.$http.post('kuser/add', this.addForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 添加成功，关闭对话框，刷新数据列表，提示添加成功
					this.addDialogVisible = false
					this.getEmployeeList()
					// this.getAllEmployeeList()
					this.$message.success('添加信息成功')
				})
			},
			
			// 创建上传身份证图片成功的回调
			handlePictureUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.addForm.userimg = response.result.uploadImageusering
			},
			// 监听创建对话框关闭
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
				this.addForm = {}
				this.options = this.companyList
			},

			// 编辑对话框操作	
			// 展示编辑员工的对话框
			async showEditDialog(Id) {
				// console.log(Id)
				const {
					data: res
				} = await this.$http.get('kuser/queryById?id=' + Id)
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.editForm = res.result
				// 显示对话框
				this.editDialogVisible = true
			},
					

			// 监听修改用户对话框关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},
			
			// 修改上传身份证图片成功的回调
			handleEditPictureSuccess(response, file, fileList) {
				// console.log(response)
				this.editForm.userimg = response.result.uploadImageusering
			},


			// 修改信息并提交
			editInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.post('kuser/edit', this.editForm)

					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getEmployeeList()
					// this.getAllEmployeeList()
					this.$message.success(res.message)
				})
			},

			// 删除操作
			async removeById(Id) {
				const {
					data: res
				} = await this.$http.get('kuser/delete?id=' + Id)

				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// 删除成功，刷新数据列表，提示删除成功
				this.getEmployeeList()
				this.$message.success(res.message)
			},



		}
	}
</script>

<style scoped>
	.queryCompanyInfo {
		font-size: 17px;
		margin-top: 8px;
	}

	.queryStatusInfo {
		font-size: 17px;
		margin-top: 8px;
	}
</style>
