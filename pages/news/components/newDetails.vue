<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="资讯详情"   statusBar>
		</uni-nav-bar>
		<view class="page">
			<!-- 信息头 -->
			<view class="boxTop">
				<view class="boxTop-title">
					{{newDetail.informationTitle}}
				</view>

				<view class="boxTop-show">
					<!-- 时间 -->
					<view class="">
						发布时间：<uni-dateformat :date="newDetail.updateTime" format="yyyy-MM-dd"></uni-dateformat>
					</view>

					<!-- 类型 -->
					<view class="">
						资讯类型:
						{{ newDetail.informationType == 1 ? '普通资讯' : newDetail.informationType == 2 ? '活动资讯' : newDetail.informationType == 3 ? '公益活动' : newDetail.informationType }}
					</view>
				</view>
				
				<view class="hr">
					
				</view>
			</view>
			<!-- 内容 -->
			<view class="boxContent">
				<view v-if="newDetail.linkFlag !== 1" class="describe" v-html="newDetail.informationContent">
				</view>
				<web-view v-if="newDetail.linkFlag === 1" :src="newDetail.externalLink" @message="getMessage">
				</web-view>
			</view>
		</view>
	</view>
</template>

<script>
	// import {
	// 	momentDate
	// } from "../../../utils/tools.js"
	import { back } from '@/utils/public.js';
	export default {
		data() {
			return {
				// api: "http://192.168.2.109:8081",
				id: null,
				newDetail: [],
			}
		},
		onLoad(option) {
			// 获取id
			if (option.id) this.id = option.id;

		},
		mounted() {
			this.getNewDetailData()
		},
		methods: {
			back() {
				back();
			},
			getMessage(event) {
				uni.showModal({
					content: JSON.stringify("外部资讯"),
					showCancel: false
				});
			},
			// 获取资讯详情
			getNewDetailData() {
				// 开启加载
				uni.showLoading({
					title: "加载中"
				})
				let path = "/api/information/obtainByInformationId"
				this.$request({
					path: path, // 路径
					method: "GET", // GET、POST方法
					params: {
						voucherStockId: this.id
					}, // 参数
				}).then((value) => {
					// 成功回调
					let data = value.data
					// if (data.updateTime) data.updateTime = momentDate(data.updateTime)
					this.newDetail = data
					uni.hideLoading()
				}).catch((reason) => {
					// 失败回调
					console.log(请求失败);
					uni.hideLoading()
				})

			}
		}

	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}
	
	// 信息头
	.boxTop {
		padding: 20rpx;

		&-title {
			line-height: 70rpx;
			text-align: center;
			font-size: 40rpx;
			font-weight: 700;
			font-family: PingFangSC-Medium, PingFang SC;

		}

		&-show {
			display: flex;
			justify-content: space-around;
			font-size: 25rpx;
			margin-top: 20rpx;
			color: #999;
		}
	}

	// 内容
	.boxContent {
		font-size: 29rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #555555;
		padding: 0 25rpx 30rpx 25rpx;
	}
	.hr{
		width: 100%;
		border: 1rpx #ccc solid;
		margin-top: 20rpx;
	}

	// /deep/ 
	.describe {
		table {
			border-top: 1px solid #ccc;
			border-left: 1px solid #ccc;
		}

		table td,
		table th {
			border-bottom: 1px solid #ccc;
			border-right: 1px solid #ccc;
			padding: 3px 5px;
		}

		table th {
			border-bottom: 2px solid #ccc;
			text-align: center;
		}

		/* blockquote 样式 */
		blockquote {
			display: block;
			border-left: 8px solid #d0e5f2;
			padding: 5px 10px;
			margin: 10px 0;
			line-height: 1.4;
			font-size: 100%;
			background-color: #f1f1f1;
		}

		/* code 样式 */
		code {
			display: inline-block;
			display: inline;
			zoom: 1;
			background-color: #f1f1f1;
			border-radius: 3px;
			padding: 3px 5px;
			margin: 0 3px;
		}

		pre code {
			display: block;
		}

		/* ul ol 样式 */
		ul,
		ol {
			margin: 10px 0 10px 20px;
		}
	}
</style>
