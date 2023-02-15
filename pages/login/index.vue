<template>
	<view>
		<uni-nav-bar fixed height="46" left-text="我的" statusBar></uni-nav-bar>
		<Login v-if="login"></Login>
		<MineCompany v-else-if="MineCompany"></MineCompany>
		<Mine ref="mine" v-else></Mine>
	</view>
</template>

<script>
	import Mine from "./mine/mine.vue"
	import Login from "./login.vue"
	import MineCompany from "./mineCompany/mineCompany.vue"
	export default {
		data() {
			return {
			}
			},
			onShow() {
				if(this.$refs.mine&&this.$store.state.hasLogin&&!this.$store.state.token){
					this.$refs.mine.getUserIntegral();
					this.$refs.mine.getData();
				}
			},
			onHide() {
			},
		components:{Mine,Login,MineCompany},
		created() {
		},
		onPullDownRefresh(){
			if(this.$store.state.hasLogin&&!this.$store.state.token){
				this.$refs.mine.getUserIntegral();
				this.$refs.mine.getData();
			}
			
			uni.stopPullDownRefresh()
		},
		computed:{
			login(){
				return !this.$store.state.hasLogin;
			},
			MineCompany(){
				return this.$store.state.hasLogin&&this.$store.state.token
			}
		}
		}
</script>

<style>
	page{
		background-color: #F9f9f9;
	}
</style>
