<template>
	<view>
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="商品详情"  
			statusBar>
		</uni-nav-bar>

		<!-- 企业用户查看商品详情 -->
		<view class="page">
			<!-- 图片 -->
			<view class="goods">
				<!-- 图片 -->
				<view class="goods-imgBox">
					<image class="img" :src="goodList.imgUrl" mode=""></image>
				</view>

				<!-- 信息 -->
				<view class="goods-info">
					<!-- 标题 -->
					<view class="goods-info-title">{{ goodList.assetSaleName }}</view>

					<!-- 单价 -->
					<view class="goods-info-price">
						<!-- 单价 -->
						<view class="goods-info-price-num">
							<!-- 标签 -->
							<Tag :typeObj="energyTypes" :typeNum="goodList.energyType"></Tag>
							<!-- 单价 -->
							<text>￥{{ goodList.price }}</text>
						</view>
						<!-- 库存 -->
						<view class="goods-info-price-inventory">库存{{ goodList.stock }}张</view>
					</view>
				</view>
			</view>

			<!-- 商品信息 -->
			<view class="details">
				<view class="details-title">商品信息</view>
				<!-- 分割线 -->
				<view class="details-hr" />

				<view class="details-info">
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">绿电生产最早时间：</view>
						<!-- 内容 -->
						<view class="details-info-box-right">
							<uni-dateformat :date="goodList.resourceChainTime" format="yyyy-MM-dd hh:mm:ss">
							</uni-dateformat>
						</view>
					</view>
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">所属公司：</view>
						<!-- 内容 -->
						<view class="details-info-box-right">{{ goodList.companyName }}</view>
					</view>
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">能源类型：</view>
						<!-- 内容 -->
						<view class="details-info-box-right">{{ energyTypes[goodList.energyType] }}</view>
					</view>
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">项目编号：</view>
						<!-- 内容 -->
						<view class="details-info-box-right details-info-box-width">{{ goodList.assetSaleCode }}</view>
					</view>
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">认证等级：</view>
						<!-- 内容 -->
						<view class="details-info-box-right">
							<uni-rate :value="goodList.authenticationLevel" size="20" readonly />
						</view>
					</view>
					<!-- 区别展示 -->
					<view class="" v-if="userType == 1">
						<view class="details-info-box">
							<!-- 标题 -->
							<view class="details-info-box-left">特殊说明：</view>
							<!-- 内容 -->
							<view class="details-info-box-right details-info-box-width">
								<view class="">1、{{ goodList.projectDesc }}</view>
								<view class="">2、{{ '提交订单时，请上传签字盖章后的有效凭证（包含协议与付款记录等）' }}</view>
							</view>
						</view>

						<!-- 下载协议 -->
						<view class="details-info-box">
							<view class="details-info-box-left"></view>
							<view class="details-info-box-right"><button size="mini" type="primary" plain="true"
									@click="load">下载协议</button></view>
						</view>
					</view>
				</view>
			</view>

			<!-- 购买 -->
			<view class="buyBox">
				<!-- 说明 -->
				<view class="buyBox-title">绿电积分购买后不支持退换，请您按需购买</view>
				<!-- 按钮 -->
				<button style="background-color: #6CBA18; color: #fff;" @click="toBuy(userType, num)">去购买</button>
			</view>

			<!-- 弹出层 -->
			<uni-popup ref="popup" type="bottom" background-color="#fff" v-if="userType == 0">
				<view class="operationPanel">
					<!-- 标题 -->
					<view class="operationPanel-title">请选择兑换数量</view>

					<!-- 信息 -->
					<view class="operationPanel-info">
						<!-- 图片 -->
						<view class="operationPanel-info-img">
							<image class="img" :src="goodList.imgUrl" mode=""></image>
						</view>

						<!-- 信息 -->
						<view class="operationPanel-info-box">
							<!-- 单价 -->
							<view class="operationPanel-info-box-price">
								￥
								<text>{{ goodList.price }}</text>
							</view>
							<!-- 库存 -->
							<view class="operationPanel-info-box-inventory">库存{{ goodList.stock }}张</view>
							<!-- 交易数量 -->
							<view class="operationPanel-info-box-num">
								<uni-number-box v-model="num" :min="1" :max="999999999"></uni-number-box>
							</view>
						</view>
					</view>

					<!-- btn -->
					<view class="operationPanel-btn">
						<button :loading="orderLoading" style="background-color: #6CBA18; color: #fff;"
							@click="makeOrder(userType, num)">确定</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	// import { momentDate } from '../../../utils/tools.js';
	import Tag from '@/components/tag-module/tag-module.vue';
	import {
		energyTypes,
		back
	} from '../../../utils/public.js';
	import {
		FONT_BASE_URL
	} from '../../../utils/request.js';
	export default {
		components: {
			Tag
		},
		data() {
			return {
				assetSaleId: '',
				goodList: [],
				energyTypes,
				userType: 0,
				num: 1,
				orderId: null,
				orderLoading: false,
				userInfoStatus: ""
			};
		},
		onLoad(option) {
			// 获取
			if (option) {
				this.assetSaleId = option.id;
				this.userType = option.type;
			}
		},
		created() {
			let userInfo = uni.getStorageSync('userInfo');
			if(userInfo.status!=undefined){
				 this.userInfoStatus = userInfo.status
			}else{
				this.userInfoStatus = 1
			}
		},
		mounted() {
			this.getMallDetailData();
		},
		methods: {
			// 提示
			getPrompt(title, icon) {
				uni.showToast({
					title: title,
					icon: icon,
					// 透明蒙层
					mask: true
				})
			},
			back() {
				back();
			},
			// 微信支付
			orderPay() {
				// 获取userId
				let userId = '';
				uni.getStorage({
					key: 'userId',
					success: res => {
						userId = res.data;
					}
				});
				// 获取参数
				let params = {
					assetSaleId: this.goodList.id,
					quantity: this.num,
					price: this.goodList.price * 100,
					amount: (this.num * this.goodList.price).toFixed(2) * 100,
					userDto: {
						userId: userId
					}
				};
				// 生成订单
				this.$request({
						path: '/api/payment/orderPay',
						method: 'POST',
						params: params
					})
					.then(value => {
						// 返回值存入缓存
						uni.setStorage({
							key: 'orderInfo',
							data: value.data
						});
					})
					.catch(reason => {
						console.log(reason);
					});
			},
			// 销毁上一条订单
			rollback() {
				// 后端销毁上一条订单方法什么也没做
				try {
					// 获取orderId
					let orderInfo = uni.getStorageSync('orderInfo');
					if (orderInfo != null && orderInfo != '') {
						let orderId = orderInfo.orderId;
						let path = '/api/payment/rollback';
						let params = {
							orderId: orderId
						};
						this.$request({
							path: path,
							method: 'GET',
							params: params
						});
					}
				} catch (e) {
					console.log(e);
				}
			},
			// 生成订单
			makeOrder(userType, num) {
				this.orderLoading = true;
				// 销毁上一条订单
				this.rollback();
				// 微信支付
				this.orderPay();

				// 在缓存中存值
				let goodId = this.goodList.id;
				uni.setStorage({
					key: 'orderVal',
					data: {
						id: goodId,
						userType: userType,
						num: num
					}
				});

				// 跳转订单页
				setTimeout(() => {
					// let navData = this.goodList.id;
					this.orderLoading = false;
					uni.navigateTo({
						url: `./companyOrder`,
						// ?navData=${navData}&userType=${userType}&num=${num}
					});
				}, 1000);
			},
			// 跳转详情页
			toBuy(userType, num) {
				// 判断当前账户是否审核通过
				if (this.userInfoStatus != 1 || this.userInfoStatus == 0 || this.userInfoStatus == 3) {
					return this.getPrompt("没有已启用的账号用于交易","none")
				} else {
					try {
						let hasLogin = uni.getStorageSync('hasLogin');
						if (hasLogin == true) {
							if (userType == 1) {
								// 企业
								// let navData = this.goodList.id;
								// uni.navigateTo({
								// 	url: `./companyOrder?navData=${navData}&userType=${userType}&num=${num}`
								// });

								// 在缓存中存值
								let goodId = this.goodList.id;
								uni.setStorage({
									key: 'orderVal',
									data: {
										id: goodId,
										userType: userType,
										num: num
									}
								});

								uni.navigateTo({
									url: `./companyOrder`
								});
							} else {
								// 个人购买
								this.$refs.popup.open('bottom');
							}
						} else {
							// 未登录跳登录页面
							uni.switchTab({
								url: '../../login/index'
							});
						}
					} catch (e) {
						// error
						console.log(e);
					}
				}

			},
			// 下载协议
			load() {
				// #ifdef H5
				window.open(FONT_BASE_URL + `/static/green-card-remove.docx`);
				// #endif
				// #ifdef APP || MP-WEIXIN
				uni.downloadFile({
					url: FONT_BASE_URL + `/static/green-card-remove.docx`,
					success: res => {
						if (res.statusCode === 200) {
							uni.openDocument({
								filePath: res.tempFilePath,
								fileType: 'doc'
							});
						}
					}
				});
				// #endif
			},
			// 获取商品详情
			getMallDetailData() {
				// 开启加载
				uni.showLoading({
					title: '加载中'
				});
				let path = '/api/dataDisplay/homePageAssetSaleDetail';
				this.$request({
						path: path, // 路径
						method: 'GET', // GET、POST方法
						params: {
							assetSaleId: this.assetSaleId
						} // 参数
					})
					.then(value => {
						// 成功回调
						let data = value.data;
						// data.resourceChainTime = momentDate(data.resourceChainTime);
						data.price = (data.price / 1000).toFixed(2);
						this.goodList = data;
					})
					.catch(reason => {
						// 失败回调
						console.log(请求失败);
					});
				uni.hideLoading();
			}
		}
	};
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}

	.page {
		background-color: #F9F9F9;
		padding-bottom: 1px;
	}

	.img {
		height: 100%;
		width: 100%;
	}

	/* 商品 */
	.goods {
		background-color: #fff;
		padding-bottom: 10rpx;
		border-radius: 25rpx;
		overflow: hidden;

		&-imgBox {
			height: 500rpx;
			border-radius: 25rpx;
			overflow: hidden;
		}

		&-info {
			padding-left: 30rpx;
			padding-right: 10rpx;
			line-height: 70rpx;

			&-title {}

			&-price {
				display: flex;
				justify-content: space-between;

				&-num {
					display: flex;

					text {
						font-size: 38rpx;
						color: #6aaf20;
					}
				}

				&-inventory {
					color: #999999;
					font-size: 26rpx;
				}
			}
		}
	}

	/* 信息 */
	.details {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 20rpx;
		margin-bottom: 150rpx;
		border-radius: 25rpx;
		overflow: hidden;

		&-hr {
			background: #e0e3da;
			height: 5rpx;
			margin-top: 20rpx;
		}

		&-info {
			&-box {
				font-size: 28rpx;
				margin-top: 30rpx;
				display: flex;
				justify-content: space-between;

				&-left {
					width: 260rpx;
				}

				&-right {
					word-wrap: break-word;
				}

				&-width {
					width: 390rpx;
				}
			}
		}
	}

	// 购买
	.buyBox {
		background-color: #F9F9F9;
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;

		view {
			font-size: 22rpx;
			line-height: 40rpx;
			text-align: center;
			color: #999999;
		}
	}

	// 操作面板
	.operationPanel {
		&-title {
			margin-top: 10rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 40rpx;
			font-weight: 500;
		}

		&-info {
			display: flex;
			padding: 10rpx 20rpx 15rpx 15rpx;

			&-img {
				height: 180rpx;
				width: 230rpx;
				border-radius: 25rpx;
				overflow: hidden;
			}

			&-box {
				margin-left: 25rpx;
				height: 180rpx;

				view {
					line-height: 60rpx;
				}

				&-price {
					color: #6aaf20;
					font-size: 25rpx;

					text {
						font-size: 35rpx;
					}
				}

				&-inventory {
					font-size: 25rpx;
				}
			}
		}

		&-btn {
			height: 100rpx;
		}
	}
</style>
