<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>压车数据</el-breadcrumb-item>
		</el-breadcrumb>
		
		<el-card class="box-card" v-loading.fullscreen.lock="fullscreenLoading">

			<el-input v-model="provinceNew" placeholder="省" clearable style="width: 200px;"></el-input>
			<el-input v-model="cityNew" placeholder="市" clearable style="width: 200px;margin-left: 30px;"></el-input>
			<el-input v-model="areaNew" placeholder="区" clearable style="width: 200px;margin-left: 30px;"></el-input>
			<el-input v-model="numberNew" placeholder="压车次数" clearable style="width: 200px;margin-left: 30px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
		<div style="margin-top: 8px;">
		<el-button type="primary" plain @click="allExportBtn">导出全部</el-button>
		</div>
		
			<el-table :data="carlist" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @sort-change="sortChange">
				<el-table-column  v-if="false" prop="id" label="id">
				</el-table-column>
				<el-table-column prop="province" label="省" >
				</el-table-column>
				<el-table-column prop="city" label="市" >
				</el-table-column>
				<el-table-column prop="area" label="区" >
				</el-table-column>
				<el-table-column prop="number" label="压车次数" sortable="custom">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.number-0 >= 10?'red':'black'}">{{scope.row.number}}</span>
					</template>
				</el-table-column>
				
				<!-- <el-table-column label="操作" width="200" fixed="right">
					<template slot-scope="scope">
						<el-button type="primary" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>		
						<el-popconfirm title="确定删除吗？" @confirm="removeById(scope.row.id)" style="margin-left: 10px;">
							<el-button type="danger" size="mini" slot="reference">删除</el-button>
						</el-popconfirm>
					</template>
				</el-table-column> -->
			</el-table>
		</el-card>
		<!-- 分页区域 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
		 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total" style="margin-top: 5px;">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				// 遮罩层
				fullscreenLoading:false,
				// 查询参数对象
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "number",
					province:'',
					city:'',
					area:'',
					number:'',
				},
				// 公司列表
				carlist: [],
				total: 0,
				//查询的数据
				provinceNew:'',
				cityNew:'',
				areaNew:'',
				numberNew:'',
			}
		},
		created() {
			this.getCarList()
		},
		methods:{
			// 排序
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
				this.getCarList();
			},
			// 根据分页查询列表
			async getCarList() {
				const {
					data: res
				} = await this.$http.get('yache/list', {
					params: this.queryInfo
				})
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.carlist = res.result.records
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
			
			// 点击查询按钮
			handleQueryBtn() {
				this.queryInfo.province = "*" + this.provinceNew + "*"
				this.queryInfo.city = "*" + this.cityNew + "*"
				this.queryInfo.area = "*" + this.areaNew + "*"
				if(this.numberNew){
					this.queryInfo.number =  this.numberNew-0 
				}
				
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getCarList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.province = ''
				this.queryInfo.city = ''
				this.queryInfo.number = ''
				this.queryInfo.area = ''
				this.queryInfo.order = 'desc'
				this.queryInfo.column = 'number'
				this.provinceNew = ''
				this.cityNew = ''
				this.areaNew = ''
				this.numberNew = ''
				this.getCarList()
			},
			// 
			async allExportBtn() {
				this.fullscreenLoading = true;
				let url = this.$baseUploadUrl+'/yache/yachedaochu?province=' + this.provinceNew + '&city=' + this.cityNew + '&area=' + this.areaNew + '&number=' + this.numberNew 
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
						a.download = "压车数据报表.xlsx" // 文件名
						a.click()
						window.URL.revokeObjectURL(url)
						a.remove()
						that.fullscreenLoading = false;
					}
				xhr.send();
			},
		}
		
	}
</script>

<style scoped>

</style>