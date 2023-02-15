<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" @clickRight="handleOk" height="46" fixed leftText="忘记密码" right-text="保存"
			  statusBar></uni-nav-bar>
		<view>
			<uni-forms class="form" :rules="rules" ref="form" :modelValue="form" label-position="top" :labelWidth="300"
				:label-style="{ 'font-size': '32rpx' }" validate-trigger="bind">
				<uni-forms-item label="登录账户" required name="username">
					<uni-easyinput type="text" v-model="form.username" placeholder="请输入登录账户" />
				</uni-forms-item>
				<uni-forms-item label="联系方式" required name="contact">
					<uni-easyinput type="text" v-model="form.contact" placeholder="请输入联系方式" />
				</uni-forms-item>
				<uni-forms-item label="验证码" required name="smsCode">
					<view class="yanzhengma">
						<uni-easyinput type="text" v-model="form.smsCode" placeholder="请输入验证码" />
						<button :disabled="!form.username || !form.contact" class="anniu"
							@click="sendCode">{{ timer ? `${count}s 后重发` : `发送验证码` }}</button>
					</view>
				</uni-forms-item>
				<uni-forms-item label="新密码" required name="password">
					<uni-easyinput class="uni-input" type="password" v-model="form.password" :password="true"
						placeholder="请输入密码" />
				</uni-forms-item>
				<uni-forms-item label="确认新密码" required name="confirmpwd">
					<uni-easyinput class="input" type="password" v-model="form.confirmpwd" :password="true"
						placeholder="请再次输入密码" />
				</uni-forms-item>
			</uni-forms>
		<!-- 	<view style="display: flex;" class="floor">
				<view>
					<button @click="handleOk"
						style="background-color: rgb(9, 196, 234); margin-left: 150rpx;color: #fff;"
						size="mini">提交</button>
				</view>
				<view>
					<button @click="formReset"
						style="background-color: rgb(211, 210, 199); margin-right: 150rpx;color: #fff;"
						size="mini">重置</button>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import Base64JS from '@/utils/base64.js';
	import { back } from '@/utils/public.js';
	
	export default {
		data() {
			return {
				timer: null,
				count: 0,
				form: {
					username: "",
					password: "",
					confirmpwd: "",
					contact: "",
					smsCode: ""
				},
				rules: {
					username: {
						rules: [{
							required: true,
							errorMessage: '请输入登录账户',
						}]
					},
					password: {
						rules: [{
							required: true,
							errorMessage: '请输入新密码',
						}, {
							pattern: new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}'),
							errorMessage: `密码需包含大写小写字母特殊字符数字,长度8-30位`
						}, {
							validateFunction: (e) => {
								return this.form.password === this.form.confirmpwd || this.form.confirmpwd ==
									"";
							},
							errorMessage: '两次输入密码不一致'
						}]
					},
					confirmpwd: {
						rules: [{
							required: true,
							errorMessage: '请再次输入新密码',
						}, {
							validateFunction: (e) => {
								return this.form.password === this.form.confirmpwd;
							},
							errorMessage: '两次输入密码不一致'
						}]
					},
					contact: {
						rules: [{
								required: true,
								errorMessage: '请输入手机号',
							},
							{
								pattern: /^1\d{10}$/,
								errorMessage: '请正确输入手机号'
							}
						]
					},
					smsCode: {
						rules: [{
							required: true,
							errorMessage: '请输入验证码',
						}]
					}
				}
			}
		},
		methods: {
			back() {
				back();
			},
			formReset(e) {
				this.form = {
						username: "",
						password: "",
						confirmpwd: "",
						contact: "",
						smsCode: ""
					},
					console.log('清空数据')
			},
			isPhone() {
				return this.phone !== "" && this.phone.length === 11;
			},
			handleOk() {
				this.$refs.form.validate().then(res => {
					console.log(res);
					this.confirm()
				})
			},

			confirm() {
				let path = '/api/sms/updatePassword';
				this.$request({
					path: path,
					method: 'POST',
					params: {
						phone: this.form.smsCode,
						code: this.form.smsCode,
						username: this.form.username,
						password: Base64JS.encode(this.form.password)
					},
				}).then((value) => {
					if (value.status == 200) {
						uni.showModal({
							content: '修改成功',
							showCancel: false,
							success: function(res) {
								uni.switchTab({
									url: '/pages/login/index'
								})
							}
						});
						this.formReset(e);
					} else {
						uni.showModal({
							content: value.message,
							showCancel: false
						});
					}
				}).catch((reason) => {
					this.formReset(e);
				})
			},
			sendCode() {
				if (this.count > 0) return;
				//校验手机号是否正确 /^1[34578]\d{9}$/
				if (!/^1\d{10}$/.test(this.form.contact)) {
					uni.showModal({
						content: '请填写正确的手机号码',
						showCancel: false
					});
				} else {
					let {
						contact,
						username
					} = this;
					let path = '/api/sms/send';
					this.$request({
						path: path,
						method: 'GET',
						params: {
							phone: this.form.contact,
							username: this.form.username,
							type: 0
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
			}

		}
	}
</script>

<style lang="scss">
	.form {
		margin: 20rpx;
	}

	.uni-input-border {
		padding: 0 20rpx;
		height: 70rpx;
		width: 100%;
		font-size: 32rpx;
		color: #666;
		border: 1px #e5e5e5 solid;
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.floor {
		margin-top: 60rpx;
		font-size: 24rpx;
		color: gray;
		text-align: center;
		display: flex;
		justify-content: space-between;
	}

	.yanzhengma {
		display: flex;
		justify-content: space-between;
	}

	.anniu {
		//#ifdef H5
		padding-top: 9rpx;
		display: inline-block;
		font-size: 26rpx;
		line-height: 2.3;
		//#endif

		//#ifndef H5
		padding-top: 8rpx;
		display: inline-block;
		font-size: 26rpx;
		line-height: 2.3;
		//#endif

	}

	// button[disabled='true'] {
	// 	background-color: #DFDDDD;
	// }

	// button {
	// 	background-color: #7FD97F;
	// }
</style>
