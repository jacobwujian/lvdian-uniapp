<!-- 企业资产管理 -->
<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="资产管理" statusBar>
		</uni-nav-bar>
		<view class="page">
			<!-- 分段器 -->
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
				activeColor="#0055ff">
			</uni-segmented-control>
			<!-- 展示页 -->
			<view class="showBox">
				<!-- 发布资产 -->
				<view v-show="current === 0">
					<!-- 主box -->
					<view class="showBox-publish" @click="toDetails(item.id,current)"
						v-for="(item,index) in publishAssetsList" :key="index">
						<!-- 图片 -->
						<view class="showBox-publish-img">
							<image class="img" :src="item.imgUrl"></image>
						</view>

						<!-- 信息 -->
						<view class="showBox-publish-info">
							<!-- 名称 -->
							<view class="showBox-publish-info-title">
								{{item.assetSaleName}}
							</view>
							<view class="showBox-publish-info-aff">
								关联公司：{{item.companyName}}
							</view>
							<view class="showBox-publish-info-type">
								能源类型：{{item.energyType}}
							</view>
							<view class="showBox-publish-info-sum">
								总数：{{item.stockAmount}}
							</view>
							<view class="showBox-publish-info-sale">
								在售数量：{{item.stock}}
							</view>
						</view>
					</view>
				</view>

				<!-- 拥有资产 -->
				<view v-show="current === 1">
					<!-- 主box -->
					<view class="showBox-publish" @click="toDetails(item.id,current)"
						v-for="(item,index) in ownAssetsList" :key="index">
						<!-- 图片 -->
						<view class="showBox-publish-img">
							<image class="img" :src="item.imgUrl"></image>
						</view>

						<!-- 信息 -->
						<view class="showBox-publish-info">
							<view class="showBox-publish-info-title">
								{{item.projectName}}
							</view>
							<view class="showBox-publish-info-aff">
								关联公司：{{item.companyName}}
							</view>
							<view class="showBox-publish-info-type">
								能源类型：{{item.energyType}}
							</view>
							<view class="showBox-publish-info-sum">
								总数：{{item.assetAmount}}
							</view>
							<view class="showBox-publish-info-sale">
								可支配数量：{{item.amount}}
							</view>
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
		energyTypes
	} from "../../../utils/public.js"
	import {
		back
	} from '@/utils/public.js';

	export default {
		data() {
			return {
				// 用于切换card
				current: 0,
				items: [
					"发布资产",
					"拥有资产"
				],
				// 接收发布资产数据
				publishAssetsList: [],
				// 接收拥有资产数据
				ownAssetsList: [],
				// 发电类型
				energyTypes,
				token: this.$store.state.token,
				// 控制上拉触底
				rbm: true,
				pageSize: 10,
				pageNum: 0,
			}
		},
		onShow() {
			this.start()
		},
		onHide() {
			this.init()
		},
		onPullDownRefresh() {
			this.start()
			// 取消刷新
			uni.stopPullDownRefresh()
		},
		// 上拉触底
		onReachBottom() {
			if (this.current == 0) {
				if (this.rbm) this.getPublishAssetsList();
			} else {
				if (this.rbm) this.getOwnAssetList();
			}

		},
		methods: {
			back() {
				back();
			},
			// 查询
			start() {
				this.init()
				if (this.current == 0) {
					this.getPublishAssetsList();
				} else {
					this.getOwnAssetList();
				}
			},
			// 重置
			init() {
				this.pageSize = 10
				this.pageNum = 0
				this.rbm = true
				this.publishAssetsList = []
				this.ownAssetsList = []
			},
			// 获取拥有资产信息
			getOwnAssetList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let path = "/api/assetMment/ownAssets"
				this.pageNum++
				this.$request({
					path: path,
					method: "GET",
					header: {
						"Authorization": this.token
					},
					params: {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}
				}).then((value) => {
					uni.hideLoading();
					let list = value.data.list
					list.map(item => {
						item.assetAmount = item.assetAmount / 100
						item.amount = item.amount / 100
						if (item.energyType != null) {
							item.energyType = energyTypes[item.energyType]
						}
					})
					this.ownAssetsList = this.ownAssetsList.concat(list)
					if (this.ownAssetsList.length >= value.data.total) {
						// 停止上拉触底
						this.rbm = false
					}
				}).catch((reason) => {
					console.log("请求失败");
				})
			},
			// 获取发布资产信息
			getPublishAssetsList() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				let path = "/api/assetMment/publishAssets"
				this.pageNum++
				this.$request({
					path: path,
					method: "GET",
					header: {
						"Authorization": this.token
					},
					params: {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}
				}).then((value) => {
					uni.hideLoading();
					let list = value.data.list
					list.map(item => {
						item.stockAmount = item.stockAmount / 100
						item.stock = item.stock / 100
						if (item.energyType != null) item.energyType = energyTypes[item.energyType]
					})
					this.publishAssetsList = this.publishAssetsList.concat(list)
					if (this.publishAssetsList.length >= value.data.total) {
						// 停止上拉触底
						this.rbm = false
					}
				}).catch((reason) => {
					console.log("请求失败");
				})
			},
			// 切换发布/拥有
			onClickItem(e) {
				this.current = e.currentIndex
				this.start()
			},
			// 跳转详情
			toDetails(id, current) {
				uni.navigateTo({
					url: `./components/publishAssetsDetails?id=${id}&current=${current}`
				})

			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}

	.img {
		width: 100%;
		height: 100%;
	}

	.showBox {

		&-publish:nth-child(n+2) {
			margin-top: 20rpx;
		}

		&-publish {
			background-color: #FFFFFF;
			border-radius: 25rpx;
			overflow: hidden;
			padding: 15rpx;
			display: flex;
			// justify-content: space-between;

			&-img {
				width: 290rpx;
				height: 240rpx;
				border-radius: 25rpx;
				overflow: hidden;
			}

			&-info {
				margin-left: 10rpx;
				width: 340rpx;
				height: 240rpx;
				padding-left: 15rpx;

				view {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				view:first-child {
					line-height: 60rpx;
					font-size: 35rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				view:nth-child(n + 2) {
					color: #a5a5a5;
					font-size: 25rpx;
					line-height: 43rpx;
				}
			}
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
