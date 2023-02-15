<template>
  <div class="info-card mb10">
    <div v-if="title" class="info-card-title">{{ title }}</div>
    <div class="info-card-content">
      <div class="info-card-content-data">
        <slot name="data" :dataInfo="dataInfo"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    dataInfo: {
      type: Object,
      default: new Object()
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.info-card {
  padding: 0 12px;
  background: #ffffff;
  border-radius: 5px;
  &-title {
    padding: 12px 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #222222;
    line-height: 18px;
    border-bottom: 1px solid #eeeeee;
  }
  &-content {
    padding: 12px 0;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #555555;
    line-height: 16px;
  }
}
</style>
