<template>
  <div class="one-card" @click="chooseBox(item)" @mouseenter.prevent="mouseenter(item)" @mouseleave="mouseleave">
    <div :class="item.status === 0 ? 'car-box noopen-bg' : item.status === 2 ? ' car-box private-bg':  item.status === 1 ? 'car-box free-bg' : item.status === 3 ? 'car-box card-bg':'car-box'">{{item.carNo}}</div>
    <div @click.stop>
      <el-switch :disabled="disabled || item.status === 2 || item.status === 3" style="display: block" @change="statusChange($event, item)" v-model="item.updateSta" active-color="#13ce66" inactive-color="#cccccc" :active-text="item.updateSta ? '正常' :'异常'">
      </el-switch>
    </div>
    <div class="carcode code-bg">{{item.detailCode}}</div>
    <div v-if="toggleCheck(item)">
      <div class="choose-box"></div>
      <i class="el-icon-check choose-icon"></i>
    </div>
    <div v-if="showTips && pShowTips" class="tips">
      <div>车位类型： {{tipObj.status === 0 ? '未开启' : tipObj.status === 2 ? '私家车位':tipObj.status === 3 ? '车位卡':'空闲'}}</div>
      <div>车牌号: {{tipObj.carNo? tipObj.carNo : '暂无'}}</div>
      <div>姓名：{{tipObj.userName ? tipObj.userName : '暂无'}}</div>
      <div>电话：{{tipObj.userPhone ? tipObj.userPhone : '暂无'}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    },
    item: {
      type: Object
    },
    pShowTips: {
      type: Boolean
    },
    activeGarageDetailId: {
      type: Number
    },
    my_mark: {
      type: Number
    }
  },
  data() {
    return {
      garageDetailId: '',
      showTips: false,
      t: null,
      tipObj: {}
    }
  },
  created() {},
  methods: {
    mouseenter(item) {
      this.t = setInterval(() => {
        if (!this.showTips) {
          this.showTips = true
          this.tipObj = item
        }
      }, 100)
    },
    mouseleave() {
      this.showTips = false
      clearInterval(this.t)
    },
    chooseBox(item) {
      this.$emit('chooseIndex', item)
    },
    statusChange(status, item) {
      this.$emit('statusChange', item)
    },
    toggleCheck(item) {
      if (this.my_mark === 1) {
        return (
          this.activeGarageDetailId === item.garageDetailId &&
          item.updateSta &&
          item.status === 1
        )
      } else {
        return (
          this.activeGarageDetailId === item.garageDetailId && item.updateSta
        )
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
.one-card {
  width: 80px;
  height: 100px;
  padding: 5px;
  position: relative;
  border: 1px solid #000;
  margin: 5px;
  cursor: pointer;
  .car-box {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    text-align: center;
    margin-bottom: 5px;
    color: #ffffff;
  }
  .noopen-bg {
    background: #cccccc;
  }
  .private-bg {
    background: #ffcc00;
  }
  .free-bg {
    background: #33cccc;
  }
  .card-bg {
    background: #339900;
  }
  .carcode {
    margin-top: 5px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
  }
  .code-bg {
    background: #f2f2f2;
  }
  .choose-box {
    position: absolute;
    bottom: -5px;
    right: 0;
    width: 0;
    height: 0;
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
    border-left: 25px solid red;
    transform: rotate(45deg);
  }
  .choose-icon {
    position: absolute;
    bottom: 6px;
    right: 3px;
    font-size: 26px;
    color: #ffffff;
  }
  .tips {
    position: absolute;
    width: 280px;
    height: 80px;
    bottom: 20px;
    left: 50px;
    background: #f8f8f8;
    z-index: 999;
    border-radius: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    font-size: 12px;
    div {
      padding: 10px;
      width: 40%;
    }
  }
}
</style>
