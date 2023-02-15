<template>
	<view>
		<uni-nav-bar leftIcon="back" @clickLeft="back()" height="46" fixed left-text="机构管理" rightText="保存" @clickRight="submit"
			statusBar></uni-nav-bar>

		<uni-forms class="form" ref="form" :modelValue="dataInfo" :rules="rules" label-position="top" :labelWidth="300"
			validate-trigger="bind">
			<uni-forms-item label="公司名称" labelText="16px" required name="companyName">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" type="text"
					v-model="dataInfo.companyName" placeholder="请输入公司名称" />
			</uni-forms-item>
			<uni-forms-item label="统一社会信用代码" labelText="16px" required name="socialCreditCode">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" :disabled="true"
					type="text" v-model="dataInfo.socialCreditCode" placeholder="请输入统一社会信用代码" />
			</uni-forms-item>
			<view @click="addressShow = true">
				<uni-forms-item labelText="16px" label="公司地区" required name="companyArea">
					<view style="font-size: 16px; border-bottom: 1px solid rgb(187, 187, 187);">
						{{ areaLabel }}
						<pickerAddress v-model="addressShow" @confirm="addresspick" />
					</view>
				</uni-forms-item>
			</view>
			<uni-forms-item labelText="16px" label="公司地址" required name="address">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" class="uni-input"
					type="text" v-model="dataInfo.address" placeholder="请输入公司地址" />
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="法人姓名" required name="legalPerson">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" class="uni-input"
					type="text" v-model="dataInfo.legalPerson" placeholder="请输入法人姓名" />
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="法人身份证号" required name="legalPersonIdCard">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" class="uni-input"
					type="idcard" v-model="dataInfo.legalPersonIdCard" placeholder="请输入法人身份证号" />
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="营业执照" required name="businessLicense">
				<uni-file-picker class="ceshi" :list-styles="liststyles" title="请选择要上传的营业执照" limit="1"
					v-model="imageSum" fileMediatype="all" @select="selectFile">
					<button v-if="imageSum.length === 0" style="margin-left: 250rpx;" type="primary" plain="true"
						size="mini">请上传营业执照</button>
					<image v-else :src="fileSrc"></image>
				</uni-file-picker>
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="联系人姓名" required name="contact">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" type="text"
					v-model="dataInfo.contact" placeholder="请输入联系人姓名" />
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="联系方式" required name="phone">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" type="tel"
					v-model="dataInfo.phone" placeholder="请输入联系方式" />
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="邮箱" required name="mail">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" type="text"
					v-model="dataInfo.mail" placeholder="请输入邮箱" />
			</uni-forms-item>
			<uni-forms-item labelText="16px" label="本年度配额(MV·h)" required name="annual">
				<uni-easyinput :styles="{'borderColor':'rgb(187, 187, 187)'}" fontSize="16px" type="digit"
					v-model="dataInfo.annual" placeholder="请输入本年度配额(MV·h)" />
			</uni-forms-item>
		</uni-forms>

		<!-- <view style="text-align: center;">
			<button @click="submit"
				style="background-color: rgb(9, 196, 234);color: white;border-radius: 4px; font-size: 18px;"
				size="mini">保存修改</button>
		</view> -->
	</view>
</template>

<script>
	import Base64JS from '@/utils/base64.js';
	import pickerAddress from '@/components/liudx-pickerAddress/index.vue';
	import {
		codeToText
	} from '@/utils/cascader-address-options.js';
	import {
		BASE_URL
	} from '@/utils/request.js';
	import {
		back
	} from '@/utils/public.js';

	export default {
		components: {
			pickerAddress
		},
		data() {
			return {
				imageSum: [],
				imageUrl: '',
				dataInfo: {},
				addressShow: false,
				areaLabel: '请选择地区',
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
				areaList: {
					province: '',
					city: '',
					area: ''
				},
				rules: {
					// 对name字段进行必填验证
					companyName: {
						rules: [{
							required: true,
							errorMessage: '请输入公司名称'
						}]
					},
					address: {
						rules: [{
							required: true,
							errorMessage: '请输入公司地址'
						}]
					},
					legalPerson: {
						rules: [{
							required: true,
							errorMessage: '请输入法人姓名'
						}]
					},
					legalPersonIdCard: {
						rules: [{
								required: true,
								errorMessage: '请输入法人身份证号'
							},
							{
								minLength: 18,
								maxLength: 18,
								errorMessage: '姓名长度在 {minLength} 个字符'
							}
						]
					},
					businessLicense: {
						rules: [{
							required: true,
							errorMessage: '请选择要上传的营业执照'
						}]
					},
					contact: {
						rules: [{
							required: true,
							errorMessage: '请输入联系人姓名'
						}]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: '请输入联系人手机'
						}]
					},
					annual: {
						rules: [{
							required: true,
							errorMessage: '请输入本年度配额(MV·h)'
						}]
					},
					// 对email字段进行必填验证
					mail: {
						rules: [{
								required: true,
								errorMessage: '请输入公司名称'
							},
							{
								format: 'email',
								errorMessage: '请输入正确的邮箱地址'
							}
						]
					}
				}
			};
		},
		created() {
			this.getUserInfo();
		},
		computed: {
			fileSrc() {
				return this.imageUrl.replace(/[\r\n]/g, '');
			}
		},
		methods: {
			back() {
				back();
			},
			addresspick(obj) {
				console.log(obj);
				console.log(this.areaList);
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
				this.dataInfo.companyArea = this.areaList['area'].substr(0, 2) + ',' + this.areaList['area'].substr(0, 4) +
					',' + this.areaList['area'].substr(0, 6);
				console.log(this.dataInfo.companyArea);
			},
			selectFile(e) {
				e.tempFiles.forEach(item => {
					this.imageSum.push(item);
					this.uploadFile(item);
					this.imageUrl = item.path;
				});
			},
			uploadFile(file) {
				const that = this;
				uni.uploadFile({
					url: BASE_URL + '/api/common/oss/upload',
					filePath: file.path,
					name: 'file',
					success: uploadFileRes => {
						const objData = JSON.parse(uploadFileRes.data);
						if(objData.status === 200){
							let fileName = objData.data;
							// 把返回文件名存到数组中
							that.dataInfo.businessLicense = fileName;
						}else{
							that.imageSum = [];
						}
					}
				});

			},
			getUserInfo() {
				let that = this;
				uni.showLoading({
					title: '加载中'
				});
				this.$request({
					path: '/api/company/findCompany',
					method: 'GET',
					params: {
						pageNum: 1,
						pageSize: 10
					}, // 参数
					header: {
						Authorization: this.$store.state.token
					}
				}).then(res => {
					that.$request({
							path: '/api/company/baseInfoCompany',
							method: 'GET',
							params: {
								id: res.data.list[0].id
							}, // 参数
							header: {
								Authorization: this.$store.state.token
							}
						})
						.then(data => {
							that.dataInfo = {
								...data.data,
								id: res.data.list[0].id
							};
							that.dataInfo.annual = that.dataInfo.annual / 100;
							that.imageSum = [that.dataInfo.businessLicense];
							let areas = that.dataInfo.companyArea.split(',');
							that.areaLabel = codeToText(that.dataInfo.companyArea);
							that.$request({
								path: '/api/common/oss/getFileInfo',
								method: 'GET',
								params: {
									fileCode: that.dataInfo.businessLicense
								}, // 参数
								header: {
									Authorization: this.$store.state.token
								}
							}).then(result => {
								that.imageSum = [];
								that.imageSum.push({
									name: result.data.fileName,
									path: result.data.fileUrl
								});
								that.imageUrl = result.data.fileUrl;
								uni.hideLoading();
							});
						})
						.catch(e => {
							console.log(e);
						});
				});
			},
			submit() {
				this.$refs.form
					.validate()
					.then(res => {
						this.$request({
								path: '/api/company/updateCompany',
								method: 'POST',
								params: {
									...this.dataInfo,
									annual: 100 * this.dataInfo.annual
								}, // 参数
								header: {
									Authorization: this.$store.state.token
								}
							})
							.then(res => {
								if (res.status === 200) {
									uni.showModal({
										content: '保存成功！请等待管理员审核！',
										showCancel: false
									});
								}
							})
							.catch(e => {
								console.log(e);
							});
					})
					.catch(err => {
						return;
					});
			}
		}
	};
</script>

<style>
	.form {
		margin: 20rpx;
	}

	/deep/.uni-input-input .uni-input-border {
		padding: 0 10px;
		height: 35px;
		width: 100%;
		font-size: 16px;
		color: #666;
		border-radius: 5px;
		box-sizing: border-box;
	}

	/deep/ .is-input-border {
		border-bottom: 2rpx solid rgb(187, 187, 187);
	}
</style>
