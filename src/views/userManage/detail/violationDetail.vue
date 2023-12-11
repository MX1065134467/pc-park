<template>
  <div class="ticket-message-wrap">
    <div class="message">
      <p class="title">处罚记录</p>
      <div class="content">
        <div class="content-main">
          <div class="item" v-for="(item, index) of violationDetail" :key="index">
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
  </div>
</template>

<script>
import server from '@/api/userManage.api.js'
export default {
  name: '',
  components: {},
  props: {},
  data () {
    return {
      parkDateil: [
        {
          label: '车牌号',
          value: ''
        }, {
          label: '停车场名称',
          value: ''
        }, {
          label: '停车类型',
          value: ''
        }, {
          label: '车位卡类型',
          value: ''
        }, {
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
          value: [],
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
        label: '订单时间',
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
      }, {
        label: '实收金额（￥）',
        value: ''
      }],
      violationDetail: [
        {
          label: '发起人',
          value: ''
        }, {
          label: '发起时间',
          value: ''
        }, {
          label: '拉黑原因',
          value: ''
        }, {
          label: '抓拍证据',
          value: [],
          type: 'image'
        }, {
          label: '处理意见',
          value: ''
        }, {
          label: '复核人',
          value: ''
        }, {
          label: '复核时间',
          value: ''
        }, {
          label: '复核意见',
          value: ''
        }, {
          label: '执行周期',
          value: ''
        }
      ]
    }
  },
  created () {
    this.getBlackDetail()
  },
  mounted () {},
  methods: {
    getBlackDetail() {
      server.getBlackDetail({
        blackId: this.$route.query.id
      }).then(res => {
        if (res.data.code === 200) {
          const orderDetail = res.data.data.orderInfo
          const violationDetail = res.data.data.parkingBlackInfo
          const parkDateil = res.data.data.carInOut
          const reviewCountStr = res.data.data.parkingBlackInfo.reviewCount === null ? res.data.data.parkingBlackInfo.dayCount : res.data.data.parkingBlackInfo.reviewCount
          this.orderDetail = [{
            label: '订单号',
            value: orderDetail?.orderNo
          }, {
            label: '订单类型',
            value: orderDetail?.showOrderType
          }, {
            label: '支付时间',
            value: orderDetail?.orderNo
          }, {
            label: '计费规则',
            value: orderDetail?.billingRuleName
          }, {
            label: '停车时长',
            value: orderDetail?.parkHour + 'h'
          }, {
            label: '订单金额（￥）',
            value: orderDetail?.orderAmount
          }, {
            label: '实收金额（￥）',
            value: orderDetail?.confirmAmount
          }]
          this.violationDetail = [
            {
              label: '发起人',
              value: violationDetail?.createBy
            }, {
              label: '发起时间',
              value: violationDetail?.createTime
            }, {
              label: '拉黑原因',
              value: violationDetail?.blackReason
            }, {
              label: '抓拍证据',
              value: parkDateil && parkDateil.snapshotList ? parkDateil.snapshotList : [],
              type: 'image'
            }, {
              label: '处理意见',
              value: '拉黑' + reviewCountStr + '天'
            }, {
              label: '复核人',
              value: violationDetail?.updateBy
            }, {
              label: '复核时间',
              value: violationDetail?.updateTime
            }, {
              label: '执行周期',
              value: violationDetail?.beginTime + '至' + violationDetail?.endTime
            }
          ]
          this.parkDateil = [
            {
              label: '车牌号',
              value: violationDetail?.carNo
            }, {
              label: '停车场名称',
              value: violationDetail?.garageName
            }, {
              label: '停车类型',
              value: orderDetail?.showParkType
            }, {
              label: '车位卡类型',
              value: violationDetail?.cardTypeStr
            }, {
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
              value: parkDateil && parkDateil.snapshotList ? parkDateil.snapshotList : [],
              type: 'image'
            }, {
              label: '停车时长',
              value: parkDateil?.parkHour + 'h'
            }, {
              label: '停车费用（￥）',
              value: orderDetail?.confirmAmount
            }
          ]
        }
      })
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
