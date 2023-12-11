<template>
  <div class='user-manage'>
    <div class="ticket-add-title">
      <div>用户中心</div>
      <el-button size="small" type="primary" icon="el-icon-arrow-left" @click="$router.push('/userManage/index')">返回</el-button>
    </div>
    <div class="money-tab">
      <div class="title_header">
        <div class="item_label" v-for="(item, index) in labelArray" v-bind:key="index" :class="{'active-item': item.active}" @click="handleItemChange(index)">
          <span>
            {{item.value}}
          </span>
        </div>
      </div>
      <div class="tab_content" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
        <!-- 搜索条件 -->
        <div v-if="isTimeSearchShow">
          <search-filter :filter-form="filterForm" @searchData="handleSearch">
          </search-filter>
        </div>
        <div v-if="isTimeSearchShow">
          <tab-content v-bind:tab-content="tabContent" @handlePageSizeChange="handlePageSizeChange"></tab-content>
        </div>
        <div v-if="isUserDetailShow">
          <tab-detail></tab-detail>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import TabContent from './component/TabContent'
import TabDetail from './component/TabDetail'
import serve from '@/api/operationManage.api'
import server from '@/api/userManage.api.js'
// import serverP from '@/api/parkingCardSell.api.js'
import moment from 'moment'
import { getUserInfo } from '@/common/cache.js'
export default {
  name: '',
  components: {
    SearchFilter,
    TabContent,
    TabDetail
  },
  props: {},
  data () {
    return {
      loading: false,
      labelArray: [
        {
          value: '用户详情',
          active: true
        },
        {
          value: '停车记录',
          active: false,
          timeLabel: '订单时间',
          tableHeaderData: [
            {
              label: '停车场名称',
              prop: 'garageName'
            },
            {
              label: '车牌号',
              prop: 'carNo'
            }, {
              label: '订单号',
              prop: 'orderNo',
              width: 200
            }, {
              label: '进场时间',
              prop: 'inTime',
              width: 160
            }, {
              label: '出场时间',
              prop: 'outTime',
              width: 160
            },
            {
              label: '停车时间',
              prop: 'parkHour',
              width: 100
            },
            {
              label: '用户类型',
              prop: 'showParkType'
            },
            {
              label: '订单金额(￥)',
              prop: 'orderAmount'
            },
            {
              label: '实付金额(￥)',
              prop: 'confirmAmount'
            },
            {
              label: '付费方式',
              prop: 'showPayWay'
            },
            {
              label: '订单时间',
              prop: 'createTime',
              width: 160
            }
          ]
        },
        {
          value: '积分记录',
          active: false,
          timeLabel: '积分时间',
          tableHeaderData: [
            {
              label: '停车场名称',
              prop: 'garageName'
            },
            {
              label: '车牌号',
              prop: 'carNo'
            }, {
              label: '订单号',
              prop: 'orderNo',
              width: 260
            }, {
              label: '积分时间',
              prop: 'scoreTime'
            }, {
              label: '积分类型',
              prop: 'scoreTypeStr'
            },
            {
              label: '实付金额(￥)',
              prop: 'confirmAmount'
            },
            {
              label: '积分数量',
              prop: 'scoreValue'
            }
          ]
        },
        {
          value: '违规记录',
          active: false,
          timeLabel: '处理时间',
          tableHeaderData: [
            {
              label: '停车场名称',
              prop: 'garageName'
            },
            {
              label: '车牌号',
              prop: 'carNo'
            }, {
              label: '订单号',
              prop: 'orderNo',
              width: 300
            }, {
              label: '违规原因',
              prop: 'blackReason'
            }, {
              label: '处理人',
              prop: 'createBy'
            },
            {
              label: '处理意见',
              prop: 'dealOpinion'
            },
            {
              label: '处理时间',
              prop: 'createTime',
              width: 200
            },
            {
              label: '执行时间',
              prop: 'validateTime',
              width: 300
            }
          ]
        }
      ],
      // 搜索
      filterForm: [
        {
          type: 'time',
          label: '订单时间',
          key: 'time',
          value: ''
        }, {
          type: 'select',
          label: '停车场',
          key: 'garage',
          options: [{
            value: '',
            label: '全部'
          }],
          value: ''
        }
      ],
      garage: [], // 车库数据
      isTimeSearchShow: false,
      isUserDetailShow: true,
      tabContent: {
        tableHeaderData: [],
        value: '',
        tableData: {}
      },
      params: {},
      searchParams: {},
      currentIndex: 0,
      tableParams: {
        pageNo: 1,
        pageSize: 10
      }
    }
  },
  created () {
    this.getParkingList()
    if (this.$route.query.active) {
      this.handleItemChange(Number(this.$route.query.active))
    }
  },
  mounted () {},
  methods: {
    // // 获取停车场的数据
    // getParking() {
    //   serverP.getParkList({
    //     userId: getUserInfo().userId
    //   }).then(res => {
    //     if (res.data.code === 200) {
    //       res.data.data.map(content => {
    //         this.filterForm[1].options.push({
    //           value: content.parkingId,
    //           label: content.parkingName
    //         })
    //       })
    //     }
    //   })
    // },
    // 获取停车场列表
    async getParkingList() {
      const userId = getUserInfo().userId
      const { data: response } = await serve.getParkList({ userId })
      if (response.code === 200) {
        response.data.map(item => {
          this.garage = [...this.garage, ...item.garageIdAndName]
        })
        this.filterForm[1].options = []
        this.garage.map(item => {
          const obj = {
            value: item.garageId,
            label: item.garageName
          }
          this.filterForm[1].options.push(obj)
          this.filterForm[1].value = null
        })
      }
    },
    // 页签切换
    handleItemChange(index) {
      const that = this
      that.currentIndex = index
      that.isUserDetailShow = index === 0
      that.isTimeSearchShow = false
      that.filterForm[0].value = ''
      that.searchParams = {}
      this.handleTableData()
    },
    async handleTableData() {
      const that = this
      that.tabContent = {
        tableHeaderData: [],
        value: '',
        tableData: {}
      }
      // that.isTimeSearchShow = false
      const response = await that.getTableData(that.currentIndex)
      this.loading = false
      if (response.code === 200) {
        if (that.currentIndex === 3) {
          response.data.rows.map(res => {
            res.validateTime = res.beginTime + '至' + res.endTime
          })
        }
        that.tabContent.tableData = { ...response.data, ...that.tableParams, active: that.currentIndex }
      }
      that.labelArray.forEach(res => {
        res.active = false
      })
      that.labelArray[that.currentIndex].active = true
      that.isTimeSearchShow = that.labelArray[that.currentIndex].timeLabel
      that.filterForm[0].label = that.labelArray[that.currentIndex].timeLabel
      that.tabContent = {
        ...that.tabContent,
        ...that.labelArray[that.currentIndex]
      }
    },
    // 调取表格接口 获取数据
    getTableData(index) {
      this.loading = true
      this.params = {
        carId: this.$route.query.carId,
        carNo: this.$route.query.carNo,
        ...this.tableParams,
        ...this.searchParams
      }
      return new Promise((resolve, reject) => {
        if (index === 1) {
          server.getUserCenterTimeDetail(this.params).then(res => {
            resolve(res.data)
          })
        } else if (index === 2) {
          server.getUserCenterScopeDetail(this.params).then(res => {
            resolve(res.data)
          })
        } else {
          server.getUserCenterBlackDetail(this.params).then(res => {
            console.log(res.data, 999)
            res.data.data.rows.map(item => {
              if (item.reviewCount !== null) {
                item.dealOpinion = '拉黑' + item.reviewCount + '天'
              } else {
                item.dealOpinion = '拉黑' + item.dayCount + '天'
              }
            })
            resolve(res.data)
          })
        }
      })
    },
    // 搜索传过来的值
    handleSearch(params) {
      if (params.time) {
        this.searchParams.startTime = moment(params.time[0]).valueOf()
        this.searchParams.endTime = moment(params.time[1]).valueOf()
        delete params.time
      } else {
        this.searchParams = {}
      }
      this.searchParams = {
        ...this.searchParams,
        ...params
      }
      this.handleTableData()
    },
    // 表格页数改变的时候
    handlePageSizeChange (event) {
      this.tableParams = {
        ...this.tableParams,
        ...event
      }
      this.handleTableData()
    }
  }
}
</script>

<style lang='scss' scoped>
.user-manage {
  height: 100%;
  .money-tab{
    background: #fff;
    border-radius: 4px;
    padding: 60px 0px 20px 0px;
    .title_header {
      display: flex;
      align-items: center;
      margin: 10px 20px;
      background: #fff;
      border-bottom: 1px solid #E8E8E8;
      font-size: 16px;
      .item_label {
        width: 100px;
        text-align: center;
        margin-right: 8px;
        background: #fff;
        height: 40px;
        line-height: 40px;
        background: #E7F2FD;
        border: 1px solid #B4D5FB;
        color:rgba($color: #000, $alpha: 0.65);
        cursor: pointer;
        border-bottom: none;
      }
      .item_label.active-item{
        background: #2D97FA;
        color: #fff;
      }
    }
  }
  .tab_content {
    min-height: 300px;
  }
}
</style>
