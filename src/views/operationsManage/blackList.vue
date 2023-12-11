<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch" @connect="connect">
        <div class="handle-btn" slot="operate">
          <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="batchReset" :disabled="isDisabled">重置</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="handleAddDialog"
            :disabled="isDisabled"
          >添加</el-button>
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
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="btnHandle(scope.row, '查看')">查看</el-button>
              <el-button :disabled="isDisabled" class="dispose" type="text" size="small" v-if="scope.row.status === 0" @click="btnHandle(scope.row, '处理')">处理</el-button>
              <el-button :disabled="isDisabled" class="re_check" type="text" size="small" v-if="scope.row.status === 1" @click="btnHandle(scope.row, '复核')">复核</el-button>
              <el-button :disabled="isDisabled" class="reset" type="text" size="small" v-if="scope.row.status === 9" @click="btnHandle(scope.row, '重置')">重置</el-button>
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
    <black-list-dialog :dialogData="dialogData" @operationConfirm="operationConfirm"></black-list-dialog>
    <div v-if="blackData.isShow">
      <add-black-list @close="handleAddBlack" :blackData="blackData"></add-black-list>
    </div>
    <reminder-modal @handleDialog="handleDialog" :message="modalMessage">
      <div slot="content">
          {{modalMessage.content}}
        </div>
    </reminder-modal>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import blackListDialog from './dialog/blackListDialog'
import addBlackList from './dialog/addBlackList'
import ReminderModal from '@c/ReminderModal'
import serve from '@/api/operationManage.api'
import { getUserInfo } from '@/common/cache.js'
import { timeFormat, downloadFile } from '@/utils/util.js'
export default {
  name: 'blackList',
  components: {
    SearchFilter,
    blackListDialog,
    addBlackList,
    ReminderModal
  },
  data() {
    const { isAdmin, userType } = JSON.parse(sessionStorage.getItem('userInfo'))
    return {
      isDisabled: isAdmin === 1 && userType === 1,
      loading: false,
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
        }
      ],
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '停车场管理公司',
          prop: 'parkingName',
          show: true
        },
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
          label: '拉黑原因',
          prop: 'blackReason',
          show: true
        },
        {
          label: '获取渠道',
          prop: 'channelTypeStr',
          show: true
        },
        {
          label: '添加人',
          prop: 'createBy',
          show: true
        },
        {
          label: '审核人',
          prop: 'updateBy',
          show: true
        },
        {
          label: '审核时间',
          prop: 'updateTime',
          show: true
        },
        {
          label: '黑名单时间',
          prop: 'dayCount',
          show: true
        },
        {
          label: '执行周期',
          prop: 'validity',
          show: true
        }
      ],
      tableData: [],
      dialogData: { // 操作 dialog
        isShow: false,
        title: '',
        content: {}
      },
      rowDetail: {},
      modalMessage: {
        title: '',
        show: false,
        content: ''
      },
      // 添加 dialog
      blackData: {
        isShow: false,
        title: ''
      },
      garage: [],
      childrenParking: [],
      parkingId: null,
      garageId: null,
      carNo: null
    }
  },
  created() {
    this.geBlacktList()
    this.getParkingList()
  },
  methods: {
    // 获取列表
    async geBlacktList() {
      const params = {
        parkingId: this.parkingId,
        garageId: this.garageId,
        carNo: this.carNo,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        userId: getUserInfo().userId
      }
      this.loading = true
      const { data: res } = await serve.parkBlackList(params)
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.rows
        this.total = res.data.totalCount
        this.tableData.map(item => {
          item.validity = `${timeFormat(item.beginTime, 'yyyy-mm-dd')} 至 ${timeFormat(item.endTime, 'yyyy-mm-dd')}`
          item.dayCount = item.reviewCount ? item.reviewCount : item.dayCount
        })
      }
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
    // 搜索
    handleSearch(obj) {
      this.parkingId = obj.park
      this.garageId = obj.garage
      this.carNo = obj.carNum

      this.geBlacktList()
    },
    // 添加
    handleAddDialog() {
      // this.blackData = {}
      this.blackData.title = '添加'
      this.blackData.parkingList = this.childrenParking
      this.blackData.userName = getUserInfo().userName
      this.blackData.isShow = true
    },
    // tabel 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 导出
    exportData() {
      const arrList = []
      this.multipleSelection.map((item) => {
        arrList.push(item.blackId)
      })
      const params = {
        parkingId: this.parkingId,
        garageId: this.garageId,
        carNo: this.carNo,
        userId: getUserInfo().userId,
        ids: arrList
      }
      serve.ParkBlackInfo(params).then(res => {
        if (res.status === 200) {
          downloadFile(res.data, '黑名单名单')
        }
      })
    },
    // 批量重置
    batchReset() {
      if (!this.multipleSelection.length) return this.$message.info('请选择移除名单!')
      const removeArr = []
      this.multipleSelection.map(v => {
        const obj = {
          status: 0,
          blackId: v.blackId,
          userId: getUserInfo().userId,
          userName: getUserInfo().userName
        }
        removeArr.push(obj)
        this.modalMessage.title = '批量重置'
        this.modalMessage.show = true
        this.modalMessage.content = '是否将该车辆将从黑名单释放？'
        this.modalMessage.removeList = removeArr
      })
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.geBlacktList()
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.geBlacktList()
    },
    // btn 操作
    btnHandle(row, title) {
      this.rowDetail = row
      const { blackId } = row
      switch (title) {
        case '查看':
          this.dialogData.title = title
          this.dialogData.isShow = true
          this.getDetailById(blackId)
          break
        case '处理':
          this.dialogData.title = title
          this.dialogData.isShow = true
          this.getDetailById(blackId)
          break
        case '复核':
          this.dialogData.title = title
          this.dialogData.isShow = true
          this.getDetailById(blackId)
          break
        case '重置':
          this.modalMessage.show = true
          this.modalMessage.title = title
          this.modalMessage.content = '是否将该车辆将从黑名单释放？'
          this.modalMessage.itemID = blackId
          break
      }
    },
    // 根据 ID 查看详情
    getDetailById(blackId) {
      serve.getDetail(blackId).then(res => {
        if (res.data.code === 200) {
          res.data.data.sysFileInfoList.forEach(v => this.IMAGEURL + v)
          this.dialogData.content = res.data.data
          this.dialogData.blackId = blackId
          const arr = this.dialogData.content.sysFileInfoList
          for (let i = 0; i < arr.length; i++) {
            arr[i] = `${this.IMAGEURL}${arr[i]}`
          }
        }
      })
    },
    handleAddBlack() {
      this.blackData.isShow = false
      this.geBlacktList()
    },
    async handleDialog(val) {
      const params = {
        userId: getUserInfo().userId,
        id: val.itemID
      }
      if (val.title === '重置') {
        const { data: res } = await serve.resetSingle(params)
        if (res.code === 200) this.$message.success(res.msg)
        this.geBlacktList()
      }
      if (val.title === '批量重置') {
        const { data: res } = await serve.batchReset(val.removeList)
        if (res.code === 200) this.$message.success(res.msg)
        this.geBlacktList()
      }
    },
    operationConfirm() {
      this.dialogData.isShow = false
      this.geBlacktList()
    }
  }
}
</script>

<style scoped lang="scss">
.dispose {
  color:#F56C6C
}
.re_check {
  color: #67C23A;
}
.reset {
  color: #909399;
}
</style>
