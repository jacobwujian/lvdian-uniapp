// 服务端地址
const URL = "http://192.168.31.216"
export const BASE_URL = URL+':8081';
export const FONT_BASE_URL = URL+':8080';
// 超时时间
const BASE_TIMEOUT = 30000

import Store from "@/utils/store.js"

export const request = (options)=>{
	let that = this
	return new Promise((resolve, reject)=>{
		uni.request({
			url: BASE_URL + options.path,
			method: options.method || 'GET',
			data: options.params || {},
			header:options.header,
			timeout: BASE_TIMEOUT,
			success: ({data:res}) => {
				if(res.status === 401 &&res.error === 'token invalid'){
					Store._mutations.logout[0]()
				}
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}