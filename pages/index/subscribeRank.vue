<template>
	<view>
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="绿色凭证认购排行" leftWidth="200px"
			statusBar>
		</uni-nav-bar>

		<!-- 主体 -->
		<view class="page">

			<!-- 排名展示 -->
			<view class="rankBox" v-if="seriesData.length != 0">
				<view class="rankTitle">实时排名</view>
				<!-- 轮播图 -->
				<view class="swiperBox" v-if="firstThree.length != 0">
					<uni-swiper-dot :info="firstThree" field="name" val="val" :current="current" :mode="mode">
						<swiper class="swiper-box" @change="change" autoplay="true" interval="3000" circular="true">
							<swiper-item v-for="(item ,index) in firstThree" :key="index">
								<view class="swiper-item">
									<image class="img" :src="item.imgUrl" mode="" @click="imgClick(item.projectId)">
									</image>
								</view>
							</swiper-item>
						</swiper>
					</uni-swiper-dot>
				</view>
				<view class="rankTemp">
					<view class="rankItem" v-for="(item,index) in seriesData">
						<view class="temp">
							<view class="name">
								<!-- 								<view class="imgBox" v-if="index+1 <= 3">
									<image class=" img" v-if="index+1 == 1" src="../../static/img/rank/gold.png"
										mode="">
									</image>
									<image class="img" v-else-if="index+1 == 2" src="../../static/img/rank/silver.png"
										mode=""></image>
									<image class="img" v-else-if="index+1 == 3" src="../../static/img/rank/copper.png"
										mode=""></image>
								</view>
								<text v-else class="index">{{index+1}}、</text> -->
								<text class="index">{{index+1}}、</text>
								{{item.projectName}}
							</view>
							<view class="value">
								{{item.stockAmount}}
							</view>
						</view>
						<!-- 分割线 -->
						<view class="itemHr">
						</view>
					</view>
				</view>
			</view>

			<view class="bottomBar" v-else>
				暂无数据
			</view>

		</view>
	</view>
</template>

<script>
	import {
		back
	} from '@/utils/public.js';

	export default {
		data() {
			return {
				current: 0,
				mode: 'nav',
				// 前三
				firstThree: [],
				// 数据值
				seriesData: [],
				y: 0,
			}
		},

		created() {
			this.getRank()
		},

		methods: {
			imgClick(val) {
				// console.log(val);
			},
			change(e) {
				this.current = e.detail.current;
			},
			// 认购排行数据查询
			getRank() {
				let that = this
				this.$request({
						path: "/api/rank/subscribeRank", // 路径
						method: 'GET', // GET、POST方法
					})
					.then(res => {
						let data = res.data
						data.forEach(item => {
							that.y++
							if (that.y <= 3) {
								let obj = {}
								obj.name = `第${that.y}名    ${item.projectName}`
								obj.val = item.stockAmount
								obj.imgUrl = item.imgUrl
								obj.projectId = item.projectId


								that.firstThree.push(obj)

							}
							that.seriesData.push(item)
						})
					})
					.catch(reason => {
						// 失败回调
						console.log('请求失败');
					});
			},
			// 返回
			back() {
				back();
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

	.swiper-box {
		height: 450rpx;
	}

	.swiper-item {
		height: 450rpx;
		width: 700rpx;
	}

	.hotStyle() {
		background-color: #F60;
		display: inline-block;
		padding: 0 2px;
		text-align: center;
		vertical-align: middle;
		font-style: normal;
		color: #fff;
		overflow: hidden;
		line-height: 16px;
		height: 16px;
		font-size: 12px;
		border-radius: 4px;
		font-weight: 200;
		margin-left: 6px;
	}

	.swiperBox {
		border-radius: 25rpx;
		overflow: hidden;
	}

	.page {
		background-color: #F9F9F9;
		padding-bottom: 30rpx;




		// 排名
		.rankBox {
			// margin-top: 20rpx;
			background-color: #FFFFFF;
			padding: 15rpx 25rpx;
			border-radius: 25rpx;

			.rankTitle {
				margin-bottom: 15rpx;
				font-size: 38rpx;
			}

			.rankTemp {
				.rankItem {
					margin-top: 20rpx;
					font-size: 28rpx;
					line-height: 55rpx;


					.index {
						margin-left: 15rpx;
						color: #9195A3;
					}

					.itemHr {
						width: 100%;
						border: 1rpx solid;
						background-color: #9195A3;
						opacity: 0.1;
					}

					.temp {
						display: flex;
						justify-content: space-between;

						.name {
							width: 450rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							display: flex;

							.imgBox {
								margin-right: 15rpx;
								width: 21px;
								height: 24px;
							}
						}

						.value {
							// width: 200rpx;
							color: #9195A3;

						}
					}

					&:nth-child(1) {

						.index,
						.value {
							color: #FE2D46;
						}

						// .hot {
						// 	.hotStyle();
						// }
					}

					&:nth-child(2) {

						.index,
						.value {
							color: #F60;
						}

						// .hot {
						// 	.hotStyle();
						// }
					}

					&:nth-child(3) {

						.index,
						.value {
							color: #FAA90E;
						}

						// .hot {
						// 	.hotStyle();
						// }
					}



				}
			}
		}
	}

	.bottomBar {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999;
	}
</style>
