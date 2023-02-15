<template>
	<view class="">
		<!-- 导航栏 -->
		<uni-nav-bar leftIcon="back" rightIcon="more-filled" @clickRight="onClickRight" @clickLeft="back()" height="46"
			fixed left-text="项目详情">
		</uni-nav-bar>

		<!-- 主体 -->
		<view class="page">
			<!-- 信息 -->
			<view class="proBox">
				<!-- 头部 -->
				<view class="boxHead">
					<!-- 图片 -->
					<view class="headImg">
						<image class="img" :src="proInfo.imgUrl"></image>
					</view>
					<!-- 信息 -->
					<view class="headInfo">
						<view class="infoTitle">
							{{proInfo.projectName}}
						</view>
						<view class="infoOther">
							项目类型：{{projectType[proInfo.projectType]}}
						</view>
						<view class="infoOther">
							能源类型：{{energyTypes[proInfo.energyType]}}
						</view>
						<view class="infoOther">
							<text>认证等级：</text>
							<uni-rate :value="proInfo.authenticationLevel" size="18" readonly />
						</view>
					</view>
				</view>
				<!-- 身体 -->
				<view class="boxBody">
					<view class="bodyBox">
						<text>所属单位：</text>
						<text>{{proInfo.companyName}}</text>
					</view>
					<view class="bodyBox">
						<text>项目编号：</text>
						<text>{{proInfo.projectCode}}</text>
					</view>
					<view class="bodyBox">
						<text>申报日期：</text>
						<text>
							<uni-dateformat :date="proInfo.applicationDate" format="yyyy-MM-dd">
							</uni-dateformat>
						</text>
					</view>
					<view class="bodyBox">
						<text>项目地区：</text>
						<text>{{proInfo.projectArea}}</text>
					</view>
					<view class="bodyBox">
						<text>当前状态：</text>
						<text>{{projectStatus[proInfo.status]}}</text>
					</view>
					<view class="bodyBox">
						<text>项目周期：</text>
						<text><text v-if="proInfo.periodTimeStart != null">
								<uni-dateformat :date="proInfo.periodTimeStart" format="yyyy-MM-dd">
								</uni-dateformat> {{' '}}至 {{' '}}
								<uni-dateformat :date="proInfo.periodTimeEnd" format="yyyy-MM-dd">
								</uni-dateformat>
							</text></text>
					</view>
					<view class="bodyBox">
						<text>联系人：</text>
						<text>{{proInfo.contact}}</text>
					</view>
					<view class="bodyBox">
						<text>联系方式：</text>
						<text>{{proInfo.contactWay}}</text>
					</view>
					<view class="bodyBox">
						<text>认证机构：</text>
						<text>{{proInfo.certificationAuthority}}</text>
					</view>
					<view class="bodyBox">
						<text>方法学：</text>
						<text>{{proInfo.methodology}}</text>
					</view>
					<!-- 项目介绍 -->
					<view class="bodyBox">
						<text>项目介绍：</text>
						<view class="introduce">
							{{proInfo.projectDesc}}
						</view>
					</view>
				</view>
			</view>


			<!-- 审核 -->
			<!-- 待审核时不展示 -->
			<view class="checkBox" v-if="proInfo.status == 1 || proInfo.status == 3">
				<!-- 审核信息 -->
				<view class="infoBox">
					<view class="temp">
						审核信息
					</view>
					<view class="infoItem">
						<text>审核结果：</text>
						<view class="resultBox">
							<uni-data-checkbox v-model="proInfo.approveResult" :localdata="range" @change="change">
							</uni-data-checkbox>
						</view>
					</view>
					<view class="infoItem">
						<text>审核备注：</text>
						<view class="checkRemark">
							{{proInfo.approveRemark == '' ? '无':proInfo.approveRemark}}
						</view>
					</view>
				</view>

				<!-- 				<view class="checkBtns" v-if="proInfo.approveResult != null">
					<button type="primary" size="mini" @click="revamp" v-if="proInfo.status == 1">修改</button>
					<button type="primary" size="mini" @click="open(1)" v-if="proInfo.status == 1">暂停</button>
					<button type="primary" size="mini" @click="open(2)" v-if="proInfo.status == 2">启动</button>
				</view> -->

			</view>

		</view>
		<!-- 弹窗 -->
		<uni-popup ref="popup" type="dialog" @maskClick="maskClick">
			<uni-popup-dialog mode="base" type="warn" :before-close="true" :title="popupTitle"
				:content="popupContent" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		
		<!-- 弹窗 -->
		<uni-popup ref="popupBottom" type="bottom" @maskClick="maskClick">
			<view class="marqueeBox">
				<button type="primary"  @click="revamp" v-if="proInfo.status == 1">修改</button>
				<button type="primary" @click="open(1)" v-if="proInfo.status == 1">暂停</button>
				<button type="primary" @click="open(2)" v-if="proInfo.status == 2">启动</button>
				<button type="default" @click="cancelBtn">取消</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		back,
		projectType,
		energyTypes,
		projectStatus
	} from "@/utils/public.js"
	import {
		codeToText
	} from '@/utils/cascader-address-options.js';
	export default {
		data() {
			return {
				flagTemp:false,
				// 当前按钮type
				btnType: "",
				// 弹窗文字
				popupTitle: "",
				popupContent: "",
				// 选框
				range: [{
					"value": 1,
					"text": "通过",
					// 禁用当前项
					"disable": true
				}, {
					"value": 0,
					"text": "驳回",
					// 禁用当前项
					"disable": true
				}],
				// 项目状态
				projectStatus,
				// 能源类型
				energyTypes,
				// 项目类型
				projectType,
				// 数据
				proInfo: {},
				// 登录信息
				token: this.$store.state.token,
				// 项目id
				id: '',
			}
		},
		onLoad(option) {
			this.id = option.id
		},
		// created() {
		onShow() {
			this.projectInfo()
		},
		methods: {
			maskClick(){
				this.$refs.popup.close()
				this.flagTemp = false
			},
			// 取消按钮
			cancelBtn() {
				this.$refs.popupBottom.close()
			},
			// 点击导航栏右侧按钮
			onClickRight() {
				if(this.flagTemp == true){
					return
				}
				// 判断当前项目状态能否操作
				if (this.proInfo.approveResult != null && this.proInfo.status == 1 || this.proInfo.status == 2) {
					// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
					this.$refs.popupBottom.open('bottom')
				} else {
					this.getPrompt("项目待审核中", "none")
				}

			},
			// 确定弹窗
			confirm() {
				this.startStopBtn(this.btnType)
				this.$refs.popup.close()
				this.flagTemp = false
			},
			// 关闭弹窗
			close() {
				// TODO 做一些其他的事情，before-close 为true的情况下，手动执行 close 才会关闭对话框
				// ...	
				this.$refs.popup.close()
				this.flagTemp = false
			},
			// 打开弹窗
			open(type) {
				this.flagTemp = true
				this.$refs.popupBottom.close()
				if (type == 1) {
					this.popupTitle = "暂停提示"
					this.popupContent = "是否确定暂停该项目？"
				} else {
					this.popupTitle = "启动提示"
					this.popupContent = "是否确定启动该项目？"
				}
				this.btnType = type
				this.$refs.popup.open()
			},
			// 修改
			revamp() {
				// type=${0}
				uni.navigateTo({
					url: `./createProject?proId=${this.id}`
				});
				this.$refs.popupBottom.close()
			},
			// 等待
			onLoading() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
			},
			// 提示
			getPrompt(title, icon) {
				uni.showToast({
					title: title,
					icon: icon,
					mask: true
				})
			},
			// 启动 暂停 按钮
			async startStopBtn(type) {
				let path;
				if (type == 1) {
					// 暂停
					path = "/api/ProjectManagement/stopProject"
				} else {
					path = "/api/ProjectManagement/launchProject"
				}
				const res = await this.$request({
					path: path,
					method: "POST",
					header: {
						"Authorization": this.token
					},
					params: {
						id: this.id,
					}
				})

				// 失败
				if (res.data == false) {
					this.getPrompt("操作失败", "error")
					return
				}
				this.getPrompt("操作成功", "success")
				setTimeout(() => {
					this.projectInfo()
				}, 800)


			},
			// 获取数据
			async projectInfo() {
				// 加载
				this.onLoading()
				const res = await this.$request({
					path: "/api/ProjectManagement/projectInfo",
					header: {
						"Authorization": this.token
					},
					params: {
						id: this.id,
					}
				})

				// 失败
				if (!res.data) {
					console.log("失败");
					this.getPrompt("获取数据失败", "error")
					return
				}

				let data = res.data
				data.projectArea = codeToText(data.projectArea);
				this.proInfo = data

				// 停止加载动画
				setTimeout(() => {
					uni.hideLoading();
				}, 200)
			},
			// 返回
			back() {
				back();
			},
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

	.page {
		background-color: #F9F9F9;

		// 信息
		.proBox {
			background-color: #FFFFFF;
			border-radius: 25rpx;
			overflow: hidden;

			.boxHead {
				height: 220rpx;
				display: flex;
				padding: 15rpx;

				.headImg {
					width: 40%;
					height: 100%;
					border-radius: 25rpx;
					overflow: hidden;
				}

				.headInfo {
					width: 60%;
					height: 100%;
					padding-left: 15rpx;

					.infoTitle {
						line-height: 60rpx;
						font-size: 38rpx;
						margin-bottom: 5rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.infoOther {
						line-height: 50rpx;
						font-size: 29rpx;
						display: flex;
					}
				}
			}

			.boxBody {
				padding: 0 25rpx 20rpx;

				.bodyBox {
					line-height: 50rpx;
					font-size: 27rpx;
					display: flex;
					justify-content: space-between;

					.introduce {
						width: 400rpx;
						height: 120rpx;
						border: 1px #cfcfcf solid;
					}
				}
			}
		}

		// 审核
		.checkBox {
			margin-top: 20rpx;

			.infoBox {
				padding: 10rpx;
				padding-left: 20rpx;
				background-color: #FFFFFF;
				border-radius: 25rpx;
				overflow: hidden;

				.temp {
					margin-bottom: 20rpx;
				}

				.infoItem {
					padding: 0 10rpx 10rpx 40rpx;
					line-height: 50rpx;
					font-size: 27rpx;
					display: flex;
					justify-content: space-between;

					.resultBox {
						margin-right: 100rpx;
					}

					.checkRemark {
						width: 400rpx;
						height: 100rpx;
						border: 1px #cfcfcf solid;
						color: #cfcfcf;

					}
				}
			}

			.checkBtns {
				padding: 30rpx 0;
				display: flex;
			}
		}
	}

	.marqueeBox {
		button:not(:last-child) {
			background-color: #6CBA18;
			color: #fff;
		}

		background-color:#FFFFFF;
		padding: 20rpx 10rpx 0;
		border-radius: 25rpx 25rpx 0 0;

		button:not(:first-child) {
			margin-top: 20rpx;
		}
	}
</style>
