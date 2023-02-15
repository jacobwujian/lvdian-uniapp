<template>
	<view>
		<uni-nav-bar fixed height="46" leftText="" title="绿电积分认购平台" statusBar leftWidth="44px"
			rightWidth="44px" :rightText="hasLogin?'登录':''" @clickRight="login()"></uni-nav-bar>
		<view class="backGround">
			<image style="width: 100%;height:100%;" src="../../static/img/index/bc.jpg"></image>
		</view>
		<view class="page" @touchstart="start" @touchend="end" @touchmove="move">


			<view class="top" :style="{ height: height }"></view>
			<view class="ccile"></view>

			<!-- 导航栏 -->
			<view class="content">
				<image class="leftIcon" src="/static/img/index/notice-fill.png"></image>
				<span class="leftImg">公告</span>
				<span class="rightIcon">
					<uni-icons type="right" size="24"></uni-icons>
				</span>

				<view :style="{ marginTop: marginTop }">
					<view style="height: 100rpx;margin-bottom: 50rpx;" v-for="(item, index) in swiperActive"
						:key="index" @click="navItemClick(2, item.path)">
						<span class="rightText">{{ item.informationTitle }}</span>
					</view>
					<view style="height: 100rpx;margin-bottom: 50rpx;" v-for="(item, index) in swiperActive"
						:key="index + 10" @click="navItemClick(2, item.path)">
						<span class="rightText">{{ item.informationTitle }}</span>
					</view>
				</view>
			</view>
			<view class="box onliyTop2" style="padding-bottom: 0;height: 250rpx;">
				<swiper style="height: 250rpx;" indicator-dots circular autoplay interval="50000"
					:current="currentIndex" @change="changeC()">
					<swiper-item>
						<view v-if="currentIndex == 0" class="nav onliyTop">
							<view class="nav-item" v-for="(item, index) in navs1" :key="index"
								@click="navItemClick(item.type, item.path)">
								<image :src="item.imgSrc"></image>
								<view class="text">{{ item.text }}</view>
							</view>
						</view>
						<view v-if="currentIndex == 0" class="nav" style="margin-top: -50rpx;">
							<view class="nav-item" v-for="(item, index) in navs2" :key="index"
								@click="navItemClick(item.type, item.path)">
								<image :src="item.imgSrc"></image>
								<view class="text">{{ item.text }}</view>
							</view>
						</view>
					</swiper-item>
					<swiper-item>
						<view v-if="currentIndex == 1" class="nav onliyTop">
							<view class="nav-item" v-for="(item, index) in navs3" :key="index"
								@click="navItemClick(item.type, item.path)">
								<image :src="item.imgSrc"></image>
								<view class="text">{{ item.text }}</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<!-- 顶部图片 -->
			<!-- 			<view class="topImg">
				<swiperModule style="height: 200px;overflow:hidden;" :swiperList="topImgsSrc">
				<swiper class="swiperTop" indicator-dots circular autoplay interval="2000"  style="height: 200px;overflow:hidden;">
					<swiper-item v-for="(item, index) in topImgsSrc" :key="index" @click="swiperClick(item)"><image :src="item.imgUrl"></image></swiper-item>
				</swiper>
					
				</swiperModule></view> -->
			<!-- 活动专区 -->
			<view class="box">
				<view class="title-text">
					活动专区
					<span class="more" @click="toNews()">更多></span>
				</view>
				<!-- <swiperModule style="height: 200px;overflow: hidden" :swiperList="swiperActive"></swiperModule> -->
				<view class="topImg">
					<swiper class="swiperTop" indicator-dots circular autoplay interval="2000"
						style="height: 200px;overflow:hidden;">
						<swiper-item v-for="(item, index) in topImgsSrc" :key="index" @click="swiperClick(item)">
							<image :src="item.imgUrl"></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
			<!-- 最新上架 -->
			<view class="box">
				<view class="title-text">
					最新上架
					<span class="more" @click="toMall('updateTime', true)">更多></span>
				</view>
				<scroll-view scroll-x="true"
					style="height:100px;white-space: nowrap;width: 100%;overflow: hidden;padding-top: 20px;padding-bottom: 20px;">
					<image
						style="height: 98px;width: 98px;border-radius: 20px;margin-right: 15px;box-shadow: 0px 2px 2px #b0b0b0;"
						v-for="(item, index) in swiperNew" :src="item.imgUrl" :key="index"
						@click="swiperDetail(item.path)"></image>
				</scroll-view>
			</view>

			<!-- 热门项目 -->
			<view class="box">
				<view class="title-text">
					热门项目
					<span class="more" @click="toMall('saleAmount', true)">更多></span>
				</view>
				<scroll-view scroll-x="true"
					style=" height:100px;white-space: nowrap;width: 100%;overflow: hidden;padding-top: 20px;padding-bottom: 20px;">
					<image
						style="height: 98px;width: 98px;border-radius: 20px;margin-right: 15px;box-shadow: 0px 2px 2px #b0b0b0;"
						v-for="(item, index) in swiperHot" :src="item.imgUrl" :key="index"
						@click="swiperDetail(item.path)"></image>
				</scroll-view>
			</view>

			<!-- 浮动登录 -->
			<!-- 			<view class="foot" v-if="hasLogin">
				<text>欢迎来到绿电积分认购平台</text>
				<button @click="login()">登录/注册</button>
			</view> -->
		</view>
	</view>
</template>

<script>
	import swiperModule from '@/components/swiper-module/swiper-module.vue';

	export default {
		data() {
			return {
				offsc: 0,
				moveOff: null,
				topImgSrc: '/static/img/index/banner.jpg',
				topImgsSrc: [{
					imgUrl: '/static/img/index/banner.jpg',
					path: ''
				}, {
					imgUrl: '/static/img/index/banner.jpg',
					path: ''
				}],

				navs1: [{
						imgSrc: '/static/img/index/1-1.png',
						text: '认购大厅',
						type: 1,
						path: '/pages/mall/mall'
					},
					{
						imgSrc: '/static/img/index/1-2.png',
						text: '发行排行',
						type: 2,
						path: '/pages/index/publishRank'
					},
					{
						imgSrc: '/static/img/index/1-3.png',
						text: '认购排行',
						type: 2,
						path: '/pages/index/subscribeRank'
					},
					{
						imgSrc: '/static/img/index/1-4.png',
						text: '最新发行',
						type: 3,
						path: '/pages/mall/mall'
					},
					{
						imgSrc: '/static/img/index/2-1.png',
						text: '积分兑换',
						type: 2,
						path: '/pages/mall/components/index'
					}
				],
				navs2: [{
						imgSrc: '/static/img/index/2-4.png',
						text: '公益聚爱',
						type: 2,
						path: '/pages/news/publicWelfareNews'
					},
					{
						imgSrc: '/static/img/index/3-3.png',
						text: '碳排计算',
						type: 2,
						path: '/pages/index/computedCo2'
					},
					{
						imgSrc: '/static/img/index/绿证交易.png',
						text: '绿证交易',
						type: 2,
						path: ''
					},
					{
						imgSrc: '/static/img/index/3-1.png',
						text: '云配储能',
						type: 2,
						path: ''
					},
					{
						imgSrc: '/static/img/index/3-4.png',
						text: '技术交易',
						type: 2,
						path: ''
					}
				],
				navs3: [

					{
						imgSrc: '/static/img/index/2-2.png',
						text: '积分信用',
						type: 2,
						path: ''
					},
					{
						imgSrc: '/static/img/index/2-3.png',
						text: '积分金融',
						type: 2,
						path: ''
					},
					{
						imgSrc: '/static/img/index/3-2.png',
						text: '消纳分析',
						type: 2,
						path: ''
					}
				],
				swiperNew: [{
					imgUrl: '/static/img/index/banner.jpg',
					path: ''
				}, {
					imgUrl: '/static/img/index/banner.jpg',
					path: ''
				}],
				swiperHot: [{
					imgUrl: '/static/img/index/banner.jpg',
					path: ''
				}, {
					imgUrl: '/static/img/index/banner.jpg',
					path: ''
				}],
				swiperActive: [{
					imgUrl: '/static/img/index/banner.jpg',
					path: '',
					informationTitle: ''
				}, {
					imgUrl: '/static/img/index/banner.jpg',
					path: '',
					informationTitle: ''
				}],
				showInfo: '杭州市滨江区封控区、管控区和部分防范区范围内（钱塘山水小区、知本大厦、杭州高新软件园9幢、源越大厦）。',
				inTime: 0,
				nowsNum: 0,
				margint: 0,
				currentIndex: 0
			};
		},
		components: {
			swiperModule: swiperModule
		},
		// 下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onPageScroll(e) {},
		onLoad() {
			this.getNewProject();
			this.getHotProject();
			this.getInformation();
		},
		computed: {
			hasLogin() {
				return !this.$store.state.hasLogin;
			},
			height() {
				return 502 - this.offsc + 'rpx';
			},
			content() {
				return this.showInfo;
			},
			marginTop() {
				return this.margint + 'rpx';
			}
		},
		mounted() {
			let that = this;
			this.inTime = setInterval(that.setInfo, 5000);
		},
		beforeDestroy() {
			clearInterval(this.inTime);
		},
		methods: {
			swiperClick(data) {
				if (data.linkFlag != 1) {
					// 跳资讯详情
					uni.navigateTo({
						url: data.path,
						fail: err => {
							console.error(err);
						}
					});

				} else {
					// 外链
					window.location.href = data.externalLink;
				}
			},
			changeC() {
				if (this.currentIndex == 0) {
					this.currentIndex = 1
				} else {
					this.currentIndex = 0
				}
			},

			setInfo() {
				let that = this;
				if (this.nowsNum < this.swiperActive.length) {
					this.nowsNum++;
					for (let s = 0; s <= 149; s++) {
						setTimeout(() => {
							that.margint--;
						}, 7 * s);
					}
				} else {
					this.nowsNum = 0;
					this.margint = 0;
					this.nowsNum++;
					for (let s = 0; s <= 149; s++) {
						setTimeout(() => {
							that.margint--;
						}, 7 * s);
					}
				}
			},
			start(e) {
				this.offsc = 0;
				this.moveOff = e;
			},
			end(e) {
				this.offsc = 0;
				this.moveOff = null;
			},
			move(e) {
				if (this.offsc > -500) {
					this.offsc = this.moveOff.touches[0].pageY - e.touches[0].pageY;
				}
			},
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
							type: 2,
							// 查询个数
							limit: 5
						}
					})
					.then(value => {
						this.swiperActive = value.data.map(item => {
							return {
								imgUrl: item.informationImgUrl,
								path: `/pages/news/components/newDetails?id=${item.id}`,
								informationTitle: item.informationTitle,
								externalLink: item.externalLink,
								linkFlag: item.linkFlag
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
			toNews() {
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
	}

	// /deep/.uni-nav-bar-text[data-v-6bda1a90] {
	// 	font-size: 40rpx;
	// }

	/deep/ uni-swiper .uni-swiper-wrapper {
		overflow: unset;
	}

	/deep/ uni-swiper-item {
		overflow: unset;
		position: relative;
	}

	// /* 轮播图 */
	.swiperTop {
		width: 100%;
		margin: 25rpx auto;

		image {
			width: 100%;
			height: 100%;
			border-radius: 35px;
		}
	}

	.content {
		position: relative;
		left: 0rpx;
		background-color: rgba(255, 255, 255, 1);
		margin-bottom: 70rpx;
		padding: 5rpx;
		width: 680rpx;
		height: 65rpx;
		line-height: 65rpx;
		border-radius: 15rpx;
		overflow: hidden;

		.leftIcon {
			width: 44rpx;
			height: 44rpx;
			position: relative;
			left: 0rpx;
			top: -0rpx;
		}

		.leftImg {
			background-color: rgb(108, 186, 24);
			color: white;
			font-size: 25rpx;
			padding: 4rpx;
			font-weight: 500;
			width: 70rpx;
			height: 70rpx;
			border-radius: 5rpx;
			position: relative;
			top: -13rpx;
			left: 5rpx;
		}

		.rightText {
			position: relative;
			-webkit-box-orient: vertical;
			left: 120rpx;
			color: #4c4c4c;
			font-size: 30rpx;
			top: -80rpx;
			height: 70rpx;
			line-height: 70rpx;
			width: 400rpx;
			word-break: break-all;
			word-wrap: break-word;
			vertical-align: text-top;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
		}

		.rightIcon {
			position: relative;
			font-size: 60rpx;
			font-weight: 100;
			color: #5e5e5e;
			left: 530rpx;
			top: -1rpx;
		}
	}

	.backGround {
		position: fixed;
		background-color: #5b6abd;

		z-index: -1;
		width: 750rpx;
		height: 1332.5rpx;
	}

	.page {
		margin-top: 0;
		background-color: rgba(0, 0, 0, 0);
	}

	.top {
		// border: 1px solid #000000;
		background-color: rgba(0, 0, 0, 0);
		z-index: -1;
	}

	.box {
		z-index: 99;
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

		.title-text {
			text-shadow: 0px 1px 1px #b0b0b0;
		}

		.nav {
			z-index: 99;
			width: 100%;
			display: flex;
			margin-top: 5rpx;
			margin-right: 100rpx;
			text-align: left;

			.nav-item {
				text-align: center;
				width: 20%;
				margin: 5rpx 10rpx;

				image {
					background-color: #ffffff;
					box-shadow: 0px 1px 1px #b0b0b0;
					border-radius: 50%;
					padding: 10rpx;
					width: 60rpx;
					height: 62rpx;
				}
			}
		}

		.onliyTop {
			position: relative;
			top: -50rpx;
			margin-bottom: 0;
		}
	}

	.onliyTop2 {
		//background: radial-gradient(750rpx 50rpx ellipse at top, transparent 750rpx, rgba(255, 255, 255, 1));
	}

	.text {
		font-size: 20rpx;
	}

	.more {
		font-size: 24rpx;
		margin-left: 450rpx;
		font-weight: 100;
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
