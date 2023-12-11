<template>
  <div class='subaccount'>
    <search-filter :filter-form="filterForm" @searchData="handleSearch">
      <div class="handle-btn" slot="operate">
        <!-- <el-button type="primary" size="small" icon="el-icon-download" @click="getCarExport">导出</el-button> -->
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
        @selection-change="handleSelectionChange">
        <el-table-column resizable show-overflow-tooltip align="center" type="selection"></el-table-column>
        <el-table-column
          align="center"
          v-for="(item, index) in tableHeaderData"
          :key="index"
          :label="item.label"
          :prop="item.prop"
        ></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="table.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="table.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="table.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import serve from '@/api/systemManage.api'
export default {
  name: 'subaccount',
  components: { SearchFilter },
  props: {},
  data() {
    return {
      filterForm: [
        {
          type: 'time',
          label: '时间',
          key: 'time',
          value: ''
        }
      ],
      startDate: null,
      endDate: null,
      tableHeaderData: [
        {
          label: '提现账户',
          prop: 'mchId'
        }, {
          label: '分账账户',
          prop: 'subMchId'
        }, {
          label: '收款账户',
          prop: 'mchId'
        }, {
          label: '分账金额（￥）',
          prop: 'sharingAmount'
        }, {
          label: '流水单号',
          prop: 'outOrderNo'
        }, {
          label: '分账时间',
          prop: 'createTime'
        }, {
          label: '分账描述',
          prop: 'description'
        }, {
          label: '状态',
          prop: 'status'
        }
      ],
      tableData: [],
      multipleSelection: [],
      table: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getProfitList()
  },
  beforeDestroy() {},
  methods: {
    async getProfitList() {
      const params = {
        pageNo: this.table.currentPage,
        pageSize: this.table.pageSize,
        startDate: this.startDate ? this.startDate : null,
        endDate: this.endDate ? this.endDate : null
      }
      const res = await serve.getProfitList(params)
      if (res.data.code === 200) {
        // console.log(res.data.data)
        this.table.total = res.data.data.totalCount
        this.table.currentPage = res.data.data.currentPage
        this.tableData = res.data.data.rows
        res.data.data.rows.forEach(item => {
          if (item.status === 0) {
            item.status = '待分账'
          } else if (item.status === 1) {
            item.status = '提交分账申请成功'
          } else if (item.status === 2) {
            item.status = '分账成功'
          } else if (item.status === 3) {
            item.status = '分账关闭'
          }
        })
      }
    },
    getCarExport() {},
    handleSearch(params) {
      if (params.time === null) {
        this.startDate = null
        this.endDate = null
      } else if (params.time.length > 0) {
        this.startDate = new Date(params.time[0]).getTime()
        this.endDate = new Date(params.time[1]).getTime()
      }
      this.getProfitList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 每页多少条
    handleSizeChange(val) {
      this.table.pageSize = val
      this.getProfitList()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.table.currentPage = val
      this.getProfitList()
    }
  }
}
</script>

<style lang="scss" scoped>
.subaccount {
  padding: 20px 30px;
}
</style>
