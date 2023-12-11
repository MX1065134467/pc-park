<template>
  <div class='data-analysis'>
    <transition name="fade">
      <div class="park-list" v-show="isShowParkList">
        <ParkList :parkList="parkListData" @parkNameSearch="getParkingList" @choosePark="choosePark"/>
      </div>
    </transition>
    <div class="park-control">
      <img
        :class="[isShowParkList ? 'close-control' : 'open-control', 'control-icon']"
        src="~@/assets/image/earl/direction.svg"
        @click="showParkList">
    </div>
    <div class="park-data" :style="{ width: isShowParkList ? 'calc(100% - 330px)' : 'calc(100% - 30px)' }">
      <div class="data-title">
        <p class="title">当前停车场：{{currentPark.garage_name}}</p>
        <p>{{ currentTime }}</p>
        <!-- <el-button class="printer" type="primary" icon="el-icon-printer">打印</el-button> -->
      </div>
      <ul class="data-panel">
        <li class="data-panel-item">
          <img class="item-icon" src="@/assets/image/earl/car_icon.png">
          <div class="item-sum">
            <p>当前车流量</p>
            <p>{{topData&&topData.flowSum ? topData.flowSum : 0}}</p>
          </div>
          <div class="item-details">
            <p>进场：{{topData&&topData.carInSum ? topData.carInSum : 0 }}</p>
            <p>出场：{{topData&&topData.carOutSum ? topData.carOutSum : 0 }}</p>
          </div>
        </li>
        <li class="data-panel-item">
          <img class="item-icon" src="@/assets/image/earl/money.svg">
          <div class="item-sum">
            <p>已收费用</p>
            <p>{{topData&&topData.collectedFees ? topData.collectedFees : 0}}</p>
          </div>
          <div class="item-details">
            <p>售卡：{{topData&&topData.sellCardProfit ? topData.sellCardProfit : 0 }}</p>
            <p>临停：{{topData&&topData.temporaryStopProfit ? topData.temporaryStopProfit : 0 }}</p>
          </div>
        </li>
        <li class="data-panel-item">
          <img class="item-icon" src="@/assets/image/earl/parking.svg">
          <div class="item-sum">
            <p>剩余车位</p>
            <p>{{topData&&topData.leaveCount ? topData.leaveCount : 0}}</p>
          </div>
          <div class="item-details">
            <p>总车位：{{topData.totalCount ? topData.totalCount : 0}}</p>
            <p>使用：{{topData&&topData.usingCount ? topData.usingCount : 0 }}</p>
          </div>
        </li>
      </ul>
      <div class="data-chart-one">
        <div class="chart-one-item">
          <p>进出场流量图</p>
          <div class="chart-panel">
            <div class="time-set-panel">
              <chart-time-set
                ref="chartTimeSet"
                style="float: right;"
                :types="['date', 'month', 'year']"
                @getTimeRange="getTime($event, 0)" />
            </div>
            <div ref="flowChart" class="flow-chart"></div>
          </div>
        </div>
        <div class="chart-one-item">
          <p>车位利用率</p>
          <div class="chart-panel">
            <div class="time-set-panel">
              <chart-time-set
                ref="chartTimeSetUse"
                style="float: right;"
                :types="['month']"
                @getTimeRange="getTime($event, 1)" />
            </div>
            <div ref="useChart" class="flow-chart"></div>
          </div>
        </div>
      </div>
      <div class="data-chart-two">
        <div class="chart-title">
          <span>收入统计图</span>
          <chart-time-set
            ref="chartTimeSetInCo"
            style="margin-right: 10px;"
            :types="['date', 'month', 'year']"
            @getTimeRange="getTime($event, 2)" />
        </div>
        <div class="chart-info">
          <div ref="incomeChart" class="chart-income"></div>
          <div class="chart-income-info">
            <p class="title">当前收入</p>
            <p class="content">¥ {{inComeInfo.currentIncome ? inComeInfo.currentIncome : 0}}</p>
            <p class="title">进场车流</p>
            <p class="content"> {{inComeInfo.inTrafficFlow ? inComeInfo.inTrafficFlow : 0}}辆</p>
            <p class="title">出场车流</p>
            <p class="content"> {{inComeInfo.outTrafficFlow ? inComeInfo.outTrafficFlow : 0}}辆</p>
            <p class="title">平均停车时长</p>
            <p class="content">{{inComeInfo.averageTime ? inComeInfo.averageTime : 0}}</p>
          </div>
        </div>
      </div>
      <div class="data-chart-two">
        <div class="chart-title">
          <span>车辆来源地分布</span>
          <chart-time-set
            ref="chartTimeSetDistr"
            style="margin-right: 10px;"
            :types="['date', 'month', 'year']"
            @getTimeRange="getTime($event, 3)" />
        </div>
        <div class="chart-info">
          <div ref="sourceChart" class="chart-income"></div>
          <div class="chart-income-info">
            <ul class="source-list">
              <li v-for="item in sourceChartOption.series[0].data" :key="item.name">
                <span>{{ item.name }}</span>
                <span>{{ item.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ParkList from './components/ParkList'
import ChartTimeSet from './components/ChartTimeSet'
// eslint-disable-next-line no-unused-vars
import serve from '@/api/dataAnalysis.api.js'
import moment from 'moment'
import echarts from 'echarts'
import 'echarts/map/js/china.js'

export default {
  name: 'dataAnalysis',
  components: {
    ParkList,
    ChartTimeSet
  },
  props: {},
  data () {
    return {
      inComeInfo: {},
      // 停车场列表
      parkListData: [],
      currentPark: {},
      topData: {},
      isShowParkList: false,
      currentTime: '',
      timer: null,
      chartGroup: ['flowChart', 'useChart', 'incomeChart', 'sourceChart'],
      flowChart: null,
      useChart: null,
      ChartCommonOption: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 0,
          right: 10,
          top: '10%',
          bottom: '20%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: [{
          start: 0,
          type: 'slider',
          right: '7%',
          left: '7%',
          show: false
        }]
      },
      flowChartOption: {
        legend: {
          bottom: 38,
          left: 'center',
          data: ['enter', 'out']
        },
        yAxis: {
          type: 'value',
          min: 0,
          minInterval: 1
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        series: [
          {
            name: '进场',
            type: 'line',
            // stack: '总量',
            data: [],
            itemStyle: {
              color: '#3aa1ff'
            }
          },
          {
            name: '出场',
            type: 'line',
            // stack: '总量',
            data: [],
            itemStyle: {
              color: '#4ecb73'
            }
          }
        ]
      },
      useChartOption: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval: 0,
            rotate: 70
          },
          data: []
        },
        yAxis: {
          name: '车辆利用率',
          minorTick: {
            show: true
          }
        },
        series: [
          {
            name: '利用率',
            type: 'line',
            stack: '总量',
            data: [],
            itemStyle: {
              color: '#3aa1ff'
            }
          }
        ]
      },
      incomeChartOption: {
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          bottom: 38,
          left: 'center',
          data: ['收入']
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: []
        },
        series: [
          {
            name: '收入',
            type: 'bar',
            data: [],
            itemStyle: {
              color: '#3aa1ff'
            }
          }
          // ,
          // {
          //   name: '在库数',
          //   type: 'bar',
          //   data: [],
          //   itemStyle: {
          //     color: '#4ecb73'
          //   }
          // }
        ]
      },
      sourceChartOption: {
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          type: 'continuous',
          min: 0,
          max: 100,
          range: [0, 100],
          text: ['高', '低']
          // calculable: false
        },
        geo: {
          map: 'china',
          roam: false, // 不开启缩放和平移
          zoom: 1.23, // 视角缩放比例
          label: {
            normal: {
              show: true,
              fontSize: '10', // 注意：地图省份名字字体如果过大会导致字体重叠
              color: 'rgba(0,0,0,0.7)'
            }
          },
          itemStyle: {
            borderColor: 'rgba(0, 0, 0, 0.2)'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#F3B329', // 鼠标选择区域颜色
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [
          {
            name: '车辆来源地',
            type: 'map',
            geoIndex: 0,
            data: []
          }
        ]
      }
    }
  },
  watch: {
    currentPark: {
      handler: function (newV, oldV) {
        if (newV !== null || oldV !== null) {
          this.getTopData()
          this.getinOutFlow()
          this.getParkSpaceUtilization()
          this.getOriginDistribution()
          this.getIncomeStatistics()
          this.$refs.chartTimeSet.activeType = 'date'
          this.$refs.chartTimeSet.time = moment().format('YYYY-MM-DD')
          this.$refs.chartTimeSetUse.time = moment().format('YYYY-MM')
          this.$refs.chartTimeSetDistr.activeType = 'date'
          this.$refs.chartTimeSetDistr.time = moment().format('YYYY-MM-DD')
          this.$refs.chartTimeSetInCo.activeType = 'date'
          this.$refs.chartTimeSetInCo.time = moment().format('YYYY-MM-DD')
        }
      },
      // immediate: true,
      deep: true
    }
  },
  created () {
    window.clearInterval(this.timer)
    this.timer = null
    Object.assign(this.flowChartOption, this.ChartCommonOption)
    Object.assign(this.useChartOption, this.ChartCommonOption)
    Object.assign(this.incomeChartOption, this.ChartCommonOption)
  },
  mounted () {
    this.getCurrentTime()
    this.chartGroup.map(item => {
      this.chartInit(item)
    })
    window.onresize = () => {
      this.chartResize()
    }
    this.getParkingList()
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
    this.timer = null
    window.onresize = null
    this.chartGroup.map(item => {
      this[item].dispose()
      this[item] = null
    })
  },
  methods: {
    getCurrentTime() {
      this.timer = setInterval(() => {
        this.currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
    },
    getTime(data, type) {
      console.log(data, type)
      switch (type) {
        case 0:
          this.getinOutFlow(data)
          break
        case 1:
          this.getParkSpaceUtilization(data)
          break
        case 2:
          this.getIncomeStatistics(data)
          break
        case 3:
          this.getOriginDistribution(data)
          break
      }
      console.log(type, 'ddddddddddddddddddddddddddd')
    },
    chartInit(data) {
      const chartDom = this.$refs[data]
      this[data] = echarts.init(chartDom)
      this[data].setOption(this[`${data}Option`])
    },
    chartResize() {
      this.chartGroup.map(item => {
        this[item].resize()
      })
    },
    showParkList() {
      this.isShowParkList = !this.isShowParkList
      this.$nextTick(() => {
        this.chartResize()
      })
    },
    choosePark (data) {
      this.currentPark = data
    },
    // 停车场列表
    getParkingList (parkName) {
      const params = {
        parkName: parkName || ''
      }
      this.parkListData = []
      this.currentPark = {}
      serve.getParkingList(params).then(res => {
        if (res.data.code === 200) {
          this.parkListData = res.data.data
          this.currentPark = this.parkListData[0]
          // 获取车库后来调用函数
        } else {
          this.$message({ type: 'warning', message: res.data.msg })
        }
      })
    },
    // 收入统计
    getIncomeStatistics (timeArray) {
      if (!(this.currentPark && this.currentPark.garage_id)) {
        return
      }
      const startTime = new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime()
      const endTime = new Date(moment().format('YYYY-MM-DD') + ' 23:59:59').getTime()
      if (!timeArray) {
        timeArray = [startTime, endTime, 'date']
      }
      let timeType = 0
      switch (timeArray[2]) {
        case 'date':
          timeType = 1
          break
        case 'month':
          timeType = 2
          break
        case 'year':
          timeType = 3
          break
      }
      const params = {
        beginTime: timeArray[0],
        choice: timeType,
        endTime: timeArray[1],
        garageId: Number(this.currentPark.garage_id)
      }
      serve.getIncomeStatistics(params).then(res => {
        const inComeArray = []
        const accepted = []
        // const waitArray = []
        if (res.data.code === 200) {
          this.inComeInfo = res.data.data
          res.data.data.tempIncomeList.forEach(item => {
            inComeArray.push(item.time)
            accepted.push(item.tempIncome)
          })
          // res.data.data.awaitCountList.forEach(item => {
          //   waitArray.push(item.awaitCount)
          // })
          this.incomeChartOption.xAxis.data = inComeArray
          this.incomeChartOption.yAxis.axisLabel = {
            formatter: function (val) {
              return val
            }
          }
          // console.log()
          this.incomeChartOption.series[0].data = accepted
          // // this.incomeChartOption.series[1].data = waitArray
          this.incomeChart.setOption(this.incomeChartOption)
        } else {
          this.$message({ type: 'warning', message: res.data.msg })
        }
      })
    },
    // 车辆来源分布
    getOriginDistribution (timeArray) {
      if (!(this.currentPark && this.currentPark.garage_id)) {
        return
      }
      const startTime = new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime()
      const endTime = new Date(moment().format('YYYY-MM-DD') + ' 23:59:59').getTime()
      if (!timeArray) {
        timeArray = [startTime, endTime, 'date']
      }
      let timeType = 0
      switch (timeArray[2]) {
        case 'date':
          timeType = 1
          break
        case 'month':
          timeType = 2
          break
        case 'year':
          timeType = 3
          break
      }
      const params = {
        beginTime: timeArray[0],
        choice: timeType,
        endTime: timeArray[1],
        garageId: this.currentPark.garage_id
      }
      serve.getOriginDistribution(params).then(res => {
        console.log(res, '车辆来源分布')
        if (res.data.code === 200) {
          const sourceData = []
          let max = 0
          if (res.data.data.length > 0) {
            res.data.data.forEach(item => {
              sourceData.push({
                name: item.item_name,
                value: item.count
              })
              max += item.value
            })
            this.sourceChartOption.series[0].data = sourceData
            this.sourceChartOption.visualMap.max = max >= 100 ? max : 100
            this.sourceChart.setOption(this.sourceChartOption)
          } else {
            this.$message({ type: 'warning', message: '车辆来源数据为空' })
          }
        } else {
          this.$message({ type: 'warning', message: res.data.msg })
        }
      })
    },
    // 车利用率
    getParkSpaceUtilization (date) {
      if (!(this.currentPark && this.currentPark.garage_id)) {
        return
      }
      let startTime, endTime
      if (!date) {
        startTime = new Date(moment().startOf('month').format('YYYY-MM-DD') + ' 00:00:00').getTime()
        endTime = new Date(moment().endOf('month').format('YYYY-MM-DD') + ' 23:59:59').getTime()
      } else {
        startTime = date[0]
        endTime = date[1]
      }
      const params = {
        beginTime: startTime,
        endTime,
        choice: 2,
        garageId: this.currentPark.garage_id
      }
      serve.getParkSpaceUtilization(params).then(res => {
        if (res.data.code === 200) {
          const dataArray = {
            lengecy: [],
            in: []
          }
          res.data.data.forEach(item => {
            dataArray.lengecy.push(item.stat_date)
            dataArray.in.push(item.utilization)
          })
          this.useChartOption.xAxis.data = dataArray.lengecy
          this.useChartOption.yAxis.axisLabel = {
            formatter: function (val) {
              return (val * 100).toFixed(1) + '%'
            }
          }
          this.useChartOption.series[0].data = dataArray.in
          this.useChart.setOption(this.useChartOption)
        } else {
          this.$message({ type: 'warning', message: res.data.msg })
        }
      })
    },
    // 进出流量数据
    getinOutFlow (timeArray) {
      if (!(this.currentPark && this.currentPark.garage_id)) {
        return
      }
      const startTime = new Date(moment().format('YYYY-MM-DD') + ' 00:00:00').getTime()
      const endTime = new Date(moment().format('YYYY-MM-DD') + ' 23:59:59').getTime()
      if (!timeArray) {
        timeArray = [startTime, endTime, 'date']
      }
      let timeType = 0
      switch (timeArray[2]) {
        case 'date':
          timeType = 1
          break
        case 'month':
          timeType = 2
          break
        case 'year':
          timeType = 3
          break
      }
      const params = {
        beginTime: timeArray[0],
        choice: timeType,
        endTime: timeArray[1],
        garageId: this.currentPark.garage_id
      }
      serve.inOutFlow(params).then(res => {
        console.log(res, '进出流量数据')
        if (res.data.code === 200) {
          const dataArray = {
            lengecy: [],
            in: [],
            out: []
          }
          res.data.data.inCountList.forEach(item => {
            dataArray.lengecy.push(item.time)
            dataArray.in.push(item.inCount)
          })
          res.data.data.outCountList.forEach(item => {
            dataArray.out.push(item.outCount)
          })
          this.flowChartOption.xAxis.data = dataArray.lengecy
          this.flowChartOption.series[0].data = dataArray.in
          this.flowChartOption.series[1].data = dataArray.out
          this.flowChartOption.yAxis.axisLabel = {
            formatter: function (val) {
              return val
            }
          }
          this.flowChart.setOption(this.flowChartOption)
        } else {
          this.$message({ type: 'warning', message: res.data.msg })
        }
      })
    },
    // 获取顶部的数据
    getTopData () {
      if (!(this.currentPark && this.currentPark.garage_id)) {
        return
      }
      const params = {
        garageId: this.currentPark.garage_id
      }
      serve.topData(params).then(res => {
        console.log(res, '获取顶部的数据')
        if (res.data.code === 200) {
          this.topData = res.data.data
        } else {
          this.$message({ type: 'warning', message: res.data.msg })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.data-analysis {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  .park-list {
    // flex: 0 0 300px;
    width: 300px;
    // height: 100%;
   overflow-y: scroll;
  }
  .park-control {
    // flex: 0 0 30px;
    width: 30px;
    height: 100%;
    .control-icon {
      width: 30px;
      height: 30px;
      margin-top: 10px;
      cursor: pointer;
    }
    .close-control {
      transform: rotate(180deg);
      transition: all .5s ease;
      position: absolute;
      left: 298px;
    }
    .open-control {
      transform: rotate(0);
      transition: all .5s ease;
      position: absolute;
      left: 0px;
    }
  }
  .park-data {
    // flex-grow: 1;
    // width: calc(100% - 330px);
    display: flex;
    flex-direction: column;
    margin: 10px;
    overflow-y:scroll;
    overflow-x:hidden;
    .data-title {
      p {
        float: left;
        height: 48px;
        line-height: 48px;
        padding: 0 20px;
        font-weight: 600;
      }
      .title {
        background: #f2f2f2;
      }
      .printer {
        float: right;
      }
    }
    .data-panel {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 10px;
      &-item {
        width: 30%;
        height: 120px;
        background: #f2f2f2;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        .item-icon {
          width: 50px;
          height: 50px;
        }
        .item-sum {
          text-align: center;
          font-size: 18px;
          font-weight: 600;
          p {
           &:first-child {
             margin-bottom: 20px;
           }
          }
        }
        .item-details {
          font-size: 14px;
          text-align: center;
          p {
           &:first-child {
             margin-bottom: 10px;
           }
          }
        }
      }
    }
    .data-chart-one {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .chart-one-item {
        width: 49%;
        height: 400px;
        border: 1px solid #f2f2f2;
        display: flex;
        flex-direction: row;
        p {
          flex: 0 0 26px;
          height: 100%;
          font-size: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          border-right: 1px solid #f2f2f2;
        }
        .chart-panel {
          padding: 10px;
          flex: 1;
          display: flex;
          flex-direction: column;
          .time-set-panel {
            height: 40px;
            line-height: 40px;
          }
          .flow-chart {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .data-chart-two {
      width: 100%;
      display: flex;
      flex-direction: column;
      border: 1px solid #f2f2f2;
      margin-top: 10px;
      margin-bottom: 10px;
      .chart-title {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f2f2f2;
        span {
          margin-left: 10px;
          font-weight: 600;
        }
      }
      .chart-info {
        width: 100%;
        height: 600px;
        display: flex;
        flex-direction: row;
        .chart-income {
          flex: 1;
          padding: 10px;
        }
        .chart-income-info {
          flex: 0 0 200px;
          border-left: 1px solid #f2f2f2;
          padding: 10px;
          .title {
            font-size: 16px;
            padding: 10px 0;
            color: #606266;
          }
          .content {
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            padding: 10px 0 20px;
          }
          .source-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            li {
              width: 50%;
              padding: 6px 0;
              color: #606266;
              span {
                &:first-child {
                  margin-right: 6px;
                }
              }
            }
          }
        }
      }
    }
  }
}
.fade-enter-active {
  animation: bounce-in .5s;
}
.fade-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
    width: 0;
  }
  70% {
    opacity: .3;
  }
  100% {
    opacity: 1;
    width: 300px;
  }
}
</style>
