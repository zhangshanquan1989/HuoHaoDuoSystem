<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单查询</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<!-- 创建按钮 -->
			<el-input v-model="queryInfo.chepai" placeholder="完整车牌号" clearable style="width: 200px;"></el-input>
			<el-date-picker v-model="selectTime" type="datetimerange" range-separator="至" start-placeholder="装货开始日期"
			 end-placeholder="装货结束日期" format="yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒" value-format="yyyy-MM-dd HH:mm:ss" style="margin-left: 20px;">
			</el-date-picker>
			<el-select v-model="queryInfo.state" placeholder="状态查询" style="margin-left: 30px;">
			    <el-option
			      v-for="item in stateOptions"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>
			<el-button type="primary" icon="el-icon-download" plain @click="handleExport" style="margin-left: 30px;">导出Excel</el-button>
			<el-button type="primary" plain @click="handleClearBtn" style="margin-left: 30px;">清空选中</el-button>

			<el-table :data="List" ref="tableRef" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}" :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}" @selection-change="handleSelectionChange" :row-key="getLicense">
				<el-table-column type="selection" width="55" :reserve-selection="true">
				</el-table-column>
				<el-table-column prop="id" label="ID" v-if="false">
				</el-table-column>
				<el-table-column fixed prop="no" label="运单编号" width="100px">
				</el-table-column>
				<el-table-column prop="waybilltype" label="派单类型" width="100px">
				</el-table-column>
				<el-table-column prop="source" label="订单来源" width="100px">
				</el-table-column>
				<el-table-column prop="people" label="司机对接人" width="100px">
				</el-table-column>
				<el-table-column prop="goodsname" label="货物名称" width="150px">
				</el-table-column>
				<el-table-column prop="goodsweight" label="货物重量/方数" width="150px">
				</el-table-column>
				<el-table-column prop="overweight" label="是否超高/超宽/超重" width="100px">
				</el-table-column>
				<!-- <el-table-column prop="picture" label="运单截图" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
							<el-image style="width: 80px; height: 40px" :src="scope.row.picture" :preview-src-list="srcList" @click="handleClickImage(scope.row.picture)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column> -->
				<el-table-column prop="emptydistance" label="空车距离" width="150px">
				</el-table-column>
				<el-table-column prop="highspeed" label="高速预计距离" width="150px">
				</el-table-column>
				<el-table-column prop="estimatedistance" label="下道预计距离" width="150px">
				</el-table-column>
				<el-table-column prop="ban" label="是否禁行" width="150px">
				</el-table-column>
				<el-table-column prop="km" label="全程公里数" width="150px">
				</el-table-column>
				<el-table-column prop="deposit" label="定金（元）" width="150px">
				</el-table-column>
				<el-table-column prop="pay" label="到付（元）" width="150px">
				</el-table-column>
				<el-table-column prop="car" label="到车（元）" width="150px">
				</el-table-column>
				<el-table-column prop="cost" label="费用（元）" width="150px">
				</el-table-column>
				<el-table-column prop="nearcost" label="预估利润（元）" width="150px">
				</el-table-column>
				<el-table-column prop="aclient" label="发货客户企业" width="150px">
				</el-table-column>
				<el-table-column prop="uclient" label="收货客户企业" width="150px">
				</el-table-column>
				<!-- <el-table-column prop="kilometer" label="每公里成本" width="150px">
				</el-table-column> -->
				<el-table-column prop="lienses" label="车牌号" width="150px">
				</el-table-column>
				<el-table-column prop="creater" label="创建者" width="150px">
				</el-table-column>
				<el-table-column prop="creatime" label="创建时间" width="180px">
				</el-table-column>
				<el-table-column prop="stateText" label="订单状态" width="120px" fixed="right">
				</el-table-column>
				<!-- <el-table-column prop="refusenote" label="司机拒单备注" width="120px" fixed="right">
				</el-table-column> -->
				<el-table-column label="操作" width="120px" fixed="right">
					<template slot-scope="scope">
						<!-- 修改按钮 -->
						<el-button type="primary" size="mini" @click="showEditDialog(scope.row.no)" style="margin-left: 15px;">详情</el-button>
						<!-- 删除按钮 -->
						<!-- <el-popconfirm title="确定删除吗？" @confirm="removeById(scope.row.id)" style="margin-left: 10px;">
							<el-button type="danger" size="mini" slot="reference">删除</el-button>
						</el-popconfirm> -->
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 分页区域 remoteMethod -->
		<el-col>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
			 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" style="margin-top: 5px;">
			</el-pagination>
		</el-col>

		<!-- 详情的对话框  -->
		<el-dialog title="订单详情" :visible.sync="editDialogVisible" width="80%" @close="editDialogClosed">
			<!-- 编辑的表单 -->
			<el-form :model="editForm" ref="editFormRef" label-width="140px">

				<el-form-item v-if="showRefusenote" label="司机拒单原因" prop="refusenote" class="redItem">
					<div style="color: red;">{{this.editForm.refusenote}}</div>
				</el-form-item>
				<div style="display: flex;">
					<el-form-item label="运单编号" prop="no" class="rt-input">
						<el-input disabled v-model="editForm.no"></el-input>
					</el-form-item>
					<el-form-item label="派单类型" prop="waybilltype" class="rt-input">
						<el-input disabled v-model="editForm.waybilltype"></el-input>
					</el-form-item>
					</el-form-item>
					<el-form-item label="订单来源" prop="source" class="rt-input">
						<el-input disabled v-model="editForm.source"></el-input>
					</el-form-item>
					<el-form-item label="当日负责配管" prop="people" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.people"></el-input>
					</el-form-item>
				</div>

				<div style="display: flex;">
					<el-form-item label="货物名称" prop="goodsname" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.goodsname"></el-input>
					</el-form-item>
					<el-form-item label="货物重量/方数" prop="goodsweight" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.goodsweight"></el-input>
					</el-form-item>
					<el-form-item label="是否超高/超宽/超重" prop="overweight" class="rt-input">
						<el-input disabled v-model="editForm.overweight"></el-input>
					</el-form-item>
					<el-form-item label="是否禁行" prop="ban" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.ban"></el-input>
					</el-form-item>
					
				</div>


				<div style="display: flex;">
					<el-form-item label="空车距离" prop="emptydistance" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.emptydistance + 'km'"></el-input>
					</el-form-item>
					<el-form-item label="高速预计距离" prop="highspeed" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.highspeed + 'km'"></el-input>
					</el-form-item>
					<el-form-item label="下道预计距离" prop="estimatedistance" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.estimatedistance + 'km'"></el-input>
					</el-form-item>
					<el-form-item label="总公里" prop="km" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.km + 'km'"></el-input>
					</el-form-item>
				</div>
				<div style="display: flex;">
					<el-form-item label="定金" prop="deposit" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.deposit + '元'"></el-input>
					</el-form-item>
					<el-form-item label="到付" prop="pay" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.pay + '元'"></el-input>
					</el-form-item>
					<el-form-item label="到车" prop="car" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.car + '元'"></el-input>
					</el-form-item>
					<el-form-item label="费用" prop="cost" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.cost + '元'"></el-input>
					</el-form-item>
					<el-form-item label="利润" prop="nearcost" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.nearcost + '元'"></el-input>
					</el-form-item>
					
				</div>
				<div style="display: flex;">
					<el-form-item label="卸货方式" prop="upiontway">
						<el-input disabled v-model="editForm.upiontway" ></el-input>
					</el-form-item>
					<el-form-item label="	建议运输方式" prop="yunshu">
						<el-input disabled v-model="editForm.yunshu"></el-input>
					</el-form-item>
					<el-form-item label="建议到达装货时间">
						
							<el-date-picker disabled v-model="editForm.daoda" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
							</el-date-picker>
						
					</el-form-item>
					<el-form-item label="订单备注" prop="ordernote">
						<el-input disabled v-model="editForm.ordernote"></el-input>
					</el-form-item>
				</div>
				<div style="display: flex;">
					<el-form-item label="下单客户" prop="aclient" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.aclient"></el-input>
					</el-form-item>
					<el-form-item label="收单客户" prop="uclient" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.uclient"></el-input>
					</el-form-item>
				</div>
				<el-form-item label="运单截图" prop="picture">
					<el-image v-if="editForm.picture" style="width: 150px;" :src="editForm.picture"></el-image>
					<!-- <el-upload name="imgFile" :action="updatePictureUrl" :auto-upload="true" :on-success="handleEditPictureUrlSuccess"
					 :show-file-list="false">
						<el-button :disabled="canEdit" size="small" type="primary" plain>上传运单截图</el-button>
					</el-upload> -->
				</el-form-item>

				<el-form-item label="装货信息">
					<template>
						<el-table :data="editForm.apoints" style="width: 100%">
							<el-table-column prop="spointphone" label="装货点电话">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.spointphone" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="装货时间" width="200px">
								<template slot-scope="scope">
									<el-date-picker :disabled="canEdit" v-model="scope.row.stime" type="datetime" placeholder="选择日期时间"
									 value-format="yyyy-MM-dd HH:mm:ss" class="rt-input">
									</el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="sprovince" label="省">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.sprovince" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="scity" label="市">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.scity" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="sarea" label="区">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.sarea" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="saddress" label="详细地址">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.saddress" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="sgrade" label="等级">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.sgrade" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="snanbei" label="南北方界定">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.snanbei" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<!-- <el-table-column fixed="right" label="操作">
								<template slot-scope="scope">
									<el-button :disabled="canEdit" @click.native.prevent="deleteApoints(scope.$index, editForm.apoints)">移除</el-button>
								</template>
							</el-table-column> -->
						</el-table>
					</template>
					<!-- <el-button :disabled="canEdit" @click="addApoints(editForm.apoints)">添加</el-button> -->
				</el-form-item>

				<el-form-item label="卸货信息">
					<template>
						<el-table :data="editForm.upoints" style="width: 100%">
							<el-table-column prop="spointphone" label="卸货点电话">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.dpointphone" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="卸货时间" width="200px">
								<template slot-scope="scope">
									<el-date-picker :disabled="canEdit" v-model="scope.row.dtime" type="datetime" placeholder="选择日期时间"
									 value-format="yyyy-MM-dd HH:mm:ss" class="rt-input">
									</el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="sprovince" label="省">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.dprovince" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="scity" label="市">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.dcity" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="sarea" label="区">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.darea" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="saddress" label="详细地址">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" v-model="scope.row.daddress" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="dgrade" label="等级">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.dgrade" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="dnanbei" label="南北方界定">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.dnanbei" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<!-- <el-table-column fixed="right" label="操作">
								<template slot-scope="scope">
									<el-button :disabled="canEdit" @click.native.prevent="deleteUpoints(scope.$index, editForm.upoints)">移除</el-button>
								</template>
							</el-table-column> -->
						</el-table>
					</template>
					<!-- <el-button :disabled="canEdit" @click="addUpoints(editForm.upoints)">添加</el-button> -->
				</el-form-item>

				<div style="display: flex;">
					<el-form-item label="司机" prop="lienses" class="rt-input">
						<el-input disabled v-model="editForm.Lidriver"></el-input>
					</el-form-item>
					<el-form-item label="车牌号" prop="searchDriver" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.lienses"></el-input>
					</el-form-item>
					
					<el-form-item label="负责配管" prop="lienses" class="rt-input">
						<el-input disabled v-model="editForm.dispatch"></el-input>
					</el-form-item>
				</div>


				<div v-if="showDisDetails">
					<div style="display: flex;">
						<el-form-item label="司机已交定金" prop="depositis" class="rt-input">
							<el-input disabled v-model="editForm.depositis"></el-input>
						</el-form-item>
						<el-form-item label="定金是否已退还" prop="returnd" class="rt-input">
							<el-input disabled v-model="editForm.returnd"></el-input>
						</el-form-item>
						<el-form-item label="运费是否结算" prop="freight" class="rt-input">
							<el-input disabled v-model="editForm.freight"></el-input>
						</el-form-item>
						<el-form-item label="风险备注" prop="risknote" class="rt-input">
							<el-input disabled v-model="editForm.risknote"></el-input>
						</el-form-item>
					</div>

					<div style="display: flex;">
						<el-form-item label="调整后利润" prop="profits" class="rt-input">
							<el-input disabled v-model="editForm.profits"></el-input>
						</el-form-item>
						<el-form-item label="调整原因" prop="why" class="rt-input">
							<el-input disabled v-model="editForm.why"></el-input>
						</el-form-item>
						<el-form-item label="回单是否已结算" prop="returnis" class="rt-input">
							<el-input disabled v-model="editForm.returnis"></el-input>
						</el-form-item>
						<el-form-item label="回单完结备注" prop="returnote" class="rt-input">
							<el-input disabled v-model="editForm.returnote"></el-input>
						</el-form-item>
					</div>
					<div style="display: flex;">
						<el-form-item label="回单附件" prop="riskpicture" class="rt-input">
							<el-image style="width: 200px;" :src="editForm.riskpicture"></el-image>
						</el-form-item>
						<el-form-item label="风险附件" prop="riskpicture" class="rt-input">
							<el-image style="width: 200px;" :src="editForm.riskpicture"></el-image>
						</el-form-item>
					</div>

				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">

				<el-button @click="editDialogVisible = false">关 闭</el-button>
				<!-- <el-button v-if="canEdit" :disabled="canClickEdit" type="primary" @click="handlecanEdit">修 改</el-button> -->
				<!-- <el-button v-else type="primary" @click="editInfo">确 定</el-button> -->
			</span>

		</el-dialog>


	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 多选框数据
					no:[],
				// 查询数据 waybilltypeList
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id",
					chepai: '',
					startime: '',
					endtime: '',

				},
				stateOptions: [{
					value: '2',
					label: '审核完成'
				}, {
					value: '3',
					label: '司机接单'
				}, {
					value: '4',
					label: '司机拒单'
				},
				 {
					value: '5',
					label: '待完结'
				},
				{
					value: '6',
					label: '订单取消'
				}],
				selectTime: [],
				// 分页列表
				List: [],
				// 总条数
				total: 0,
				// 显示大图数组
				srcList: [],

				// 编辑对话框数据
				editDialogVisible: false,
				editForm: {
					Lidriver: '',
					dispatch: '',
				},
				// 能否修改
				canEdit: true,
				// 修改按钮可否点击
				canClickEdit: true,
				// 订单完结，显示配送详情
				showDisDetails: false,
				// 显示司机拒单原因：
				showRefusenote: false,

				// 派单类型
				waybilltypeList: [{
					value: '前置派单',
					label: '前置派单'
				}, {
					value: '正常派单',
					label: '正常派单'
				}, {
					value: '补录派单',
					label: '补录派单'
				}],
				// 订单来源
				sourceList: [{
					value: '运满满',
					label: '运满满'
				}, {
					value: '货拉拉',
					label: '货拉拉'
				}, {
					value: '专线',
					label: '专线'
				}, {
					value: '签约工厂',
					label: '签约工厂'
				}, {
					value: '签约货站',
					label: '签约货站'
				}, {
					value: '其他',
					label: '其他'
				}],
				// 是否超高超重
				overweightList: [{
					value: '是',
					label: '是'
				}, {
					value: '否',
					label: '否'
				}],
				// 是否禁行
				banList: [{
					value: '是',
					label: '是'
				}, {
					value: '否',
					label: '否'
				}],
				testList:['00071','00072','00073'],
			}
		},
		created() {
			const role = window.sessionStorage.getItem('role')
			if (role == '管理员') {

			} else if (role == '调度主管') {
				
			} else if (role == '调度配送') {
				this.queryInfo.userid = window.sessionStorage.getItem('userID') - 0
			} else if (role == '调度运单') {
				this.queryInfo.userid = window.sessionStorage.getItem('userID') - 0
			} else {
				this.queryInfo.userid = window.sessionStorage.getItem('userID') - 0
			}
			this.getList()
		},
		methods: {
			// 多选框保持选中
			getLicense(row){
				return row.license
			},
			// 清空选中
			handleClearBtn(){
				this.$refs.tableRef.clearSelection()
			},
			// 多选框变化
			handleSelectionChange(e) {
				// console.log(e)
				this.no=[]
				e.forEach(v=>{
				this.no.push(v.no)
				})
				// e.forEach(v=>{
				// 	if(this.no.indexOf(v.no) == -1){
				// 		this.no.push(v.no)
				// 	}					
				// })
				// console.log(this.no)
			},
			// 导出
			async handleExport(){
				if(!this.no[0]){return this.$message.warning('请选择需要导出的数据！')}
				
				let url = 'https://tkhhd.com/jeecg-boot/YMpageController/selectDingDanX?'+this.$qs.stringify({ no: this.no }, { arrayFormat: 'repeat' })
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
						a.download = "订单报表.xlsx" // 文件名
						a.click()
						window.URL.revokeObjectURL(url)
						a.remove()
						that.fullscreenLoading = false;
					}
				xhr.send();
				// !!!下面代码为location.href方法，不能携带token
				// const {data:res} = await this.$http.get('YMpageController/selectDingDanX?'+this.$qs.stringify({ no: this.no }, { arrayFormat: 'repeat' }))
				// window.location.href = 'http://81.70.151.121:8080/jeecg-boot/YMpageController/selectDingDanX?'+this.$qs.stringify({ no: this.no }, { arrayFormat: 'repeat' })
			},
			//分页区域
			// 根据分页查询列表srcList
			async getList() {
				const {
					data: res
				} = await this.$http.get('waybill/listyundan', {
					params: this.queryInfo
				})
				console.log('list', res)
				this.List = res.rows
				this.total = res.total
				this.List.forEach(v => {
					if (v.state == 0) {
						v.stateText = "驳回"
					} else if (v.state == 1) {
						v.stateText = "审核中"
					} else if (v.state == 2) {
						v.stateText = "审核完成"
					} else if (v.state == 3) {
						v.stateText = "司机已接单"
					} else if (v.state == 4) {
						v.stateText = "司机已拒单"
					}else if (v.state == 5) {
						v.stateText = "待完结"
					}else if (v.state == 6) {
						v.stateText = "订单取消"
					}
				})
			},
			//点击查看放大图片
			handleClickImage(src) {
				this.srcList = []
				this.srcList.push(src)
			},

			// 点击查询按钮
			handleQueryBtn() {
				// console.log(this.selectTime)
				this.queryInfo.startime = this.selectTime[0]
				this.queryInfo.endtime = this.selectTime[1]
				this.getList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.chepai = ''
				this.queryInfo.startime = ''
				this.queryInfo.endtime = ''
				this.queryInfo.state = ''
				this.selectTime = []
				this.getList()
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getList()
			},

			// 详情对话框操作
			// 展示详情的对话框
			async showEditDialog(plistNo) {
				// console.log(plistNo)
				this.canClickEdit = true
				this.showDisDetails = false
				const {
					data: res
				} = await this.$http.get('waybill/findListPage?plistNo=' + plistNo)
				// console.log('详情', res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.editForm = res.result[0]
				this.editForm.LilicensePlate = this.editForm.liensess.licensePlate
				this.editForm.Lidriver = this.editForm.cars.name
				this.editForm.dispatch = this.editForm.liensess.dispatch
				// if(this.editForm.refusenote){
				// 	this.showRefusenote = true
				// }
				if (res.result[0].state == 0) {
					this.canClickEdit = false
				} else if (res.result[0].state == 1) {
					this.canClickEdit = true
				} else if (res.result[0].state == 2) {
					this.canClickEdit = true
					this.showDisDetails = true
				} else if (res.result[0].state == 3) {
					this.canClickEdit = true
				} else if (res.result[0].state == 4) {
					this.canClickEdit = true
					this.showRefusenote = true
				}

				// 显示对话框
				this.editDialogVisible = true
			},

			// 监听修改用户对话框关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
				this.canEdit = true
				this.showRefusenote = false
			},
			

		}
	}
</script>

<style scoped>
	.rt-input /deep/ .el-input__inner {
		color: #606266 !important;

	}

	/* 要实现驳回原因的label字体变红，需要把scoped去掉，但是去掉，上边禁用字体颜色样式就不起效果 */
	.redItem .el-form-item__label {
		color: red;
	}
</style>
