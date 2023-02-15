<template>
	<view>
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="绿色凭证发行排行" leftWidth="200px"
			statusBar>
		</uni-nav-bar>

		<!-- 主体 -->
		<view class="page">
			<!-- 排名展示 -->
			<view class="rankBox" v-if="projectNames.length != 0">
				<view class="rankTitle">实时排名</view>
				<!-- 图表框 -->
				<view class="charts-box">
					<qiun-data-charts type="column" :eopts="columneopts" :chartData="chartData" :echartsH5="true"
						:echartsApp="true" :tooltipFormat="tooltipFormatTemp" />
				</view>
				<view class="rankTemp">
					<view class="rankItem" v-for="(item,index) in projectNames">
						<text class="index">{{index+1}}、</text> {{item}}
						<!-- <text class="hot" v-if="index<3">热</text> -->

						<!-- 分割线 -->
						<view class="itemHr">

						</view>
					</view>
				</view>
			</view>

			<view class="bottomBar" v-else>
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	import eCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/config-echarts.js';
	import {
		back
	} from '@/utils/public.js';

	export default {
		data() {
			return {
				dataList: [],
				chartData: {},
				// 对象
				categoriesData: [],
				// 数据值
				seriesData: [],
				// 纵轴
				y: 0,
				// 项目名称
				projectNames: [],
				tooltipFormatTemp: "tooltipTemp1",
				columneopts: {
					grid: {
						left: '3%',
						right: '4%',
						bottom: 10,
						top: -20,
						containLabel: true,
						tooltip: {
							show: false,
							trigger: "axis",
						}
					},
					xAxis: {
						type: 'value',
						show: false,
						axisLine: {
							show: true
						},
						axisTick: {
							show: true,
							alignWithLabel: true
						},
						position: "top",
						boundaryGap: [0, 0.01],
						axisLabel: {
							rotate: 20
						},

					},
					yAxis: {
						type: 'category',
						inverse: true,
						axisLine: {
							show: true
						},
						axisTick: {
							show: true,
							alignWithLabel: true
						},
						axisPointer: {
							show: true,
							type: "shadow"
						},
					},
					//series模板，会覆盖至chartData中的series中的每一个数组内
					seriesTemplate: {
						"label": {
							"show": true,
							"color": "#666666",
							"position": 'right',
						},
						"barWidth": 5,



					}
				},
			}
		},
		onLoad() {
			eCharts.formatter[this.tooltipFormatTemp] = (item, category, index, opts) => {
				return `${item[0].data.name}  产出总数量:${item[0].data.value}个`;
			};
		},
		created() {
			this.getRank()
		},
		watch: {
			dataList: "getchartData"
		},
		methods: {
			// 给图表赋值
			getchartData() {
				this.chartData = {
					categories: this.categoriesData,
					series: [{
						data: this.seriesData,
					}, ]
				}
			},
			// 发行排行数据查询
			getRank() {
				this.$request({
						path: "/api/rank/publishRank", // 路径
						method: 'GET', // GET、POST方法
					})
					.then(res => {
						let data = res.data
						data.forEach(item => {
							let obj = {}
							obj.value = item.outputTotal / 100
							obj.name = item.projectName
							this.seriesData.push(obj)
							this.y++
							this.categoriesData.push(this.y)
							this.projectNames.push(item.projectName)
						})
						this.dataList = data
					})
					.catch(reason => {
						// 失败回调
						console.log('请求失败');
					});
			},
			// 返回
			back() {
				back();
			}
		}
	}
</script>

<style lang="less">
	page {
		background-color: #F9F9F9;

	}

	.bottomBar {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 28rpx;
		color: #999;
	}

	.hotStyle() {
		background-color: #F60;
		display: inline-block;
		padding: 0 2px;
		text-align: center;
		vertical-align: middle;
		font-style: normal;
		color: #fff;
		overflow: hidden;
		line-height: 16px;
		height: 16px;
		font-size: 12px;
		border-radius: 4px;
		font-weight: 200;
		margin-left: 6px;
	}

	.page {
		background-color: #F9F9F9;
		padding-bottom: 30rpx;



		// 排名
		.rankBox {
			margin-top: 20rpx;
			background-color: #FFFFFF;
			padding: 15rpx 25rpx;
			border-radius: 25rpx;

			.rankTitle {
				margin-bottom: 15rpx;
				font-size: 38rpx;
			}

			.charts-box {
				width: 100%;
				height: 300px;
				background-color: #FFFFFF;
				border-radius: 25rpx;
			}

			.rankTemp {
				.rankItem {
					margin-top: 20rpx;
					font-size: 28rpx;
					line-height: 55rpx;

					.index {
						color: #9195A3;
					}

					.itemHr {
						width: 100%;
						border: 1rpx solid;
						background-color: #9195A3;
						opacity: 0.1;
					}

					&:nth-child(1) {
						.index {
							color: #FE2D46;
						}

						// .hot {
						// 	.hotStyle();
						// }
					}

					&:nth-child(2) {
						.index {
							color: #F60;
						}

						// .hot {
						// 	.hotStyle();
						// }
					}

					&:nth-child(3) {
						.index {
							color: #FAA90E;
						}

						// .hot {
						// 	.hotStyle();
						// }
					}
				}
			}
		}
	}
</style>
