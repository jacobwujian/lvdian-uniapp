<template>
  <van-list
    v-model="loadingValue"
    :finished="finished"
    finished-text="没有更多了"
    direction="down"
    @load="onLoad"
  >
    <div class="mt10">
      <slot></slot>
    </div>
  </van-list>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: new Array()
    },
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingValue: this.loading
    };
  },
  methods: {
    onLoad() {
      this.$emit("onLoad");
    }
  }
};
</script>
