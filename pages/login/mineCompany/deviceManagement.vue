<template>
	<view class="">
		<!-- <uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="设备管理"
			  statusBar></uni-nav-bar>
		<uni-search-bar bgColor="#FFFFFF" v-model="deviceId" :radius="25" placeholder="请输入设备ID" @confirm="search"
				@clear="cancel" cancelButton="none"></uni-search-bar> -->

		<uni-nav-bar statusBar leftIcon="back" @clickLeft="back()" height="46" leftWidth="120"
			 >
			<view class="search">
				<uni-search-bar bgColor="rgb(247, 247, 250)" v-model="deviceId" :radius="25" placeholder="请输入设备ID"
					cancelButton="none" @clear="cancel" @confirm="search"></uni-search-bar>
			</view>
		</uni-nav-bar>


		<view class="box" v-for="item in List" @click="toDetails(item)">
			<view class="body">
				<view style="width: 135rpx;">
					设备ID：
				</view>
				<view class="">
					{{ item.deviceId }}
				</view>
			</view>
			<view class="bother">
				机构名称：{{ item.companyName }}
			</view>
			<view class="bother">
				项目名称：{{ item.projectName }}
			</view>
			<view class="bother">
				发行数量：{{ item.outputTotal/100 }}
			</view>
			<view class="bother">
				能源类型：{{ item.energyType }}
			</view>
			<view style="display: flex; margin-bottom: 5rpx; padding-bottom: 15rpx;">

				<view class="bother">
					上链情况：{{ item.chainStatus }}
				</view>
				<view class="status">
					状态：{{ item.status }}
				</view>
			</view>
		</view>
		<view style="
				text-align: center;height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 28rpx;
				color: #999;">
			已经到底了哦~
		</view>
	</view>
</template>

<script>
	import {
		momentDate
	} from "@/utils/tools";
	import {
		back,
		energyTypes,
		chainStatusType,
		deviceStatusType
	} from "@/utils/public.js"
	export default {
		data() {
			return {
				deviceId: "",
				publicKey: "",
				deviceCertificate: "",
				companyName: "",
				projectName: "",
				outputTotal: 0,
				energyType: "",
				installTime: "",
				chainStatus: "",
				status: "",
				List: [],
			}
		},
		created() {
			this.search()
		},
		methods: {
			back() {
				back();
			},
			search() {
				uni.showLoading({
					title: '加载中'
				});
				this.pageNum++;
				let {
					deviceId
				} = this;
				let params = {
					deviceId
				};
				let res = {};
				this.$request({
					path: '/api/getdevice/getDevice', // 路径
					method: 'GET', // GET、POST方法
					params: params, // 参数
					header: {
						"Authorization": this.$store.state.token
					}
				}).then((value) => {
					uni.hideLoading();
					value.data.list.forEach(item => {
						item.energyType = energyTypes[item.energyType]
						item.chainStatus = chainStatusType[item.chainStatus]
						item.status = deviceStatusType[item.status]
					})
					this.List = value.data.list
					console.log(value.data.list);
				}).catch((reason) => {
					console.log(2);
				})
			},
			cancel() {
				this.refreshDevice()
			},
			refreshDevice() {
				this.pageNum++;
				this.$request({
					path: '/api/getdevice/refreshDevice', // 路径
					method: 'GET', // GET、POST方法
					header: {
						"Authorization": this.$store.state.token
					}
				}).then((value) => {
					value.data.list.forEach(item => {
						item.energyType = energyTypes[item.energyType]
						item.chainStatus = chainStatusType[item.chainStatus]
						item.status = deviceStatusType[item.status]
					})
					this.List = value.data.list
					console.log(value.data.list);
				}).catch((reason) => {
					console.log(2);
				})
			},
			toDetails(e) {
				console.log(e)
				uni.setStorageSync("deviceId", e.deviceId)
				uni.setStorageSync("chainStatus", e.chainStatus)
				uni.setStorageSync("deviceCertificate", e.deviceCertificate)
				uni.setStorageSync("publicKey", e.publicKey)
				uni.setStorageSync("status", e.status)
				uni.setStorageSync("projectName", e.projectName)
				uni.setStorageSync("companyName", e.companyName)
				uni.setStorageSync("installTime", e.installTime)
				uni.setStorageSync("outputTotal", e.outputTotal)
				uni.setStorageSync("energyType", e.energyType)
				let SST = `/pages/login/mineCompany/components/deviceManagementDetails?id=${e.deviceId}`;
				console.log(SST)
				uni.navigateTo({
					url: SST
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}

	.search {
		width: 100%;
		margin-right: 40rpx;
	}

	.uni-searchbar {
		padding: 10rpx;
	}

	.box {
		// border: 1px solid;
		height: 100%;
		width: 718rpx;
		border-radius: 25rpx;
		background-color: #fff;
		margin-top: 15rpx;
		margin-left: 16rpx;
	}

	.body {
		display: flex;
		font-size: 28rpx;
		margin-left: 25rpx;
		padding-top: 15rpx;
		margin-right: 15rpx;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
	}

	.bother {
		font-size: 28rpx;
		margin-bottom: 15rpx;
		margin-left: 25rpx;
		margin-right: 15rpx;
	}

	.status {
		font-size: 28rpx;
		margin-left: 230rpx;
		margin-right: 15rpx;
	}
</style>
