<template>
	<view class="daiding">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="积分订单"
			  statusBar></uni-nav-bar>
		<view class="page">
			<view class="box">
				<view class="linshi">
					<view class="content">
						<view class="listImg">
							<img class="img" :src="dataInfo.imgUrl" alt="" />
						</view>
						<view class="">
							<view class="Listbig">{{ dataInfo.projectName }}</view>
							<view class="ListBigALittle">{{`能源类型：` + dataInfo.energyType }}</view>
							<view class="ListBigALittle">项目能源等级：
								<uni-rate class="score" :value="dataInfo.authenticationLevel" size="20" readonly />
							</view>
						</view>
					</view>
					<view class="content1">
						<view class="daijinquan">
							<view>交易单价：</view>
							<view class="right">{{ dataInfo.price}}</view>
						</view>
						<view class="daijinquan">
							<view>交易数量：</view>
							<view class="right">{{ dataInfo.tradeCount }}</view>
						</view>
						<view class="daijinquan">
							<view>交易总价：</view>
							<view class="right">{{ dataInfo.totalPrice }}</view>
						</view>
						<view class="daijinquan">
							<view>交易时间：</view>
							<view class="right">{{ dataInfo.tradeTime }}</view>
						</view>
					</view>
				</view>
				<view class="content2">
					<view class="daijinquan">
						<view>统一社会信用代码：</view>
						<view class="right">{{ dataInfo.socialCreditCode}}</view>
					</view>
					<view class="daijinquan">
						<view>企业名称：</view>
						<view class="right">{{ dataInfo.companyName }}</view>
					</view>
					<view class="daijinquan">
						<view>项目名称：</view>
						<view class="right">{{ dataInfo.projectName }}</view>
					</view>
					<view class="daijinquan">
						<view>项目编号：</view>
						<view class="right">{{ dataInfo.projectCode }}</view>
					</view>
					<view class="daijinquan">
						<view>能源类型：</view>
						<view class="right">{{ dataInfo.energyType }}</view>
					</view>
					<view class="daijinquan">
						<view>项目能源等级：</view>
						<view class="right">
							<uni-rate class="score" :value="dataInfo.authenticationLevel" size="20" readonly />
						</view>
					</view>
					<view class="daijinquan">
						<view>项目所属地区：</view>
						<view class="right">{{ dataInfo.projectArea }}</view>
					</view>
					<view class="daijinquan">
						<view>采集设备编号：</view>
						<view class="right">
							<text v-for="item in dataInfo.deviceCodes">{{item}}</text>
						</view>
					</view>
					<view class="daijinquan">
						<view>资产最近到期日：</view>
						<view class="right">{{ dataInfo.expireTime }}</view>
					</view>
					<view class="daijinquan">
						<view>1个月内到期资产数：</view>
						<view class="right">{{ dataInfo.oneMonthAsset }}</view>
					</view>
					<view class="daijinquan">
						<view>1-3月内到期资产数：</view>
						<view class="right">{{ dataInfo.oneToThreeMonthAsset }}</view>
					</view>
					<view class="daijinquan">
						<view>3-6月内到期资产数：</view>
						<view class="right">{{ dataInfo.threeToSixMonthAsset }}</view>
					</view>
					<view class="daijinquan">
						<view>6个月以上到期资产数：</view>
						<view class="right">{{ dataInfo.moreThanSixMonthAsset }}</view>
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
		reviewType,
		energyTypes
	} from "@/utils/public";
	import {
		codeToText
	} from '@/utils/cascader-address-options.js';
	import { back } from '@/utils/public.js';
	
	export default {
		data() {
			return {
				dataInfo: {},
				energyTypes,
				id: ""
			};
		},
		created() {},
		onLoad(option) {
			if (option.id) this.id = option.id;
		},
		mounted() {
			this.getData()
		},
		methods: {
			back() {
				back();
			},
			getData() {
				let {
					id
				} = this;
				let params = {
					orderId: id
				};
				this.$request({
					path: '/api/show/integralOrderDetails', // 路径
					method: 'GET', // GET、POST方法
					params: params // 参数
				}).then(res => {
					console.log(res);
					this.dataInfo = res.data;
					let {
						expireTime,
						tradeTime,
						totalPrice,
						price
					} = this.dataInfo;
					this.dataInfo.expireTime = momentDate(expireTime, "details");
					this.dataInfo.tradeTime = momentDate(tradeTime, "details");
					this.dataInfo.totalPrice = (totalPrice / 100).toFixed(2);
					this.dataInfo.price = (price / 100).toFixed(2);
					this.dataInfo.projectArea = codeToText(this.dataInfo.projectArea)
					this.dataInfo.energyType = energyTypes[this.dataInfo.energyType]
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		background-color: #F9F9F9;
	}
	.page {
		height: 1430rpx;
	}
	.daiding {
		background-color: #F9F9F9;
	}

	.daijinquan {
		margin-top: 24rpx;
		margin-bottom: 16rpx;
		margin-left: 20px;
		margin-right: 20px;
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;
	}

	.linshi {
		// border: 1px solid;
		background-color: #fff;
		border-radius: 25rpx;
		overflow: hidden;
		// border-radius: 25rpx 25rpx 25rpx 25rpx;
	}

	.right {
		margin-right: 25rpx;
	}

	.ListBigALittle {
		font-size: 14px;
		width: 450rpx;
		display: flex;
		// justify-content: space-between;
		margin-top: 11rpx;
	}

	.content {
		margin-top: 11rpx;
		width: 100%;
		display: flex;
		justify-content: space-between;
		// border: 1px solid;
	}

	.Listbig {
		font-weight: bold;
		font-size: 18px;
		width: 450rpx;
		margin-top: 11rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.listImg {
		// border: 1px solid;
		height: 380rpx;
		width: 500rpx;
		margin-left: 25rpx;
		border-radius: 25rpx;
		overflow: hidden;
		margin-bottom: 25rpx;
	}

	// .img {	
	// 	width: 100%;
	// 	height: 100%;
	// }

	.contentBox {
		// border: 1px solid;
		// margin-right: 155rpx;
	}

	.contentBox2 {
		width: 450rpx;
	}

	.contentBox3 {
		// border: 1px solid;
		width: 450rpx;
	}

	.contentBox1 {
		font-weight: bold;
		width: 450rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

	}

	.content1 {
		// margin-top: 20rpx;
		// padding-top: 15rpx;
		padding-left: 15rpx;
		// padding-right: 15prx;
		// border: 1px solid;
		width: 98%;
		background-color: #fff;
	}

	.content2 {
		margin-top: 20rpx;
		padding-top: 25rpx;
		padding-bottom: 25rpx;
		// padding-bottom: 25rpx;
		padding-left: 18rpx;
		// padding-right: 5prx;
		border-radius: 25rpx;
		overflow: hidden;
		// border: 1px solid;
		width: 98%;
		background-color: #fff;
	}

	.content3 {
		margin-top: 20rpx;
		padding-top: 15rpx;
		padding-left: 15rpx;
		padding-right: 15prx;
		// border: 1px solid;
		// height: 280rpx;
		width: 98%;
		background-color: #fff;
	}

	.listImg {
		margin-top: 11rpx;
		margin-left: 11rpx;
		margin-bottom: 11rpx;
		height: 200rpx;
		width: 200rpx;
	}

	.img {
		width: 200rpx;
		height: 200rpx;
	}
</style>
