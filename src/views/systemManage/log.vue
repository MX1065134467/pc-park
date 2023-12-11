<template>
  <div class='system-log'>
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <!-- 搜索条件 -->
      <search-filter :filter-form="filterForm" @searchData="handleSearch">
        <div class="handle-btn" slot="operate">
          <!-- <el-button type="primary" size="small" icon="el-icon-download" @click="getCarExport">导出</el-button> -->
        </div>
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
            resizable
            show-overflow-tooltip
            align='center'
            type="selection">
          </el-table-column>
          <el-table-column align='center' v-for='(item, index) in tableHeaderData' :key='index' :label='item.label' :prop='item.prop'>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="table.currentPage"
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
import serve from '@/api/systemManage.api'
// import moment from 'moment'
import handleExport from '@/utils/export'
// import { getUserInfo } from '@/common/cache.js'
export default {
  name: 'log',
  components: {
    SearchFilter
  },
  props: {},
  data () {
    return {
      loading: false,
      table: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableParams: {
        pageNo: 1,
        pageSize: 10
      },
      userName: null,
      phone: null,
      startTime: null,
      endTime: null,
      searchParams: '',
      // 搜索
      filterForm: [
        {
          type: 'input',
          label: '账户',
          placeholder: '请输入账户',
          key: 'userPhone',
          value: ''
        }, {
          type: 'input',
          label: '姓名',
          placeholder: '请输入姓名',
          key: 'name',
          value: ''
        }, {
          type: 'time',
          label: '时间',
          key: 'operateTime',
          value: ''
        }
      ],
      // 表头
      tableHeaderData: [
        {
          label: '归属',
          prop: 'company'
        }, {
          label: '姓名',
          prop: 'userName'
        }, {
          label: '操作',
          prop: 'operateDesc'
        }, {
          label: '操作时间',
          prop: 'createTime'
        }, {
          label: '操作账户',
          prop: 'userPhone'
        }, {
          label: 'IP',
          prop: 'ip'
        }
      ],
      // 表格数据
      tableData: [],
      multipleSelection: [],
      exportParams: {},
      useInfo: {}
    }
  },
  created () {},
  mounted () {
    this.useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getAllLogs()
  },
  methods: {
    // 获取列表信息
    getAllLogs() {
      const params = {
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        phone: this.phone ? this.phone : null,
        userName: this.userName ? this.userName : null,
        endTime: this.endTime ? this.endTime : null,
        startTime: this.startTime ? this.startTime : null,
        userId: this.useInfo.userId
      }
      serve.sysLogList(params).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          this.tableData = res.data.data.rows
          this.table.total = res.data.data.totalCount
          // res.data.data.rows.map(item => {
          //   item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          //   return item
          // })
        }
      })
    },
    // getAllLogs(params) {
    //   this.tableParams = {
    //     pageNo: this.table.currentPage,
    //     pageSize: this.table.pageSize,
    //     state: 2,
    //     orgCode: getUserInfo().orgCode
    //   }
    //   this.loading = true
    //   this.exportParams = { ...params }
    //   this.exportParams.state = 2
    //   serve.getAllLogs({ ...this.tableParams, ...params }).then((res) => {
    //     this.loading = false
    //     if (res.data.code === 200) {
    //       this.tableData = res.data.data.rows
    //       this.table.total = res.data.data.totalCount
    //       res.data.data.rows.map(item => {
    //         item.operationTime = moment(item.operationTime).format('YYYY-MM-DD HH:mm:ss')
    //         return item
    //       })
    //     } else {
    //       this.$message.error(res.data.msg ? res.data.msg : '获取数据失败')
    //     }
    //     console.log(res)
    //   })
    // },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索传过来的值
    handleSearch(params) {
      console.log(params)
      this.userName = params.name
      this.phone = params.userPhone
      this.startTime = new Date(params.operateTime[0]).getTime()
      this.endTime = new Date(params.operateTime[1]).getTime()
      this.getAllLogs()
    },
    // 导出
    getCarExport() {
      handleExport(this.multipleSelection, 'sysLogids', this.exportParams, 'sysLogsController/exportExcel', '', 'state=2', '系统日志')
    },
    // 每页多少条
    handleSizeChange(val) {
      this.table.pageSize = val
      this.getAllLogs()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.table.currentPage = val
      this.getAllLogs()
    }
  }
}
</script>

<style lang='scss' scoped></style>
