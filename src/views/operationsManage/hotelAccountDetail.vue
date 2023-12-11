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
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center"></el-table-column>
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
    <add-black-list v-if="blackData.isShow" @close="handleAddBlack" :blackData="blackData"></add-black-list>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import addBlackList from './dialog/addBlackList'
import serve from '@/api/operationManage.api'
export default {
  name: 'hotelReconciliation',
  components: { SearchFilter, addBlackList },
  data () {
    const { isAdmin, userType } = JSON.parse(sessionStorage.getItem('userInfo'))
    return {
      isDisabled: isAdmin === 1 && userType === 1,
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: [
        {
          type: 'input',
          label: '客户姓名',
          placeholder: '请输入客户姓名',
          key: 'hotelName'
        },
        {
          type: 'time',
          label: '订单时间',
          key: 'type'
        },
        {
          type: 'input',
          label: '订单号',
          placeholder: '请输入订单号',
          key: 'hotelName'
        }
      ],
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '订单号',
          prop: 'index',
          show: true
        },
        {
          label: '酒店名称',
          prop: 'hotelName',
          show: true
        },
        {
          label: '客户姓名',
          prop: 'settleType',
          show: true
        },
        {
          label: '预约车牌号',
          prop: 'settleRange',
          show: true
        },
        {
          label: '有效期',
          prop: 'orderCount',
          show: true
        },
        {
          label: '进场时间',
          prop: 'orderAmount',
          show: true
        },
        {
          label: '出场时间',
          prop: 'collectAccount',
          show: true
        },
        {
          label: '订单金额（￥）',
          prop: 'settleTime',
          show: true
        },
        {
          label: '实付金额（￥）',
          prop: 'status',
          show: true
        },
        {
          label: '订单时间',
          prop: 'status',
          show: true
        },
        {
          label: '结算状态',
          prop: 'status',
          show: true
        }
      ],
      tableData: [],
      blackData: {
        isShow: false,
        title: '',
        content: {
        }
      }
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
        hotelName: this.hotelName,
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
      this.hotelName = obj.hotelName
      this.type = obj.type
      this.currentPage = 1
      this.getList()
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/operationsManage/hotel-reconciliation/detail', query: { orderId: row.orderId } })
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
