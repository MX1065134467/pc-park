<template>
  <div class='tab-content'>
    <!-- 表格数据 -->
    <div class="table-wrap">
      <el-table
        stripe
        border
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          align='center'
          width="48"
          type="selection">
        </el-table-column>
        <el-table-column resizable show-overflow-tooltip align='center' v-for='(item, index) in tabContent.tableHeaderData' :key='index' :label='item.label' :prop='item.prop' :width="item.width">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align='center'
          width="150">
          <template slot-scope="scope">
            <el-button type="text" class="green" @click="handleToDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="table.pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="table.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  props: {
    tabContent: {}
  },
  data () {
    return {
      multipleSelection: [],
      totalCount: 0,
      table: {
        pageNo: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      active: 0
    }
  },
  watch: {
    'tabContent.tableData': {
      handler(newValue, oldValue) {
        this.tableData = newValue.rows
        this.totalCount = newValue.totalCount
        this.table.pageSize = newValue.pageSize
        this.table.pageNo = newValue.pageNo
        this.active = newValue.active
      },
      deep: true,
      immediate: true
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 详情
    handleToDetail(data) {
      this.$router.push({
        name: 'userManageDetail',
        query: {
          carId: this.$route.query.carId,
          carNo: this.$route.query.carNo,
          title: this.tabContent.value,
          id: this.tabContent.value === '停车记录' ? data.orderId : this.tabContent.value === '积分记录' ? data.orderNo : data.blackId,
          active: this.active,
          orderId: data.orderId
        }
      })
    },
    // 每页多少条
    handleSizeChange(val) {
      this.table.pageSize = val
      this.$emit('handlePageSizeChange', {
        pageSize: val
      })
    },
    // 页数改变
    handleCurrentChange(val) {
      this.table.pageNo = val
      this.$emit('handlePageSizeChange', {
        pageNo: val
      })
    }
  }
}
</script>

<style lang='scss' scoped></style>
