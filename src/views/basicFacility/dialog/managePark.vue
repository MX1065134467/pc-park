<template>
  <div class="manage-park">
    <div class="top-nav">管理车位</div>
    <div class="content-box">
      <div class="left-condition">
        <div class="box-area">
          <div :class="activeArea === index ? 'box active' : 'box'" @click="areaChange(index,item)" v-for="(item,index) of areaArr" :key="index">{{item.name}}</div>
        </div>
        <div class="right-box" v-if="secondFlag">
          <div :class="activeSecondArea === index2 ? 'right-small second-active': 'right-small'" @click="areaSecondChange(index2, item)" v-for="(item,index2) of areaArr[activeArea].secondName" :key="index2">{{item.name}}</div>
        </div>
      </div>
      <div class="right-content" v-show="showContent">
        <div class="top-div">
          <div class="single-box">
            <div>
              <span class="car-remark">车位数：</span>
              <span class="percent-num">{{showObj.parkingAvailable}}/{{showObj.parkingCount}}</span>
            </div>
            <div class="remark">可用/总数</div>
          </div>
          <div class="single-box">
            <div>
              <span class="car-remark">公私占比：</span>
              <span class="percent-num">{{showObj.parkingPublic}}/{{showObj.parkingPrivate}}</span>
            </div>
            <div class="remark">公共车位/私人车位</div>
          </div>
          <div class="single-box">
            <div>
              <span class="car-remark">可用临时车位：</span>
              <span class="percent-num">{{showObj.parkingTemporary}}/{{showObj.parkingPublic}}</span>
            </div>
            <div class="remark">临时可用/公用车位</div>
          </div>
        </div>
        <div class="bottom-div">
          <div class="left-graph">
            <div style="width:450px;height:450px" id="myChart"></div>
          </div>

          <div class="left-graph">
            <div style="width:450px;height:450px" id="myChart2"></div>
          </div>
        </div>
      </div>
      <div class="right-component" v-if="!showContent">
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
          <div>
            <!-- <el-button type="primary" size="medium" @click="setCode">设置编号</el-button> -->
            <el-button type="primary" size="medium" v-if="setCodeFlag" @click="codeRegular">设置编号</el-button>
            <el-button type="primary" size="medium" @click="pointCarPos">指定车位</el-button>
          </div>
        </div>
        <div v-if="dialogInfo.show">
          <div v-loading="loading" style="display:flex;flex-wrap:wrap;align-content:flex-start;height:700px;overflow:auto;" v-infinite-scroll="load">
            <card-info @chooseIndex="chooseChange" :pShowTips="pShowTips" @statusChange="statusChange" v-for="(item,index) of carInfoData" :key="index" :item="item" :activeGarageDetailId="activeGarageDetailId">
            </card-info>
          </div>
        </div>
      </div>
    </div>
    <div v-if="setCodeDialog.show">
      <set-car-number :parkingInfo="parkingInfo" @pointSpace="pointSpace" @cancel="cancel" :dialogVisible='setCodeDialog'></set-car-number>
    </div>
    <div v-if="codeRegularDialod.show">
      <set-code-regular :setCodeObj="setCodeObj" @setRegular="setRegular" @cancel="cancel" :dialogVisible='codeRegularDialod'></set-code-regular>
    </div>
    <div v-if="dialogFormVisible.show">
      <point-car-position :carInfo="parkingInfo" @pointSpace="pointSpace" @cancel="cancel" :dialogVisible='dialogFormVisible'></point-car-position>
    </div>
  </div>
</template>

<script>
import serve from '@/api/basicEquip.api'
import CardInfo from './CardInfo'
import SetCarNumber from './setCarNumber'
import PointCarPosition from './PointCarPosition'
import SetCodeRegular from './SetCodeRegular'
const Echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  components: {
    CardInfo,
    SetCarNumber,
    PointCarPosition,
    SetCodeRegular
  },
  data() {
    return {
      loading: false,
      activeArea: 0,
      activeSecondArea: '',
      showContent: true,
      secondFlag: false,
      pShowTips: true,
      garageId: '',
      showObj: {},
      pieData: [],
      pie2Data: [],
      areaArr: [],
      carInfoData: [],
      dialogInfo: {
        show: false
      },
      // 停车位信息
      garageFloorId: '',
      garageRegionId: '',
      pageNo: 1,
      pageSize: 84,
      setCodeDialog: {
        show: false
      },
      codeRegularDialod: {
        show: false
      },
      dialogFormVisible: {
        show: false
      },
      parkingInfo: {},
      activeGarageDetailId: null,
      totalPage: '',
      // 防止连续点击
      onpresscTime: '',
      onpresscTime2: '',
      setCodeFlag: false,
      setCodeObj: {}
    }
  },
  created() {
    this.garageId = this.$route.query.garageId
    this.getSingleSpace(this.garageId)
  },
  mounted() {
    this.drawPie()
    this.drawPie2()
    this.carInfoData = []
  },
  methods: {
    load() {
      if (this.pageNo < this.totalPage) {
        this.pageNo = this.pageNo + 1
        this.getSpaceList()
      }
    },
    // 取图表的值
    getSingleSpace() {
      const params = {
        garageId: this.garageId
      }
      serve.getSingleSpace(params).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          // 右边图表赋值
          this.contentData(data)
          if (data.garageType === 1) {
            // 平面多车位
            if (data.isRegion === 1) {
              // 平面多车位分区
              var garageList = data.region.map(item => {
                return {
                  garageId: item.garageId,
                  garageRegionId: item.garageRegionId,
                  name: item.regionName
                }
              })
              this.areaArr = garageList
            } else {
              this.setCodeFlag = true
              this.areaArr.push({
                name: '不分区'
              })
            }
          } else if (data.garageType === 2) {
            // 多层多车位
            const multiData = data.floor.map(item => {
              var secondName = []
              // 分区
              if (item.isRegion === 1) {
                secondName = item.region.map(item2 => {
                  return {
                    garageId: item2.garageId,
                    garageRegionId: item2.garageRegionId,
                    name: item2.regionName
                  }
                })
              }
              return {
                garageId: item.garageId,
                garageFloorId: item.garageFloorId,
                name: item.floorName,
                secondName: secondName
              }
            })
            this.areaArr = multiData
          } else if (data.garageType === 3) {
            // 立体机械
            var dataName = data.region.map(item => {
              return {
                garageId: item.garageId,
                garageRegionId: item.garageRegionId,
                name: item.regionName
              }
            })
            this.areaArr = dataName
          }
          this.areaArr.unshift({
            name: '全部车位'
          })
        }
      })
    },
    contentData(data) {
      // 头部占比赋值
      const obj = {}
      obj.parkingAvailable = data.parkingAvailable
      obj.parkingCount = data.parkingCount
      obj.parkingPublic = data.parkingPublic
      obj.parkingPrivate = data.parkingPrivate
      obj.parkingTemporary = data.parkingTemporary
      this.showObj = obj
      // 左边饼图赋值
      const graphOne = []
      const obj1 = {
        name: '未开启',
        value: Number(data.maintainCount)
      }
      graphOne.push(obj1)
      const obj2 = {
        name: '空车位',
        value: Number(data.parkingTemporary)
      }
      // 已用车位 usingCount
      graphOne.push(obj2)
      const obj3 = {
        name: '已用车位',
        value: Number(data.usingCount)
      }
      graphOne.push(obj3)
      this.pieData = graphOne
      this.drawPie()
      // 右边饼图赋值
      const DataValue = []
      const rightObj = {
        name: '包天卡',
        value: data.contractDate
      }
      DataValue.push(rightObj)
      const rightObj1 = {
        name: '私人车位',
        value: data.parkingPrivate
      }
      DataValue.push(rightObj1)
      const rightObj2 = {
        name: '临停',
        value: Number(data.temporaryCount)
      }
      DataValue.push(rightObj2)
      this.pie2Data = DataValue
      this.drawPie2()
    },
    // 获取车位卡信息
    getSpaceList() {
      const params = {
        garageId: this.garageId,
        garageFloorId: this.garageFloorId ? this.garageFloorId : null,
        garageRegionId: this.garageRegionId ? this.garageRegionId : null,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      if (this.pageNo === 1) {
        this.carInfoData = []
      }
      const that = this
      serve.getSpaceList(params).then(res => {
        if (res.data.code === 200) {
          // 给设置编号传数据
          this.setCodeObj = {
            parkingName: res.data.data.rows[0].parkingName,
            parkingCode: res.data.data.rows[0].parkingCode,
            garageName: res.data.data.rows[0].garageName,
            numbering: res.data.data.rows[0].numbering,
            garageFloorId: res.data.data.rows[0].garageFloorId,
            garageId: res.data.data.rows[0].garageId,
            garageRegionId: res.data.data.rows[0].garageRegionId
          }
          that.totalPage = res.data.data.totalPage
          var datalist = res.data.data.rows.map(item => {
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
          that.carInfoData = that.carInfoData.concat(datalist)
          that.dialogInfo.show = true
        }
      })
    },
    // 选择一个车位
    chooseChange(item) {
      if (item.garageDetailId === this.activeGarageDetailId) {
        this.activeGarageDetailId = null
        this.parkingInfo = {}
      } else {
        this.activeGarageDetailId = item.garageDetailId
        this.parkingInfo = item
      }
    },
    // 点击楼层/分区/多层
    areaChange(index, item) {
      // 防止多次点击
      // if (Date.now() - this.onpresscTime > 2000) {
      //   this.onpresscTime = Date.now()
      // 全部车位
      this.carInfoData = []
      if (
        index !== 0 &&
          this.areaArr[index].secondName &&
          this.areaArr[index].secondName.length
      ) {
        this.garageFloorId = item.garageFloorId
        this.showContent = false
        this.garageRegionId = ''
        this.secondFlag = true
        this.pageNo = 1
        this.totalPage = 0
        this.setCodeFlag = false
        this.getSpaceList()
      } else if (index !== 0) {
        // 多层不分区停车
        if (item.garageFloorId) {
          this.garageFloorId = item.garageFloorId
          this.garageId = item.garageId
          this.garageRegionId = ''
          this.setCodeFlag = true
        } else {
          // 平面多车位 && 立体机械停车
          this.garageRegionId = item.garageRegionId
          this.garageFloorId = ''
        }
        this.setCodeFlag = true
        this.showContent = false
        this.pageNo = 1
        this.totalPage = 0
        this.getSpaceList()
      }
      // 全部车位显示图表
      if (index === 0) {
        this.showContent = true
        this.areaArr = []
        this.getSingleSpace()
        this.secondFlag = false
      }
      this.activeArea = index
      this.activeSecondArea = ''
    },
    // 多层多车位
    areaSecondChange(index, item) {
      // if (Date.now() - this.onpresscTime2 > 2000) {
      //   this.onpresscTime2 = Date.now()
      // }
      this.garageRegionId = item.garageRegionId
      this.activeSecondArea = index
      this.showContent = false
      this.pageNo = 1
      this.totalPage = 0
      this.carInfoData = []
      this.setCodeFlag = true
      this.getSpaceList()
    },
    // 左边饼图
    drawPie() {
      const myChart = Echarts.init(document.getElementById('myChart'))
      myChart.setOption({
        title: {
          text: '停车位类型占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['#46A1FF', '#4DCCCB', '#58CC74'],
        legend: {
          bottom: 0,
          left: 'center',
          data: ['未开启', '空车位', '已用车位']
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: this.pieData
          }
        ]
      })
    },
    // 右边饼图
    drawPie2() {
      const myChart = Echarts.init(document.getElementById('myChart2'))
      myChart.setOption({
        title: {
          text: '已用车位占比分布',
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
          data: ['包天卡', '私人车位', '临停']
        },
        series: [
          {
            name: '类型占比',
            type: 'pie',
            center: ['50%', '50%'],
            selectedMode: 'single',
            data: this.pie2Data
          }
        ]
      })
    },
    // 修改状态
    statusChange(item) {
      const params = {
        garageDetailId: item.garageDetailId,
        status: item.updateSta ? 1 : 0
      }
      this.loading = true
      serve.pointSpace(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.$message.success('修改成功！')
          this.parkingInfo = {}
          this.activeGarageDetailId = null
          // 获取接口
          this.pageNo = 1
          this.totalPage = 0
          this.carInfoData = []
          this.getSpaceList()
        } else {
          this.loading = false
          this.$message.error(res.data.msg)
        }
      })
    },
    setCode() {
      if (JSON.stringify(this.parkingInfo) === '{}') {
        this.$message.warning('请选择一个车位！')
      } else {
        this.setCodeDialog.show = true
      }
    },
    codeRegular() {
      if (this.setCodeFlag) {
        this.codeRegularDialod.show = true
      }
    },
    // 设置编号
    pointSpace(params) {
      this.loading = true
      serve.pointSpace(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.$message.success('设置成功！')
          this.pageNo = 1
          this.getSpaceList()
          this.parkingInfo = {}
          this.activeGarageDetailId = null
        } else {
          this.loading = false
          this.$message.error(res.data.msg)
        }
      })
    },
    // 设置编号
    setRegular(params) {
      this.$confirm('确认设置此区域的编号吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        serve.setRegularRuls(params).then(res => {
          if (res.data.code === 200) {
            this.loading = false
            this.$message.success('设置成功！')
            this.pageNo = 1
            this.getSpaceList()
            this.setCodeObj = {}
          } else {
            this.loading = false
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    // 取消选中
    cancel() {
      this.parkingInfo = {}
      this.activeGarageDetailId = null
    },
    pointCarPos() {
      if (JSON.stringify(this.parkingInfo) === '{}') {
        this.$message.warning('请选择一个车位！')
      } else {
        this.dialogFormVisible.show = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.manage-park {
  height: 100%;
  width: 100%;
  .top-nav {
    height: 70px;
    background: #f2f2f2;
    line-height: 70px;
    font-size: 20px;
    padding-left: 20px;
  }
  .content-box {
    display: flex;
    justify-content: flex-start;
    height: calc(100% - 50px);
    .left-condition {
      display: flex;
      background: #f0f2f2;
      height: 100%;
      padding-right: 10px;
      .box-area {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 20px;
        position: relative;
        .box {
          height: 50px;
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
      .right-box {
        display: flex;
        flex-direction: column;
        margin-top: 50px;
        .right-small {
          padding: 5px 20px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          background: #ebebeb;
          margin: 2px;
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
    .right-content {
      margin: 20px;
      margin-left: 20px;
      width: 80%;
      border: 1px solid #ccc;
      padding: 20px;
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
        margin: 0 50px;
        margin-top: 80px;
        display: flex;
        justify-content: space-between;
        .left-graph {
          width: 45%;
          height: 450px;
        }
      }
    }
    .right-component {
      margin: 20px;
      margin-left: 20px;
      width: 80%;
      border: 1px solid #ccc;
      padding: 20px;
      overflow-y: auto;
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
    }
  }
}
</style>
