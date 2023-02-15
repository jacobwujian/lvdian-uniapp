<template>
	<view class="page">
		<!-- 电厂登录 -->
		<view class="box-title">
			<view class="linshi">
				<view class="avatar">
					<image :src="token ? avatar : grayAvatar" alt="" />
				</view>
				<view class="denglu">
					<view class="box-size" v-if="token">{{ userInfo.companyName }}</view>
					<view v-if="token" class="floor" @click="onLogout">
						退出登录
					</view>
				</view>
			</view>
			<view class="floor3">
				<view class="Q">{{ `资产数量：${userInfo.credentials / 100}` }}</view>
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
			<view class="content1">
				<view class="daijinquan" @click="goDetails(0)">
					<view class="left">
						<image class="jpg" src="../../../static/img/login/account.png" mode=""></image>
						<view class="action">账户</view>
					</view>
					<view class="right">
						<image class="png" src="../../../static/img/login/gogogo.png" mode=""></image>
					</view>
				</view>
				<view class="daijinquanView"/>
				<view class="daijinquan" @click="goDetails(1)">
					<view class="left">
						<image class="jpg" src="../../../static/img/login/organization.png" mode=""></image>
						<view class="action">机构</view>
					</view>
					<view class="right">
						<image class="png" src="../../../static/img/login/gogogo.png" mode=""></image>
					</view>
				</view>
				<view v-if="isSeller" class="daijinquanView"/>
				<view v-if="isSeller" class="daijinquan" @click="goDetails(4)">
					<view class="left">
						<image class="jpg" src="../../../static/img/login/project.png" mode=""></image>
						<view class="action">项目</view>
					</view>
					<view class="right">
						<image class="png" src="../../../static/img/login/gogogo.png" mode=""></image>
					</view>
				</view>
				<view v-if="isSeller" class="daijinquanView"/>
				<view v-if="isSeller" class="daijinquan" @click="goDetails(5)">
					<view class="left">
						<image class="jpg" src="../../../static/img/login/device.png" mode=""></image>
						<view class="action">设备</view>
					</view>
					<view class="right">
						<image class="png" src="../../../static/img/login/gogogo.png" mode=""></image>
					</view>
				</view>
				<view class="daijinquanView"/>
				<view class="daijinquan" @click="goDetails(2)">
					<view class="left">
						<image class="jpg" src="../../../static/img/login/order.png" mode=""></image>
						<view class="action">订单</view>
					</view>
					<view class="right">
						<image class="png" src="../../../static/img/login/gogogo.png" mode=""></image>
					</view>
				</view>
				<view class="daijinquanView"/>
				<view class="daijinquan" @click="goDetails(3)">
					<view class="left">
						<image class="jpg" src="../../../static/img/login/assets.png" mode=""></image>
						<view class="action">资产</view>
					</view>
					<view class="right">
						<image class="png" src="../../../static/img/login/gogogo.png" mode=""></image>
					</view>
				</view>
				<view class="daijinquanView"/>
				<br/>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		momentDate
	} from "@/utils/tools";
	import {
		mapMutations,
		mapState
	} from "vuex";
	// import Adverts from '@/components/Adverts.vue';
	import Adverts from "../../../components/Adverts/Adverts.vue";
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
				loading: false,
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
				if (!this.UserIntegral) return "0";
				if (!this.UserIntegral.userIntegral) return "0";
				return this.UserIntegral.userIntegral;
			},
			isSeller(){
				return this.userInfo.userType === 2&&this.userInfo.chainAddress&&this.userInfo.chainAddress.length>10
			},
			...mapState(["token", "phone", "userInfo"])
		},

		created() {
			this.getUserIntegral()
		},

		mounted() {
			this.getData();
		},

		methods: {

			goDetails(type) {
				let url = ""
				if (type == 0) {
					console.log("账户");
					url = `/pages/login/mineCompany/companyAccount`
				} else if (type == 1) {
					url = `/pages/login/mineCompany/companyInfo`
				} else if (type == 2) {
					console.log("订单");
					url = `/pages/login/mineCompany/companyOrder`
				} else if (type == 3) {
					console.log("资产");
					url = "/pages/login/mineCompany/companyAssets"
				} else if (type == 4){
					console.log("项目");
					url = "/pages/login/mineCompany/project/companyProject"
				} else if (type == 5){
					console.log("设备");
					url = "/pages/login/mineCompany/deviceManagement"
				}
				uni.navigateTo({
					url: url
				})
			},

			onLogout() {
				let that = this
				console.log(1);
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

			getUserIntegral() {
				let {
					token
				} = this;
				let params = {
					token
				};
				this.$request({
					path: '/api/show/selectUserIntegral', // 路径
					method: 'GET', // GET、POST方法
					params: params // 参数
				}).then(res => {
					let data = res.data || {};
					this.UserIntegral = data;
					this.userTotalIntegral = data.userTotalIntegral;
				});
			},

			pingzheng(userId) {

				uni.showModal({
					content: '暂未获取绿电证书',
					showCancel: false
				});
			
			},
			async getData() {
				this.pageNum++;
				let {
					pageSize,
					pageNum,
					token
				} = this;
				let params = {
					pageSize,
					pageNum,
					token
				};
				let res = {};
				// if (this.navIndex == 0) {
				res = await this.$request({
					path: '/api/CompanyInfo/ownAssetList', // 路径
					method: 'GET', // GET、POST方法
					params: params, // 参数
					header: {
						"Authorization": this.$store.state.token
					}
				}).then((value) => {
					console.log(value);
					this.integralList = value.data.list
				}).catch((reason) => {
					console.log(reason);
				})
				// } else if (this.navIndex == 2) {
				res = await this.$request({
					path: '/api/CompanyInfo/orderList', // 路径
					method: 'GET', // GET、POST方法
					params: params, // 参数
					header: {
						"Authorization": this.$store.state.token
					}
				}).then((value) => {
					console.log(value);
					this.voucherList = value.data.list
				}).catch((reason) => {
					console.log(reason);
				})
				// }
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #F9F9F9;

		.box-title {
			// display: flex;
			// border: 1px solid;
			background-color: #FFFFFF;
			border-radius: 25rpx;
			overflow: hidden;
		}

		.denglu {
			margin-top: 20rpx;
		}

		.linshi {
			display: flex;
		}

		.floor3 {
			// border: 1px solid;
			margin-top: 20rpx;
			display: flex;
			justify-content: space-between;
		}

		.action {
			// border: 1px solid;
			font-size: 38rpx;
			margin-top: 15rpx;
			margin-left: 15rpx;
		}

		.left {
			display: flex;
			justify-content: space-between;
			margin-left: 15rpx;
		}

		.png {
			margin-top: 6rpx;
			height: 35rpx;
			width: 35rpx;
			margin-right: 10rpx;
		}

		.jpg {
			margin-top: 5rpx;
			margin-bottom: 10rpx;
			height: 70rpx;
			width: 70rpx;
			// border: 1px solid;
		}

		.mine-icon1 {
			margin-bottom: 1rpx;
			margin-right: 6rpx;
			width: 21px;
			height: 21px;
		}

		.listImg {
			height: 180rpx;
			width: 240rpx;
		}

		.img {
			width: 100%;
			height: 100%;
		}

		.contentBox {
			background-color: #fff;
			display: flex;
			justify-content: space-between;
			margin-top: 15rpx;
			padding: 15rpx 50rpx 15rpx 15rpx;
			// border: 1px solid;

			view {
				// border: 1px solid;
				line-height: 62rpx;
				color: #5b5b5b;
				font-size: 26rpx;
				text-align: left;
			}
		}

		.content1 {
			margin-top: 25rpx;
			padding-top: 15rpx;
			// padding-left: 15rpx;
			padding-right: 15prx;
			background-color: #fff;
			border-radius: 25rpx;
			height: 100%;
			width: 100%;
		}

		.right {
			margin: 8rpx;
		}

		.daijinquan {
			margin-top: 9rpx;
			display: flex;
			justify-content: space-between;
			width: 100%;

		}
			.daijinquanView{
				display: flex;
				width: 656rpx;
				margin-left: 15rpx;
				height: 1rpx;
				border-bottom: 1rpx solid rgb(226, 226, 226);
			}


		.avatar {
			width: 115rpx;
			height: 115rpx;
			border-radius: 50%;
			overflow: hidden;
			margin-top: 20rpx;
			margin-left: 20rpx;

			// border: 1px solid;
			image {
				width: 115rpx;
				height: 115rpx;
				vertical-align: top;
			}
		}

		.activite {
			color: #04c9c3;
		}

		.box-size {
			font-size: 40rpx;
			padding-left: 30rpx;
			padding-top: 6rpx;
			// border: 1px solid;
		}

		.home {
			swiper {
				width: 700rpx;
				height: 260rpx;

				image {
					padding-top: 20rpx;
					width: 100%;
					overflow: hidden;
					border-radius: 35rpx;
					height: 100%;
				}
			}
		}

		.mine-icon {
			margin-left: 85px;
			width: 20px;
			height: 21px;
			// border: 1px solid;
		}

		.floor {
			margin-top: 20rpx;
			margin-left: 30rpx;
			font-size: 12px;
			color: gray;
			// border: 1px solid;
		}

		.floor2 {
			display: flex;
			justify-content: space-between;
			margin-top: 55rpx;
			margin-left: 70rpx;
			margin-right: 70rpx;
		}

		.head-nav {
			margin: 20rpx auto;
			align-items: center;
		}

		.Q {
			// border: 1px solid;
			margin: 25rpx;
			display: flex;
			justify-content: space-between;
		}
	}
</style>
