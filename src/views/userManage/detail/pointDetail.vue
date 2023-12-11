<template>
  <div class="ticket-message-wrap">
    <div class="message">
      <p class="title">积分记录</p>
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
          label: '积分类型',
          value: ''
        }, {
          label: '积分时间',
          value: ''
        }, {
          label: '积分数量',
          value: ''
        }, {
          label: '订单号',
          value: ''
        }, {
          label: '停车场',
          value: ''
        }, {
          label: '付费类型',
          value: ''
        }, {
          label: '订单金额（￥）',
          value: ''
        }, {
          label: '付费金额',
          value: ''
        }, {
          label: '付费方式',
          value: ''
        }
      ]
    }
  },
  created () {
    this.getScopeDetail()
  },
  mounted () {},
  methods: {
    getScopeDetail() {
      server.getScopeDetail({
        orderId: this.$route.query.orderId
      }).then(res => {
        if (res.data.code === 200) {
          this.parkDateil = [
            {
              label: '积分类型',
              value: res.data.data?.scoreTypeStr
            }, {
              label: '积分时间',
              value: res.data.data?.scoreTime
            }, {
              label: '积分数量',
              value: res.data.data?.scoreValue
            }, {
              label: '订单号',
              value: res.data.data?.orderNo
            }, {
              label: '停车场',
              value: res.data.data?.garageName
            }, {
              label: '订单金额（￥）',
              value: res.data.data?.orderAmount
            }, {
              label: '付费金额',
              value: res.data.data?.confirmAmount
            }, {
              label: '付费方式',
              value: res.data.data?.payWayStr
            }, {
              label: res.data.data?.scoreType === 1 ? '付费类型' : '车位卡类型',
              value: res.data.data?.scoreType === 1 ? res.data.data?.paymentTypeStr : res.data.data?.cardTypeStr
            }
          ]
          if (res.data.data?.scoreType !== 1) {
            this.parkDateil.push({
              label: '车位卡名称',
              value: res.data.data?.cardName
            })
          }
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
