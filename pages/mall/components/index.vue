<template>
	<view>
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="积分商城"
			  statusBar></uni-nav-bar>
		<view class="page">
			<view>
				<view name="积分商城"></view>
			</view>
			<view class="page-wrap">
				<Adverts></Adverts>
				<view>
					<view class="search">
						<uni-search-bar bgColor="#FFFFFF" v-model="assetSaleName" :radius="25" placeholder="请输入优惠券名称"
							@confirm="onSearch" @clear="cancel" cancelButton="none"></uni-search-bar>
						<!-- @cancel="cancel" -->
					</view>
				</view>
				<view>
					<view v-for="(item, index) in dataList" :key="index" @click="onDetails(item.id)" class="list-item">
						<view class="list-item-top">
							<image style="width: 166px;height: 123px;" :src="item.voucherImgUrl" mode=""></image>
						</view>
						<view class="list-item-con">
							<view class="list-item-con-project">
								<view class="list-item-con-project-name">{{ item.voucherName }}</view>
							</view>
							<view class="list-item-con-bottom">
								<view class="list-item-con-bottom-price">
									<span>{{ item.voucherRequiredPoints }}</span>
									<span>{{ `绿电积分` }}</span>
								</view>
								<view class="list-item-con-bottom-stock">{{ `待兑` + item.voucherInventory + `张` }}</view>
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
	import Adverts from '@/components/Adverts.vue';
	import { back } from '@/utils/public.js';
	export default {
		components: {
			Adverts
		},
		data() {
			return {
				dataList: [],
				assetSaleName: '',
				loading: false,
				finished: false,
				pageSize: 10,
				pageNum: 0,
				total: '',
				isLoading: false,
				rbm: true
			};
		},
		// 上拉触底
		onReachBottom() {
			if (this.rbm) this.getVoucherHomeShow();
		},
		methods: {
			// 取消
			cancel() {
				this.init();
				this.getVoucherHomeShow();
			},
			back() {
				back()
			},
			onLoad() {
				this.getVoucherHomeShow();
			},
			async getVoucherHomeShow(type) {
				this.isLoading = true;
				if (!this.loading) {
					//开始异步请求
					this.loading = true;
					this.pageNum++;
					let {
						pageSize,
						pageNum,
						assetSaleName
					} = this;
					let params = {
						pageSize,
						pageNum,
						assetSaleName
					};
					const res = await this.$request({
						path: '/api/show/VoucherHomeShow', // 路径
						method: 'GET', // GET、POST方法
						params: params // 参数
					});
					// 异步加载状态结束
					this.loading = false;
					this.isLoading = false;
					if (!res.data) {
						this.finished = true
						this.dataList = []
						return
					}
					const data = res.data.list;
					if (type == "search") {
						this.dataList = data
					} else {
						this.dataList = this.dataList.concat(data);
					}
					this.total = res.data.total;
					// 数据全部加载完成
					if (this.dataList.length >= this.total) {
						this.rbm = false;
					}
				}
			},
			onSearch() {
				console.log(111);
				this.getVoucherHomeShow("search");
			},
			init() {
				this.dataList = [];
				this.pageSize = 10;
				this.pageNum = 0;
				this.assetSaleName = '';
				this.total = 0;
				this.finished = false;
			},
			// 跳到详情
			onDetails(id) {
				if (this.$store.state.hasLogin && !this.$store.state.token) {} else {
					uni.showModal({
						content: '抱歉，目前只有个人用户登录才可以兑换！',
						showCancel: false
					});
					return;
				}
				uni.navigateTo({
					url: `/pages/mall/components/djj-details?id=${id}`
				})
			}
		}
	};
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}

	.list {
		display: flex;
		justify-content: space-between;

		&-item {
			display: inline-block;
			margin-left: 16rpx;
			width: 332rpx;
			// padding: 12px;
			background: #ffffff;
			margin-bottom: 10px;
			border-radius: 10px;

			&-top {
				width: 332rpx;
				height: 123px;
				border-radius: 10px;
				overflow: hidden;
				margin-right: 12px;

				img {
					width: 166px;
					height: 123px;
					overflow: hidden;
					vertical-align: top;
				}
			}

			&-con {
				padding: 10px 8px;

				&-project {
					display: flex;
					align-items: center;
					margin-bottom: 6px;

					&-name {
						width: 138px;
						display: inline-block;
						font-size: 14px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #222222;
						line-height: 18px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				&-date {
					font-size: 11px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #555555;
					line-height: 16px;
					margin-bottom: 6px;
				}

				&-bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;

					&-price {
						font-size: 11px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #6cba18;
						line-height: 18px;

						&>span:first-child {
							font-size: 18px;
							margin-right: 5px;
						}
					}

					&-stock {
						font-size: 11px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #666666;
						line-height: 16px;
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
