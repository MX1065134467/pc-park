<template>
  <div class="ticket-wrap container" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
    <div class="head">
      <h3 class="head_title">缴费记录详情</h3>
      <div class="rt_btns">
        <el-button size="small" type="primary" icon="el-icon-printer">打 印</el-button>
        <el-button size="small" type="primary" icon="el-icon-back" @click="$router.go(-1)">返 回</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content_grid">
        <h3>订单信息</h3>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>订单号：</span>{{ orderInfo.orderNo }}</el-col>
          <el-col :span="6"><span>订单类型:</span>{{ orderInfo.showOrderType }}</el-col>
          <el-col :span="6"><span>订单时间：</span>{{ orderInfo.createTime }}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
        <el-col :span="6"><span>计费规则:</span>{{ orderInfo.billingRuleName }}</el-col>
        <el-col :span="6"><span>停车时长：</span>{{ orderInfo.parkHour }} 小时</el-col>
        <el-col :span="6"><span>订单金额（￥）：</span>{{ orderInfo.orderAmount }} 元</el-col>
        <el-col :span="6"><span>实收金额（￥）：</span>{{ orderInfo.confirmAmount }} 元</el-col>
        </el-row>

      </div>
      <div class="content_grid">
        <h3>支付信息</h3>
        <div class="pament_card">
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>支付流水号:</span>{{ orderPay.payNo }}</el-col>
          <el-col :span="6"><span>订单号：</span>{{ orderInfo.orderNo }}</el-col>
          <el-col :span="6"><span>缴费渠道:</span>{{ orderInfo.showPayChannel }}</el-col>
          <el-col :span="6"><span>支付类型:</span>{{ orderInfo.showParkType }}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>订单金额（￥）:</span>{{ orderInfo.orderAmount }} 元</el-col>
          <el-col :span="6"><span>计费金额(￥):</span>{{ orderInfo.billingAmount }} 元</el-col>
          <el-col :span="6"><span>实付金额（￥）:</span>{{ orderInfo.confirmAmount }} 元</el-col>
          <el-col :span="6"><span>付费方式:</span>{{ orderPay.showPayWay }}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6" v-show="orderInfo.showOrderType === '临停'"><span>支付账户:</span>{{ orderPay.payAccount }}</el-col>
          <el-col :span="6" v-show="orderInfo.showParkType === '车位卡'"><span>车位卡账户:</span>{{ orderPay.customerCardId }}</el-col>
          <!-- <el-col :span="6"><span>支付账户:</span>{{ orderInfo.parkHour }}</el-col> -->
          <el-col :span="6"><span>支付时间:</span>{{ orderPay.payTime }}</el-col>
          <el-col :span="6" v-show="orderInfo.showParkType === '车位卡'"><span>权益扣减:</span>{{ orderPay.rightDeductValue }} {{orderPay.showPayWay === '次数卡' ? '次' : '小时'}}</el-col>
        </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serve from '@/api/operationManage.api'
export default {
  name: 'paymentDetail',
  data () {
    return {
      orderInfo: {},
      orderPay: {},
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init () {
      const params = {
        orderId: this.$route.query.orderId
      }
      this.loading = true
      const { data: res } = await serve.chargeDetail(params)
      if (res.code === 200) {
        this.loading = false
        this.orderInfo = res.data.orderInfo
        this.orderPay = res.data.orderPay
      } else {
        this.loading = false
        this.$message.info('加载数据失败！')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .head {
    height: 45px;
    background: #606266;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;;
    h3 {
      color: #ffffff;
      font-weight: normal;
      margin: 0;
    }
    .rt_btns {
      display: flex;
      align-items: center;
      .el-button:first-child{
        margin-right: 20px;
      }
    }
  }
  .content {
    overflow-y: auto;
    flex: 1;
    flex-grow: 1;
    padding: 20px;
    box-sizing: border-box;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #409eff;
      width: 1px;
    }
    .content_grid {
      h3 {
        color: #ffffff;
        background: #606266;
        padding: 10px;
        font-weight: normal;
      }
      .first_grid {
        padding: 0 10px;
        box-sizing: border-box;
        margin-bottom: 50px;
        color: #606266;
        font-size: 14px;
        .el-col {
          display: flex;
          align-items: flex-start;
          align-items: center;
          .img_list {
            .el-image:not(:last-child) {
              margin-right: 20px;
            }
          }
          span {
            font-weight: bold;
            width: 130px;
          }
        }
        .img_col {
          align-items: flex-start !important;
        }
      }
      .img_row {
        margin-bottom: 15px !important;
      }
      .pament_card {
        background: #e9ebef;
        padding: 10px 0;
      }
    }
  }
}
</style>
