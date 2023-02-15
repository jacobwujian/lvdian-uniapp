<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" @clickRight="handleOk" fixed leftText="立即注册" right-text="保存"
			  statusBar></uni-nav-bar>
		<view class="page">
			<view>
				<uni-forms ref="form" :rules="rules" :modelValue="form" @reset="formReset" validate-trigger="bind">
					<view class="uni-form-item">
						<view>
							<uni-forms-item label="企业类型" required name="type">

								<easySelect
									class="type"
									size="medium"
									:value="form.type"
									:options="[{ value: 1, label: '耗能企业' },{ value: 2, label: '能源企业' }]"
									@selectOne="
										e => {
											form.type = e.value;
										}
									"
								/>
							</uni-forms-item>
							<uni-forms-item label="公司名称" required name="companyName">
								<uni-easyinput style="font-size: 32rpx;" v-model="form.companyName" name="companyName"
									placeholder="请填写公司/组织名称" />
							</uni-forms-item>
							<uni-forms-item label="统一社会信用码" required name="socialCreditCode">
								<uni-easyinput v-model="form.socialCreditCode" name="socialCreditCode"
									placeholder="请填写统一社会信用码" />
							</uni-forms-item>
							<uni-forms-item label="公司所在地区" required name="companyArea">
								<view>
									<view v-if="form.apearea" @click="addressShow = true" style="
									margin-top: 18rpx;
									font-size: 38rpx;
									margin-left: 20rpx;">{{form.apearea?form.apearea:'点击选择公司所在地区'}}</view>
									<view v-if="!form.apearea" style="color: #999;
									font-size: 24rpx;
									margin-top: 18rpx;
									margin-left: 20rpx;
									font-weight: 200;" @click="addressShow = true">{{form.apearea?form.apearea:'点击选择公司所在地区'}}</view>
									<pickerAddress v-model="addressShow" @confirm="addresspick" />
									<view class="daijinquanView" />

								</view>
							</uni-forms-item>

							<uni-forms-item label="公司地址" required name="address">
								<uni-easyinput v-model="form.address" name="address" placeholder="请填写公司地址" />
							</uni-forms-item>
							<uni-forms-item label="法人姓名" required name="legalPerson">
								<uni-easyinput v-model="form.legalPerson" name="legalPerson" placeholder="请填写法人姓名" />
							</uni-forms-item>
							<uni-forms-item label="法人身份证号" required name="legalPersonIdCard">
								<uni-easyinput v-model="form.legalPersonIdCard" name="legalPersonIdCard"
									placeholder="请填写法人身份证号" />
							</uni-forms-item>
							<uni-forms-item label="营业执照" required name="businessLicense">
								<uni-file-picker :list-styles="listStyles" title="请选择要上传的营业执照" limit="1"
									v-model="form.businessLicense" fileMediatype="all" @select="selectFile"
									@delete="deleteFile" class="tupian">
									<button style="margin-left: 50rpx;" type="primary" plain="true"
										size="mini">请上传营业执照</button>
								</uni-file-picker>
							</uni-forms-item>
							<uni-forms-item label="本年度配额" required name="annual" v-if="type">
								<uni-easyinput v-model="form.annual" name="annual" placeholder="请填写本年度配额(MW·h)" />
							</uni-forms-item>
							<uni-forms-item label="联系人姓名" required name="contact">
								<uni-easyinput v-model="form.contact" name="contact" placeholder="请填写联系人姓名" />
							</uni-forms-item>
							<uni-forms-item label="联系人电话" required name="contactWay">
								<uni-easyinput v-model="form.contactWay" name="contactWay" placeholder="请填写联系人电话" />
							</uni-forms-item>
							<uni-forms-item label="联系人邮箱" required name="mail">
								<uni-easyinput v-model="form.mail" name="mail" placeholder="请填写联系人邮箱" />
							</uni-forms-item>
							<uni-forms-item label="登录用户名" required name="username">
								<uni-easyinput v-model="form.username" name="username" placeholder="请填写登录用户名" />
							</uni-forms-item>
							<uni-forms-item label="登录密码" required name="password">
								<uni-easyinput type="password" v-model="form.password" name="password"
									placeholder="请填写登陆密码" />
							</uni-forms-item>
							<uni-forms-item label="登录密码确认" required name="confirmpwd">
								<uni-easyinput type="password" v-model="form.confirmpwd" name="confirmpwd"
									placeholder="请再次填写登陆密码" />
							</uni-forms-item>
							<uni-forms-item label="支付密码" required name="payPassword">
								<uni-easyinput type="password" v-model="form.payPassword" name="payPassword"
									placeholder="请填写支付密码" />
							</uni-forms-item>
							<uni-forms-item label="支付密码确认" required name="confirmPayPassword">
								<uni-easyinput type="password" v-model="form.confirmPayPassword"
									name="confirmPayPassword" placeholder="请再次填写支付密码" />
							</uni-forms-item>
						</view>
					</view>
					<!-- <view class="floor">
						<button size="mini" style="background-color: rgb(9, 196, 234); margin-left: 100rpx;color: #fff;"
							@click="handleOk">提交</button>
						<button size="mini"
							style="background-color: rgb(211, 210, 199); margin-right: 100rpx;color: #fff;"
							@click="formReset">重置</button>
					</view> -->
				</uni-forms>
				<br />
			</view>
		</view>
	</view>
</template>

<script>
	import Base64JS from '@/utils/base64.js';
	import easySelect from '@/components/easy-select/easy-select.vue';
	
	import {
		back
	} from '@/utils/public.js';

	import {
		BASE_URL
	} from '@/utils/request.js';
	import pickerAddress from '@/components/liudx-pickerAddress/index.vue'
	export default {
		components: {
			pickerAddress,
			easySelect
		},

		data() {
			return {
				value: 1,
				form: {
					password: "",
					confirmpwd: "",
					payPassword: "",
					address: "",
					confirmPayPassword: "",
					businessLicense: [],
					companyName: "",
					socialCreditCode: "",
					legalPerson: "",
					legalPersonIdCard: "",
					annual: 0,
					contact: "",
					contactWay: "",
					mail: "",
					username: "",
					type: 1,
					companyArea: "",
					apearea: ''
				},
				listStyles: {
					// 是否显示边框
					border: false,
					// 是否显示分隔线
					dividline: true,
					// 线条样式
					borderStyle: {
						width: 1,
						color: 'blue',
						radius: 2
					}
				},
				addressShow: false,
				areaList: {
					province: '',
					city: '',
					area: '',
				},
				fileNames: [],
				rules: {
					type: {
						rules: [{
							required: true,
							errorMessage: '请选择公司类型',
						}]
					},
					companyName: {
						rules: [{
							required: true,
							errorMessage: '请填写公司名称',
						}]
					},
					socialCreditCode: {
						rules: [{
								required: true,
								errorMessage: '请填写统一社会信用码',
							},
							{
								pattern: /^[A-Za-z0-9]{18}$/,
								errorMessage: '请输入18位有效的统一社会信用代码'
							}
						]
					},
					companyArea: {
						rules: [{
							required: true,
							errorMessage: '请选择公司所在地区',
						}]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '请填写公司地址',
						}]
					},
					legalPerson: {
						rules: [{
							required: true,
							errorMessage: '请填写法人姓名',
						}]
					},
					legalPersonIdCard: {
						rules: [{
								required: true,
								errorMessage: '请填写法人身份证号',
							},
							{
								pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
								errorMessage: '请输入正确的身份证号码'
							}
						]
					},
					annual: {
						rules: [{
							required: true,
							errorMessage: '请填写本年度配额(MW·h)',
						}]
					},
					contact: {
						rules: [{
							required: true,
							errorMessage: '请填写联系人姓名',
						}]
					},
					contactWay: {
						rules: [{
								required: true,
								errorMessage: '请填写联系人电话',
							},
							{
								pattern: /^1\d{10}$/,
								errorMessage: '请正确输入联系人电话'
							}
						]
					},
					mail: {
						rules: [{
								required: true,
								errorMessage: '请填写联系人邮箱地址',
							},
							{
								pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
								errorMessage: '请输入正确的邮箱地址'
							}
						]
					},
					username: {
						rules: [{
							required: true,
							errorMessage: '请填写登录用户名',
						}]
					},
					password: {
						rules: [{
							required: true,
							errorMessage: '请输入登录密码',
						}, {
							pattern: new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}'),
							errorMessage: `需包含大小写字母特殊字符数字,长度8-30位`
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
							errorMessage: '请再次输入登录密码',
						}, {
							validateFunction: (e) => {
								return this.form.password === this.form.confirmpwd;
							},
							errorMessage: '两次输入密码不一致'
						}]
					},
					payPassword: {
						rules: [{
							required: true,
							errorMessage: '请输入支付秘密',
						}, {
							pattern: new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}'),
							errorMessage: `需包含大小写字母特殊字符数字,长度8-30位`
						}, {
							validateFunction: (e) => {
								return this.form.payPassword === this.form.confirmPayPassword || this.form
									.confirmPayPassword ==
									"";
							},
							errorMessage: '两次输入密码不一致'
						}]
					},
					confirmPayPassword: {
						rules: [{
							required: true,
							errorMessage: '请再次输入支付秘密',
						}, {
							validateFunction: (e) => {
								return this.form.payPassword === this.form.confirmPayPassword;
							},
							errorMessage: '两次输入密码不一致'
						}]
					}
				}
			}
		},
		computed: {
			type() {
				return this.form.type == 1;
			}
		},
		methods: {
			back() {
				back();
			},
			addresspick(obj) {
				let arr = ['province', 'city', 'area'];
				let place = '';
				console.log(obj)
				arr.map(key => {
					this.areaList[key] = obj[key].AreaId
					place += obj[key].AreaName
				})
				this.form.apearea = place;
				this.form.companyArea = obj['area'].AreaId.substr(0, 6);
			},
			handleOk() {
				this.$refs.form.validate().then(res => {
					this.onSubmit()
				})
			},
			onSubmit(values) {
				var key = "type";
				var name = this.form.type;
				let path = "/api/user/registerUser"
				this.$request({
					path: path,
					method: "POST",
					params: {
						password: Base64JS.encode(this.form.password),
						confirmpwd: Base64JS.encode(this.form.confirmpwd),
						payPassword: Base64JS.encode(this.form.payPassword),
						confirmPayPassword: Base64JS.encode(this.form.confirmPayPassword),
						businessLicense: this.fileNames[0],
						companyName: this.form.companyName,
						socialCreditCode: this.form.socialCreditCode,
						legalPerson: this.form.legalPerson,
						legalPersonIdCard: this.form.legalPersonIdCard,
						address: this.form.address,
						annual: this.form.annual * 100,
						imagesUrl: this.form.imagesUrl,
						contact: this.form.contact,
						contactWay: this.form.contactWay,
						mail: this.form.mail,
						username: this.form.username,
						type: this.form.type,
						companyArea: this.areaList["area"].substr(0, 2) + "," + this.areaList[
							"area"].substr(0, 4) + "," + this.areaList["area"].substr(0, 6)
					},
				}).then((value) => {
					uni.showModal({
						content: '注册成功，请等待管理员审核',
						showCancel: false,
						success: function(res) {
							uni.switchTab({
								url: '/pages/login/index'
							})
						}
					});
				}).catch((reason) => {
					uni.showModal({
						content: '注册失败，请联系管理员',
						showCancel: false
					});
				})
				
			},
			formReset(e) {
				this.form = {
					password: "",
					confirmpwd: "",
					payPassword: "",
					address: "",
					confirmPayPassword: "",
					businessLicense: [],
					companyName: "",
					socialCreditCode: "",
					legalPerson: "",
					legalPersonIdCard: "",
					annual: 0,
					contact: "",
					contactWay: "",
					mail: "",
					username: "",
					type: 1,
					companyArea: "",
					apearea: ''
				}
				this.form.type = 1
			},

			selectFile(e) {
				e.tempFiles.forEach(item => {
					this.form.businessLicense.push(item)
					this.uploadFile(item)
				})
			},

			// 上传方法
			async uploadFile(file, index) {
				const that = this;
				await uni.uploadFile({
					url: BASE_URL + '/api/common/oss/upload',
					filePath: file.path,
					name: 'file',
					success: uploadFileRes => {
						let fileName = JSON.parse(uploadFileRes.data).data;
						console.log(JSON.parse(uploadFileRes.data).status);
						if(JSON.parse(uploadFileRes.data).status != 200){
							uni.showModal({
								content: '文件不为.png.jpg.jpeg或.pdf文件',
								showCancel: false,
								success: () => {
									console.log(this.form.businessLicense);
									return this.form.businessLicense=[]
								}
							});
						}else{
							that.fileNames.push(fileName)
						}
						
					}
				});

			},

			deleteFile(e) {
				this.fileNames=[]
				let cloudPath = e.tempFile.cloudPath
				this.form.businessLicense.forEach((item, index) => {
					if (item.cloudPath == cloudPath) {
						this.form.businessLicense.splice(index, 1)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}
	
	.type {
		// #ifdef H5
		// border: 1px solid;
		border-radius: 15rpx;
		background-color: #fff;
		margin-top: 13rpx;
		// #endif

		// #ifndef H5
		margin-top: 6rpx;
		// #endif
	}

	.loginBtn {
		margin-top: 50rpx;
		margin-left: 55rpx;
		float: left;
		background-color: #09C4EA;
		color: #fff;
	}

	.registerBtn {
		margin-top: 50rpx;
		margin-right: 55rpx;
		float: right;
		color: #BBBBBB;
	}

	.uploadBox {
		width: 100%;
		margin-top: 50rpx;
	}

	/deep/.uni-progress-bar {
		opacity: 0;
	}

	.floor {
		margin-top: 60rpx;
		font-size: 24rpx;
		// color: gray;
		text-align: center;
		display: flex;
		justify-content: space-between;
	}

	.daijinquanView {
		display: flex;
		width: 550rpx;
		height: 10rpx;
		border-bottom: 5rpx solid rgb(226, 226, 226);
	}

	.order-uploadBox {}

	.tupian {
		//#ifdef H5
		margin-top: 8rpx;
		//#endif
		//#ifndef H5
		margin-top: 8rpx;
		//#endif
	}
</style>
