<template>
	<!-- 公司信息页面 -->
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>公司信息</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<el-button type="primary" plain @click="showAddDialog">创建</el-button>
			<el-input v-model="queryInfo.companyName" placeholder="公司名" clearable style="width: 200px;margin-left: 100px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>


			<el-table :data="companylist" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column v-if="false" prop="id" label="id">
				</el-table-column>
				<el-table-column prop="name" label="公司名称" width="350px">
				</el-table-column>
				<el-table-column prop="personname" label="法人姓名" width="150px">
				</el-table-column>
				<el-table-column prop="phone" label="法人手机号" width="150px">
				</el-table-column>
				<el-table-column prop="card" label="法人身份证" width="200px">
				</el-table-column>
				<el-table-column prop="head" label="负责人姓名" width="150px">
				</el-table-column>
				<el-table-column prop="headphone" label="负责人电话" width="150px">
				</el-table-column>
				<el-table-column prop="work" label="行政负责人" width="150px">
				</el-table-column>
				<el-table-column prop="workphone" label="行政负责人电话" width="150px">
				</el-table-column>
				<el-table-column prop="opentime" label="开业时间" width="200px" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="address" label="地区" width="150px">
				</el-table-column>
				<el-table-column prop="housenumber" label="详细地址" width="600px">
				</el-table-column>
				<el-table-column label="营业执照" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
							<el-image style="width: 80px; height: 40px" :src="scope.row.business" :preview-src-list="srcList" @click="handleClickImage(scope.row.business)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column label="道路运输许可证" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
							<el-image style="width: 80px; height: 40px" :src="scope.row.permit" :preview-src-list="srcList" @click="handleClickImage(scope.row.permit)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="creater" label="创建人" width="150px">
				</el-table-column>
				<el-table-column prop="creatime" label="创建时间" width="200px" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="nearcreatime" label="最近更新时间" width="200px" show-overflow-tooltip>
				</el-table-column>
				<el-table-column label="操作" width="200" fixed="right">
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
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
		 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total" style="margin-top: 5px;">
		</el-pagination>

		<!-- 创建公司的对话框 -->
		<el-dialog class="dialog" title="创建公司信息" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed" :close-on-click-modal="false">
			<!-- 添加公司的表单 -->
			<el-form :model="addForm" :rules="addCompanyFormRules" ref="addFormRef" label-width="150px">
				<el-form-item label="公司名称:" prop="name">
					<el-input v-model="addForm.name" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="法人姓名:" prop="personname">
					<el-input v-model="addForm.personname" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="法人手机号:" prop="phone">
					<el-input v-model="addForm.phone" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="法人身份证号:" prop="card">
					<el-input v-model="addForm.card" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="负责人姓名:" prop="head">
					<el-input v-model="addForm.head" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="负责人电话:" prop="headphone">
					<el-input v-model="addForm.headphone" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="行政负责人姓名:" prop="work">
					<el-input v-model="addForm.work" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="行政负责人电话:" prop="workphone">
					<el-input v-model="addForm.workphone" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="开业时间" prop="opentime">
					<el-date-picker v-model="addForm.opentime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
					 style="width: 350px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="地区:" prop="address">
					<el-input v-model="addForm.address" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="详细地址:" prop="housenumber">
					<el-input v-model="addForm.housenumber" style="width:80%;"></el-input>
				</el-form-item>
				<el-form-item label="营业执照:">
					<el-image v-if="addForm.business" style="width: 150px; " :src="addForm.business"></el-image>
					<el-upload name="imgFile" :action="updateBusinessUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleBusinessSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="运输许可证:">
					<el-image v-if="addForm.permit" style="width: 150px;" :src="addForm.permit"></el-image>
					<el-upload name="imgFile" :action="updateTransportUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleTransportSuccess" :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>点击上传</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addCompany">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 编辑公司的对话框 -->
		<el-dialog title="编辑公司信息" :visible.sync="editDialogVisible" width="35%" @close="editCompanyDialogClosed" :close-on-click-modal="false">
			<!-- 编辑公司的表单 -->
			<el-form :model="editCompanyForm" ref="editCompanyFormRef" label-width="120px">
				<el-form-item label="id:">
					<el-input disabled v-model="editCompanyForm.id" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="公司名称:" prop="name">
					<el-input v-model="editCompanyForm.name" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="法人姓名:" prop="personname">
					<el-input v-model="editCompanyForm.personname" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="法人手机号:" prop="phone">
					<el-input v-model="editCompanyForm.phone" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="法人身份证号:" prop="card">
					<el-input v-model="editCompanyForm.card" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="负责人姓名:" prop="head">
					<el-input v-model="editCompanyForm.head" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="负责人电话:" prop="headphone">
					<el-input v-model="editCompanyForm.headphone" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="行政负责人姓名:" prop="work">
					<el-input v-model="editCompanyForm.work" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="行政负责人电话:" prop="workphone">
					<el-input v-model="editCompanyForm.workphone" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="开业时间" prop="opentime">
					<el-date-picker v-model="editCompanyForm.opentime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd" style="width: 350px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="地区:" prop="address">
					<el-input v-model="editCompanyForm.address" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="详细地址:" prop="housenumber">
					<el-input v-model="editCompanyForm.housenumber" style="width: 80%;"></el-input>
				</el-form-item>
				<el-form-item label="营业执照:">
					<el-image v-if="editCompanyForm.business" style="width: 150px; " :src="editCompanyForm.business" :preview-src-list="srcList" @click="handleClickImage(editCompanyForm.business)"></el-image>
					<el-upload name="imgFile" :action="updateBusinessUrl" :auto-upload="true" :on-success="handleEditBusinessSuccess"
					 :show-file-list="false" :headers="myHeaders" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="运输许可证:">
					<el-image v-if="editCompanyForm.permit" style="width: 150px; " :src="editCompanyForm.permit" :preview-src-list="srcList" @click="handleClickImage(editCompanyForm.permit)"></el-image>
					<el-upload name="imgFile" :action="updateTransportUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditTransportSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>点击上传</el-button>
					</el-upload>
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
		data() {
			return {
				// 上传图片需要携带token
				myHeaders: {
					satoken: window.sessionStorage.getItem('satoken')
				},
				// 放大图片的列表
				srcList: [],
				// 查询参数对象
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id"
				},
				// 公司列表
				companylist: [],
				// 公司总条数
				total: 0,

				// 添加公司数据
				// 控制添加公司对话框的显示与隐藏
				addDialogVisible: false,

				// 添加公司的表单数据对象
				addForm: {
					name: "",
					personname: "",
					phone: "",
					card: "",
					head: "",
					headphone: '',
					work: '',
					workphone: '',
					opentime: '',
					address: '',
					housenumber: '',
					business: '',
					permit: '',
				},
				// 添加公司营业执照的网址
				updateBusinessUrl: 'http://81.70.151.121:8080/jeecg-boot/base/company/uploadbusiness',
				// 添加运输许可证网址
				updateTransportUrl: 'http://81.70.151.121:8080/jeecg-boot/base/company/uploadtransport',

				// 添加的表单验证规则
				addCompanyFormRules: {
					name: [{
						required: true,
						message: "请输入公司名",
						trigger: 'blur'
					}],
					personname: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					card: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					head: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					headphone: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					work: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					workphone: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					opentime: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					housenumber: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					
				},
				// 编辑公司的表单验证规则
				editCompanyFormRules: {
					companyName: [{
						required: true,
						message: "请输入公司名",
						trigger: 'blur'
					}],
					companyStatus: [{
						required: true,
						message: "请选择状态",
						trigger: 'blur'
					}],
					companyBusiness: [{
						required: true,
						message: "请输入对接人",
						trigger: 'blur'
					}],
					companyLegal: [{
						required: true,
						message: "请输入法人",
						trigger: 'blur'
					}],
					companyAddress: [{
						required: true,
						message: "请输入办公地址",
						trigger: 'blur'
					}],
				},

				// 添加公司表单的状态选项
				status: [{
					value: '运营中',
					label: '运营中'
				}, {
					value: '已注销',
					label: '已注销'
				}],

				// 编辑公司对话框数据
				// 编辑公司对话框显示与隐藏
				editDialogVisible: false,
				editCompanyForm: {},

			}
		},
		beforeCreate() {

		},
		created() {
			// this.myHeaders.satoken = window.sessionStorage.getItem('satoken')
			// console.log(this.myHeaders)
			this.getCompanyList()
		},
		mounted() {

		},
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
			// 根据分页查询列表
			async getCompanyList() {
				const {
					data: res
				} = await this.$http.get('base/company/list', {
					params: this.queryInfo
				})
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.companylist = res.result.records
				this.total = res.result.total
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getCompanyList()
			},

			// 页码值改变事件
			handleCurrentChange(pageNo) {
				this.queryInfo.pageNo = pageNo
				this.getCompanyList()
			},

			//点击查看放大图片
			handleClickImage(src) {
				this.srcList = []
				this.srcList.push(src)
			},
			// 点击查询按钮
			handleQueryBtn() {
				this.queryInfo.name = "*" + this.queryInfo.companyName + "*"
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getCompanyList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.companyName = ''
				this.queryInfo.name = ''
				this.getCompanyList()
			},

			// 创建对话框操作

			// 添加营业执照成功
			handleBusinessSuccess(response, file, fileList) {
				// console.log(response)
				this.addForm.business = response.result.businessFileName

			},
			handleTransportSuccess(response, file, fileList) {
				// console.log(response)
				this.addForm.permit = response.result.transportFileName

			},

			// 修改营业执照成功
			handleEditBusinessSuccess(response, file, fileList) {
				this.editCompanyForm.business = response.result.businessFileName
				// console.log(this.addCompanyForm.business)
			},
			handleEditTransportSuccess(response, file, fileList) {
				this.editCompanyForm.permit = response.result.transportFileName
				// console.log(this.addCompanyForm.permit)
			},

			// 点击按钮，展示添加对话框
			showAddDialog() {
				this.addDialogVisible = true
			},

			// 点击确定按钮，添加新的分类
			addCompany() {
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					const {
						data: res
					} = await this.$http.post('base/company/add', this.addForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.$message.success(res.message)
					this.getCompanyList()
					this.addDialogVisible = false
				})
			},

			// 监听对话框的关闭事件，重置表单数据
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
				this.addForm.business = ''
				this.addForm.permit = ''
			},

			// 编辑对话框操作	
			// 展示编辑公司的对话框
			async showEditDialog(id) {
				const {
					data: res
				} = await this.$http.get('base/company/selectOne?companyId=' + id)
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.editCompanyForm = res.result
				// 显示对话框
				this.editDialogVisible = true
			},
			// 监听修改用户对话框关闭事件
			editCompanyDialogClosed() {
				this.$refs.editCompanyFormRef.resetFields()
			},
			// 修改公司信息并提交
			editCompanyInfo() {
				this.$refs.editCompanyFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改用户信息的数据请求
					const {
						data: res
					} = await this.$http.post('base/company/edit', this.editCompanyForm)

					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getCompanyList()
					this.$message.success(res.message)
				})
			},

			// 删除按钮
			async removeById(id) {
				const {
					data: res
				} = await this.$http.get('base/company/deleteById?companyId=' + id)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// 删除成功，刷新数据列表，提示删除成功
				this.getCompanyList()
				this.$message.success(res.message)
			},


		}
	}
</script>

<style scoped>
	.box-card {
		margin-top: 10px
	}
</style>
