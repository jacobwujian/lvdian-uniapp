<template>
	<view style="background-color:F9F9F9 ;">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="商城订单"
			  statusBar></uni-nav-bar>
		<view class="page">
			<view class="content">
				<view class="listImg">
					<image class="img" :src="dataInfo.voucherImgUrl"></image>
				</view>
				<view class="contentBox">
					<view class="contentBox1"
						style="font-family:PingFangSC; font-weight:400; font-size:18px; color:rgb(16, 16, 16); font-style:normal; letter-spacing:0px; text-decoration:none;">
						{{ dataInfo.voucherName }}
					</view>
					<view class="contentBox2" style="color:rgba(20, 210, 51, 1); ">{{ dataInfo.price + `绿电积分`}}</view>
					<view class="contentBox3">{{ `兑换数量：`+ dataInfo.exchangeTotal }}</view>
				</view>
			</view>
			<view class="content1">
				<view class="daijinquan">
					<view>商品单价：</view>
					<view class="right">{{ dataInfo.price + `绿电积分` }}</view>
				</view>
				<view class="daijinquan">
					<view>兑换数量：</view>
					<view class="right">{{ dataInfo.exchangeTotal }}</view>
				</view>
				<view class="daijinquan">
					<view>交易总价：</view>
					<view class="right">{{ dataInfo.exchangeTotalPrice + `绿电积分` }}</view>
				</view>
				<view class="daijinquan">
					<view>兑换时间：</view>
					<view class="right">{{ dataInfo.exchangeTime }}</view>
				</view>
				<view class="daijinquan" v-if="neibu">
					<view>{{ `代金券码：` + dataInfo.voucherRedemptionCode }}</view>
					<view @click="copy()" class="fuzhi">复制</view>
				</view>
				<view class="daijinquan" v-if="waibu">
					<view>{{ `代金券码：` + dataInfo.voucherRedemptionCode }}</view>
					<view @click="copy()" class="fuzhi">复制</view>
				</view>
				<view class="daijinquan" v-if="lianjie">
					<view>{{ `专属链接：` + dataInfo.voucherRedemptionCode }}</view>
				</view>
			</view>
			<view class="content2" v-if="neibu">
				<button class="externalLink" size="mini" @click="gosjhx(dataInfo)">去使用</button>
			</view>
			<view class="content2" v-if="waibu">
				<button class="externalLink" size="mini" @click="toUse()">去使用</button>
			</view>
		<!-- 	<view class="content2" v-if="this.dataInfo.commodityType == 1">
				<button class="externalLink" size="mini" @click="toUse()">跳转链接</button>
			</view> -->
			<web-view v-if="externalLink == 1" :src="dataInfo.externalLink">
			</web-view>
		</view>
	</view>
</template>

<script>
	import h5Copy from '@/js_sdk/junyi-h5-copy/junyi-h5-copy/junyi-h5-copy.js'
	import ProjectCard from "@/components/ProjectCard";
	import InfoCard from "@/components/InfoCard";
	import Header from "@/components/Header";
	import {
		momentDate
	} from "@/utils/tools";
	import { back } from '@/utils/public.js';
	
	export default {
		data() {
			return {
				dataInfo: {
					Image: "",
					projectName: "",
					energyType: "",
					price: "",
					stock: "",
					createTime: "",
					companyName: "",
					assetSaleCode: "",
					rate: "",
					count: "",
					prompt: ""
				},
				orderId: "",
				show: false,
				isInfo: false,
				externalLink: 0
			};
		},
		onLoad(option) {
			console.log(option.id);
			if (option.id) this.id = option.id;
		},
		mounted() {
			// this.orderId = this.$route.query.orderId;
			this.getData();
		},
		mounted() {
			
			
			this.getData()
		},
computed:{
	lianjie(){
		return this.dataInfo.commodityType == 1;
	},
	waibu(){
		return this.dataInfo.commodityType == 0;
	},
	neibu(){
		return this.dataInfo.commodityType == 2;
	}
},
		methods: {
			getData() {
				let {
					orderId
				} = this;
				let params = {
					orderId: this.id
				};
				this.$request({
					path: '/api/show/selectUserVoucherDetails', // 路径
					method: 'GET', // GET、POST方法
					params: params // 参数
				}).then(res => {
					this.dataInfo = res.data;
					console.log(this.dataInfo);
					this.dataInfo.exchangeTime = momentDate(
						res.data.exchangeTime,
						"details"
					);
				});
			},
			toUse() {
				console.log(1111);
				// #ifdef H5
				location.href = this.dataInfo.externalLink;
				// #endif

				// #ifndef H5
				console.log(this.dataInfo.externalLink);
				this.externalLink = 1
				// #endif
			},
			gosjhx(dataInfo) {
				uni.showModal({
					title: '核销说明',
					content: '请前往商家/前台联系商家确认核销，非商家确认自主核销的视为无效兑换',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							let navData = dataInfo.orderId
							uni.navigateTo({
								url: `/pages/login/mine/sjhx-details?id=${navData}`
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			back() {
				back();
			},
			copy() {
				uni.setClipboardData({
					data: this.dataInfo.voucherRedemptionCode[0],
					success: function() {
						console.log('success');
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}

	.fuzhi {
		color: #2a85e2;
		float: right;
		display: flex;
		justify-content: space-between;
		margin-right: 15rpx;

	}

	.right {
		margin: 8rpx;
	}

	.externalLink {
		// #ifdef H5
		width: 40%;
		height: 56rpx;
		display: block;
		margin: 20rpx auto 0;
		padding-top: 5rpx;
		text-align: center;
		line-height: 46rpx;
		border-radius: 8rpx;
		background: #2a85e2;
		color: #fff;
		// #endif
		// #ifndef H5
		width: 40%;
		height: 56rpx;
		display: block;
		margin: 20rpx auto 0;
		margin-left: 210rpx;
		// text-align: center;
		line-height: 46rpx;
		border-radius: 8rpx;
		background: #2a85e2;
		color: #fff;
		// #endif
	}

	.content {
		margin-top: 25rpx;
		// border: 1px solid;
		height: 240rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 25rpx;
		overflow: hidden;
	}

	.daijinquan {
		display: flex;
		justify-content: space-between;
	}

	.content1 {
		margin-top: 20rpx;
		padding: 15rpx;
		// border: 1px solid;
		height: 280rpx;
		width: 98%;
		background-color: #fff;
		border-radius: 25rpx;
		overflow: hidden;
	}

	.listImg {
		margin-top: 33rpx;
		margin-left: 15rpx;
		height: 175rpx;
		width: 200rpx;
		border-radius: 25rpx;
		overflow: hidden;
		// border: 1px solid;
	}

	.img {
		width: 100%;
		height: 100%;
		// border: 1px solid;
	}

	.contentBox2 {
		// border: 1px solid;
		display: inline;
		color: #54f06e;
		margin-top: 25rpx;
	}

	.contentBox3 {
		// border: 1px solid;
		margin-left: 55rpx;
		margin-top: 25rpx;
		display: inline;
		font-weight: bolder;
	}

	.contentBox1 {
		// border: 1px solid;
		width: 350rpx;
		font-size: 25rpx;
		background-color: #fff;
		// display: flex;
		// justify-content: space-between;
		margin-top: 10rpx;
		// padding: 15rpx 50rpx 15rpx 15rpx;
		margin-right: 25rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.contentBox {
		// border: 1px solid;
		background-color: #fff;

		// display: flex;
		// justify-content: space-between;
		margin-top: 15rpx;
		padding: 15rpx 50rpx 15rpx 15rpx;

		view {
			line-height: 62rpx;
			color: #5b5b5b;
			font-size: 26rpx;
			text-align: left;
		}
	}
</style>
