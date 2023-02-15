<template>
	<view>
		<!-- 导航栏 -->
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed :left-text="leftText" right-text="提交"
			@clickRight="submit">
		</uni-nav-bar>

		<!-- 主体 -->
		<view class="page">
			<view class="formBox">
				<uni-forms ref="form" :rules="rules" :modelValue="formData" label-position="top" :labelWidth="300"
					validate-trigger="bind">
					<uni-forms-item label="项目名称" labelText="16px" required name="projectName">
						<uni-easyinput fontSize="16px" :styles="easyInputStyle" type="text"
							v-model="formData.projectName" placeholder="请输入项目名称" />
					</uni-forms-item>

					<uni-forms-item label="机构名称" labelText="16px" required name="companyName">
						<uni-easyinput disabled fontSize="16px" :styles="easyInputStyle" type="text"
							v-model="formData.companyName" placeholder="请输入机构名称" />
					</uni-forms-item>

					<uni-forms-item label="统一社会信用代码" labelText="16px" required name="socialCreditCode">
						<uni-easyinput disabled fontSize="16px" :styles="easyInputStyle" type="text"
							v-model="formData.socialCreditCode" placeholder="请输入统一社会信用代码" />
					</uni-forms-item>
					<uni-forms-item label="申报日期" labelText="16px" name="applicationDate">
						<uni-datetime-picker type="date" v-model="applicationDateTemp" />
					</uni-forms-item>
					<uni-forms-item label="认证机构" labelText="16px" name="certificationAuthority">
						<uni-easyinput fontSize="16px" :styles="easyInputStyle" type="text"
							v-model="formData.certificationAuthority" placeholder="请输入认证机构" />
					</uni-forms-item>
					<uni-forms-item label="能源类型" labelText="16px" required name="energyType">
						<picker @change="energyTypePickerChange" :value="energyTypeIndex" :range="energyTypeArray">
							<view class="dropDownBox">
								{{energyTypeArray[energyTypeIndex] == undefined ? '请选择项目类型' : energyTypeArray[energyTypeIndex]}}
							</view>
						</picker>
					</uni-forms-item>
					<view @click="addressShow = true">
						<uni-forms-item labelText="16px" label="项目地区" required name="projectArea">
							<view style="font-size: 16px; border-bottom: 2px solid rgb(187, 187, 187);">
								{{ areaLabel }}
								<pickerAddress v-model="addressShow" @confirm="addresspick" />
							</view>
						</uni-forms-item>
					</view>
					<uni-forms-item label="项目周期" labelText="16px" name="periodTimeStart">
						<uni-datetime-picker v-model="range" type="daterange" />
					</uni-forms-item>
					<uni-forms-item label="方法学" labelText="16px" name="methodology">
						<uni-easyinput fontSize="16px" :styles="easyInputStyle" type="text"
							v-model="formData.methodology" placeholder="请输入方法学" />
					</uni-forms-item>
					<uni-forms-item label="联系人姓名" labelText="16px" required name="contact">
						<uni-easyinput fontSize="16px" :styles="easyInputStyle" type="text" v-model="formData.contact"
							placeholder="请输入联系人姓名" />
					</uni-forms-item>
					<uni-forms-item label="联系人方式" labelText="16px" required name="contactWay">
						<uni-easyinput fontSize="16px" :styles="easyInputStyle" type="text"
							v-model="formData.contactWay" placeholder="请输入联系人方式" />
					</uni-forms-item>
					<uni-forms-item label="认证等级" labelText="16px" required name="authenticationLevel">

						<uni-rate v-model="formData.authenticationLevel" />

					</uni-forms-item>
					<uni-forms-item label="项目图片" labelText="16px" required name="imgUrl">
						<uni-file-picker v-model="files" :list-styles="liststyles" limit="1" file-mediatype="all"
							@select="select" @delete="deleteFile">
							<button v-if="imgUrlHttp == ''" size="mini">请上传项目图片</button>
							<image v-else :src="imgUrlHttp"></image>
						</uni-file-picker>
					</uni-forms-item>
					<uni-forms-item label="项目类型" labelText="16px" required name="projectType">
						<picker @change="projectTypePickerChange" :value="projectTypeIndex" :range="projectTypeArray">
							<view class="dropDownBox">
								{{projectTypeArray[projectTypeIndex] == undefined ? '请选择项目类型' : projectTypeArray[projectTypeIndex]}}
							</view>
						</picker>
					</uni-forms-item>
					<uni-forms-item label="项目介绍" labelText="16px" name="projectDesc">
						<uni-easyinput class="proTemp" fontSize="16px" type="textarea" v-model="formData.projectDesc"
							placeholder="请输入项目介绍"></uni-easyinput>
					</uni-forms-item>
				</uni-forms>
			</view>

			<!-- 按钮 -->
			<!-- 			<view class="formBtns">
				<button type="primary" size="mini" @click="submit">提交</button>
				<button type="primary" size="mini" @click="reset">重置</button>
			</view> -->
		</view>

	</view>
</template>

<script>
	import {
		momentDate
	} from '@/utils/tools.js';
	import {
		codeToText
	} from '@/utils/cascader-address-options.js';
	import {
		back,
		projectType,
		energyTypes,
		projectStatus
	} from "@/utils/public.js"
	import pickerAddress from '@/components/liudx-pickerAddress/index.vue';
	import {
		BASE_URL
	} from "@/utils/request.js"
	export default {
		components: {
			pickerAddress
		},
		data() {
			return {
				// 上传样式
				liststyles: {
					// 是否显示边框
					border: false,
					// 是否显示分隔线
					dividline: false,
					// 线条样式
					borderStyle: {
						width: 1,
						color: 'blue',
						radius: 2
					}
				},
				// 图片回显
				imgUrlHttp: "",
				projectTypeArray: ['认证项目', '非认证项目'],
				projectTypeIndex: "",
				// 能源类型
				energyTypeArray: ['光伏', '风电', '水电'],
				energyTypeIndex: "",
				// 提交类别
				subType: "",
				// 项目id
				proId: '',
				// 表单校验规则
				rules: {
					projectName: {
						rules: [{
							required: true,
							errorMessage: '项目名称不能为空'
						}]
					},
					companyName: {
						rules: [{
							required: true,
							errorMessage: '机构名称不能为空'
						}]
					},
					socialCreditCode: {
						rules: [{
							required: true,
							errorMessage: '统一社会信用代码不能为空'
						}]
					},
					energyType: {
						rules: [{
							required: true,
							errorMessage: '能源类型不能为空'
						}]
					},
					projectArea: {
						rules: [{
							required: true,
							errorMessage: '项目地区不能为空'
						}]
					},
					contact: {
						rules: [{
							required: true,
							errorMessage: '联系人姓名不能为空'
						}]
					},
					contactWay: {
						rules: [{
							required: true,
							errorMessage: '联系人方式不能为空'
						}]
					},
					authenticationLevel: {
						rules: [{
							required: true,
							errorMessage: '认证等级不能为空'
						}]
					},
					imgUrl: {
						rules: [{
							required: true,
							errorMessage: '项目图片不能为空'
						}]
					},
					projectType: {
						rules: [{
							required: true,
							errorMessage: '项目类型不能为空'
						}]
					},

				},
				// 申报日期temp
				applicationDateTemp: "",
				// 上传图片回显
				files: [],
				// 项目周期临时储存
				range: [],
				// 地区相关
				addressShow: false,
				areaLabel: '选择地区',
				areaList: {
					province: '',
					city: '',
					area: ''
				},
				// 项目状态
				projectStatus,
				// 能源类型
				energyTypes,
				// 项目类型
				projectType,
				// 登录信息
				token: this.$store.state.token,
				// 输入框样式
				easyInputStyle: {
					'borderColor': 'rgb(187, 187, 187)'
				},
				// 表单数据
				formData: {
					projectName: "",
					companyName: "",
					socialCreditCode: "",
					energyType: "",
					projectArea: "",
					contact: "",
					contactWay: "",
					authenticationLevel: "",
					imgUrl: "",
					projectType: "",
					projectDesc: "本项目当前仅支持线下交易；",
				},
				// 导航栏文字
				leftText: "",
			}
		},
		onLoad(option) {
			if (option.type == 0) {
				this.leftText = "项目创建"
				this.subType = 0
			} else {
				this.leftText = "项目修改"
				this.subType = 1
				this.proId = option.proId
				this.projectDetail()
			}
		},
		created() {
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo != null) {
				this.formData.companyName = userInfo.companyName
				this.formData.socialCreditCode = userInfo.socialCreditCode
				this.formData.contact = userInfo.contact
				this.formData.contactWay = userInfo.contactWay
			}
		},
		watch: {
			range(newval) {
				this.formData.periodTimeStart = this.range[0]
				this.formData.periodTimeEnd = this.range[1]
			},
			applicationDateTemp(newval) {
				if (newval.length < 18) {
					let date = new Date
					this.formData.applicationDate = newval + " " + momentDate(date, "HH:mm:ss")
				} else {
					this.formData.applicationDate = newval
				}
			}
		},
		methods: {
			// 删除文件
			deleteFile(){
				this.imgUrlHttp =""
				this.files = []
			},
			// 项目类型下拉框
			projectTypePickerChange(e) {
				this.projectTypeIndex = e.target.value
				this.formData.projectType = e.target.value + 1
			},
			// 能源下拉框
			energyTypePickerChange(e) {
				this.energyTypeIndex = e.target.value
				this.formData.energyType = e.target.value
			},

			// 修改
			editProject() {
				this.formData.id = this.proId
				this.$request({
					path: "/api/ProjectManagement/editProject",
					method: "POST",
					header: {
						"Authorization": this.token
					},
					params: this.formData,
					// id
				}).then(value => {
					let status = value.status
					if (status == 200) {
						this.getPrompt("操作成功")
						setTimeout(() => {
							this.back()
						}, 800)
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			// 等待
			onLoading() {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
			},
			// 获取修改信息
			projectDetail() {
				this.onLoading()
				this.$request({
					path: "/api/ProjectManagement/projectDetail",
					header: {
						"Authorization": this.token
					},
					params: {
						projectId: this.proId
					}
				}).then(value => {
					let data = value.data
					// 给表单赋值
					this.formData.projectName = data.projectName
					this.formData.companyName = data.companyName
					this.formData.socialCreditCode = data.socialCreditCode
					this.applicationDateTemp = momentDate(data.applicationDate, "YYYY-MM-DD hh:mm:ss")
					this.formData.certificationAuthority = data.certificationAuthority
					this.energyTypeIndex = data.energyType
					this.formData.energyType = data.energyType
					this.formData.projectArea = data.projectArea
					this.areaLabel = codeToText(data.projectArea);
					this.range = [data.periodTimeStart, data.periodTimeEnd]
					this.formData.methodology = data.methodology
					this.formData.contact = data.contact
					this.formData.contactWay = data.contactWay
					this.formData.authenticationLevel = data.authenticationLevel
					// imgUrl  图片
					this.formData.imgUrl = data.imgUrl
					this.files = [{
						name: data.imgUrl
					}]
					this.projectTypeIndex = data.projectType - 1
					this.formData.projectType = data.projectType
					this.formData.projectDesc = data.projectDesc
					this.imgUrlHttp = data.imgUrlHttp

					// 停止加载动画
					setTimeout(() => {
						uni.hideLoading();
					}, 200)
				}).catch((reason) => {
					console.log(reason);
					this.getPrompt("请求错误", "none")
				})
			},
			// 重置按钮
			reset() {
				// 重置表单
				this.formData = {
					projectName: "",
					companyName: "",
					socialCreditCode: "",
					energyType: "",
					projectArea: "",
					contact: "",
					contactWay: "",
					authenticationLevel: "",
					imgUrl: "",
					projectType: "",
					projectDesc: "本项目当前仅支持线下交易；",
				}
				// 重置temp
				// 申报日期temp
				this.applicationDateTemp = ""
				// 上传图片回显
				this.files = []
				// 项目回显
				this.projectTypeIndex = ""
				// 能源回显
				this.energyTypeIndex = ""
				// 重置地区
				this.areaLabel = '选择地区'

				// 再执行一遍表单验证
				this.submit()
			},
			// 提示
			getPrompt(title, icon) {
				uni.showToast({
					title: title,
					icon: icon,
					mask: true
				})
			},
			// 上传方法
			async uploadFile(file, index) {
				const that = this;
				await uni.uploadFile({
					url: BASE_URL + '/api/common/oss/upload',
					filePath: file.path,
					name: 'file',
					success: uploadFileRes => {
						let fileName = JSON.parse(uploadFileRes.data).data;
						// 把返回文件名存到数组中
						that.formData.imgUrl = fileName
					}
				});

			},
			// 选择文件时触发
			select(e) {
				console.log(e);
				this.imgUrlHttp = e.tempFilePaths[0]
				console.log(this.imgUrlHttp);
				this.uploadFile(e.tempFiles[0])
			},
			// 地区选择
			addresspick(obj) {
				let arr = ['province', 'city', 'area'];
				let place = '';
				arr.map(key => {
					this.areaList[key] = obj[key].AreaId;
					if (key !== 'area') {
						place += obj[key].AreaName + ' - ';
					} else {
						place += obj[key].AreaName;
					}
				});
				this.areaLabel = place;
				this.formData.projectArea = this.areaList['area'].substr(0, 2) + ',' + this.areaList['area'].substr(0, 4) +
					',' + this.areaList['area'].substr(0, 6);
			},
			// 提交
			async submit() {
				this.$refs.form.validate().then(res => {
					if (this.subType == 0) {
						// 创建项目
						this.addPro()
					} else {
						// 修改项目
						this.editProject()
					}
				}).catch(err => {
					return
				})
			},
			// 添加项目
			async addPro() {
				const res = await this.$request({
					path: "/api/ProjectManagement/addProject",
					method: "POST",
					header: {
						"Authorization": this.token
					},
					params: this.formData
				})

				if (res.status != 200) {
					this.getPrompt(res.message, "error")
					return
				}
				this.getPrompt("提交成功", "success")
				setTimeout(() => {
					this.back()
				}, 800)
			},
			// 返回
			back() {
				back();
			},
		}
	}
</script>

<style lang="less">
	page {
		background-color: #FFFFFF;
	}

	// 主体
	.page {
		background-color: #FFFFFF;

		.formBox {
			.proTemp {
				border: 1px solid #F0F0F0;
			}

			.dropDownBox {
				font-size: 30rpx;
				padding: 8rpx;
				padding-left: 18rpx;
				border-bottom: 2px rgb(187, 187, 187) solid;

			}
		}

		.formBtns {
			padding-bottom: 30rpx;
			display: flex;
			justify-content: space-between;
		}


	}
</style>
