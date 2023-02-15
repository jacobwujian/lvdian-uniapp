<template>
  <div class="header">
    <div>
      <img
        v-if="left"
        class="left"
        :src="require('@/static/img/login/back.png')"
        alt=""
        @click="onBack"
      />
      <span class="name">{{ name }}</span>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
// <Header left name="headerName">
export default {
  props: {
    left: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    path: {
      type: String,
      default: ""
    },
    right: {
      type: String,
      default: ""
    }
  },
  methods: {
    onBack() {
      if (this.path) return this.$router.replace(this.path);
      if (this.$router.currentRoute._value.name === "login") {
        this.$router.push("/");
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  margin-bottom: 5px;
  padding: 10px;
  font-weight: bold;
  background-color: white;
  & > div {
    display: flex;
    align-items: center;
    padding: 0;
  }
}
.left {
  padding-left: 0;
  width: 21px;
  height: 21px;
}
.name {
  padding: 0;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #333333;
  line-height: 25px;
}
.right {
  font-size: 16px;
  color: #333333;
  line-height: 22px;
  background-color: white;
}
/deep/ van-search van-search--show-action {
  background-color: white;
}
</style>
