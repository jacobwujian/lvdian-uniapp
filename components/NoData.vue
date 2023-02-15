<template>
  <div class="no-data">
    <img class="src" :src="src" alt="" />
    <div>
      <span class="font-14 c-des">您还未登录，</span>
      <span class="font-14 c-green login" @click="$router.push('/login')"
        >去登录</span
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: require("@/static/img/login/nodata.png")
    };
  }
};
</script>

<style lang="less" scoped>
.no-data {
  margin-top: 30px;
  text-align: center;
}
.src {
  width: 154px;
  height: 133px;
}
.login {
  text-decoration: underline;
}
</style>
