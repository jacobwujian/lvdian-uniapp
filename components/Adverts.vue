<!-- import Adverts from "@/components/Adverts.vue" 
	写死的轮播图
-->
<template>
<view>
	<swiper indicator-dots circular autoplay interval="2000">
		<swiper-item>
			<image  src="https://s2.loli.net/2022/01/11/FUMsCXtfEl4P9dx.png"></image>
		</swiper-item>
		<swiper-item>
			<image  src="https://s2.loli.net/2022/01/11/I68Q5piUVLdb2yj.png"></image>
		</swiper-item>
	</swiper>
</view>
</template>

<script>
export default {
}
</script>

<style lang="less">
		swiper {
			width: 100%;
			height: 252rpx;
			margin: 25rpx auto;

			image {
				width: 700rpx;
				height: 252rpx;
				border-radius: 35px;
			}
		}
</style>
