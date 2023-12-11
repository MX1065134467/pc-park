<template>
  <div class="ticket-wrap container" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
    <div class="head">
      <h3 class="head_title">待支付订单</h3>
      <el-button size="small" type="primary" icon="el-icon-back" @click="$router.go(-1)">返 回</el-button>
    </div>
    <div class="content">
      <div class="content_grid">
        <el-row :gutter="20" class="first_grid">
          <el-col :span="8"><span>订单号：</span>{{orderDetail.orderNo}}</el-col>
          <el-col :span="8"><span>订单时间：</span>{{orderDetail.createTime}}</el-col>
          <el-col :span="8"><span>办理人:</span>{{accepting}}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="8"><span>订单价格:</span>{{orderDetail.cardPrice}}元</el-col>
          <el-col :span="8"><span>备注：</span> {{orderDetail.remark}}</el-col>
          <el-col :span="8"><span>购买人姓名：</span>{{orderDetail.peopleName}}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="8"><span>电话:</span>{{orderDetail.peoplePhone}}</el-col>
          <el-col :span="8"><span>身份证：</span> {{orderDetail.identityCard}}</el-col>
        </el-row>
      </div>
      <div class="content_grid">
        <el-row :gutter="20" class="first_grid">
          <el-col :span="8"><span>车位卡编号:</span>{{orderDetail.customerCardId}}</el-col>
          <el-col :span="8"><span>停车场名称：</span>{{orderDetail.parkingIdStr}}</el-col>
          <el-col :span="8"><span>停车卡类型:</span>{{cardType_str}}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="8"><span>停车卡名称:</span>{{orderDetail.cardName}}</el-col>
          <el-col :span="8"><span>价格（￥）:</span>{{orderDetail.cardPrice}}元</el-col>
          <el-col :span="8"><span>可用有效期:</span>{{orderDetail.validTime}}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="8"><span>车牌号:</span>{{orderDetail.peopleCarNo}}</el-col>
          <el-col :span="8"><span>车主姓名:</span>{{orderDetail.peopleName}}</el-col>
          <el-col :span="8"><span>电话:</span>{{orderDetail.peoplePhone}}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="8"><span>身份证:</span>{{orderDetail.identityCard}}</el-col>
          <el-col :span="8"><span>车辆信息:</span>{{carInfo}}</el-col>
          <el-col :span="8" v-show="orderDetail.cardType === 1"><span>车位号:</span>{{orderDetail.garageDetailId}}</el-col>
        </el-row>
      </div>
      <div class="footer">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button size="small" type="primary"  @click="nextStep">确认支付</el-button>
      </div>
    </div>
    <payment-dialog v-if="payment.isShow" :payment="payment" @confirm="confirm"></payment-dialog>
  </div>
</template>

<script>
import paymentDialog from './dialog/paymentDialog'
import { getUserInfo } from '@/common/cache.js'
export default {
  name: 'createOrder',
  components: { paymentDialog },
  data () {
    return {
      loading: false,
      payment: {
        isShow: false,
        content: {}
      },
      orderDetail: {},
      accepting: null, // 办理人
      carInfo: null, // 车辆信息
      cardType_str: null
    }
  },
  created () {
    this.orderDetail = JSON.parse(sessionStorage.getItem('orderInfo') || {})
    this.accepting = getUserInfo().userName
    this.carInfo = `${this.orderDetail.carBrand ? this.orderDetail.carBrand : ''} ${this.orderDetail.carModel ? this.orderDetail.carModel : ''} ${this.orderDetail.carColor ? this.orderDetail.carColor : ''}`
    this.cardType_str = this.orderDetail.cardType === 1 ? '包天卡' : this.orderDetail.cardType === 2 ? '次数卡' : this.orderDetail.cardType === 3 ? '时长卡' : ''
  },
  methods: {
    nextStep() {
      const content = {
        cardPrice: this.orderDetail.cardPrice,
        createTime: this.orderDetail.createTime,
        customerCardId: this.orderDetail.customerCardId,
        orderId: this.orderDetail.orderId,
        orderNo: this.orderDetail.orderNo,
        carNo: this.orderDetail.carNo,
        garageDetailId: this.orderDetail.garageDetailId,
        cardType: this.orderDetail.cardType,
        dealPeople: this.orderDetail.dealPeople,
        carId: this.orderDetail.carId,
        cardId: this.orderDetail.cardId,
        accepting: this.accepting
      }
      this.payment.content = content
      this.payment.isShow = true
    },
    confirm() {
      this.payment.isShow = false
      this.$router.push({ path: '/parkingCardSell/sale-list' })
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
  }
  .content {
    overflow-y: auto;
    flex: 1;
    flex-grow: 1;
    padding: 20px;
    box-sizing: border-box;
    .content_grid {
      font-size: 14px;
      color: #606266;
      background: #eee;
      padding: 50px 0 5px 0;
      margin: 0 0 20px 0;
      .first_grid {
        padding: 0 10px;
        box-sizing: border-box;
        margin-bottom: 50px;
        .el-col {
          display: flex;
          align-items: flex-start;
          align-items: center;
          span {
            font-weight: normal;
            width: 130px;
          }
        }
      }
    }
    .footer {
      display: flex;
      justify-content: center;
      margin-top: 50px;
      .el-button {
        &:first-child {
          margin-right: 50px;
        }
      }
    }
  }
}
</style>
