<template>
	<view>
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="兑换详情"   statusBar></uni-nav-bar>
		<view class="page">
			<view class="details-wrap">
				<view class="list">
					<view class="list-item-left"><image style="width: 153px;height: 113px;border-radius: 10px;" :src="dataInfo.voucherImgUrl" mode=""></image></view>
					<view class="list-item-right">
						<view class="list-item-right-top">
							<view class="list-item-con-project-name">{{ dataInfo.voucherName }}</view>
						</view>
						<view class="list-item-right-bottom">
							<view class="list-item-right-bottom-left">
								<span style="font-size: 22px;">{{ dataInfo.voucherRequiredPoints }}</span>
								<span style="font-size: 12px;">{{ `绿电积分` }}</span>
							</view>
							<view class="list-item-right-bottom-right">
								<span style="position: relative;bottom: -2px;">{{ `待兑` + dataInfo.voucherInventory + `张` }}</span>
							</view>
						</view>
					</view>
				</view>
				<view style="background-color: white;margin-top: 20px;margin-bottom: 20px;padding: 10px;height: 300px;border-radius: 10px;">
					<view>兑换须知</view>
					<svg xmlns="http://www.w3.org/2000/svg" style="overflow: visible; filter: none;height: 10px;">
						<path d="M 0 0.5 L 330 0.5" stroke="rgba(187,187,187,1)" stroke-width="1px" stroke-dasharray=""></path>
						<path d="M 0 0.5 L 330 0.5" stroke="transparent" stroke-width="10" style="pointer-events: auto;"></path>
					</svg>
					<view v-html="dataInfo.exchangeNotes" class="describe"></view>
				</view>
				<view class="submit">
					<view>代金券兑换后不支持退换，请您按需兑换。</view>
					<button block style="background-color: #18BC37;color: white;" @click="toExchangeHandle">去兑换</button>
				</view>
				<!-- 操作面板 -->
				<uni-popup ref="popup">
					<view style="text-align: center;background-color: #F9F9F9;font-size: 44rpx;padding-top: 20rpx;">
						选择兑换数量
						<span @click="close()" style="width: 100%; height: 100%; min-width: 48rpx; min-height: 48rpx;position: relative;right: -200rpx;">
							X
						</span>
					</view>
					<view class="content">
						<view class="content-left mr12"><img style="width: 200rpx;height: 200rpx;" :src="dataInfo.voucherImgUrl" alt="" /></view>
						<view class="content-right">
							<view class="c-green mb8">
								<span>{{ dataInfo.voucherRequiredPoints }}</span>
								<span>绿电积分</span>
							</view>
							<view class="c-des font-11 mb8">
								<span class="mr16" style="margin-right: 20px;">可用积分：{{ integral }}</span>
								<span>待兑{{ dataInfo.voucherInventory }}张</span>
							</view>
							<uni-number-box v-model="count" type="number" :min="1" :max="dataInfo.voucherInventory" integer />
						</view>
					</view>
					<button style="background-color: #18BC37;color: white;" @click="onBuy">确定</button>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script>
// const describe = [
//   "1、优惠券兑换后无法退订，优惠券兑换后无法退订，优惠券兑换后无法退订。",
//   "2、兑换实物商品时，我们将对您的资料以及积分来源进行审查。",
//   "3、实物商品兑换并审核兑换信息后一般将在15个工作日内发出（港澳台及国外地区暂不支持配送）。",
//   "4、为保障您的权益，商品到货后请当场验货并本人签收，如发现货物损坏，请直接拒收退回，我们将为您安排重新发货。",
//   "5、检查包装外观是否有损坏；检查商品外观是否有损坏；如商品因物流造成损坏请拒收，并立刻与客服联系；如商品无误请本人签收。",
//   "6、功能性故障需要经由生产厂家指定或特约售后服务中心检测确认，并出具检测报告。"
// ];
import { str } from './vHtml';
import { back } from '@/utils/public.js';

export default {
	components: {},
	data() {
		return {
			dataInfo: {},
			describe: str,
			count: 1,
			commodityId: '',
			UserIntegral: '',
			orderId: ''
		};
	},
	computed: {
		// 用户积分
		integral() {
			if (!this.UserIntegral) return '-';
			return this.UserIntegral.userIntegral;
		},
		totalIntegral() {
			return this.dataInfo.voucherRequiredPoints * this.count;
		},
		userId() {
			return uni.getStorageSync('userId');
		},
		phone() {
			return uni.getStorageSync('phone');
		},
		voucherId() {
			return uni.getStorageSync('voucherId');
		}
	},
	onLoad(option) {
		if (option.id) this.commodityId = option.id;
		this.getData();
		this.getIntegral();
	},
	async created() {},
	methods: {
		back(){
			back()
		},
		toExchangeHandle() {
			// 用户未登录
			if (!this.userId)
				return uni.switchTab({
					url: '/pages/login/index'
				});
			//库存0张
			let { voucherInventory } = this.dataInfo;
			if (!voucherInventory)
				return uni.showModal({
					content: '暂无库存',
					showCancel: false
				});
			this.$refs.popup.open('bottom');
			this.count = 1;
		},
		// 确认兑换
		async onBuy() {
			this.show = false;
			// 用户可用积分小于兑换需要积分弹出积分不足
			if (this.integral < this.totalIntegral) return this.cantBuy();
			this.$request({
				path: '/api/payment/voucherRollback', // 路径
				method: 'GET', // GET、POST方法
				params: { orderId: this.voucherId } // 参数
			});
			let { voucherRequiredPoints, id } = this.dataInfo;
			let params = {
				price: voucherRequiredPoints,
				exchangeTotal: this.count,
				purchaserId: this.userId,
				exchangeTotalPrice: this.totalIntegral,
				voucherStockId: id
			};
			let res = await this.$request({
				path: '/api/clientCancelAfterVerification/userVouchersExchange', // 路径
				method: 'POST', // GET、POST方法
				params: params // 参数
			});
			this.orderId = res.data.orderId;
			this.$store.commit('setVoucherId', this.orderId);
			// 用户可以兑换
			this.ConfirmBuy();
		},
		// 获取用户可用积分
		async getData() {
			let params = {
				commodityId: this.commodityId
			};
			const res = await this.$request({
				path: '/api/show/commodityDetails', // 路径
				method: 'GET', // GET、POST方法
				params: params // 参数
			});
			this.dataInfo = res.data;
			// 根据换行符分割兑换须知
			// this.dataInfo.exchangeNotes = res.data.exchangeNotes.split(/[\s\n]/);
		},
		// 确定兑换
		ConfirmBuy() {
			let that = this;
			uni.showModal({
				title: '确定兑换积分？',
				content: '完成本次优惠券兑换需要' + this.totalIntegral + '个绿电积分，且兑换后不可退订？是否继续兑换优惠券？',
				success: function(res) {
					if (res.confirm) {
						that.userExchange();
					} else if (res.cancel) {
					}
				}
			});
		},
		close() {
			this.$refs.popup.close();
		},
		// 积分不足无法兑换
		cantBuy() {
			uni.showModal({
				content: '抱歉，您的绿电积分不足，无法兑换优惠券。如需兑换，请到首页购买绿电积分。',
				showCancel: false
			});
		},
		// 获取用户可用积分
		getIntegral() {
			let { userId } = this;
			this.$request({
				path: '/api/show/selectUserIntegral', // 路径
				method: 'GET', // GET、POST方法
				params: { userId } // 参数
			}).then(res => {
				let data = res.data;
				this.UserIntegral = data;
			});
		},
		// 核销兑换
		async userExchange() {
			let { orderId } = this;
			//核销上链
			this.$request({
				path: '/api/clientCancelAfterVerification/writeOffOnChain', // 路径
				method: 'GET', // GET、POST方法
				params: { orderId } // 参数
			}).then(res1 => {
				// 上链成功更新数据
				if (res1.data) {
					uni.showModal({
						content: '兑换成功。',
						showCancel: false
					});
					this.getData();
					this.getIntegral();
					uni.navigateTo({
						url: `/pages/login/mine/yhj-details?id=${orderId}`
					});
				} else {
					uni.showModal({
						content: '兑换失败。',
						showCancel: false
					});
				}
			});
		}
	}
};
</script>

<style lang="less">
page {
	background-color:#F9F9F9;
	padding: 0;
	margin: 0;
}
/* table 样式 */
/deep/ .describe {
	table {
		border-top: 2rpx solid #ccc;
		border-left: 2rpx solid #ccc;
	}
	table td,
	table th {
		border-bottom: 2rpx solid #ccc;
		border-right: 2rpx solid #ccc;
		padding: 6rpx 10rpx;
	}
	table th {
		border-bottom: 4rpx solid #ccc;
		text-align: center;
	}

	/* blockquote 样式 */
	blockquote {
		display: block;
		border-left: 16rpx solid #d0e5f2;
		padding: 10rpx 20rpx;
		margin: 20rpx 0;
		line-height: 1.4;
		font-size: 100%;
		background-color: #f1f1f1;
	}

	/* code 样式 */
	code {
		display: inline-block;
		zoom: 1;
		background-color: #f1f1f1;
		border-radius: 3px;
		padding: 6rpx 10rpx;
		margin: 0 6rpx;
	}
	pre code {
		display: block;
	}

	/* ul ol 样式 */
	ul,
	ol {
		margin: 20rpx 0 20rpx 40rpx;
	}
}
.details-wrap {
	padding-top: 20rpx;
	background: #F9F9F9;
	padding-bottom: 160rpx;
}
.submit {
	width: 100vw;
	position: fixed;
	bottom: 0;
	left: 0;
	font-size: 12px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #999999;
	line-height: 16px;
	text-align: center;
	background-color: #f9f9f9;
	& > view:first-child {
		padding: 8px 0;
	}
	/deep/ .button--default {
		font-size: 18px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #ffffff;
		line-height: 22px;
		background-color: #6cba18;
		// margin-top: 16px;
	}
}
.content {
	background-color: #F9F9F9;
	padding: 16px 0;
	display: flex;

	&-left {
		width: 100px;
		height: 113px;
		border-radius: 3px;
		overflow: hidden;
		padding-left: 20px;
		img {
			width: 153px;
			height: 113px;
		}
	}
	&-right {
		padding-left: 10px;
		.mb8 {
			padding-bottom: 10px;
		}
	}
}

// 商品
.list {
	padding-top: 14px;
	background-color: #ffffff;
	height: 127px;
	border-radius: 10px;
	&-item {
		background-color: #ffffff;
		position: relative;
		border-radius: 25rpx;

		&-left {
			position: absolute;
			height: 153px;
			width: 113px;
			left: 15px;
		}

		&-right {
			line-height: 65rpx;
			width: 380rpx;
			position: relative;
			left: 160px;
			text-align: center;
			&-top {
				display: flex;
				margin-top: 10px;
				height: 60px;
				font-size: 18px;
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

			&-bottom {
				display: flex;

				&-left {
					color: #00aa00;
				}

				&-right {
					font-size: 12px;
					margin-left: 20px;
				}
			}
		}
	}
}
.c-green {
	color: green;
}
</style>
