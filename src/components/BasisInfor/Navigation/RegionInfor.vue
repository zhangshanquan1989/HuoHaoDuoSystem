<template>
	<!-- 地区信息页面 -->
	<div>
		
		<!-- 创建搜索区 -->
		<el-row >
			<el-col :span="1" style="font-size: 17px;margin-top: 8px;padding-left: 5px;"><span>地区:</span></el-col>
			<el-col :span="2">
				<el-input placeholder="输入省份" v-model="queryInfo.areaProvinceBegin	" clearable></el-input>
			</el-col>

			<!-- 等级下拉框 -->
			<el-col :span="1" style="margin-left: 20px;font-size: 17px;margin-top: 8px; padding-left: 5px;"><span>等级:</span></el-col>
			<el-col :span="2">
				<el-select v-model="queryInfo.areaGrade" placeholder="全部" clearable>
					<el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-col>

			<!-- 查询按钮 -->
			<el-col :span="2" style="margin-left: 40px;">
				<el-button type="info"  @click="handleQueryBtn">查询</el-button>
			</el-col>
			
			<!-- 返回按钮 -->
			<el-col :span="2" style="margin-left: 15px;">
				<el-button type="info"  @click="handleQueryBackBtn">返回</el-button>
			</el-col>
			
		</el-row>

		<!-- 卡片视图区 -->
		<el-card class="box-card" style="margin-top: 8px;">
			<el-table :data="regionlist" stripe style="width: 100%">
				<el-table-column v-if="false" prop="id" label="ID">
				</el-table-column>
				<el-table-column v-if="false" prop="areaNo" label="地区编号">
				</el-table-column>
				<el-table-column prop="areaProvince" label="省/直辖区" width="150px">
				</el-table-column>
				<el-table-column prop="areaCity" label="市/直辖市" width="150px">
				</el-table-column>
				<el-table-column prop="areaCounty" label="区/县" width="150px">
				</el-table-column>
				<el-table-column prop="areaGrade" label="等级" width="100px">
				</el-table-column>
				<el-table-column label="定位" width="100px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="定位" placement="top">
						<i class="el-icon-location" @click="handleLocation(scope.row.areaCounty)"></i>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="areaRule" label="限行规则">
				</el-table-column>
				
				<el-table-column width="100px">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="复制" placement="top">
						<i class="el-icon-document-copy" :data-clipboard-text="scope.row.areaRule" @click="copyAreaRule"></i>
						</el-tooltip>
						
					</template>				
				</el-table-column>

				<el-table-column label="操作" width="150px">
					<template slot-scope="scope">
						<!-- 修改按钮 -->
						<el-button type="primary" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 分页区域 -->
		<el-col style="margin-top: 10px;">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNo"
			 :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</el-col>

		<!-- 编辑的对话框 -->
		<el-dialog title="编辑地区信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed" :close-on-click-modal="false">
			<!-- 编辑的表单 -->
			<el-form :model="editForm" ref="editFormRef" label-width="100px">
				<el-form-item label="地区编号:">{{editForm.areaNo}}</el-form-item>
				<el-form-item label="省/直辖区:">{{editForm.areaProvince}}</el-form-item>
				<el-form-item label="市/直辖市:">{{editForm.areaCity}}</el-form-item>
				<el-form-item label="区/县">{{editForm.areaCounty}}</el-form-item>
				<el-form-item label="等级">
					<el-select v-model="editForm.areaGrade" :placeholder="editForm.areaGrade">
						<el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="限行规则:">
					<el-input v-model="editForm.areaRule"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editInfo">确 定</el-button>
			</span>

		</el-dialog>
		
		<!-- 高德的对话框 -->
		<el-dialog title="地图" :visible.sync="locationDialogVisible" width="50%" :close-on-click-modal="false">
			<div>{{licationAddress}}:</div>
			<div id="container"></div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 查询数据
				queryInfo: {
					areaProvince: '',
					areaProvinceBegin:'',
					areaGrade: '',
					pageNo: 1,
					pageSize: 10
				},
				// 列表
				regionlist: [],
				// 总条数
				total: 0,
				// 添加表单的状态选项
				status: [{
					value: 'A',
					label: 'A'
				}, {
					value: 'B',
					label: 'B'
				}, {
					value: 'C',
					label: 'C'
				}, {
					value: 'D',
					label: 'D'
				}, {
					value: 'E',
					label: 'E'
				}],
				// 创建对话框数据
				addDialogVisible: false,
				addForm: {},
				// 编辑对话框数据
				// 编辑对话框显示与隐藏
				editDialogVisible: false,
				editForm: {},
				// 地图icon显示地图
				locationDialogVisible: false,
				licationAddress: '',
			}
		},

		created() {
			this.getRegionList()
		},

		methods: {

			//分页区域 
			// 根据分页查询列表
			async getRegionList() {
				this.queryInfo.areaProvince = "*"+this.queryInfo.areaProvinceBegin+"*"
				const {
					data: res
				} = await this.$http.get('base/tBaArea/list', {
					params: this.queryInfo
				})
        // console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}

				this.regionlist = res.result.records
				this.total = res.result.total
			},

			// 点击查询按钮
			 handleQueryBtn() {
				this.getRegionList()
			},
			// 点击返回按钮
			handleQueryBackBtn(){
				this.queryInfo.areaGrade = ''
				this.queryInfo.areaProvince = ''
				this.queryInfo.areaProvinceBegin = ''
				this.queryInfo.pageNo = 1
				this.queryInfo.pageSize = 10
				this.getRegionList()
			},
			
			// pageSize 改变的事件
			handleSizeChange(newSize) {
				this.queryInfo.pageSize = newSize
				this.getRegionList()
			},

			// 页码值改变事件
			handleCurrentChange(newPage) {
				this.queryInfo.pageNo = newPage
				this.getRegionList()
			},
			
			// 高德poi接口,根据地址在页面显示地址
			handleLocation(clientAddress) {
				this.locationDialogVisible = true
				this.licationAddress = clientAddress
				this.$nextTick(() => {
					var geocoder = new AMap.Geocoder();
					geocoder.getLocation(clientAddress, function(status, result) {
						if (status === 'complete' && result.info === 'OK') {
			
							// 经纬度                      
							var lng = result.geocodes[0].location.lng;
							var lat = result.geocodes[0].location.lat;
			
							// 地图实例
							var map = new AMap.Map("container", {
								resizeEnable: true, // 允许缩放
								center: [lng, lat], // 设置地图的中心点
								zoom: 12 // 设置地图的缩放级别，0 - 20
							});
							
							var tool = new AMap.ToolBar();
							map.addControl(tool);
			
							// 添加标记
							var marker = new AMap.Marker({
								map: map,
								position: new AMap.LngLat(lng, lat), // 经纬度
							});
						} else {
							console.log('定位失败！');
						}
					});
				})
			},

			// 编辑对话框操作	
			
			// 展示编辑的对话框
			async showEditDialog(id) {
				// console.log(id)
				const {
					data: res
				} = await this.$http.get('base/tBaArea/findArea?id=' + id)
				// console.log(res)
				if (res.code !== 200) {
					return this.$message.error(res.message)
				}
				this.editForm = res.result
				// 显示对话框
				this.editDialogVisible = true
			},

			// 监听修改对话框关闭事件
			editDialogClosed() {
				this.$refs.editFormRef.resetFields()
			},


			// 修改信息并提交
			editInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					// 发起修改信息的数据请求
					const {
						data: res
					} = await this.$http.post('base/tBaArea/edit', this.editForm)

					if (res.code !== 200) {
						return this.$message.error(res.message)
					}
					// 更新成功，关闭对话框，刷新数据列表，提示修改成功
					this.editDialogVisible = false
					this.getRegionList()
					this.$message.success(res.message)
				})
			},
			
			// 复制限行规则
			copyAreaRule(){
				let clipboard = new this.Clipboard(".el-icon-document-copy");
				      clipboard.on("success", e => {
				        // 释放内存
								this.$message.success('已成功复制')
				        clipboard.destroy();
				      });
			}
		}
	}
</script>

<style scoped>
#container {
		width: 100%;
		height: 500px;
	}
</style>
