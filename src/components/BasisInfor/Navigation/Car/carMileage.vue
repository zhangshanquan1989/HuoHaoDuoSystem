<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆里程报表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="box-card">
			<div>
				<span style="font-size: 18px;color: #303133;">筛选查询</span>
			</div>
			<div style="margin-top: 18px;">
			<el-select v-model="queryInfo.licenseplate" clearable filterable remote placeholder="请输入车牌号" :remote-method="remotePlateNumberMethod" :loading="plateNumberLoading" style="width: 293px;">
				<el-option v-for="item in plateNumberOptions" :key="item.index" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<span style="font-size: 20px;color: #303133;margin-left: 20px;">统计时间段</span>
			<el-button type="primary" plain @click="seleceLastWeek" style="margin-left: 20px;">上周</el-button>
			<el-button type="primary" plain @click="seleceNearWeek" style="margin-left: 20px;">近一周</el-button>
			<el-button type="primary" plain @click="seleceLastMonth" style="margin-left: 20px;">上月</el-button>
			<el-button type="primary" plain @click="seleceNearMonth" style="margin-left: 20px;">近一月</el-button>
			</div>
			<div style="margin-top: 20px;">
			<el-date-picker v-model="queryInfo.newStartTime" :picker-options="pickerDisabled" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd " >
			</el-date-picker>
			<span style="margin-left: 10px;">-</span>
			<el-date-picker v-model="queryInfo.newEndTime" :picker-options="pickerDisabled" type="date" value-format="yyyy-MM-dd " placeholder="选择结束日期" style="margin-left: 10px;">
			</el-date-picker>
			<el-button type="primary" icon="el-icon-search" style="margin-left: 20px;" @click="search">搜索</el-button>
			</div>
			<div style="margin-top: 20px;">
				<span style="font-size: 20px;color: #303133;">车辆里程报表</span>
				<el-button type="primary" icon="el-icon-download" style="margin-left: 20px;">导出</el-button>
			</div>
			<el-table :data="carMileageList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="licenseplate" label="车牌" width="250px">
				</el-table-column>
				<el-table-column prop="endMileage" label="总里程(km)" width="300px">
				</el-table-column>
				<el-table-column prop="mileage" label="行驶里程(km)">
				</el-table-column>

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
	import moment from "moment";
	export default {
		data() {
			return {
				// 查询参数对象
				queryInfo: {
					licenseplate: '',
					StartTime: '',
					EndTime: '',
					newStartTime: '',
					newEndTime: '',
					pageNo: 1,
					pageSize: 10,
				},
				searchInfo:{
					licenseplate: '',
					StartTime: '',
					EndTime: '',
				},
				carMileageList: [],
				total: 0,
				// 设置日期选择禁用日期
				pickerDisabled: {
				        disabledDate: (time) => {
				            return time.getTime() < 1625382900365 || time.getTime() > new Date() - 8.64e7;
				          }
				      },
				// 选择车牌数据
				plateNumberLoading: false,
				plateNumberOptions: [],
				plateNumberStates: [],
				plateNumberList: [],

			}
		},
		created() {
			console.log('现在',Date.now()-950400000)
			this.initTime(); // 初始化时间
			this.getCarMileageList()
			this.getAllPlateNumberList()
		},
		methods: {
			change(e){
				console.log(e)
			},
			// 获取时间
			// 初始化时间
			initTime() {
				// const EndTime = this.getFormatDate(new Date()).substr(0, 11) + '23:59:59'

				const EndTime = this.getFormatDate(new Date(new Date() - 3600 * 1000 * 24 * 1)).substr(0, 11)

				const StartTime = this.getFormatDate(new Date(new Date() - 3600 * 1000 * 24 * 6)).substr(0, 11)
				this.queryInfo.newStartTime = StartTime
				this.queryInfo.newEndTime = EndTime
			},
			// 获取当前时间
			getFormatDate(date) {
				var month = date.getMonth() + 1
				var strDate = date.getDate()
				if (month >= 1 && month <= 9) {
					month = '0' + month
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = '0' + strDate
				}
				var currentDate = date.getFullYear() + '-' + month + '-' + strDate + ' ' + date.getHours() + ':' + date.getMinutes() +
					':' + date.getSeconds()
				return currentDate
			},

			// 根据分页查询列表
			async getCarMileageList() {
				console.log(this.queryInfo)
				this.queryInfo.StartTime = this.queryInfo.newStartTime + '23:59:59'
				this.queryInfo.EndTime = this.queryInfo.newEndTime + '23:59:59'
				console.log(this.queryInfo)
				const {
					data: res
				} = await this.$http.get('yK_record/list1', {
					params: this.queryInfo
				})
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.carMileageList = res.result.records
				this.total = res.result.total
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getCarMileageList()
			},

			// 页码值改变事件
			handleCurrentChange(pageNo) {
				this.queryInfo.pageNo = pageNo
				this.getCarMileageList()
			},
			
			// 点击搜索
			async search(){
				if(this.queryInfo.licenseplate){
					console.log('有车牌')
					const {
						data: res
					} = await this.$http.post('yK_record/list2', this.queryInfo)
					console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.carMileageList = []
					this.carMileageList[0] = res.result
					this.total = 1
					console.log(this.carMileageList)
				}else{
					console.log('没有车牌')
					this.getCarMileageList()
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
			
			// 选择上周
			seleceLastWeek(){
				this.queryInfo.newStartTime = moment(moment().week(moment().week() - 1).startOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD ')
				this.queryInfo.newEndTime = moment(moment().week(moment().week() - 1).endOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD ')
				console.log(this.queryInfo.newStartTime)
				console.log(this.queryInfo.newEndTime)
			},
			// 选择近一个周
			seleceNearWeek(){
				this.queryInfo.newStartTime = moment().subtract(7, "days").format("YYYY-MM-DD ");
				this.queryInfo.newEndTime =moment().subtract(1, "days").format("YYYY-MM-DD ")
			},
			// 选择上月
			seleceLastMonth(){
				this.queryInfo.newStartTime =moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format('YYYY-MM-DD ')
				this.queryInfo.newEndTime =moment(moment().month(moment().month() - 1).endOf('month').valueOf()).format('YYYY-MM-DD ')
				console.log(this.queryInfo.newStartTime)
				console.log(this.queryInfo.newEndTime)
			},
			// 选择近一个月
			seleceNearMonth(){
				this.queryInfo.newStartTime = moment().subtract(1, "months").format("YYYY-MM-DD ")
				this.queryInfo.newEndTime = moment().subtract(1, "days").format("YYYY-MM-DD ")
			},

		}
	}
</script>

<style scoped>

</style>
