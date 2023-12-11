<template>
  <div class='park-detail'>
    <div class="ticket-add-title">
      <div>{{$route.query.title}}详情</div>
      <span>
        <el-button size="small" type="primary" icon="el-icon-printer" @click="handlePrint">打印</el-button>
        <el-button size="small" type="primary" icon="el-icon-arrow-left" @click="handleBack">返回</el-button>
      </span>
    </div>
    <div class="ticket-message-wrap" v-if="$route.query.title === '停车记录'">
      <div class="message">
        <p class="title">停车记录</p>
        <div class="content">
          <div class="content-main">
            <div class="item" v-for="(item, index) of parkDateil" :key="index">
              <label>{{item.label}}：</label>
              <span v-if="!item.type">{{item.value}}</span>
              <el-image
                v-else
                style="width: 100px; height: 100px"
                :src="item.value[0]"
                :preview-src-list="item.value">
              </el-image>
              <el-button type="text" size="small" v-if="item.copy" v-clipboard:copy="item.text" v-clipboard:success="copy" v-clipboard:error="onError">复制</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="message">
        <p class="title">订单信息</p>
        <div class="content">
          <div class="content-main">
            <div class="item" v-for="(item, index) of orderDetail" :key="index">
              <label>{{item.label}}：</label>
              <span>{{item.value}}</span>
              <el-button type="text" size="small" v-if="item.copy" v-clipboard:copy="item.text" v-clipboard:success="copy" v-clipboard:error="onError">复制</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="message">
        <p class="title">支付信息</p>
        <div class="content">
          <div class="content-main" v-for="(item, index) of payDetail" :key="index">
            <div class="item" v-for="item1 of item" :key="item1.label">
              <label>{{item1.label}}：</label>
              <span>{{item1.value}}</span>
              <el-button type="text" size="small" v-if="item1.copy" v-clipboard:copy="item1.text" v-clipboard:success="copy" v-clipboard:error="onError">复制</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="$route.query.title === '积分记录'">
      <pointDetail />
    </template>
    <template v-if="$route.query.title === '违规记录'">
      <violationDetail />
    </template>
  </div>
</template>

<script>
import pointDetail from './pointDetail'
import violationDetail from './violationDetail'
// import server from '@/api/userManage.api.js'
import serve from '@/api/operationManage.api'
export default {
  name: '',
  components: {
    pointDetail,
    violationDetail
  },
  props: {},
  data () {
    return {
      parkDateil: [
        {
          label: '车牌号',
          value: ''
        }, {
          label: '停车场',
          value: ''
        }, {
          label: '用户类型',
          value: ''
        },
        // {
        //   label: '车位卡类型',
        //   value: ''
        // },
        {
          label: '入场道闸',
          value: ''
        }, {
          label: '入场时间',
          value: ''
        }, {
          label: '进场照片',
          value: [],
          type: 'image'
        }, {
          label: '出场道闸',
          value: ''
        }, {
          label: '出场时间',
          value: ''
        }, {
          label: '出场照片',
          value: [''],
          type: 'image'
        }, {
          label: '场内抓拍',
          value: [],
          type: 'image'
        }, {
          label: '停车时长',
          value: ''
        }, {
          label: '停车费用（￥）',
          value: ''
        }
      ],
      orderDetail: [{
        label: '订单号',
        value: ''
      }, {
        label: '订单类型',
        value: ''
      }, {
        label: '支付时间',
        value: ''
      }, {
        label: '计费规则',
        value: ''
      }, {
        label: '停车时长',
        value: ''
      }, {
        label: '订单金额（￥）',
        value: ''
      }],
      payDetail: [
        [{
          label: '支付流水号',
          value: ''
        }, {
          label: '订单号',
          value: ''
        }, {
          label: '缴费渠道',
          value: ''
        }, {
          label: '支付类型',
          value: ''
        }, {
          label: '订单金额（￥）',
          value: ''
        }, {
          label: '计费金额（￥）',
          value: ''
        }, {
          label: '实付金额（￥）',
          value: ''
        }, {
          label: '付费方式',
          value: ''
        }, {
          label: '支付账户',
          value: ''
        }, {
          label: '支付时间',
          value: ''
        }]
      ]
    }
  },
  created () {
    if (this.$route.query.title === '停车记录') {
      this.getParkDetail()
    }
  },
  mounted () {},
  methods: {
    getParkDetail() {
      serve.selectById({
        orderId: this.$route.query.id
      }).then(res => {
        if (res.data.code === 200) {
          const orderDetail = res.data.data.orderInfo
          const payDetail = res.data.data.orderPay
          const parkDateil = res.data.data.carInOut
          this.orderDetail = [{
            label: '订单号',
            value: orderDetail?.orderNo
          }, {
            label: '订单类型',
            value: orderDetail?.showOrderType
          }, {
            label: '支付时间',
            value: payDetail?.payTime
          }, {
            label: '计费规则',
            value: orderDetail?.billingRuleName
          }, {
            label: '停车时长',
            value: orderDetail?.parkHour + 'h'
          }, {
            label: '订单金额（￥）',
            value: orderDetail?.orderAmount
          }]
          this.payDetail = [
            [{
              label: '支付流水号',
              value: payDetail?.payNo
            }, {
              label: '订单号',
              value: orderDetail?.orderNo
            }, {
              label: '缴费渠道',
              value: orderDetail?.showPayChannel
            }, {
              label: '支付类型',
              value: payDetail && payDetail.paymentType ? (payDetail.paymentType === 1 ? '车位卡' : payDetail.paymentType === 2 ? '临停' : 'VIP') : '---'
            }, {
              label: '订单金额（￥）',
              value: orderDetail?.orderAmount
            }, {
              label: '计费金额（￥）',
              value: orderDetail?.billingAmount
            }, {
              label: '实付金额（￥）',
              value: orderDetail?.confirmAmount
            }, {
              label: '付费方式',
              value: payDetail?.showPayWay
            }, {
              label: '支付账户',
              value: payDetail?.payAccount
            }, {
              label: '支付时间',
              value: payDetail?.payTime
            }]
          ]
          this.parkDateil = [
            {
              label: '车牌号',
              value: parkDateil?.carNo
            }, {
              label: '停车场',
              value: parkDateil?.garageName
            }, {
              label: '用户类型',
              value: res.data.data.showCustomerType
            },
            // {
            //   label: '车位卡类型',
            //   value: orderDetail.showOrderType
            // },
            {
              label: '入场道闸',
              value: parkDateil?.inGate
            }, {
              label: '入场时间',
              value: parkDateil?.inTime
            }, {
              label: '进场照片',
              value: [parkDateil?.inImages],
              type: 'image'
            }, {
              label: '出场道闸',
              value: parkDateil?.outGate
            }, {
              label: '出场时间',
              value: parkDateil?.outTime
            }, {
              label: '出场照片',
              value: [parkDateil?.outImages],
              type: 'image'
            }, {
              label: '场内抓拍',
              value: parkDateil?.snapshotList,
              type: 'image'
            }, {
              label: '停车时长',
              value: parkDateil?.parkHour + 'h'
            }, {
              label: '停车费用（￥）',
              value: orderDetail?.billingAmount
            }
          ]
        }
      })
    },
    // 返回
    handleBack() {
      this.$router.push({
        name: 'userManageUser',
        query: {
          carId: this.$route.query.carId,
          carNo: this.$route.query.carNo,
          active: this.$route.query.active
        }
      })
    },
    // 打印
    handlePrint() {
      window.print()
    }
  }
}
</script>

<style lang='scss' scoped>
.ticket-message-wrap {
  padding: 20px;
  padding-top: 70px;
  .message {
    padding-bottom: 20px;
    .title{
      display: inline-block;
      margin-left: 10px;
      font-size: 18px;
      font-weight: 700;
      padding-bottom: 5px;
      margin-bottom: 20px;
    }
    .content {
      .content-main {
        padding: 20px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      .item {
        width: 30%;
        margin-right: 1%;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
