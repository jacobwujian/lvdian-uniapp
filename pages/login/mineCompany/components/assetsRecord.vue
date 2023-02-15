<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="发布记录"  >
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
						<text>发布数量：</text>
						<view class="">
							<text v-if="cur == 0">{{item.status == 1 ? "+" : "-" }}</text>
							<text v-else-if="cur == 1">-</text>
							{{item.quantity}}
						</view>
					</view>

					<view class="showBox-info-box">
						<text>发布单价：</text>
						<view class="">
							{{item.price}}
						</view>
					</view>

					<view class="showBox-info-box">
						<text>状态：</text>
						<view class="">
							{{saleAssetStatus[item.status]}}
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
		saleAssetStatus,
		back
	} from "../../../../utils/public.js"
	
	export default {
		data() {
			return {
				// 用于切换card
				current: 0,
				items: [
					"全部",
					"在售",
					"已售",
					"发布撤回"
				],
				recordList: [],
				id: "",
				saleAssetStatus,
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
			// 获取发布记录
			getRecordList() {
				this.pageNum++
				let path = "/api/assetMment/assetSaleRecordDetail";
				let params = {}
				if (this.cur == 0) {
					params = {
						sellerId: this.id,
						status: this.current,
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}
				} else if (this.cur == 1) {
					params = {
						ownerId: this.id,
						status: this.current,
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}
				}
				this.$request({
					path: path,
					method: "GET",
					params: params
				}).then((value) => {
					let data = value.data.list
					data.map(item => {
						item.quantity = item.quantity / 100
						item.price = item.price / 100
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
