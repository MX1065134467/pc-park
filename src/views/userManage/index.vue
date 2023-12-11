<template>
  <div class='user-manage'>
    <div class="user-manage-main" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <!-- 搜索条件 -->
      <search-filter :filter-form="filterForm" @searchData="handleSearch">
      </search-filter>
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
          <el-table-column resizable show-overflow-tooltip align='center' v-for='(item, index) in tableHeaderData' :key='index' :label='item.label' :prop='item.prop'>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align='center'
            width="150">
            <template slot-scope="scope">
              <el-button type="text" class="green" @click="handleToUser(scope.row)">用户中心</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="table.pageNum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="table.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="table.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import serve from '@/api/userManage.api.js'
import { getUserInfo } from '@/common/cache.js'
export default {
  name: '',
  components: {
    SearchFilter
  },
  props: {},
  data () {
    return {
      loading: false,
      table: {
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      multipleSelection: [],
      // 搜索
      filterForm: [
        {
          type: 'input',
          label: '车牌号',
          placeholder: '请输入车牌号',
          key: 'carNo'
        }
      ],
      // 表头
      tableHeaderData: [
        {
          label: '车牌号',
          prop: 'carNo'
        }, {
          label: '累计停车次数',
          prop: 'times'
        }, {
          label: '累计停车时长（h）',
          prop: 'parkHour'
        },
        {
          label: '积分',
          prop: 'scoreValue'
        },
        {
          label: '最近停车时间',
          prop: 'recentTime'
        },
        {
          label: '录入时间',
          prop: 'createTime'
        }
      ]
    }
  },
  created () {
    // 获取列表数据
    this.getUserList()
  },
  mounted () {},
  methods: {
    getUserList(params) {
      this.loading = true
      serve.getUserList({ ...params, ...this.table, userId: getUserInfo().userId }).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          this.tableData = res.data.data.rows
          this.table.total = res.data.data.totalCount
        }
      })
    },
    // 搜索传过来的值
    handleSearch(params) {
      this.getUserList(params)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 跳转到用户中心
    handleToUser(data) {
      this.$router.push({
        name: 'userManageUser',
        query: {
          carId: data.carId,
          carNo: data.carNo
        }
      })
    },
    // 每页多少条
    handleSizeChange(val) {
      this.table.pageSize = val
      this.getUserList()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.table.pageNum = val
      this.getUserList()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
