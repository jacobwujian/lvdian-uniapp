<template>
  <div
    class="p12 mb10 bg-white flex-between radius5"
    @click="onClick(dataInfo.orderId)"
  >
    <div class="mr12">
      <slot name="left" :dataInfo="dataInfo"></slot>
    </div>
    <div class="right">
      <slot name="right" :dataInfo="dataInfo"></slot>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {
  props: {
    dataInfo: {
      type: Object,
      default: new Object()
    }
  },
  methods: {
    onClick(orderId) {
      this.$emit("onProjectCard", orderId);
    }
  }
};
</script>

<style lang="less" scoped>
.right {
  width: 217px;
}
</style>
