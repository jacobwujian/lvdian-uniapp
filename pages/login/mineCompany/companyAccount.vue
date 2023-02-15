<template>
	<view>
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="账户管理" statusBar  rightText="保存" @clickRight="submit"></uni-nav-bar>
		<uni-forms
			class="form"
			ref="form"
			:modelValue="dataInfo"
			:rules="rules"
			label-position="top"
			:labelWidth="300"
			:label-style="{ 'font-size': '32rpx' }"
			validate-trigger="bind"
		>
			<uni-forms-item labelText="16px" label="用户名称" required name="realName"><uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" type="text" v-model="dataInfo.realName" placeholder="请输入用户名称" /></uni-forms-item>
			<uni-forms-item labelText="16px" label="角色权限" required name="roleName">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" :disabled="true" type="text" v-model="dataInfo.roleName" placeholder="请输入角色权限" />
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="联系方式" required name="contactWay"><uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" type="text" v-model="dataInfo.contactWay" placeholder="请输入联系方式" /></uni-forms-item>
			<uni-forms-item labelText="16px" label="登录账户" required name="username">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" :disabled="true" type="text" v-model="dataInfo.username" placeholder="请输入登录账户" />
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="密码" required name="password">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" class="uni-input" type="password" v-model="dataInfo.password" :password="true" placeholder="请输入密码" />
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="支付密码" required name="payPassword">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" class="input" type="password" v-model="dataInfo.payPassword" :password="true" placeholder="请输入支付密码" />
			</uni-forms-item>
		</uni-forms>
		<!-- <view style="text-align: center;"><button @click="submit" style="background-color: rgb(9, 196, 234);color: white;border-radius: 4px; font-size: 18px;" size="mini">保存修改</button></view> -->
	</view>
</template>

<script>
import Base64JS from '@/utils/base64.js';
import { back } from '@/utils/public.js';

export default {
	data() {
		return {
			dataInfo: {},
			rules: {
				// 对name字段进行必填验证
				realName: {
					rules: [
						{
							required: true,
							errorMessage: '请输入用户名称'
						},
						{
							minLength: 2,
							maxLength: 15,
							errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符'
						}
					]
				},
				// 对email字段进行必填验证
				password: {
					rules: [
						{
							format: 'password',
							errorMessage: '请输入正确的邮箱地址'
						}
					]
				}
			}
		};
	},
	created() {
		this.getUserInfo();
	},
	methods: {
		back() {
			back();
		},
		getUserInfo() {
			uni.showLoading({
				title: '加载中'
			});
			this.$request({
				path: '/api/account/allAccount',
				method: 'GET',
				params: {
					pageNum: 1,
					pageSize: 10
				}, // 参数
				header: {
					Authorization: this.$store.state.token
				}
			})
				.then(res => {
					this.dataInfo = res.data.list[0];
					this.dataInfo.password = Base64JS.decode(this.dataInfo.password);
					this.dataInfo.payPassword = Base64JS.decode(this.dataInfo.payPassword);
					uni.hideLoading();
				})
				.catch(e => {
					console.log(e);
				});
		},
		submit() {
			this.$request({
				path: '/api/account/updateAccount',
				method: 'POST',
				params: { ...this.dataInfo, password: Base64JS.encode(this.dataInfo.password), payPassword: Base64JS.encode(this.dataInfo.payPassword) }, // 参数
				header: {
					Authorization: this.$store.state.token
				}
			})
				.then(res => {
					if (res.status === 200) {
						uni.showModal({
							content: '保存成功！',
							showCancel: false
						});
					}
				})
				.catch(e => {
					console.log(e);
				});
		}
	}
};
</script>

<style>
.form {
	margin: 20rpx;
}
.uni-input-border {
	padding: 0 10px;
	height: 35px;
	width: 100%;
	font-size: 16px;
	color: #666;
	border: 1px #e5e5e5 solid;
	border-radius: 5px;
	box-sizing: border-box;
}
/deep/ .is-input-border{
	border-bottom: 2rpx solid rgb(187, 187, 187);
}
</style>
