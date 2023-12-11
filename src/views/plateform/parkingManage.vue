<template>
  <div class="parking-manage">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch">
        <div class="handle-btn" slot="operate">
          <!-- <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
          <el-button size="small" type="primary" icon="el-icon-edit" @click="handleAddDialog('添加','',2)">添加</el-button>
        </div>
      </search-filter>
      <div class="table-wrap">
        <el-table stripe border v-loading="loading" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align='center' type="selection">
          </el-table-column>
          <template v-for='(item, index) in tableHeaderData'>
            <el-table-column align='center' v-if="item.show" resizable show-overflow-tooltip :width="item.width" :key='index' :label='item.label' :prop='item.prop'></el-table-column>
          </template>
          <el-table-column align='center' prop="status" label='状态'>
            <template slot-scope="{row}">
              <span v-if="row.status ===1">启用</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align='center' width="150">
            <template slot-scope="scope">
              <el-button @click="handleAddDialog('查看', scope.row,1)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small" @click="handleAddDialog('编辑', scope.row,3)">编辑</el-button>
              <el-button type="text" size="small" @click="(scope.row)">
                <!-- 1 启用状态 2 停用状态 -->
                <i class="stopClass" v-if="scope.row.status === 1" @click="stopOrStartUse(scope.row)">停用</i>
                <i class="startClass" v-else @click="stopOrStartUse(scope.row)">启用</i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,30,40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 停用和使用模态框 -->
    <div v-if="messageData.show">
      <reminder-modal @handleDialog="handleModalShow" v-bind:message="messageData">
        <div slot="content">
          {{messageData.content}}
        </div>
      </reminder-modal>
    </div>
    <div v-if="dialogFormVisible.show">
      <parking-manage-dialog v-bind:dialogVisible='dialogFormVisible' @handleDialog="handleDialogShow" :dialogFromData="dialogFromData" :dialogTitle="dialogTitle"></parking-manage-dialog>
    </div>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import ParkingManageDialog from './dialog/ParkingManageDialog'
import serve from '@/api/plateform.api'
export default {
  name: 'myCenter',
  components: {
    SearchFilter,
    ReminderModal,
    ParkingManageDialog
  },
  props: {},
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 添加的模态框是否显示
      dialogFormVisible: {
        show: false
      },
      // 编辑和详情 打开弹框的时候 携带的数据
      dialogFromData: {},
      parkingAddress: '',
      parkingName: '',
      filterForm: [
        {
          type: 'input',
          label: '停车场管理公司',
          placeholder: '停车场管理公司',
          key: 'parkingName'
        },
        {
          type: 'input',
          label: '停车场地址',
          placeholder: '停车场地址',
          key: 'parkingAddress'
        }
      ],
      // 表头
      tableHeaderData: [
        {
          label: '停车公司编号',
          prop: 'parkingCode',
          show: true
        },
        {
          label: '停车场管理公司',
          prop: 'parkingName',
          show: true,
          width: '150'
        },
        {
          label: '详细地址',
          prop: 'address',
          show: true,
          width: '150'
        },
        {
          label: '定位地址',
          prop: 'localtionAddress',
          show: true,
          width: '180'
        },
        {
          label: '负责人',
          prop: 'contactPerson',
          show: true
        },
        {
          label: '电话',
          prop: 'contactPhone',
          show: true,
          width: '120'
        },
        {
          label: '产权公司',
          prop: 'company',
          show: true,
          width: '200'
        },
        {
          label: '车库数',
          prop: 'garageCount',
          show: true
        },
        {
          label: '车位总数',
          prop: 'garageSum',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          show: false
        }
      ],
      tableData: [],
      multipleSelection: [],
      // 停用和使用模态框
      messageData: {
        show: false,
        title: '操作提醒',
        content: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getParkList()
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    getParkList() {
      this.loading = true
      const params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        parkingAddress: this.parkingAddress ? this.parkingAddress : '',
        parkingName: this.parkingName ? this.parkingName : ''
      }
      serve.getParkList(params).then(res => {
        this.loading = false
        this.tableData = res.data.data.rows
        this.total = res.data.data.totalCount
      })
    },
    handleSearch(params) {
      this.parkingAddress = params.parkingAddress
      this.parkingName = params.parkingName
      this.getParkList()
    },
    exportData() {},
    handleAddDialog(title, paramsData, flag) {
      // 1 查 2增 3编辑
      this.dialogTitle = title
      if (flag === 1 || flag === 3) {
        const params = {
          detailId: paramsData.parkingId
        }
        this.dialogFromData = params
      } else {
        this.dialogFromData = {}
      }
      this.dialogFromData.flagTypeCheck = flag
      this.dialogFormVisible.show = true
    },
    // 选中表单
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 停用和使用的模态框
    stopOrStartUse(data) {
      this.messageData.show = true
      if (data.status === 1) {
        this.messageData.content = '是否停用该停车场？'
      } else {
        this.messageData.content = '是否启用该停车场？'
      }
      this.statusRow = data
    },
    // 停用和使用
    handleModalShow() {
      this.loading = true
      // 1 启用状态 2 停用状态
      const params = {
        isStop: this.statusRow.status === 1,
        parkingId: this.statusRow.parkingId
      }
      // 接口
      serve.stopOrUse(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.$message.success('修改成功!')
          this.getParkList()
        } else {
          this.loading = false
          this.$message.erroe(res.data.msg)
        }
      })
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val
      this.getParkList()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getParkList()
    },
    // 关闭模态框后的操作
    handleDialogShow(data) {
      this.getParkList()
    }
  }
}
</script>

<style lang="scss" scoped>
.parking-manage {
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
