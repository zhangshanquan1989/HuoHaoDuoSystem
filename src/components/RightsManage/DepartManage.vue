<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>部门管理</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<div>
				<el-button type="primary" plain @click="addDepartDialogVisible = true">添加部门</el-button>
				<el-button type="primary" plain style="margin-left: 20px;" @click="handleAddGroupDialog">添加小组</el-button>
			</div>

			<el-table :data="dataList" border stripe style="width: 100%;margin-bottom: 20px;margin-top: 20px;" row-key="menutype" :tree-props="{children: 'department', hasChildren: 'hasChildren'}" :row-style="{height:'50px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column v-if="false" prop="id" label="id" >
				</el-table-column>
				<el-table-column type="index" width="200"></el-table-column>
				<el-table-column prop="name" label="公司" width="600">
					 <template slot-scope="scope">
						 <el-image style="width: 18px; height: 18px;margin-left: 10px;" :src="require('./icon-1.png')"></el-image>
						 <span style="margin-left: 5px;">{{scope.row.name}}</span>
					 </template>
				</el-table-column>
				<el-table-column label="操作" >
					<template slot-scope="scope">
						<!-- 删除按钮 -->
						<el-popconfirm title="确定删除吗？" v-if="scope.row.tag?true:false" @confirm="removeById(scope.row.id)" style="margin-left: 10px;">
							<el-button type="danger" size="mini" slot="reference">删除</el-button>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 添加部门 -->
		<el-dialog title="添加部门" :visible.sync="addDepartDialogVisible" width="35%" @close="addDepartDialogClosed">
			<el-form ref="addDepartRef" :model="addDepartForm" label-width="100px">
				<el-form-item label="部门名称">
					<el-input v-model="addDepartForm.name" style="width: 440px;"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDepartDialogVisible = false">关 闭</el-button>
				<el-button type="primary" @click="handleAddDepart">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 添加小组 -->
		<el-dialog title="添加小组" :visible.sync="addGroupDialogVisible" width="50%" @close="addGroupDialogClosed">
			<el-form ref="addGroupRef" :model="addGroupForm" label-width="100px">
				<el-form-item label="小组名称">
					<el-input v-model="addGroupForm.name" style="width: 440px;"></el-input>
				</el-form-item>
				<el-form-item label="所属部门">
					<el-select v-model="addGroupForm.pid" placeholder="请选择" @change="change">
						<el-option v-for="item in allDepartOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="addGroupDialogVisible = false">关 闭</el-button>
				<el-button type="primary" @click="handleAddGroup">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 添加部门dialog
				addDepartDialogVisible: false,
				addDepartForm: {
					name: '',
					type: '部门',
					pid: ''
				},
				// 添加小组
				addGroupDialogVisible: false,
				addGroupForm: {
					name: '',
					type: '小组',
					pid: ''
				},
				// 所有部门
				allDepartOptions: [],
				dataList: [],
			}
		},
		created() {
			this.getDataList();
			this.getAllDepart();
		},
		methods: {
			// 获取与此账号相同公司的用户
			async getDataList() {
				const {
					data: res
				} = await this.$http.get('k_organization/Department')
				// console.log(res)
				if (res.code !== 200) {
					return
				}
				this.dataList = res.result
				this.total = res.result.total
			},

			// 添加部门
			handleAddDepart() {
				this.addDepartForm.pid = window.sessionStorage.getItem('companyId')
				this.$refs.addDepartRef.validate(async valid => {
					if (!valid) return
					// 发起添加信息的数据请求
					const {
						data: res
					} = await this.$http.post('k_organization/add', this.addDepartForm)
					// console.log(res)
					this.addDepartDialogVisible = false
					this.getDataList();
				})
			},
			addDepartDialogClosed() {
				this.$refs.addDepartForm.resetFields()
				this.addDepartForm.name = ''
				this.addDepartForm.type = '部门'
				this.addDepartForm.pid = ''				
			},
			// 点击添加小组
			handleAddGroupDialog(){
				this.getAllDepart();
				this.addGroupDialogVisible = true
			},

			// 添加小组dialog
			handleAddGroup() {
				this.$refs.addGroupRef.validate(async valid => {
					if (!valid) return
					// 发起添加信息的数据请求
					const {
						data: res
					} = await this.$http.post('k_organization/add', this.addGroupForm)
					// console.log(res)
					this.addGroupDialogVisible = false
					this.getDataList();
					})
			},

			// 获取所有部门
			async getAllDepart() {
				const companyName = window.sessionStorage.getItem('company')
				const {
					data: res
				} = await this.$http.get('k_organization/Departments?company=' + companyName)
				// console.log(res)
				if (res.code !== 200) {
					return
				}
				// res.result.forEach(v => {
				//      this.companyStates.push(v.name)
				// })
				// console.log(this.companyStates)
				this.allDepartOptions = res.result.map(item => {
					return {
						value: `${item.id}`,
						label: `${item.name}`
					};

				});
				// console.log(this.allDepartList)
				// this.companyOptions = this.companyList
			},

			// 添加小组的dialog关闭事件
			addGroupDialogClosed() {
				this.$refs.addGroupRef.resetFields()
				this.addGroupForm.name = ''
				this.addGroupForm.type = '小组'
				this.addGroupForm.pid = ''
			},
			
			change(){
				// console.log(this.addGroupForm.pid)
			},
			// 删除
			async removeById(id){
				const {
					data: res
				} = await this.$http.get('k_organization/delete?id=' + id)
				// console.log(res)
				this.getDataList();
			},
			
		}
	}
</script>

<style scoped>
/deep/.el-icon-arrow-right:before {

content: "\e6d9";

}

/deep/.el-table__expand-icon--expanded .el-icon-arrow-right:before{

content: "\e6d8"!important;

}

/deep/.el-table__expand-icon--expanded {

-webkit-transform: rotate(0deg);

transform: rotate(0deg);

}

/deep/.el-table__expand-icon {

border: 1px solid #e7e7e7;

padding:1px;

}
</style>
