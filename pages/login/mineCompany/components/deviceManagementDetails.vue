<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="设备详情"
			  statusBar></uni-nav-bar>
		<view class="box">
			<view class="body">
				<view class="">
					设备ID：
				</view>
				<view class="">
					{{ deviceId }}
				</view>
			</view>
			<!-- word-break: break-all -->
			<!-- word-wrap: break-word -->
			<view class="bother" style="word-break: break-all">
				<view style="width: 500rpx;">
				设备公钥：
				</view>
				<view class="">
					{{ publicKey }}
				</view>
			</view>
			<view class="bother">
				<view class="">
					设备证书编号：
				</view>
				<view class="">
					{{ deviceCertificate }}
				</view>
			</view>
			<view class="bother">
				<view class="">
					机构名称：
				</view>
				<view class="">
					{{ companyName }}
				</view>
			</view>
			<view class="bother">
				<view class="">
					项目名称：
				</view>
				<view class="">
					{{ projectName }}
				</view>
			</view>
			<view class="bother">
				<view class="">
					发行数量：
				</view>
				<view class="">
					{{ outputTotal /100}}
				</view>
			</view>
			<view class="bother">
				<view class="">
					能源类型：
				</view>
				<view class="">
					{{ energyType }}
				</view>
			</view>
			<view class="bother">
				<view class="">
					安装时间：
				</view>
				<view class="">
					{{ installTime }}
				</view>
			</view>
			<view class="bother">
				<view class="">
					上链情况：
				</view>
				<view class="">
					{{ chainStatus }}
				</view>
			</view>
			<view class="status">
				<view class="">
					状态：
				</view>
				<view class="">
					{{ status }}
				</view>
				
			</view>

		</view>
	</view>
</template>

<script>
	import {
		momentDate
	} from "@/utils/tools";
	import {
		back
	} from "@/utils/public.js"
	export default {
		data() {
			return {
				form: {
					deviceId: "",
					publicKey: "",
					deviceCertificate: "",
					companyName: "",
					projectName: "",
					outputTotal: 0,
					energyType: "",
					installTime: "",
					chainStatus: "",
					status: ""
				},
				List: [],
			}
		},
		computed: {
			deviceId() {
				return uni.getStorageSync("deviceId");
			},
			chainStatus() {
				return uni.getStorageSync("chainStatus");
			},
			deviceCertificate() {
				return uni.getStorageSync("deviceCertificate");
			},
			publicKey() {
				return uni.getStorageSync("publicKey");
			},
			status() {
				return uni.getStorageSync("status");
			},
			projectName() {
				return uni.getStorageSync("projectName");
			},
			companyName() {
				return uni.getStorageSync("companyName");
			},
			installTime() {
				return uni.getStorageSync("installTime");
			},
			energyType() {
				return uni.getStorageSync("energyType");
			},
			outputTotal() {
				return uni.getStorageSync("outputTotal");
			},
		},
		created() {
			this.jiazai()
		},
		methods: {
			back() {
				back();
			},
			jiazai(){
				uni.showLoading({
				    title: '加载中'
				});
				
				setTimeout(function () {
				    uni.hideLoading();
				}, 300);
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}

	.box {
		font-size: 28rpx;
		height: 100%;
		width: 718rpx;
		border-radius: 25rpx;
		background-color: #fff;
		margin-top: 25rpx;
		margin-left: 16rpx;
	}

	.body {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		margin-left: 25rpx;
		padding-top: 15rpx;
		margin-top: 15rpx;
		margin-right: 15rpx;
		margin-bottom: 15rpx;
	}

	.bother {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		margin-left: 25rpx;
		margin-bottom: 15rpx;
		margin-right: 15rpx;
	}

	.status {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		margin-left: 25rpx;
		margin-right: 15rpx;
		padding-bottom: 15rpx;
	}
</style>
