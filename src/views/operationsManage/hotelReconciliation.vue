<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <ul class="data-panel">
        <li class="data-panel-item">
          <div class="item-sum">
            <p>待结算金额</p>
            <p>{{topData.billingAmount || 0.00}}</p>
          </div>
        </li>
        <li class="data-panel-item">
          <div class="item-sum">
            <p>待结算停车订单</p>
            <p>{{topData.orderCount}}</p>
          </div>
        </li>
        <li class="data-panel-item">
          <div class="item-sum">
            <p>未结清酒店</p>
            <p>{{topData.garageCount}}</p>
          </div>
        </li>
      </ul>
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
              <el-button type="text" size="small" @click="detail(scope.row, '详情')">酒店客户订单</el-button>
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
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import serve from '@/api/operationManage.api'
import handleExport from '@/utils/export'
export default {
  name: 'hotelReconciliation',
  components: { SearchFilter },
  data () {
    const { isAdmin, userType } = JSON.parse(sessionStorage.getItem('userInfo'))
    return {
      isDisabled: isAdmin === 1 && userType === 1,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      itemObj: {},
      topData: {},
      filterForm: [
        {
          type: 'select',
          label: '酒店名称',
          placeholder: '请选择酒店',
          key: 'hotelId',
          options: [],
          value: null,
          filterable: true
        },
        {
          type: 'select',
          label: '对账状态',
          placeholder: '对账状态',
          key: 'status',
          options: [
            {
              value: null,
              label: '全部'
            },
            {
              value: '0',
              label: '未结清'
            },
            {
              value: '2',
              label: '已平账'
            }
          ],
          value: null
        }
      ],
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '酒店名称',
          prop: 'hotelName',
          show: true
        },
        {
          label: '客户订单',
          prop: 'orderCount',
          show: true
        },
        {
          label: '订单总金额（￥）',
          prop: 'orderAmount',
          show: true
        },
        {
          label: '已结订单',
          prop: 'settledOrderCount',
          show: true
        },
        {
          label: '待结订单',
          prop: 'unSettledOrderCount',
          show: true
        },
        {
          label: '待结金额（￥）',
          prop: 'unSettledOrderAmount',
          show: true
        },
        {
          label: '对账状态',
          prop: 'statusStr',
          show: true
        }
      ],
      tableData: []
    }
  },
  created () {
    this.getList()
    this.getHotelList()
    this.getTopData()
  },
  methods: {
    // 获取列表
    async getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        hotelId: this.hotelId,
        status: this.status
      }
      this.loading = true
      const { data: res } = await serve.hotelReconciliationList(params)
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
    // 获取酒店列表列表
    async getHotelList() {
      const { data: response } = await serve.getHotelList()
      if (response.code === 200) {
        response.data.map(item => {
          this.filterForm[0].options.push({ value: item.hotel_id, label: item.hotel_name })
        })
      }
    },
    // 获取顶部数据
    async getTopData() {
      const { data: response } = await serve.getTopData()
      if (response.code === 200) {
        this.topData = response.data
      }
    },
    handleSearch(obj) {
      this.hotelId = obj.hotelId
      this.status = obj.status
      this.currentPage = 1
      this.multipleSelection = []
      this.getList()
    },
    async exportData() {
      let params = {}
      if (this.multipleSelection.length !== 0) {
        const ids = []
        this.multipleSelection.forEach(item => {
          ids.push(item.hotelId)
        })
        params.hotelIds = ids.join(',')
      } else {
        params = {
          hotelId: this.hotelId,
          status: this.status
        }
      }
      handleExport(params, '/hotelReconciliation/export/reconciliation/list', 'get', '酒店对账')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 酒店客户订单
    detail(row) {
      this.$router.push({ path: '/operationsManage/hotel-reconciliation/orderList', query: { hotelId: row.hotelId } })
    },
    // 分页
    handleSizeChange(size) {
      this.pageSize = size
      this.multipleSelection = []
      this.getList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.multipleSelection = []
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
 .data-panel {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 10px;
      padding:30px 50px;
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
</style>
