
import serve from '@/api/artificailCharge.api.js'
// import { getCarHireMsg } from '@/socket/index'
import { getUserInfo } from '@/common/cache.js'

const isCashPayment = false
export default {
  directives: {
    clickOutside: {
      bind(el, bingings, vnode) {
        // 把事件绑定给document
        const handler = e => {
          if (el.contains(e.target)) {
            vnode.context.foucs()
          } else {
            if (isCashPayment) {
              vnode.context.blur()
            } else {
              vnode.context.foucs()
            }
          }
        }
        el.handler = handler
        document.addEventListener('click', handler)
      },
      unbind(el) {
        document.removeEventListener('click', el.handler)
      }
    }
  },
  data() {
    return {
      success_notify: null, // 全局 支付成功 notify
      unpaid_notify: null,
      notifyData: {},
      QRCode: null, // 主扫支付二维码
      payMode: null, // 支付方式
      Loading: null,
      payAwaitTimer: 20,
      pay_mark: null,
      isCashPayment: false // 如果跳出在线支付状态，则取消DOM 聚焦
    }
  },
  created() {
    // getCarHireMsg(this.getSock)
  },
  mounted () {
  },
  methods: {
    foucs() {
      if (this.unpaid_notify !== null && this.notifyData.status === 0) {
        this.$refs.inputFocus.focus()
      }
    },
    blur() {
      this.$refs.inputFocus.blur()
    },
    // 主扫支付
    async handleScanCode(orderData = {}) {
      this.pay_mark = orderData.pay_mark
      const payMode = (this.QRCode && this.QRCode.slice(0, 1) * 1)
      const params = {
        authCode: this.QRCode,
        orderId: this.notifyData.orderId,
        payAmount: this.notifyData.billingAmount,
        purchaseWay: payMode, // 1-微信,2-支付宝,3-运营卡,4-现金
        userId: getUserInfo().userId,
        parkingId: this.notifyData.parkingId,
        garageId: this.notifyData.garageId
      }
      console.log(params, 'scanParams---mark', this.pay_mark)
      const { data: res } = await serve.codePay(params)
      console.log(res, 'scan-res 支付')

      if (res.code === 200) {
        this.$message.success('支付成功！')
        this.endLoading()
        this.$notify.closeAll()
        this.success(this.notifyData)
        this.notifyData = {}
        this.refesh()
      } else {
        this.endLoading()
        this.$message.success('支付失败！')
      }
    },
    //  input 获取焦点
    async preparePay(val) {
      const b = JSON.stringify(this.notifyData) === '{}'
      if (val !== undefined) {
        this.QRCode = val
        this.QRCodeNumber = ''
        this.startLoading()
        if (!b) {
          await this.handleScanCode()
        }
      }
    },
    // getSock(msg) {
    //   if (msg.data !== '服务器连接成功！') {
    //     let data = msg.data
    //     data = JSON.parse(data)
    //     console.log(msg.data, 'MSG', JSON.parse(msg.data))
    //     console.log(this.notifyData, 'this.notifyData', data)
    //     // status: 0 -- 待支付  1 -- 已支付 2 -- 已取消
    //     if (data.status === 0 && getUserInfo().isToll === 1) {
    //       this.notifyData = data
    //       this.$refs.inputFocus.focus()
    //       this.unpaid(data)
    //     }
    //     if (data.status === 1) {
    //       this.success(data)
    //     }
    //   }
    // },
    success(data) {
      const that = this
      that.success_notify = this.$notify({
        title: data.carNo,
        type: 'success',
        showClose: false,
        position: 'bottom-right',
        offset: 100,
        iconClass: 'notify_icon',
        customClass: 'waring_notify',
        dangerouslyUseHTMLString: true,
        message: `<p clas="order_number" style="position:absolute; top: 15px; right: 36px">订单号：${data.orderNo}</p>
                  <div class="notify_box">
                    <b>支付成功</b>
                    <span>人工结算完成</span>
                  </div>`
      })
    },
    // 待支付 notify
    unpaid(data) {
      if (this.success_noyify) {
        this.success_noyify.close()
      }
      const that = this
      that.unpaid_notify = this.$notify({
        title: data.carNo,
        type: 'warning',
        showClose: false,
        position: 'bottom-right',
        offset: 100,
        duration: 0,
        iconClass: 'notify_icon',
        customClass: 'waring_notify',
        dangerouslyUseHTMLString: true,
        onClick: this.goTocharge,
        message: `<p clas="order_number" style="position:absolute; top: 15px; right: 36px">订单号：${data.orderNo}</p>
                  <div class="notify_box">
                    <b>出场</b>
                    <span>停车计费时长：${data.parkHour}h</span>
                    <span>待付订单金额：${data.billingAmount}</span>
                  </div>`
      })
    },
    // 人工收费跳转
    goTocharge() {
      // isCashPayment = true
      console.log(isCashPayment, 'isCashPayment')
      this.notifyData.timeNow = Date.now()
      if (this.$route.name !== 'chargeAwait') {
        this.$router.push({
          path: '/artificailCharge/charge-await',
          query: { notifyData: JSON.stringify(this.notifyData) }
        })
      } else {
        this.$router.push({
          query: { notifyData: JSON.stringify(this.notifyData) }
        })
      }
    },
    // 页面刷新跳转
    refesh() {
      if (this.$route.name !== 'chargeAwait') {
        this.$router.push({
          path: '/artificailCharge/charge-await',
          query: { notifyData: JSON.stringify(this.notifyData) }
        })
      } else {
        this.$router.push({
          query: { notifyData: JSON.stringify(this.notifyData) }
        })
      }
    },
    startLoading() {
      const that = this
      that.Loading = this.$loading({
        lock: true,
        text: '正在支付...',
        background: 'rgba(0, 0, 0, 0.5)'
      })
    },
    endLoading() {
      this.Loading.close()
    }
  }
}
