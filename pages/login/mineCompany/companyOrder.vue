<template>
	<view class="daiding">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="订单管理"
			  statusBar></uni-nav-bar>
		<view class="page">
			<view class="box">
				<view class="title">
					<view :class="navIndex==0?'activite':''" @click="checkIndex(0)">全部</view>
					<view :class="navIndex==1?'activite':''" @click="checkIndex(1)">待审核</view>
					<view :class="navIndex==2?'activite':''" @click="checkIndex(2)">交易成功</view>
					<view :class="navIndex==3?'activite':''" @click="checkIndex(3)">交易失败</view>
				</view>

				<view v-if="navIndex==0">
					<view class="body" v-for="item in allList" @click="toDetails(item)">
						<view class="listImg">
							<image class="img" :src="item.imgUrl"></image>
						</view>
						<view class="listData">
							<view class="Listbig">
								{{item.projectName}}
							</view>
							<view class="Listsmall">
								交易时间：{{item.tradeTime}}
							</view>
							<view class="List">
								<view class="List1">交易数量:{{item.tradeCount/100}}</view>
								<view class="List2">{{item.status}}</view>
							</view>
							<view class="List">
								<view class="List3">交易单价:{{item.price/100}}</view>
								<view class="List4">总付款:{{item.totalPrice/100}}</view>
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
				<view v-if="navIndex==1">
					<view class="body" @click="toDetails(item)" v-for="item in examineList">
						<view class="listImg">
							<image class="img" :src="item.imgUrl"></image>
						</view>
						<view class="listData">
							<view class="Listbig">
								{{item.projectName}}
							</view>
							<view class="Listsmall">
								交易时间：{{item.tradeTime}}
							</view>
							<view class="List">
								<view class="List1">交易数量:{{item.tradeCount/100}}</view>
								<view class="List2">{{item.status}}</view>
							</view>
							<view class="List">
								<view class="List3">交易单价:{{item.price/100}}</view>
								<view class="List4">总付款:{{item.totalPrice/100}}</view>
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
				<view v-if="navIndex==2">
					<view class="body" @click="toDetails(item)" v-for="item in successList">
						<view class="listImg">
							<image class="img" :src="item.imgUrl"></image>
						</view>
						<view class="listData">
							<view class="Listbig">
								{{item.projectName}}
							</view>
							<view class="Listsmall">
								交易时间：{{item.tradeTime}}
							</view>
							<view class="List">
								<view class="List1">交易数量:{{item.tradeCount/100}}</view>
								<view class="List2">{{item.status}}</view>
							</view>
							<view class="List">
								<view class="List3">交易单价:{{item.price/100}}</view>
								<view class="List4">总付款:{{item.totalPrice/100}}</view>
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
				<view v-if="navIndex==3">
					<view class="body" @click="toDetails(item)" v-for="item in failList">
						<view class="listImg">
							<image class="img" :src="item.imgUrl"></image>
						</view>
						<view class="listData">
							<view class="Listbig">
								{{item.projectName}}
							</view>
							<view class="Listsmall">
								交易时间：{{item.tradeTime}}
							</view>
							<view class="List">
								<view class="List1">交易数量:{{item.tradeCount/100}}</view>
								<view class="List2">{{item.status}}</view>
							</view>
							<view class="List">
								<view class="List3">交易单价:{{item.price/100}}</view>
								<view class="List4">总付款:{{item.totalPrice/100}}</view>
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
			</view>
		</view>
	</view>
</template>

<script>
	import {
		momentDate
	} from "@/utils/tools";
	import {
		OrderType,
		back
	} from "@/utils/public.js"
	export default {
		data() {
			return {
				OrderType,
				navIndex: 0,
				dataInfo: {},
				// 全部订单
				allList: [],
				// 待审核订单
				examineList: [],
				// 成功订单
				successList: [],
				// 失败订单
				failList: []
			}
		},
		created() {
			this.selectAllOrder()
		},
		methods: {
			checkIndex(index) {
				console.log(index)
				this.navIndex = index;
				this.selectAllOrder();
			},
			toDetails(e) {
				console.log(e)
				uni.setStorageSync("imgUrl", e.imgUrl)
				uni.setStorageSync("status", e.status)
				uni.setStorageSync("tradeTime", e.tradeTime)
				uni.setStorageSync("tradeCount", e.tradeCount)
				uni.setStorageSync("price", e.price)
				uni.setStorageSync("totalPrice", e.totalPrice)
				uni.setStorageSync("projectName", e.projectName)
				let SST = `/pages/login/mineCompany/components/companyOrderDetails?id=${e.orderId}`;
				console.log(SST)
				uni.navigateTo({
					url: SST
				})
			},
			back() {
				back();
			},
			selectAllOrder() {
				// console.log(this.userId);
				this.pageNum++;
				// let {
				// 	userId
				// } = this;
				// let params = {
				// 	userId
				// };
				let res = {};
				if (this.navIndex == 0) {
					uni.showLoading({
					    title: '加载中'
					});
					this.$request({
						path: '/api/order/selectAllOrder', // 路径
						method: 'GET', // GET、POST方法
						// params: params, // 参数
						header: {
							"Authorization": this.$store.state.token
						}
					}).then((value) => {
						uni.hideLoading();
						console.log(value);
						value.data.forEach(item => {
							if (item.tradeTime) item.tradeTime = momentDate(item.tradeTime)
							item.status = OrderType[item.status]
						})
						this.allList = value.data
						console.log(this.allList)
					}).catch((reason) => {
						console.log(reason);
					})
				} else if (this.navIndex == 1) {
					uni.showLoading({
					    title: '加载中'
					});
					this.$request({
						path: '/api/order/selectExamineOrder', // 路径
						method: 'GET', // GET、POST方法
						// params: params, // 参数
						header: {
							"Authorization": this.$store.state.token
						}
					}).then((value) => {
						uni.hideLoading();
						console.log(value);
						value.data.forEach(item => {
							if (item.tradeTime) item.tradeTime = momentDate(item.tradeTime)
							item.status = OrderType[item.status]
						})
						this.examineList = value.data
					}).catch((reason) => {
						console.log(reason);
					})
				} else if (this.navIndex == 2) {
					uni.showLoading({
					    title: '加载中'
					});
					this.$request({
						path: '/api/order/selectSuccessOrder', // 路径
						method: 'GET', // GET、POST方法
						// params: params, // 参数
						header: {
							"Authorization": this.$store.state.token
						}
					}).then((value) => {
						uni.hideLoading();
						console.log(value);
						value.data.forEach(item => {
							if (item.tradeTime) item.tradeTime = momentDate(item.tradeTime)
							item.status = OrderType[item.status]
						})
						this.successList = value.data
					}).catch((reason) => {
						console.log(reason);
					})
				} else if (this.navIndex == 3) {
					uni.showLoading({
					    title: '加载中'
					});
					this.$request({
						path: '/api/order/selectFailOrder', // 路径
						method: 'GET', // GET、POST方法
						// params: params, // 参数
						header: {
							"Authorization": this.$store.state.token
						}
					}).then((value) => {
						uni.hideLoading();
						console.log(value);
						value.data.forEach(item => {
							if (item.tradeTime) item.tradeTime = momentDate(item.tradeTime)
							item.status = OrderType[item.status]
						})
						this.failList = value.data
					}).catch((reason) => {
						console.log(reason);
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}

	.box {
		// border: 1px solid;
		height: 100%;
	}

	.title {
		margin-top: 20rpx;
		margin-bottom: 5rpx;
		height: 70rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;

		view {
			margin: 15rpx 25rpx 8rpx 25rpx;
		}
	}

	.body {
		background-color: #fff;
		margin-bottom: 20rpx;
		height: 265rpx;
		overflow: hidden;
		display: flex;
		justify-content: space-between;
		position: relative;
		border-radius: 25rpx;
	}

	.activite {
		color: #007aff;
		border-bottom: 2px solid rgb(22, 132, 252);
	}

	.listImg {
		margin: 11rpx;
		height: 175rpx;
		width: 175rpx;
		border-radius: 25rpx;
		overflow: hidden;
	}

	.img {
		position: absolute;
		width: 290rpx;
		height: 240rpx;
		border-radius: 25rpx;
	}

	.listData {
		margin-top: 10rpx;
		width: 400rpx;
	}

	.Listbig {
		font-weight: bold;
		margin-left: 20rpx;
		margin-top: 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.Listsmall {
		// #ifdef H5
		font-size: 25rpx;
		color: #8b8b8b;
		margin-top: 20rpx;
		margin-left: 20rpx;
		// #endif
		// #ifndef H5
		font-size: 25rpx;
		color: #8b8b8b;
		margin-top: 20rpx;
		margin-left: 20rpx;
		// #endif
	}

	.List {
		display: flex;
		justify-content: space-between;
	}

	.List1 {
		// #ifdef H5
		font-size: 25rpx;
		color: #8b8b8b;
		margin-top: 20rpx;
		margin-left: 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		// #endif
		// #ifndef H5
		font-size: 25rpx;
		color: #8b8b8b;
		margin-top: 20rpx;
		margin-left: 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		// #endif
	}

	.List2 {
		// #ifdef H5
		font-size: 25rpx;
		margin-top: 20rpx;
		margin-right: 50rpx;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		// #endif
		// #ifndef H5
		font-size: 25rpx;
		margin-top: 20rpx;
		margin-right: 50rpx;
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		// #endif
	}

	.List3 {
		// #ifdef H5
		font-size: 25rpx;
		color: #8b8b8b;
		margin-top: 20rpx;
		margin-left: 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		// #endif
		// #ifndef H5
		font-size: 25rpx;
		color: #8b8b8b;
		margin-top: 20rpx;
		margin-left: 20rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		// #endif
	}

	.List4 {
		// #ifdef H5
		font-size: 25rpx;
		font-weight: 700;
		margin-top: 20rpx;
		margin-right: 25rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		// #endif
		// #ifndef H5
		font-size: 25rpx;
		font-weight: 700;
		margin-top: 20rpx;
		margin-right: 25rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		// #endif
	}
</style>
