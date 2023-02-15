<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="绿电凭证"
			  statusBar></uni-nav-bar>
		<view class="page">
			<view class="zhengshu" style="background-image: url(../../../static/img/login/green_card_background1.jpg);">
				<view class="content">
					{{ `感谢您参与“` }}
					<span>扫绿码，低碳行动</span>
					{{ `”，认购` }}
					<span>{{ this.UserIntegral }}</span>
					{{
	          `个绿电积分（1个绿电积分对应100度电），践行绿色电力消费，支持可再生能源发展。助力“碳达峰”与“碳中和”目标，您我携手共建家园。`
	        }}
				</view>
				<view class="font-12 c-des mb6 text-right">
					国家可再生能源信息管理中心浙江分中心
				</view>
				<view class="font-12 c-des text-right">{{ updateTime }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		momentDate
	} from "@/utils/tools";
	import {
		mapState
	} from "vuex";
	import { back } from '@/utils/public.js';
	
	export default {
		data() {
			return {
				UserIntegral: "",
				updateTime: ""
			};
		},
		computed: {
			...mapState(["userId"])
		},
		created() {
			console.log(1)
			this.getUserIntegral();
		},
		methods: {
			back() {
				back();
			},
			// 获取用户绿电积分
			getUserIntegral() {
				
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
					
					let data = res.data.userTotalIntegral;
					let updateTime = res.data.updateTime;
					this.UserIntegral = data;
					console.log(this.UserIntegral);
					if (updateTime) this.updateTime = momentDate(updateTime, "details");
				});
			}
		}
	};
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}

	.page {
		// #ifdef H5
		margin-right: 38rpx;
		// #endif
		
		// #ifndef H5
		margin-right: 40rpx;
		// #endif
	}

	.zhengshu {
		width: 668rpx;
		// border: 1px solid;
		margin-left: 32rpx;
		margin-top: 48rpx;
		height: 946rpx;
		padding: 170rpx 80rpx;
		box-sizing: border-box;

		background-size: 100%;
		background-repeat: no-repeat;

		.dianwang {
			width: 96rpx;
			height: 96rpx;
			background-image: url("@/static/img/login/gjdw.png");
			background-size: 100%;
			background-repeat: no-repeat;
			margin: auto;
			margin-bottom: 40rpx;
		}

		.title {
			font-size: 40rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #0a4849;
			line-height: 48rpx;
			text-align: center;
			padding-top: 20rpx;
			margin-bottom: 80rpx;
		}

		.header {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			line-height: 42rpx;
			text-align: center;
			margin-bottom: 24rpx;
		}

		.content {
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #666666;
			line-height: 36rpx;
			margin-bottom: 40rpx;
			text-indent: 48rpx;
			margin-top: 200rpx;

			span {
				color: #a5c591;
			}
		}

		.text-right {
			text-align: right;
			font-size: 24rpx
		}
	}
</style>
