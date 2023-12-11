<template>
  <div class='container'>
    <el-dialog class='humanSettlementDialog' width="60%" :title="dialogVisible.title" :visible.sync="dialogVisible.show" :close-on-click-modal="false" @close="cancel">
      <div>
        <el-row>
          <el-col :span="16">
            <div class="search">
              <span class="plateNumber">车牌号：</span>
              <el-input placeholder="请输入车牌号或手机号" v-model="carOrPhone" size="small" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" class="searchButton" @click="search"></el-button>
              </el-input>
              <span class="noEnterLog" @click="noEnterLog">
                <img src="@/assets/image/chargeAeait/noEnterLog.png" alt="" style="width:16px;">
                <span>未搜索到订单？</span>
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="preNextButton">
              <el-button plain size="mini" icon="el-icon-arrow-left" :disabled="prePage" @click="preP" :style="{'background': prePage ? '#f5f5f5' : '' }">上一页</el-button>
              <el-button plain size="mini" :disabled="nextPage" @click="next" :style="{'background': nextPage ? '#f5f5f5' : '' }">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button >
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="orderList">
          <div class="swiperBox" @click="currentOrder(item)" :key="index" v-for="(item, index) in orderList">
            <div class="swiperBoxTitle">
              <el-row>
                <el-col :span="12">
                  <div class="swiperLicensePlateNumber">{{item.carNo}}</div>
                </el-col>
                <el-col :span="12">
                  <div class="swiperFee">收费金额：￥{{item.orderAmount}}</div>
                </el-col>
              </el-row>
            </div>
            <div class="swiperEnterTime">入场时间：{{item.inTime}}</div>
            <div class="swiperEnterTime">出场时间：{{item.outTime}}</div>
            <div class="swiperBoxBottom">
              <el-row>
                <el-col :span="12">
                  <div class="swiperBoxBottomStyle">车型：{{item.carTypeStr}}</div>
                </el-col>
                <el-col :span="12">
                  <div class="swiperBoxBottomHour">停车时长：{{item.parkTimeStr}}</div>
                </el-col>
              </el-row>
            </div>
            <div v-show="item.isChecked" class="statusChecked">
              <img src="@/assets/image/chargeAeait/checked.png" alt="">
            </div>
          </div>
      </div>
      <div class="footer">
        <div class="footerButtonBox">
          <el-button plain class="footerButton" size="small" @click="cancel">取消</el-button>
          <el-button  class="footerButton" type="primary" size="small" @click="makeSure">确认订单</el-button>
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
      pageNum: 1,
      pageSize: 6,
      carOrPhone: '',
      orderList: [],
      orderDetail: {},
      prePage: false, // 当前处于第一页时是true
      nextPage: false // 当前处于最后一页时是true
    }
  },
  created() {
    this.unPaid()
  },
  mounted() {},
  watch: {},
  computed: {
  },
  methods: {
    search () {
      this.unPaid()
    },
    noEnterLog () {
      this.dialogVisible.show = false
      this.$emit('humanSettlementDialog', 'noEnterLog', this.orderDetail)
    },
    currentOrder (e) {
      console.log(e, 'e')
      this.orderList.map(item => {
        item.isChecked = false
        if (e.orderId === item.orderId) {
          item.isChecked = true
        }
      })
      this.$forceUpdate()
      this.orderDetail = e
    },
    makeSure () {
      if (!this.orderDetail.orderId) {
        this.$message.warning('请选择需要结算的订单')
        return false
      }
      this.dialogVisible.show = false
      this.$emit('humanSettlementDialog', 'makeSure', this.orderDetail)
    },
    cancel () {
      this.carOrPhone = ''
      this.dialogVisible.show = false
      // this.$emit('humanSettlementDialog')
    },
    preP () {
      this.pageNum--
      this.unPaid()
    },
    next () {
      this.pageNum++
      this.unPaid()
    },
    unPaid () {
      const params = {
        garageId: this.dialogFromData.garageId,
        carNum: this.carOrPhone,
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        carNo: this.carOrPhone
      }
      serve.unPaidList(params).then(res => {
        if (res.data.code === 200) {
          this.orderList = res.data.data.rows
          const aa = res.data.data
          if (this.pageNum === 1 && aa.currentPage === 1) {
            this.nextPage = false
            this.prePage = true
          } else if (this.pageNum > 1 && aa.currentPage === aa.totalPage) {
            this.nextPage = true
            this.prePage = false
          } else {
            this.nextPage = false
            this.prePage = false
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
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
.search {
  margin: 24px 0 0 30px;
  .plateNumber {
    font-size: 14px;
    color: rgba(0,0,0,0.45);
  }
  .noEnterLog {
    cursor: pointer;
    img {
      vertical-align: middle;
      margin-right: 5px;
      margin-left: 17px;
    }
    span {
      font-size: 12px;
      color: rgba(0,0,0,0.45);
      vertical-align: middle;
    }
  }
}
.preNextButton {
  text-align: right;
  margin: 24px 30px 0 0;
}
.orderList {
  padding: 24px 30px 24px;
  display: flex;
  justify-content: flex-start;
  flex-wrap:wrap;
    .swiperBox:nth-child(3n) {
      margin-right: 0;
    }
    .swiperBox {
      cursor: pointer;
      margin-bottom: 12px;
      margin-right: 2%;
      width: 32%;
      position: relative;
      background: #ffffff;
      border: 1px solid #eaeaea;
      border-radius: 4px;
      padding: 12px;
      box-sizing: border-box;
      position: relative;
      .statusChecked {
          position: absolute;
          bottom: -5px;
          right: 0;
        }
      .swiperBoxTitle {
        .swiperLicensePlateNumber {
          font-size: 14px;
          font-weight: 500;
          color: rgba(0,0,0,0.85);
          margin-bottom: 14px;
        }
        .swiperFee {
          font-size: 14px;
          font-weight: 500;
          color: #f5222d;
        }
      }
      .swiperEnterTime {
        font-size: 12px;
        color: rgba(0,0,0,0.45);
        margin-bottom: 10px;
      }
      .swiperBoxBottom {
        .swiperBoxBottomStyle {
          font-size: 12px;
          color: rgba(0,0,0,0.45);
        }
        .swiperBoxBottomHour {
          font-size: 12px;
          color: #f5222d;
        }
      }
    }
}
// .border {
//   border: 1px solid #e6e6e6;
// }
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
</style>
