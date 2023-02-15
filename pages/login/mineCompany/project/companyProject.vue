<template>
	<view class="">
		<!-- 导航栏 -->
		<uni-nav-bar statusBar leftIcon="back" rightIcon="more-filled" @clickLeft="back()" @clickRight="onClickRight" height="46"
			fixed  leftWidth="120"  >
			<!-- 搜索框 -->
			<view class="search">
				<uni-search-bar bgColor="rgb(247, 247, 250)" v-model="searchValue" :radius="25" placeholder="请输入项目名称"
					cancelButton="none" @clear="cancel" @confirm="search"></uni-search-bar>
			</view>
		</uni-nav-bar>

		<!-- 弹窗 -->
		<uni-popup ref="popup" type="bottom">
			<view class="marqueeBox">
				<button type="primary" @click="addProBtn" style="background-color: #6CBA18; color: #fff;">新增项目</button>
				<button type="default" @click="cancelBtn">取消</button>
			</view>
		</uni-popup>

		<!-- 主体 -->
		<view class="page">
			<!-- 分段器 -->
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
				activeColor="#0055ff">
			</uni-segmented-control>

			<!-- 项目 -->
			<view class="projectBox">
				<!-- 项目item -->
				<view class="proItem" v-for="item in projectList" @click="onClickPro(item.id)">
					<!-- 图片 -->
					<view class="proImg">
						<image class="img" :src="item.imgUrl"></image>
					</view>
					<!-- 信息 -->
					<view class="infoBox">
						<!-- 标题 -->
						<view class="title">
							{{item.projectName}}
						</view>
						<!-- 机构名称 -->
						<view class="otherInfo">
							机构名称：<text class="companyNameTemp">{{item.companyName}}</text>
						</view>
						<!-- 项目类型 -->
						<view class="otherInfo">
							项目类型：{{projectType[item.projectType]}}
						</view>
						<!-- 认证等级 -->
						<view class="otherInfo">
							<text>认证等级：</text>
							<uni-rate :value="item.authenticationLevel" size="18" readonly />
						</view>
						<!-- 能源类型 -->
						<view class="otherInfo">
							能源类型：{{energyTypes[item.energyType]}}
						</view>
						<!-- 状态 -->
						<view class="otherInfo">
							状态：{{projectStatus[item.status]}}
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
</template>

<script>
	import {
		back,
		projectType,
		energyTypes,
		projectStatus
	} from "@/utils/public.js"
	export default {
		data() {
			return {
				ShowHidden: false,
				// 页步长
				pageSize: 10,
				// 起始页
				pageNum: 0,
				// 控制上拉触底
				rbm: true,
				// 项目状态
				projectStatus,
				// 能源类型
				energyTypes,
				// 项目类型
				projectType,
				// 项目数据
				projectList: [],
				// 登录信息
				token: this.$store.state.token,
				// 分段标签
				items: [
					"全部",
					"认证项目",
					"非认证项目"
				],
				// 用于切换card
				current: 0,
				// 搜索值
				searchValue: ""
			}
		},
		// 上拉触底
		onReachBottom() {
			if (this.rbm) this.getProject(1);
		},
		// created() {
		// 	this.getProject(1)
		// },
		onShow() {
			this.getProject(1)
		},
		onHide() {
			this.init()
		},
		methods: {
			// 取消按钮
			cancelBtn() {
				this.$refs.popup.close()
			},
			// 新增项目
			addProBtn() {
				uni.navigateTo({
					url: `./components/createProject?type=${0}`
				});
				this.$refs.popup.close()
			},
			// 点击导航栏右侧按钮
			onClickRight() {
				// 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
				this.$refs.popup.open('bottom')
			},



			// 提示
			getPrompt(title, icon) {
				uni.showToast({
					title: title,
					icon: icon,
					mask: true
				})
			},
			// 项目详情
			onClickPro(id) {
				uni.navigateTo({
					url: `./components/projectDeltails?id=${id}`
				});
			},
			// 重置
			init() {
				this.projectList = [];
				this.pageSize = 10;
				this.pageNum = 0;
				this.searchValue = '';
				this.rbm = true;
			},
			// 取消
			cancel() {
				this.init();
				this.getProject();
			},
			// 等待
			onLoading() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
			},
			// 获取项目
			async getProject(type) {
				this.onLoading()
				this.pageNum++
				const res = await this.$request({
					path: "/api/ProjectManagement/getProject",
					header: {
						"Authorization": this.token
					},
					params: {
						projectName: this.searchValue,
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						projectType: this.current
					}
				})

				if (!res.data) {
					this.getPrompt("请求失败,重新加载", "none")
					return
				}
				let data = res.data
				let list = res.data.list
				if (type == 1) {
					this.projectList = this.projectList.concat(list)
				} else {
					this.projectList = list
				}

				// 停止上拉加载并展示到底
				if (data.size < data.pageSize) {
					// 停止上拉触底
					this.rbm = false
				}
				// 停止加载动画
				setTimeout(() => {
					uni.hideLoading();
				}, 200)
			},
			// 切换发布/拥有
			onClickItem(e) {
				this.current = e.currentIndex
				this.init()
				this.getProject()
			},
			// 返回
			back() {
				back();
			},
			// 搜索
			search() {
				this.getProject()
			}

		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;
	}

	// 导航栏
	.search {
		width: 100%;
	}

	.uni-searchbar {
		padding: 5px;
	}

	.img {
		width: 100%;
		height: 100%;
	}

	.marqueeBox {
		background-color:#FFFFFF;
		padding: 20rpx 10rpx 0;
		border-radius: 25rpx 25rpx 0 0;
		button:not(:first-child) {
			margin-top: 20rpx;
			}
		}


	// 主页
	.page {
		background-color: #F9F9F9;

		.projectBox {

			.proItem {
				height: 245rpx;
				padding: 15rpx;
				display: flex;
				background-color: #FFFFFF;
				border-radius: 25rpx;

				&:not(:first-child) {
					margin-top: 20rpx;
				}



				.proImg {
					width: 290rpx;
					height: 240rpx;
					border-radius: 25rpx;
					overflow: hidden;
				}

				.infoBox {
					margin-left: 10rpx;
					width: 340rpx;
					height: 240rpx;
					padding-left: 15rpx;

					.title {
						line-height: 47rpx;
						font-size: 35rpx;
						font-weight: 400;
						margin-bottom: 10rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.otherInfo {
						height: 35rpx;
						line-height: 35rpx;
						font-size: 25rpx;
						margin-top: 5rpx;
						color: #9C9492;
						display: flex;
						white-space: nowrap;
						
						.companyNameTemp{
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							display: inline-block;
						}
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
