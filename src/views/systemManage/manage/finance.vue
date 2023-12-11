<template>
  <div class="finance">
    <div class="account-info">
      <span>微信支付子账户：{{accountNum}}</span>
      <span class="account-banlance-style">
        <span>账户余额（￥）：{{accountBalance}}</span>
        <el-button class="account-button-style" type="text">提现</el-button>
      </span>
    </div>
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
export default {
  name: 'finance',
  components: {
    SearchFilter
  },
  props: {},
  data() {
    return {
      filterForm: [
        {
          type: 'time',
          label: '提现时间',
          key: 'time',
          value: ''
        }
      ],
      tableHeaderData: [
        {
          label: '提现账户',
          prop: 'account'
        }, {
          label: '收款银行卡',
          prop: 'bankCard'
        }, {
          label: '收款人',
          prop: 'name'
        }, {
          label: '提现金额（￥）',
          prop: 'amount'
        }, {
          label: '提现时间',
          prop: 'applyTime'
        }, {
          label: '到账时间',
          prop: 'accountTime'
        }, {
          label: '操作账户',
          prop: 'operateAccount'
        }, {
          label: 'ip',
          prop: 'ip'
        }
      ],
      tableData: [],
      multipleSelection: [],
      table: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      accountNum: 67868876,
      accountBalance: 12899.0
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    handleSearch(data) {
      console.log(data)
    },
    getCarExport() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 每页多少条
    handleSizeChange(val) {
      this.table.pageSize = val
    },
    // 页数改变
    handleCurrentChange(val) {
      this.table.currentPage = val
    }
  }
}
</script>

<style lang="scss" scoped>
.finance {
  padding: 20px 30px;
  .account-info {
    height: 60px;
    line-height: 60px;
    padding-left: 20px;
    .account-banlance-style {
      margin-left: 150px;
      .account-button-style {
        margin-left: 16px;
      }
    }
  }
}
</style>
