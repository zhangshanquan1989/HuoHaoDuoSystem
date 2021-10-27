<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>服务评价</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<el-button type="primary" plain @click="showAddDialog">录 入</el-button>
			<el-date-picker v-model="selectTime" type="month" placeholder="选择月份" format="yyyy 年 MM 月" value-format="yyyy-MM" @change="selectTimeChange" style="margin-left: 30px;">
			</el-date-picker>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查 询</el-button>
			<el-button type="primary" v-if="showBtn" plain @click="exportBtn" style="margin-left: 30px;">导 出</el-button>
			<el-table :data="tableList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column v-if="false" prop="id" label="id">
				</el-table-column>
				<el-table-column prop="companyl" label="公司名称" width="300px">
				</el-table-column>
				<el-table-column prop="driver" label="司机" width="100px">
				</el-table-column>
				<el-table-column prop="licensePlate" label="车牌" width="150px">
				</el-table-column>
				<!-- <el-table-column prop="dispatch" label="配管" width="150px">
				</el-table-column> -->
				<el-table-column prop="score" label="1、帮助提升司机收入" width="200px">
				</el-table-column>
				<el-table-column prop="scoreb" label="2、帮助司机争取利益，如压车费，及时回款等" width="320px">
				</el-table-column>
				<el-table-column prop="scorec" label="3、从不过度承诺，推卸责任" width="200px">
				</el-table-column>
				<el-table-column prop="scored" label="4、能尊重司机，沟通表达有礼有节并能够换位思考" width="350px">
				</el-table-column>
				<el-table-column prop="scoree" label="5、对司机有效辅导，并给出合理有效的解决方案" width="330px">
				</el-table-column>
				<el-table-column prop="scoref" label="6、能高效解决问题，不啰嗦不拖延" width="250px" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="scoreg" label="7、能够积极协助处理突发事件" width="220px">
				</el-table-column>
				<el-table-column prop="scoreh" label="8、对可预见的风险能有效提醒、告知，补救措施合理" width="370px">
				</el-table-column>
				<el-table-column prop="scorel" label="9、发现司机有不良行为是否有批评并要求其改正" width="350px" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="scorej" label="10、司机转介绍意愿度" width="200px" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="totalscore" label="总得分" width="150px" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="advice" label="针对服务的三点建议" width="300px" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="month" label="评价月份" width="200px">
				</el-table-column>
				<el-table-column prop="createuser" label="创建人" width="150px">
				</el-table-column>
				
				<el-table-column label="操作" width="200" fixed="right">
					<template slot-scope="scope">
						<!-- 修改按钮 -->
						<el-button type="primary" size="mini" @click="showEditDialog(scope.row.id)">详情</el-button>
						<!-- 删除按钮 -->
						<!-- <el-popconfirm title="确定删除吗？" @confirm="removeById(scope.row.id)" style="margin-left: 10px;">
							<el-button type="danger" size="mini" slot="reference">删除</el-button>
						</el-popconfirm> -->
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 分页区域 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
		 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
		 :total="total" style="margin-top: 5px;">
		</el-pagination>

		<!-- 创建的对话框 -->
		<el-dialog class="dialog" title="录入服务评价" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed"
		 :close-on-click-modal="false" center>
			<!-- 添加的表单 -->
			<el-divider>评价要求</el-divider>
			<div style="color: #ba0000">分公司评价要求：</div>
			<div style="color: #ba0000;">1、评价时间：分公司每周与车主/司机（每天配管对接配货的车主或司机）确认对配管服务满意度评价得分即每月完成4次评价；</div>
			<div style="color: #ba0000;">2、评价流程：分公司需联系正常运营车辆的车主或司机根据评分表进行逐一确认评价结果；</div>
			<div style="color: #ba0000;">3、评价要求：满意度评价目的是为了提升调度中心服务质量，严禁分公司不与车主或司机沟通而仅是根据个人主观意愿对配管员评价，分公司与司机沟通确认的过程必须有迹可循，即要保留沟通记录；如出现违规操作将对分公司进行罚款或降级处理。</div>
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
				<el-divider>基础信息</el-divider>
				<el-form-item label="所属公司" prop="companyl" class="formItem">
					<el-select v-model="addForm.companyl" clearable filterable remote placeholder="请输入公司名称" :remote-method="remoteCompanyMethod" :loading="companyLoading" @change="companyChange" style="width: 350px;">
						<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="司机姓名" prop="driver" class="formItem">
					<el-select v-model="addForm.driver" clearable filterable remote placeholder="司机姓名" :remote-method="remoteDriverMethod"
					 :loading="driverLoading" @change="driverChange" style="width: 350px;">
						<el-option v-for="item in driverOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车牌号" prop="licensePlate" class="formItem rt-input" >
					<el-input disabled v-model="addForm.licensePlate" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="配管" v-if="false" prop="dispatch" class="formItem rt-input" >
					<el-input disabled v-if="false" v-model="addForm.dispatch" style="width: 350px;" ></el-input>
				</el-form-item>
				<el-form-item label="月份" prop="month" class="formItem rt-input" >
					<el-date-picker v-model="addForm.month" type="month" placeholder="选择月份" format="yyyy 年 MM 月" value-format="yyyy-MM" @change="dddsss" style="width: 350px;"></el-date-picker>
				</el-form-item>
				<el-form-item label="1.帮助提升司机收入" prop="score" class="formItem">
					<el-rate v-model="addForm.score" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="2.帮助司机争取利益，如压车费，及时回款等" prop="scoreb" class="formItem">
					<el-rate v-model="addForm.scoreb" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="3.从不过度承诺，推卸责任" prop="scorec" class="formItem">
					<el-rate v-model="addForm.scorec" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="4.能尊重司机，沟通表达有礼有节并能够换位思考" prop="scored" class="formItem">
					<el-rate v-model="addForm.scored" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="5.对司机有效辅导，并给出合理有效的解决方案" prop="scoree" class="formItem">
					<el-rate v-model="addForm.scoree" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="6.能高效解决问题，不啰嗦不拖延" prop="scoref" class="formItem">
					<el-rate v-model="addForm.scoref" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="7.能够积极协助处理突发事件" prop="scoreg" class="formItem">
					<el-rate v-model="addForm.scoreg" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="8.对可预见的风险能有效提醒、告知，补救措施合理" prop="scoreh" class="formItem">
					<el-rate v-model="addForm.scoreh" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="9.发现司机有不良行为是否有批评并要求其改正" prop="scorel" class="formItem">
					<el-rate v-model="addForm.scorel" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="10.司机转介绍意愿度" prop="scorej" class="formItem">
					<el-rate v-model="addForm.scorej" :max='10' @change="scoreAddChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="总得分:" prop="totalscore" class="formItem rt-input" >
					<el-input disabled v-model="addForm.totalscore" style="width:80%;"></el-input>
				</el-form-item>
				<el-form-item label="针对服务的三点建议:" prop="advice" class="formItem">
					<el-input type="textarea" :rows="3" v-model="addForm.advice" style="width:80%;"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSecore">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 编辑的对话框 -->
		<el-dialog class="dialog" title="服务评价详情" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed"
		 :close-on-click-modal="false" center>
			<el-divider>评价要求</el-divider>
			<div style="color: #ba0000;font-size: 15px;">分公司评价要求：</div>
			<div style="color: #ba0000;font-size: 15px;">1、评价时间：分公司每周与车主/司机（每天配管对接配货的车主或司机）确认对配管服务满意度评价得分即每月完成4次评价；</div>
			<div style="color: #ba0000;font-size: 15px;">2、评价流程：分公司需联系正常运营车辆的车主或司机根据评分表进行逐一确认评价结果；</div>
			<div style="color: #ba0000;font-size: 15px;">3、评价要求：满意度评价目的是为了提升调度中心服务质量，严禁分公司不与车主或司机沟通而仅是根据个人主观意愿对配管员评价，分公司与司机沟通确认的过程必须有迹可循，即要保留沟通记录；如出现违规操作将对分公司进行罚款或降级处理。</div>
			<!-- 编辑的表单 -->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-position="top">
				<el-divider>基础信息</el-divider>
				<el-form-item label="公司名称" prop="companyl" style="margin-left: 100px;" class="rt-input">
					<el-input disabled v-model="editForm.companyl" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="司机姓名" prop="driver" class="formItem">
					<el-input disabled v-model="editForm.driver" style="width: 350px;" class="rt-input"></el-input>
					<!-- <el-select disabled v-model="editForm.driver" clearable filterable remote placeholder="司机姓名" :remote-method="remoteDriverMethod"
					 :loading="driverLoading" @change="editDriverChange" style="width: 350px;">
						<el-option v-for="item in driverOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="车牌号" prop="licensePlate" class="formItem rt-input">
					<el-input disabled v-model="editForm.licensePlate" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="配管" v-if="false" prop="dispatch" class="formItem rt-input" >
					<el-input disabled v-if="false" v-model="editForm.dispatch" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="月份" prop="month" class="formItem rt-input" >
					<el-date-picker v-model="editForm.month" type="month" placeholder="选择月份" format="yyyy 年 MM 月" value-format="yyyy-MM"></el-date-picker>
				</el-form-item>
				<el-divider>司机服务满意度评价</el-divider>
				<el-form-item label="1.帮助提升司机收入" prop="score" class="formItem">
					<el-rate v-model="editForm.score" :max='10' show-score text-color="#ff9900" @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="2.帮助司机争取利益，如压车费，及时回款等" prop="scoreb" class="formItem">
					<el-rate show-score text-color="#ff9900" v-model="editForm.scoreb" :max='10' @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="3.从不过度承诺，推卸责任" prop="scorec" style="margin-left: 100px;">
					<el-rate show-score text-color="#ff9900" v-model="editForm.scorec" :max='10' @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="4.能尊重司机，沟通表达有礼有节并能够换位思考" prop="scored" class="formItem">
					<el-rate show-score text-color="#ff9900" v-model="editForm.scored" :max='10' @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="5.对司机有效辅导，并给出合理有效的解决方案" prop="scoree" class="formItem">
					<el-rate show-score text-color="#ff9900" v-model="editForm.scoree" :max='10' @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="6.能高效解决问题，不啰嗦不拖延" prop="scoref" class="formItem">
					<el-rate show-score text-color="#ff9900" v-model="editForm.scoref" :max='10' @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="7.能够积极协助处理突发事件" prop="scoreg" class="formItem">
					<el-rate show-score text-color="#ff9900" v-model="editForm.scoreg" :max='10' @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="8.对可预见的风险能有效提醒、告知，补救措施合理" prop="scoreh" class="formItem">
					<el-rate show-score text-color="#ff9900" v-model="editForm.scoreh" :max='10' @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="9.发现司机有不良行为是否有批评并要求其改正" prop="scorel" class="formItem">
					<el-rate show-score text-color="#ff9900" v-model="editForm.scorel" :max='10' @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="10.司机转介绍意愿度" prop="scorej" class="formItem">
					<el-rate show-score text-color="#ff9900" v-model="editForm.scorej" :max='10' @change="scoreEditChange">
					</el-rate>
				</el-form-item>
				<el-form-item label="总得分" prop="totalscore" class="formItem rt-input" >
					<el-input disabled v-model="editForm.totalscore" style="width:80%;"></el-input>
				</el-form-item>
				<el-form-item label="针对服务的三点建议" prop="advice" class="formItem">
					<el-input type="textarea" :rows="3" v-model="editForm.advice" style="width:80%;"></el-input>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSecore">修 改</el-button>
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
					id:'',
					pageNo: 1,
					pageSize: 10,
					createtime: '',
					companyl: '',
				},
				tableList: [],
				total: 0,
				selectTime:'',
				// 控制添加对话框的显示与隐藏
				addDialogVisible: false,
				// 公司名称
				companyName: '',
				// 添加公司的表单数据对象
				addForm: {
					score: 0,
					scoreb: 0,
					scorec: 0,
					scored: 0,
					scoree: 0,
					scoref: 0,
					scoreg: 0,
					scoreh: 0,
					scorel: 0,
					scorej: 0,
					licensePlate: '',
					dispatch: '',
					driver: '',
					advice: '',
					totalscore: '',
					companyl: '',
					month: '',
					
				},
				addFormRules: {
					month: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					companyl: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					driver: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					licensePlate: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					score: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoreb: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scorec: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scored: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoree: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoref: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoreg: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoreh: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scorel: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scorej: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					totalscore: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
				},
				// 编辑对话框显示与隐藏
				editDialogVisible: false,
				editForm: {
					score: 0,
					scoreb: 0,
					scorec: 0,
					scored: 0,
					scoree: 0,
					scoref: 0,
					scoreg: 0,
					scoreh: 0,
					scorel: 0,
					scorej: 0,
					licensePlate: '',
					dispatch: '',
					driver: '',
					advice: '',
					totalscore: '',
					companyl: '',
					month: '',
				},
				editFormRules: {
					month: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					companyl: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					driver: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					licensePlate: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					score: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoreb: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scorec: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scored: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoree: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoref: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoreg: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scoreh: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scorel: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					scorej: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
					totalscore: [{
						required: true,
						message: "必填",
						trigger: 'blur'
					}],
				},
				
				// 公司选择框数据
				companyOptions: [],
				companyList: [],
				companyLoading: false,
				companyStates: [],
				
				// 司机选择框数据
				driverOptions: [],
				driverList: [],
				driverLoading: false,
				driverStates: [],
				// 根据是否是分公司显示
				showBtn:true,
			}
		},
		created() {
			if(window.sessionStorage.getItem('role') == '分公司'){
				this.showBtn = false
			}else{
				this.showBtn = true
			}
			// this.addForm.companyl = window.sessionStorage.getItem('company')
			// this.queryInfo.companyl = window.sessionStorage.getItem('company')
			this.selectTime = this.getFormatDate(new Date())
			this.queryInfo.createtime = '*' + this.selectTime + '*'
			this.getList()
			this.getAllCompanyList()
		},
		methods: {
			dddsss(e){
				console.log(e)
			},
			// 导出
			async exportBtn(){
				this.fullscreenLoading = true;				
				let url = this.$baseUploadUrl +'/k_information/exportdata?month='+this.selectTime
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
						a.download = "服务评价报表.xlsx" // 文件名
						a.click()
						window.URL.revokeObjectURL(url)
						a.remove()
						that.fullscreenLoading = false;
					}
				xhr.send();
			},
			// 点击查询按钮 
			handleQueryBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getList()
			},
			selectTimeChange(){
				this.queryInfo.createtime = '*'+this.selectTime+'*'
			},
			// 获取当前时间
			getFormatDate(date) {
				var month = date.getMonth() + 1
				if (month >= 1 && month <= 9) {
					month = '0' + month
				}
				var currentDate = date.getFullYear() + '-' + month
				return currentDate
			},
			// 根据分页查询列表
			async getList() {
				const {
					data: res
				} = await this.$http.get('k_information/list', {
					params: this.queryInfo
				})
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.tableList = res.result.records
				this.total = res.result.total
			},
			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getList()
			},

			// 页码值改变事件
			handleCurrentChange(pageNo) {
				this.queryInfo.pageNo = pageNo
				this.getList()
			},
			// 点击按钮，展示添加对话框
			showAddDialog() {
				this.addDialogVisible = true
			},
			// 监听对话框的关闭事件，重置表单数据
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
			},
			addSecore() {
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					if (!this.addForm.score || !this.addForm.scoreb || !this.addForm.scorec || !this.addForm.scored || !this.addForm
						.scoree || !this.addForm.scoref || !this.addForm.scoreg || !this.addForm.scoreh || !this.addForm.scorel || !
						this.addForm.scorej) {
						return this.$message.warning('请完善问题分数！')
					}
					const {
						data: res
					} = await this.$http.post('k_information/add', this.addForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.$message.success(res.message)
					this.getList()
					this.addDialogVisible = false
				})
			},
			// 计算总分
			scoreAddChange() {
				this.addForm.totalscore = this.addForm.score + this.addForm.scoreb + this.addForm.scorec + this.addForm.scored +
					this.addForm.scoree + this.addForm.scoref + this.addForm.scoreg + this.addForm.scoreh + this.addForm.scorel + this
					.addForm.scorej
			},
			// 展示编辑的对话框
			async showEditDialog(id) {
				console.log(id)
				this.queryInfo.id = id
				this.queryInfo.pageNo = 1
				const {
					data: res
				} = await this.$http.get('k_information/list', {
					params: this.queryInfo
				})
				console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.editForm.id = res.result.records[0].id
				this.editForm.companyl = res.result.records[0].companyl
				this.editForm.licensePlate = res.result.records[0].licensePlate
				this.editForm.dispatch = res.result.records[0].dispatch
				this.editForm.driver = res.result.records[0].driver
				this.editForm.advice = res.result.records[0].advice
				this.editForm.month = res.result.records[0].month
				this.editForm.totalscore = res.result.records[0].totalscore
				this.editForm.score = res.result.records[0].score - 0
				this.editForm.scoreb = res.result.records[0].scoreb - 0
				this.editForm.scorec = res.result.records[0].scorec - 0
				this.editForm.scored = res.result.records[0].scored - 0
				this.editForm.scoree = res.result.records[0].scoree - 0
				this.editForm.scoref = res.result.records[0].scoref - 0
				this.editForm.scoreg = res.result.records[0].scoreg - 0
				this.editForm.scoreh = res.result.records[0].scoreh - 0
				this.editForm.scorel = res.result.records[0].scorel - 0
				this.editForm.scorej = res.result.records[0].scorej - 0

				this.editDialogVisible = true
			},
			// 监听修改用户对话框关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
				this.queryInfo.id=''
			},
			// 编辑提交
			editSecore() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改用户信息的数据请求
					const {
						data: res
					} = await this.$http.put('k_information/edit', this.editForm)

					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.queryInfo.id = ""
					this.getList()
					this.$message.success(res.message)
				})
			},
			// 计算总分
			scoreEditChange() {
				this.editForm.totalscore = this.editForm.score + this.editForm.scoreb + this.editForm.scorec + this.editForm.scored +
					this.editForm.scoree + this.editForm.scoref + this.editForm.scoreg + this.editForm.scoreh + this.editForm.scorel +
					this.editForm.scorej
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
				console.log(e)
				if(!e){
					this.companyOptions = this.companyList
					this.driverStates = []
					this.driverOptions = []
					this.driverList = []
					this.addForm.driver = ''
					this.addForm.licensePlate = ''
				}else{
					this.getAllDriverList()
					console.log('list',this.driverList)
				}
			},
			// 获取公司名下所有司机名称
			async getAllDriverList() {
				const {
					data: res
				} = await this.$http.get('kDriver/editcompany?company=' + this.addForm.companyl)
				console.log('driver', res)
				if (res.code !== 200) {
					return this.$message.error(res.message);
				}
				this.driverStates = []
				res.result.forEach(v => {
					this.driverStates.push(v.name)
				})
				// console.log(this.companyStates)
				this.driverList = this.driverStates.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.driverOptions = this.driverList
			},
			

			// 选择司机方法
			remoteDriverMethod(query) {
				if (query !== '') {
					this.driverLoading = true;
					setTimeout(() => {
						this.driverLoading = false;
						this.driverOptions = this.driverList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.driverOptions = this.driverList
					
				}
			},
			// 选择司机变化 
			async driverChange(e) {
				console.log(e)
				if (!e) {
					this.driverOptions = this.driverList
					this.addForm.licensePlate = ''
				} else {
					const {
						data: res
					} = await this.$http.get('waybill/findDriverByDriver?driver=' + e)
					console.log('dispatch', res)
					if (res.code !== 200) {
						return this.$message.error(res.message);
					}
					this.addForm.licensePlate = res.result.chepai
					this.addForm.dispatch = res.result.dispatch
				}
			},
			// 选择公司变化 
			async editDriverChange(e) {
				console.log(e)
				if (!e) {
					this.driverOptions = this.driverList
				} else {
					const {
						data: res
					} = await this.$http.get('waybill/findDriverByDriver?driver=' + e)
					console.log('dispatch', res)
					if (res.code !== 200) {
						return this.$message.error(res.message);
					}
					this.editForm.licensePlate = res.result.chepai
					this.editForm.dispatch = res.result.dispatch
				}
			},


		}
	}
</script>

<style scoped>
	.formItem {
		margin-left: 100px;
	}
	.rt-input /deep/ .el-input__inner {
		color: #606266 !important;
	
	}
	
</style>
