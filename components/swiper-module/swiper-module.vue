<!-- 
	组件名称：轮播图组件
	组件路径：@/components/swiper-module/swiper-module.vue
	参数个数：1
	参数内容：
		参数1：{
			String imgUrl
			String path
		}
		
		zyj修改
		 @click="swiperDetail(data)"
-->
<template>
	<view class="page">
		<swiper indicator-dots circular autoplay interval="2000">
			<swiper-item v-for="(item, index) in swiperList" :key="index" @click="swiperDetail(item.path)"><image :src="item.imgUrl"></image></swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	props: ['swiperList'],
	methods: {
		swiperDetail(url) {
			uni.navigateTo({
				url: url,
				fail: err => {
					console.error(err);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.page {
	width: inherit;

	// border: 1px solid #000000;
	swiper {
		//background-color: #ffffff;
		width: 100%;
		height: 370rpx;
		margin: 25rpx auto;
		padding-bottom: 30rpx;
		image {
			width: 100%;
			height: 100%;
			border-radius: 35px;
		}
	}
}
</style>
