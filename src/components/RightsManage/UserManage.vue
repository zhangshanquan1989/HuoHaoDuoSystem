<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<el-input v-model="queryInfo.usernameNew" placeholder="姓名" clearable style="width: 200px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 50px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			<el-table :data="dataList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="id" label="ID" width="200">
				</el-table-column>
				<el-table-column prop="company" label="公司" width="400">
				</el-table-column>
				<el-table-column prop="username" label="姓名" width="200">
				</el-table-column>
				<el-table-column label="操作" >
					<template slot-scope="scope">
						<!-- 角色分配按钮 -->
						<el-button type="primary" size="mini" @click="showRoleDialog(scope.row.id)" style="margin-left: 15px;">分配角色</el-button>
						<!-- 分配部门或者小组 v-for -->
						<el-button type="primary" size="mini" @click="showAddDepartDialog(scope.row.id)" style="margin-left: 15px;">分配组织</el-button>
						<!-- 分配部门或者小组 -->
						<el-button type="primary" size="mini" @click="showDelDepartDialog(scope.row.id)" style="margin-left: 15px;">组织详情</el-button>
						<!-- 删除按钮 -->
						<!-- <el-popconfirm title="确定删除吗？" @confirm="removeById(scope.row.id)" style="margin-left: 10px;">
							<el-button type="danger" size="mini" slot="reference">删除</el-button>
						</el-popconfirm> -->
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
		
		<!-- 分配角色 -->
		<el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="35%" @close="roleDialogClosed">
			<el-radio v-for="item in roleData" v-model="roleAddData.roleid" :label="item.id" :key="item.index" @change="groupchange">{{item.roleName}}</el-radio>
			<!-- 首版，复选框，传递给后端多个角色的id，已废弃 -->
			<!-- <el-checkbox-group v-model="roleGroupList" @change="groupchange">
				<el-checkbox v-for="value in roleData" :label="value.roleName" @change="boxchange(value.id)"></el-checkbox>
			</el-checkbox-group> -->
			<span slot="footer" class="dialog-footer">
				<el-button @click="roleDialogVisible = false">关 闭</el-button>
				<el-button type="primary" @click="handleRoleChoose">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 分配部门dialog -->
		<el-dialog title="分配部门/小组" :visible.sync="departAddDialogVisible" width="35%" @close="departDialogClosed">
							<el-select v-model="userAddDepartData.addDepart" clearable filterable placeholder="部门" @change="addDepartNameChange" style="margin-left: 20px;">
								<el-option v-for="item in allDepartOptions" :key="item.index" :label="item.label" :value="item.value" >
								</el-option>
							</el-select>
							<el-select v-model="userAddDepartData.addGroup" clearable filterable placeholder="小组" @change="addGroupNameChange" style="margin-left: 20px;">
								<el-option v-for="item in allGroupOptions" :key="item.index" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
			<span slot="footer" class="dialog-footer">
				<el-button @click="departAddDialogVisible = false">关 闭</el-button>
				<el-button type="primary" @click="handleAddDepartChoose">确 定</el-button>
			</span>
		</el-dialog>
		
		<!-- 删除部门dialog -->
		<el-dialog title="部门/小组详情" :visible.sync="departDelDialogVisible" width="40%" @close="departDelDialogClosed">
			<el-table :data="userDepartData" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
					<el-table-column type="index" width="50"></el-table-column>
					<el-table-column v-if="false" prop="id" label="id">
					</el-table-column>
					<el-table-column prop="name" label="部门/小组">
					</el-table-column>
		
					<el-table-column fixed="right" label="操作">
						<template slot-scope="scope">
							<el-popconfirm title="确定删除吗？" @confirm="deleteOneData(scope.row.id)" style="margin-left: 10px;">
								<el-button type="danger" size="mini" slot="reference">删除</el-button>
							</el-popconfirm>
							<!-- <el-button @click="deleteOneData(scope.row.id)">删除</el-button> -->
						</template>
					</el-table-column>
				</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="departDelDialogVisible = false">关 闭</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 查询数据
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id",
					username:'',
					usernameNew:'',
				},
				// 分页列表
				dataList: [],
				// 总条数
				total: 0,
				// 角色分配dialog
				roleDialogVisible: false,
				// 所有的角色数据
				roleData: [],
				// 复选框的组数据 首版，复选框，传递给后端多个角色的id，已废弃
				roleGroupList: [],
				// 添加角色的数据
				roleAddData:{
					"roleid": '',
					"userid": '',
					// 首版，复选框，传递给后端多个角色的id，已废弃
					// "roleidlist":[]
				},
				// 给用户添加部门分配的dialog
				departAddDialogVisible:false,
				userAddDepartData:{
					addDepart:'',
					addGroup:'',
					organizationid:'',
					userid:'',
				},
				// 给用户删除部门/小组数据
				// 当前详情页的用户id
				nowUserId:'',
				departDelDialogVisible:false,
				deleteOrganizationData:{
					userid:'',
					organizationid:''
				},
				// 添加部门/小组的数据
				departAddData:{
					"userid": '',
					"roleidlist":[]
				},
				// 所有部门
				allDepartOptions:[],
				// 所有小组
				allGroupOptions:[],
				// 类似于详情的用户部门数据
				userDepartData:[],
			}
		},
		created() {
			this.queryInfo.company = window.sessionStorage.getItem('company')
			this.getDataList()
			this.getAllRole()
			this.getAllDepart()
		},
		methods: {
			// 获取与此账号相同公司的用户
			async getDataList() {
				const {
					data: res
				} = await this.$http.get('kuser/user', {
					params: this.queryInfo
				})
				// console.log(res)
				if (res.code !== 200) {
					return
				}
				this.dataList = res.result.records
				this.total = res.result.total
				// console.log(this.dataList)
			},
			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getDataList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getDataList()
			},

			// 点击角色分配,获取当前用户的角色
			async showRoleDialog(userid) {
				this.roleAddData.userid = userid
				const {data:res} = await this.$http.get('krole/querrole?id='+userid)
				// console.log(res)
				// 新版，仅需传递给后端一个角色id值
				if(res.result.length!==0){
					this.roleAddData.roleid = res.result[0].id
				}
				
				// 首版，复选框，需要传递给后端多个角色的id，已废弃
				// res.result.forEach(v => {
				// 	this.roleGroupList.push(v.roleName)
				// 	this.roleAddData.roleid.push(v.id)
				// })
				// console.log(this.roleGroupList)
				this.roleDialogVisible = true
				
			},			

			// dialog关闭
			roleDialogClosed() {
				this.roleAddData.userid = ''
				this.roleAddData.roleid = ''
				// 首版，复选框，传递给后端多个角色的id，已废弃
				// this.roleAddData.roleidlist = []
				this.roleGroupList = []
			},

			// 获取所有角色 不明白后端为啥要分页！！！
			async getAllRole() {
				const {
					data: res
				} = await this.$http.get('krole/list?pageSize=100&pageNo=1')
				// console.log('角色',res)
				this.roleData = res.result.records
			},

			groupchange(e) {
				// console.log('g', e)
			},
			// 选择的角色变化
			// 首版，复选框，传递给后端多个角色的id，已废弃
			// boxchange(id) {
			// 	if(this.roleAddData.roleidlist.indexOf(id)==-1){
			// 	        this.roleAddData.roleidlist.push(id)
			// 	    }else{
			// 	        this.roleAddData.roleidlist.splice(this.roleAddData.roleidlist.indexOf(id), 1); 
			// 	    }
			// 			console.log(this.roleAddData.roleidlist)
			// },
			// 添加角色
			async handleRoleChoose(){
				const {data:res} = await this.$http.post('k_user_role/add',this.roleAddData)
				// console.log(res)
				this.roleDialogVisible = false
			},
			
			// 点击添加部门分配
			async showAddDepartDialog(userid) {
				this.userAddDepartData.userid = userid
				this.departAddDialogVisible = true				
			},
			
			// 获取用户所属的部门小组
			async getUserOrganization(userId){
				const {data:res} = await this.$http.get('k_organization_user/Teamall?id='+userId)
				// console.log(res)
				this.userDepartData = res.result
			},
			
			// 点击组织详情页
			async showDelDepartDialog(userId){
				this.deleteOrganizationData.userid = userId
				this.nowUserId = userId
				this.getUserOrganization(this.nowUserId)
				this.departDelDialogVisible = true
			},
			// 添加部门关闭
			departDialogClosed(){
				this.userAddDepartData.addDepart = ''
				this.userAddDepartData.addGroup = ''
				this.userAddDepartData.organizationid = ''
				this.userAddDepartData.userid = ''
			},
			// 组织详情关闭
			departDelDialogClosed(){
				this.nowUserId = ''
				this.deleteOrganizationData.userid = ''
				this.deleteOrganizationData.organizationid = ''
			},
			// 确认添加
			async handleAddDepartChoose(){
				const {data:res} = await this.$http.post('k_organization_user/add',this.userAddDepartData)
				// console.log(res)
				this.departAddDialogVisible = false
			},
			
			// 删除部门/小组
			async deleteOneData(id) {
				this.deleteOrganizationData.organizationid = id
				const {data:res} = await this.$http.post('k_organization_user/delete',this.deleteOrganizationData)
				// console.log(res)
				this.getUserOrganization(this.nowUserId)
			},

				// 选择部门 
				async addDepartNameChange(departId){
					// console.log(departId)
					this.userAddDepartData.organizationid = departId
					// console.log(index)
					this.userAddDepartData.addGroup = ''
					if (departId !== '') {
						const {
							data: res
						} = await this.$http.get('k_organization/Team?id=' + departId)
						// console.log(res)
						if (res.code !== 200) {
							return this.$message.error(res.message)
						}						
						this.allGroupOptions = res.result.map(item => {
							return {
								value: `${item.id}`,
								label: `${item.name}`
							};				
						});
					}else{
						this.userAddDepartData.addGroup = ''
					}
				},
				// 选择小组
				addGroupNameChange(groupId){
					this.userAddDepartData.organizationid = groupId
				},
				// 获取所有部门
				async getAllDepart() {
					const companyName = window.sessionStorage.getItem('company')
					const {
						data: res
					} = await this.$http.get('k_organization/Departments?company=' + companyName)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.allDepartOptions = res.result.map(item => {
						return {
							value: `${item.id}`,
							label: `${item.name}`
						};				
					});
				},
				
				// 点击查询按钮
				handleQueryBtn() {
					this.queryInfo.pageNo = 1
					this.queryInfo.pageSize = 10
					this.queryInfo.username = "*" + this.queryInfo.usernameNew + "*"				
					this.getDataList()
				},
				// 返回按钮
				handleQueryBackBtn() {
					this.queryInfo.pageNo = 1
					this.queryInfo.pageSize = 10
					this.queryInfo.username = ''
					this.queryInfo.usernameNew = ''
					this.getDataList()
				},
				
		}
	}
</script>

<style scoped>

</style>
