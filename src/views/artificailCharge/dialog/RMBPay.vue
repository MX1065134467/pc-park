<template>
  <div class='container'>
    <el-dialog class='RMBDetailBoxDialog' width="30%" :title="dialogVisible.title" :visible.sync="dialogVisible.show" :close-on-click-modal="false">
      <div class="RMBDetailBox">
        <el-row class="box">
          <el-col :span="6" class="RMBDetail">订单号：</el-col>
          <el-col :span="18" class="RMBDetailBold">{{dialogFromData.orderNo}}</el-col>
        </el-row>
        <el-row class="box">
          <el-col :span="6" class="RMBDetail">订单时间：</el-col>
          <el-col :span="18" class="RMBDetailBold">{{dialogFromData.createTime}}</el-col>
        </el-row>
        <el-row class="box">
          <el-col :span="6" class="RMBDetail">订单金额（￥）：</el-col>
          <el-col :span="18" class="RMBDetailBold red">{{dialogFromData.billingAmount}}</el-col>
        </el-row>
        <el-row class="box">
          <el-col :span="6" class="RMBDetail">收费员：</el-col>
          <el-col :span="18" class="RMBDetailBold">{{userName}}</el-col>
        </el-row>
        <el-row class="box">
          <el-col :span="6" class="RMBDetail">支付方式：</el-col>
          <el-col :span="18" class="RMBDetailBold">现金</el-col>
        </el-row>
        <el-row class="box">
          <el-col :span="6" class="RMBDetail">免费卡号：</el-col>
          <el-col :span="10" class="RMBDetailBold">
              <el-input v-model="freeNo" placeholder="请输入免费卡号" @change="selectFreeNo"></el-input>
          </el-col>
        </el-row>
      </div>
      <div class="footer">
        <div class="footerButtonBox">
          <el-button plain class="footerButton" size="small" @click="enterCancel">取消</el-button>
          <el-button  class="footerButton" type="primary" size="small" :loading="currentSure" @click="goMakeSure">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import serve from '@/api/parkingCharge.api'

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
      currentSure: false,
      userName: JSON.parse(sessionStorage.getItem('userInfo')).userName,
      freeNo: '',
      purchaseWay: 6
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
  },
  methods: {
    enterCancel () {
      this.dialogVisible.show = false
    },
    selectFreeNo(value) {
      this.freeNo = value
    },
    goMakeSure () {
      if (this.freeNo === '') {
        this.purchaseWay = 6
      } else {
        this.purchaseWay = 9
      }
      const params = {
        garageId: this.dialogFromData.garageId,
        orderId: this.dialogFromData.orderId,
        parkingId: this.dialogFromData.parkingId,
        payAmount: this.dialogFromData.billingAmount,
        purchaseWay: this.purchaseWay,
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
        whiteCard: this.freeNo
      }
      serve.cashPay(params).then(res => {
        if (res.data.code === 200) {
          this.$message.success('现金支付成功')
          this.dialogVisible.show = false
          this.$emit('RmbPayDialog', this.dialogFromData.orderId) // 传参orderid，根据id查询详情展示
        } else {
          this.$message.error(res.data.msg)
        }
      })
    //   this.currentSure = true
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
  .RMBDetailBoxDialog {
    .RMBDetailBox {
      padding: 24px 0 0 30px;
      .box {
        margin-bottom: 20px;
        .RMBDetail {
        font-size: 14px;
        color: rgba(0,0,0,0.45);
        text-align: right;
      }
      .RMBDetailBold {
        font-size: 14px;
        color: rgba(0,0,0,0.85);
      }
      .red {
        font-size: 20px;
        font-weight: 500;
        color: #f5222d;
      }
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
