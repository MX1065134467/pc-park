<template>
  <div class='history-report'>
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <!-- 搜索条件 -->
      <search-filter :filter-form="filterForm" @searchData="handleSearch">
        <div class="handle-btn" slot="operate">
          <el-button size="small" type="primary" icon="el-icon-download" @click="download">批量下载</el-button>
        </div>
      </search-filter>
      <div class="table-wrap">
        <el-table stripe border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align='center' type="selection">
          </el-table-column>
          <el-table-column align='center' :width="item.width" v-for='(item, index) in tableHeaderData' :key='index' :label='item.label' :prop='item.prop'>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align='center' width="150">
            <template slot-scope="scope">
              <el-button @click="downloadData(scope.row)" type="text" size="small">下载 </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.pageNum" :page-sizes="[10, 20, 30, 40]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import SearchFilter from '@c/SearchFilterFrom'
import serve from '@/api/dataAnalysis.api.js'
import moment from 'moment'
import base from '@/api/base'
import axios from '../../../utils/http'
export default {
  name: '',
  components: {
    SearchFilter
  },
  props: {},
  data() {
    return {
      total: 0,
      multipleSelection: [],
      dialogTitle: '',
      filterForm: [
        {
          type: 'input',
          label: '报表名称',
          placeholder: '报表名称',
          key: 'reportName'
        },
        {
          type: 'time',
          label: '创建时间',
          key: 'createTime'
        }
      ],
      // 表头
      tableHeaderData: [
        {
          label: '报表名称',
          prop: 'reportName',
          width: '150'
        },
        {
          label: '报表类型',
          prop: 'reportTypeStr',
          width: '80'
        },
        {
          label: '报表数据周期',
          prop: 'dataCycle',
          width: '250'
        },
        {
          label: '文件名称',
          prop: 'fileName'
        },
        {
          label: '报表备注',
          prop: 'remarks'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: '180'
        },
        {
          label: '创建人',
          prop: 'createBy',
          width: '80'
        }
      ],
      // 表格数据
      tableData: [],
      table: {
        pageSize: 10,
        pageNum: 1
      },
      startTime: '',
      endTime: '',
      reportName: '',
      loading: false
    }
  },
  created() {
    this.getHistoryData()
  },
  mounted() {},
  methods: {
    // 单个下载
    downloadData(data) {
      const params = {
        fileName: data.fileName,
        filePath: data.filePath
      }
      console.log(params)
      axios.post(`${base.baseUrl}/file/downLoadSingle`, params, {
        responseType: 'blob'
      }).then(res => {
        const fileName = decodeURI(res.headers['content-disposition'].split('=')[1])
        const blob = new Blob([res.data], {
          // type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          type: 'application/zip'
        })
        var fileLink = document.createElement('a')
        fileLink.href = URL.createObjectURL(blob)
        fileLink.download = fileName
        fileLink.click()
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取历史表格数据
    getHistoryData() {
      const params = {
        startTime: this.startTime,
        endTime: this.endTime,
        reportName: this.reportName,
        ...this.table
      }
      this.loading = true
      serve.getReportHistory(params).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          this.tableData = res.data.data.rows
          this.total = res.data.data.totalCount
        } else {
          this.$message.error(res.data.msg ? res.data.msg : '获取数据失败')
        }
      })
    },
    // 批量下载
    download() {
      const params = []
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择数据进行批量下载')
        return
      }
      this.multipleSelection.forEach(item => {
        params.push({
          fileName: item.fileName,
          filePath: item.filePath
        })
      })
      axios.post(`${base.baseUrl}/file/downLoad`, params, {
        responseType: 'blob'
      }).then(res => {
        const fileName = decodeURI(res.headers['content-disposition'].split('=')[1])
        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        var fileLink = document.createElement('a')
        fileLink.href = URL.createObjectURL(blob)
        fileLink.download = fileName
        fileLink.click()
      }).catch(err => {
        console.log(err)
      })
    },
    // 搜索传过来的值
    handleSearch(params) {
      console.log(params)
      if (params.createTime) {
        this.startTime = moment(params.createTime[0]).valueOf()
        this.endTime = moment(params.createTime[1]).valueOf()
      } else {
        this.startTime = ''
        this.endTime = ''
      }
      this.reportName = params.reportName
      this.getHistoryData()
      // 调用查询接口
    },
    // 选中表单
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    // 每页多少条
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.table.pageSize = val
      this.getHistoryData()
    },
    // 页数改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.table.pageNum = val
      this.getHistoryData()
    },
    // 模态框
    handleDialog(row) {
      console.log(row)
      this.$router.push({
        path: '/basic/data-report',
        query: {
          row: row
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.history-report {
  .table-wrap {
    margin-top: 10px;
    .stopClass {
      font-size: 12px !important;
      color: red !important;
    }
    .startClass {
      font-size: 12px !important;
      color: #67c23a !important;
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
