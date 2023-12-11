<template>
  <div class="ticket-wrap container" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
    <div class="head">
      <h3 class="head_title">停车记录详情</h3>
      <div class="rt_btns">
        <!-- <el-button size="small" type="primary" icon="el-icon-printer">打 印</el-button> -->
        <el-button size="small" type="primary" icon="el-icon-back" @click="$router.go(-1)">返 回</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content_grid">
        <h3>停车记录</h3>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>车牌号：</span>{{carInOut.carNo}}</el-col>
          <el-col :span="6"><span>停车场:</span>{{carInOut.garageName}}</el-col>
          <!-- <el-col :span="6"><span>车位卡类型：</span>{{orderPay.showPayWay}}</el-col> -->
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>入场道闸：</span>{{carInOut.inGate}}</el-col>
          <el-col :span="6"><span>入场时间:</span>{{carInOut.inTime}}</el-col>
          <el-col :span="12" class="img_col"><span>进场照片：</span>
            <div class="img_list">
              <el-image style="width: 160px; height: 100px; border-radius: 4px"
                :src="imgList[0]">
              </el-image>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid img_row">
          <el-col :span="6"><span>出场道闸：</span>{{carInOut.outGate}}</el-col>
          <el-col :span="6"><span>出场时间:</span>{{carInOut.outTime}}</el-col>
          <el-col :span="12" class="img_col"><span>出场照片：</span>
            <div class="img_list">
              <el-image style="width: 160px; height: 100px; border-radius: 4px"
                :src="imgList[1]">
              </el-image>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid img_row" v-if="carInOut.snapshotList">
          <el-col :span="24" class="img_col"><span>场内抓拍：</span>
            <div class="img_list">
              <el-image style="width: 160px; height: 100px; border-radius: 4px"
                v-for="(url, index) in allImg"
                :key="index + url"
                :src="url"
                :preview-src-list="allImg">
              </el-image>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
        <el-col :span="6"><span>停车时长：</span>{{orderInfo.parkHour}} 小时</el-col>
        <el-col :span="6"><span>停车费用（￥）：</span>{{carInOut.billingAmount}} 元</el-col>
        </el-row>

      </div>
      <div class="content_grid">
        <h3>订单信息</h3>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>订单号:</span>{{orderInfo.orderNo}}</el-col>
          <el-col :span="6"><span>订单类型：</span>{{orderInfo.showOrderType}}</el-col>
          <el-col :span="6"><span>订单时间</span>{{orderInfo.createTime}}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>计费规则:</span>{{orderInfo.billingRuleName}}</el-col>
          <el-col :span="6"><span>停车时长:</span>{{orderInfo.parkHour}}小时</el-col>
          <el-col :span="6"><span>订单金额（￥）</span>{{orderInfo.orderAmount}} 元</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>计费金额(￥):</span>{{orderInfo.billingAmount}} 元</el-col>
          <el-col :span="6"><span>实付金额（￥）:</span>{{orderInfo.confirmAmount}} 元</el-col>
          <el-col :span="6"><span>缴费渠道:</span>{{orderInfo.showPayChannel}}</el-col>
          <el-col :span="6"><span>用户类型:</span>{{allData.showCustomerType }}</el-col>
        </el-row>
      </div>
      <div class="content_grid" v-if="orderPay !== null">
        <h3>支付信息</h3>
        <div class="pament_card">
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>支付流水号:</span>{{orderPay.payNo}}</el-col>
          <el-col :span="6"><span>订单号：</span>{{orderInfo.orderNo}}</el-col>
           <el-col :span="6"><span>付费方式:</span>{{orderPay.showPayWay}}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6" v-show="orderInfo.showOrderType === '临停'"><span>支付账户:</span>{{orderPay.payAccount}}</el-col>
          <el-col :span="6" v-show="orderInfo.showParkType === '车位卡'"><span>车位卡账户:</span>{{orderPay.customerCardId}}</el-col>
          <el-col :span="6"><span>支付时间:</span>{{orderPay.payTime }}</el-col>
          <el-col :span="6" v-show="orderInfo.showParkType === '车位卡'"><span>权益扣减:</span>{{orderPay.rightDeductValue}} {{orderPay.showPayWay === '次数卡' ? '次' : '小时'}}</el-col>
        </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serve from '@/api/operationManage.api'
export default {
  name: 'chargeDetail',
  data () {
    return {
      loading: false,
      imgList: [],
      allImg: [],
      carInOut: {},
      orderInfo: {},
      orderPay: {},
      allData: {}
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
      const { data: res } = await serve.selectById(params)
      if (res.code === 200) {
        this.loading = false
        this.allData = res.data
        this.carInOut = res.data.carInOut
        this.orderInfo = res.data.orderInfo
        this.orderPay = res.data.orderPay
        this.imgList.length = 0
        this.imgList.push(this.carInOut.inImages[0], this.carInOut.outImages[0])
        console.log(this.imgList, 'this.imgList')
        this.allImg = this.carInOut.snapshotList.map(v => v)
      } else {
        this.loading = false
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/operationsManage/user-parking-card/detail') {
      to.query.activeName = from.query.activeName
    }
    next()
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
