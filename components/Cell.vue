<template>
  <div class="cell">
    <div class="cell-left">{{ des }}</div>
    <div v-if="!rate" class="cell-right">
      <span
        v-if="copy"
        :data-clipboard-text="data"
        class="copybtn mr5 c-blue font-14"
        @click="onCopy"
        >复制</span
      >
      <div v-if="title" class="title">
        <span>{{ title }}</span>
        <div>
          <a v-for="item in bSpan" :href="item" :key="item">{{ item }}</a>
        </div>
      </div>
      <div v-else class="cell-data">
        <div v-for="item in bSpan" :key="item">{{ item }}</div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import Clipboard from "clipboard";
/* eslint-disable */
export default {
  props: {
    des: {
      type: String
    },
    type: {
      type: String
    },
    data: {
      type: [String, Array]
    },
    copy: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    rate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    bSpan() {
      if(Array.isArray(this.data)) {
        return this.data
      }else{
        return [this.data]
      }
    }
  },
  methods: {
    onCopy() {
      var clipboard = new Clipboard(".copybtn");
      clipboard.on("success", e => {
        this.$toast("复制成功");
      });
      clipboard.on("error", e => {
        // 不支持复制
        this.$toast("该浏览器不支持复制");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cell:nth-child(n + 2) {
  margin-top: 16px;
}
.cell-left {
  max-width: 112px;
  word-wrap: break-word
}
.copybtn {
  min-width: 30px;
}
.cell-right {
  display: flex;
  align-items: center;
}
.cell-data {
  max-width: 168px;
  word-wrap: break-word;
}
.title{
  display: flex;
  align-items: center;
  span{
    margin-right: 10px;
    font-size: 10px;
  }
  a{
    display: block;
  }
}
</style>
