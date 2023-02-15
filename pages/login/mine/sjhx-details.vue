<template>
	<view class="daiding">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="商家核销"
			  statusBar></uni-nav-bar>
		<view class="page">
			<!-- 	<view class="">
			{{ dataInfo.voucherName }}
		</view> -->
			<view class="box">
				<img class="img" :src="dataInfo.voucherImgUrl" alt="" />
			</view>
			<view class="box-hexiao">
				核销码：{{ filterData(dataInfo.voucherRedemptionCode) }}
			</view>
			<view class="box-text">
				<view class="daijinquan" style="margin-top: 8rpx;">
					<view>用户信息：</view>
					<view class="right">{{ userData }}</view>
				</view>
				<view class="daijinquan">
					<view>兑换数量：</view>
					<view class="right">{{ dataInfo.exchangeTotal }}</view>
				</view>
				<view class="daijinquan">
					<view>兑换时间：</view>
					<view class="right">{{ dataInfo.exchangeTime }}</view>
				</view>
				<view class="daijinquan">
					<view>交易总价：</view>
					<view class="right">{{ dataInfo.exchangeTotalPrice + `绿电积分` }}</view>
				</view>
			</view>
			<view class="box-gg">
				<view class="shangxia">注意事项：</view>
				<view class="shangxia">请前往商家/前台联系商家确认核销，非商家确认自主核销的视为无效兑换。</view>
			</view>
			<view class="externalLink">
				<button @click="confrmOrder()" size="small"
					style="background-color: #2a85e2; color: #fff;">商家确认</button>
			</view>
		</view>
	</view>
</template>

<script>
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
				// orderId: "",
				show: false
			};
		},
		onLoad(option) {
			if (option.id) this.id = option.id;
		},
		created() {
			
		},
		mounted() {
			// this.userData = localStorage.getItem("phone");
			// this.orderId = this.$route.query.orderId;
			this.getData();
		},
		computed:{
			userData(){
				return uni.getStorageSync("phone");
			},

		},
		methods: {
			back() {
				back();
			},
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
					this.dataInfo.exchangeTime = momentDate(
						res.data.exchangeTime,
						"details"
					);
				});
			},
			filterData(data) {
				if (Array.isArray(data)) {
					return data[0];
				} else {
					return data;
				}
			},
			confrmOrder() {
				uni.showModal({
					content: '优惠券已核销',
					showCancel: false
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}
	.page{
		height: 1430rpx;
	}

	.daiding {
		// background-color: #F9F9F9;
	}

	.box {
		// border: 1px solid;
		height: 450rpx;
		padding: 0 0.42667rem;
		display: flex;
		justify-content: center;
	}

	.img {
		width: 100%;
		height: 100%;
		// border: 1px solid;
		border-radius: 25rpx;
		overflow: hidden;
	}

	.box-hexiao {
		// border: 1px solid;
		margin-top: 25rpx;
		height: 80rpx;
		padding-top: 15rpx;
		text-align: center;
	}

	.box-text {
		// border: 1px solid;
		margin-top: 20rpx;
		height: 240rpx;
		background-color: #fff;
		border-radius: 25rpx;
		overflow: hidden;
	}

	.box-gg {
		// border: 1px solid;
		margin-top: 25rpx;
		height: 130rpx;
		// margin-bottom: 20rpx;
		background-color: #fff;
		border-radius: 25rpx;
		overflow: hidden;
	}

	.externalLink {
		font-size: 0.37333rem;
		width: 40%;
		height: 56rpx;
		display: block;
		margin: 20rpx auto 0;
		padding: 0;
		text-align: center;
		line-height: 56rpx;
		border-radius: 8rpx;
		background: #2a85e2;
		color: #fff;
	}

	.daijinquan {
		margin-left: 8rpx;
		margin-right: 8rpx;
		display: flex;
		justify-content: space-between;

	}

	.right {
		margin: 8rpx;
	}

	.shangxia {
		margin-left: 8px;
		margin-right: 8px;
	}
</style>
