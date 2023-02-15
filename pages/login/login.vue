<template>
	<view class="page">
		<!-- 	<view class="box-title">
			<image src="../../static/logo.png"></image>
			<view class="box-size">浙江省绿色电力积分交易中心</view>
		</view> -->
		<view class="head-nav">
			<view class="headerC">
				<view :class="navIndex == 0 ? 'activite' : ''" @click="checkIndex(0)" class="loginBtn"
					style="font-size: 20px;margin-right: 80px;">个人登录</view>
				<view :class="navIndex == 1 ? 'activite' : ''" @click="checkIndex(1)"
					style="font-size: 20px;padding: 0;">法人登录</view>
			</view>
			<view class="content" v-if="navIndex == 0">
				<form>
					<view class="form">
						<view class="ptitle">手机号：</view>
						<view class="phone">
							<uni-easyinput :class="[]" placeholder-style="font-size:32rpx;background-color:#FFF" :inputBorder="false"
								name="phone" v-model="phone" maxlength="11" placeholder="请输入手机号" />
						</view>
					</view>
					<view class="kuang">
						<view class="stitle">验证码：</view>
						<view class="smsCode">
							<uni-easyinput :class="[]" placeholder-style="font-size:32rpx;background-color:#FFF" :inputBorder="false"
								name="smsCode" v-model="smsCode" maxlength="6" placeholder="请输入验证码" />
						</view>
						<button :disabled="!phone" :class="[isPhone]" class="box-button1"
							style="font-size: 30rpx; margin-top: 30rpx;margin-left: 12rpx;" @click="sendCode">
							{{ timer ? `${count}s 后重发` : `发送验证码` }}
						</button>
					</view>

					<button :disabled="!phone || !smsCode" class="box-button" 
						@click="onLogin">登录</button>
				</form>
			</view>
			<view class="content" v-if="navIndex == 1">
				<form>
					<view class="form2">
						<span data-boldtype="0" class="spanstyle">用户名:</span>
						<uni-easyinput placeholder-style="font-size:32rpx;background-color:#fff" :inputBorder="false" v-model="userName"
							class="lgog" name="userName" placeholder="请输入登录用户名"></uni-easyinput>
					</view>
					<view class="form2">
						<span data-boldtype="0" class="spanstyle">密码:</span>
						<uni-easyinput placeholder-style="font-size:32rpx;background-color:#fff" :inputBorder="false" v-model="password"
							class="lgog" name="password" type="password" placeholder="请输入密码"></uni-easyinput>
					</view>
					<view class="form2">
						<span data-boldtype="0" class="spanstyle">验证码:</span>
						<uni-easyinput placeholder-style="font-size:32rpx;background-color:#fff" :inputBorder="false" name="random_code"
							v-model="random_code" class="uni-easyinput lgog2" placeholder="请输入验证码" />
						<image class="yanzhengma" :src="captchaSrc" role="img" @click="getcode"></image>
					</view>
					<button :disabled="!userName || !password || !random_code" class="box-button"
						@click="handleSubmit">登录</button>
				</form>
				<view class="floor">
					<a @click="gotoZhuCe()">立即注册</a>
					<a @click="forgetPassword()">忘记密码</a>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Base64JS from '@/utils/base64.js';
	import {
		GVerify
	} from '@/utils/GVerify';
	export default {
		data() {
			return {
				navIndex: 1,
				dataInfo: '',
				phone: '',
				smsCode: '',
				timer: null,
				count: 0,
				userName: '',
				password: '',
				img: '',
				tokenId: '',
				random_code: '',
				verifyCode: null,
				active: 0
			};
		},
		created() {
			this.getcode();
		},
		computed: {
			captchaSrc() {
				return this.img.replace(/[\r\n]/g, '');
			}
		},
		methods: {
			getcode() {
				let path = '/api/common/getValidCode';
				this.$request({
					path: path,
					method: 'post',
					params: {}
				}).then(res => {
					if (res) {
						this.img = 'data:image/jpeg;base64,' + res.data.img;
						this.verifyCode = res.data.code;
					}
				});
			},
			checkIndex(index) {
				if (index === 1) {
					this.getcode();
				}
				this.navIndex = index;
			},
			handleSubmit() {
				if (this.random_code !== this.verifyCode) {
					this.getcode();
					this.verifyCode = null;
					return uni.showModal({
						content: '验证码错误',
						showCancel: false
					});
				}

				this.$request({
						path: '/login',
						method: 'POST',
						params: {
							password: Base64JS.encode(this.password.toString()),
							username: this.userName,
							random_code: this.random_code,
							tokenId: this.tokenId
						}
					})
					.then(res => {
						if (res.status === 200) {
							this.$store.commit('setToken', res.data.Authorization);
							this.$store.commit('getUserInfo');
						} else {
							uni.showModal({
								content: '登录失败，请联系管理员',
								showCancel: false
							});
						}
					})
					.catch(e => {
						console.log(e);
					});
			},
			onLogin() {
				let {
					phone,
					smsCode
				} = this;
				const soureType = uni.getStorageSync('soureType') || '0';
				this.$request({
					path: '/api/login/registered',
					method: 'GET',
					params: {
						iphone: phone,
						smsCode,
						soureType
					}
				}).then(res => {
					let {
						status,
						message
					} = res.data;
					if (status === 200) {
						let {
							id,
							iphone
						} = res.data.data;
						let params = {
							userId: id,
							phone: iphone
						};
						console.log('登陆成功');
						this.$store.commit('setUser', params);
					} else {
						uni.showModal({
							content: '登录失败，请联系管理员',
							showCancel: false
						});
					}
				});
			},
			gotoZhuCe() {
				uni.navigateTo({
					url: `./components/register`
				});
			},
			forgetPassword() {
				// let path = "/api/user/updatePassword"
				uni.navigateTo({
					url: `./components/forgetPassword`
				});
			},
			sendCode() {
				if (this.count > 0) return;
				//校验手机号是否正确 /^1[34578]\d{9}$/
				if (!/^1\d{10}$/.test(this.phone)) {
					uni.showModal({
						content: '请填写正确的手机号码',
						showCancel: false
					});
				} else {
					let {
						phone
					} = this;
					let path = '/api/login/getVerificationCode';
					this.$request({
						path: path,
						method: 'GET',
						params: {
							phone: this.phone
						}
					}).then(res => {
						console.log(res);
					});
					const TIME_COUNT = 60;
					if (!this.timer) {
						this.count = TIME_COUNT;
						this.timer = setInterval(() => {
							if (this.count > 0 && this.count <= TIME_COUNT) {
								this.count--;
							} else {
								clearInterval(this.timer);
								this.timer = null;
							}
						}, 1000);
					}
				}
			},
			isPhone() {
				return this.phone !== '' && this.phone.length === 11;
			},
			isCode() {
				return this.smsCode !== '' && this.smsCode.length === 6;
			},
			isLogin() {
				return this.isPhone && this.isCode;
			},
			isPlantLogin() {
				return this.userName !== '' && this.password !== '' && this.random_code !== '';
			}
		}
	};
</script>

<style lang="scss">
	page{
		background-color: #F9f9f9;
	}
	.page {
		background-color: #F9f9f9;
		// text-align: center;

		.form2 {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
		}

		.headerC {
			color: rgb(0, 0, 0);
			display: flex;
			margin-left: 0;
		}

		.spanstyle {
			font-family: PingFangSC;
			font-weight: 400;
			font-size: 32rpx;
			color: rgb(0, 0, 0);
			font-style: normal;
			letter-spacing: 0px;
			line-height: 46rpx;
			text-decoration: none;
			width: 140rpx;
			text-align: left;
			margin-top: 32rpx;
		}

		.content {
			position: relative;
		}

		.jianju {
			margin-top: 17rpx;
			width: 360rpx;
		}

		.jianju2 {
			margin-top: 30rpx;
		}

		.head-nav {
			margin-top: 80rpx;
			align-items: center;
			color: #cccccc;
		}

		.activite {
			// width: 100px;
			color: #007aff;
			border-bottom: 2px solid rgb(22, 132, 252);
		}

		.head-nav>view {
			padding-bottom: 10rpx;
		}

		.box-size {
			font-size: 40rpx;
			font-weight: 700;
		}

		.phone {
			background-color: #fff;
			margin-top: 20rpx;
			text-indent: 10rpx;
			padding-top: 5rpx;
			width: 550rpx;
			border-radius: 25rpx;
		}

		.smsCode {
			// #ifdef H5
			background-color: #fff;
			margin-top: 30rpx;
			padding: 10rpx 0rpx 10rpx 0rpx;
			border-radius: 25rpx;
			margin-bottom: 30rpx;
			text-indent: 10rpx;
			width: 305rpx;
			display: flex;
			justify-content: space-between;
			// #endif
			// #ifndef H5
			background-color: #fff;
			margin-top: 30rpx;
			padding: 10rpx 0rpx 10rpx 0rpx;
			margin-bottom: 30rpx;
			border-radius: 25rpx;
			width: 305rpx;
			display: flex;
			text-indent: 10rpx;
			justify-content: space-between;
			// #endif
		}

		.lgog {
			width: 600rpx;
			margin-top: 15rpx;
			background-color: #fff;
			padding: 10rpx 0rpx 10rpx 0rpx;
			border-radius: 25rpx;
			text-indent: 10rpx;
		}

		.lgog2 {
			width: 300rpx;
			margin-top: 15rpx;
			padding: 12rpx 0rpx 10rpx 0rpx;
			background-color: #fff;
			border-radius: 25rpx;
			text-indent: 10rpx;
		}

		.kuang {
			color: #000000;
			display: flex;
			justify-content: space-between;
		}

		.box-button {
			// #ifdef H5
			color: #fff;
			text-align: center;
			font-size: 32rpx;
			// #endif
			// #ifndef H5
			color: #fff;
			text-align: center;
			font-size: 32rpx;
			// #endif
		}

		.box-button1 {
			// #ifdef H5
			color: #fff;
			height: 90rpx;
			width: 215rpx;
			font-size: 32rpx;
			padding-top: 8rpx;
			// #endif
			// #ifndef H5
			color: #fff;
			padding-top: 10rpx;
			height: 95rpx;
			width: 240rpx;
			font-size: 32rpx;
			// #endif
		}

		.yanzhengma {
			// #ifdef H5
			width: 300rpx;
			height: 100rpx;
			margin-top: 10rpx;
			// #endif
			// #ifndef H5
			width: 300rpx;
			height: 100rpx;
			margin-top: 15rpx;
			// #endif
		}

		.title {
			padding: 20rpx 0;
		}

		.form {
			color: #000000;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
		}

		.ptitle {
			width: 180rpx;
			margin-top: 35rpx;
		}

		.stitle {
			width: 180rpx;
			margin-top: 55rpx;
		}
	}

	.floor {
		margin-top: 60rpx;
		font-size: 24rpx;
		color: gray;
		text-align: center;
		display: flex;
		justify-content: space-between;

		a {
			width: 200rpx;
			margin-right: 80rpx;
			margin-left: 80rpx;
		}
	}

	.loginBtn {
		width: 25%;
		margin-left: 110rpx;
	}

	button[disabled='true'] {
		background-color: #DFDDDD;
	}

	button {
		background-color: #6CBA18;
	}
</style>
