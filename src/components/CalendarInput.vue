<template>
  <div class="calender-input">
    <div class="calender-content">
      <div class="title">{{nowDateTitle}}</div>
      <div class="calender_body">
        <div class="thead">
          <div>一</div>
          <div>二</div>
          <div>三</div>
          <div>四</div>
          <div>五</div>
          <div>六</div>
          <div>日</div>
        </div>
        <div class="tbody">
          <div class="table_row" v-for="(item, index) of totalData.timeArray" :key="index">
            <div class="date">{{item.enactmentDate}}</div>
            <slot name="content_template" :data="item"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: '',
  components: {},
  props: {
    totalData: {
      type: Object
    }
  },
  data () {
    return {
      // 日历自定义时间范围
      rangeTime: [],
      nowDateTitle: '',
      rangeTimeArray: []
    }
  },
  watch: {
    'totalData.defaultMoney': {
      handler(newValue, oldValue) {
        this.handleToData(newValue)
      },
      deep: true,
      immediate: true
    }
  },
  created () {},
  mounted () {
    const defaultMoney = this.totalData.defaultMoney
    this.totalData.timeArray = []
    // 今天的时间
    const nowDate = moment().format('YYYY-MM-DD')
    this.nowDateTitle = moment().get('year') + ' 年 ' + Number(moment().get('month') + 1) + ' 日 '
    // 这个礼拜的礼拜一
    const startTime = moment(moment().day(1)).format('YYYY-MM-DD')
    // 30天后的时间
    const lastDate = moment(moment().subtract(-29, 'day')).format('YYYY-MM-DD')
    const end = moment().subtract(-29, 'day')
    // 30天后的时间的礼拜天
    const endTime = end.day(7).format('YYYY-MM-DD')
    this.rangeTime = [startTime, endTime]
    for (let i = 0; ; i++) {
      const time = moment(moment().day(1)).subtract(-i, 'day')
      const key = time.format('YYYY-MM-DD')
      if (moment(time.format('YYYY-MM-DD')).diff(moment(nowDate)) < 0) {
        if (typeof (defaultMoney) !== 'object') {
          this.totalData.timeArray.push({
            enactmentDate: key,
            showFixedPriceAmount: '',
            disabled: true
          })
        } else {
          this.totalData.timeArray.push({
            enactmentDate: key,
            showFixedPriceAmount: '不可选择',
            disabled: true
          })
        }
      } else if (moment(time.format('YYYY-MM-DD')).diff(moment(nowDate)) >= 0 && moment(time.format('YYYY-MM-DD')).diff(moment(lastDate)) <= 0) {
        // 在30天内的时间 默认为包车价格
        if (typeof (defaultMoney) !== 'object') {
          this.totalData.timeArray.push({
            enactmentDate: key,
            showFixedPriceAmount: defaultMoney.toFixed(2),
            disabled: false
          })
        } else {
          const index = defaultMoney.findIndex((res) => {
            return res.enactmentDate === key
          })
          if (index === -1) {
            this.totalData.timeArray.push({
              enactmentDate: key,
              showFixedPriceAmount: '空闲',
              disabled: false
            })
          } else {
            this.totalData.timeArray.push({
              enactmentDate: key,
              showFixedPriceAmount: defaultMoney[index].occupyStatus === 1 ? defaultMoney[index].showFixedPriceAmount.toFixed(2) : (defaultMoney[index].occupyStatus === 2 ? '已售' : '占用'),
              disabled: defaultMoney[index].occupyStatus === 2
            })
          }
        }
      } else {
        if (typeof (defaultMoney) !== 'object') {
          this.totalData.timeArray.push({
            enactmentDate: key,
            showFixedPriceAmount: '',
            disabled: true
          })
        } else {
          this.totalData.timeArray.push({
            enactmentDate: key,
            showFixedPriceAmount: '不可选择',
            disabled: true
          })
        }
      }
      // 如果是最后一天的话 跳出循环
      if (time.format('YYYY-MM-DD') === endTime) {
        break
      }
    }
    [...this.rangeTimeArray] = this.totalData.timeArray
    // 调价
    if (this.totalData.flag === 1) {
      this.totalData.timeArrayAdjust.map(res => {
        const index = this.rangeTimeArray.findIndex(label => {
          return !label.disabled && label.enactmentDate === res.enactmentDate
        })
        if (index !== -1) {
          if (this.$route.query.flag === 2) {
            this.rangeTimeArray[index].disabled = true
          }
          this.rangeTimeArray[index].showFixedPriceAmount = res.showFixedPriceAmount.toFixed(2)
        }
      })
      this.totalData.timeArray = this.rangeTimeArray
    }
  },
  methods: {
    handleToData(money) {
      const that = this
      if (that.$route.query.flag) {
        that.totalData.timeArray.map(res => {
          const index = that.rangeTimeArray.findIndex(label => {
            return !label.disabled && label.enactmentDate === res.enactmentDate
          })
          if (index !== -1) {
            if (Number(that.$route.query.flag) === 2) {
              that.rangeTimeArray[index].disabled = true
            }
            that.rangeTimeArray[index].showFixedPriceAmount = Number(res.showFixedPriceAmount).toFixed(2)
          }
        })
        that.totalData.timeArray = that.rangeTimeArray
      } else {
        that.totalData.timeArray.map(res => {
          if (!res.disabled) {
            res.showFixedPriceAmount = money.toFixed(2)
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped></style>
<style lang="scss">
.calender-input {
  .el-calendar {
    border: 1px solid #EBEEF5;
  }
  .el-calendar__header {
    justify-content: center;
  }
  .el-calendar-day {
    height: 70px;
    padding: 0px;
    .c-main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid #EBEEF5;
      height: 100%;
      div {
        &:first-child {
          height: 25px;
          text-align: center;
          background: #aaa;
          color: #fff;
          vertical-align: middle;
          line-height: 25px;
        }
        &:last-child {
          margin-bottom: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          .el-input {
            width: 80px;
            margin-left: 5px;
          }
          .el-input__inner {
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }
  }
  .el-button--text {
    width: 100%;
    color: #606266;
  }
  .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
    color: #C0C4CC;
  }
  .calender-content {
    width: 100%;
    border: 1px solid #ebeef5;
    .title {
      border-bottom: 1px solid #ebeef5;
      padding: 12px 20px;
      text-align: center;
    }
    .calender_body {
      padding: 12px 20px 35px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
      .thead {
        display: flex;
        align-items: center;
        justify-content: center;
        div {
          padding: 12px 0;
          color: #606266;
          font-weight: 400;
          flex: 1;
          text-align: center;
        }
      }
      .tbody {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .table_row {
          border: 1px solid #ebeef5;
          height: 70px;
          width: 120px;
          text-align: center;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          .date {
            height: 25px;
            text-align: center;
            background: #aaa;
            color: #fff;
            vertical-align: middle;
            line-height: 25px;
            width: 100%;
          }
          .money {
            display: flex;
            align-items: center;
            width: 100%;
            justify-content: center;
            height: 100%;
            cursor: pointer;
            .el-input {
              margin-left: 5px;
              width: 80px;
              .el-input__inner {
                height: 30px;
                line-height: 30px;
              }
            }
          }
        }
      }
    }
    .el-button--text {
      width: 100%;
      color: #606266;
    }
    .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
      color: #C0C4CC;
    }
  }
}
</style>
