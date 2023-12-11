<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch" @connect="connect">
        <div class="handle-btn" slot="operate">
          <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
          <el-button :disabled="isDisabled" size="small" type="warning" @click="deleteSize">批量移除</el-button>
        </div>
      </search-filter>
      <div class="table-wrap">
        <el-table stripe border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align='center' type="selection">
          </el-table-column>
          <template v-for='(item, index) in tableHeaderData'>
            <el-table-column align='center' v-if="item.show" resizable show-overflow-tooltip :width="item.width" :key='index' :label='item.label' :prop='item.prop'></el-table-column>
          </template>
          <el-table-column fixed="right" label="操作" align='center'>
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detail(scope.row, '停车记录详情')">详情</el-button>
              <el-button :disabled="isDisabled" type="text" size="small" class="forbidden_btn" @click="stopOrStartUse(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,30,40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 移除-->
    <div v-if="messageData.show">
      <reminder-modal @handleDialog="handleModalShow" v-bind:message="messageData">
        <div slot="content">
          {{messageData.content}}
        </div>
      </reminder-modal>
    </div>
    <!-- 批量移除 -->
    <div v-if="deleteData.show">
      <reminder-modal @handleDialog="handleModalDelete" v-bind:message="deleteData">
        <div slot="content">
          {{deleteData.content}}
        </div>
      </reminder-modal>
    </div>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import serve from '@/api/operationManage.api'
import server from '@/api/systemManage.api'
import { getUserInfo } from '@/common/cache.js'
import { downloadFile } from '@/utils/util'
export default {
  name: 'carCheck',
  components: { ReminderModal, SearchFilter },
  data () {
    const { isAdmin, userType } = JSON.parse(sessionStorage.getItem('userInfo'))
    return {
      isDisabled: isAdmin === 1 && userType === 1,
      loading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      filterForm: [
        {
          type: 'select',
          label: '停车场管理公司',
          placeholder: '停车场',
          key: 'park',
          options: [],
          value: '',
          disabled: false
        },
        {
          type: 'select',
          label: '停车场',
          placeholder: '车库',
          key: 'garage',
          options: [],
          value: ''
        },
        {
          type: 'input',
          label: '车牌号',
          placeholder: '请输入车牌号',
          key: 'carNum'
        },
        {
          type: 'date',
          label: '进场时间',
          key: 'time',
          value: []
        }
      ],
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '停车场名称',
          prop: 'garageName',
          show: true
        },
        {
          label: '车牌号',
          prop: 'carNo',
          show: true
        },
        {
          label: '车辆类型',
          prop: 'carTypeStr',
          show: true
        },
        {
          label: '进场时间',
          prop: 'inTime',
          show: true
        },
        {
          label: '车辆状态',
          prop: 'status',
          show: true
        }
      ],
      tableData: [],
      dialogData: {
        isShow: false,
        title: '添加'
      },
      rowDetail: {},
      checkDialog: false, // 查看 dialog
      checkData: {},
      srcList: [],
      messageData: {
        title: '移除',
        show: false,
        content: ''
      },
      deleteData: {
        title: '批量移除',
        show: false,
        content: ''
      },
      garage: [], // 车库数据
      childrenParking: [],
      parkingId: null,
      garageId: null,
      carNo: null,
      status: null,
      endTime: '',
      startTime: ''
    }
  },
  created() {
    this.getList()
    this.getParkingList()
  },
  methods: {
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
    // 获取停车场列表
    async getParkingList() {
      const userId = getUserInfo().userId
      const { data: response } = await serve.getParkList({ userId })
      if (response.code === 200) {
        response.data.map(item => {
          this.garage = [...this.garage, ...item.garageIdAndName]
          this.filterForm[0].options.push({ value: item.parkingId, label: item.parkingName })
        })
        // 平台账户只有一个停车场  直接显示并禁用
        if (this.filterForm[0].options.length <= 1) {
          this.filterForm[0].value = this.filterForm[0].options[0].value
          this.filterForm[0].disabled = true
          this.connect(this.filterForm[0].value)
        }
        response.data.map(v => {
          const childrenArr = []
          v.garageIdAndName.map(element => {
            if (element.status === 1) {
              const childObj = {
                value: element.garageId,
                label: element.garageName
              }
              childrenArr.push(childObj)
            }
          })
          const parentObj = {
            value: v.parkingId,
            label: v.parkingName,
            children: childrenArr
          }
          this.childrenParking.push(parentObj)
        })
      }
    },
    // 批量移除
    deleteSize() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先选择移除数据')
      } else {
        this.deleteData.show = true
        this.deleteData.content = '是否批量移除选中的停车记录？'
      }
    },
    // 移除接口调用
    handleModalShow() {
      const arrList = []
      arrList.push(this.multipleSelection.inOutId)
      server.removeRecordList(arrList).then((res) => {
        if (res.data.code === 200) {
          this.$message.success('移除成功')
          this.multipleSelection = []
          this.getList()
        } else {
          this.$message.error('移除失败')
        }
      })
    },
    handleModalDelete() {
      const arrList = []
      this.multipleSelection.map((item) => {
        arrList.push(item.inOutId)
      })
      const params = arrList
      server.removeRecordList(params).then((res) => {
        if (res.data.code === 200) {
          this.$message.success('移除成功')
          this.getList()
        } else {
          this.$message.error('移除失败')
        }
      })
    },
    // 获取列表
    async getList() {
      const params = {
        parkingId: getUserInfo().parkingId ? getUserInfo().parkingId : this.parkingId,
        garageId: this.garageId,
        carNo: this.carNo,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        endTime: this.endTime,
        startTime: this.startTime
      }
      const { data: res } = await server.getInRecordList(params)
      this.loading = true
      if (res.code === 200) {
        this.loading = false
        res.data.rows.map(item => {
          item.status = '在库'
        })
        this.tableData = res.data.rows && res.data.rows
        this.total = res.data.totalCount
      } else {
        this.loading = false
      }
    },
    // 搜索
    handleSearch(obj) {
      this.parkingId = obj.park ? obj.park : ''
      this.garageId = obj.garage ? obj.garage : ''
      this.carNo = obj.carNum ? obj.carNum : ''
      this.startTime = obj.time !== null ? obj.time[0] : null
      this.endTime = obj.time !== null ? obj.time[1] : null
      console.log(this.startTime, this.endTime, 88555)
      this.getList()
    },
    // 详情
    detail(row) {
      this.$router.push({ path: '/system/carCheck/detail', query: { inOutId: row.inOutId } })
    },
    stopOrStartUse(row) {
      this.multipleSelection = row
      this.messageData.show = true
      this.messageData.content = '是否移除该条停车记录？'
    },
    // 导出
    exportData() {
      const arrList = []
      this.multipleSelection.map((item) => {
        arrList.push(item.inOutId)
      })
      const params = {
        carNo: this.carNo,
        inOutIdList: arrList,
        endTime: this.endTime,
        startTime: this.startTime,
        parkingId: getUserInfo().parkingId ? getUserInfo().parkingId : this.parkingId,
        garageId: this.garageId
      }
      server.exportRecordList(params).then(res => {
        console.log(res, 9555)
        if (res.status === 200) {
          downloadFile(res.data, '车辆排查')
        }
      })
    },

    // tabel 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getList()
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.getList()
    },
    confirmDialog() {
      this.dialogData.isShow = false
      this.getList()
    },
    cancel() {
      this.checkDialog = false
      this.checkData = {}
      this.srcList = []
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .check_dialog {
    .check_content {
      li {
        display: flex;
        padding: 0 10px;
        box-sizing: border-box;
        margin-bottom: 40px;
        span {
          flex: 1;
        }
        .el-image {
          margin-right: 24px;
        }
      }
    }
    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  }
  .remove_btn {
    color: #606266;
  }
  .stopClass {
    color: #e6a23c;
  }
  .delay_btn {
    color: #67c23a;
  }
}
::v-deep.el-input--suffix .el-input__inner {
  padding-right: 21px;
}
::v-deep .el-input__inner {
  padding-right: 20px!important;
}
</style>
