<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆管理</el-breadcrumb-item>
			<el-breadcrumb-item>车辆信息</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 车辆信息页面 -->
		<!-- 创建搜索区 -->
		<!-- <el-row> -->



		<!-- 卡片视图区 -->
		<el-card class="box-card">
			<!-- 创建按钮 -->
			<el-button type="primary" plain @click="addDialogVisible = true">创建</el-button>
			<el-input v-model="queryCarName" placeholder="车牌号" clearable style="width: 200px;margin-left: 100px;"></el-input>
			<el-button type="primary" plain @click="handleQueryBtn" style="margin-left: 30px;">查询</el-button>
			<el-button type="primary" plain @click="handleQueryBackBtn" style="margin-left: 30px;">返回</el-button>

			<el-table :data="carList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="id" label="ID" v-if="false">
				</el-table-column>
				<el-table-column prop="licensePlate" label="车牌号" width="100px">
				</el-table-column>
				<el-table-column prop="carstate" label="车辆状态" width="100px" style="colot:">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.carstate=='正常'?'#303133FF':'red'}">{{scope.row.carstate}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="车主姓名" width="100px">
				</el-table-column>
				<el-table-column prop="phoneno" label="车主手机号" width="150px">
				</el-table-column>
				<el-table-column prop="companyl" label="所属分公司" width="250px">
				</el-table-column>
				<el-table-column prop="driver" label="对应司机" width="100px">
				</el-table-column>
				<el-table-column prop="driverphone" label="司机电话" width="150px">
				</el-table-column>
				<!-- <el-table-column prop="vehicleLicense" label="行驶证" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
							<el-image style="width: 80px; height: 40px" :src="scope.row.vehicleLicense" :preview-src-list="srcList" @click="handleClickImage(scope.row.vehicleLicense)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column> -->
				<el-table-column prop="vehiclelicensedate" label="行驶证到期时间" width="150px">
				</el-table-column>
				<el-table-column prop="checkDate" label="年检到期时间" width="150px">
				</el-table-column>
				<!-- <el-table-column prop="insurance" label="保险单据1" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insurance" :preview-src-list="srcList" @click="handleClickImage(scope.row.insurance)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="insurancea" label="保险单据2" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insurancea" :preview-src-list="srcList" @click="handleClickImage(scope.row.insurancea)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="insuranceb" label="保险单据3" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insuranceb" :preview-src-list="srcList" @click="handleClickImage(scope.row.insuranceb)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="insurancec" label="保险单据4" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insurancec" :preview-src-list="srcList" @click="handleClickImage(scope.row.insurancec)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="insuranced" label="保险单据5" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insuranced" :preview-src-list="srcList" @click="handleClickImage(scope.row.insuranced)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="insurancee" label="保险单据6" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insurancee" :preview-src-list="srcList" @click="handleClickImage(scope.row.insurancee)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="insurancef" label="保险单据7" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insurancef" :preview-src-list="srcList" @click="handleClickImage(scope.row.insurancef)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="insuranceg" label="保险单据8" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insuranceg" :preview-src-list="srcList" @click="handleClickImage(scope.row.insuranceg)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="insuranceh" label="保险单据9" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insuranceh" :preview-src-list="srcList" @click="handleClickImage(scope.row.insuranceh)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="insurancel" label="保险单据10" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top" width="150px">
							<el-image style="width: 80px; height: 40px" :src="scope.row.insurancel" :preview-src-list="srcList" @click="handleClickImage(scope.row.insurancel)"></el-image>
						</el-tooltip>
					</template>
				</el-table-column> -->
				<el-table-column prop="insuranceDate" label="保险到期日期" width="150px">
				</el-table-column>
				<!-- <el-table-column prop="caroperating" label="车辆营运证" width="150px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="点击查看大图" placement="top">
							<el-image style="width: 80px; height: 40px" :src="scope.row.caroperating" :preview-src-list="srcList" @click="handleClickImage(scope.row.caroperating)"></el-image>
						</el-tooltip>

					</template>
				</el-table-column> -->
				<el-table-column prop="operatingdate" label="营运证到期时间" width="150px">
				</el-table-column>
				<!-- <el-table-column prop="carmargin" label="车辆保证金" width="100px">
					<template slot-scope="scope">
						<span :style="{'color':scope.row.carmargin < 500?'red':'black'}">{{scope.row.carmargin}}</span>
					</template>
				</el-table-column> -->
				<el-table-column prop="createuser" label="创建人" width="150px">
				</el-table-column>
				<el-table-column prop="ctTime" label="创建时间" width="180px">
				</el-table-column>
				<el-table-column prop="utTime" label="最近更新时间" width="180px">
				</el-table-column>
				<el-table-column label="操作" width="380px" fixed="right">
					<template slot-scope="scope">
						
						<!-- 查违章按钮 -->
						<el-button type="warning" size="mini"  @click="showQueryViolationDialog(scope.row.licensePlate)">查违章</el-button>
						<el-button type="warning" size="mini" style="margin-left: 10px;" @click="showLocationDialog(scope.row.licensePlate)">位置</el-button>
						<el-button type="warning" size="mini" style="margin-left: 10px;" @click="showHistoryDialog(scope.row.licensePlate)">历史轨迹</el-button>
						
						<!-- 修改按钮 -->
						<el-button type="primary" size="mini" style="margin-left: 10px;" @click="showEditDialog(scope.row.id)">编辑</el-button>
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
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
			 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total" style="margin-top: 5px;">
			</el-pagination>
		</el-col>

		<!-- 创建的对话框 -->
		<el-dialog title="创建车辆信息" :visible.sync="addDialogVisible" width="35%" @close="addDialogClosed">
			<!-- 创建的表单 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="150px">
				<el-form-item label="车牌号:" prop="licensePlate">
					<el-input v-model="addForm.licensePlate" style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="车辆状态:" prop="carstate">
					<el-select v-model="addForm.carstate" placeholder="全部" clearable  style="width: 350px;">
						<el-option v-for="item in carstateList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车架号:" prop="frame">
					<el-input v-model="addForm.frame"  style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="发动机号:" prop="engine">
					<el-input v-model="addForm.engine"  style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="车主姓名:" prop="name">
					<el-input v-model="addForm.name"  style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="车主手机号:" prop="phoneno">
					<el-input v-model="addForm.phoneno"  style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="所属分公司:" prop="companyl">
					<el-select v-model="addForm.companyl" clearable filterable remote placeholder="请输入公司名称" :remote-method="remoteCompanyMethod"
					 :loading="companyLoading" @change="companylChange"  style="width: 350px;">
						<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="对应调度员:" prop="dispatch">
					<el-select v-model="addForm.dispatch" clearable filterable remote placeholder="请选择调度员" :remote-method="remoteDispatchMethod" :loading="dispatchLoading"  style="width: 350px;">
						<el-option v-for="item in dispatchOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="行驶证:" prop="vehicleLicense">
					<el-image v-if="addForm.vehicleLicense" style="width: 150px;" :src="addForm.vehicleLicense" :preview-src-list="srcList" @click="handleClickImage(addForm.vehicleLicense)"></el-image>
					<el-upload name="imgFile" :action="updateVehicleLicenseUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleVehicleLicenseUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传行驶证照片</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="行驶证到期时间:" prop="vehiclelicensedate">
					<el-date-picker v-model="addForm.vehiclelicensedate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd"  style="width: 350px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="年检到期时间:" prop="checkDate">
					<el-date-picker v-model="addForm.checkDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  style="width: 350px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="保险单据1:" prop="insurance">
					<el-image v-if="addForm.insurance" style="width: 150px;" :src="addForm.insurance" :preview-src-list="srcList" @click="handleClickImage(addForm.insurance)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl1" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess1"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据1</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据2:" prop="insurancea">
					<el-image v-if="addForm.insurancea" style="width: 150px;" :src="addForm.insurancea" :preview-src-list="srcList" @click="handleClickImage(addForm.insurancea)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl2" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess2"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据2</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据3:" prop="insuranceb">
					<el-image v-if="addForm.insuranceb" style="width: 150px;" :src="addForm.insuranceb" :preview-src-list="srcList" @click="handleClickImage(addForm.insuranceb)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl3" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess3"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据3</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据4:" prop="insurancec">
					<el-image v-if="addForm.insurancec" style="width: 150px;" :src="addForm.insurancec" :preview-src-list="srcList" @click="handleClickImage(addForm.insurancec)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl4" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess4"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据4</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据5:" prop="insuranced">
					<el-image v-if="addForm.insuranced" style="width: 150px;" :src="addForm.insuranced" :preview-src-list="srcList" @click="handleClickImage(addForm.insuranced)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl5" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess5"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据5</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据6:" prop="insurancee">
					<el-image v-if="addForm.insurancee" style="width: 150px;" :src="addForm.insurancee" :preview-src-list="srcList" @click="handleClickImage(addForm.insurancee)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl6" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess6"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据6</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据7:" prop="insurancef">
					<el-image v-if="addForm.insurancef" style="width: 150px;" :src="addForm.insurancef" :preview-src-list="srcList" @click="handleClickImage(addForm.insurancef)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl7" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess7"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据7</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据8:" prop="insuranceg">
					<el-image v-if="addForm.insuranceg" style="width: 150px;" :src="addForm.insuranceg" :preview-src-list="srcList" @click="handleClickImage(addForm.insuranceg)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl8" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess8"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据8</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据9:" prop="insuranceh">
					<el-image v-if="addForm.insuranceh" style="width: 150px;" :src="addForm.insuranceh" :preview-src-list="srcList" @click="handleClickImage(addForm.insuranceh)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl9" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess9"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据9</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据10:" prop="insurancel">
					<el-image v-if="addForm.insurancel" style="width: 150px;" :src="addForm.insurancel" :preview-src-list="srcList" @click="handleClickImage(addForm.insurancel)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl10" :headers="myHeaders" :auto-upload="true" :on-success="handleInsuranceUrlSuccess10"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据10</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险到期时间:" prop="insuranceDate">
					<el-date-picker v-model="addForm.insuranceDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd"  style="width: 350px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="车辆营运证:" prop="caroperating">
					<el-image v-if="addForm.caroperating" style="width: 150px;" :src="addForm.caroperating" :preview-src-list="srcList" @click="handleClickImage(addForm.caroperating)"></el-image>
					<el-upload name="imgFile" :action="updateCaroperatingUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleCaroperatingUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传营运证照片</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="营运证到期时间:" prop="operatingdate">
					<el-date-picker v-model="addForm.operatingdate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd"  style="width: 350px;">
					</el-date-picker>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addInfo">确 定</el-button>
			</span>

		</el-dialog>


		<!-- 编辑的对话框 -->
		<el-dialog title="编辑车辆信息" :visible.sync="editDialogVisible" width="35%" @close="editDialogClosed">
			<el-form :model="editForm" ref="editFormRef" label-width="120px">
				<el-form-item label="车牌号:" prop="licensePlate">
					<el-input v-model="editForm.licensePlate"  style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="车辆状态:" prop="carstate">
					<el-select v-model="editForm.carstate" placeholder="全部" clearable  style="width: 350px;">
						<el-option v-for="item in carstateList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车架号:" prop="frame">
					<el-input v-model="editForm.frame"  style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="发动机号:" prop="engine">
					<el-input v-model="editForm.engine"  style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="车主姓名:" prop="name">
					<el-input v-model="editForm.name"  style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="车主手机号:" prop="phoneno">
					<el-input v-model="editForm.phoneno"  style="width: 350px;"></el-input>
				</el-form-item>
				<el-form-item label="所属分公司:" prop="companyl">
					<el-select v-model="editForm.companyl" clearable filterable remote placeholder="请输入公司名称" :remote-method="remoteCompanyMethod" :loading="companyLoading" @change="companylChange"  style="width: 350px;">
						<el-option v-for="item in companyOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<!-- <el-input v-model="editForm.companyl"></el-input> -->
				</el-form-item>
				<!-- <el-form-item label="对应调度员:" prop="dispatch">
					<el-select v-model="editForm.dispatch" clearable filterable remote placeholder="请选择调度员" :remote-method="remoteDispatchMethod" :loading="dispatchLoading"  style="width: 350px;">
						<el-option v-for="item in dispatchOptions" :key="item.index" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="行驶证:" prop="vehicleLicense">
					<el-image v-if="editForm.vehicleLicense" style="width: 150px;" :src="editForm.vehicleLicense" :preview-src-list="srcList" @click="handleClickImage(editForm.vehicleLicense)"></el-image>
					<el-upload name="imgFile" :action="updateVehicleLicenseUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditVehicleLicenseUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单照片</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="行驶证到期时间:" prop="vehiclelicensedate">
					<el-date-picker v-model="editForm.vehiclelicensedate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd"  style="width: 350px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="年检到期时间:" prop="checkDate">
					<el-date-picker v-model="editForm.checkDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"  style="width: 350px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="保险单据1:" prop="insurance">
					<el-image v-if="editForm.insurance" style="width: 150px;" :src="editForm.insurance" :preview-src-list="srcList" @click="handleClickImage(editForm.insurance)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl1" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess1"	 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单照片</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据2:" prop="insurance">
					<el-image v-if="editForm.insurancea" style="width: 150px;" :src="editForm.insurancea" :preview-src-list="srcList" @click="handleClickImage(editForm.insurancea)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl2" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess2"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据2</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据3:" prop="insurance">
					<el-image v-if="editForm.insuranceb" style="width: 150px;" :src="editForm.insuranceb" :preview-src-list="srcList" @click="handleClickImage(editForm.insuranceb)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl3" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess3"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据3</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据4:" prop="insurance">
					<el-image v-if="editForm.insurancec" style="width: 150px;" :src="editForm.insurancec" :preview-src-list="srcList" @click="handleClickImage(editForm.insurancec)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl4" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess4"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据4</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据5:" prop="insurance">
					<el-image v-if="editForm.insuranced" style="width: 150px;" :src="editForm.insuranced" :preview-src-list="srcList" @click="handleClickImage(editForm.insuranced)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl5" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess5"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据5</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据6:" prop="insurance">
					<el-image v-if="editForm.insurancee" style="width: 150px;" :src="editForm.insurancee" :preview-src-list="srcList" @click="handleClickImage(editForm.insurancee)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl6" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess6"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据6</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据7:" prop="insurance">
					<el-image v-if="editForm.insurancef" style="width: 150px;" :src="editForm.insurancef" :preview-src-list="srcList" @click="handleClickImage(editForm.insurancef)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl7" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess7"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据7</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据8:" prop="insurance">
					<el-image v-if="editForm.insuranceg" style="width: 150px;" :src="editForm.insuranceg" :preview-src-list="srcList" @click="handleClickImage(editForm.insuranceg)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl8" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess8"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据8</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据9:" prop="insurance">
					<el-image v-if="editForm.insuranceh" style="width: 150px;" :src="editForm.insuranceh" :preview-src-list="srcList" @click="handleClickImage(editForm.insuranceh)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl9" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess9"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据9</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险单据10:" prop="insurance">
					<el-image v-if="editForm.insurancel" style="width: 150px;" :src="editForm.insurancel" :preview-src-list="srcList" @click="handleClickImage(editForm.insurancel)"></el-image>
					<el-upload name="imgFile" :action="updateInsuranceUrl10" :headers="myHeaders" :auto-upload="true" :on-success="handleEditInsuranceUrlSuccess10"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传保险单据10</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="保险到期时间:" prop="insuranceDate">
					<el-date-picker v-model="editForm.insuranceDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd"  style="width: 350px;">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="车辆营运证:" prop="caroperating">
					<el-image v-if="editForm.caroperating" style="width: 150px;" :src="editForm.caroperating" :preview-src-list="srcList" @click="handleClickImage(editForm.caroperating)"></el-image>
					<el-upload name="imgFile" :action="updateCaroperatingUrl" :headers="myHeaders" :auto-upload="true" :on-success="handleEditCaroperatingUrlSuccess"
					 :show-file-list="false" :before-upload="beforeAvatarUpload">
						<el-button size="small" type="primary" plain>上传营运证照片</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="营运证到期时间:" prop="operatingdate">
					<el-date-picker v-model="editForm.operatingdate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd"  style="width: 350px;">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editInfo">确 定</el-button>
			</span>

		</el-dialog>

		<!-- 查询违章 -->
		<el-dialog title="违章记录" :visible.sync="queryViolationDialog" width="80%">
			<el-table :data="queryViolationList" border stripe style="width: 100%;margin-top: 8px;" :row-style="{height:'60px'}"
			 :cell-style="{padding:'0px'}" :header-cell-style="{background:'#f8f8f9', color:'#000000'}">
				<el-table-column prop="carNumber" label="车牌号">
				</el-table-column>
				<el-table-column prop="illegalAct" label="违章行为">
				</el-table-column>
				<el-table-column prop="illegalArea" label="违章位置">
				</el-table-column>
				<el-table-column prop="illegalDate" label="违章时间">
				</el-table-column>
				<el-table-column prop="illegalFen" label="扣分">
				</el-table-column>
				<el-table-column prop="illegalMoney" label="罚款">
				</el-table-column>
			</el-table>
		</el-dialog>

		<!-- 位置 -->
		<el-dialog title="位置" :visible.sync="locationDialog" width="50%">

			<div id="locition" style="width: 100%;height: 500px;"></div>

		</el-dialog>

		<!-- 历史轨迹 -->
		<el-dialog title="历史轨迹" :visible.sync="historyDialog" width="80%" @close="historyDialogClosed">
			<div>
				<el-date-picker v-model="selectTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒" value-format="yyyy-MM-dd HH:mm:ss">
				</el-date-picker>
				<el-button @click="handleSelectHistoryTrack" style="margin-left: 20px;"  v-loading.fullscreen.lock="fullscreenLoading">查询</el-button>
			</div>
			<div id="container" style="width: 100%;height: 500px;"></div>
			<div class="input-card">
				<h4>轨迹回放控制</h4>
					<el-button @click="startAnimation">开始</el-button>
					<el-button @click="pauseAnimation">暂停</el-button>
					<el-button @click="resumeAnimation">继续</el-button>
				</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 上传图片需要携带token
				myHeaders:{
					satoken:window.sessionStorage.getItem('satoken')
				},
				showImageSrc: '',
				// 查询的车牌
				queryCarName:'',
				// 分页查询数据
				queryInfo: {
					pageNo: 1,
					pageSize: 10,
					// 倒叙必填
					order: "desc",
					column: "id"
				},
				// 分页列表
				carList: [],
				// 总条数
				total: 0,
				srcList: [],

				// 创建对话框数据
				addDialogVisible: false,
				addForm: {
					licensePlate: "",
					carstate: "正常",
					frame: "",
					engine: "",
					name: "",
					phoneno: "",
					companyl: "",
					vehicleLicense: "",
					vehiclelicensedate: "",
					checkDate: "",
					insurance: "",
					insurancea: "",
					insuranceb: "",
					insurancec: "",
					insuranced: "",
					insurancee: "",
					insurancef: "",
					insuranceg: "",
					insuranceh: "",
					insurancel: "",
					insuranceDate: "",
					caroperating: "",
					operatingdate: "",
					carmargin: "",
					fine: "",
					finedate: "",
					finewhy: "",
					management: "",
					managementDate: "",
					payFee: "",
					dispatch:"",
				},
				// 创建表单验证规则
				addFormRules: {
					licensePlate: [{
						required: true,
						message: "请输入车牌号",
						trigger: 'blur'
					}],
					vehiclelicensedate: [{
						required: true,
						message: "请选择行驶证到期时间",
						trigger: 'blur'
					}],
					checkDate: [{
						required: true,
						message: "请选择年检到期时间",
						trigger: 'blur'
					}],
					insuranceDate: [{
						required: true,
						message: "请选择保险到期时间",
						trigger: 'blur'
					}],
					operatingdate: [{
						required: true,
						message: "请选择营运证到期时间",
						trigger: 'blur'
					}],
				},
				// 车辆状态
				carstateList: [{
					value: '正常',
					label: '正常'
				}, {
					value: '停车',
					label: '停车'
				}, {
					value: '永久报停',
					label: '永久报停'
				}],

				// 编辑对话框数据
				// 编辑对话框显示与隐藏
				editDialogVisible: false,
				editForm: {},

				// 创建页面选择框数据
				options: [],
				companyList: [],
				loading: false,
				states: [],

				// 员工ID/姓名查询
				searchEmployee: '',

				// 证件照片
				dialogImageUrl: '',
				dialogVisible: false,
				disabled: false,
				// 照片数量限制
				uploadLimit: 1,

				updateVehicleLicenseUrl: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImagevehicleLicense",
				updateInsuranceUrl1: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsurance",
				updateInsuranceUrl2: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsuranceA",
				updateInsuranceUrl3: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsuranceB",
				updateInsuranceUrl4: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsuranceC",
				updateInsuranceUrl5: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsuranceD",
				updateInsuranceUrl6: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsuranceE",
				updateInsuranceUrl7: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsuranceF",
				updateInsuranceUrl8: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsuranceG",
				updateInsuranceUrl9: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsuranceH",
				updateInsuranceUrl10: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImageinsuranceL",
				updateCaroperatingUrl: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImagecaroperating",
				updatePayFeeUrl: "http://81.70.151.121:8080/jeecg-boot/kCarinformation/uploadImagepayFee",

				// 图片放大
				showDriverCertificateDriver: false,
				// 查询违章数据
				queryViolationDialog: false,
				queryViolationList: [],

				// 选择框数据
				queryCompanyName: '',
				companyOptions: [],
				companyList: [],
				companyLoading: false,
				companyStates: [],
				
				// 调度选择框数据
				dispatchOptions: [],
				dispatchList: [],
				dispatchLoading: false,
				dispatchStates: [],

				// 位置
				locationDialog: false,
				// 历史轨迹数据
				historyDialog: false,
				// 历史轨迹查询的数据
				historyQueryInfo:{
					
					string:'鲁AG6870',
					begintime:'2021-04-14 10:30:10',
					endtime:'2021-04-14 11:30:10'
				},
				// 历史轨迹查询的时间
				selectTime:'',
				// 历史轨迹查询加载
				fullscreenLoading: false,
				firstArr: [116.478935, 39.997761],
				lineArr: {},
				// 历史轨迹相关数据
				map: {},
				carMarker:{},
				carWindow:{},
				pathPolyline:{},
				passedPolyline:{}
			}
		},

		created() {
			this.getCarList()
			this.getAllCompanyList()
			this.getAllDispatchList()
		},
		mounted() {


		},

		methods: {
			// 上传图片限制 
			beforeAvatarUpload(file) {
				console.log(file)
				const isLt10M = file.size / 1024 / 1024 < 10;
				if (!isLt10M) {
					this.$message.error('上传图片大小不能超过 10MB!');
				}
				return isLt10M;
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
			// 公司变化
			companylChange(e){
				if(!e){
					this.companyOptions = this.companyList
				}
			},
			
			// 获取所有员工
			async getAllDispatchList() {
				const {
					data: res
				} = await this.$http.get('kuser/findALLname')
				// console.log(res)
				if (res.code !== 200) {
					return
				}
				this.dispatchStates = res.result
			
				this.dispatchList = this.dispatchStates.map(item => {
					return {
						value: `${item}`,
						label: `${item}`
					};
				});
				this.dispatchOptions = this.dispatchList
			},
			
			// 选择员工方法
			remoteDispatchMethod(query) {
				if (query !== '') {
					this.dispatchLoading = true;
					setTimeout(() => {
						this.dispatchLoading = false;
						this.dispatchOptions = this.dispatchList.filter(item => {
							return item.value.indexOf(query) > -1;
						});
					}, 300)
				} else {
					this.dispatchOptions = this.dispatchList
				}
			},

			//分页区域 
			// 根据分页查询列表
			async getCarList() {
				const {
					data: res
				} = await this.$http.get('kCarinformation/list', {
					params: this.queryInfo
				})
				// console.log(res)
				if (!res.result.records) {
					return this.$message.error(res.message)
				}
				this.$message.success(res.message)
				this.carList = res.result.records
				this.total = res.result.total
			},

			//点击查看放大图片 
			handleClickImage(src) {
				this.srcList = []
				this.srcList.push(src)
			},

			// 点击查询按钮
			async handleQueryBtn() {
				this.queryInfo.licensePlate = "*" + this.queryCarName + "*"
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getCarList()
				// const {
				// 	data: res
				// } = await this.$http.get('kCarinformation/list?licensePlate='+licensePlate)
				// console.log(res)
				// this.carList = res.result.records
				// this.total = res.result.total
			},
			// 返回按钮
			handleQueryBackBtn() {
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.queryInfo.licensePlate = ''
				this.queryCarName = ''
				this.getCarList()
			},

			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getCarList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getCarList()
			},

			// //上传时，判断文件的类型及大小是否符合规则
			// beforeAvatarUpload(file) {
			// 	const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif'
			// 	const isLt2M = file.size / 1024 / 1024 < 2
			// 	if (!isJPG) {
			// 		this.$message.warning('上传图片只能是 JPG/PNG/GIF 格式!')
			// 		return isJPG
			// 	}
			// 	if (!isLt2M) {
			// 		this.$message.warning('上传图片大小不能超过 2MB!')
			// 		return isLt2M
			// 	}
			// 	this.multfileImg = file
			// 	return isJPG && isLt2M
			// },
			// 创建图片上传成功的回调
			handleVehicleLicenseUrlSuccess(response, file, fileList) {
				
				this.addForm.vehicleLicense = response.result.vehicleLicenseFileName
			},
			handleInsuranceUrlSuccess1(response, file, fileList) {
				// console.log(response)
				this.addForm.insurance = response.result.insuranceFileName
			},
			handleInsuranceUrlSuccess2(response, file, fileList) {
				// console.log(response)
				this.addForm.insurancea = response.result.insuranceFileNameA
			},
			handleInsuranceUrlSuccess3(response, file, fileList) {
				
				this.addForm.insuranceb = response.result.insuranceFileNameB
			},
			handleInsuranceUrlSuccess4(response, file, fileList) {
				
				this.addForm.insurancec = response.result.insuranceFileNameC
			},
			handleInsuranceUrlSuccess5(response, file, fileList) {
				
				this.addForm.insuranced = response.result.insuranceFileNameD
			},
			handleInsuranceUrlSuccess6(response, file, fileList) {
				
				this.addForm.insurancee = response.result.insuranceFileNameE
			},
			handleInsuranceUrlSuccess7(response, file, fileList) {
				
				this.addForm.insurancef = response.result.insuranceFileNameF
			},
			handleInsuranceUrlSuccess8(response, file, fileList) {
				
				this.addForm.insuranceg = response.result.insuranceFileNameG
			},
			handleInsuranceUrlSuccess9(response, file, fileList) {
				
				this.addForm.insuranceh = response.result.insuranceFileNameH
			},
			handleInsuranceUrlSuccess10(response, file, fileList) {
				
				this.addForm.insurancel = response.result.insuranceFileNameL
			},
			
			handleCaroperatingUrlSuccess(response, file, fileList) {
				
				this.addForm.caroperating = response.result.caroperatingFileName
			},
			handlePayFeeUrlSuccess(response, file, fileList) {

				this.addForm.payFee = response.result.payFeeFileName
			},
			handleWarning() {
				this.$message.error('请先删除后再添加')
			},

			// 创建对话框
			addInfo() {
				// console.log(this.addForm)
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) return
					// 发起添加信息的数据请求
					const {
						data: res
					} = await this.$http.post('kCarinformation/add', this.addForm)
					
					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 添加成功，关闭对话框，刷新数据列表，提示添加成功
					this.addDialogVisible = false
					this.getCarList()
					// this.getAllDriverList()
					this.$message.success(res.message)
				})
			},
			// 监听创建对话框关闭
			addDialogClosed() {
				this.$refs.addFormRef.resetFields()
				this.addForm.licensePlate = ''
				this.addForm.carstate = '正常'
				this.addForm.frame = ''
				this.addForm.engine = ''
				this.addForm.name = ''
				this.addForm.phoneno = ''
				this.addForm.companyl = ''
				this.addForm.vehicleLicense = ''
				this.addForm.vehiclelicensedate = ''
				this.addForm.checkDate = ''
				this.addForm.insurance = ''
				this.addForm.insurancea = ''
				this.addForm.insuranceb = ''
				this.addForm.insurancec = ''
				this.addForm.insuranced = ''
				this.addForm.insurancee = ''
				this.addForm.insurancef = ''
				this.addForm.insuranceg = ''
				this.addForm.insuranceh = ''
				this.addForm.insurancel = ''
				this.addForm.insuranceDate = ''
				this.addForm.caroperating = ''
				this.addForm.operatingdate = ''
				this.addForm.carmargin = ''
				this.addForm.fine = ''
				this.addForm.finedate = ''
				this.addForm.finewhy = ''
				this.addForm.management = ''
				this.addForm.managementDate = ''
				this.addForm.payFee = ''
				this.addForm.dispatch = ''
				// this.searchEmployee = ""
				// this.options = this.companyList
			},


			// 编辑对话框操作	

			// 创建图片上传成功的回调
			handleEditVehicleLicenseUrlSuccess(response, file, fileList) {
				
				this.editForm.vehicleLicense = response.result.vehicleLicenseFileName
			},
			handleEditInsuranceUrlSuccess1(response, file, fileList) {
		
				this.editForm.insurance = response.result.insuranceFileName
			},
			handleEditInsuranceUrlSuccess2(response, file, fileList) {
				// console.log(response)
				this.editForm.insurancea = response.result.insuranceFileNameA
			},
			handleEditInsuranceUrlSuccess3(response, file, fileList) {
				
				this.editForm.insuranceb = response.result.insuranceFileNameB
			},
			handleEditInsuranceUrlSuccess4(response, file, fileList) {
				
				this.editForm.insurancec = response.result.insuranceFileNameC
			},
			handleEditInsuranceUrlSuccess5(response, file, fileList) {
				
				this.editForm.insuranced = response.result.insuranceFileNameD
			},
			handleEditInsuranceUrlSuccess6(response, file, fileList) {
				
				this.editForm.insurancee = response.result.insuranceFileNameE
			},
			handleEditInsuranceUrlSuccess7(response, file, fileList) {
				
				this.editForm.insurancef = response.result.insuranceFileNameF
			},
			handleEditInsuranceUrlSuccess8(response, file, fileList) {
				
				this.editForm.insuranceg = response.result.insuranceFileNameG
			},
			handleEditInsuranceUrlSuccess9(response, file, fileList) {
				
				this.editForm.insuranceh = response.result.insuranceFileNameH
			},
			handleEditInsuranceUrlSuccess10(response, file, fileList) {
				
				this.editForm.insurancel = response.result.insuranceFileNameL
			},
			
			handleEditCaroperatingUrlSuccess(response, file, fileList) {
		
				this.editForm.caroperating = response.result.caroperatingFileName
			},
			handleEditPayFeeUrlSuccess(response, file, fileList) {
				this.editForm.payFee = response.result.payFeeFileName
			},
			// 展示编辑公司的对话框
			async showEditDialog(id) {
				// console.log(driverNo)
				const {
					data: res
				} = await this.$http.get('kCarinformation/list?id=' + id)
			
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.editForm = res.result.records[0]
				// 显示对话框
				this.editDialogVisible = true
			},

			// 监听修改用户对话框关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
				this.editContractData = []
			},


			// 修改信息并提交
			editInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.post('kCarinformation/edit', this.editForm)

					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getCarList()
					// this.getAllDriverList()
					this.$message.success(res.message)
				})
			},

			// 删除操作
			async removeById(id) {
				const {
					data: res
				} = await this.$http.get('kCarinformation/deleteById?id=' + id)

				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// 删除成功，刷新数据列表，提示删除成功
				this.getCarList()
				// this.getAllDriverList()
				this.$message.success(res.message)
			},

			// 查询违章
			async showQueryViolationDialog(carNumber) {
				const {
					data: res
				} = await this.$http.get('killegal/list?carNumber=' + carNumber)
				
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				if (res.result.records.length == 0) {
					return this.$message.warning('未查询到违章')

				}
				this.queryViolationList = res.result.records
				// 显示对话框
				this.queryViolationDialog = true
			},

			// 位置
			async showLocationDialog(licensePlate) {
				const {data:res} = await this.$http.get('kCarinformation/GetCarCurrent?string=' + licensePlate)
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
							icon: "http://81.70.151.121/imgs/kache.png",
							position: [last_lon, last_lat],
							offset: new AMap.Pixel(-13, -30)
						});
						marker1.setTitle(carInfo.carMark +":"+ carInfo.location)
						// marker1.setMap(map1);
						map1.add(marker1)
					}, 200)
				}else{
					this.$message.warning('暂无数据')
				}
			},
			// 历史轨迹查询
			async handleSelectHistoryTrack(){
				
				if (!this.selectTime) {
					return this.$message.warning('请选择时间！')
				}
				this.fullscreenLoading = true;
				this.historyQueryInfo.begintime = this.selectTime[0]
				this.historyQueryInfo.endtime = this.selectTime[1]
				// console.log(this.historyQueryInfo.selectTime)
				const {data:res} = await this.$http.get('kCarinformation/GetHistoryTrackBycarMark',{params:this.historyQueryInfo})
				this.fullscreenLoading = false;
				
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				if(res.result.anyType.HistoryTrack){
					this.lineArr = res.result.anyType.HistoryTrack.map( item =>{
						return {
							last_lon: `${item.last_lon}`,
							last_lat: `${item.last_lat}`,
							speedG: `${item.speedG}`,
						}
					})
					// console.log(this.lineArr)
					this.firstArr = [this.lineArr[0].last_lon,this.lineArr[0].last_lat]
					setTimeout(() => {
						this.initMap();
						// this.initroad();speed
					}, 200);
				}else{
					this.$message.warning('未查询到线路信息')
				}
			},
			
			// 历史轨迹
			async showHistoryDialog(string) {
				
				this.historyQueryInfo.string = string
				const {data:res} = await this.$http.get('kCarinformation/GetCarCurrent?string=' + string)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				// console.log(res)
				if(res.result.anyType.GPSPoint){				
					const {last_lon} = res.result.anyType.GPSPoint
					const {last_lat} = res.result.anyType.GPSPoint
					this.firstArr = [last_lon,last_lat]
					setTimeout(() => {
						this.initMap();
					}, 200)
				}else{
					this.$message.warning('暂无位置信息数据')
				}
				// const {data:res} = await this.$http.get('kCarinformation/GetHistoryTrackBycarMark',{params:this.historyQueryInfo})
				
				// console.log(res)
				// if (res.code !== 200) {
				// 	return this.$message.error('查询信息失败')
				// }
				// if(res.result.anyType.HistoryTrack){
				// 	this.lineArr = res.result.anyType.HistoryTrack.map( item =>{
				// 		return [item.last_lon, item.last_lat]
				// 	})
				// 	this.firstArr = this.lineArr[0]
				// 	setTimeout(() => {
				// 		this.initMap();
				// 		this.initroad();
				// 	}, 200);
				// }else{
				// 	this.$message.warning('未查询到线路信息')
				// }
				this.historyDialog = true
			},

			//初始化地图
			initMap() {
				// 1. 创建地图
				this.map = new AMap.Map("container", {
					resizeEnable: true, //窗口大小调整
					center: this.firstArr, //中心 firstArr: [116.478935, 39.997761],
					zoom: 12
				});
				
					// 2.创建小汽车marker
				this.carMarker = new AMap.Marker({
					map: this.map,
					position: this.firstArr,
					icon: "http://81.70.151.121/imgs/kache1.png",
					offset: new AMap.Pixel(-26, -13), //调整图片偏移
					autoRotation: true, //自动旋转
					// angle: -90 //图片旋转角度
				});
				
				// 3.创建跟速度信息展示框
				this.carWindow = new AMap.InfoWindow({
					offset: new AMap.Pixel(6, -25),
					content: ""
				});
				
				// 4.生成车辆回放轨迹
				this.pathPolyline = this.initializePaths(this.lineArr, this.map);
				
				// 8.地图自适应缩放
				this.map.setFitView();
				
				
				// 设置label标签
				// label默认蓝框白底左上角显示，样式className为：amap-marker-label
				// this.marker.setLabel({
				//     offset: new AMap.Pixel(20, 20),  //设置文本标注偏移量
				//     content: "<div class='info'>速度是100KM</div>", //设置文本标注内容
				//     direction: 'right' //设置文本标注方位
				// });
			},

			//初始化轨迹
			// initroad() {
			// 	//绘制还未经过的路线
			// 	this.polyline = new AMap.Polyline({
			// 		map: this.map,
			// 		path: this.lineArr,
			// 		showDir: true,
			// 		strokeColor: "#28F", //线颜色--蓝色
			// 		// strokeOpacity: 1,     //线透明度
			// 		strokeWeight: 6 //线宽
			// 		// strokeStyle: "solid"  //线样式
			// 	});
			// 	//绘制路过了的轨迹
			// 	this.passedPolyline = new AMap.Polyline({
			// 		map: this.map,
			// 		strokeColor: "#AF5", //线颜色-绿色
			// 		//path: this.lineArr,
			// 		// strokeOpacity: 1,     //线透明度
			// 		strokeWeight: 6 //线宽
			// 		// strokeStyle: "solid"  //线样式
			// 	});
			// 	this.marker.on("moving", e => {

			// 		passedPolyline.setPath(e.passedPath);
			// 	});
			// 	this.map.setFitView(); //合适的视口
			// },
			initializePaths(paths, map1) {
				// console.log(map1)
				var line;
				var pathLngLatArray = new Array();
				if (paths) {
					for (var i = 0; i < paths.length; i++) {
						pathLngLatArray.push(new AMap.LngLat(paths[i].last_lon, paths[i].last_lat));
					}
					line = new AMap.Polyline({
						map: map1,
						path: pathLngLatArray,
						strokeColor: '#28F',
						strokeOpacity: 0.8,
						strokeWeight: 6,
						strokeStyle: 'solid'
					});
					line.setMap(map1);
				}
				return line;
			},
			setVehicleSpeedInWidowns(lnglat) {
				for (var i = 0; i < this.lineArr.length; i++) {
					if (lnglat.distance(new AMap.LngLat(this.lineArr[i].last_lon, this.lineArr[i].last_lat)) < 4) {
						this.carWindow.setContent("速度:" + (this.lineArr[i].speedG * 1.852).toFixed(2) + "公里/时");
						return;
					}
				}
			},

			startAnimation() {
				// 绘制车辆走过了的颜色
					this.passedPolyline = new AMap.Polyline({
						map: this.map,
						strokeColor: "#AF5", //线颜色-绿色
						//path: this.lineArr,
						// strokeOpacity: 1,     //线透明度
						strokeWeight: 6 //线宽
						// strokeStyle: "solid"  //线样式
					});
				// 5.车辆随轨迹移动
				this.carMarker.moveAlong(this.pathPolyline.getPath(), 1000, function(k) {
					return k
				}, false);
				
				// 6.速度框随车辆移动
				AMap.event.addListener(this.carMarker, 'moving', (e)=> {
					this.passedPolyline.setPath(e.passedPath);
					var lastLocation = e.passedPath[e.passedPath.length - 1];
					this.carWindow.setPosition(lastLocation);
					this.setVehicleSpeedInWidowns(lastLocation);
				});
				
				// 7.打开速度框setPosition
				this.carWindow.open(this.map, this.carMarker.getPosition());
			},
			pauseAnimation() {
				this.carMarker.pauseMove();
			},
			resumeAnimation() {
				this.carMarker.resumeMove();
			},
			stopAnimation() {
				this.carMarker.stopMove();
			},
			// 历史轨迹对话框关闭事件carWindow.setPosition
			historyDialogClosed(){
				this.stopAnimation();
				this.selectTime = []
				this.lineArr ={}
				this.map ={}
				this.carMarker ={}
				this.carWindow ={}
				this.pathPolyline ={}
				this.lineArr ={}
				
			},

		}
	}
</script>

<style lang="less" scoped>
	.addDriver {
		display: flex;
	}

	.emergency {
		display: flex;

		.driverEmergencyContact {
			flex: 2;
		}

		.driverRelationship {
			flex: 2;
		}

		.driverEmergencyTel {
			flex: 3
		}
	}

	.carOwner {
		display: flex;
	}

	.driverCarType {
		display: flex;
	}


	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}

	.box-card {
		margin-top: 10px;
	}
</style>
