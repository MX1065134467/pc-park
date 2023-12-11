<template>
  <div class="ticket-wrap container" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
    <div class="head">
      <h3 class="head_title">选择车位</h3>
      <el-button size="small" type="primary" icon="el-icon-back" @click="$router.go(-1)">返 回</el-button>
    </div>
    <div class="content">
      <div class="pannel-box">
        <div class="pannel-left">
            <div class="box-area">
              <span v-for="(item,index) of areaArr" :key="index" :class="activeArea === index ? 'box active' : 'box'" @click="areaChange(item,index)">{{item.name}}</span>
            </div>
            <div class="second-area">
              <span v-for="(item,index) of lists" :key="'~'+index" :class="activeSecondArea === index ? 'right-small second-active': 'right-small'" @click="areaSecondChange(item, index)">{{item.name}}</span>
            </div>
          </div>
        <div class="pannel-body">
          <div class="pannel-right" v-show="flag">
            <div class="top-div">
              <div class="single-box">
                <div>
                  <span class="car-remark">车位数：</span>
                  <span class="percent-num">{{garageData.parkingAvailable}}/{{garageData.parkingCount}}</span>
                </div>
                <div class="remark">可用/总数</div>
              </div>
              <div class="single-box">
                <div>
                  <span class="car-remark">公私占比：</span>
                  <span class="percent-num">{{garageData.parkingPublic}}/{{garageData.parkingPrivate}}</span>
                </div>
                <div class="remark">公共车位/私人车位</div>
              </div>
              <div class="single-box">
                <div>
                  <span class="car-remark">可用临时车位：</span>
                  <span class="percent-num">{{garageData.parkingTemporary}}/{{garageData.parkingPublic}}</span>
                </div>
                <div class="remark">临时可用/公用车位</div>
              </div>
            </div>
            <div class="bottom-div">
              <div class="left-graph">
                <div style="width:500px;height:400px" id="myStallChart"></div>
              </div>
              <div class="left-graph">
                <div style="width:500px;height:400px" id="myUserChart"></div>
              </div>
            </div>
          </div>
          <div class="right-component" v-if="!flag">
            <div class="top-show">
              <div class="color-intro">
                <div class="color-box">
                  <span class="bg-span no-open"></span>
                  未开启
                </div>
                <div class="color-box">
                  <span class="bg-span private-bg"></span>
                  私家车位
                </div>
                <div class="color-box">
                  <span class="bg-span free-bg"></span>
                  空闲
                </div>
                <div class="color-box">
                  <span class="bg-span park-card"></span>
                  车位卡
                </div>
              </div>
            </div>
            <div ref="parkingBox" class="parking-box" v-infinite-scroll="load" :infinite-scroll-distance="10" :infinite-scroll-delay="1000"  v-if="hasStall">
              <card-info @chooseIndex="chooseChange" :disabled="true"  v-for="(item,index) of carInfoData" :key="index" :item="item" :activeGarageDetailId="activeGarageDetailId" :my_mark="1"></card-info>
              <p v-if="stallLoading" class="loading">加载中...</p>
              <!-- <p v-if="noMore">没有更多了</p> -->
            </div>
          </div>
           <div class="footer">
            <el-button size="small" type="primary" @click="$router.go(-1)">上一步</el-button>
            <el-button size="small" type="primary" v-show="!flag" @click="nextStep">确 定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serve from '@/api/parkingCardSell.api.js'
import CardInfo from '@v/basicFacility/dialog/CardInfo'
import { deepClone } from '@/utils/util.js'
const Echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  name: 'choiseStall',
  components: { CardInfo },
  data () {
    return {
      loading: false,
      garageData: {},
      areaArr: [],
      activeArea: 0,
      activeSecondArea: -1,
      stallChartData: [
        { value: 'maintainCount', name: '未开启' },
        { value: 'parkingTemporary', name: '空车位' },
        { value: 'usingCount', name: '已用车位' },
        { value: 'parkingPrivate', name: '私人车位' }
      ],
      myUserChart: [
        { value: 'contractDate', name: '包天卡用户' },
        { value: 'parkingPrivate', name: '私人车位用户' },
        { value: 'temporaryCount', name: '临停用户' }
      ],
      flag: true,
      chooseGarge: null,
      garageId: null, // 车库主键
      garageFloorId: null, // 车库楼层主键
      garageRegionId: null, // 分区分库主键
      pageNo: 1, // 分页页数
      totalPage: 1, // 总页数
      pageSize: 80, // 每页数据数量
      carInfoData: [], // 车位列表
      activeGarageDetailId: null,
      hasStall: false,
      stallLoading: false,
      totalCount: null // 车位总数
    }
  },
  async created() {
    this.init()
  },
  computed: {
    lists () {
      return this.areaArr[this.activeArea] && this.areaArr[this.activeArea].children
    }
  },
  methods: {
    init() {
      const { garageId } = JSON.parse(sessionStorage.getItem('orderInfo') || {})
      serve.parkingManage({ garageId }).then(({ data: res }) => {
        if (res.code === 200) {
          this.garageData = res.data
          this.garageId = res.data.garageId
          // charts 1
          const arrList = []
          deepClone(arrList, this.stallChartData)
          arrList.map(item => {
            item.value = this.garageData[item.value]
          })
          this.stallChart(arrList)
          // charts 2
          const userCahrt = []
          deepClone(userCahrt, this.myUserChart)

          userCahrt.map(item => {
            item.value = this.garageData[item.value]
          })
          this.userChart(userCahrt)

          // 获取单个车位
          // 1-平面,2-多层,3-立体机械
          if (res.data.garageType === 1) {
            // 1-分,0-否
            if (res.data.isRegion === 0) {
              this.areaArr.push({ name: '不分区' })
            } else {
              this.areaArr = res.data.region.map(item => {
                return {
                  name: item.regionName,
                  garageRegionId: item.garageRegionId,
                  garageFloorId: item.garageFloorId
                }
              })
            }
          } else if (res.data.garageType === 2) { // 2-多层
            this.areaArr = res.data.floor.map(item => {
              if (item.isRegion === 1) {
                var sonArr = item.region.map(son => {
                  return {
                    name: son.regionName,
                    garageRegionId: son.garageRegionId,
                    garageFloorId: son.garageFloorId
                  }
                })
              }
              return {
                name: item.floorName,
                garageFloorId: item.garageFloorId,
                children: sonArr
              }
            })
          } else {
            this.areaArr = res.data.region.map(item => {
              return {
                name: item.regionName,
                garageId: item.garageId,
                garageRegionId: item.garageRegionId,
                garageFloorId: item.garageFloorId
              }
            })
          }
          this.areaArr.unshift({
            name: '全部车位'
          })
        }
      })
    },

    async areaChange(item, idx) {
      this.activeArea = idx
      if (idx === 0) {
        this.flag = true // 全部车位
      } else {
        this.flag = false
        this.garageFloorId = item.garageFloorId
        this.garageRegionId = item.garageRegionId
        this.carInfoData = []
        this.activeSecondArea = -1
        await this.queryStall()
      }
    },
    // 获取单个停车场的停车位
    async queryStall () {
      const params = {
        garageId: this.garageId,
        garageFloorId: this.garageFloorId,
        garageRegionId: this.garageRegionId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      if (this.pageNo === 1) {
        this.carInfoData = []
      }
      const that = this
      const { data: res } = await serve.getGarageList(params)
      if (res.code === 200) {
        this.stallLoading = false
        that.totalCount = res.data.totalPage
        that.totalPage = res.data.totalPage
        var datalist = res.data.rows.map(item => {
          if (item.status !== 0) {
            item.updateSta = true
          } else {
            item.updateSta = false
          }
          return {
            ...item,
            updateSta: item.updateSta
          }
        })
        this.carInfoData = that.carInfoData.concat(datalist)
        that.hasStall = true
        console.log(this.carInfoData.length, 'this.carInfoData')
      }
    },
    areaSecondChange (item, index) {
      this.activeSecondArea = index
      this.garageFloorId = item.garageFloorId
      this.garageRegionId = item.garageRegionId
      this.queryStall()
    },
    stallChart(data) {
      const myStallChart = Echarts.init(document.getElementById('myStallChart'))
      myStallChart.setOption({
        title: {
          text: '停车位类型占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#46A1FF', '#4DCCCB', '#58CC74', '#FCD44A'],
        legend: {
          bottom: 0,
          left: 'center',
          data: ['未开启', '空车位', '已用车位', '私人车位']
        },
        series: [
          {
            name: '类型占比',
            type: 'pie',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: data
          }
        ]
      })
    },
    userChart(data) {
      const myUserChart = Echarts.init(document.getElementById('myUserChart'))
      myUserChart.setOption({
        title: {
          text: '停车位类型占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#D22127', '#294556', '#4BA2AA'],
        legend: {
          bottom: 0,
          left: 'center',
          data: ['包天卡用户', '私人车位用户', '临停用户']
        },
        series: [
          {
            name: '类型占比',
            type: 'pie',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: data
          }
        ]
      })
    },
    // 单个车位选中
    chooseChange(val) {
      if (val.garageDetailId === this.activeGarageDetailId) {
        this.activeGarageDetailId = null
        this.parkingInfo = {}
      } else {
        this.activeGarageDetailId = val.garageDetailId
        this.chooseGarge = val
      }
    },
    async load () {
      if (this.pageNo < this.totalPage) {
        this.pageNo = this.pageNo + 1
        this.stallLoading = true
        await this.queryStall()
      }
    },
    async nextStep() {
      if (!this.chooseGarge) {
        return this.$message.info('请选择车位！')
      }
      this.loading = true
      const { garageDetailId } = this.chooseGarge
      const orderIfo = JSON.parse(sessionStorage.getItem('orderInfo') || {})
      orderIfo.garageDetailId = garageDetailId
      const { data: res } = await serve.buyCard(orderIfo)
      if (res.code === 200) {
        this.loading = false
        this.$message.success('创建订单成功！')
        const orderDetail = Object.assign(orderIfo, res.data)
        sessionStorage.setItem('orderInfo', JSON.stringify(orderDetail))
        this.$router.push({ path: '/parkingCardSell/sale-list/createOrder' })
      } else {
        this.$message.info(res.msg)
        this.loading = false
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
    padding: 10px 20px;
    box-sizing: border-box;
    h3 {
      color: #ffffff;
      font-weight: normal;
      margin: 0;
    }
  }
  .content {
    flex: 1;
    flex-grow: 1;
    padding: 20px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .pannel-nav {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #606266;
    }
    .pannel-box {
      flex: 1;
      height: 100%;
      display: flex;
      .pannel-left {
          display: flex;
          height: 100%;
          min-width: 210px;
          .box-area {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            padding: 20px;
            box-sizing: border-box;
            position: relative;
            .box {
              height: 50px;
              display: inline-block;
              line-height: 50px;
              border-radius: 10px;
              padding: 0 10px;
              margin: 5px 0;
              text-align: center;
              background: #ebebeb;
              border: 1px solid #000;
              cursor: pointer;
            }
            .active {
              background: #409eff;
              color: #ffffff;
            }
          }
          .second-area {
            display: flex;
            flex-direction: column;
            margin-top: 50px;
            padding-right: 10px;
            box-sizing: border-box;
            .right-small {
              padding: 5px 10px;
              height: 25px;
              line-height: 25px;
              text-align: center;
              background: #ebebeb;
              margin: 0 0 8px 0;
              border-radius: 10px;
              border: 1px solid #000;
              cursor: pointer;
            }
            .second-active {
              background: #409eff;
              color: #ffffff;
            }
          }
        }
        .pannel-right {
          padding: 20px;
          box-sizing: border-box;
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 94%;
          margin: 20px;
          border: 1px solid #ccc;
          .top-div {
            display: flex;
            justify-content: space-around;
            .single-box {
              border-radius: 10px;
              width: 200px;
              height: 50px;
              border: 1px solid #818181;
              padding: 20px 20px 10px 20px;
              .car-remark {
                font-weight: 700;
              }
              .percent-num {
                color: #d83d3d;
                font-weight: 600;
              }
              .remark {
                margin-left: 60px;
                margin-top: 10px;
                font-size: 12px;
              }
            }
          }
          .bottom-div {
            flex: 1;
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            .left-graph {
              width: 45%;
              height: 90%;
            }
          }
        }
      .right-component {
          padding: 20px;
          box-sizing: border-box;
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          margin: 20px;
          border: 1px solid #ccc;
          overflow: hidden;
        .top-show {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          .color-intro {
            height: 36px;
            display: flex;
            justify-content: flex-start;
            .color-box {
              height: 36px;
              display: flex;
              align-items: center;
              margin-right: 25px;
              .bg-span {
                width: 50px;
                height: 30px;
                display: inline-block;
                margin-right: 5px;
              }
              .no-open {
                background: #ebebeb;
              }
              .private-bg {
                background: #ffcc00;
              }
              .free-bg {
                background: #33cccc;
              }
              .park-card {
                background: #339900;
              }
            }
          }
        }
        .parking-box{
          display:flex;
          flex-wrap:wrap;
          align-content:flex-start;
          flex:1;
          overflow:auto;
          .loading {
             width: 100%;
             margin-top: -25px;
             text-align: center;
             color: #535353;
             font-size: 12px;
          }
          &::-webkit-scrollbar {
            width: 4px;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: #535353;
          }
          &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            border-radius: 10px;
            background: #EDEDED;
          }
        }
      }
      .pannel-body {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;
        // margin-bottom: 13px;
      }
      .footer {
        display: flex;
        justify-content: center;
        .el-button:nth-child(2) {
          margin: 0 20px;
        }
      }
    }
  }
}
</style>
