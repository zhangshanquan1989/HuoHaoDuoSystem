<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单查询</el-breadcrumb-item>
			<el-breadcrumb-item>车辆考勤</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card" v-loading.fullscreen.lock="fullscreenLoading">
			<el-date-picker v-model="exportDate" type="daterange" range-separator="至" start-placeholder="导出的开始日期"
			 end-placeholder="导出的结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" @change="exportChange">
			</el-date-picker>
			<el-button type="primary" plain @click="allExportBtn" style="margin-left: 30px;">导出全部</el-button>
			<el-input v-model="queryInfo.chepai" placeholder="输入车牌号" clearable style="width: 200px;margin-left: 30px;"></el-input>
			<el-input v-model="queryInfo.dirver" placeholder="输入司机名" clearable style="width: 200px;margin-left: 30px;"></el-input>

			<el-button type="primary" plain icon="el-icon-search" style="margin-left: 30px;" @click="search">搜索</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>

			<el-table :data="dataList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="license" label="车牌号">
				</el-table-column>
				<el-table-column prop="name" label="司机名">
				</el-table-column>
				<el-table-column prop="attendance" label="车辆状态">
				</el-table-column>
				<el-table-column prop="staute" label="状态详情">
				</el-table-column>
				<el-table-column label="操作" fixed="right">
					<template slot-scope="scope">
						<!-- 详情按钮 -->
						<el-button type="primary" size="mini" @click="showDetailsDialog(scope.row.license)">详情</el-button>
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
			 :page-sizes="[10, 20, 50, 100]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" style="margin-top: 5px;">
			</el-pagination>
		</el-col>

		<!-- 考勤日历的对话框 -->
		<el-dialog class="dialog" title="考勤日历" :visible.sync="detailsDialogVisible" width="35%" @close="detailsDialogClosed" :close-on-click-modal="false">
			<el-calendar>
				<template slot="dateCell" slot-scope="{date, data}">
					<!-- <p :class="data.isSelected ? 'is-selected' : ''" @click="changeTime(date, data)">
				      {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
				    </p> -->
					<div @click="changeTime(date, data)">
						<div>
							{{ data.day.split('-').slice(1).join('-') }}
						</div>
						<div style="text-align: center;color: #409EFFFF;margin-top: 12px;">修改</div>
						<div v-for="item in calendarData">
							<div v-if="item.genggaitime == data.day">

								<div class="text" :style="{'color':item.attendance == '正常配货'?'#00BE3FFF':'#EC2941FF'}">{{item.attendance}}</div>
								<!-- <div class="text" :style="{'color':item.color}">{{item.attendance}}</div> -->

							</div>
						</div>
					</div>
				</template>
			</el-calendar>
			<span slot="footer" class="dialog-footer">
				<el-button @click="detailsDialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>

		<el-dialog class="dialog" title="考勤详情" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed" :close-on-click-modal="false">
			<el-form :model="editForm" ref="editFormRef" label-width="150px">
				<el-form-item label="车牌:" prop="license">
					<el-input disabled v-model="editForm.license" style="width: 75%;"></el-input>
				</el-form-item>
				<el-form-item label="日期:" prop="genggaitime">
					<el-input disabled v-model="editForm.genggaitime" style="width: 75%;"></el-input>
				</el-form-item>
				<el-form-item label="车辆状态:" prop="attendance">
					<el-select clearable v-model="editForm.attendance" placeholder="请选择" @change="attendanceChange" style="width: 75%;">
						<el-option v-for="item in attendOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态详情:" prop="staute">
					<el-select clearable v-model="editForm.staute" placeholder="请选择" style="width: 75%;">
						<el-option v-for="item in stauteOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="行驶距离(km):" prop="km">
					<el-input disabled v-model="editForm.km" style="width: 75%;"></el-input>
				</el-form-item>
				<el-form-item label="利润(元):" prop="lirun">
					<el-input disabled v-model="editForm.lirun" style="width: 75%;"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleEditForm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 查询参数对象
				queryInfo: {
					chepai: '',
					pageNo: 1,
					pageSize: 10,
				},
				dataList: [],
				total: 0,
				changeTimeInfo: {
					linence: '',
					dtime: '',
				},
				addForm: {},
				editForm: {},
				carList: [{
					num: '鲁FG980H'
				}],
				detailsDialogVisible: false,
				editDialogVisible: false,
				value: new Date(),
				calendarData: [],
				// 考勤状态
				attendOptions: [{
					value: '正常配货',
					label: '正常配货'
				}, {
					value: '未配货',
					label: '未配货'
				}],
				stauteOptions: [],
				// 导出的时间
				exportDate: [],
				// 导出所需数据
				allExportInfo: {
					begintime: '',
					finishtime: '',
				},
				// 遮罩层
				fullscreenLoading:false,
			}
		},
		created() {
			this.getDataList()
		},
		methods: {
			// 根据分页查询列表
			async getDataList() {
				const {
					data: res
				} = await this.$http.get('attendance/list', {
					params: this.queryInfo
				})
				// console.log(res)
				// if (res.code !== 200) {
				// 	return this.$message.error(res.message)
				// }
				// // this.$message.success('获取信息成功')
				this.dataList = res.rows
				this.total = res.total
				// // console.log(this.driverList)
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

			// 点击查询按钮
			search() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				// console.log(this.queryInfo)
				this.getDataList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.chepai = ''
				this.queryInfo.dirver = ''
				this.getDataList()
			},

			// 展示详情页面
			async showDetailsDialog(license) {
				this.changeTimeInfo.linence = license
				const {
					data: res
				} = await this.$http.get('attendance/findAllDate?linence=' + license)
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.calendarData = res.result
				this.detailsDialogVisible = true
			},
			addCompany() {},
			detailsDialogClosed() {},
			//点击天数
			async changeTime(date, data) {
				console.log(date, data);
				this.changeTimeInfo.dtime = data.day
				const {
					data: res
				} = await this.$http.get('attendance/findAllDate2', {
					params: this.changeTimeInfo
				})
				console.log(res)
				if (res.code !== 200) {
					// console.log('不是200')
					this.editForm.license = this.changeTimeInfo.linence
					this.editForm.genggaitime = this.changeTimeInfo.dtime
					this.editForm.dtime = this.changeTimeInfo.dtime
					this.editForm.km = 0
					this.editForm.lirun = 0
				} else {
					// console.log('是200')
					this.editForm = res.result
					this.editForm.dtime = res.result.genggaitime
				}

				this.editDialogVisible = true
			},
			// 点击修改确认按钮
			handleEditForm() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.post('attendance/update', this.editForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getDataList()
					this.showDetailsDialog(this.changeTimeInfo.linence)
				})
			},

			// 根据大状态修改小状态
			attendanceChange(e) {
				console.log(e)
				if (!e) {
					this.stauteOptions = []
				} else if (e == '正常配货') {
					this.stauteOptions = [{
							value: '指定路线',
							label: '指定路线'
						},
						{
							value: '2天利润',
							label: '2天利润'
						},
					]
				} else if (e == '未配货') {
					this.stauteOptions = [{
							value: '休息',
							label: '休息'
						},
						{
							value: '回家',
							label: '回家'
						},
						{
							value: '临时报停',
							label: '临时报停'
						},
						{
							value: '永久报停',
							label: '永久报停'
						},
						{
							value: '拒单停运',
							label: '拒单停运'
						},
						{
							value: '更换司机',
							label: '更换司机'
						},
						{
							value: '强制报停',
							label: '强制报停'
						},
						{
							value: '核酸检测',
							label: '核酸检测'
						},
						{
							value: '压车',
							label: '压车'
						},
						{
							value: '事故维修',
							label: '事故维修'
						},
						{
							value: '维修保养',
							label: '维修保养'
						},
					]
				}
			},
			editDialogClosed() {
				this.editForm = {}
			},
			exportChange(e) {
				// console.log(e)
				// this.exportDate = e
				// console.log(this.exportDate)
			},
			async allExportBtn() {
				if (!this.exportDate[0]) {
					return this.$message.warning('请选择时间段！')
				}
				this.allExportInfo.begintime = this.exportDate[0]
				this.allExportInfo.finishtime = this.exportDate[1]
				this.fullscreenLoading = true;
				let url = 'https://tkhhd.com/jeecg-boot/SumController/HHDkaoqinAll?begintime=' + this.allExportInfo.begintime + '&finishtime=' + this.allExportInfo.finishtime
				// let url = 'https://82.157.15.221:8080/jeecg-boot/SumController/HHDkaoqinAll?begintime=' + this.allExportInfo.begintime + '&finishtime=' + this.allExportInfo.finishtime
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
						a.download = "车辆考勤报表.xlsx" // 文件名
						a.click()
						window.URL.revokeObjectURL(url)
						a.remove()
						that.fullscreenLoading = false;
					}
				xhr.send();
				
				
				// !!!下面代码为location.href方法，不能携带token
				// const {
				// 	data: res
				// } = await this.$http.get('SumController/HHDkaoqinAll', {
				// 	params: this.allExportInfo
				// })
				// // console.log(res)
				// window.location.href = 'http://81.70.151.121:8080/jeecg-boot/SumController/HHDkaoqinAll?begintime=' + this.allExportInfo.begintime + '&finishtime=' + this.allExportInfo.finishtime
				// this.fullscreenLoading = false;
			},
		}
	}
</script>

<style scoped>
	.is-selected {
		color: #1989FA;
	}

	.text {
		margin-top: 5px;
		text-align: center;
	}
</style>
