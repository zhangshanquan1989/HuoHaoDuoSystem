<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>配送管理</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<!-- 创建按钮 -->

			<el-input v-model="queryInfo.noText" placeholder="运单编号" clearable style="width: 200px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>

			<el-table :data="pageList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
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
				<el-table-column prop="picture" label="运单截图" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
							<el-image style="width: 80px; height: 40px" :src="scope.row.picture" :preview-src-list="srcList" @click="handleClickImage(scope.row.picture)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
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
				<el-table-column prop="kilometer" label="每公里成本" width="150px">
				</el-table-column>
				<el-table-column prop="lienses" label="车牌号" width="150px">
				</el-table-column>
				<el-table-column prop="creater" label="创建者" width="150px">
				</el-table-column>
				<el-table-column prop="creatime" label="创建时间" width="180px">
				</el-table-column>
				<el-table-column prop="stateText" label="订单状态" width="120px" fixed="right">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.stateText=='待审核' || scope.row.stateText=='司机已接单' || scope.row.stateText=='待完结'?'red':'black'}">{{scope.row.stateText}}</span>
					</template>
				</el-table-column>
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

		<!-- 分页区域 -->
		<el-col>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
			 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" style="margin-top: 5px;">
			</el-pagination>
		</el-col>

		<!-- 详情的对话框 -->
		<el-dialog title="订单详情" :visible.sync="editDialogVisible" width="80%" @close="editDialogClosed">
			<!-- 详情的表单 -->
			<el-form :model="editForm" ref="editFormRef" label-width="140px">
				<el-form-item v-if="showRefusenote" label="司机拒单原因:" prop="refusenote" class="redItem">
					<div style="color: red;">{{this.editForm.refusenote}}</div>
				</el-form-item>
				<div style="display: flex;">
					<el-form-item label="运单编号" prop="no" class="rt-input">
						<el-input disabled v-model="editForm.no"></el-input>
					</el-form-item>
					<el-form-item label="派单类型" prop="waybilltype" class="rt-input">
						<el-input disabled v-model="editForm.waybilltype"></el-input>
					</el-form-item>
					<el-form-item label="订单来源" prop="source" class="rt-input">
						<el-input disabled v-model="editForm.source"></el-input>
					</el-form-item>
					<el-form-item label="当日负责配管" prop="people" class="rt-input">
						<el-input disabled v-model="editForm.people"></el-input>
					</el-form-item>
				</div>

				<div style="display: flex;">
					<el-form-item label="货物名称" prop="goodsname" class="rt-input">
						<el-input disabled v-model="editForm.goodsname"></el-input>
					</el-form-item>
					<el-form-item label="货物重量/方数" prop="goodsweight" class="rt-input">
						<el-input disabled v-model="editForm.goodsweight"></el-input>
					</el-form-item>
					<el-form-item label="是否超高/宽/重" prop="overweight" class="rt-input">
						<el-input disabled v-model="editForm.overweight"></el-input>
					</el-form-item>
					<el-form-item label="是否禁行" prop="ban" class="rt-input">
						<el-input disabled v-model="editForm.ban"></el-input>
					</el-form-item>

				</div>



				<div style="display: flex;">
					<el-form-item label="空车距离" prop="emptydistance" class="rt-input">
						<el-input disabled v-model="editForm.emptydistance+'km'"></el-input>
					</el-form-item>
					<el-form-item label="高速预计距离" prop="highspeed" class="rt-input">
						<el-input disabled v-model="editForm.highspeed+'km'"></el-input>
					</el-form-item>
					<el-form-item label="下道预计距离" prop="estimatedistance" class="rt-input">
						<el-input disabled v-model="editForm.estimatedistance+'km'"></el-input>
					</el-form-item>
					<el-form-item label="总距离" prop="km" class="rt-input">
						<el-input disabled v-model="editForm.km+'km'"></el-input>
					</el-form-item>
				</div>

				<div style="display: flex;">
					<el-form-item label="定金" prop="deposit" class="rt-input">
						<el-input disabled v-model="editForm.deposit+'元'"></el-input>
					</el-form-item>
					<el-form-item label="到付" prop="pay" class="rt-input">
						<el-input disabled v-model="editForm.pay+'元'"></el-input>
					</el-form-item>
					<el-form-item label="到车" prop="car" class="rt-input">
						<el-input disabled v-model="editForm.car+'元'"></el-input>
					</el-form-item>
					<el-form-item label="费用" prop="cost" class="rt-input">
						<el-input disabled v-model="editForm.cost+'元'"></el-input>
					</el-form-item>
					<el-form-item label="利润" prop="nearcost" class="rt-input">
						<el-input disabled v-model="editForm.nearcost+'元'"></el-input>
					</el-form-item>


				</div>
				<div style="display: flex;">
					<el-form-item label="下单客户" prop="aclient" class="rt-input">
						<el-input disabled v-model="editForm.aclient"></el-input>
					</el-form-item>
					<el-form-item label="收单客户" prop="uclient" class="rt-input">
						<el-input disabled v-model="editForm.uclient"></el-input>
					</el-form-item>
				</div>

				<el-form-item label="运单截图" prop="picture">
					<el-image v-if="editForm.picture" style="width: 200px;" :src="editForm.picture"></el-image>
				</el-form-item>

				<el-form-item label="装货信息">
					<template>
						<el-table :data="editForm.apoints" style="width: 100%">
							<el-table-column prop="spointphone" label="装货点电话">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.spointphone" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="装货时间" width="200">
								<template slot-scope="scope">
									<el-date-picker disabled v-model="scope.row.stime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"
									 class="rt-input">
									</el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="sprovince" label="省">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.sprovince" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="scity" label="市">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.scity" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="sarea" label="区">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.sarea" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<!-- <el-table-column prop="saddress" label="详细地址">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.saddress" class="rt-input"></el-input>
								</template>
							</el-table-column> -->
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
						</el-table>
					</template>
				</el-form-item>

				<el-form-item label="卸货信息">
					<template>
						<el-table :data="editForm.upoints" style="width: 100%">
							<el-table-column prop="spointphone" label="卸货点电话">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.dpointphone" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="卸货时间" width="200">
								<template slot-scope="scope">
									<el-date-picker disabled v-model="scope.row.dtime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"
									 class="rt-input">
									</el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="sprovince" label="省">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.dprovince" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="scity" label="市">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.dcity" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="sarea" label="区">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.darea" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<!-- <el-table-column prop="saddress" label="详细地址">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.daddress" class="rt-input"></el-input>
								</template>
							</el-table-column> -->
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
						</el-table>
					</template>
				</el-form-item>

				<div style="display: flex;">
					<el-form-item label="司机" prop="Lidriver" class="rt-input">
						<el-input disabled v-model="editForm.Lidriver"></el-input>
					</el-form-item>
					<el-form-item label="车牌号" prop="lienses" class="rt-input">
						<el-input disabled v-model="editForm.lienses"></el-input>
					</el-form-item>

					<el-form-item label="负责配管" prop="dispatch" class="rt-input">
						<el-input disabled v-model="editForm.dispatch"></el-input>
					</el-form-item>
				</div>


				<div v-if="showDisDetails">
					<div style="display: flex;">
						<el-form-item label="司机已交订单" prop="depositis" class="rt-input">
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
			<!-- <el-button @click="repeat">转 发</el-button> -->
			<span slot="footer" class="dialog-footer">
				<el-popover  placement="top" width="150" trigger="hover" style="margin-right: 10px;">
					<div>微信扫码分享</div>
					<div id="qrcode" ref="qrcode"></div>
					<el-button slot="reference" class="el-icon-share" type="primary">分 享</el-button>
				</el-popover>
				<!-- <el-button type="primary" class="el-icon-share" :data-clipboard-text="shareUrl" @click="clickShareUrl">分享</el-button> -->
				
				<el-button @click="editDialogVisible = false">关 闭</el-button>

				<el-popconfirm title="确定驳回？" @confirm="selectRejected" style="margin-left: 10px;" v-if="showSelectArea">
					<el-button type="primary" slot="reference">驳 回</el-button>
				</el-popconfirm>


				<el-popconfirm title="司机拒单？" @confirm="driverReject" style="margin-left: 10px;" v-if="showSelectArea">
					<el-button type="primary" slot="reference">司机拒单</el-button>
				</el-popconfirm>
				<el-popconfirm title="司机接单？" @confirm="driverAgree" style="margin-left: 10px;" v-if="showSelectArea">
					<el-button type="primary" slot="reference">司机接单</el-button>
				</el-popconfirm>

				<!-- <el-popconfirm title="订单已完结？" @confirm="orderDone" style="margin-left: 10px;" v-if="showOrderDone">
					<el-button type="primary" slot="reference">订单完结</el-button>
				</el-popconfirm> -->

			</span>


			<el-divider v-if="showRejected">请填写驳回原因</el-divider>
			<el-form v-if="showRejected" :model="rejectedForm" ref="rejectedFormRef" label-width="100px">
				<el-form-item label="驳回原因" prop="note" class="rt-input">
					<el-input v-model="rejectedForm.note"></el-input>
				</el-form-item>
			</el-form>
			<span v-if="showRejected" slot="footer" class="dialog-footer">
				<!-- 			<el-button @click="editDialogVisible = false">关 闭</el-button> -->
				<el-button type="primary" @click="handleRejected">确 定</el-button>
			</span>

			<el-divider v-if="showDriverReject">请填写司机拒单原因</el-divider>
			<el-form v-if="showDriverReject" :model="rejectedForm" ref="rejectedFormRef" label-width="100px">
				<el-form-item label="司机拒单原因" prop="note" class="rt-input">
					<el-input v-model="driverRejectForm.note"></el-input>
				</el-form-item>
			</el-form>
			<span v-if="showDriverReject" slot="footer" class="dialog-footer">
				<!-- 			<el-button @click="editDialogVisible = false">关 闭</el-button> -->
				<el-button type="primary" @click="handleDriverReject">确 定</el-button>
			</span>

			<el-divider v-if="showApproved">请完善以下内容</el-divider>
			<el-form v-if="showApproved" :model="approvedForm" ref="approvedFormRef" label-width="120px">
				<el-form-item v-if="false" label="运单管理ID:" prop="id" class="rt-input">
					<el-input v-model="approvedForm.id" v-if="false"></el-input>
				</el-form-item>
				<div style="display: flex;">
					<el-form-item label="司机已交订单" prop="depositis" class="rt-input">
						<el-select v-model="approvedForm.depositis" clearable>
							<el-option v-for="item in depositisList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="定金是否已退还" prop="returnd" class="rt-input">
						<el-select v-model="approvedForm.returnd" clearable>
							<el-option v-for="item in returndList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="运费是否结算" prop="freight" class="rt-input">
						<el-select v-model="approvedForm.freight" clearable>
							<el-option v-for="item in freightList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<div style="display: flex;">
					<el-form-item label="调整后利润" prop="profits" class="rt-input">
						<el-input v-model="approvedForm.profits" style="width: 217px;"></el-input>
					</el-form-item>
					<el-form-item label="调整原因" prop="why" class="rt-input">
						<el-input v-model="approvedForm.why" style="width: 217px;"></el-input>
					</el-form-item>
					<el-form-item label="回单是否已结算" prop="returnis" class="rt-input">
						<el-select v-model="approvedForm.returnis" clearable>
							<el-option v-for="item in returnisList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</div>

				<div style="display: flex;">
					<el-form-item label="回单完结备注" prop="returnote" class="rt-input">
						<el-input v-model="approvedForm.returnote" style="width: 500px;"></el-input>
					</el-form-item>
					<el-form-item label="风险备注" prop="risknote" class="rt-input">
						<el-input v-model="approvedForm.risknote" style="width: 500px;"></el-input>
					</el-form-item>
				</div>


				<el-form-item label="回单附件" prop="returnpicture">
					<el-image v-if="approvedForm.returnpicture" style="width: 150px;" :src="approvedForm.returnpicture"></el-image>
					<el-upload name="imgFile" :action="updateReturnUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleReturnSuccess"
					 :show-file-list="false">
						<el-button size="small" type="primary" plain>上传回单附件</el-button>
					</el-upload>
				</el-form-item>

				<el-form-item label="风险附件" prop="riskpicture">
					<el-image v-if="approvedForm.riskpicture" style="width: 150px;" :src="approvedForm.riskpicture"></el-image>
					<el-upload name="imgFile" :action="updateRiskUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleRiskSuccess"
					 :show-file-list="false">
						<el-button size="small" type="primary" plain>上传风险附件</el-button>
					</el-upload>
				</el-form-item>

			</el-form>
			<!-- <div id="qrcode" ref="qrcode" v-show="qrcodeShow"></div> -->
			<span v-if="showApproved" slot="footer" class="dialog-footer">
				<!-- 			<el-button @click="editDialogVisible = false">关 闭</el-button> -->
				<!-- <el-popconfirm title="订单已完结？" @confirm="orderDone" style="margin-left: 10px;" v-if="showOrderDone">
					<el-button type="primary" slot="reference">订单完结</el-button>
				</el-popconfirm> -->
				<el-button type="primary" @click="handleSave" style="margin-left: 10px;">保存</el-button>
				<el-popconfirm title="完结后不可修改,确认完结？" style="margin-left: 10px;" @confirm="handleApproved" v-if="showApproved">
					<el-button type="primary" slot="reference">订单完结</el-button>
				</el-popconfirm>
			</span>

		</el-dialog>


	</div>
</template>

<script>
	// 引入二维码生成qrcodejs2
	import QRCode from '../../plugins/qrcode.js'
	export default {
		data() {
			return {
				// 上传图片需要携带token 分享 appendChild 
				myHeaders: {
					satoken: window.sessionStorage.getItem('satoken')
				},
				// 复制的链接
				shareUrl: '',
				// 查询数据
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id",
				},
				// 分页列表
				pageList: [],
				// 总条数
				total: 0,
				srcList: [],

				// 编辑对话框数据
				editDialogVisible: false,
				editForm: {
					Lidriver: '',
					dispatch: '',
				},

				// 显示操作区
				showSelectArea: false,
				// 显示驳回
				showRejected: false,
				// 显示订单完结按钮
				showOrderDone: false,
				// 显示审核通过
				showApproved: false,
				// 订单完结，显示配送详情
				showDisDetails: false,

				// 驳回数据
				rejectedForm: {
					note: ''
				},
				// 司机拒单显示
				showDriverReject: false,
				// 司机拒单数据
				driverRejectForm: {
					id: '',
					note: ''
				},
				// 审核通过数据
				approvedForm: {
					returnpicture: '',
					riskpicture: '',
					id: '',
					depositis: '',
					returnd: '',
					freight: '',
					profits: '',
					why: '',
					returnis: '',
					returnote: '',
					risknote: '',
				},
				// 司机是否已交订单
				depositisList: [{
					value: '是',
					label: '是'
				}, {
					value: '否',
					label: '否'
				}],
				// 定金是否已退还
				returndList: [{
					value: '是',
					label: '是'
				}, {
					value: '否',
					label: '否'
				}],
				// 运费是否结算
				freightList: [{
					value: '是',
					label: '是'
				}, {
					value: '否',
					label: '否'
				}],
				// 回单是否结算
				returnisList: [{
					value: '是',
					label: '是'
				}, {
					value: '否',
					label: '否'
				}],
				// 车辆状态

				// 转发的订单编号
				repeatPlistNo: '',
				encryptionPlistNo: '',
				// 显示司机拒单原因：
				showRefusenote: false,

				updateReturnUrl: "http://81.70.151.121:8080/jeecg-boot/distribution/uploadreturnpicture",
				updateRiskUrl: "http://81.70.151.121:8080/jeecg-boot/distribution/uploadriskpicture",

				// 微信转发的数据
				// appid
				appid: 'wx46f6d9e34185a909',
				// 当前网址：
				oldUrl: 'http://tkhhd.com/',
				// 转码后网址：
				newUrl: '',
				newnewUrl: '',
				qrcodeOb:{},
				qrcodeShow:false,
			}
		},
		created() {
			const role = window.sessionStorage.getItem('role')
			if (role == '管理员') {

			} else if (role == '调度主管') {
				this.queryInfo.partid = window.sessionStorage.getItem('departmentId') - 0
			} else if (role == '调度组员') {
				this.queryInfo.disuserid = window.sessionStorage.getItem('userID') - 0
			} else {
				this.queryInfo.disuserid = window.sessionStorage.getItem('userID') - 0
			}

			this.getPageList()
			// this.getBaseInfos()
		},
		methods: {
			// 生成二维码
			qrcode(url) {
				console.log(url)
				this.qrcodeOb = new QRCode("qrcode", {
					width: 150, // 二维码宽度，单位像素
					height: 150, // 二维码高度，单位像素
					text: url // 生成二维码的链接
				});
			},

			// 编码函数			
			urlencode(str) {
				str = (str + '').toString();
				return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
				replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
			},

			// 获取code
			getBaseInfos() {
				this.newUrl = this.urlencode(this.oldUrl)
				console.log(this.newUrl)
				var url_code = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.appid +
					"&redirect_uri=" + this.shareUrl +
					"&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
				console.log(url_code)
				// window.location.href = url_code; //打开这个链接，你的url后面就会跟上code的参数

			},
			
			// 展示二维码
			clickShareUrl(){
				this.qrcodeShow = !this.qrcodeShow
			},
			// // 复制链接
			// async clickShareUrl() {
			// 	let clipboard = new this.Clipboard(".el-icon-share");
			// 	clipboard.on("success", e => {
			// 		// 释放内存
			// 		// console.log(e)
			// 		this.$message.success('已成功复制')
			// 		clipboard.destroy();
			// 	});
			// },

			// 点击跳转
			repeat(e) {
				this.$router.push({
					path: '/phonePage/' + this.encryptionPlistNo
				})
				// console.log(this.repeatPlistNo)
			},

			//分页区域
			// 根据分页查询列表
			async getPageList() {
				const {
					data: res
				} = await this.$http.get('waybill/listdis', {
					params: this.queryInfo
				})

				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// this.$message.success('获取信息成功')
				this.pageList = res.result.records
				this.total = res.result.total
				this.pageList.forEach(v => {
					if (v.state == 0) {
						v.stateText = "驳回"
					} else if (v.state == 1) {
						v.stateText = "待审核"
					} else if (v.state == 2) {
						v.stateText = "审核完成"
					} else if (v.state == 3) {
						v.stateText = "司机已接单"
					} else if (v.state == 4) {
						v.stateText = "司机已拒单"
					} else if (v.state == 5) {
						v.stateText = "待完结"
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
				this.queryInfo.no = "*" + this.queryInfo.noText + "*"
				this.getPageList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.no = ''
				this.queryInfo.noText = ''
				this.getPageList()
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getPageList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getPageList()
			},

			// 详情对话框操作
			// 展示详情的对话框
			async showEditDialog(plistNo) {
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
				this.rejectedForm.id = res.result[0].id
				this.approvedForm = res.result[0]
				this.driverRejectForm.id = res.result[0].id
				this.repeatPlistNo = res.result[0].no
				if (res.result[0].state == 0) {

				} else if (res.result[0].state == 1) {
					this.showSelectArea = true
				} else if (res.result[0].state == 2) {

					this.showDisDetails = true
				} else if (res.result[0].state == 3) {
					this.showApproved = true
					// this.showOrderDone = true
				} else if (res.result[0].state == 4) {
					this.showRefusenote = true
				} else if (res.result[0].state == 5) {
					this.showApproved = true
				}
				// 对订单号进行加密，用于复制链接
				const {
					data: res2
				} = await this.$http.get('waybill/jiami?plistNo=' + this.repeatPlistNo)

				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.encryptionPlistNo = res2.result.加密后订单号
				this.shareUrl = 'http://tkhhd.com/#/phonePage/' + res2.result.加密后订单号
				this.newnewUrl = this.urlencode(this.shareUrl)
				var url_code = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + this.appid +
					"&redirect_uri=" + this.newnewUrl +
					"&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
				console.log(url_code)
				// this.qrcode(url_code)
				this.$nextTick(() => {
				    this.qrcode(url_code)
				})
				// 显示对话框
				this.editDialogVisible = true
			},

			// 选择驳回
			selectRejected() {
				this.showSelectArea = false
				this.showRejected = true
			},
			// 司机拒单
			driverReject() {
				this.showDriverReject = true
				this.showSelectArea = false
			},
			// 填写司机拒单
			async handleDriverReject() {
				const {
					data: res
				} = await this.$http.get('waybill/sijijudan', {
					params: this.driverRejectForm
				})

				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// 更新成功，关闭对话框，刷新数据列表，提示修改成功
				this.editDialogVisible = false

				this.getPageList()
			},
			// 司机接单
			async driverAgree() {
				const {
					data: res
				} = await this.$http.get('waybill/sijijiedan?id=' + this.editForm.id)

				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// 更新成功，关闭对话框，刷新数据列表，提示修改成功
				this.editDialogVisible = false

				this.getPageList()
			},

			// 提交驳回
			handleRejected() {

				this.$refs.rejectedFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.get('distribution/bohui', {
						params: this.rejectedForm
					})

					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false

					this.getPageList()
					this.$message.success(res.message)
				})
			},

			// 订单完结，填写信息
			orderDone() {
				this.showOrderDone = false
				this.showApproved = true
			},
			// 司机接单后保存数据
			handleSave() {
				this.$refs.approvedFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.post('distribution/addbaocun', this.approvedForm)

					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getPageList()
					// this.$message.success('更新信息成功')
				})
			},

			// 提交审核通过
			handleApproved() {
				this.$refs.approvedFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.post('distribution/add', this.approvedForm)

					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getPageList()
					// this.$message.success('更新信息成功')
				})
			},

			// 回单附件图片上传成功的回调
			handleReturnSuccess(response, file, fileList) {

				this.approvedForm.returnpicture = response.result.returnpictureFileName
			},
			// 风险备注图片上传成功的回调
			handleRiskSuccess(response, file, fileList) {

				this.approvedForm.riskpicture = response.result.riskpictureFileName
			},
			// 清除二维码
			isShowOpen() {
			      const codeHtml = document.getElementById("qrcode");
			      codeHtml.innerHTML = "";
			   },

			// 监听修改用户对话框关闭事件
			editDialogClosed() {
				this.isShowOpen();
				this.$refs.editFormRef.resetFields()
				if (this.$refs.rejectedFormRef) {
					this.$refs.rejectedFormRef.resetFields()
				}
				if (this.$refs.approvedFormRef) {
					this.$refs.approvedFormRef.resetFields()
				}
				this.showSelectArea = false
				this.showRejected = false
				this.showApproved = false
				this.showOrderDone = false
				this.showDriverReject = false
				this.showRefusenote = false
				this.showDisDetails = false
				
			},
		}
	}
</script>

<style scoped>
	.rt-input /deep/ .el-input__inner {
		color: #606266 !important;

	}
</style>
