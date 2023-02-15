<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="核销记录"  >
		</uni-nav-bar>
		<view class="page">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
				activeColor="#0055ff">
			</uni-segmented-control>
			<!-- 展示区 -->
			<view class="showBox">
				<!-- 信息box -->
				<view class="showBox-info" v-for="(item,index) in recordList" :key="index">
					<view class="showBox-info-box">
						<text>流水号：</text>
						<view class="">
							{{item.recordId}}
						</view>
					</view>

					<view class="showBox-info-box">
						<text>操作时间：</text>
						<view class="">
							<uni-dateformat :date="item.createTime" format="yyyy-MM-dd hh:mm:ss"></uni-dateformat>
						</view>
					</view>

					<view class="showBox-info-box">
						<text>核销数量：</text>
						<view class="">
							<text v-if="cur == 0">{{item.status == 1 ? "+" : "-" }}</text>
							<text v-else-if="cur == 1">-</text>
							{{item.quantity}}
						</view>
					</view>

					<view class="showBox-info-box">
						<text>核销状态：</text>
						<view class="">
							{{verAssetStatus[item.status]}}
						</view>
					</view>
				</view>
				<!-- 上拉触底结束栏 -->
				<view class="bottomBar" v-if="this.rbm == false">
					已经到底了哦~
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		verAssetStatus
	} from "../../../../utils/public.js"
	import { back } from '@/utils/public.js';
	
	export default {
		data() {
			return {
				// 用于切换card
				current: 0,
				items: [
					"全部",
					"待审核",
					"审核通过",
					"审核拒绝"
				],
				recordList: [],
				id: "",
				verAssetStatus,
				cur: "",
				pageNum: 0,
				pageSize: 10,
				// 控制上拉触底
				rbm: true,

			}
		},
		onLoad(option) {
			if (option) {
				this.id = option.id
				this.cur = option.current
			}
		},
		// 上拉触底
		onReachBottom() {
			if (this.rbm) this.getRecordList();

		},
		mounted() {
			this.getRecordList()
		},
		methods: {
			back() {
				back();
			},
			init() {
				this.recordList = []
				this.pageNum = 0
				this.pageSize = 10
				this.rbm = true
			},
			// 切换
			onClickItem(e) {
				this.current = e.currentIndex
				this.init()
				this.getRecordList()
			},
			// 获取核销记录
			getRecordList() {
				this.pageNum++
				this.$request({
					path: "/api/assetMment/verificationRecordList",
					method: "GET",
					params: {
						ownerId: this.id,
						status: this.current,
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}
				}).then((value) => {
					let data = value.data.list
					data.map(item => {
						item.quantity = item.quantity / 100
					})
					this.recordList = this.recordList.concat(data)
					if (value.data.size != value.data.pageSize) {
						// 停止上拉触底
						this.rbm = false
					}
				}).catch((reason) => {
					console.log("请求失败");
				})
			},
		}

	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}

	.showBox {

		&-info {
			padding: 20rpx;
			background-color: #fff;
			border-radius: 25rpx;

			&-box {
				display: flex;
				justify-content: space-between;
				font-size: 26rpx;
				line-height: 50rpx;
			}

		}

		&-info:nth-child(n+2) {
			margin-top: 20rpx;
		}

	}

	// 上拉触底栏
	.bottomBar {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999;
	}
</style>
