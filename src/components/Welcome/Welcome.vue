<template>
	<div>
		<!-- <h2>欢迎登陆天康系统</h2> -->		
		<div style="display: flex;">
			<el-card shadow="hover" style="width: 300px;height: 144px;margin-left:8px;" @click.native="showNianJian" v-loading.fullscreen.lock="fullscreenLoading">
				<div style="display: flex;margin-left: 22px;margin-top: 12px;">
					<div>
						<div style="width:76px;height: 54px;font-size: 41px;">{{nianjianCarData}}</div>
						<div style="width:96px;height: 16px;font-size: 15px;color: #999999;">年检到期车辆</div>
					</div>
					<div>
						<el-image :src="require('../../assets/welcome/组929.png')" style="width: 55px; height: 55px;margin-left:105px ;margin-top: 10px;"></el-image>
					</div>
				</div>
				<div style="height: 29px;background-color: #224EA6;margin-top: 30px;">
					<div style="font-size: 15px;color: #FFFFFF;margin-left: 22px;padding-top: 4px;">总车辆数：{{allCarData}}</div>
				</div>
			</el-card>

			<el-card shadow="hover" style="width: 300px;height: 144px;margin-left:40px;" @click.native="showBaoXian"
			 v-loading.fullscreen.lock="fullscreenLoading">
				<div style="display: flex;margin-left: 22px;margin-top: 12px;">
					<div>
						<div style="width:76px;height: 54px;font-size: 41px;">{{baoxianCarData}}</div>
						<div style="width:96px;height: 16px;font-size: 15px;color: #999999;">保险到期车辆</div>
					</div>
					<div>
						<el-image :src="require('../../assets/welcome/组945.png')" style="width: 55px; height: 55px;margin-left:105px ;margin-top: 10px;"></el-image>
					</div>
				</div>
				<div style="height: 29px;background-color: #9DB7CD;margin-top: 30px;">
					<div style="font-size:15px;color: #FFFFFF;margin-left: 22px;padding-top: 4px;">总车辆数：{{allCarData}}</div>
				</div>
			</el-card>

			<el-card shadow="hover" style="width: 300px;height: 144px;margin-left:40px;" @click.native="showWeiZhang"
			 v-loading.fullscreen.lock="fullscreenLoading">
				<div style="display: flex;margin-left: 22px;margin-top: 12px;">
					<div>
						<div style="width:76px;height: 54px;font-size: 41px;">{{weizhangCarData}}</div>
						<div style="width:96px;height: 16px;font-size: 15px;color: #999999;">违章处理车辆</div>
					</div>
					<div>
						<el-image :src="require('../../assets/welcome/组947.png')" style="width: 55px; height: 55px;margin-left:105px ;margin-top: 10px;"></el-image>
					</div>
				</div>
				<div style="height: 29px;background-color: #B3161A;margin-top: 30px;">
					<div style="font-size: 15px;color: #FFFFFF;margin-left: 22px;padding-top: 4px;">总车辆数：{{allCarData}}</div>
				</div>
			</el-card>

			<el-card shadow="hover" style="width: 300px;height: 144px;margin-left:40px;" @click.native="showYaJin"
			 v-loading.fullscreen.lock="fullscreenLoading">
				<div style="display: flex;margin-left: 22px;margin-top: 12px;">
					<div>
						<div style="width:76px;height: 54px;font-size: 41px;">{{yajinCarData}}</div>
						<div style="width:126px;height: 16px;font-size: 15px;color: #999999;">押金小于500车辆</div>
					</div>
					<div>
						<el-image :src="require('../../assets/welcome/组948.png')" style="width: 55px; height: 55px;margin-left:75px ;margin-top: 10px;"></el-image>
					</div>
				</div>
				<div style="height: 29px;background-color: #E3C191;margin-top: 30px;">
					<div style="font-size: 15px;color: #FFFFFF;margin-left: 22px;padding-top: 4px;">总车辆数：{{allCarData}}</div>
				</div>
			</el-card>

			<el-card shadow="hover" style="width: 300px;height: 144px;margin-left:40px;" @click.native="showDiaoDuFei"
			 v-loading.fullscreen.lock="fullscreenLoading">
				<div style="display: flex;margin-left: 22px;margin-top: 12px;">
					<div>
						<div style="width:76px;height: 54px;font-size: 41px;">{{diaodufeiCarData}}</div>
						<div style="width:106px;height: 16px;font-size: 15px;color: #999999;">调度费到期车辆</div>
					</div>
					<div>
						<el-image :src="require('../../assets/welcome/组1322.png')" style="width: 55px; height: 55px;margin-left:95px ;margin-top: 10px;"></el-image>
					</div>
				</div>
				<div style="height: 29px;background-color: #8B8F99;margin-top: 30px;">
					<div style="font-size: 15px;color: #FFFFFF;margin-left: 22px;padding-top: 4px;">总车辆数：{{allCarData}}</div>
				</div>
			</el-card>
					</div>
			<!-- 图标展示区域 -->
			<el-card class="box-card" style="margin-top: 30px;height: 600px;margin-left:8px;">
				<div>
					<!-- echarts图表 -->
					<div id="main" style="width:100%;height: 570px;margin-top: 50px;"></div>
				</div>
			</el-card>

			<!-- 年检对话框 -->
			<el-dialog title="年检到期车辆" :visible.sync="nianjianDialogVisible" width="60%" @close="nianjianDialogClosed">
				<el-button type="primary" plain @click="nianjianExport" icon="el-icon-download">导出Excel</el-button>
				<el-table :data="nianjianCarList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @selection-change="nianjianSelectionChange">
				 <el-table-column type="selection" width="55">
				 </el-table-column>
					<el-table-column prop="License_plate" label="车牌号" width="100px">
					</el-table-column>
					<el-table-column prop="companyl" label="所属公司">
					</el-table-column>
					<el-table-column prop="name" label="车主姓名" width="120px">
					</el-table-column>
					<el-table-column prop="phoneno" label="车主电话" width="150px">
					</el-table-column>

					<el-table-column prop="driver" label="对应司机" width="120px">
					</el-table-column>
					<el-table-column prop="driverphone" label="司机电话" width="150px">
					</el-table-column>
					<el-table-column prop="check_date" label="年检到期时间" width="150px">
					</el-table-column>
				</el-table>
				<!-- 操作区域 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="nianjianDialogVisible = false">关 闭</el-button>
				</span>
			</el-dialog>

			<!-- 保险对话框 -->
			<el-dialog title="保险到期车辆" :visible.sync="baoxianDialogVisible" width="50%" @close="baoxianDialogClosed">
				<el-button type="primary" plain @click="baoxianExport" icon="el-icon-download">导出Excel</el-button>
				<el-table :data="baoxianCarList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @selection-change="baoxianSelectionChange">
				 <el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="License_plate" label="车牌号" width="100px">
					</el-table-column>
					<el-table-column prop="companyl" label="所属公司">
					</el-table-column>
					<el-table-column prop="name" label="车主姓名" width="120px">
					</el-table-column>
					<el-table-column prop="phoneno" label="车主电话" width="150px">
					</el-table-column>

					<el-table-column prop="driver" label="对应司机" width="120px">
					</el-table-column>
					<el-table-column prop="driverphone" label="司机电话" width="150px">
					</el-table-column>
					<el-table-column prop="insurance_date" label="保险到期时间" width="150px">
					</el-table-column>
				</el-table>
				<!-- 操作区域 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="baoxianDialogVisible = false">关 闭</el-button>
				</span>
			</el-dialog>

			<!-- 违章对话框 -->
			<el-dialog title="违章未处理车辆" :visible.sync="weizhangDialogVisible" width="80%" @close="weizhangDialogClosed">
				<el-button type="primary" plain @click="weizhangExport" icon="el-icon-download">导出Excel</el-button>
				<el-table :data="weizhangCarList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @selection-change="weizhangSelectionChange">
				 <el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="Car_number" label="车牌号" width="120px">
					</el-table-column>
					<el-table-column prop="illegal_act" label="违章行为">
					</el-table-column>
					<el-table-column prop="illegal_area" label="违章地点">
					</el-table-column>
					<el-table-column prop="illegal_date" label="违章时间" width="200px">
					</el-table-column>

					<el-table-column prop="illegal_fen" label="违章扣分" width="100px">
					</el-table-column>
					<el-table-column prop="illegal_money" label="违章罚款" width="100px">
					</el-table-column>
				</el-table>
				<!-- 操作区域 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="weizhangDialogVisible = false">关 闭</el-button>
				</span>
			</el-dialog>

			<!-- 押金对话框 -->
			<el-dialog title="押金不足车辆" :visible.sync="yajinDialogVisible" width="70%" @close="yajinDialogClosed">
				<el-button type="primary" plain @click="yajinExport" icon="el-icon-download">导出Excel</el-button>
				<el-table :data="yajinCarList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @selection-change="yajinSelectionChange">
				 <el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="License_plate" label="车牌号" width="120px">
					</el-table-column>
					<el-table-column prop="companyl" label="所属公司">
					</el-table-column>
					<el-table-column prop="name" label="车主姓名" width="120px">
					</el-table-column>
					<el-table-column prop="phoneno" label="车主电话" width="150px">
					</el-table-column>

					<el-table-column prop="driver" label="对应司机" width="120px">
					</el-table-column>
					<el-table-column prop="driverphone" label="司机电话" width="150px">
					</el-table-column>
					<el-table-column prop="Carmargin" label="剩余保证金(元)" width="150px">
					</el-table-column>
				</el-table>

				<!-- 操作区域 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="yajinDialogVisible = false">关 闭</el-button>
				</span>
			</el-dialog>

			<!-- 调度费对话框 -->
			<el-dialog title="调度费到期车辆" :visible.sync="diaodufeiDialogVisible" width="70%" @close="diaodufeiDialogClosed">
				<el-button type="primary" plain @click="diaodufeiExport" icon="el-icon-download">导出Excel</el-button>
				<el-table :data="diaodufeiCarList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @selection-change="diaodufeiSelectionChange">
				 <el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="License_plate" label="车牌号" width="120px">
					</el-table-column>
					<el-table-column prop="companyl" label="所属公司">
					</el-table-column>
					<el-table-column prop="name" label="车主姓名" width="120px">
					</el-table-column>
					<el-table-column prop="phoneno" label="车主电话" width="150px">
					</el-table-column>

					<el-table-column prop="driver" label="对应司机" width="120px">
					</el-table-column>
					<el-table-column prop="driverphone" label="司机电话" width="150px">
					</el-table-column>
					<el-table-column prop="management" label="管理费" width="150px">
					</el-table-column>
					<el-table-column prop="Management_date" label="管理费截止日期" width="150px">
					</el-table-column>
				</el-table>
				<!-- 操作区域 -->
				<span slot="footer" class="dialog-footer">
					<el-button @click="diaodufeiDialogVisible = false">关 闭</el-button>
				</span>
			</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				myChart:{},
				// 总车辆数
				allCarData: '',
				// 年检快到期车辆
				nianjianCarData: '',
				nianjianDialogVisible: false,
				nianjianCarList: [],
				nianjianExcel:[],
				// 保险到期车俩
				baoxianCarData: '',
				baoxianDialogVisible: false,
				baoxianCarList: [],
				baoxianExcel:[],
				// 违章未处理车辆
				weizhangCarData: '',
				weizhangDialogVisible: false,
				weizhangCarList: [],
				weizhangExcel:[],
				// 押金不足车辆
				yajinCarData: '',
				yajinDialogVisible: false,
				yajinCarList: [],
				yajinExcel:[],
				// 调度到期车辆
				diaodufeiCarData: '',
				diaodufeiDialogVisible: false,
				diaodufeiCarList: [],
				diaodufeiExcel:[],

				// 加载查询
				fullscreenLoading: false,

				// 起止时间
				queryInfo: {
					plistCtime1: '', // 开始时间  例如：2020-09-16 14:25:23  
					plistCtime2: '' // 结束时间  例如：2020-10-16 14:25:23  
				},
				// 图表
				sourceData: [],
				xDataArr: [],
				yDataArr1: [],
				yDataArr2: [],
			}
		},
		created() {
			this.getAllData()
			this.initTime(); // 初始化时间
			this.getQueryData(); // 获取图表数据
		},
		// mounted中新建图表，created中的数据还没有获取到，展示不成功
		mounted() {
			setTimeout(() => {
				this.creatEchartsMethod()
			}, 1000);
			
			// window.onresize = this.myChart.resize
		},
		methods: {
			// 年检多选框变化
			nianjianSelectionChange(e){
				this.nianjianExcel = []
				e.forEach(v=>{
				this.nianjianExcel.push(v.License_plate)
				})
			},
			// 导出
			async nianjianExport(){
				if(!this.nianjianExcel[0]){return this.$message.warning('请选择需要导出的数据！')}
				const {data:res} = await this.$http.get('ExcelController/ExcelNianjian?'+this.$qs.stringify({ ExcelNianjians: this.nianjianExcel }, { arrayFormat: 'repeat' }))
				window.location.href = 'http://81.70.151.121:8080/jeecg-boot/ExcelController/ExcelNianjian?'+this.$qs.stringify({ ExcelNianjians: this.nianjianExcel }, { arrayFormat: 'repeat' })
			},
			
			// 保险多选框变化
			baoxianSelectionChange(e){
				this.baoxianExcel = []
				e.forEach(v=>{
				this.baoxianExcel.push(v.License_plate)
				})
			},
			// 保险导出
			async baoxianExport(){
				if(!this.baoxianExcel[0]){return this.$message.warning('请选择需要导出的数据！')}
				const {data:res} = await this.$http.get('ExcelController/selectbaoxiandaoqi?'+this.$qs.stringify({selectbaoxiandaoqis: this.baoxianExcel }, { arrayFormat: 'repeat' }))
				window.location.href = 'http://81.70.151.121:8080/jeecg-boot/ExcelController/selectbaoxiandaoqi?'+this.$qs.stringify({selectbaoxiandaoqis: this.baoxianExcel }, { arrayFormat: 'repeat' })
			},
			
			// 违章多选框变化
			weizhangSelectionChange(e){
				this.weizhangExcel = []
				e.forEach(v=>{
				this.weizhangExcel.push(v.Car_number)
				})
			},
			// 违章导出
			async weizhangExport(){
				if(!this.weizhangExcel[0]){return this.$message.warning('请选择需要导出的数据！')}
				const {data:res} = await this.$http.get('ExcelController/selectweizhangxiangqing?'+this.$qs.stringify({ selectweizhangxiangqings: this.weizhangExcel }, { arrayFormat: 'repeat' }))
				window.location.href = 'http://81.70.151.121:8080/jeecg-boot/ExcelController/selectweizhangxiangqing?'+this.$qs.stringify({ selectweizhangxiangqings: this.weizhangExcel }, { arrayFormat: 'repeat' })
			},
			
			// 押金多选框变化
			yajinSelectionChange(e){
				this.yajinExcel = []
				e.forEach(v=>{
				this.yajinExcel.push(v.License_plate)
				})
			},
			// 押金导出
			async yajinExport(){
				if(!this.yajinExcel[0]){return this.$message.warning('请选择需要导出的数据！')}
				const {data:res} = await this.$http.get('ExcelController/sdelectxiaoyuWB?'+this.$qs.stringify({ sdelectxiaoyuWBs: this.yajinExcel }, { arrayFormat: 'repeat' }))
				window.location.href = 'http://81.70.151.121:8080/jeecg-boot/ExcelController/sdelectxiaoyuWB?'+this.$qs.stringify({ sdelectxiaoyuWBs: this.yajinExcel }, { arrayFormat: 'repeat' })
			},
			
			// 调度费多选框变化
			diaodufeiSelectionChange(e){
				this.diaodifeiExcel = []
				e.forEach(v=>{
				this.diaodifeiExcel.push(v.License_plate)
				})
			},
			// 调度费导出
			async diaodufeiExport(){
				if(!this.diaodifeiExcel[0]){return this.$message.warning('请选择需要导出的数据！')}
				const {data:res} = await this.$http.get('ExcelController/selectDiaoDuFeiDQ?'+this.$qs.stringify({ selectDiaoDuFeiDQ: this.diaodifeiExcel }, { arrayFormat: 'repeat' }))
				window.location.href = 'http://81.70.151.121:8080/jeecg-boot/ExcelController/selectDiaoDuFeiDQ?'+this.$qs.stringify({ selectDiaoDuFeiDQ: this.diaodifeiExcel }, { arrayFormat: 'repeat' })
			},
			
			// 获取面板数据
			async getAllData() {
				const {
					data: res1
				} = await this.$http.get('YMpageController/selectAll')
				if (res1.code !== 200) {
					this.$message.error(res1.message)
				}
				this.allCarData = res1.result.年检车辆总数

				const {
					data: res2
				} = await this.$http.get('YMpageController/selectYnjWnj')
				if (res2.code !== 200) {
					this.$message.error(res2.message)
				}
				this.nianjianCarData = res2.result.年检即将到期的车辆总数

				const {
					data: res3
				} = await this.$http.get('YMpageController/selectBaoYW')
				if (res3.code !== 200) {
					this.$message.error(res3.message)
				}
				this.baoxianCarData = res3.result.三十天内保险即将到期的车辆总数

				const {
					data: res4
				} = await this.$http.get('YMpageController/selectWeizhangW')
				if (res4.code !== 200) {
					this.$message.error(res4.message)
				}
				this.weizhangCarData = res4.result.未处理违章总数

				const {
					data: res5
				} = await this.$http.get('YMpageController/selectbaozhengjinYW')
				if (res5.code !== 200) {
					this.$message.error(res5.message)
				}
				this.yajinCarData = res5.result.押金小于500的车辆总数

				const {
					data: res6
				} = await this.$http.get('YMpageController/selectdiaodufeiYM')
				if (res6.code !== 200) {
					this.$message.error(res6.message)
				}
				this.diaodufeiCarData = res6.result.调度费到期车辆总数
			},
			// 年检
			async showNianJian() {
				this.fullscreenLoading = true;
				const {
					data: res
				} = await this.$http.get('YMpageController/selectSanshi')
				if (res.code !== 200) {
					this.$message.error(res.message)
				}
				this.nianjianCarList = res.result.请在三十天内年审
				setTimeout(() => {
					this.fullscreenLoading = false;
					this.nianjianDialogVisible = true
				}, 500)
			},
			nianjianDialogClosed() {},
			// 保险
			async showBaoXian() {
				this.fullscreenLoading = true;
				const {
					data: res
				} = await this.$http.get('YMpageController/selectbaoxiandaoqi')
				if (res.code !== 200) {
					this.$message.error(res.message)
				}
				this.baoxianCarList = res.result.三十天内保险即将到期的车辆
				setTimeout(() => {
					this.fullscreenLoading = false;
					this.baoxianDialogVisible = true
				}, 300)
			},
			baoxianDialogClosed() {},
			// 违章
			async showWeiZhang() {
				this.fullscreenLoading = true;
				const {
					data: res
				} = await this.$http.get('YMpageController/selectYMxiangqing')
				if (res.code !== 200) {
					this.$message.error(res.message)
				}
				this.weizhangCarList = res.result.未处理违章
				setTimeout(() => {
					this.fullscreenLoading = false;
					this.weizhangDialogVisible = true
				}, 600)
			},
			weizhangDialogClosed() {},
			// 押金
			async showYaJin() {
				this.fullscreenLoading = true;
				const {
					data: res
				} = await this.$http.get('YMpageController/sdelectxiaoyuWB')
				if (res.code !== 200) {
					this.$message.error(res.message)
				}
				this.yajinCarList = res.result.押金小于500的车辆详情
				setTimeout(() => {
					this.fullscreenLoading = false;
					this.yajinDialogVisible = true
				}, 300)
			},
			yajinDialogClosed() {},
			// 调度费
			async showDiaoDuFei() {
				this.fullscreenLoading = true;
				const {
					data: res
				} = await this.$http.get('YMpageController/selectDiaoDuFeiDQ')
				if (res.code !== 200) {
					this.$message.error(res.message)
				}
				this.diaodufeiCarList = res.result.调度费到期车辆详情
				setTimeout(() => {
					this.fullscreenLoading = false;
					this.diaodufeiDialogVisible = true
				}, 500)

			},
			diaodufeiDialogClosed() {},

			// 获取时间
			// 初始化时间
			initTime() {
				const plistCtime2 = this.getFormatDate(new Date()).substr(0, 11) + '23:59:59'
				const plistCtime1 = this.getFormatDate(new Date(new Date() - 3600 * 1000 * 24 * 29)).substr(0, 11) + '00:00:00'
				this.queryInfo = {
					'plistCtime1': plistCtime1,
					'plistCtime2': plistCtime2
				}
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
			
			// 获取面板数据
			// 根据查询列表
			async getQueryData() {
				this.sourceData = []
				this.xDataArr = []
				this.yDataArr1 = []
				this.yDataArr2 = []
				const {
					data: res
				} = await this.$http.get('data/findIncomeByTimeEveryday', {
					params: this.queryInfo
				})
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}

				this.sourceData = res.result
			
				this.sourceData.forEach(v => {
					this.xDataArr.push(v.总日期)
					this.yDataArr1.push(v.总里程)
					this.yDataArr2.push(v.总收入)
				})
			},
			// 创建图表
			creatEchartsMethod() {
				this.myChart = this.$echarts.init(document.getElementById('main'));
				
				var options = {
					// title: {
					// 	text: '订单数据'
					// },
					legend: {
						data: ['里程', '收入'],
						// right: '180px',
						
					},
					xAxis: {
						name: '时间',
						nameTextStyle: {
							fontWeight: 600,
							fontSize: 16,
							
						},
						type: 'category',
						data: this.xDataArr
					},
					yAxis: {
						name: '订单数据',
						nameTextStyle: {
							fontWeight: 600,
							fontSize: 16,
							align: 'right',
							lineHeight: 56,
						},
						type: 'value'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					series: [{
							name: '里程',
							type: 'bar',
							data: this.yDataArr1,
							// color: '#409EFF',
							itemStyle: {    //柱状颜色和圆角
									color: '#409EFF',
									barBorderRadius: [10, 10, 10, 10], // （顺时针左上，右上，右下，左下）
								},
							// 平均值线
							// markLine:{
							// 	data:[
							// 		{type: 'average'}
							// 	]
							// }
						},
						{
							name: '收入',
							type: 'bar',
							data: this.yDataArr2,
							// color: '#E6AE5C',
							itemStyle: {    //柱状颜色和圆角
									color: '#E6AE5C',
									barBorderRadius: [10, 10, 10, 10], // （顺时针左上，右上，右下，左下）
								},
							// 平均值
							// markLine:{
							// 	data:[
							// 		{type: 'average'}
							// 	]
							// }
						}
					],			
				}
				// 使用刚指定的配置项和数据显示图表。
				this.myChart.setOption(options);
				// 根据窗口大小，实现表格自适应
				window.onresize = this.myChart.resize
			},
			

		}
	}
</script>

<style scoped>
	.el-card /deep/ .el-card__body {
		padding: 0;
	}
</style>
