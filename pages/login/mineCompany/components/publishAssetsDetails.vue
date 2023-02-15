<!-- 发布资产详情 -->
<template>
	<view class="">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed :left-text="leftText" leftWidth="150px">
		</uni-nav-bar>
		<view class="page">
			<!-- 项目信息 -->
			<view class="product">
				<!-- 产品 -->
				<view class="product-box">
					<!-- 图片 -->
					<view class="product-box-img">
						<image class="img" :src="assetsDetailList.imgUrl" mode=""></image>
					</view>
					<!-- 描述 -->
					<view class="product-box-des">
						<view class="product-box-des-title">
							{{companyInfo.projectName}}
						</view>
						<view class="product-box-des-type">
							能源类型：{{energyTypes[companyInfo.energyType]}}
						</view>
						<view class="product-box-des-score">
							<text>项目能源等级：</text>
							<view class="">
								<uni-rate :value="companyInfo.authenticationLevel" size="20" readonly />
							</view>
						</view>
					</view>
				</view>
				<!-- 信息 -->
				<view class="product-info">
					<view class="product-info-box">
						<text>统一社会信用代码：</text>
						<view class="product-info-box-cCode">
							{{companyInfo.socialCreditCode}}
						</view>
					</view>
					<view class="product-info-box">
						<text>企业名称：</text>
						<view class="">
							{{companyInfo.companyName}}
						</view>
					</view>
					<view class="product-info-box">
						<text>项目编号：</text>
						<view class="product-info-box-pCode">
							{{companyInfo.projectCode}}
						</view>
					</view>
					<view class="product-info-box">
						<text>项目名称：</text>
						<view class="">
							{{companyInfo.projectName}}
						</view>
					</view>
					<view class="product-info-box">
						<text>采集设备编号：</text>
						<view class="product-info-box-dCode">
							<text v-for="item in companyInfo.deviceCodes">{{item}}</text>
						</view>
					</view>
					<view class="product-info-box">
						<text>项目所属地区：</text>
						<view class="">
							{{companyInfo.projectArea}}
						</view>
					</view>
				</view>
			</view>

			<!-- 绿证信息 -->
			<view class="greenCard">
				<view class="greenCard-title">
					绿证信息
				</view>
				<!-- 信息 -->
				<view class="greenCard-info">
					<!-- 区别展示 -->
					<!-- 发布资产 -->
					<view v-if="current == 0">
						<view class="greenCard-info-box">
							<text>总数量：</text>
							<view class="">
								{{assetsDetailList.stockAmount}}
							</view>
						</view>
						<view class="greenCard-info-box">
							<text>在售数量：</text>
							<view class="">
								{{assetsDetailList.stock}}
							</view>
						</view>
						<view class="greenCard-info-box">
							<text>已售数量：</text>
							<view class="">
								{{assetsDetailList.saleAmount}}
							</view>
						</view>
						<view class="greenCard-info-box">
							<text>已撤回数量：</text>
							<view class="">
								{{assetsDetailList.rollbackAmount}}
							</view>
						</view>
					</view>

					<!-- 核销资产 -->
					<view v-else-if="current == 1 && assetsDetailList.assetType == 1">
						<view class="greenCard-info-box">
							<text>总数量：</text>
							<view class="">
								{{assetsDetailList.assetAmount}}
							</view>
						</view>
						<view class="greenCard-info-box">
							<text>可支配数量：</text>
							<view class="">
								{{assetsDetailList.amount}}
							</view>
						</view>
						<view class="greenCard-info-box">
							<text>已核销数量：</text>
							<view class="">
								{{assetsDetailList.verificationAmount}}
							</view>
						</view>
						<view class="greenCard-info-box">
							<text>核销待审批数量：</text>
							<view class="">
								{{assetsDetailList.stayVerificationAmount}}
							</view>
						</view>
					</view>

					<!-- 拥有资产 -->
					<view v-else>
						<view class="greenCard-info-box">
							<text>总数量：</text>
							<view class="">
								{{assetsDetailList.assetAmount}}
							</view>
						</view>
						<view class="greenCard-info-box">
							<text>可支配数量：</text>
							<view class="">
								{{assetsDetailList.amount}}
							</view>
						</view>
						<view class="greenCard-info-box">
							<text>已发布数量：</text>
							<view class="">
								{{assetsDetailList.publishCount}}
							</view>
						</view>
					</view>
					<view class="greenCard-info-box">
						<text>资产最近到期日：</text>
						<view class="">
							<uni-dateformat :date="assetsDetailList.assetRecentDate" format="yyyy-MM-dd hh:mm:ss">
							</uni-dateformat>
						</view>
					</view>
					<view class="greenCard-info-box">
						<text>一个月内到期资产数：</text>
						<view class="">
							{{assetsDetailList.oneMonthAsset == null ? "0" : assetsDetailList.oneMonthAsset}}
						</view>
					</view>
					<view class="greenCard-info-box">
						<text>1-3个月内到期资产数：</text>
						<view class="">
							{{assetsDetailList.oneToThreeMonthAsset== null ? "0" :assetsDetailList.oneToThreeMonthAsset }}
						</view>
					</view>
					<view class="greenCard-info-box">
						<text>3-6个月内到期资产数：</text>
						<view class="">
							{{assetsDetailList.threeToSixMonthAsset== null ? "0" :assetsDetailList.threeToSixMonthAsset }}
						</view>
					</view>
					<view class="greenCard-info-box">
						<text>6个月以上内到期资产数：</text>
						<view class="">
							{{assetsDetailList.moreThanSixMonthAsset== null ? "0" :assetsDetailList.moreThanSixMonthAsset}}
						</view>
					</view>
					<!-- 按钮 -->
					<view class="greenCard-info-box">
						<text></text>
						<view class="greenCard-info-box-btn">
							<view v-if="current == 0">
								<button type="primary" size="mini"
									@click="toRecord(assetsDetailList.assetSaleId,current,0)">
									发布记录 </button>
								<button type="primary" size="mini" @click="open(0)"
									:disabled="assetsDetailList.stock == 0 ? true : false"> 撤回 </button>
							</view>

							<view v-else-if="current == 1">
								<!-- 核销 -->
								<view v-if="assetsDetailList.assetType == 1">
									<button type="primary" size="mini"
										@click="toRecord(assetsDetailList.assetId,current,1)">
										核销记录
									</button>
									<button type="primary" size="mini" @click="open(2)">
										核销
									</button>
								</view>
								<!-- 发布 -->
								<view v-else>
									<button type="primary" size="mini"
										@click="toRecord(assetsDetailList.assetId,current,0)">
										发布记录
									</button>

									<!-- :disabled="assetsDetailList.assetType == 1 ? true : assetsDetailList.amount == 0 ?  true : false" -->
									<button type="primary" size="mini" @click="open(1)">
										发布 </button>
								</view>





							</view>
						</view>
					</view>

					<uni-popup ref="popup" type="dialog">
						{{formData.name}}
						<uni-popup-dialog mode="base" :type="popupType" :title="popupTitle" :content="popupContent"
							:before-close="true" @close="close" @confirm="confirm(fromsType)">
							<!-- 撤回 0 -->
							<!-- 发布 1 -->
							<view v-if="current == 1 && fromsType == 1">
								<uni-forms ref="form" :modelValue="formData" :rules="rules">
									<uni-forms-item label="发布数量" name="num" :required=true>
										<uni-easyinput type="number" v-model="formData.num" :placeholder="numPlace" />
									</uni-forms-item>
									<uni-forms-item label="单价" name="price" :required=true>
										<uni-easyinput type="number" v-model="formData.price" placeholder="请输入单价" />
									</uni-forms-item>
									<uni-forms-item label="描述" name="describe">
										<uni-easyinput type="text" v-model="formData.describe" placeholder="请输入描述" />
									</uni-forms-item>
								</uni-forms>
							</view>
							<!-- 核销 2 -->
							<view v-if="current == 1 && fromsType == 2">
								<uni-forms ref="form" :modelValue="formData" :rules="rules">
									<uni-forms-item label="核销数量" name="cancelNum" :required=true>
										<uni-easyinput type="number" v-model="formData.cancelNum"
											:placeholder="numPlace" />
									</uni-forms-item>
								</uni-forms>
							</view>
						</uni-popup-dialog>
					</uni-popup>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		energyTypes
	} from "../../../../utils/public.js"
	import {
		codeToText
	} from '@/utils/cascader-address-options.js';
	import {
		back
	} from '@/utils/public.js';

	export default {
		data() {
			return {
				// 导航文字
				leftText: "",
				// 当前id
				id: "",
				current: "", //0:发布资产  1:拥有资产
				// 接收详情数据
				assetsDetailList: [],
				// 接收的数据中的公司信息
				companyInfo: [],
				energyTypes,
				popupType: "",
				popupTitle: "",
				popupContent: "",
				formData: {
					// 发布
					num: "",
					price: 1.0,
					describe: "",
					// 核销
					cancelNum: ""
				},
				rules: {

					// 对name字段进行必填验证
					num: {
						// name 字段的校验规则
						rules: [{
								required: true,
								errorMessage: '请输入数量'
							},
							{
								format: 'number',
								errorMessage: '发布数量有误'
							},
							{
								pattern: /^[1-9]\d*$/,
								errorMessage: '发布数量有误'
							}
						],
					},
					price: {
						// name 字段的校验规则
						rules: [{
								required: true,
								errorMessage: '请输入单价',
							},
							{
								format: 'number',
								errorMessage: '输入价格有误'
							},
							{
								minimum: 0.1,
								errorMessage: '发布最小价格为0.1元'
							}
						]
					},
					cancelNum: {
						// 核算 字段的校验规则
						rules: [{
								required: true,
								errorMessage: '请输入数量'
							},
							{
								format: 'number',
								errorMessage: '核算数量有误'
							},
							{
								pattern: /^[1-9]\d*$/,
								errorMessage: '核算数量有误'
							}
						],
					},
				},
				numPlace: "",
				fromsType: 0
			}
		},
		onLoad(option) {
			if (option.id) this.id = option.id
			if (option.current) {
				this.current = option.current
				if (this.current == 0) {
					this.leftText = "发布资产详情"
				} else {
					this.leftText = "拥有资产详情"
				}
			}
		},
		mounted() {
			this.getAssetsDetailList()
		},
		methods: {
			back() {
				back();
			},
			init() {
				this.formData.num = ""
				this.formData.price = 1.0
				this.formData.describe = ""
				this.formData.cancelNum = ""
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
			open(val) {
				// 弹出层展示内容区别
				this.fromsType = val
				if (val == 0) {
					// 撤回
					this.popupType = "warn"
					this.popupTitle = "撤回提示"
					this.popupContent = "是否确定所有未售出的"
				} else if (val == 1) {
					// 发布
					this.popupType = "info"
					this.popupTitle = "发布资产"
					this.numPlace = `最大可发布数量${(this.assetsDetailList.amount).toFixed(0)}`
				} else if (val == 2) {
					// 核销
					this.popupType = "info"
					this.popupTitle = "资产核销"
					this.numPlace = `最大可核销数量${(this.assetsDetailList.amount).toFixed(0)}`
				}
				this.$refs.popup.open()
			},
			/**
			 * 点击取消按钮触发
			 */
			close() {
				this.init()
				this.$refs.popup.close()
			},
			/**
			 * 点击确认按钮触发
			 */
			confirm(fromsType) {
				console.log(fromsType);
				if (fromsType == 0) {
					console.log(1111);
					// 撤回
					this.withDrawPublishAsset()
					this.$refs.popup.close()
				} else if (fromsType == 1) {
					// 发布
					// 触发提交表单
					this.$refs.form.validate().then(res => {
						if (Number(this.formData.num) > Number(this.assetsDetailList.amount.toFixed(0))) {
							this.getPrompt("发布失败，库存不足", "none")
						} else {
							this.publishAsset()
							this.$refs.popup.close()
							this.init()
						}
					})
				} else if (fromsType == 2) {
					// 核销
					this.$refs.form.validate().then(res => {
						if (Number(this.formData.cancelNum) > Number(this.assetsDetailList.amount.toFixed(0))) {
							this.getPrompt("核销数量有误", "none")
						} else {
							// 核销方法
							this.cancelAsset()
							this.$refs.popup.close()
							this.init()
						}
					})
				}

			},
			toRecord(id, current, type) {
				if (type == 1) {
					// 跳转核销记录
					uni.navigateTo({
						url: `./assetsVer?id=${id}&current=${current}`
					})
				} else {
					// 跳转发布记录
					uni.navigateTo({
						url: `./assetsRecord?id=${id}&current=${current}`
					})
				}

			},
			// 核销资产
			cancelAsset() {
				uni.showLoading({
					title: '核销中'
				});
				this.$request({
					path: "/api/assetMment/assetWriteOffApplication",
					method: "POST",
					header: {
						"Authorization": this.$store.state.token
					},
					params: {
						assetId: this.id,
						number: this.formData.cancelNum * 100
					}
				}).then(value => {
					if (value.data == true) {
						this.getPrompt("核销成功", "success")
						setTimeout(() => {
							this.getAssetsDetailList()
						}, 1000)
					} else {
						this.getPrompt(value.message, "none")
					}
				})
			},
			// 发布资产
			publishAsset() {
				uni.showLoading({
					title: '发布中'
				});
				this.$request({
					path: "/api/assetMment/publishAsset",
					method: "POST",
					header: {
						"Authorization": this.$store.state.token
					},
					params: {
						assetId: this.id,
						description: this.formData.describe,
						publishAmount: this.formData.num * 100,
						unitPrice: this.formData.price * 100
					}
				}).then(value => {
					if (value.data == true) {
						this.getPrompt("发布成功", "success")
						setTimeout(() => {
							this.getAssetsDetailList()
						}, 1000)
					} else {
						this.getPrompt(value.message, "none")
					}
				})
			},
			// 撤回资产
			withDrawPublishAsset() {
				uni.showLoading({
					title: '撤回中'
				});
				this.$request({
					path: "/api/assetMment/withDrawPublishAsset",
					method: "POST",
					header: {
						"Authorization": this.$store.state.token
					},
					params: {
						assetSaleId: this.id
					}
				}).then(value => {
					if (value.data == true) {
						this.getPrompt("撤回成功", "success")
						setTimeout(() => {
							this.getAssetsDetailList()
						}, 1000)
					} else {
						this.getPrompt(value.message, "none")
					}
				})
			},
			// 获取资产详情数据
			getAssetsDetailList() {
				uni.showLoading({
					title: '加载中'
				});
				let path = ""
				let params = {}
				if (this.current == 0) {
					// 发布
					path = "/api/assetMment/publishAssetsDetail"
					params = {
						sellerId: this.id
					}
				} else if (this.current == 1) {
					// 拥有
					path = "/api/assetMment/ownAssetDetail"
					params = {
						ownerId: this.id
					}
				}
				this.$request({
					path: path,
					method: "GET",
					params: params
				}).then((value) => {
					let data = value.data
					data.stockAmount = data.stockAmount / 100
					data.stock = data.stock / 100
					data.saleAmount = data.saleAmount / 100
					data.rollbackAmount = data.rollbackAmount / 100
					data.assetAmount = data.assetAmount / 100
					data.amount = data.amount / 100
					data.publishCount = data.publishCount / 100
					data.oneMonthAsset = data.oneMonthAsset / 100
					data.oneToThreeMonthAsset = data.oneToThreeMonthAsset / 100
					data.threeToSixMonthAsset = data.threeToSixMonthAsset / 100
					data.moreThanSixMonthAsset = data.moreThanSixMonthAsset / 100
					data.verificationAmount = data.verificationAmount / 100
					data.stayVerificationAmount = data.stayVerificationAmount / 100
					this.assetsDetailList = data
					if (data.relateCompanyVo) {
						data.relateCompanyVo.projectArea = codeToText(data.relateCompanyVo.projectArea);
						this.companyInfo = data.relateCompanyVo

					}
					uni.hideLoading()
				}).catch((reason) => {
					console.log(reason);
				})
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
		padding-bottom: 10rpx;
	}
	
	// 深入修改导航栏左操作栏宽度
	// /deep/.uni-navbar__header-btns-left{
	// 	width: 150px;
	// }

	.img {
		width: 100%;
		height: 100%;
	}

	// 产品
	.product {
		background-color: #fff;
		border-radius: 10px;

		&-box {
			padding: 10rpx;
			display: flex;
			justify-content: space-between;

			&-img {
				width: 240rpx;
				height: 200rpx;
				border-radius: 25rpx;
				overflow: hidden;
				margin-left: 5rpx;
			}

			&-des {
				height: 200rpx;
				width: 425rpx;

				&-title {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 37rpx;
				}

				&-score {
					display: flex;

					/* #ifdef  H5 */
					view {
						margin-top: 6rpx;
					}

					/* #endif */
				}

				view {
					line-height: 67rpx;
				}

				view:nth-child(n+2) {
					font-size: 28rpx;
				}
			}
		}

		&-info {
			font-size: 28rpx;
			padding: 20rpx;

			&-box {
				line-height: 50rpx;
				display: flex;
				justify-content: space-between;

				&-cCode {}

				&-pCode {
					word-wrap: break-word;
					width: 380rpx;
				}

			}

			&-box:nth-child(n+2) {
				margin-top: 10rpx;
			}
		}
	}


	// 绿证
	.greenCard {
		background-color: #fff;
		border-radius: 10rpx;
		margin-top: 20rpx;
		padding: 20rpx;

		&-title {
			font-size: 40rpx;
		}

		&-info {
			font-size: 28rpx;
			padding: 0 10rpx 0 10rpx;

			&-box {
				display: flex;
				justify-content: space-between;
				line-height: 55rpx;

				&-btn {
					display: flex;
					justify-content: space-between;

					button:nth-child(n+2) {
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>
