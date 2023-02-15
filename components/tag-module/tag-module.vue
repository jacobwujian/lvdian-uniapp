<!-- 
	组件名称：标签
	组件路径：@/components/tag-module/tag-module.vue
	参数个数：2
	参数内容：
		object typeObj  需要展示的对象
		Number typeNum  对应的键
-->
<template>
	<view class="">
	<uni-tag size="small" :text="typeObj[typeNum]" style="font-weight: bold;" :type="typeNum == 0 ? 'success' : typeNum == 1 ? 'primary' : typeNum == 2 ? 'warning' : typeNum == 3 ? 'royal' : typeNum == 4 ? 'error' :'default'"></uni-tag>
	<!-- style="text-shadow: 0 1rpx 0 #FFFFFF;text-shadow: 0 -1px 0 #FFFFFF;text-shadow: 0 -1px 1px #FFFFFF;text-shadow: 0 1px 1px #FFFFFF;" -->
	<!-- -webkit-text-stroke:1px #FFFFFF; -->
	</view>
</template>

<script>
	export default {
		props: {
			typeObj:{
				type:Object,
				default:()=>{}
			},
			typeNum: {
				type: Number
			}

			
		},
		data() {
			return {}
		}
	};
</script>

<style>
</style>
