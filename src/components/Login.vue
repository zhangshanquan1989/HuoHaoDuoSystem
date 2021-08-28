<template>
	<div class="login_container">
		<div class="background">
			<img src="../assets/login/登陆背景图S.jpg" alt="">
		</div>

		<div class="login_box">
			<!-- 左侧图片区域 -->
			<div class="tiankangxitong">
				<img src="../assets/login/天康系统@2x.png" alt="">
			</div>
			<div class="acatar_box">
				<img src="../assets/login/登录侧边图S.png" alt="">
			</div>
			<div class="form_box">
				<!-- 登录表单区域 -->
				<div class="form_box_text">
					<span>欢迎登录货好多天康系统</span>
				</div>
				<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
					<!-- 用户名 -->
					<el-form-item prop="username" class="form_box_username">
						<!-- <i class="iconfont icon-yonghu"></i> -->
						<input v-model="loginForm.username" class="inputUsername">

						<!-- <el-input class="inputName" v-model="loginForm.username" prefix-icon="el-icon-user"></el-input> -->
					</el-form-item>
					<!-- 密码 -->
					<el-form-item prop="password" class="form_box_password">
						<input type="password" v-model="loginForm.password" class="inputpassword" >
						<!-- 						<el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-goods"></el-input> -->
					</el-form-item>

					<!-- 验证码 -->
					<el-form-item prop="captcha" class="form_box_captcha">
						<input v-model="loginForm.captcha" class="inputcaptcha" placeholder="验证码">
						<img :src="randomImage" alt="" @click="handleChangeRandomImage">
						<!-- <el-button size="mini"  @click="handleChangeRandomImage" style="position: absolute;">换一张</el-button> -->
					</el-form-item>

					<!-- 按钮 -->
					<el-form-item class="btns">
						<el-button type="primary" round @click="login" @keyup.enter="loginBtn" style="width: 335px;margin-top: 30px;height: 56px;border-radius: 28px;font-size:22px ;">登录</el-button>
						<el-button plain type="info" round @click="resetLoginForm" style="display: block;margin-top: 20px;width: 335px;height: 56px;border-radius: 28px;font-size:22px ;margin-left: 0;">重置</el-button>
					</el-form-item>
				</el-form>
			</div>

		</div>
	</div>
</template>

<script>
	import '../assets/font_o6ujaofv71i/iconfont.css';
	export default {
		data() {
			return {
				// 验证码图片
				randomImage: '',
				// 登录表单的数据绑定对象
				loginForm: {
					username: '',
					password: '',
					checkKey: 'abc',
					captcha: ''
				},
				//表单验证规则
				loginFormRules: {
					//验证用户名是否合法
					username: [{
						required: true,
						message: '请输入登录名称',
						trigger: 'blur'
					}],
					//验证密码是否合法
					password: [{
						required: true,
						message: '请输入登录密码',
						trigger: 'blur'
					}]
				}

			}
		},
		created() {
			this.getRandomImage()
		},
		mounted() {
			// 绑定监听事件
			window.addEventListener("keydown", this.keyDown);
		},
		methods: {
			// 键盘回车loginFormRef
			keyDown(e) {
				// 回车则执行登录方法 enter键的ASCII是13
				if (e.keyCode === 13) {
						this.login(); // 定义的登录方法
				}
			},

			// 获取登录验证码
			async getRandomImage() {
				const {
					data: res
				} = await this.$http.get('tPmAuthority/randomImage/abc')
				// console.log(res)
				if (res.code !== 0) return
				this.randomImage = res.result

			},

			// 重新生成验证码
			async handleChangeRandomImage() {
				const {
					data: res
				} = await this.$http.get('tPmAuthority/randomImage/abc')
				// console.log(res)
				if (res.code !== 0) return
				this.randomImage = res.result
			},
			//点击重置按钮，重置登录表单
			resetLoginForm() {
				this.$refs.loginFormRef.resetFields();
			},
			// 点击登录按钮 tPmAuthority
			login() {
				// console.log(this.$refs)
				this.$refs.loginFormRef.validate(async valid => {
					if (!valid) return;
					// console.log(this.loginForm)
					const {
						data: res
					} = await this.$http.post('kaccount/login', this.loginForm);
					// console.log(res)
					if (res.code !== 200) return this.$message.error(res.message)
					// console.log(res.result.satoken)
					// console.log('用户ID',res.result.用户ID)
					this.$message.success("登录成功")
					// 1.登录成功后，将返回的token值，保存到客户端的 sessionStorage 中
					window.sessionStorage.setItem("satoken", res.result.satoken)
					// 登录后的用户id,用于运单和配送获取数据
					window.sessionStorage.setItem("userID", res.result.id)
					// 登录后的用户所属的部门id,用于运单和配送获取数据
					window.sessionStorage.setItem("departmentId", res.result.department)
					// 登录后的用户的角色名,用于运单和配送获取数据
					window.sessionStorage.setItem("role", res.result.role)
					// 登陆后的公司名称，用于权限获取公司用户
					window.sessionStorage.setItem("company", res.result.company)
					// 登陆后的公司id，用于部门管理添加部门时的父ID
					window.sessionStorage.setItem("companyId", res.result.Companyid)
					// 登陆后的用户名，用于首页展示
					window.sessionStorage.setItem("name", res.result.name)
					// 2.登录成功后，跳转到主页
					this.$router.push("home")
				})

			},
			destroyed() {
				// 销毁事件
				window.removeEventListener("keydown", this.keyDown, false);
			},
		}
	}
</script>

<style lang="less" scoped>
	.login_container {
		// background-color: #2b4b6b;
		height: 100%;
	}

	.background {
		width: 100%;
		height: 100%;
		z-index: -1;
		position: absolute;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.login_box {
		width: 1342px;
		height: 662px;
		background-color: #fff;
		border-radius: 20px;
		position: absolute;
		margin-top: 110px;
		left: 50%;
		transform: translate(-50%, 0);

		.tiankangxitong {
			width: 324px;
			height: 55px;
			position: absolute;
			z-index: 2;
			margin-top: 42px;
			margin-left: 42px;

			img {
				width: 324px;
				height: 55px;
			}
		}

		.acatar_box {
			height: 660px;
			width: 728px;
			border: 1px solid #EEEEEE;
			border-top-left-radius: 20px;
			border-bottom-left-radius: 20px;
			// padding: 0.625rem;
			// box-shadow: 0 0 10px #ddd;
			position: absolute;
			// left: 50%;
			// transform: translate(-50%, -50%);
			background-color: #ebf2ff;

			img {
				margin-top: 144px;
				width: 728px;
				height: 504px;
				border-top-left-radius: 20px;
				border-bottom-left-radius: 20px;
				// background-color: red;
			}
		}

		.form_box {
			// background-color: red;
			height: 660px;
			width: 614px;
			margin-left: 728px;
			position: absolute;

			// text-align: center;
			.form_box_text {
				margin-top: 88px;
				font-size: 40px;
				margin-left: 90px;
			}
		}

	}

	.login_form {
		position: absolute;
		margin-top: 80px;
		margin-left: 139px;
		width: 100%;

		// padding: 0 1.25rem;
		// box-sizing: border-box;
		.form_box_username {}

		.form_box_password {}
	}

	.btns {}

	.inputUsername {
		background: url("../assets/login/用户2.png")no-repeat 0 center;
		width: 275px;
		height: 40px;
		// border-radius:5px;
		border: 1px solid #999999;
		// box-shadow: 1px 1px 3px #cccccc;
		padding-left: 60px;
		border-top: none;
		border-left: none;
		border-right: none;
		font-size: 22px;
		outline: none;
	}

	.inputpassword {
		background: url("../assets/login/密码2.png")no-repeat 0 center;
		width: 275px;
		height: 40px;
		// border-radius:5px;
		border: 1px solid #999999;
		// box-shadow: 1px 1px 3px #cccccc;
		padding-left: 60px;
		border-top: none;
		border-left: none;
		border-right: none;
		font-size: 22px;
		outline: none;
	}

	.inputcaptcha {
		width: 168px;
		height: 35px;
		font-size: 20px;
	}

	.form_box_captcha {
		img {
			position: absolute;
			margin-left: 15px;
			height: 100%;
		}
	}
</style>
