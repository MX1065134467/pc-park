<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
    <div class="parkCount">
      <div class="parkCountChild">订单量：<span>{{parkingCount.orderCount ? parkingCount.orderCount : 0}}</span> 单</div>
      <div class="parkCountChild">用户数：<span>{{parkingCount.userCount ? parkingCount.userCount : 0}}</span> 位</div>
      <div class="parkCountChild">订单金额（￥）：<span>{{parkingCount.orderAmount ? parkingCount.orderAmount : 0}}</span></div>
      <div class="parkCountChild">实收金额（￥）：<span>{{parkingCount.actualAmount ? parkingCount.actualAmount : 0}}</span></div>
    </div>
      <search-filter :filter-form="filterForm" @searchData="handleSearch" @connect="connect">
        <div class="handle-btn" slot="operate">
          <!-- <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
        </div>
      </search-filter>
      <div class="table-wrap">
        <el-table
          stripe
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <template v-for="(item, index) in tableHeaderData">
            <el-table-column
              align="center"
              v-if="item.show"
              resizable
              show-overflow-tooltip
              :width="item.width"
              :key="index"
              :label="item.label"
              :prop="item.prop"
            ></el-table-column>
          </template>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detail(scope.row, '详情')">详情</el-button>
              <el-button type="text" :class="[scope.row.blackId !== null ? 'black_btn' : 'default_btn']"  size="small" :disabled="(scope.row.blackId !== null) || isDisabled" @click="block(scope.row)">拉黑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30,40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <add-black-list v-if="blackData.isShow" @close="handleAddBlack" :blackData="blackData"></add-black-list>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import addBlackList from './dialog/addBlackList'
import serve from '@/api/operationManage.api'
import { getUserInfo } from '@/common/cache.js'
export default {
  name: 'parkingRecord',
  components: { SearchFilter, addBlackList },
  data () {
    const { isAdmin, userType } = JSON.parse(sessionStorage.getItem('userInfo'))
    return {
      parkingCount: {},
      isDisabled: isAdmin === 1 && userType === 1,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: [
        {
          type: 'select',
          label: '停车场管理公司',
          placeholder: '停车场管理公司',
          key: 'park',
          options: [],
          value: null,
          disabled: false
        },
        {
          type: 'select',
          label: '停车场',
          placeholder: '停车场',
          key: 'garage',
          options: [],
          value: null
        },
        {
          type: 'input',
          label: '车牌号',
          placeholder: '',
          key: 'carNum'
        },
        {
          type: 'select',
          label: '用户类型',
          placeholder: '用户类型',
          key: 'userType',
          options: [
            {
              value: null,
              label: '全部'
            },
            {
              value: '1',
              label: '车位卡'
            },
            {
              value: '2',
              label: '临停'
            },
            {
              value: '3',
              label: 'VIP'
            }
          ],
          value: null
        },
        {
          type: 'time',
          label: '订单时间',
          key: 'time',
          value: []
        }
      ],
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '订单号',
          prop: 'orderNo',
          show: true
        },
        {
          label: '停车场管理公司',
          prop: 'parkingName',
          show: true
        },
        {
          label: '停车场名称',
          prop: 'garageName',
          show: true
        },
        {
          label: '车牌号',
          prop: 'carNo',
          show: true
        },
        {
          label: '进场时间',
          prop: 'inTime',
          show: true
        },
        {
          label: '出场时间',
          prop: 'outTime',
          show: true
        },
        {
          label: '停车时间',
          prop: 'parkHour',
          show: true
        },
        {
          label: '用户类型',
          prop: 'showParkType',
          show: true
        },
        {
          label: '订单金额（￥）',
          prop: 'orderAmount',
          show: true
        },
        {
          label: '实付金额（￥）',
          prop: 'confirmAmount',
          show: true
        },
        {
          label: '付费方式',
          prop: 'showPayWay',
          show: true
        },
        {
          label: '订单时间',
          prop: 'createTime',
          show: true
        }
      ],
      tableData: [],
      blackData: {
        isShow: false,
        title: '',
        content: {
        }
      },
      childrenParking: [],
      garage: [],
      // 搜索条件
      parkingId: null,
      garageId: null,
      carNo: null,
      userType: null,
      startTime: null,
      endTime: null
    }
  },
  created () {
    this.getList()
    this.getParkingList()
    this.parkCpunt()
  },
  methods: {
    // 统计
    parkCpunt () {
      const params = {
        userId: getUserInfo().userId,
        parkingId: this.parkingId,
        garageId: this.garageId,
        carNo: this.carNo,
        parkType: this.parkType,
        startTime: this.startTime,
        endTime: this.endTime
      }
      serve.statOrderParkRecords(params).then(res => {
        if (res.data.code === 200) {
          this.parkingCount = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 获取列表
    async getList() {
      const params = {
        userId: getUserInfo().userId,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        parkingId: this.parkingId,
        garageId: this.garageId,
        carNo: this.carNo,
        parkType: this.parkType,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.loading = true
      const { data: res } = await serve.getOrderParkRecords(params)
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.rows
        this.total = res.data.totalCount
      } else {
        this.loading = false
      }
    },
    connect(val) {
      this.filterForm[1].options = []
      const arr = this.garage.filter(v => v.parkingId === val)
      arr.map(item => {
        const obj = {
          value: item.garageId,
          label: item.garageName
        }
        this.filterForm[1].options.push(obj)
        this.filterForm[1].value = null
      })
    },
    // 获取停车场列表
    async getParkingList() {
      const userId = getUserInfo().userId
      const { data: response } = await serve.getParkList({ userId })
      if (response.code === 200) {
        response.data.map(item => {
          this.garage = [...this.garage, ...item.garageIdAndName]
          this.filterForm[0].options.push({ value: item.parkingId, label: item.parkingName })
        })
        // 平台账户只有一个停车场  直接显示并禁用
        if (this.filterForm[0].options.length <= 1) {
          this.filterForm[0].value = this.filterForm[0].options[0].value
          this.filterForm[0].disabled = true
          this.connect(this.filterForm[0].value)
        }
      }
    },
    handleSearch(obj) {
      this.parkingId = obj.park || getUserInfo().parkingId
      this.garageId = obj.garage
      this.carNo = obj.carNum
      this.parkType = obj.userType
      this.startTime = obj.time !== null ? obj.time[0] : null
      this.endTime = obj.time !== null ? obj.time[1] : null
      this.getList()
      this.parkCpunt()
    },
    // exportData() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    detail(row) {
      this.$router.push({ path: '/operationsManage/parking-record/detail', query: { orderId: row.orderId } })
    },
    // 拉黑
    async block(row) {
      this.blackData.content = {}
      const params = {
        orderId: row.orderId
      }
      const { data: res } = await serve.selectById(params)
      if (res.code === 200) {
        this.blackData.content = res.data
        // const entryImg = []
        // entryImg.push(this.IMAGEURL + this.blackData.content.carInOut.inImageUrl)
        // entryImg.push(this.blackData.content.carInOut.inImageUrl)
        // this.blackData.content.inImageUrl_list = entryImg
        this.blackData.content.inImageUrl_list = this.blackData.content.carInOut.inImages ? this.blackData.content.carInOut.inImages : null
        this.blackData.content.allImg = this.blackData.content.carInOut.snapshotList && this.blackData.content.carInOut.snapshotList.map(v => v)
        // this.blackData.content.allImg = this.blackData.content.carInOut.snapshotList.map(v => this.IMAGEURL + v)
      }
      this.blackData.title = '拉黑'
      this.blackData.parkingId = getUserInfo().parkingId
      this.blackData.userName = getUserInfo().userName
      this.blackData.orderId = row.orderId
      this.blackData.isShow = true
      this.blackData.status = 1
    },
    // 分页
    handleSizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getList()
    },
    handleAddBlack() {
      this.blackData.isShow = false
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.parkCount {
  background-color: #eee;
  margin: 20px;
  height: 100px;
  display: flex;
  justify-content: space-around;
  .parkCountChild {
    margin: auto;
    font-size: 20px;
    font-weight: 500;
    span {
      color: #E5392B;
      font-size: 24px;
    }
  }
}
::v-deep.search-filter {
  .el-form {
    .el-form-item:nth-child(4), .el-form-item:nth-child(3) {
      .el-form-item__content {
        .el-input__inner {
          width: 120px;
        }
      }
    }
  }
}
.black_btn {
  color: #909399;
}
.default_btn {
  color:#F56C6C;
}
</style>
