<template>
	<view>
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="碳排计算"  statusBar></uni-nav-bar>

<image class="backGroundImg" src="../../static/img/mall/green_elec.png"></image>
		<!-- 主体 -->
		<view class="page">
			<view style="text-align: center;">绿色电力与二氧化碳减排量换算</view>

			<view class="selecttop" >
				<span>区域选择：</span>
				<easySelect
					class="easyH52"
					size="small"
					:value="area"
					:options="areaList"
					@selectOne="
						e => {
							area = e.value;
						}
					"
				/>
			</view>
			<view class="selecttop">
				<span>绿色电力：</span>
				<input class="input" type="number" v-model="num" @blur="bulr()" />
			</view>
			<view class="selecttop">
				<span>电量单位：</span>
				<easySelect
					class="easyH52"
					size="small"
					:value="itNum"
					:options="[{ value: 1, label: '度' }]"
					@selectOne="
						e => {
							itNum = e.value;
						}
					"
				/>
			</view>
			<view class="selecttop">
				<span>质量单位：</span>
				<easySelect
					class="easyH52"
					size="small"
					:value="gNum"
					:options="[{ value: 1, label: '吨' }, { value: 2, label: '千克' }]"
					@selectOne="
						e => {
							gNum = e.value;
						}
					"
				/>
			</view>
		</view>
		<view  class="bottomText">
			
			<view style="font-size: 12px;font-weight: 400;color: rgb(115, 115, 115);margin-bottom: 10rpx;">{{ areaLabel }}区域换算结果</view>
			<view style="text-align: center;font-weight: 400;">{{ num }}&nbsp;{{ itNum == 1 ? '度' : '度' }}绿色电力&#12288;=&#12288; 减排{{ resNum/1000 }}&nbsp;{{ gNum == 1 ? '吨' : '千克' }}二氧化碳</view>
		</view>
		<view class="bottomButton">
			<button class="bottomButton" @click="search()">转换</button>
		</view>
	</view>
</template>

<script>
import { back } from '@/utils/public.js';
import easySelect from '@/components/easy-select/easy-select.vue';

export default {
	components: {
		easySelect
	},
	data() {
		return {
			areaList: [
				{ value: 1, label: '东北' },
				{ value: 2, label: '华北' },
				{ value: 3, label: '华东' },
				{ value: 4, label: '华中' },
				{ value: 5, label: '西北' },
				{ value: 6, label: '南方' }
			],
			area: 2,
			num: 1000,
			gNum: 1,
			itNum: 1,
			resNum: 0
		};
	},
	created() {
		this.search();
	},
	computed: {
		areaLabel() {
			return this.areaList.filter(e => {
				if (e.value == this.area) {
					return e.label;
				}
			})[0].label;
		}
	},
	methods: {
		// 给图表赋值
		getchartData() {
			this.chartData = {
				categories: this.categoriesData,
				series: [
					{
						data: this.seriesData
					}
				]
			};
		},
		// 发行排行数据查询
		publishRank() {
			this.$request({
				path: '/api/rank/publishRank', // 路径
				method: 'GET' // GET、POST方法
			})
				.then(res => {
					let data = res.data;
					data.forEach(item => {
						this.categoriesData.push(item.projectName);
						this.seriesData.push(item.outputTotal);
					});
					this.dataList = data;
				})
				.catch(reason => {
					// 失败回调
					console.log('请求失败');
				});
		},
		bulr() {
			if (this.num == null || this.num == undefined || this.num == '' || this.num < 0) {
				this.num = 0;
			} else {
			}
		},
		search() {
			let path = '/api/CarbonCalc/computeCarbon';
			this.$request({
				path: path, // 路径
				method: 'Post', // GET、POST方法
				params: {
					area: this.area,
					num: this.num,
					gnum: this.gNum,
					itNum: this.itNum
				} // 参数
			})
				.then(value => {
					// 成功回调
					this.resNum = Math.round(value.data.resNum * 100) / 100;
				})
				.catch(reason => {
					// 失败回调
					console.log('请求失败');
				});
		},
		back() {
			back();
		}
	}
};
</script>

<style lang="less">
page {
	background-color: #f9f9f9;
}
.backGroundImg{
	width: 750rpx;
	height: 500rpx;
	position: relative;
	top: 0;
	left: 0;
}
.bottomButton {
	background-color: #6cba18;
	color: white;
	position: fixed;
	display: block;
	width: 750rpx;
	/deep/ uni-button{
		width: 750rpx;
		background-color: #6cba18;
			color: white;
	}

	bottom: 0rpx;
}
.border() {
	border: 1px solid;
}
.easyH5 {
	// #ifndef H5
	padding-top: 6rpx;
	padding-bottom: 12rpx;
	// #endif
	border: none;
	border-radius: 10rpx;

}
.easyH52 {
	// #ifndef H5
	padding-top: 6rpx;
	padding-bottom: 12rpx;
	// #endif
	border: none;
	border-radius: 10rpx;
	margin-left: 20rpx;

}
.page {
	position: relative;
	top: -120rpx;
	background-color: #ffffff;
	width: 650rpx;
	height: 360rpx;
	border-radius: 30rpx;
	padding: 28rpx;
}
.header {
	width: 522rpx;
	text-align: center;
	font-weight: 400;
	font-size: 18px;
	color: rgb(16, 16, 16);
	background-color: #ffffff;
	line-height: 26px;
}
.selecttop {
	margin-top: 20rpx;
	border-bottom: #888 1px solid;
	select {
		width: 400rpx;
		height: 60rpx;
		font-size: 28rpx;
		background-color: #ffffff;
		border-color: rgb(187, 187, 187);
		border-width: 1px;
		border-style: solid;
		border-radius: 12rpx;
		border: none;
		color: #888;
		padding-left: 20rpx;
	}
	span {
		margin-left:130rpx;
		width: 300rpx;
		text-align: center;
		font-size: 28rpx;
		color: rgb(16, 16, 16);
		background-color: #ffffff;
		line-height: 26px;
		margin-right: 70rpx;
	}
	.input {
		padding-left: 20rpx;
		display: inline-block;
		position: relative;
		top: 20rpx;
		width: 170rpx;
		height: 38rpx;
		font-size: 28rpx;
		color: #888;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}
}

.bottomText {
	background-color: #ffffff;
	padding: 20rpx;
	margin-top: 60rpx;
	margin-left: 2.5%;
	width: 90%;
	height: 130rpx;
	font-size: 14px;
	text-align: left;
	font-weight: normal;
	font-style: normal;
	line-height: 60rpx;
	margin-bottom: 5px;
	font-size: 16px;
	color: rgb(16, 16, 16);
	font-style: normal;
	letter-spacing: 0px;
	line-height: 23px;
	text-decoration: none;
		border-radius: 30rpx;
}
</style>
