<template>
	<view class="page">
		<view class="mine">
			<!-- 电厂登录 -->
			<view class="box-title">
				<view class="linshi">
					<view class="avatar">
						<image :src="userId ? avatar : grayAvatar" alt="" />
					</view>
					<view class="denglu">
						<view class="box-size" v-if="userId"> {{ phone }} </view>
						<view class="floor" @click="onLogout()">
							退出登录
						</view>
					</view>
				</view>
				<view class="floor3">
					<view class="Q">
						<!-- <img class="mine-icon" :src="jifen" alt="" /> -->
						<image class="mine-icon" src="https://s2.loli.net/2022/01/24/D4NyWIYUKhtncqQ.png" alt="" />
						<view class="">
							{{ `绿电积分：${integral}` }}
						</view>
					</view>
					<view class="Q" @click="pingzheng()">
						<image class="mine-icon1" :src="greenCard" alt="" />
						<view class="">
							查看凭证
						</view>
						<image class="png" src="../../../static/img/login/gogogo.png" mode=""></image>
					</view>
				</view>
			</view>
				<adverts></adverts>
			<view>
				<view class="floor2">
					<view :class="navIndex==0?'activite':''" @click="checkIndex(0)">
						绿电积分订单
					</view>
					<view :class="navIndex==1?'activite':''" @click="checkIndex(1)">
						商城订单
					</view>
				</view>
				<view class="content" v-if="navIndex==0">
					<view class="contentBox" v-for="dataInfo in integralList" :key="dataInfo.id"
						@click="toJFDetails(dataInfo)">
						<view class="listImg">
							<img class="img" :src="dataInfo.imgUrl" alt="" />
						</view>
						<view class="listData">
							<view class="jf-title" style="font-size: 30rpx;">
								{{ dataInfo.projectName }}
							</view>
							<view class="title">
								{{ `购买日期：` + dataInfo.tradeTime }}
							</view>
							<view class="ld-title">
								<view class="title">
									{{ `购买数量：` + dataInfo.tradeCount }}
								</view>
								<view class="title" style="color:rgb(0, 0, 0);font-weight: bolder;">
									{{ `总付款 ¥` + dataInfo.totalPrice/100 }}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="content" v-if="navIndex==1">
					<view class="contentBox" v-for="dataInfo in voucherList" :key="dataInfo.orderId"
						@click="toSCDetails(dataInfo)">
						<view class="listImg">
							<img class="img" :src="dataInfo.voucherImgUrl" alt="" />
						</view>
						<view class="listData">
							<view class="jf-title">
								{{ dataInfo.voucherName }}
							</view>
							<view class="title">
								{{ `兑换日期：` + dataInfo.exchangeTime }}
							</view>
							<view class="title">
								{{ `兑换数量：` + dataInfo.exchangeTotal }}
							</view>
						</view>
					</view>
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
		mapMutations,
		mapState
	} from "vuex";
	import {
		momentDate
	} from "@/utils/tools";
	import Adverts from "@/components/Adverts/Adverts.vue"
	export default {
		components: {
			Adverts
		},
		data() {
			return {
				navIndex: 0,
				dataInfo: {},
				grayAvatar: require("@/static/img/login/gray_avatar.png"),
				avatar: require("@/static/img/login/avatar.png"),
				jifen: require("@/static/img/login/jifen.png"),
				greenCard: require("@/static/img/login/green_card.png"),
				adImages: [
					require("@/static/img/login/banner1.png"),
					require("@/static/img/login/banner2.png")
				],
				active: "绿电积分订单",
				UserIntegral: "",
				// 积分订单
				integralList: [],
				// 商城订单
				voucherList: [],
				dataList: [],
				// loading: false,
				finished: false,
				pageSize: 10,
				pageNum: 0,
				total: "",
				// 用户购买总积分
				userTotalIntegral: ""
			}
		},
		computed: {
			// 用户积分
			integral() {
				if (!this.UserIntegral) return 0;
				if (!this.UserIntegral.userIntegral) return "0";
				return this.UserIntegral.userIntegral;
			},
			...mapState(["userId", "phone"])
		},

		created() {
			this.getUserIntegral()
		},

		mounted() {
			this.getData();
		},

		methods: {

			checkIndex(index) {
				console.log(index)
				this.navIndex = index;
				this.getData();
			},

			onLogout() {
				let that = this
				uni.showModal({
					title: '提示',
					content: '退出登录',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							that.UserIntegral = "";
							that.$store.commit("logout");
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},

			pingzheng(userId) {
				if (this.UserIntegral.userIntegral == 0) return uni.showModal({
					content: '暂未获取绿电证书',
					showCancel: false
				});
				let navData = this.userId
				uni.navigateTo({
					url: `/pages/login/mine/ldzs?id=${navData}`
				})
			},

			getUserIntegral() {
				this.$store.state.name = new Date().getMilliseconds();
				let {
					userId
				} = this;
				let params = {
					userId
				};
				this.$request({
					path: '/api/show/selectUserIntegral', // 路径
					method: 'GET', // GET、POST方法
					params: params // 参数
				}).then(res => {
					console.log(res);
					let data = res.data || {};
					this.UserIntegral = data;
					console.log(this.UserIntegral);
					this.userTotalIntegral = data.userTotalIntegral;
				});
			},

			async getData() {
				this.pageNum++;
				let {
					pageSize,
					pageNum,
					userId
				} = this;
				let params = {
					pageSize,
					pageNum,
					userId
				};
				let res = {};
				if (this.navIndex == 0) {
					res = await this.$request({
						path: '/api/show/integralOrder', // 路径
						method: 'GET', // GET、POST方法
						params: params // 参数
					}).then((value) => {
						console.log(value);
						// console.log(this.dataInfo);
						value.data.list.map(dataInfo => {
							if (dataInfo.tradeTime) dataInfo.tradeTime = momentDate(dataInfo.tradeTime)
						})
						this.integralList = value.data.list
					}).catch((reason) => {
						console.log(reason);
					})
				} else {
					res = await this.$request({
						path: '/api/show/selectUserVoucher', // 路径
						method: 'GET', // GET、POST方法
						params: params // 参数
					}).then((value) => {
						console.log(value);
						value.data.list.map(dataInfo => {
							if (dataInfo.exchangeTime) dataInfo.exchangeTime = momentDate(dataInfo
								.exchangeTime)
						})
						this.voucherList = value.data.list
					}).catch((reason) => {
						console.log(reason);
					})
				}
			},

			changeTabs(name, title) {
				this.active = title;
				// 初始化数据
				this.init();
				this.getData();
			},
			toJFDetails(dataInfo) {
				let navData = dataInfo.orderId
				console.log(dataInfo.orderId)
				uni.navigateTo({
					// url: `@/mine/jfdd-details?id=${navData}`
					url: `/pages/login/mine/jfdd-details?id=${navData}`
				})
			},
			// 跳转详情页
			toSCDetails(dataInfo) {

				console.log(dataInfo.commodityType);
				let navData = dataInfo.orderId
				console.log(1);
				uni.navigateTo({
					// url: `@/mine/yhj-details?id=${navData}`
					url: `/pages/login/mine/yhj-details?id=${navData}`
				})

			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F9F9F9;
	}

	.mine {

		.content {
			// border: 1px solid;
		}

		.listData {}

		.denglu {
			// border: 1px solid;
			margin-top: 20rpx;
		}

		.listImg {
			border-radius: 25rpx;
			overflow: hidden;
			height: 180rpx;
			width: 240rpx;
		}

		.img {
			width: 100%;
			height: 100%;
		}

		.png {
			margin-top: 6rpx;
			height: 35rpx;
			width: 35rpx;
			margin-right: 10rpx;
		}

		.contentBox {
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			border-radius: 25rpx;
			overflow: hidden;
			margin-top: 15rpx;
			padding: 15rpx 50rpx 15rpx 15rpx;

			view {
				color: #5b5b5b;
				font-size: 26rpx;
				text-align: left;
				/* #ifndef MP-WEIXIN */
				line-height: 62rpx;
				/* #endif */
				
				
				// #ifndef H5
				// color: #5b5b5b;
				// font-size: 26rpx;
				// text-align: left;
				// #endif
			}
		}

		.avatar {
			width: 115rpx;
			height: 115rpx;
			border-radius: 50%;
			overflow: hidden;
			margin-top: 20rpx;
			margin-left: 20rpx;

			image {
				width: 115rpx;
				height: 115rpx;
				vertical-align: top;
			}
		}

		.loginBtn {
			width: 25%;
			margin-left: 130rpx;
			float: left;
			border-style: none;
			border: none;
		}

		.ld-title {
			display: flex;
			justify-content: space-between;
		}

		.title {
			margin-left: 20rpx;
		}

		.jf-title {
			font-weight: bold;
			width: 300rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.linshi {
			display: flex;
		}

		.box-title {
			// border: 1rpx solid;
			border-radius: 25rpx;
			overflow: hidden;
			background-color: #FFFFFF;
		}

		.box-size {
			font-size: 40rpx;
			margin-left: 30rpx;
			padding-top: 6rpx;
			// border: 1rpx solid;
		}

		.mine-icon {
			margin-bottom: 1rpx;
			margin-left: 20rpx;
			margin-right: 6rpx;
			width: 40rpx;
			height: 42rpx;
		}

		.mine-icon1 {
			margin-bottom: 1rpx;
			margin-right: 6rpx;
			width: 42rpx;
			height: 42rpx;
		}

		.Q {
			// border: 1px solid;
			display: flex;
			justify-content: space-between;
			margin: 15rpx;
		}

		.activite {
			color: #007aff;
			border-bottom: 2px solid rgb(22, 132, 252);
		}

		.floor {
			margin-top: 20rpx;
			margin-left: 30rpx;
			font-size: 24rpx;
			color: gray;
			// text-align: center;
			// border: 1rpx solid;
		}

		.floor2 {
			display: flex;
			justify-content: space-between;
			margin-top: 55rpx;
			margin-left: 70rpx;
			margin-right: 70rpx;
		}

		.floor3 {
			// border: 1px solid;
			margin-top: 20rpx;
			display: flex;
			justify-content: space-between;
		}

		.head-nav {
			display: flex;
			justify-content: space-between;
			margin: 30rpx 20rpx auto;
			align-items: center;
		}
	}
	.advView{
		// border: 1px solid;
		padding-left: 25rpx;
	}
</style>
