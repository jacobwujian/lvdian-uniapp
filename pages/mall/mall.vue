<template>
	<view>
		<uni-nav-bar fixed height="46" left-text="认购大厅"  statusBar></uni-nav-bar>
		<view class="page">
			<!-- 分类查找 -->
			<!-- 		<view class="group">
			<button @click="open">发电类型</button>
			<button @click="open">筛选</button> -->
			<!-- 弹出 -->
			<!-- <uni-popup class="group-pop" ref="popup" type="top" background-color="#fff"> -->
			<!-- 发电 -->
			<!-- 				<view class="group-pop-power" @click="close">
					<view class="group-pop-power-list" v-for="item in energyTypes">
						{{ item }}
					</view>
				</view> -->
			<!-- 筛选 -->
			<!-- 			</uni-popup>
		</view>
 -->
			<Adverts></Adverts>
			<!-- 搜索 -->
			<view class="search">
				<uni-search-bar
					bgColor="#FFFFFF"
					v-model="assetSaleName"
					:radius="25"
					placeholder="请输入项目名称"
					@confirm="search"
					@clear="cancel"
					cancelButton="none"
				></uni-search-bar>
				<!-- @cancel="cancel" -->
			</view>
			<view class="selectBox">
				<easySelect size="mini" :value="sortName" :options="typeList" @selectOne="selectOne" />

				<span :style="{ color: colorText1 }" @click="sortView(true)">
					降序排列
					<image v-if="sequence" style="width: 48rpx; height: 48rpx;position: relative;top:12rpx" mode="scaleToFill" src="../../static/img/mall/desc2.png"></image>
					<image v-else style="width: 48rpx; height: 48rpx;top:12rpx;position: relative;" mode="scaleToFill" src="../../static/img/mall/desc1.png"></image>
				</span>
				<span :style="{ color: colorText }" @click="sortView(false)">
					升序排列
					<image v-if="sequence" style="width: 48rpx; height: 48rpx;position: relative;top:12rpx" mode="scaleToFill" src="../../static/img/mall/asc1.png"></image>
					<image v-else style="width: 48rpx; height: 48rpx;position: relative;top:12rpx" mode="scaleToFill" src="../../static/img/mall/asc2.png"></image>
				</span>
			</view>
			<!-- 商品 -->
			<view class="product">
				<view class="product-list" v-for="item in assetList" @click="toDetails(item.id, userType)">
					<!-- 图片 -->
					<view class="product-list-img"><image :style="{ width, height, borderRadius }" :src="item.imgUrl" mode=""></image></view>

					<!-- 信息 -->
					<view class="product-list-box">
						<!-- 标题 -->
						<view class="product-list-box-title">
							<view class="product-list-box-title-tag"><Tag :typeNum="item.energyType" :typeObj="energyTypes"></Tag></view>
							<text>{{ item.assetSaleName }}</text>
						</view>

						<!-- 时间 -->
						<view class="product-list-box-time">
							最早生产时间：
							<uni-dateformat :date="item.createTime" format="yyyy-MM-dd"></uni-dateformat>
						</view>

						<!-- 评分 -->
						<view class="product-list-box-grade"><uni-rate :value="item.authenticationLevel" size="20" readonly /></view>

						<!-- 价格 -->
						<view class="product-list-box-price">
							<!-- 单价 -->
							<view class="product-list-box-price-num">
								￥
								<text>{{ item.price }}</text>
							</view>

							<!-- 库存 -->
							<view class="product-list-box-price-repertory">库存{{ item.stock }}张</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 上拉触底结束栏 -->
			<view class="bottomBar" v-if="this.rbm == false">已经到底了哦~</view>
		</view>
	</view>
</template>

<script>
import Tag from '@/components/tag-module/tag-module.vue';
import { energyTypes } from '../../utils/public.js';
import Adverts from '@/components/Adverts.vue';
import easySelect from '@/components/easy-select/easy-select.vue';
export default {
	components: {
		Tag,
		Adverts,
		easySelect
	},
	props: {
		width: {
			default: '100%'
		},
		height: {
			default: '100%'
		},
		borderRadius: {
			default: '10px'
		}
	},
	data() {
		return {
			assetList: [],
			pageSize: 10,
			pageNum: 0,
			assetSaleName: '',
			projectType: '',
			userType: 0, //0：个人  1：企业
			total: '',
			energyTypes,
			projectType: '',
			// 控制上拉触底
			rbm: true,
			sortName: 'updateTime',
			sequence: true,
			cancelText: '',
			typeList: [
				{
					label: '更新时间',
					value: 'updateTime'
				},
				{
					label: '最早生产时间',
					value: 'resourceChainTime'
				},
				{
					label: '库存数量',
					value: 'stock'
				},
				{
					label: '单价',
					value: 'price'
				},
				{
					label: '销量',
					value: 'saleAmount'
				}
			]
		};
	},
	onShow() {
		if (uni.getStorageSync('sortName')) {
			this.sortName = uni.getStorageSync('sortName');
			uni.setStorageSync('sortName', null);
		}
		if (uni.getStorageSync('sequence')) {
			this.sequence = uni.getStorageSync('sequence');
			uni.setStorageSync('sequence', null);
		}
		this.pageNum = 0;

		this.getData();
	},
	onHide() {
		this.init();
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.init();
		this.getData();
		// 取消刷新
		uni.stopPullDownRefresh();
	},
	// 上拉触底
	onReachBottom() {
		if (this.rbm) this.getAssetList();
	},
	computed: {
		colorText() {
			return this.sequence ? '#000000' : '#1296DB';
		},
		colorText1() {
			return this.sequence ? '#1296DB' : '#000000';
		}
	},
	methods: {
		selectOne(options) {
			this.sortName = options.value;
			this.search();
		},
		sortView(squce) {
			this.pageNum = 0;
			this.sequence = squce;
			this.search();
		},
		// 等待
		onLoading() {
			uni.showLoading({
				title: '加载中'
			});
		},
		// 第一方法
		getData() {
			try {
				let hasLogin = uni.getStorageSync('hasLogin');
				if (hasLogin == true) {
					// 检查 token
					let token = uni.getStorageSync('token');
					if (token != null && token != '') {
						this.projectType = 1;
						this.userType = 1;
						// 电厂展示
						this.getAssetList();
					} else {
						// 手机用户展示
						this.getAssetList();
					}
				} else {
					// 未登录展示
					this.getAssetList();
				}
			} catch (e) {
				console.log(e);
			}
		},
		// 跳转详情页
		toDetails(id, type) {
			let navData = id;
			uni.navigateTo({
				url: `./components/companyMallDetails?id=${navData}&type=${type}`
			});
		},
		// pop 开关
		close() {
			this.$refs.popup.close('top');
		},
		open() {
			this.$refs.popup.open('top');
		},
		// 取消
		cancel() {
			this.init();
			this.getAssetList();
		},
		// 搜索
		search() {
			this.rbm = true;
			this.pageNum = 0;
			this.getAssetList('search');
		},
		// 重置
		init() {
			this.assetList = [];
			this.pageSize = 10;
			this.pageNum = 0;
			this.assetSaleName = '';
			this.projectType = '';
			this.userType = 0;
			this.total = '';
			this.rbm = true;
		},
		// 获取商品数据
		getAssetList(type) {
			this.onLoading();
			let path = '/api/dataDisplay/homePageAssetSale';
			this.pageNum++;
			let { pageSize, pageNum, assetSaleName, projectType, sortName, sequence } = this;
			let ssc = sequence ? 'true' : 'false';
			let params = {
				pageSize,
				pageNum,
				assetSaleName,
				projectType,
				sortName,
				sequence: ssc
			};
			this.$request({
				path: path, // 路径
				method: 'GET', // GET、POST方法
				params: params // 参数
			})
				.then(value => {
					setTimeout(() => {
						uni.hideLoading();
					}, 200);
					// 成功回调
					let list = value.data.list;
					list.map(item => {
						if (item.price) item.price = (item.price / 1000).toFixed(2);
					});
					// 判断搜索type
					if (type == 'search') {
						this.assetList = list;
					} else {
						this.assetList = this.assetList.concat(list);
					}
					if (this.assetList.length >= value.data.total) {
						// 停止上拉触底
						this.rbm = false;
					}
				})
				.catch(reason => {
					// 失败回调
					console.log('请求失败');
				});
		}
	}
};
</script>

<style lang="less">
page {
	background-color: #f9f9f9;
}

// 搜索
.search {
	margin-top: -20rpx;
}

.selectBox {
	background-color: #ffffff;
	border-radius: 15rpx;
	height: 70rpx;
	line-height: 70rpx;

	select {
		margin-left: 16rpx;
		margin-right: 16rpx;
		height: 60rpx;
		line-height: 60rpx;
		border: 0;
		font-size: 14px;
		background-color: #ffffff;
		color: #888;
	}

	span {
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 50rpx;
		font-family: PingFangSC;
		font-weight: 400;
		font-size: 14px;
		font-style: normal;
		letter-spacing: 0px;
		line-height: 20px;
		text-decoration: none;
	}

	.svg-icon-path-icon {
		position: relative;
		top: 10rpx;
	}
}

// 分类
.group {
	button {
		display: inline-block;
		width: 50%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 30rpx;
	}

	&-pop {
		&-power {
			&-list {
				border: 1px solid;
				line-height: 100rpx;
				padding-left: 4%;
				font-size: 28rpx;
			}
		}
	}
}

// 商品
.product {
	&-list {
		padding: 15rpx;
		background-color: #ffffff;
		margin-top: 20rpx;
		border-radius: 25rpx;
		display: flex;

		&-img {
			width: 290rpx;
			height: 240rpx;
			border-radius: 25rpx;
			overflow: hidden;
		}

		&-box {
			line-height: 65rpx;
			margin-left: 15rpx;
			width: 385rpx;
			height: 240rpx;
			&-title {
				display: flex;

				view {
					margin-right: 10rpx;
				}

				text {
					width: 270rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			&-time {
				font-size: 25rpx;
			}

			&-price {
				display: flex;
				justify-content: space-between;

				&-num {
					font-size: 38rpx;
					color: #6aaf20;
				}

				&-repertory {
					font-size: 25rpx;
				}
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
