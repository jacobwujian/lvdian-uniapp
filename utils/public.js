// 能源类型
export const energyTypes = {
  0: '光伏',
  1: '风电',
  2: '水电'
}
// 能源类型背景色
export const energyTypeClass = {
  0: '#6aaf20',
  1: '#18b0bd',
  2: '#ffa600'
}

export const informationType = {
  1: '普通资讯',
  2: '活动资讯',
  3: '公益活动'
}

export const OrderType = {
  0: '待审核',
  1: '交易成功',
  2: '交易失败',
  3: '交易中'
}

export const saleAssetStatus = {
  1: '在售',
  2: '已售出',
  3: '已撤回'
}

export const reviewType = {
  0: '驳回',
  1: '通过'
}

export const companyType = {
  1: '耗能企业',
  2: '能源企业'
}

export const chainStatusType = {
  0: '上链中',
  1: '上链成功',
  2: '上链失败'
}


export const deviceStatusType = {	0: '吊销',	1: '启动',	2: '暂停',
	3: '启动中'}

export const verAssetStatus = {	0: '待审核',	1: '审核通过',	2: '审核拒绝'}
export const back = () =>{
	// #ifndef H5
	uni.navigateBack();
	// #endif
	// #ifdef H5
	history.back();
	// #endif
}

export const projectType = {
	1: '认证项目',
	2: '非认证项目'
}

export const projectStatus = {
	0: "待审核",
	1: "审核通过",
	2: "项目暂停",
	3: "审核未通过",
	4: "已终止",
	5: "删除待审核"
}
