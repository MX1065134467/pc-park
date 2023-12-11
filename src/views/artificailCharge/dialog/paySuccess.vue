<template>
  <div class='container'>
    <el-dialog class='paySuccessDialog' width="30%" :title="dialogVisible.title" :visible.sync="dialogVisible.show" :close-on-click-modal="false">
      <div class="paySuccessBox">
        <img src="@/assets/image/chargeAeait/paySuccess@2x.png" alt="">
        <p>支付成功</p>
      </div>
      <div class="footer">
        <div class="footerButtonBox">
          <el-button  class="footerButton" type="primary" size="small" @click="goMakeSure">关闭({{countDown}}s)</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  props: {
    // 模态框是否显示
    dialogVisible: {
      type: Object
    },
    //  模态框的form数据
    dialogFromData: {
      type: Object
    }
  },
  data() {
    return {
      timer: null,
      countDown: 3 // 倒计时
    }
  },
  created() {
    clearInterval(this.timer)
  },
  mounted() {
    console.log(this.dialogFromData.orderId, 'this.dialogFromData.orderId')
    this.count()
  },
  watch: {},
  computed: {
  },
  methods: {
    goMakeSure () {
      this.dialogVisible.show = false
      clearInterval(this.timer)
      this.$emit('paySuccessDialog', this.dialogFromData.orderId)
    },
    count () {
      this.timer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown--
        } else {
          clearInterval(this.timer)
          this.dialogVisible.show = false
          this.$emit('paySuccessDialog', this.dialogFromData.orderId)
        }
      }, 1000)
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-dialog__wrapper {
  z-index: 99999999999 !important;
}
::v-deep .el-dialog {
border-radius: 4px !important;
box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.2) !important;
    .el-dialog__header {
      padding: 20px 0 20px !important;
      margin: 0 !important;
      border-bottom: 1px solid #e6e6e6 !important;
      .el-dialog__title {
        margin-left: 20px !important;
        font-size: 16px;
        font-weight: 600;
        color: #000000;
      }
    }
  .el-dialog__body {
    padding: 0 !important;
  }
}
::v-deep .el-input-group {
  width: 40% !important;
}
::v-deep .el-input-group__append {
  background-color: #409eff !important;
  .el-icon-search {
    color: #fff !important;
  }
}
.container {
  .paySuccessDialog {
    .paySuccessBox {
      padding: 54px 232px;
      img {
        display: block;
        width: 56px;
        height: 56px;
        margin: 0 auto;
      }
      p {
        text-align: center;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        margin-top: 20px;
      }
    }
    .footer {
      border-top: 1px solid #e6e6e6;
      padding: 0 !important;
        .footerButtonBox {
          text-align: right;
          margin: 10px 30px 0 0;
          ::v-deep .footerButton {
          width: 88px !important;
          margin: 0 0 10px 16px;
        }
      }
    }
  }
}
</style>
