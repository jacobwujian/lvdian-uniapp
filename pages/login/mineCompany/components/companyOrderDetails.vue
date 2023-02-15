<template>
	<view class="daiding">
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="订单详情" statusBar></uni-nav-bar>
		<view class="page">
			<view class="box">
				<view style="border-radius: 25rpx;
			overflow: hidden;">
					<view class="title" style="padding-left: 15rpx;padding-top: 10rpx;">
						<view>{{status}}</view>
					</view>
					<view class="body">
						<view class="listImg" style="border-radius: 25rpx;
			overflow: hidden;">
							<img class="img" :src="imgUrl"></img>
						</view>
						<view class="listData">
							<view class="Listbig">
								{{projectName}}
							</view>
							<view class="ListBigALittle">
								能源类型：{{orderDetailList.relateCompanyVo.energyType}}
							</view>
							<view class="ListBigALittle">
								项目能源等级：
								<uni-rate class="score" :value="orderDetailList.relateCompanyVo.authenticationLevel"
									size="20" readonly />
							</view>
						</view>
					</view>
					<view class="neck">
						<view class="pleural">
							<view class="left">交易单价：</view>
							<view class="right">{{price/100}}</view>
						</view>
						<view class="pleural">
							<view class="left">交易数量：</view>
							<view class="right">{{tradeCount/100}}</view>
						</view>
						<view class="pleural">
							<view class="left">交易总价：</view>
							<view class="right">{{totalPrice/100}}</view>
						</view>
						<view class="pleural">
							<view class="left">交易时间：</view>
							<view class="right">{{tradeTime}}</view>
						</view>
						<view class="pleural">
							<view class="left">协议与付款凭证：</view>
							<view class="bottom" style="border-radius: 25rpx;">
								<view v-if="orderDetailList.fileInfos.length>0" class="voucher"
									v-for="(item,index) in orderDetailList.fileInfos" @click="load(item)">
									{{item.fileName}}
								</view>
							</view>
						</view>
						<view class="pleural">
							<uni-popup ref="popup" type="bottom">
								<image lazy-load="true"
									:src="imgSrc"></image>
							</uni-popup>
							<!-- <image style="border-radius: 25rpx;
									overflow: hidden;width: 300rpx; height: 200rpx;margin-left: 50rpx;margin-bottom: 25rpx;" lazy-load="true"
								:src="imgSrc"></image>
							<view class="right">
								点击名称预览
							</view> -->
						</view>
					</view>
					<view class="Arms">
						<view class="Arms-title">
							<view class="Arms-List">
								买方信息
							</view>
							<view class="pleural">
								<view class="left">统一社会信用代码：</view>
								<view class="right">{{orderDetailList.purchaserCompanyVo.socialCreditCode}}</view>
							</view>
							<view class="pleural">
								<view class="left">企业名称：</view>
								<view class="right">{{orderDetailList.purchaserCompanyVo.companyName}}</view>
							</view>
							<view class="pleural">
								<view class="left">所属地区：</view>
								<view class="right">{{orderDetailList.purchaserCompanyVo.address}}</view>
							</view>
						</view>
					</view>
					<view class="Arms">
						<view class="Arms-title">
							<view class="Arms-List">
								卖方信息
							</view>
							<view class="pleural">
								<view class="left">统一社会信用代码：</view>
								<view class="right">{{orderDetailList.sellerCompanyVo.socialCreditCode}}</view>
							</view>
							<view class="pleural">
								<view class="left">企业名称：</view>
								<view class="right">{{orderDetailList.sellerCompanyVo.companyName}}</view>
							</view>
							<view class="pleural">
								<view class="left">所属地区：</view>
								<view class="right">{{orderDetailList.sellerCompanyVo.address}}</view>
							</view>
						</view>
					</view>
					<view class="Arms">
						<view class="Arms-title">
							<view class="Arms-List">
								项目信息
							</view>
							<view class="pleural">
								<view class="left">项目名称：</view>
								<view class="right">{{projectName}}</view>
							</view>
							<view class="pleural">
								<view class="left">项目编号：</view>
								<view class="right">{{orderDetailList.relateCompanyVo.projectCode}}</view>
							</view>
							<view class="pleural">
								<view class="left">能源类型：</view>
								<view class="right">{{orderDetailList.relateCompanyVo.energyType}}</view>
							</view>
							<view class="pleural">
								<view class="left">项目能源等级：</view>
								<view class="right">
									<uni-rate :value="orderDetailList.relateCompanyVo.authenticationLevel" size="20"
										readonly />
								</view>
							</view>
							<view class="pleural">
								<view class="left">项目所属地区：</view>
								<view class="right">{{orderDetailList.relateCompanyVo.projectArea}}</view>
							</view>
							<view class="pleural">
								<view class="left">采集设备编号：</view>
								<text v-for="item in orderDetailList.relateCompanyVo.deviceCodes">{{item}}</text>
							</view>
						</view>
						<view class="pleural">
							<view class="left">资产最近到期日：</view>
							<view class="right">{{orderDetailList.assetRecentDate}}</view>
						</view>
						<view class="pleural">
							<view class="left">一个月内到期资产数：</view>
							<view class="right">
								{{orderDetailList.oneMonthAsset == null ? "0" : orderDetailList.oneMonthAsset}}
							</view>
						</view>
						<view class="pleural">
							<view class="left">1-3个月内到期资产数：</view>
							<view class="right">
								{{orderDetailList.oneToThreeMonthAsset == null ? "0" : orderDetailList.oneToThreeMonthAsset}}
							</view>
						</view>
						<view class="pleural">
							<view class="left">3-6个月内到期资产数：</view>
							<view class="right">
								{{orderDetailList.threeToSixMonthAsset == null ? "0" : orderDetailList.threeToSixMonthAsset}}
							</view>
						</view>
						<view class="pleural">
							<view class="left">6个月以上到期资产数：</view>
							<view class="right">
								{{orderDetailList.moreThanSixMonthAsset == null ? "0" : orderDetailList.moreThanSixMonthAsset}}
							</view>
						</view>
					</view>
				</view>
				<view class="Arms">
					<view class="Arms-title">
						<view class="Arms-List">
							审核信息
						</view>
						<view class="pleural">
							<view class="left">审核结果：</view>
							<view class="right">{{orderDetailList.approveResult}}</view>
						</view>
						<view class="pleural">
							<view class="left">审核备注：</view>
							<view class="right">{{orderDetailList.approveRemark}}</view>
						</view>
					</view>
				</view>
				<view class="end" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		momentDate
	} from "@/utils/tools";
	import {
		OrderType,
		energyTypes,
		reviewType
	} from "@/utils/public.js"
	import {
		codeToText
	} from '@/utils/cascader-address-options.js';
	import {
		back
	} from '@/utils/public.js';
	import {BASE_URL} from'@/utils/request.js'
	export default {
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			this.id = option.id
			this.dataInfo = option;
		},
		data() {
			return {
				OrderType,
				reviewType,
				energyTypes,
				navIndex: 0,
				dataInfo: {},
				id: "",
				fileList: [],
				srcI: '',
				orderDetailList: {
					"relateCompanyVo": {
						"energyType": ""
					},
					"fileInfos": [{
						"fileName": ""
					}],
					"sellerCompanyVo": {
						"socialCreditCode": ""
					},
					"purchaserCompanyVo": {
						"socialCreditCode": ""
					},
					"oneMonthAsset": "",

				},
			}
		},
		computed: {
			imgUrl() {
				return uni.getStorageSync("imgUrl");
			},
			imgSrc() {
				return this.srcI;
			},
			status() {
				return uni.getStorageSync("status");
			},
			tradeTime() {
				return uni.getStorageSync("tradeTime");
			},
			tradeCount() {
				return uni.getStorageSync("tradeCount");
			},
			price() {
				return uni.getStorageSync("price");
			},
			totalPrice() {
				return uni.getStorageSync("totalPrice");
			},
			projectName() {
				return uni.getStorageSync("projectName");
			}
		},
		mounted() {
			this.selectOrderDetails()
		},
		beforeMount() {

		},
		methods: {
			back() {
				back();
			},
			async selectOrderDetails() {
				uni.showLoading({
					title: '加载中'
				});
				this.$request({
					path: '/api/trade/orderDetail', // 路径
					method: 'GET', // GET、POST方法
					params: {
						orderId: this.id
					}, // 参数
				}).then((value) => {
					// debugger
					uni.hideLoading();
					this.orderDetailList = value.data
					this.orderDetailList.assetRecentDate = momentDate(this.orderDetailList.assetRecentDate)
					this.orderDetailList.approveResult = reviewType[this.orderDetailList.approveResult]
					this.orderDetailList.relateCompanyVo.energyType = energyTypes[this.orderDetailList
						.relateCompanyVo.energyType]
					this.orderDetailList.relateCompanyVo.projectArea = codeToText(this.orderDetailList
						.relateCompanyVo.projectArea)
				}).catch((reason) => {
					console.log(reason);
				})
			},
			load(file) {
				// #ifdef H5
				  if (file) {
				      const endPre = file.fileCode.substring(file.fileCode.indexOf('.'), file.fileCode.length)
				      let type = 'application/pdf'
				      if (endPre.includes('.jpg')) {
				        type = 'image/jpg'
				      }else if (endPre.includes('.jpeg')){
				        type = 'image/jpeg'
				      }else if (endPre.includes('.png')){
				        type = 'image/png'
				      }else {
				        type = 'application/pdf'
				      }
				        var oReq = new XMLHttpRequest()
				        oReq.open('POST', BASE_URL+'/api/common/oss/getOssImageUrls', true)
				        oReq.responseType = 'blob'
				        oReq.setRequestHeader('Authorization', uni.getStorageSync("token"))
				        oReq.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
				
				        oReq.onload = function() {
				          var file1 = new Blob([oReq.response], {
				            type: type
				          })
				
				          if (navigator.msSaveBlob) {
				            return navigator.msSaveBlob(file1, file.fileCode)
				          }
						     var a = document.createElement("a");
						       a.download =file.fileCode;
						       a.href = window.URL.createObjectURL(file1);
						       document.getElementsByTagName("body")[0].append(a); // 修复firefox中无法触发click
						       a.click();
						       a.remove();
/* 				          uni.downloadFile({
				          	url: window.URL.createObjectURL(file1),
				          	success: res => {
				          		if (res.statusCode === 200) {
				          			console.log(res);
				          			uni.openDocument({
				          				filePath: res.tempFilePath
				          			});
				          		}
				          	}
				          }); */
				        }
				        oReq.send(JSON.stringify({
				          urls: [file.fileCode]
				        }))
				    }
					// #endif
				// #ifdef APP || MP-WEIXIN
				let urls = []
				this.$request({
					path: '/api/common/oss/getOssImageUrl', // 路径
					method: 'POST', // GET、POST方法
					params: {
						urls: [file.fileCode],
					}, // 参数
				}).then((value) => {
					this.$refs.popup.open('center')
					uni.downloadFile({
						url: value.data,
						success: res => {
							if (res.statusCode === 200) {
								console.log(res);
								uni.openDocument({
									filePath: res.tempFilePath
								});
							}
						}
					});
					this.srcI = value.data;
				}).catch((reason) => {
					console.log(reason);
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}

	.box {
		height: 100%;

	}

	.title {
		font-weight: bold;
		background-color: #fff;
		font-size: 40rpx;

		view {
			margin-left: 5rpx;
		}
	}

	.body {
		background-color: #fff;
		display: flex;
		justify-content: space-between;
	}

	.listImg {
		margin-top: 11rpx;
		margin-left: 15rpx;
		margin-bottom: 11rpx;
		height: 175rpx;
		width: 175rpx;
	}

	.img {
		width: 175rpx;
		height: 175rpx;
	}

	.Listbig {
		// border: 1px solid;
		font-weight: bold;
		width: 450rpx;
		margin-top: 11rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ListBigALittle {
		font-weight: bold;
		width: 480rpx;
		display: flex;
		margin-top: 11rpx;
	}

	.score {
		margin-top: 5rpx;
	}

	.neck {
		// border: 1px solid;
		height: 100%;
		border-radius: 25rpx;
		background-color: #fff;
	}

	.pleural {
		display: flex;
		justify-content: space-between;
		font-size: 25rpx;
	}

	.right {
		margin: 8rpx 8rpx 8rpx 8rpx;
	}

	.voucher {
		margin: 8rpx 8rpx 8rpx 8rpx;
		color: #007AFF;
	}

	.left {
		margin: 8rpx 8rpx 8rpx 40rpx;
	}

	.bottom {
		margin-bottom: 15rpx;
	}

	.Arms {
		margin-top: 18rpx;
		background-color: #fff;
		height: 100%;
		font-size: 25rpx;
		border-radius: 25rpx;
		overflow: hidden;
	}

	.Arms-title {
		background-color: #FFFFFF;
		// font-weight: bold;
		font-size: 35rpx;
	}

	.Arms-List {
		margin-left: 15rpx;
	}

	.end {
		margin-top: 15rpx;
		border: 1px solid #F9F9F9;
	}
</style>
