<template>
  <el-dialog title="支付" :visible.sync="payment.isShow" width="55%" :destroy-on-close="true" class="payment-dialog" :close-on-click-modal="false">
    <el-row :gutter="20">
      <el-col :span="12">订单号：{{paymentMsg.orderNo}}</el-col>
      <el-col :span="12">订单时间：{{paymentMsg.createTime}}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">订单金额（￥）{{paymentMsg.cardPrice}}元</el-col>
      <el-col :span="12">办理人：{{paymentMsg.accepting}}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12"><span>支付方式</span>
        <el-radio-group v-model="paymode">
          <el-radio :label="4">现金</el-radio>
          <!-- <el-radio :label="1">微信</el-radio>
          <el-radio :label="2">支付宝</el-radio> -->
        </el-radio-group>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="payment.isShow = false">取 消</el-button>
      <el-button size="small" type="primary" @click="handleClose">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import serve from '@/api/parkingCardSell.api.js'
export default {
  props: {
    payment: Object
  },
  data () {
    return {
      paymode: 4, // 1-微信,2-支付宝,3-运营卡,4-现金
      paymentMsg: {},
      QRCodeNumber: ''
    }
  },
  created() {
    this.paymentMsg = this.payment.content
    console.log(this.paymentMsg)
  },
  methods: {
    // 确定按钮
    async handleClose () {
      const { data: res } = await serve.parkCardPay(this.paymentMsg)
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.$emit('confirm')
      } else {
        this.$message.info(res.msg)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.payment-dialog {
  .el-row {
    margin-bottom: 30px;
    span {
      width: 130px;
      display: inline-block;
      font-weight: bold;
    }
  }
  .dialog-footer {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      .el-button {
        &:first-child {
          margin-right: 20px;
        }
      }
  }
}
</style>
