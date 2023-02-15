<template>
	<view>
		<uni-nav-bar fixed height="46" title="绿电积分认购平台" statusBar leftWidth="70px" ></uni-nav-bar>
		<view class="page">
			<!-- 顶部图片 -->
			<view class="top"><swiperModule  style="height: 200px;" :swiperList="topImgsSrc"></swiperModule></view>

			<!-- 导航栏 -->
			<view class="box">
				<view class="nav">
					<view class="nav-item" v-for="(item, index) in navs1" :key="index" @click="navItemClick(item.type, item.path)">
						<image :src="item.imgSrc"></image>
						<view class="text">{{ item.text }}</view>
					</view>
				</view>
				<view class="nav">
					<view class="nav-item" v-for="(item, index) in navs2" :key="index" @click="navItemClick(item.type, item.path)">
						<image :src="item.imgSrc"></image>
						<view class="text">{{ item.text }}</view>
					</view>
				</view>
				<view class="nav">
					<view class="nav-item" v-for="(item, index) in navs3" :key="index" @click="navItemClick(item.type, item.path)">
						<image :src="item.imgSrc"></image>
						<view class="text">{{ item.text }}</view>
					</view>
				</view>
			</view>

			<!-- 最新上架 -->
			<view class="box">
				<view class="title-text">
					最新上架
					<span class="more" @click="toMall('updateTime', true)">更多></span>
				</view>
				<scroll-view scroll-x="true" style="height:100px;white-space: nowrap;width: 100%;overflow: hidden;padding-top: 20px;padding-bottom: 20px;">
					<image
						style="height: 100px;width: 100px;border-radius: 20px;margin-right: 15px;"
						v-for="(item, index) in swiperNew"
						:src="item.imgUrl"
						:key="index"
						@click="swiperDetail(item.path)"
					></image>
				</scroll-view>
			</view>

			<!-- 热门项目 -->
			<view class="box">
				<view class="title-text">热门项目
				<span class="more" @click="toMall('saleAmount', true)">更多></span>
				</view>
				<scroll-view scroll-x="true" style=" height:100px;white-space: nowrap;width: 100%;overflow: hidden;padding-top: 20px;padding-bottom: 20px;">
					<image
						style="height: 100px;width: 100px;border-radius: 20px;margin-right: 15px;"
						v-for="(item, index) in swiperHot"
						:src="item.imgUrl"
						:key="index"
						@click="swiperDetail(item.path)"
					></image>
				</scroll-view>
			</view>

			<!-- 活动专区 -->
			<view class="box">
				<view class="title-text">活动专区
				<span class="more" @click="toNews()">更多></span>
				</view>
				<swiperModule style="height: 200px;background-color: white;" :swiperList="swiperActive"></swiperModule>
			</view>

			<!-- 浮动登录 -->
			<view class="foot" v-if="hasLogin">
				<text>欢迎来到绿电积分认购平台</text>
				<button @click="login()">登录/注册</button>
			</view>
		</view>
	</view>
</template>

<script>
import swiperModule from '@/components/swiper-module/swiper-module.vue';

export default {
	data() {
		return {
			topImgsSrc: [{ imgUrl: '/static/img/index/banner.jpg', path: '' }, { imgUrl: '/static/img/index/banner.jpg', path: '' }],
			navs1: [
				{ imgSrc: '/static/img/index/1-1.png', text: '认购大厅', type: 1, path: '/pages/mall/mall' },
				{ imgSrc: '/static/img/index/1-2.png', text: '发行排行', type: 2, path: '/pages/index/publishRank' },				{ imgSrc: '/static/img/index/1-3.png', text: '认购排行', type: 2, path: '/pages/index/subscribeRank' },
				{ imgSrc: '/static/img/index/1-4.png', text: '最新发行', type: 3, path: '/pages/mall/mall' }
			],
			navs2: [
				{ imgSrc: '/static/img/index/2-1.png', text: '积分兑换', type: 2, path: '/pages/mall/components/index' },
				{ imgSrc: '/static/img/index/2-2.png', text: '积分信用', type: 2, path: '' },
				{ imgSrc: '/static/img/index/2-3.png', text: '积分金融', type: 2, path: '' },
				{ imgSrc: '/static/img/index/2-4.png', text: '公益聚爱', type: 2, path: '/pages/news/publicWelfareNews' }
			],
			navs3: [
				{ imgSrc: '/static/img/index/3-1.png', text: '云配储能', type: 2, path: '' },
				{ imgSrc: '/static/img/index/3-2.png', text: '消纳分析', type: 2, path: '' },
				{ imgSrc: '/static/img/index/3-3.png', text: '碳排计算', type: 2, path: '/pages/index/computedCo2' },
				{ imgSrc: '/static/img/index/3-4.png', text: '技术交易', type: 2, path: '' }
			],
			swiperNew: [{ imgUrl: '/static/img/index/banner.jpg', path: '' }, { imgUrl: '/static/img/index/banner.jpg', path: '' }],
			swiperHot: [{ imgUrl: '/static/img/index/banner.jpg', path: '' }, { imgUrl: '/static/img/index/banner.jpg', path: '' }],
			swiperActive: [{ imgUrl: '/static/img/index/banner.jpg', path: '' }, { imgUrl: '/static/img/index/banner.jpg', path: '' }]
		};
	},
	components: {
		swiperModule: swiperModule
	},
	// 下拉刷新
	onPullDownRefresh() {
		console.log('触发下拉刷新');
		uni.stopPullDownRefresh();
	},
	onLoad() {
		this.getNewProject();
		this.getHotProject();
		this.getInformation();
	},
	computed: {
		hasLogin() {
			return !this.$store.state.hasLogin;
		}
	},
	methods: {
		swiperDetail(path) {
			if (this.hasLogin) {
				this.login();
			} else {
				uni.navigateTo({
					url: path,
					fail: err => {
						console.error(err);
					}
				});
			}
		},
		login() {
			uni.switchTab({
				url: '/pages/login/index'
			});
		},
		// 导航栏跳转
		navItemClick(type, path) {
			if (path === '') {
				uni.showToast({
					title: '该功能暂未开放，敬请期待！',
					icon: 'none',
					mask: true,
					duration: 2000
				});
			} else {
				// 导航页跳转
				if (type === 1) {
					uni.switchTab({
						url: path
					});
				}
				// 详情页跳转
				if (type === 2) {
					uni.navigateTo({
						url: path
					});
				}
				if (type === 3) {
					this.toMall('resourceChainTime', true);
				}
			}
		},
		// 获取最新上架
		getNewProject() {
			let userType = 0;

			let token = uni.getStorageSync('token');
			if (token != null && token != '') {
				userType = 1;
			}
			this.$request({
				path: '/api/dataDisplay/getNewProject?pageSize=5&pageNum=1&projectType=',
				method: 'GET'
			})
				.then(value => {
					this.swiperNew = value.data.list.map(item => {
						return {
							imgUrl: item.imgUrl,
							path: `/pages/mall/components/companyMallDetails?id=${item.id}&&type=${userType}`
						};
					});
				})
				.catch(reason => {
					console.error(reason);
				});
		},
		// 获取热门项目
		getHotProject() {
			let userType = 0;
			let token = uni.getStorageSync('token');
			if (token != null && token != '') {
				userType = 1;
			}
			this.$request({
				path: '/api/dataDisplay/getHotProject?pageSize=5&pageNum=1&projectType=',
				method: 'GET'
			})
				.then(value => {
					this.swiperHot = value.data.list.map(item => {
						return {
							imgUrl: item.imgUrl,
							path: `/pages/mall/components/companyMallDetails?id=${item.id}&&type=${userType}`
						};
					});
				})
				.catch(reason => {
					console.error(reason);
				});
		},
		// 获取活动专区
		getInformation() {
			this.$request({
				path: '/api/activity/showAllActivityImgUrl',
				method: 'GET',
				params: {
					// 活动图片:3  资讯图片:4
					type: 3,
					// 查询个数
					limit: 5
				}
			})
				.then(value => {
					this.swiperActive = value.data.map(item => {
						return {
							imgUrl: item.informationImgUrl,
							path: `/pages/news/components/newDetails?id=${item.id}`
						};
					});
					this.topImgsSrc = this.swiperActive;
				})
				.catch(reason => {
					console.error(reason);
				});
		},
		toMall(name, sqc) {
			uni.setStorageSync('sortName', name);
			uni.setStorageSync('sequence', sqc);
			uni.switchTab({
				url: `/pages/mall/mall`
			});
		},
		toNews(){
			uni.switchTab({
				url: `/pages/news/news`
			});
		}
	}
};
</script>

<style lang="scss">
page {
	margin-top: 0;
	background-color: #f9f9f9;
}
/deep/.uni-nav-bar-text[data-v-6bda1a90]{
	font-size: 40rpx;
}
.page {
	margin-top: 0;
	background-color: #f9f9f9;
}
.top {
	// border: 1px solid #000000;
	height: 370rpx;
	image {
		width: 700rpx;
		height: 370rpx;
		border-radius: 0 0 10rpx 10rpx;
	}
}
.box {
	// border: 1px solid #007AFF;
	box-shadow: 0px 1px 1px #b0b0b0;

	margin-top: 30rpx;
	background-color: #ffffff;
	border-radius: 10px;
	padding-left: 20rpx;
	padding-right: 20rpx;
	padding-bottom: 20rpx;
	padding-top: 1rpx;
	.text {
		font-family: PingFangSC;
		font-weight: 400;
		font-size: 24rpx;
		color: rgb(16, 16, 16);
		font-style: normal;
		letter-spacing: 0px;
		line-height: 34rpx;
		text-decoration: none;
	}
	.nav {
		display: flex;
		margin-top: 10rpx;
		.nav-item {
			text-align: center;
			width: 25%;
			margin: 15rpx auto;
			image {
				box-shadow: 0px 1px 1px #b0b0b0;
				border-radius: 50%;
				padding: 10rpx;
				width: 60rpx;
				height: 62rpx;
			}
		}
	}
}
.text {
	font-size: 20rpx;
}
.more {
	font-size: 12px;
	margin-left: 450rpx;
	color: #b5b5b5;
}
.foot {
	// border: 1px solid #000000;
	display: flex;
	width: 750rpx;
	height: 114rpx;
	position: fixed;
	// #ifdef H5
	bottom: 50px;
	// #endif
	// #ifndef H5
	bottom: 0px;
	// #endif
	left: 0px;
	background-color: rgba(104, 102, 102, 0.5);
	z-index: 5;
	text {
		opacity: 1;
		z-index: 6;
		margin: auto;
		text-align: center;
		color: rgba(255, 255, 255, 1);
		font-size: 40rpx;
	}
	button {
		opacity: 1;
		width: 94px;
		height: 34px;
		z-index: 6;
		margin: 20rpx auto;
		border-radius: 10px;
		border-color: rgb(187, 187, 187);
		border-width: 1px;
		border-style: solid;
		text-align: center;
		font-size: 14px;
		color: #ffffff;
		background-color: rgb(108, 186, 24);
		text-align: center;
		font-weight: normal;
		font-style: normal;
	}
}
</style>
