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
      <search-filter :filter-form="filterForm" @searchData="handleSearch">
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
          <el-table-column fixed="right" label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="check(scope.row, '查看')">详情</el-button>
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
import { getUserInfo } from '@/common/cache.js'
export default {
  name: 'paymentRecord',
  components: { SearchFilter },
  data () {
    return {
      parkingCount: {},
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: [
        {
          type: 'input',
          label: '流水号',
          placeholder: '请输入流水号',
          key: 'serialNum'
        },
        {
          type: 'input',
          label: '订单号',
          placeholder: '请输入订单号',
          key: 'orderNum'
        },
        {
          type: 'time',
          label: '支付时间',
          key: 'payTime',
          value: []
        }
      ],
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '支付流水号',
          prop: 'payNo',
          show: true
        },
        {
          label: '订单号',
          prop: 'orderNo',
          show: true
        },
        {
          label: '缴费渠道',
          prop: 'showPayChannel',
          show: true
        },
        {
          label: '支付类型',
          prop: 'showParkType',
          show: true
        },
        {
          label: '订单金额（￥）',
          prop: 'orderAmount',
          show: true
        },
        {
          label: '计费金额（￥）',
          prop: 'billingAmount',
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
          label: '支付时间',
          prop: 'payTime',
          show: true
        }
      ],
      tableData: [],
      orderNo: null,
      payNo: null,
      startPayTime: null,
      endPayTime: null
    }
  },
  created() {
    this.getList()
    this.payCount()
  },
  methods: {
    payCount () {
      const params = {
        userId: getUserInfo().userId,
        orderNo: this.orderNo,
        payNo: this.payNo,
        startPayTime: this.startPayTime,
        endPayTime: this.endPayTime
      }
      serve.statPayParkRecords(params).then(res => {
        if (res.data.code === 200) {
          this.parkingCount = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    async getList() {
      const params = {
        userId: getUserInfo().userId,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderNo: this.orderNo,
        payNo: this.payNo,
        startPayTime: this.startPayTime,
        endPayTime: this.endPayTime
      }
      this.loading = true
      const { data: res } = await serve.chargeList(params)
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.rows
        this.total = res.data.totalCount
      } else {
        this.loading = false
      }
    },
    handleSearch(obj) {
      this.orderNo = null || obj.orderNum
      this.payNo = obj.serialNum || null
      this.startPayTime = obj.payTime !== null ? obj.payTime[0] : null
      this.endPayTime = obj.payTime !== null ? obj.payTime[1] : null

      this.getList()
      this.payCount()
    },
    // exportData() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    check(row) {
      this.$router.push({
        path: '/operationsManage/payment-record/detail',
        query: { orderId: JSON.stringify(row.orderId) }
      })
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
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
</style>
