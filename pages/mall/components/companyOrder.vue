<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="交易详情" statusBar>
		</uni-nav-bar>
		<view class="page">
			<!-- 单价数量信息 -->
			<view class="order">
				<!-- 图片 -->
				<view class="order-img">
					<image class="img" :src="goodList.imgUrl" mode=""></image>
				</view>

				<!-- 单价数量 -->
				<view class="order-box">
					<!-- 标题 -->
					<view class="order-box-title">
						{{ goodList.assetSaleName }}
					</view>
					<!-- 单价 -->
					<view class="order-box-price">
						<text>交易单价：
							<text v-if="userType == 0"> ￥{{price}} </text>
						</text>
						<uni-easyinput v-if="userType == 1" class="order-box-price-ipt" v-model="price" type="digit"
							:trim="true" :inputBorder="true"></uni-easyinput>
					</view>
					<!-- 数量 -->
					<view class="order-box-num">
						<text>交易数量：<text v-if="userType == 0">{{num}}</text> </text>
						<uni-number-box ref="number" v-if="userType == 1" v-model="num" :min="10" :step="10"
							:max="goodList.stock" @change="change">
						</uni-number-box>
					</view>
					<!-- 库存 -->
					<view class="order-box-inventory">
						<text v-if="userType == 0">小计：￥{{(num * price).toFixed(2)}}</text>
						<text v-if="userType == 1">库存{{ goodList.stock }}张</text>
					</view>
				</view>

				<!-- 上传协议 -->
				<view class="order-uploadBox" v-if="userType == 1">
					<uni-file-picker class="ceshi" :list-styles="listStyles" title="请选择要上传的协议文件" limit="5"
						v-model="files" fileMediatype="all" @select="select" @delete="deleteFile">
						<button style="margin-left: 250rpx;" type="primary" plain="true" size="mini">上传协议</button>
					</uni-file-picker>
				</view>
			</view>

			<!-- 信息 -->
			<view class="details">
				<view class="details-title">
					商品信息
				</view>
				<!-- 分割线 -->
				<view class="details-hr" />

				<view class="details-info">
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">
							绿电生产最早时间：
						</view>
						<!-- 内容 -->
						<view class="details-info-box-right">
							<!-- {{goodList.resourceChainTime}} -->
							<uni-dateformat :date="goodList.resourceChainTime" format="yyyy-MM-dd hh:mm:ss">
							</uni-dateformat>
						</view>

					</view>
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">
							所属公司：
						</view>
						<!-- 内容 -->
						<view class="details-info-box-right">
							{{goodList.companyName}}
						</view>

					</view>
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">
							能源类型：
						</view>
						<!-- 内容 -->
						<view class="details-info-box-right">
							{{energyTypes[goodList.energyType]}}
						</view>

					</view>
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">
							项目编号：
						</view>
						<!-- 内容 -->
						<view class="details-info-box-right details-info-box-width">
							{{goodList.assetSaleCode}}
						</view>

					</view>
					<view class="details-info-box">
						<!-- 标题 -->
						<view class="details-info-box-left">
							认证等级：
						</view>
						<!-- 内容 -->
						<view class="details-info-box-right">
							<uni-rate :value="goodList.authenticationLevel" size="20" readonly />
						</view>

					</view>
				</view>
			</view>

			<!-- 提交订单 -->
			<view class="buyBox">
				<!-- 统计 -->
				<view class="buyBox-data">
					<view>
						共{{num}}张，合计￥<text>{{(num * price).toFixed(2)}}</text>
					</view>
				</view>
				<!-- 按钮 -->
				<view class="buyBox-btn">
					<button :loading="loading" style="background-color: #6CBA18; color: #fff;"
						@click="submitOrder(userType)">提交订单</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import {
	// 	momentDate
	// } from "../../../utils/tools.js"
	import Tag from "@/components/tag-module/tag-module.vue"
	import {
		energyTypes,
		back
	} from "../../../utils/public.js"
	import {
		BASE_URL
	} from "../../../utils/request.js"
	export default {
		components: {
			Tag
		},
		data() {
			return {
				loading: false,
				energyTypes,
				goodList: [],
				num: 10,
				price: "",
				listStyles: {
					// 是否显示边框
					border: false,
					// 是否显示分隔线
					dividline: false,
					// 线条样式
					borderStyle: {
						width: 1,
						color: 'blue',
						radius: 2
					}
				},
				// 当前要上传的文件
				files: [],
				// 储存上传到服务器返回的文件名
				fileNames: [],
				assetSaleId: "",
				userType: "",
				token: this.$store.state.token,
				flag: false,
				timer: null,
				setTimeNum: 0,
				orderStatus: 0,
				backType: 0,
			}
		},
		created() {
			// 在缓存中取值
			let orderVal = uni.getStorageSync('orderVal');
			this.assetSaleId = orderVal.id
			this.userType = orderVal.userType
			if (this.userType == 0) {
				this.num = orderVal.num
			}

			let orderStatus = uni.getStorageSync('orderStatus');
			this.orderStatus = orderStatus
		},
		mounted() {
			// 数据
			this.getMallDetailData()

			// 订单查询
			if (this.orderStatus == 1) this.selectOrder()

		},

		methods: {
			change(value) {
				this.num = value
			},
			back() {
				if (this.backType == 1) {
					this.$router.go(-2);
				} else {
					back();
				}
			},
			// 个人支付
			toPay() {
				try {
					let orderInfo = uni.getStorageSync('orderInfo');
					if (orderInfo != null && orderInfo != "") {
						let path = orderInfo.mwebUrl

						// #ifdef H5

						let redirectUrl = window.location.origin + `/#/pages/mall/components/companyOrder`
						uni.setStorage({
							key: 'orderStatus',
							data: 1
						});
						window.location.replace(path + '&redirect_url=' + encodeURIComponent(redirectUrl))
						// this.selectOrder()
						// #endif



						// #ifdef MP-WEIXIN
						console.log("微信支付");
						// #endif
					}

				} catch (e) {
					// error
					console.log(e);
				}
			},
			// 订单查询
			selectOrder() {
				this.backType = 1
				// 开启加载
				uni.showLoading({
					title: "查询中",
					mask: true
				})
				this.onComplete()
				this.timer = setInterval(() => {
					this.onComplete()
				}, 2000)
			},
			// 支付后返回页面 准备查订单状态
			onComplete() {
				// flag限制
				if (this.flag) return

				// 查询订单超时,取消查询,并提示信息
				if (this.setTimeNum > 7) {
					// 取消加载动画
					uni.hideLoading();
					this.getPrompt("未检测到付款，请重新提交订单", "none")
					clearInterval(this.timer)
					this.timer = null

					uni.setStorage({
						key: 'orderStatus',
						data: 0
					});
					return
				}
				// 查询订单状态
				this.orderQueryStatus()

			},
			// 查询订单状态
			orderQueryStatus() {
				this.flag = true
				this.setTimeNum++
				let orderInfo = uni.getStorageSync('orderInfo');
				this.$request({
					path: "/api/payment/orderquery", // 路径
					method: "GET", // GET、POST方法
					params: {
						orderId: orderInfo.orderId,
						// outTradeNo: orderInfo.outTradeNo
					} // 参数
				}).then((value) => {
					// 成功回调
					let status = value.status
					if (status == +200) {
						this.getPrompt("购买成功", "success")
						clearInterval(this.timer)
						this.timer = null
						uni.setStorage({
							key: 'orderStatus',
							data: 0
						});
						setTimeout(() => {
							this.toOrder(orderInfo.orderId)
						}, 1500)
					} else {
						this.flag = false
					}
				}).catch((reason) => {
					// 失败回调
					console.log(请求失败);
					// 没查询到购买成功,继续查询
					this.flag = false
				})
			},
			// 获取商品详情
			getMallDetailData() {
				// 开启加载
				uni.showLoading({
					title: "加载中"
				})
				let path = "/api/dataDisplay/homePageAssetSaleDetail"
				this.$request({
					path: path, // 路径
					method: "GET", // GET、POST方法
					params: {
						assetSaleId: this.assetSaleId
					} // 参数
				}).then((value) => {
					// 成功回调
					let data = value.data
					// data.resourceChainTime = momentDate(data.resourceChainTime)
					data.price = (data.price / 1000).toFixed(2)
					this.goodList = data
					this.price = this.goodList.price
				}).catch((reason) => {
					// 失败回调
					console.log(请求失败);
				})
				uni.hideLoading()
			},
			// 选择文件时触发
			select(e) {
				e.tempFiles.forEach(item => {
					this.files.push(item)
					this.uploadFile(item)
				})
			},
			// 上传方法
			async uploadFile(file, index) {
				const that = this;
				await uni.uploadFile({
					url: BASE_URL + '/api/common/oss/upload',
					filePath: file.path,
					name: 'file',
					success: uploadFileRes => {
						let data = JSON.parse(uploadFileRes.data)
						if (data.status == 200) {
							let fileName = JSON.parse(uploadFileRes.data).data;
							// 把返回文件名存到数组中
							that.fileNames.push(fileName)
						} else {
							let fileIndex = this.files.length
							this.files.splice(fileIndex - 1, 1)
							this.getPrompt(data.message, "none")
						}
					},
					fail: (res) => {
						this.getPrompt("上传失败", "none")
					}
				});

			},
			// 删除文件
			deleteFile(e) {
				this.fileNames.splice(e.index, 1)
				let cloudPath = e.tempFile.cloudPath
				this.files.forEach((item, index) => {
					if (item.cloudPath == cloudPath) {
						this.files.splice(index, 1)
					}
				})
			},
			reset() {
				this.files = []
				this.fileNames = []
			},
			async submitOrder(userType) {
				if (userType == 0) {
					// 个人提交订单
					this.toPay()
				} else if (userType == 1) {
					this.loading = true
					// 调用上传方法
					if (this.files.length != 0) {
						this.companyBuy()
					} else {
						this.getPrompt("请选择上传协议文件", "none")
						this.loading = false
					}
				}

			},
			// 企业支付
			async companyBuy() {
				// 发送请求
				await this.$request({
					path: "/api/payment/protocolBuy", // 路径
					method: "POST", // GET、POST方法
					params: {
						assetSaleId: this.goodList.id,
						quantity: this.num * 10,
						price: Number(this.price) * 10 * 10 * 10,
						amount: Number(this.num * this.price) * 10 * 10 * 10 * 10,
						filesUrl: this.fileNames
					}, // 参数
					header: {
						"Authorization": this.token
					}
				}).then((value) => {
					if (value.status == 200) {
						// 成功回调
						this.getPrompt("提交成功", "success")
						this.reset()
						this.toMall()
					} else {
						this.getPrompt(value.message, "error")
					}
					this.loading = false
				}).catch((reason) => {
					// 失败回调
					console.log(请求失败);
				})
			},

			// 交易完成后跳转到认购大厅
			toMall() {
				setTimeout(() => {
					uni.switchTab({
						url: "/pages/mall/mall"
					})
				}, 1500)
			},
			// 提示
			getPrompt(title, icon) {
				uni.showToast({
					title: title,
					icon: icon,
					// 透明蒙层
					mask: true
				})
			},

			// 跳转订单页
			toOrder(orderId) {
				uni.navigateTo({
					url: `/pages/login/mine/jfdd-details?id=` + orderId
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}

	.page {
		padding-bottom: 1px;
		background-color: #F9F9F9;
		// border: 1px solid;
	}

	.img {
		height: 100%;
		width: 100%;
	}

	// 订单
	.order {
		// border: 1px solid;
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 20rpx 15rpx 30rpx 15rpx;
		overflow: hidden;
		border-radius: 25rpx;
		// border: 1px solid;


		&-img {
			// border: 1px solid;
			margin-top: 10rpx;
			margin-left: 10rpx;
			height: 220rpx;
			width: 42%;
			border-radius: 25rpx;
			overflow: hidden;
		}

		&-box {
			margin-top: 10rpx;
			// height: 230rpx;
			width: 54%;

			view {}

			&-title {
				font-size: 30rpx;
				line-height: 40rpx;
			}

			&-price {
				margin-top: 10rpx;
				height: 80rpx;
				/* #ifdef  MP-WEIXIN */
				position: relative;
				/* #endif */

				/* #ifndef  MP-WEIXIN */
				display: flex;
				justify-content: space-between;
				/* #endif */

				text {
					font-size: 28rpx;
					line-height: 70rpx;
					text-align: center;
				}

				/* #ifdef  MP-WEIXIN */
				&-ipt {
					position: absolute;
					top: 0;
					left: 130rpx;
				}

				/* #endif */

			}

			&-num {
				display: flex;
				justify-content: space-between;
				margin-top: 10rpx;

				text {
					font-size: 28rpx;
					line-height: 50rpx;
					text-align: center;
				}
			}

			&-inventory {
				font-size: 25rpx;
				color: #999999;
				float: right;
				margin-top: 10rpx;
				// border: 1px solid;

			}
		}

		&-uploadBox {
			width: 100%;
			margin-top: 50rpx;
		}
	}

	// 信息
	.details {
		background-color: #fff;
		margin: 20rpx 0 150rpx 0;
		padding: 20rpx;
		border-radius: 25rpx;
		overflow: hidden;

		&-hr {
			background: #E0E3DA;
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

	// 提交订单
	.buyBox {
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
		padding: 10rpx 30rpx 10rpx 30rpx;
		display: flex;
		justify-content: space-between;

		&-data {
			position: relative;

			view {
				font-size: 26rpx;
				position: absolute;
				bottom: 0;
				width: 405rpx;
				word-wrap: break-word;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;

				text {
					font-size: 45rpx;
				}
			}
		}

		&-btn {
			width: 280rpx;
		}
	}

	.ceshi {
		// position: absolute;
		// border: 1px solid;
	}
</style>
