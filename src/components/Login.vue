<template>
	<div class="login_container">
		<div class="backgroundImg">
			<img src="../assets/loginTwo/LoginBg3.png" alt="">
		</div>

		<div class="loginTwo_box">	
			<div>
				<!-- 文字 -->
				<div class="box_text">
					<span>账号登陆</span>
				</div>
				<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px">
					<el-form-item prop="username" >					
				<!-- 用户名 -->
				<div class="box_name">
					<div class="box_name_icon">
						<img src="../assets/loginTwo/user1.png" />
					</div>
					<div class="box_name_input">
						<el-input clearable placeholder="用户名" v-model="loginForm.username"></el-input>
					</div>
				</div>
				</el-form-item>
				
				<el-form-item prop="password" >
				<!-- 密码 -->
				<div class="box_name" style="margin-top: 10px;">
					<div class="box_name_icon">
						<img src="../assets/loginTwo/password.png" />
					</div>
					<div class="box_name_input">
						<el-input  placeholder="密码" v-model="loginForm.password" show-password></el-input>
					</div>
				</div>
				</el-form-item>
				
				
				<el-form-item prop="captcha" >
				<div class="box_YZM">
					<div class="box_YZM_hang">
						<div class="box_YZM_icon">
							<img src="../assets/loginTwo/yanzhengma.png" />
						</div>
						<div class="box_YZM_input">
							<el-input  placeholder="验证码" v-model="loginForm.captcha" ></el-input>
						</div>
					</div>

					<div class="box_YZM_img_row">
						<div class="box_YZM_img">
							<img :src="randomImage" @click="handleChangeRandomImage" />
						</div>
					</div>
				</div>
				</el-form-item>
				<el-form-item >
					<!-- 登录按钮 -->
				<div class="box_btn">
					<el-button type="primary"  @click="login" @keyup.enter="loginBtn" style="width: 398px;margin-top: 45px;margin-left: 75px;height: 60px;font-size:26px ;">登 录</el-button>
				</div>
				</el-form-item>
				</el-form>
			</div>

		</div>



		<!-- 下面是版本1 -->
		<!-- 		<div class="login_box">
			<div class="tiankangxitong">
				<img src="../assets/login/天康系统@2x.png" alt="">
			</div>
			<div class="acatar_box">
				<img src="../assets/login/登录侧边图S.png" alt="">
			</div>
			<div class="form_box">
				
				<div class="form_box_text">
					<span>欢迎登录货好多天康系统</span>
				</div>
				<el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
					
					<el-form-item prop="username" class="form_box_username">					
						<input v-model="loginForm.username" class="inputUsername">
					</el-form-item>
					
					<el-form-item prop="password" class="form_box_password">
						<input type="password" v-model="loginForm.password" class="inputpassword" >
					</el-form-item>

					
					<el-form-item prop="captcha" class="form_box_captcha">
						<input v-model="loginForm.captcha" class="inputcaptcha" placeholder="验证码">
						<img :src="randomImage" alt="" @click="handleChangeRandomImage">						
					</el-form-item>
					
					<el-form-item class="btns">
						<el-button type="primary" round @click="login" @keyup.enter="loginBtn" style="width: 335px;margin-top: 30px;height: 56px;border-radius: 28px;font-size:22px ;">登录</el-button>
						<el-button plain type="info" round @click="resetLoginForm" style="display: block;margin-top: 20px;width: 335px;height: 56px;border-radius: 28px;font-size:22px ;margin-left: 0;">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div> -->


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
		width: 100%;
		height: 100%;
		position: relative;
	}

	.backgroundImg {
		width: 100%;
		height: 100%;
		z-index: -2;
		position: absolute;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.loginTwo_box {
		width: 550px;
		height: 531px;
		right: 125px;
		top: 20%;
		position: absolute;
		background-image: url(../assets/loginTwo/denglujuxing.png);
		
	}
	.box_text {
		font-size: 33px;
		color: #FFf;
		margin-left: 75px;
		padding-top: 50px;
	}

	
	.box_name_input /deep/ .el-input__inner {
		width: 340px;
	  background-color: rgba(6,135,205,0.2);
		border:0;
		height: 45.2px;		
		color: #fff;
		font-size: 18px;
	}

	.box_name {
		width: 398px;
		height: 45.2px;
		display: flex;
		border: 2px solid rgba(255,255,255,0.5);
		border-radius: 4px;
		margin-left: 75px;
		margin-top: 30px;
	}

	.box_name_icon {
		width: 45px;
		img{
			width: 19px;
			height: 19px;
			margin-left: 13px;
			margin-top: 13px;
		}
	}

// 	.box_name_input {
// 		width: 340px;
		
// 		margin-top: 2.5px;
// 		font-size: 18px;
// 		color: #FFF
// 	}
	
.box_name_input /deep/input::-webkit-input-placeholder{
  -webkit-text-fill-color: #fff;
}

.box_YZM{
	display: flex;
}
.box_YZM_hang{
	width: 260px;
	height: 45.2px;
	display: flex;
	border: 2px solid rgba(255,255,255,0.5);
	border-radius: 4px;
	margin-left: 75px;
	margin-top: 10px;
}
.box_YZM_icon{
	width: 45px;
	img{
		width: 19px;
		height: 19px;
		margin-left: 13px;
		margin-top: 13px;
	}
}

	.box_YZM_input /deep/ .el-input__inner {
		width: 200px;
	  background-color: rgba(6,135,205,0.2);
		border:0;
		height: 45.2px;		
		color: #fff;
		font-size: 18px;
	}
	
	.box_YZM_img_row{
		width: 126.6px;
		height: 45.2px;
		border: 2px solid rgba(255,255,255,0.5);
		border-radius: 4px;
		margin-left: 10px;
		margin-top: 10px;		
	}
	
.box_YZM_img{
	width: 92px;
	margin-left: 13px;
	margin-top: 4px;
	opacity: 0.7;
}








// 下面的是版本1的样式
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
