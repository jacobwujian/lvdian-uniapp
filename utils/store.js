import { request } from "@/utils/request.js"

// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export function setStorage(key, data){
	uni.setStorage({
		key: key,
		data: data,
		success: (res) => {
		}
	})
}

export function getStorage(key){
     return uni.getStorageSync(key)
}
const store = new Vuex.Store({
// #endif
// #ifdef VUE3
import { createStore } from 'vuex'

const store = createStore({
// #endif
	state: {
		// 用户id
		userId: getStorage("userId"),
		// 用户手机号
		phone: getStorage("phone"),
		// 用户信息
		userInfo: getStorage("userInfo"),
		token: getStorage("token"),
		// 订单id：生成订单之前销毁上一条生成的订单id
		orderId: "",
		voucherId: "",
		orderInfo: getStorage("orderInfo"),
		firstEnter: getStorage("enter") || 0,
		isShowActivity: false, //首页活动说明显隐
		hasLogin: getStorage("hasLogin"),
	},
	mutations: {
		setUser(state, params) {
		  // 保存userId, phone
		  setStorage("userId", params.userId);
		  setStorage("phone", params.phone);
		  setStorage("hasLogin", true);
		  state.userId = params.userId;
		  state.phone = params.phone;
		  state.hasLogin = true;
		},
		logout(state) {
		  // uni.storage.clear();
		  setStorage("userId",null);
		  setStorage("phone", null);
		  setStorage("hasLogin", false);
		  setStorage("userInfo", {});
		  setStorage("token", null);
		  state.userId = null;
		  state.phone = null;
		  state.userInfo = {};
		  state.token = null;
		  state.hasLogin = false;
		},
		setToken(state, token) {
		  state.token = token;
		  state.hasLogin = true;
		  setStorage("token", token);
		  setStorage("hasLogin", true);
		},
		setVoucherId(state, voucherId) {
		  state.voucherId = voucherId;
		},
		setShowActivity(state, value) {
		  state.isShowActivity = value;
		},
		setFirstEnter(state) {
		  if (!state.firstEnter) {
		    state.firstEnter = 1;
		    state.isShowActivity = true;
		    setStorage("enter", 1);
		  }
		},
		getUserInfo(state) {
		  return new Promise((resolve, reject) => {
			  request({
			  	path: '/api/user/accountDetail',
			  	method: 'GET',
			  	params:{},
				header:{'Authorization':state.token}
			  }).then((res) => {
		        if(res.status){
		        if (res.status === 0){
		          res.permissionCodes =['organizationEdit', 'organizationDetail', 'dealDetail']
		        }
		        state.userInfo = res.data;
		        setStorage("userInfo", res.data)
		        resolve(res);
		        }
		      })
		      .catch((err) => {
		        reject(err);
		      })
		  })
		}
	},
	actions: {
		// lazy loading openid
	}
})

export default store
