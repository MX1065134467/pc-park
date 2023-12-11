<template>
  <div class="paayment">
    <el-dialog title="支付" :visible.sync="payment.isShow" width="55%" destroy-on-close :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="12"><span>订单号：</span>{{ payment.content.orderNo }}</el-col>
        <el-col :span="12"><span>订单时间：</span>{{ payment.content.createTime }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"><span style="width: 118px">订单金额（￥）：</span>{{ payment.content.billingAmount }}</el-col>
        <el-col :span="12"><span>收费员：</span>{{ collector }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"><span>支付方式：</span>现金</el-col>
      </el-row>
       <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo } from '@/common/cache.js'
export default {
  name: '',
  props: {
    payment: Object
  },
  data () {
    return {
      collector: getUserInfo().userName
    }
  },
  methods: {
    cancel() {
      this.payment.isShow = false
      this.$emit('cancel')
    },
    sure() {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog__wrapper {
  z-index: 99999999999 !important;
}
.paayment {
  .el-row:not(:first-child) {
    margin-top: 50px;
  }
   .dialog-footer {
    display: flex;
    justify-content: center;
    .el-button:first-child {
      margin-right: 20px;
    }
  }
}
</style>
