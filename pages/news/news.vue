<template>
	<view>
		<uni-nav-bar height="46" fixed left-text="最新资讯" statusBar></uni-nav-bar>
		<view class="page">
			<!-- 轮播图 -->
			<view class="showBox" v-if="showImgList != ''">
				<!-- <swiperModule :swiperList="showImgList"></swiperModule> -->
				<swiper indicator-dots circular autoplay interval="2000">
					<swiper-item v-for="(item, index) in showImgList" :key="index" @click="swiperDetail(item)"><image :src="item.imgUrl"></image></swiper-item>
				</swiper>
			</view>

			<!-- 资讯内容 -->
			<view class="news">
				<!-- 资讯体 -->
				<!-- :key="item.id" -->
				<view class="newList" v-for="item in newsList"  @click="toDetails(item)">
					<!-- 标题 -->
					<view class="title">{{ item.informationTitle }}</view>

					<!-- 时间 -->
					<view class="time">
						<uni-dateformat :date="item.updateTime" format="yyyy-MM-dd"></uni-dateformat>
					</view>

					<!-- 图片 -->
					<view class="newImg" v-if="item.informationImgUrl == '' ? false : true">
						<image class="img" :src="item.informationImgUrl"></image>
					</view>
				</view>
			</view>

			<!-- 上拉触底结束栏 -->
			<view class="bottomBar" v-if="this.rbm == false">已经到底了哦~</view>
		</view>
	</view>
</template>

<script>
	// import { momentDate } from '../../utils/tools.js';
	import swiperModule from '@/components/swiper-module/swiper-module.vue';
	export default {
		components: {
			swiperModule
		},
		data() {
			return {
				// 接收轮播图数据
				showImgList: [],
				// 资讯页数
				pageSize: 10,
				pageNum: 0,
				// 接收资讯数据
				newsList: [],
				total: '',
				// 控制上拉触底
				rbm: true
			};
		},
		onShow() {
			this.getImgUrl();
			this.getNews();
		},
		onHide() {
			this.init();
		},
		methods: {
			swiperDetail(data){
				if(data.linkFlag!=1){
					// 跳资讯详情
					uni.navigateTo({
						url: data.path,
						fail: err => {
							console.error(err);
						}
					});
					
				}else{
					// 外链
					window.location.href = data.externalLink;
				}
			},
			init() {
				this.showImgList = [];
				this.pageNum = 0;
				this.pageSize = 10;
				this.newsList = [];
				this.total = '';
				this.rbm = true;
			},
			// 下拉刷新
			onPullDownRefresh() {
				this.init();
				this.getImgUrl();
				this.getNews();
				// 取消刷新
				uni.stopPullDownRefresh();
			},
			// 上拉触底
			onReachBottom() {
				if (this.rbm) this.getNews();
			},
			// 获取资讯数据
			getNews() {
				// 开启加载
				uni.showLoading({
					title: '加载中'
				});
				let path = '/api/information/obtainInformation';
				this.pageNum++;
				this.$request({
						path: path, // 路径
						method: 'GET', // GET、POST方法
						params: {
							pageNum: this.pageNum,
							pageSize: this.pageSize
						} // 参数
					})
					.then(value => {
						setTimeout(() => {
							uni.hideLoading();
						}, 300);
						// 成功回调
						let total = value.data.total;
						let list = value.data.list;
						list.map(item => {
							// if (item.updateTime) item.updateTime = momentDate(item.updateTime);
						});
						this.newsList = this.newsList.concat(list);
						// 这可能要改
						if (total != this.pageSize) this.rbm = false;
					})
					.catch(reason => {
						// 失败回调
						console.log(失败);
						uni.hideLoading();
					});
			},
			// 跳转详情页
			toDetails(data) {
				// #ifdef H5
				if (data.linkFlag == 1) {
					window.location.href = data.externalLink;
				} else {
					let navData = data.id;
					uni.navigateTo({
						url: `./components/newDetails?id=${navData}`
					});
				}
				// #endif
				
				
				// #ifndef H5
				let navData = data.id;
				uni.navigateTo({
					url: `./components/newDetails?id=${navData}`
				});
				// #endif
			},
			// 获取轮播图信息
			getImgUrl() {
				let path = '/api/activity/showAllActivityImgUrl';
				this.$request({
						path: path, // 路径
						method: 'GET', // GET、POST方法
						params: {
							// 活动图片:2  公益活动:3
							type: 3,
							// 查询个数
							limit: 5
						}
					})
					.then(value => {
						// 成功回调
						const data = value.data;
						this.showImgList = data.map(item => {
							return {
								imgUrl: item.informationImgUrl,
								path: `./components/newDetails?id=${JSON.stringify(item.id)}`,
								externalLink:item.externalLink,
								linkFlag:item.linkFlag
							};
						});
					})
					.catch(reason => {
						// 失败回调
						console.log(失败);
					});
			}
		}
	};
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}

	/* 轮播图 */
	swiper {
		//background-color: #ffffff;
		width: 100%;
		height: 370rpx;
		margin: 25rpx auto;
		padding-bottom: 30rpx;
		image {
			width: 100%;
			height: 100%;
			border-radius: 35px;
		}
	}

	/* 资讯主体 */
	.news {}

	.img {
		width: 100%;
		height: 100%;
	}

	.newList {
		height: 220rpx;
		background-color: #FFFFFF;
		/* border: 1px solid; */
		margin-top: 15rpx;
		position: relative;
		border-radius: 35rpx;
		overflow: hidden;
	}

	.title {
		position: absolute;
		width: 380rpx;
		height: 130rpx;
		line-height: 45rpx;
		font-size: 29rpx;
		top: 10%;
		left: 2%;
		font-family: PingFangSC-Medium, PingFang SC;
		overflow: hidden;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.time {
		position: absolute;
		bottom: 10%;
		left: 2%;
		font-size: 25rpx;
		color: #999999;
	}

	.newImg {
		height: 185rpx;
		width: 280rpx;
		position: absolute;
		top: 7%;
		right: 2%;
		border-radius: 35rpx;
		overflow: hidden;
	}

	.bottomBar {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999;
	}
</style>
