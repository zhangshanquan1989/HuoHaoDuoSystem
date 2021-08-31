<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>运单管理</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<!-- 创建按钮 -->
			<el-button type="primary" plain @click="addDialogVisible = true">创建</el-button>
			<el-input v-model="queryInfo.noText" placeholder="运单编号" clearable style="width: 200px;margin-left: 50px;" ></el-input>
			<el-input v-model="queryInfo.driverNew" placeholder="司机名" clearable style="width: 200px;margin-left: 20px;"></el-input>
			<el-input v-model="queryInfo.createrNew" placeholder="创建者" clearable style="width: 200px;margin-left: 20px;"></el-input>
			<!-- <el-date-picker v-model="queryInfo.creatimeNew" type="date" placeholder="创建日期"  format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd" style="width: 200px;margin-left: 20px;">
			    </el-date-picker> -->
			<el-select v-model="queryInfo.state" placeholder="状态查询" style="margin-left: 20px;">
				<el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 20px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>

			<el-table :data="wybillList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="id" label="ID" v-if="false">
				</el-table-column>
				<el-table-column fixed prop="no" label="运单编号" width="100px">
				</el-table-column>
				<el-table-column prop="driver" label="司机名" width="100px">
				</el-table-column>
				<el-table-column prop="lienses" label="车牌号" width="150px">
				</el-table-column>
				<el-table-column prop="creater" label="创建者" width="150px">
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
				<el-table-column prop="creatime" label="创建时间" width="180px" fixed="right">
				</el-table-column>
				<el-table-column prop="stateText" label="订单状态" width="120px" fixed="right">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.stateText=='审核中'||scope.row.stateText=='已驳回'?'red':'black'}">{{scope.row.stateText}}</span>
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

		<!-- 创建的对话框  -->
		<el-dialog title="创建运单信息" :visible.sync="addDialogVisible" width="85%" :close-on-click-modal="false" @close="addDialogClosed">
			<!-- 创建的表单   -->
			<el-form :model="addForm" ref="addFormRef" label-width="140px" :rules="addRules">
				<div style="display: flex;">
					<el-form-item label="司机名" prop="driver">
						<el-select v-model="addForm.driver" clearable filterable remote placeholder="请输入司机名" :remote-method="chooseDriverName"
						 :loading="driverNameLoading" @change="handleChooseDriverName">
							<el-option v-for="item in driverNameOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="车牌号" prop="lienses">
						<el-input disabled v-model="addForm.lienses"></el-input>
					</el-form-item>
					<el-form-item label="负责配管" prop="dispatch">
						<el-input disabled v-model="addForm.dispatch"></el-input>
					</el-form-item>
					<!-- <el-form-item >
						<el-button type="primary"  style="margin-left: 10px;" @click="showLocationDialog">查看车辆位置</el-button>
					</el-form-item> -->
					
				</div>
				<div style="display: flex;">
					<el-form-item label="行驶证" prop="xingshizhengSrc" width="200px">
						<el-image  style="width: 150px;" :src="xingshizhengSrc" :preview-src-list="srcList" @click="handleClickImage(xingshizhengSrc)">
							<div slot="error" class="image-slot">
							        <i class="el-icon-picture-outline"></i>
							      </div>
						</el-image>
					</el-form-item>
					<el-form-item label="驾驶证" prop="jiashizhengSrc" width="200px">
						<el-image  style="width: 150px;" :src="jiashizhengSrc" :preview-src-list="srcList" @click="handleClickImage(jiashizhengSrc)">
							<div slot="error" class="image-slot">
							        <i class="el-icon-picture-outline"></i>
							      </div>
						</el-image>
					</el-form-item>
					<el-form-item label="身份证" prop="shenfenzhengSrc" width="200px">
						<el-image  style="width: 150px;" :src="shenfenzhengSrc" :preview-src-list="srcList" @click="handleClickImage(shenfenzhengSrc)">
							<div slot="error" class="image-slot">
							        <i class="el-icon-picture-outline"></i>
							      </div>
						</el-image>
					</el-form-item>
					<el-form-item label="上岗证" prop="shanggangzhengSrc" width="200px">
						<el-image  style="width: 150px;" :src="shanggangzhengSrc" :preview-src-list="srcList" @click="handleClickImage(shanggangzhengSrc)">
							<div slot="error" class="image-slot">
							        <i class="el-icon-picture-outline"></i>
							      </div>
						</el-image>
					</el-form-item>
					
				</div>
				<div style="display: flex;">
					<el-form-item label="运单编号" prop="no">
						<el-input disabled placeholder="自动生成"></el-input>
					</el-form-item>
					<el-form-item label="派单类型" prop="waybilltype">
						<el-select v-model="addForm.waybilltype" placeholder="请选择" clearable>
							<el-option v-for="item in waybilltypeList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订单来源" prop="source">
						<el-select v-model="addForm.source" placeholder="请选择" clearable>
							<el-option v-for="item in sourceList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="当日负责配管" prop="people">
						<el-select v-model="addForm.people" clearable filterable remote placeholder="当日负责配管" :remote-method="choosePeople"
						 :loading="peopleLoading">
							<el-option v-for="item in peopleOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</div>

				<div style="display: flex;">
					<el-form-item label="货物名称" prop="goodsname">
						<el-input v-model="addForm.goodsname"></el-input>
					</el-form-item>
					<el-form-item label="货物重量/方数" prop="goodsweight">
						<el-input v-model="addForm.goodsweight"></el-input>
					</el-form-item>
					<el-form-item label="是否超高/宽/重" prop="overweight">
						<el-select v-model="addForm.overweight" placeholder="请选择" clearable>
							<el-option v-for="item in overweightList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否禁行" prop="ban">
						<el-select clearable v-model="addForm.ban" placeholder="请选择" clearable>
							<el-option v-for="item in banList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</div>

				<div style="display: flex;">
					<el-form-item label="放空距离" prop="emptydistance">
						<el-input clearable v-model="addForm.emptydistance" placeholder="Km" @change="calculateKm"></el-input>
					</el-form-item>
					<el-form-item label="高速预计距离" prop="highspeed">
						<el-input clearable v-model="addForm.highspeed" placeholder="Km" @change="calculateKm"></el-input>
					</el-form-item>
					<el-form-item label="下道预计距离" prop="estimatedistance">
						<el-input clearable v-model="addForm.estimatedistance" placeholder="Km" @change="calculateKm"></el-input>
					</el-form-item>

					<el-form-item label="总距离" prop="km">
						<el-input disabled v-model="addForm.km" placeholder="km"></el-input>
					</el-form-item>

				</div>

				<div style="display: flex;">
					<el-form-item label="定金" prop="deposit">
						<el-input clearable v-model="addForm.deposit" placeholder="元"></el-input>
					</el-form-item>

					<el-form-item label="到付" prop="pay">
						<el-input v-model="addForm.pay" placeholder="元"></el-input>
					</el-form-item>
					<el-form-item label="到车" prop="car">
						<el-input clearable v-model="addForm.car" placeholder="元" @change="calculateNearcost"></el-input>
					</el-form-item>
					<el-form-item label="费用" prop="cost">
						<el-input clearable v-model="addForm.cost" placeholder="元" @change="calculateNearcost"></el-input>
					</el-form-item>
					<el-form-item label="利润" prop="nearcost">
						<el-input disabled v-model="addForm.nearcost" placeholder="元"></el-input>
					</el-form-item>

				</div>

				<div style="display: flex;">
					<el-form-item label="定金备注" prop="djnote">
						<el-input clearable v-model="addForm.djnote" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="卸货方式" prop="upiontway">
						<!-- <el-select v-model="addForm.upiontway" placeholder="请选择" clearable>
							<el-option v-for="item in upiontwayList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select> -->
						<el-input clearable v-model="addForm.upiontway" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="装卸货工具" prop="upiontgj">
						<el-input v-model="addForm.upiontgj"></el-input>
					</el-form-item>
				</div>

				<div style="display: flex;">

					<el-form-item label="是否回单" prop="ishd">
						<el-select v-model="addForm.ishd" placeholder="请选择" clearable @change="ishdChange">
							<el-option v-for="item in ishdList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="回单地址" prop="hdadd" v-if="showhdadd">
						<el-input v-if="showhdadd" v-model="addForm.hdadd"></el-input>
					</el-form-item>
					<el-form-item label="	建议运输方式" prop="yunshu">
						<el-input v-model="addForm.yunshu"></el-input>
					</el-form-item>
					<el-form-item label="建议到达装货时间" prop="daoda">

						<el-date-picker v-model="addForm.daoda" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
						</el-date-picker>

					</el-form-item>

				</div>
				<div style="display: flex;">
					<el-form-item label="订单备注1" prop="ordernote">
						<el-input v-model="addForm.ordernote"></el-input>
					</el-form-item>
					<el-form-item label="订单备注2" prop="ordernotea">
						<el-input v-model="addForm.ordernotea"></el-input>
					</el-form-item>
					<el-form-item label="订单备注3" prop="ordernoteb">
						<el-input v-model="addForm.ordernoteb"></el-input>
					</el-form-item>
				</div>
				<div style="display: flex;">
					<el-form-item label="下单客户" prop="aclient">
						<el-select v-model="addForm.aclient" clearable filterable remote placeholder="请输入公司名称" :remote-method="remoteMethod"
						 :loading="loading" style="width: 300px;" @change="searchUnloadingPoint">
							<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="收单客户" prop="uclient">
						<el-select v-model="addForm.uclient" clearable filterable remote placeholder="请输入公司名称" :remote-method="remoteMethod"
						 :loading="loading" style="width: 300px;" @change="searchUnloadingPoint">
							<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-form-item label="运单截图" prop="picture">
					<el-image v-if="addForm.picture" style="width: 150px;" :src="addForm.picture"></el-image>
					<el-upload name="imgFile" :action="updatePictureUrl" :headers="myHeaders" :auto-upload="true" :on-success="handlePictureUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传运单截图</el-button>
					</el-upload>
				</el-form-item>




				<el-form-item label="装货信息">
					<template>
						<el-table :data="addForm.apoints" style="width: 100%">
							<el-table-column prop="spointphone" label="装货点电话">
								<template slot-scope="scope">
									<el-input v-model="scope.row.spointphone" class="rt-input" placeholder="电话(必填)"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="装货时间">
								<template slot-scope="scope">
									<el-date-picker v-model="scope.row.stime" type="datetime" placeholder="选择日期时间(必填)" value-format="yyyy-MM-dd HH:mm:ss">
									</el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="sprovince" label="省">
								<template slot-scope="scope">
									<el-select v-model="scope.row.sprovince" clearable filterable remote placeholder="省(必填)" @change="sprovinceChange(scope.row.sprovince,scope.$index)">
										<el-option v-for="item in sprovinceOptions" :key="item.index" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="scity" label="市">
								<template slot-scope="scope">
									<el-select v-model="scope.row.scity" clearable filterable remote placeholder="市(必填)" @change="scityChange(scope.row.scity,scope.$index)">
										<el-option v-for="item in scope.row.scityOptions" :key="item.index" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="sarea" label="区">
								<template slot-scope="scope">
									<el-select v-model="scope.row.sarea" clearable filterable remote placeholder="区(必填)" @change="sareaChange(scope.row.sprovince,scope.row.scity,scope.row.sarea,scope.$index)">
										<el-option v-for="item in scope.row.sareaOptions" :key="item.index" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="saddress" label="详细地址">
								<template slot-scope="scope">
									<el-input v-model="scope.row.saddress" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="sgrade" label="市场等级">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.sgrade" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="shuafen" label="南北方界定">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.shuafen" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column fixed="right" label="操作">
								<template slot-scope="scope">
									<el-button @click.native.prevent="deleteApoints(scope.$index, addForm.apoints)">移除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
					<el-button @click="addApoints(addForm.apoints)">添加</el-button>
				</el-form-item>

				<el-form-item label="卸货信息">
					<template>
						<el-table :data="addForm.upoints" style="width: 100%">
							<el-table-column prop="spointphone" label="卸货点电话">
								<template slot-scope="scope">
									<el-input v-model="scope.row.dpointphone" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="卸货时间">
								<template slot-scope="scope">
									<el-date-picker v-model="scope.row.dtime" type="datetime" placeholder="选择日期时间(必填)" value-format="yyyy-MM-dd HH:mm:ss">
									</el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="sprovince" label="省">
								<template slot-scope="scope">
									<el-select v-model="scope.row.dprovince" clearable filterable remote placeholder="省(必填)" @change="dprovinceChange(scope.row.dprovince,scope.$index)">
										<el-option v-for="item in dprovinceOptions" :key="item.index" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="dcity" label="市">
								<template slot-scope="scope">
									<el-select v-model="scope.row.dcity" clearable filterable remote placeholder="市(必填)" @change="dcityChange(scope.row.dcity,scope.$index)">
										<el-option v-for="item in scope.row.dcityOptions" :key="item.index" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="darea" label="区">
								<template slot-scope="scope">
									<el-select v-model="scope.row.darea" clearable filterable remote placeholder="区(必填)" @change="dareaChange(scope.row.dprovince,scope.row.dcity,scope.row.darea,scope.$index)">
										<el-option v-for="item in scope.row.dareaOptions" :key="item.index" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="saddress" label="详细地址">
								<template slot-scope="scope">
									<el-input v-model="scope.row.daddress" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="sgrade" label="市场等级">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.dgrade" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="shuafen" label="南北方界定">
								<template slot-scope="scope">
									<el-input disabled v-model="scope.row.dhuafen" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column fixed="right" label="操作">
								<template slot-scope="scope">
									<el-button @click.native.prevent="deleteUpoints(scope.$index, addForm.upoints)">移除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
					<el-button @click="addUpoints(addForm.upoints)">添加</el-button>
				</el-form-item>




			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-popconfirm title="确定创建？" @confirm="addInfo" style="margin-left: 10px;">
					<el-button type="primary" slot="reference">提 交</el-button>
				</el-popconfirm>
				<!-- <el-button type="primary" @click="addInfo">提 交</el-button> -->
			</span>
		</el-dialog>


		<!-- 详情的对话框 -->
		<el-dialog title="订单详情" :visible.sync="editDialogVisible" width="80%" @close="editDialogClosed" :close-on-click-modal="false">
			<!-- 详情的表单 -->
			<el-form :model="editForm" ref="editFormRef" label-width="140px">

				<el-form-item v-if="!canClickEdit" label="驳回原因" prop="bohuiyuanyin" class="redItem">
					<div style="color: red;">{{this.editForm.bohuiyuanyin}}</div>
				</el-form-item>

				<el-form-item v-if="showRefusenote" label="司机拒单原因" prop="refusenote" class="redItem">
					<div style="color: red;">{{this.editForm.refusenote}}</div>
				</el-form-item>

				<el-form-item v-if="showQuxiao" label="订单取消备注:" prop="quxiaonote" class="redItem">
					<div style="color: red;">{{this.editForm.quxiaonote}}</div>
				</el-form-item>

				<div style="display: flex;">
					<el-form-item label="司机名" prop="searchDriver">
						<el-select v-model="editForm.Lidriver" :disabled="canEdit" clearable filterable remote placeholder="请输入司机名"
						 :remote-method="chooseDriverName" :loading="driverNameLoading" @change="editChooseDriverName" class="rt-input">
							<el-option v-for="item in driverNameOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="车牌号" prop="searchDriver" class="rt-input">
						<!-- <el-select disabled v-model="editForm.lienses" clearable filterable remote placeholder="请输入车牌号"
						 :remote-method="chooseCarLicense" :loading="carLicenseLoading" @change="editChooseCarLicense">
							<el-option v-for="item in carLicenseOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select> -->
						<el-input disabled v-model="editForm.lienses"></el-input>
					</el-form-item>

					<el-form-item label="负责配管" prop="lienses" class="rt-input">
						<el-input disabled v-model="editForm.dispatch"></el-input>
					</el-form-item>
				</div>

				<div style="display: flex;">
					<el-form-item label="运单编号" prop="no" class="rt-input">
						<el-input disabled v-model="editForm.no"></el-input>
					</el-form-item>
					<el-form-item label="派单类型" prop="waybilltype" class="rt-input">
						<el-select :disabled="canEdit" v-model="editForm.waybilltype" placeholder="请选择" clearable>
							<el-option v-for="item in waybilltypeList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订单来源" prop="source" class="rt-input">
						<el-select :disabled="canEdit" v-model="editForm.source" placeholder="请选择" clearable>
							<el-option v-for="item in sourceList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
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
					<el-form-item label="是否超高/宽/重" prop="overweight" class="rt-input">
						<el-select :disabled="canEdit" v-model="editForm.overweight" placeholder="请选择" clearable>
							<el-option v-for="item in overweightList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否禁行" prop="ban" class="rt-input">
						<el-select :disabled="canEdit" v-model="editForm.ban" placeholder="请选择" clearable>
							<el-option v-for="item in banList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>

				</div>

				<div style="display: flex;">
					<el-form-item label="放空距离" prop="emptydistance" class="rt-input">
						<el-input clearable :disabled="canEdit" v-model="editForm.emptydistance " @change="editCalculateKm"></el-input>
					</el-form-item>
					<el-form-item label="高速预计距离" prop="highspeed" class="rt-input">
						<el-input clearable :disabled="canEdit" v-model="editForm.highspeed " @change="editCalculateKm"></el-input>
					</el-form-item>
					<el-form-item label="下道预计距离" prop="estimatedistance" class="rt-input">
						<el-input clearable :disabled="canEdit" v-model="editForm.estimatedistance " @change="editCalculateKm"></el-input>
					</el-form-item>
					<el-form-item label="总距离" prop="km" class="rt-input">
						<el-input disabled clearable v-model="editForm.km" placeholder="km"></el-input>
					</el-form-item>

				</div>

				<div style="display: flex;">
					<el-form-item label="定金" prop="deposit" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.deposit "></el-input>
					</el-form-item>
					<el-form-item label="到付" prop="pay" class="rt-input">
						<el-input :disabled="canEdit" v-model="editForm.pay "></el-input>
					</el-form-item>
					<el-form-item label="到车" prop="car" class="rt-input">
						<el-input @change="editCalculateNearcost" :disabled="canEdit" v-model="editForm.car"></el-input>
					</el-form-item>
					<el-form-item label="费用" prop="cost" class="rt-input">
						<el-input @change="editCalculateNearcost" :disabled="canEdit" clearable v-model="editForm.cost" placeholder="元"></el-input>
					</el-form-item>
					<el-form-item label="利润" prop="nearcost" class="rt-input">
						<el-input disabled v-model="editForm.nearcost" placeholder="元"></el-input>
					</el-form-item>
				</div>

				<div style="display: flex;">
					<el-form-item label="定金备注" prop="djnote">
						<el-input clearable :disabled="canEdit" v-model="editForm.djnote" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="卸货方式" prop="upiontway">
						<!-- <el-select :disabled="canEdit" v-model="editForm.upiontway" placeholder="请选择" clearable>
							<el-option v-for="item in upiontwayList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select> -->
						<el-input :disabled="canEdit" v-model="editForm.upiontway"></el-input>
					</el-form-item>
					<el-form-item label="装卸货工具" prop="upiontgj">
						<el-input :disabled="canEdit" v-model="editForm.upiontgj"></el-input>
					</el-form-item>
				</div>

				<div style="display: flex;">
					<el-form-item label="是否回单" prop="ishd">
						<el-select :disabled="canEdit" v-model="editForm.ishd" placeholder="请选择" clearable>
							<el-option v-for="item in ishdList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="回单地址" prop="hdadd">
						<el-input :disabled="canEdit" v-model="editForm.hdadd"></el-input>
					</el-form-item>
					<el-form-item label="	建议运输方式" prop="yunshu">
						<el-input :disabled="canEdit" v-model="editForm.yunshu"></el-input>
					</el-form-item>
					<el-form-item label="建议到达装货时间">

						<el-date-picker :disabled="canEdit" v-model="editForm.daoda" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
						</el-date-picker>

					</el-form-item>

				</div>
				<div style="display: flex;">
					<el-form-item label="订单备注1" prop="ordernote">
						<el-input :disabled="canEdit" v-model="editForm.ordernote"></el-input>
					</el-form-item>
					<el-form-item label="订单备注2" prop="ordernotea">
						<el-input :disabled="canEdit" v-model="editForm.ordernotea"></el-input>
					</el-form-item>
					<el-form-item label="订单备注3" prop="ordernoteb">
						<el-input :disabled="canEdit" v-model="editForm.ordernoteb"></el-input>
					</el-form-item>
				</div>
				<div style="display: flex;">
					<el-form-item label="下单客户" prop="aclient" class="rt-input">
						<el-select :disabled="canEdit" v-model="editForm.aclient" clearable filterable remote placeholder="请输入公司名称"
						 :remote-method="remoteMethod" :loading="loading" style="width: 100%;" @change="searchUnloadingPoint">
							<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="收单客户" prop="uclient" class="rt-input">
						<el-select :disabled="canEdit" v-model="editForm.uclient" clearable filterable remote placeholder="请输入公司名称"
						 :remote-method="remoteMethod" :loading="loading" style="width: 100%;" @change="searchUnloadingPoint">
							<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</div>
				<el-form-item label="运单截图" prop="picture">
					<el-image v-if="editForm.picture" style="width: 150px;" :src="editForm.picture"></el-image>
					<el-upload name="imgFile" :action="updatePictureUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditPictureUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button :disabled="canEdit" size="small" type="primary" plain>上传运单截图</el-button>
					</el-upload>
				</el-form-item>





				<el-form-item label="装货信息">
					<template>
						<el-table :data="editForm.apoints" style="width: 100%">
							<el-table-column prop="spointphone" label="装货点电话">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.spointphone" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="装货时间" width="200px">
								<template slot-scope="scope">
									<el-date-picker :disabled="canEdit" clearable v-model="scope.row.stime" type="datetime" placeholder="选择日期时间"
									 value-format="yyyy-MM-dd HH:mm:ss" class="rt-input">
									</el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="sprovince" label="省">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.sprovince" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="scity" label="市">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.scity" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="sarea" label="区">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.sarea" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="saddress" label="详细地址">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.saddress" class="rt-input"></el-input>
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
							<el-table-column fixed="right" label="操作">
								<template slot-scope="scope">
									<el-button :disabled="canEdit" @click.native.prevent="deleteApoints(scope.$index, editForm.apoints)">移除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
					<el-button :disabled="canEdit" @click="addApoints(editForm.apoints)">添加</el-button>
				</el-form-item>

				<el-form-item label="卸货信息">
					<template>
						<el-table :data="editForm.upoints" style="width: 100%">
							<el-table-column prop="spointphone" label="卸货点电话">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.dpointphone" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column label="卸货时间" width="200px">
								<template slot-scope="scope">
									<el-date-picker :disabled="canEdit" clearable v-model="scope.row.dtime" type="datetime" placeholder="选择日期时间"
									 value-format="yyyy-MM-dd HH:mm:ss" class="rt-input">
									</el-date-picker>
								</template>
							</el-table-column>
							<el-table-column prop="sprovince" label="省">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.dprovince" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="scity" label="市">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.dcity" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="sarea" label="区">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.darea" class="rt-input"></el-input>
								</template>
							</el-table-column>
							<el-table-column prop="saddress" label="详细地址">
								<template slot-scope="scope">
									<el-input :disabled="canEdit" clearable v-model="scope.row.daddress" class="rt-input"></el-input>
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
							<el-table-column fixed="right" label="操作">
								<template slot-scope="scope">
									<el-button :disabled="canEdit" @click.native.prevent="deleteUpoints(scope.$index, editForm.upoints)">移除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</template>
					<el-button :disabled="canEdit" @click="addUpoints(editForm.upoints)">添加</el-button>
				</el-form-item>

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

				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button v-if="canEdit" :disabled="canClickEdit" type="primary" @click="handlecanEdit">修 改</el-button>
				<el-button v-else type="primary" @click="editInfo">确 定</el-button>
			</span>

		</el-dialog>
		
		<!-- 位置 -->
		<el-dialog title="车辆位置" :visible.sync="locationDialog" width="50%" :close-on-click-modal="false">
		
			<div id="locition" style="width: 100%;height: 500px;"></div>
		
		</el-dialog>


	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 上传图片需要携带token
				myHeaders: {
					satoken: window.sessionStorage.getItem('satoken')
				},
				// 查询数据 tableId
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id",
					no: '',
					noText: '',
					state: '',
					driver: '',
					driverNew: '',
					creater: '',
					createrNew: '',
					// creatime: '',
					// creatimeNew: '',
				},
				stateOptions: [{
						value: '0',
						label: '已驳回'
					},
					{
						value: '1',
						label: '审核中'
					},
					{
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
					}
				],
				// 分页列表
				wybillList: [],
				// 总条数
				total: 0,
				srcList: [],
				// 创建对话框数据
				addDialogVisible: false,
				// 位置
				locationDialog: false,
				addForm: {
					waybilltype: '',
					source: '',
					people: '',
					goodsname: '',
					goodsweight: '',
					overweight: '',
					picture: '',
					emptydistance: '',
					highspeed: '',
					estimatedistance: '',
					ban: '',
					djnote: '',
					deposit: '',
					pay: '',
					car: '',
					cost: '',
					km: '',
					nearcost: '',
					aclient: '',
					uclient: '',
					lienses: '',
					Lidriver: '',
					dispatch: '',
					ordernote: '',
					upiontway: '',
					upiontgj: '',
					ishd: '',
					yunshu: '',
					daoda: '',
					apoints: [{
						spointphone: "",
						stime: "",
						sprovince: "",
						scity: "",
						sarea: "",
						saddress: "",
						sgrade: "",
						shuafen: "",
						scityOptions: [],
						sareaOptions: [],
					}],
					upoints: [{
						dpointphone: "",
						dtime: "",
						dprovince: "",
						dcity: "",
						darea: "",
						daddress: "",
						dgrade: "",
						dhuafen: "",
						dcityOptions: [],
						dareaOptions: []
					}]
				},
				xingshizhengSrc:'',
				jiashizhengSrc:'',
				shenfenzhengSrc:'',
				shanggangzhengSrc:'',
				showhdadd: false,
				// 添加的规则
				addRules: {
					ishd: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					upiontway: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					waybilltype: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					source: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					people: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					goodsname: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					goodsweight: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					overweight: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					ban: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					emptydistance: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					highspeed: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					estimatedistance: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					deposit: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					pay: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					car: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					cost: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					yunshu: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					daoda: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],
					// apoints:[
					// 	{ required: true, message: '必填', trigger: 'blur' }
					// ],
					driver: [{
						required: true,
						message: '必填',
						trigger: 'blur'
					}],


					aclient: [{
						required: true,
						message: '请选择（没有的话需要到基础→客户页面创建)',
						trigger: 'blur'
					}],
				},
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
				// 卸货方式
				upiontwayList: [{
					value: '一装一卸',
					label: '一装一卸'
				}, {
					value: '一装多卸',
					label: '一装多卸'
				}, {
					value: '多装多卸',
					label: '多装多卸'
				}, {
					value: '多装一卸',
					label: '多装一卸'
				}],
				// 是否回单
				ishdList: [{
					value: '是',
					label: '是'
				}, {
					value: '否',
					label: '否'
				}],
				// 订单来源
				sourceList: [{
					value: '网络',
					label: '网络'
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
				// 创建页面公司选择框数据
				companyOptions: [],
				companyList: [],
				loading: false,
				states: [],
				// 创建页面选择车牌号数据
				carLicenseOptions: [],
				allCarLicenseList: [],
				carLicenseLoading: false,
				// 创建页面选择司机数据
				driverNameOptions: [],
				allDriverNameList: [],
				driverNameLoading: false,
				// 创建页面选择当日负责配管数据
				peopleOptions: [],
				allPeopleList: [],
				peopleLoading: false,


				// 创建页面发货信息选择省
				sprovinceOptions: [],
				allSprovinceList: [],
				// 创建页面发货信息选择市
				allScityList: [],
				// 创建页面发货信息选择市
				allSareaList: [],

				// 创建页面卸货信息选择省
				dprovinceOptions: [],
				allDprovinceList: [],
				// 创建页面卸货信息选择市
				allDcityList: [],
				// 创建页面卸货信息选择市
				allDareaList: [],


				// 编辑对话框数据
				editDialogVisible: false,
				editForm: {
					Lidriver: '',
					lienses: '',
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
				// 订单取消
				showQuxiao: false,

				updatePictureUrl: this.$baseUploadUrl + "/waybill/uploadpicture",
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

			// console.log(this.queryInfo)
			this.getWaybillList()
			this.getAllCompanyList()
			this.findAllCarLicense()
			this.findAllSprovince()
			this.findAllDriverName()
			this.findAllPeople()
		},
		methods: {
			// 地图
			async showLocationDialog(){
				
				if(!this.addForm.lienses){
					return this.$message.warning('请先选择车辆信息！')
				}
				
				const {data:res} = await this.$http.get('kCarinformation/GetCarCurrent?string=' + this.addForm.lienses)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				if(res.result.anyType.GPSPoint){
					const carInfo = res.result.anyType.GPSPoint
					const {last_lon} = res.result.anyType.GPSPoint
					const {last_lat} = res.result.anyType.GPSPoint
					this.locationDialog = true
					setTimeout(() => {
						var map1 = new AMap.Map("locition", {
							resizeEnable: true, //窗口大小调整
							center: [last_lon, last_lat], //中心 firstArr: [116.478935, 39.997761],
							zoom: 10
						});
					
						var marker1 = new AMap.Marker({
							icon: "https://tkhhd.com/imgs/kache.png",
							position: [last_lon, last_lat],
							offset: new AMap.Pixel(-13, -30)
						});
						marker1.setTitle(carInfo.carMark +":"+ carInfo.location)
						// marker1.setMap(map1);
						map1.add(marker1)
					}, 200)
				}else{
					this.$message.warning('暂无位置信息')
				}
				
			},
			
			ishdChange(e) {
				if (e == '是') {
					this.showhdadd = true
				} else {
					this.showhdadd = false
				}
			},
			// 上传图片限制
			beforeAvatarUpload(file) {
				// console.log(file)
				const isLt10M = file.size / 1024 / 1024 < 10;
				if (!isLt10M) {
					this.$message.error('上传图片大小不能超过 10MB!');
				}
				return isLt10M;
			},
			deleteApoints(index, rows) {
				//删除改行
				rows.splice(index, 1);
			},
			addApoints(apoints, event) {
				// console.log(apoints) 司机已交
				// console.log(event)
				apoints.push({
					spointphone: "",
					stime: "",
					sprovince: "",
					scity: "",
					sarea: "",
					saddress: "",
					sgrade: "",
					shuafen: "",
					scityOptions: [],
					sareaOptions: []
				})
			},
			deleteUpoints(index, rows) {
				//删除改行
				rows.splice(index, 1);
			},
			addUpoints(upoints, event) {
				upoints.push({
					dpointphone: "",
					dtime: "",
					dprovince: "",
					dcity: "",
					darea: "",
					daddress: "",
					dgrade: "",
					dhuafen: "",
					dcityOptions: [],
					dareaOptions: []
				})
			},
			// 创建页面计算利润
			async calculateNearcost() {
				// console.log('开始')
				if (!this.addForm.car || !this.addForm.cost) {
					this.addForm.nearcost = ''
					return
				}
				// console.log('判断')
				this.addForm.nearcost = this.addForm.car - this.addForm.cost
			},
			// 详情页面计算利润
			async editCalculateNearcost() {
				// console.log('开始')
				if (!this.editForm.car || !this.editForm.cost) {
					this.editForm.nearcost = ''
					return
				}
				// console.log('判断')
				this.editForm.nearcost = this.editForm.car - this.editForm.cost
			},
			// 创建页面计算总距离
			async calculateKm() {
				if (!this.addForm.emptydistance || !this.addForm.highspeed || !this.addForm.estimatedistance) {
					this.addForm.km = ''
					return
				}
				const kmQueryData = {}
				kmQueryData.emptydistance = this.addForm.emptydistance
				kmQueryData.highspeed = this.addForm.highspeed
				kmQueryData.estimatedistance = this.addForm.estimatedistance
				const {
					data: res
				} = await this.$http.post('waybill/km', kmQueryData)
				// console.log(res)
				this.addForm.km = res.result.km
			},
			// 详情页面计算总距离
			async editCalculateKm() {
				// console.log('进入')
				if (!this.editForm.emptydistance || !this.editForm.highspeed || !this.editForm.estimatedistance) {
					this.editForm.km = ''
					return
				}
				const kmEditQueryData = {}
				kmEditQueryData.emptydistance = this.editForm.emptydistance
				kmEditQueryData.highspeed = this.editForm.highspeed
				kmEditQueryData.estimatedistance = this.editForm.estimatedistance
				const {
					data: res
				} = await this.$http.post('waybill/km', kmEditQueryData)
				// console.log(res)
				this.editForm.km = res.result.km
			},

			// 获取所有客户公司名称
			async getAllCompanyList() {
				const {
					data: res
				} = await this.$http.get('waybill/findAllCompanyName')
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.states = res.result
				this.companyList = this.states.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.companyOptions = this.companyList
			},

			// 创建页面选择公司方法
			remoteMethod(query) {
				if (query !== '') {
					this.loading = true;
					setTimeout(() => {
						this.loading = false;
						this.companyOptions = this.companyList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.companyOptions = this.companyList
				}
			},
			// 选择公司后回复下拉列表
			async searchUnloadingPoint(name) {
				if (!name) {
					this.companyOptions = this.companyList
				}

				// if(name !== ''){
				// 	const {
				// 		data: res
				// 	} = await this.$http.get('waybill/findPointByCompanyName?companyName=' + name)
				// 	console.log(res)
				// 	if (res.code !== 200) {
				// 		this.addForm.searchEmployee = ''
				// 		return this.$message.error('查询失败')
				// 	}
				// 	this.companyOptions = this.companyList

				// }else{
				// 	this.companyOptions = this.companyList
				// }
			},
			// 获取所有司机名字
			async findAllDriverName() {
				const {
					data: res
				} = await this.$http.get('waybill/findAllDriver')
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.allDriverNameList = res.result.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.driverNameOptions = this.allDriverNameList
			},
			// 创建页面选择司机名方法
			chooseDriverName(query) {
				if (query !== '') {
					this.driverNameLoading = true;
					setTimeout(() => {
						this.driverNameLoading = false;
						this.driverNameOptions = this.allDriverNameList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.driverNameOptions = this.allDriverNameList
				}
			},
			// 创建选择司机名后发起请求
			async handleChooseDriverName(name) {
				if (name !== '') {
					const {
						data: res
					} = await this.$http.get('/waybill/findDriverByDriver?driver=' + name)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.driverNameOptions = this.allDriverNameList
					this.addForm.lienses = res.result.chepai
					this.addForm.dispatch = res.result.dispatch
					
					const {
						data: res1
					} = await this.$http.get('/kCarinformation/getinformation?licenseplate=' + res.result.chepai)
					console.log(res1)
					this.xingshizhengSrc = res1.result.driving_license
					this.jiashizhengSrc = res1.result.vehicle_license
					this.shenfenzhengSrc = res1.result.userid
					this.shanggangzhengSrc = res1.result.work_license
					
					
				} else {
					this.driverNameOptions = this.allDriverNameList
					this.addForm.lienses = ''
					this.addForm.dispatch = ''
				}
			},
			// 修改选择司机名后发起请求
			async editChooseDriverName(name) {
				// console.log(name)
				if (name !== '') {
					const {
						data: res
					} = await this.$http.get('/waybill/findDriverByDriver?driver=' + name)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.driverNameOptions = this.allDriverNameList
					this.editForm.lienses = res.result.chepai
					this.editForm.driver = name
					this.editForm.dispatch = res.result.dispatch
				} else {
					this.driverNameOptions = this.allDriverNameList
					this.editForm.lienses = ''
					this.editForm.dispatch = ''
					this.editForm.driver = ''
				}
			},

			// 获取所有负责配管
			async findAllPeople() {
				const {
					data: res
				} = await this.$http.get('waybill/findAllUser')
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.allPeopleList = res.result.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.peopleOptions = this.allPeopleList
			},
			// 创建页面选择当日配管方法
			choosePeople(query) {
				if (query !== '') {
					this.peopleLoading = true;
					setTimeout(() => {
						this.peopleLoading = false;
						this.peopleOptions = this.allPeopleList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.peopleOptions = this.allPeopleList
				}
			},


			// 获取所有车牌号
			async findAllCarLicense() {
				const {
					data: res
				} = await this.$http.get('waybill/findAllLicense')
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.allCarLicenseList = res.result.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.carLicenseOptions = this.allCarLicenseList
			},

			// 创建页面选择车牌号方法
			chooseCarLicense(query) {
				if (query !== '') {
					this.carLicenseLoading = true;
					setTimeout(() => {
						this.carLicenseLoading = false;
						this.carLicenseOptions = this.allCarLicenseList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.carLicenseOptions = this.allCarLicenseList
				}
			},

			// 创建选择车牌号后发起请求
			async handleChooseCarLicense(carLicense) {
				if (carLicense !== '') {
					const {
						data: res
					} = await this.$http.get('waybill/findDriverByLicense?license=' + carLicense)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.carLicenseOptions = this.allCarLicenseList
					this.addForm.Lidriver = res.result.driver
					this.addForm.dispatch = res.result.dispatch
				} else {
					this.carLicenseOptions = this.allCarLicenseList
					this.addForm.Lidriver = ''
					this.addForm.dispatch = ''
				}
			},

			// 修改选择车牌号后发起请求
			async editChooseCarLicense(carLicense) {
				if (carLicense !== '') {
					const {
						data: res
					} = await this.$http.get('waybill/findDriverByLicense?license=' + carLicense)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.carLicenseOptions = this.allCarLicenseList
					this.editForm.Lidriver = res.result.driver
					this.editForm.dispatch = res.result.dispatch
					this.$forceUpdate()
				} else {
					this.carLicenseOptions = this.allCarLicenseList
					this.editForm.Lidriver = ''
					this.editForm.dispatch = ''
				}

			},

			// 获取所有省
			async findAllSprovince() {
				this.allSprovinceList = []
				this.sprovinceOptions = []
				this.dprovinceOptions = []
				const {
					data: res
				} = await this.$http.get('waybill/findAllprovince')
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.allSprovinceList = res.result.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.sprovinceOptions = this.allSprovinceList
				this.dprovinceOptions = this.allSprovinceList
			},

			// 创建装货选择省后发起请求
			async sprovinceChange(province, index) {
				if (this.addForm.apoints[index].sprovince !== '') {
					const {
						data: res
					} = await this.$http.get('waybill/findcityByprovince?province=' + province)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.allScityList = res.result.map(item => {
						return {
							value: `${item}`,
							label: `${item}`
						};
					});
					this.addForm.apoints[index].scityOptions = this.allScityList
				} else {
					this.addForm.apoints[index].scityOptions = []
					this.allScityList = []
					this.sareaOptions = []
					this.allSareaList = []
					this.addForm.apoints[index].scity = ''
					this.addForm.apoints[index].sarea = ''
					this.addForm.apoints[index].shuafen = ''
					this.addForm.apoints[index].schengben = ''
					this.addForm.apoints[index].sgrade = ''
				}
			},
			// 创建装货选择市后发起请求
			async scityChange(city, index) {
				if (this.addForm.apoints[index].scity !== '') {
					const {
						data: res
					} = await this.$http.get('waybill/findareaBycity?city=' + city)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.allSareaList = res.result.map(item => {
						return {
							value: `${item}`,
							label: `${item}`
						};
					});
					this.addForm.apoints[index].sareaOptions = this.allSareaList
				} else {
					this.addForm.apoints[index].sareaOptions = []
					this.allSareaList = []
					this.addForm.apoints[index].sarea = ''
					this.addForm.apoints[index].shuafen = ''
					this.addForm.apoints[index].schengben = ''
					this.addForm.apoints[index].sgrade = ''
				}
			},
			// 创建装货选择区后发起请求
			async sareaChange(province, city, area, index) {
				if (province !== '' && city !== '' && area !== '') {
					const params = {
						province,
						city,
						area
					}
					const {
						data: res
					} = await this.$http.get('waybill/findhuanfenandchengben', {
						params: params
					})
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.addForm.apoints[index].shuafen = res.result[0].huafen
					this.addForm.apoints[index].schengben = res.result[0].chengben
					this.addForm.apoints[index].sgrade = res.result[0].grade

				} else {
					this.addForm.apoints[index].shuafen = ''
					this.addForm.apoints[index].schengben = ''
					this.addForm.apoints[index].sgrade = ''

				}
			},
			// 创建卸货选择省后发起请求
			async dprovinceChange(province, index) {
				if (this.addForm.upoints[index].dprovince !== '') {
					const {
						data: res
					} = await this.$http.get('waybill/findcityByprovince?province=' + province)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.allDcityList = res.result.map(item => {
						return {
							value: `${item}`,
							label: `${item}`
						};
					});
					this.addForm.upoints[index].dcityOptions = this.allDcityList
				} else {
					this.addForm.upoints[index].dcityOptions = []
					this.allScityList = []
					this.dareaOptions = []
					this.allDareaList = []
					this.addForm.upoints[index].dcity = ''
					this.addForm.upoints[index].darea = ''
					this.addForm.upoints[index].dhuafen = ''
					this.addForm.upoints[index].dchengben = ''
					this.addForm.upoints[index].dgrade = ''
				}
			},
			// 创建卸货选择市后发起请求
			async dcityChange(city, index) {
				if (this.addForm.upoints[index].dcity !== '') {
					const {
						data: res
					} = await this.$http.get('waybill/findareaBycity?city=' + city)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.allDareaList = res.result.map(item => {
						return {
							value: `${item}`,
							label: `${item}`
						};
					});
					this.addForm.upoints[index].dareaOptions = this.allDareaList
				} else {
					this.addForm.upoints[index].dareaOptions = []
					this.allDareaList = []
					this.addForm.upoints[index].darea = ''
					this.addForm.upoints[index].dhuafen = ''
					this.addForm.upoints[index].dchengben = ''
					this.addForm.upoints[index].dgrade = ''
				}
			},
			// 创建卸货选择区后发起请求
			async dareaChange(province, city, area, index) {
				if (province !== '' && city !== '' && area !== '') {
					const params = {
						province,
						city,
						area
					}
					const {
						data: res
					} = await this.$http.get('waybill/findhuanfenandchengben', {
						params: params
					})
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					this.addForm.upoints[index].dhuafen = res.result[0].huafen
					this.addForm.upoints[index].dchengben = res.result[0].chengben
					this.addForm.upoints[index].dgrade = res.result[0].grade

				} else {
					this.addForm.upoints[index].dhuafen = ''
					this.addForm.upoints[index].dchengben = ''
					this.addForm.upoints[index].dgrade = ''

				}
			},


			//分页区域
			// 根据分页查询列表
			async getWaybillList() {
				const {
					data: res
				} = await this.$http.get('waybill/list', {
					params: this.queryInfo
				})
				console.log('list', res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// this.$message.success('获取信息成功')
				this.wybillList = res.result.records
				this.total = res.result.total
				this.wybillList.forEach(v => {
					if (v.state == 0) {
						v.stateText = "已驳回"
					} else if (v.state == 1) {
						v.stateText = "审核中"
					} else if (v.state == 2) {
						v.stateText = "审核完成"
					} else if (v.state == 3) {
						v.stateText = "司机已接单"
					} else if (v.state == 4) {
						v.stateText = "司机已拒单"
					} else if (v.state == 5) {
						v.stateText = "待完结"
					} else if (v.state == 6) {
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
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.no = "*" + this.queryInfo.noText + "*"
				this.queryInfo.driver = "*" + this.queryInfo.driverNew + "*"
				this.queryInfo.creater = "*" + this.queryInfo.createrNew + "*"
				// if(this.queryInfo.creatimeNew){
				// 	this.queryInfo.creatime = "*" + this.queryInfo.creatimeNew + "*"
				// }
				
				this.getWaybillList()
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.no = ''
				this.queryInfo.noText = ''
				this.queryInfo.state = ''
				this.queryInfo.driver = ''
				this.queryInfo.driverNew = ''
				this.queryInfo.creater = ''
				this.queryInfo.createrNew = ''
				// this.queryInfo.creatime = ''
				// this.queryInfo.creatimeNew = ''
				this.getWaybillList()
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getWaybillList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getWaybillList()
			},

			// 创建图片上传成功的回调
			handlePictureUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.addForm.picture = response.result.pictureFileName
			},


			// 创建对话框
			addInfo() {
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					// 判断table中的必填
					if (!this.addForm.apoints[0].spointphone || !this.addForm.apoints[0].stime || !this.addForm.apoints[0].sprovince ||
						!this.addForm.apoints[0].scity || !this.addForm.apoints[0].sarea || !this.addForm.upoints[0].dtime || !this.addForm
						.upoints[0].dprovince || !this.addForm.upoints[0].dcity || !this.addForm.upoints[0].darea) {
						return this.$message.warning('请完善必填信息！')
					}
					
					// 发起添加信息的数据请求
					const {
						data: res
					} = await this.$http.post('waybill/addwaybill', this.addForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 添加成功，关闭对话框，刷新数据列表，提示添加成功
					this.addDialogVisible = false
					this.getWaybillList()
					// this.$message.success('添加信息成功')
				})
			},
			// 监听创建对话框关闭
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
				this.addForm = {
					waybilltype: '',
					source: '',
					people: '',
					goodsname: '',
					goodsweight: '',
					overweight: '',
					picture: '',
					emptydistance: '',
					highspeed: '',
					estimatedistance: '',
					ban: '',
					deposit: '',
					pay: '',
					car: '',
					aclient: '',
					uclient: '',
					lienses: '',
					Lidriver: '',
					dispatch: '',
					apoints: [{
						spointphone: "",
						stime: "",
						sprovince: "",
						scity: "",
						sarea: "",
						saddress: "",
						sgrade: "",
						shuafen: "",
						scityOptions: [],
						sareaOptions: [],
					}],
					upoints: [{
						dpointphone: "",
						dtime: "",
						dprovince: "",
						dcity: "",
						darea: "",
						daddress: "",
						dgrade: "",
						dhuafen: "",
						dcityOptions: [],
						dareaOptions: []
					}]
				},
				this.xingshizhengSrc = ''
				this.jiashizhengSrc = ''
				this.shenfenzhengSrc = ''
				this.shanggangzhengSrc = ''

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
				} else if (res.result[0].state == 5) {

				} else if (res.result[0].state == 6) {
					this.showQuxiao = true
				}

				// 显示对话框
				this.editDialogVisible = true
			},

			// 修改图片上传成功的回调
			handleEditPictureUrlSuccess(response, file, fileList) {
				// console.log(response)
				this.editForm.picture = response.result.pictureFileName
			},


			// 监听修改用户对话框关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
				this.canEdit = true
				this.showRefusenote = false
				this.canClickEdit = true
				this.showQuxiao = false
			},
			handlecanEdit() {
				this.canEdit = false
			},

			editInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.put('waybill/edit', this.editForm)
					// console.log(res)
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false

					this.getWaybillList()
					this.$message.success(res.message)
				})
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
