<script>
	import store from "./utils/store.js"
export default {
	onLaunch: function() {
	},
	onShow: function() {
	},
	onHide: function() {
	},
	created() {
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
.header {
	z-index: 998;
	box-sizing:border-box;
	display: block;
	position: fixed;
	width: 375px;
	height: 46px;
	background-color: rgb(247, 247, 250); 
	border-style: none;
	border-color: unset;
	font-size: 20px;
	padding: 0px;
	text-align: left;
	padding-left: 3px;
	line-height: 46px;
	font-weight: normal;
	font-style: normal;
}
.page {
	// border: 1px solid #000000;
	width: 700rpx;
	margin: 10rpx auto;
	background-color:#F9F9F9;
}

::-webkit-scrollbar{ display: none; }
</style>
