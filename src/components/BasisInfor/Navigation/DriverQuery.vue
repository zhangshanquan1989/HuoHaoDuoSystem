<template>
	<div>
		<!-- 司机信息页面 -->
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>司机信息</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<!-- 创建司机  el-select-->
			<el-button type="primary" plain @click="addDialogVisible = true">创建</el-button>
			<el-input v-model="queryInfo.driverName" placeholder="司机名" clearable style="width: 200px;margin-left: 100px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			
			<el-table :data="driverList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="id" label="id" v-if="false">
				</el-table-column>
				<el-table-column prop="name" label="司机姓名" width="150px">
				</el-table-column>
				<el-table-column prop="phoneno" label="手机号码" width="150px">
				</el-table-column>
				<el-table-column prop="company" label="所属分公司" width="250px">
				</el-table-column>
				<el-table-column prop="joinDate" label="加入日期" width="150px">
				</el-table-column>
				<el-table-column prop="region" label="地区" width="200px">
				</el-table-column>
				<el-table-column prop="licensePlate" label="对应车辆" width="150px">
				</el-table-column>
				<!-- <el-table-column prop="userid" label="身份证" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
						<el-image style="width: 80px; height: 40px" :src="scope.row.userid" :preview-src-list="srcList" @click="handleClickImage(scope.row.userid)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column> -->
				<!-- <el-table-column prop="drivingLicense" label="驾驶证" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
						<el-image style="width: 80px; height: 40px" :src="scope.row.drivingLicense" :preview-src-list="srcList" @click="handleClickImage(scope.row.drivingLicense)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column> -->
				<el-table-column prop="drivingLicenseTime" label="驾驶证有效期" width="150px">
				</el-table-column>
				<!-- <el-table-column prop="workLicense" label="上岗证" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
						<el-image style="width: 80px; height: 40px" :src="scope.row.workLicense" :preview-src-list="srcList" @click="handleClickImage(scope.row.workLicense)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column> -->
				<el-table-column prop="worklicensedate" label="上岗证有效期" width="150px">
					</el-table-column>
				<el-table-column prop="createuser" label="创建人" width="150px">
				</el-table-column>
				<el-table-column prop="ctTime" label="创建时间" width="180px">
				</el-table-column>
				<el-table-column prop="utTime" label="最近更新时间" width="180px">
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
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 5px;">
			</el-pagination>
		</el-col>

		<!-- 创建的对话框 -->
		<el-dialog title="创建司机信息" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed" :close-on-click-modal="false">
			<!-- 创建的表单 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
				<el-form-item label="司机姓名:" prop="name">
					<el-input v-model="addForm.name" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="手机号码:" prop="phoneno">
					<el-input v-model="addForm.phoneno" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="所属分公司" prop="company">
					<el-select v-model="addForm.company" clearable filterable remote placeholder="请输入公司名称" :remote-method="remoteCompanyMethod"	 :loading="companyLoading" @change="companyChange" style="width: 300px;">
						<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="加入日期" prop="joinDate">
					<el-date-picker v-model="addForm.joinDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 300px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="地区" prop="region">
					<el-input v-model="addForm.region" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="对应车辆" prop="licensePlate">
					<el-select v-model="addForm.licensePlate" clearable filterable remote placeholder="请输入车牌号" :remote-method="remotePlateNumberMethod"	 :loading="plateNumberLoading" style="width: 300px;" @change="queryPlateNumberChange">
						<el-option v-for="item in plateNumberOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="身份证A" prop="userid">
					<el-image v-if="addForm.userid" style="width: 150px;" :src="addForm.userid" :preview-src-list="srcList" @click="handleClickImage(addForm.userid)"></el-image>
					<el-upload name="imgFile" :action="updateUserIdUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleUserIdUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传身份证A</el-button>
					</el-upload>
				</el-form-item>
				
				<el-form-item label="身份证B" prop="userida">
					<el-image v-if="addForm.userida" style="width: 150px;" :src="addForm.userida" :preview-src-list="srcList" @click="handleClickImage(addForm.userida)"></el-image>
					<el-upload name="imgFile" :action="updateUseridaUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleUseridaUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传身份证B</el-button>
					</el-upload>
				</el-form-item>
				
				<el-form-item label="驾驶证A" prop="drivingLicense">
					<el-image v-if="addForm.drivingLicense" style="width: 150px;" :src="addForm.drivingLicense" :preview-src-list="srcList" @click="handleClickImage(addForm.drivingLicense)"></el-image>
					<el-upload name="imgFile" :action="updateDrivingLicenseUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleDrivingLicenseUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传驾驶证A</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="驾驶证B" prop="drivingLicensea">
					<el-image v-if="addForm.drivingLicensea" style="width: 150px;" :src="addForm.drivingLicensea" :preview-src-list="srcList" @click="handleClickImage(addForm.drivingLicensea)"></el-image>
					<el-upload name="imgFile" :action="updateDrivingLicenseaUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleDrivingLicenseaUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传驾驶证B</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="驾驶证有效期" prop="drivingLicenseTime">
					<el-date-picker v-model="addForm.drivingLicenseTime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 300px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="上岗证" prop="workLicense">
					<el-image v-if="addForm.workLicense" style="width: 150px;" :src="addForm.workLicense" :preview-src-list="srcList" @click="handleClickImage(addForm.workLicense)"></el-image>
					<el-upload name="imgFile" :action="updateWorkLicenseUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleWorkLicenseUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传上岗证</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="上岗证有效期" prop="worklicensedate">
					<el-date-picker v-model="addForm.worklicensedate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"	 value-format="yyyy-MM-dd" style="width: 300px;">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<!-- 操作区域 -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addInfo">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 编辑的对话框 -->
		<el-dialog title="编辑司机信息" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed" :close-on-click-modal="false">
			<!-- 编辑的表单 -->
			<el-form :model="editForm" ref="editFormRef" label-width="120px">
				<el-form-item label="司机姓名:" prop="name">
					<el-input v-model="editForm.name" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="手机号码:" prop="phoneno">
					<el-input v-model="editForm.phoneno" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="所属分公司" prop="company">
					<el-select v-model="editForm.company" clearable filterable remote placeholder="请输入公司名称" :remote-method="remoteCompanyMethod"	 :loading="companyLoading" @change="companyChange" style="width: 300px;">
						<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="加入日期" prop="joinDate">
					<el-date-picker v-model="editForm.joinDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 300px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="地区" prop="region">
					<el-input v-model="editForm.region" style="width: 300px;"></el-input>
				</el-form-item>
				<el-form-item label="对应车辆" prop="licensePlate">
					<el-select v-model="editForm.licensePlate" clearable filterable remote placeholder="请输入车牌号" :remote-method="remotePlateNumberMethod" :loading="plateNumberLoading" style="width: 300px;" @change="queryPlateNumberChange">
						<el-option v-for="item in plateNumberOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="身份证A" prop="userid">
					<el-image v-if="editForm.userid" style="width: 150px;" :src="editForm.userid" :preview-src-list="srcList" @click="handleClickImage(editForm.userid)"></el-image>
					<el-upload name="imgFile" :action="updateUserIdUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditUserIdUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传身份证A</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="身份证B" prop="userida">
					<el-image v-if="editForm.userida" style="width: 150px;" :src="editForm.userida" :preview-src-list="srcList" @click="handleClickImage(editForm.userida)"></el-image>
					<el-upload name="imgFile" :action="updateUseridaUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditUseridaUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传身份证B</el-button>
					</el-upload>
				</el-form-item>
				
				<el-form-item label="驾驶证A" prop="drivingLicense">
					<el-image v-if="editForm.drivingLicense" style="width: 150px;" :src="editForm.drivingLicense" :preview-src-list="srcList" @click="handleClickImage(editForm.drivingLicense)"></el-image>
					<el-upload name="imgFile" :action="updateDrivingLicenseUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditDrivingLicenseUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传驾驶证A</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="驾驶证B" prop="drivingLicensea">
					<el-image v-if="editForm.drivingLicensea" style="width: 150px;" :src="editForm.drivingLicensea" :preview-src-list="srcList" @click="handleClickImage(editForm.drivingLicensea)"></el-image>
					<el-upload name="imgFile" :action="updateDrivingLicenseaUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditDrivingLicenseaUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传驾驶证B</el-button>
					</el-upload>
				</el-form-item>
				
				<el-form-item label="驾驶证有效期" prop="drivingLicenseTime">
					<el-date-picker v-model="editForm.drivingLicenseTime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 300px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="上岗证" prop="workLicense">
					<el-image v-if="editForm.workLicense" style="width: 150px;" :src="editForm.workLicense" :preview-src-list="srcList" @click="handleClickImage(editForm.workLicense)"></el-image>
					<el-upload name="imgFile" :action="updateWorkLicenseUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditWorkLicenseUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传上岗证</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="上岗证有效期" prop="drivingLicenseTime">
					<el-date-picker v-model="editForm.worklicensedate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 300px;">
					</el-date-picker>
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
				// 大图列表
				srcList:[],
				// 创建对话框显示
				addDialogVisible: false,
				// 创建
				addForm: {
					name: "",
					phoneno: "",
					company: "",
					joinDate: "",
					region: "",
					licensePlate: "",
					userid: "",
					userida: "",
					drivingLicense: "",
					drivingLicensea: "",
					drivingLicenseTime: "",
					workLicense: "",
				},
				// 添加的表单验证规则
				addFormRules: {
					name: [{
						required: true,
						message: "请输入姓名",
						trigger: 'blur'
					}],
					drivingLicenseTime: [{
						required: true,
						message: "请选择日期",
						trigger: 'blur'
					}],
					worklicensedate: [{
						required: true,
						message: "请选择日期",
						trigger: 'blur'
					}],
					
				},
				// 分页查询数据
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id"
				},
				// 分页列表
				driverList: [],
				total: 0,			
				// 上传身份证URL
				updateUserIdUrl: "http://81.70.151.121:8080/jeecg-boot/kDriver/uploadImageUserid",
				updateDrivingLicenseUrl: "http://81.70.151.121:8080/jeecg-boot/kDriver/uploadImageDriver",
				updateWorkLicenseUrl: "http://81.70.151.121:8080/jeecg-boot/kDriver/uploadImagePostCard",
				// 身份证B上传接口
				updateUseridaUrl: "http://81.70.151.121:8080/jeecg-boot/kDriver/uploadImageUseridA",
				// 驾驶证B
				updateDrivingLicenseaUrl: "http://81.70.151.121:8080/jeecg-boot/kDriver/uploadImageDriverA",
				// 编辑数据
				editDialogVisible:false,
				editForm:{},
				
				// 公司选择框数据
				queryCompanyName: '',
				companyOptions: [],
				companyList: [],
				companyLoading: false,
				companyStates: [],
				
				// 选择车牌数据
				queryPlateNumber: '',
				plateNumberLoading: false,
				plateNumberOptions: [],
				plateNumberStates: [],
				plateNumberList: [],
				newPlateNumberList: [],
				newPlateNumberStates: [],
			}
		},
		created() {
			this.getDriverList()
			this.getAllCompanyList()
			this.getAllPlateNumberList()
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
			// 公司变化
			companyChange(e){
				if(!e){
					this.companyOptions = this.companyList
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
			
			// 选择车牌号
			queryPlateNumberChange(e) {
				// console.log(this.queryPlateNumber)
				if(!e){
					this.plateNumberOptions = this.plateNumberList
				}
				
			},
			
			
			// 根据分页查询列表
			async getDriverList() {
				const {
					data: res
				} = await this.$http.get('kDriver/list', {
					params: this.queryInfo
				})
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// this.$message.success('获取信息成功')
				this.driverList = res.result.records
				this.total = res.result.total
				// console.log(this.driverList)
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
			
			// 点击查询按钮
			handleQueryBtn() {
				this.queryInfo.name = "*" + this.queryInfo.driverName + "*"
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getDriverList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.driverName = ''
				this.queryInfo.name = ''
				this.getDriverList()
			},
			
			//点击查看放大图片
			handleClickImage(src) {
				this.srcList= []
				this.srcList.push(src)
			},

			// 创建图片上传成功的回调
			handleUserIdUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.addForm.userid = response.result.UseridFileName
			},
			handleDrivingLicenseUrlSuccess(response, file, fileList) {
				// console.log('驾照A',response)
				this.addForm.drivingLicense = response.result.DriverFileName
			},
			handleWorkLicenseUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.addForm.workLicense = response.result.PostCardFileName
			},
			handleUseridaUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.addForm.userida = response.result.UseridFileNameA
			},
			handleDrivingLicenseaUrlSuccess(response, file, fileList) {
				// console.log('驾照B',response)
				this.addForm.drivingLicensea = response.result.DriverFileNameA
			},

			// 创建对话框
			addInfo() {
				// console.log(this.addForm)
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					// 发起添加信息的数据请求
					const {
						data: res
					} = await this.$http.post('kDriver/add', this.addForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 添加成功，关闭对话框，刷新数据列表，提示添加成功
					this.addDialogVisible = false
					this.getDriverList()
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
				} = await this.$http.get('kDriver/list?id=' + id)
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.editForm = res.result.records[0]
				// this.editContractData.push(res.result.driverStartContractPeriod)
				// this.editContractData.push(res.result.driverEndContractPeriod)
				// this.editContractData.join(',')
				// console.log(this.editContractData)
				// 显示对话框
				this.editDialogVisible = true
			},
			
			// 编辑图片上传成功的回调
			handleEditUserIdUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.editForm.userid = response.result.UseridFileName
			},
			handleEditDrivingLicenseUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.editForm.drivingLicense = response.result.DriverFileName
			},
			handleEditWorkLicenseUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.editForm.workLicense = response.result.PostCardFileName
			},
			handleEditUseridaUrlSuccess(response, file, fileList) {
				console.log('editForm.userida',response)
				this.editForm.userida = response.result.UseridFileNameA
			},
			handleEditDrivingLicenseaUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.editForm.drivingLicensea = response.result.DriverFileNameA
			},

			// 监听修改用户对话框关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},

			// 修改信息并提交
			editInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.post('kDriver/edit', this.editForm)

					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getDriverList()
					this.$message.success(res.message)
				})
			},

			// 删除操作
			async removeById(id) {
				const {
					data: res
				} = await this.$http.get('kDriver/deleteById?id=' + id)

				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// 删除成功，刷新数据列表，提示删除成功
				this.getDriverList()
				this.$message.success(res.message)
			},
		}
	}
</script>

<style scoped>

</style>
