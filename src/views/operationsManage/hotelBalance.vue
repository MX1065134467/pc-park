<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
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
          @selection-change="handleSelectionChange"
          style="width: 100%"
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
              <el-button type="text" size="small" @click="detail(scope.row, '详情')">结算明细</el-button>
              <el-button type="text" size="small" @click="balancingAccounts(scope.row)" :disabled="isDisabled">平账</el-button>
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
    <balancingAccounts v-if="dialogData.isShow" :dialogData.sync="dialogData" :itemObj="itemObj" @confirmDialog="confirmDialog"></balancingAccounts>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import balancingAccounts from './dialog/balancingAccounts'
import serve from '@/api/operationManage.api'
import handleExport from '@/utils/export'
export default {
  name: 'hotelReconciliation',
  components: { SearchFilter, balancingAccounts },
  data () {
    const { isAdmin, userType } = JSON.parse(sessionStorage.getItem('userInfo'))
    return {
      isDisabled: isAdmin === 1 && userType === 1,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogData: {
        isShow: false,
        title: '平账操作'
      },
      itemObj: {},
      filterForm: [
        {
          type: 'select',
          label: '酒店名称',
          placeholder: '请选择酒店',
          key: 'hotelId',
          options: [],
          value: null,
          disabled: false,
          filterable: true
        },
        {
          type: 'select',
          label: '结算类型',
          key: 'type',
          options: [
            {
              value: null,
              label: '全部'
            },
            {
              value: '1',
              label: '单笔结算'
            },
            {
              value: '2',
              label: '批量结算'
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
          label: '结算类型',
          prop: 'settleTypeStr',
          show: true
        },
        {
          label: '结算范围',
          prop: 'settleRange',
          show: true
        },
        {
          label: '结算订单数',
          prop: 'orderCount',
          show: true
        },
        {
          label: '订单总金额（￥）',
          prop: 'orderAmount',
          show: true
        },
        {
          label: '收款账户',
          prop: 'collectAccount',
          show: true
        },
        {
          label: '结算时间',
          prop: 'settleTime',
          show: true
        },
        {
          label: '对账状态',
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
    this.getHotelList()
  },
  methods: {
    // 获取列表
    async getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        hotelId: this.hotelId,
        type: this.type
      }
      this.loading = true
      const { data: res } = await serve.getHotelSettlementRecords(params)
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.rows
        this.total = res.data.totalCount
      } else {
        this.loading = false
      }
    },
    // 平账确定
    confirmDialog() {
      this.dialogData.isShow = false
      this.getList()
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
    handleSearch(obj) {
      this.hotelId = obj.hotelId
      this.type = obj.type
      this.currentPage = 1
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
          type: this.type
        }
      }
      handleExport(params, '/hotelBalance/export/settle/list', 'get', '酒店结算记录')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 结算明细 酒店客户订单
    detail(row) {
      this.$router.push({ path: '/operationsManage/hotel-reconciliation/orderList', query: { hotelId: row.hotelId } })
    },
    // 平账
    async balancingAccounts(row) {
      this.itemObj = row
      this.dialogData.isShow = true
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
</style>
