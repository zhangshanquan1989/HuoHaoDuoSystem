<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色管理</el-breadcrumb-item>
		</el-breadcrumb>
		
			<el-card class="box-card">
				<el-button type="primary" plain @click="addDialogVisible = true">添加角色</el-button>
				<el-table :data="dataList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
				 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
					<el-table-column prop="id" label="ID" width="200">
					</el-table-column>
					<el-table-column prop="roleName" label="角色名" width="500">
					</el-table-column>
					<el-table-column label="操作"  fixed="right">
						<template slot-scope="scope">
							<!-- 角色分配按钮 -->
							<el-button type="primary" size="mini" @click="showRoleDialog(scope.row.id)" style="margin-left: 15px;">角色权限详情</el-button>
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
			
			<!-- 添加角色 -->
			<el-dialog title="添加角色" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed">
				<el-form :model="addForm" ref="addFormRef"  label-width="100px">
					<el-form-item label="角色名称">
						<el-input v-model="addForm.roleName" style="width: 440px;"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="addDialogVisible = false">关 闭</el-button>
					<el-button type="primary" @click="handleAdd">确 定</el-button>
				</span>
			</el-dialog>
			
			<!-- 角色权限详情 -->
			<el-dialog title="角色权限详情" :visible.sync="roleDialogVisible" width="80%" @close="roleDialogClosed">
				<el-checkbox-group v-model="roleGroupList">
					<el-checkbox v-for="value in roleData" :label="value.permissions" @change="boxchange(value.id)"></el-checkbox>
				</el-checkbox-group>
				<span slot="footer" class="dialog-footer">
					<el-button @click="roleDialogVisible = false">关 闭</el-button>
					<el-button type="primary" @click="handleRoleChoose">确 定</el-button>
				</span>
			</el-dialog>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				// 查询数据
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id"
				},
				// 分页列表
				dataList: [],
				// 总条数
				total: 0,
				
				// 添加
				addDialogVisible:false,
				addForm: {
					roleName:''
				},
				// 所有权限
				roleData:[],
				// 分配对话框
				roleDialogVisible:false,
				// 多选框数据
				roleGroupList:[],
				// 编辑需要传递的数据
				roleAddData:{
					roleid:'',
					permissionsid:[]
				}
			}
		},
		created() {
			this.getDataList()
			this.getAllRole()
		},
		methods:{
			// 获取与此账号相同公司的用户
			async getDataList() {
				const {
					data: res
				} = await this.$http.get('krole/list', {
					params: this.queryInfo
				})
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.dataList = res.result.records
				this.total = res.result.total
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
			
			// 确认添加
			handleAdd(){
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					// 发起添加信息的数据请求
					const {
						data: res
					} = await this.$http.post('krole/add', this.addForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.addDialogVisible = false
					this.getDataList();
				})
			},
			
			// 添加页面关闭
			addDialogClosed(){
				this.$refs.addFormRef.resetFields()
				this.addForm.roleName = ''
			},
			
			// 获取所有权限
			async getAllRole() {
				const {
					data: res
				} = await this.$http.get('kpermissions/listall')
				// console.log('权限',res)
				this.roleData = res.result
			},
			
			// 角色详情
			async showRoleDialog(id){
				this.roleAddData.roleid = id
				const {data:res} = await this.$http.get('k_role_permissions/roleall?id='+id)
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				res.result.forEach(v => {
					this.roleGroupList.push(v.permissions)
					this.roleAddData.permissionsid.push(v.id)
				})
				this.roleDialogVisible = true
			},
			
			// 选择的角色变化groupchange
			boxchange(id) {
				if(this.roleAddData.permissionsid.indexOf(id)==-1){
				        this.roleAddData.permissionsid.push(id)
				    }else{
				        this.roleAddData.permissionsid.splice(this.roleAddData.permissionsid.indexOf(id), 1); 
				    }
						// console.log(this.roleAddData.permissionsid)
			},
			
			// 确认编辑
			async handleRoleChoose(){
				const {data:res} = await this.$http.post('k_role_permissions/add',this.roleAddData)
				// console.log(res)
				this.roleDialogVisible = false
			},
			
			// 分配关闭
			roleDialogClosed(){
				this.roleGroupList=[]
				this.roleAddData.roleid = ''
				this.roleAddData.permissionsid = []
			},
			
			// 删除
			async removeById(id){
				const {
					data: res
				} = await this.$http.get('krole/delete?id=' + id)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.getDataList();
			},
		}
	}
</script>

<style scoped>

</style>