<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <div class="tabsBox">
        <el-tabs  v-model="status" @tab-click="handleClick">
        <el-tab-pane label="待平账订单" name="2"></el-tab-pane>
        <el-tab-pane label="已平账订单" name="3"></el-tab-pane>
      </el-tabs>
      </div>
      <search-filter :filter-form="filterForm" @searchData="handleSearch" @connect="connect">
        <div class="handle-btn" slot="operate">
          <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
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
          <el-table-column type="selection" width="55"></el-table-column>
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
     <orderDetail v-if="dialogData.isShow" :dialogData.sync="dialogData" :itemObj="itemObj"></orderDetail>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import orderDetail from './dialog/orderDetail'
import serve from '@/api/operationManage.api'
import handleExport from '@/utils/export'
export default {
  name: 'hotelReconciliation',
  components: { SearchFilter, orderDetail },
  data () {
    const { isAdmin, userType } = JSON.parse(sessionStorage.getItem('userInfo'))
    return {
      isDisabled: isAdmin === 1 && userType === 1,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      itemObj: {},
      status: '2', // 对帐状态
      dialogData: {
        isShow: false,
        title: '订单详情'
      },
      filterForm: [
        {
          type: 'input',
          label: '客户姓名',
          placeholder: '请输入客户姓名',
          key: 'name'
        },
        {
          type: 'time',
          label: '订单时间',
          key: 'time'
        },
        {
          type: 'input',
          label: '订单号',
          placeholder: '请输入订单号',
          key: 'orderCode'
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
          label: '酒店名称',
          prop: 'hotelName',
          show: true
        },
        {
          label: '客户姓名',
          prop: 'userName',
          show: true
        },
        {
          label: '预约车牌号',
          prop: 'carNo',
          show: true
        },
        {
          label: '有效期',
          prop: 'timeDate',
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
          label: '停车时长',
          prop: 'parkHour',
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
          label: '订单时间',
          prop: 'createTime',
          show: true
        },
        {
          label: '结算状态',
          prop: 'statusStr',
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
      searchData: {
        endTime: '',
        startTime: '',
        orderCode: '',
        name: ''
      }
    }
  },
  created () {
    this.hotelId = this.$route.query.hotelId || 1
    this.getList()
  },
  methods: {
    handleClick(e) {
      this.getList()
    },
    // 获取列表
    async getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        hotelId: this.hotelId,
        status: this.status,
        ...this.searchData
      }
      this.loading = true
      const { data: res } = await serve.hotelUserOrder(params)
      if (res.code === 200) {
        this.loading = false
        res.data.rows.forEach(item => {
          item.timeDate = item.beginTime + ' 至 ' + item.endTime
        })
        this.tableData = res.data.rows
        this.total = res.data.totalCount
      } else {
        this.loading = false
      }
    },
    async exportData() {
      let params = {}
      if (this.multipleSelection.length !== 0) {
        const ids = []
        this.multipleSelection.forEach(item => {
          ids.push(item.orderId)
        })
        params.orderIds = ids.join(',')
        params.hotelId = this.hotelId
      } else {
        params = {
          hotelId: this.hotelId,
          status: this.status,
          ...this.searchData
        }
      }
      handleExport(params, '/hotelReconciliation/export/order/list', 'get', '酒店客户订单')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    handleSearch(obj) {
      Object.keys(this.searchData).forEach(key => {
        this.searchData[key] = obj[key]
      })
      if (obj.time) {
        this.searchData.startTime = obj.time[0].slice(0, 10)
        this.searchData.endTime = obj.time[1].slice(0, 10)
      }
      console.log(this.searchData)
      this.getList()
    },
    // 详情
    async detail(row) {
      this.dialogData.isShow = true
      const params = {
        orderId: row.orderId
      }
      const { data: res } = await serve.hotelOrderDetail(params)
      if (res.code === 200) {
        this.itemObj = res.data
      } else {
        this.loading = false
      }
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
.tabsBox{
  padding:20px 20px 0 20px;
}
</style>
