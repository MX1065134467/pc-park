<template>
  <div class="equip-type">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch">
        <div class="handle-btn" slot="operate">
          <!-- <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
          <el-button size="small" v-if="isAdmiFlag" type="primary" icon="el-icon-edit" @click="handleAddDialog('添加','',2)">添加</el-button>
        </div>
      </search-filter>
      <div class="table-wrap">
        <el-table stripe border v-loading="loading" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align='center' type="selection">
          </el-table-column>
          <template v-for='(item, index) in tableHeaderData'>
            <el-table-column align='center' v-if="item.show" resizable show-overflow-tooltip :width="item.width" :key='index' :label='item.label' :prop='item.prop'></el-table-column>
          </template>
          <el-table-column align='center' prop="status" label='状态' width="120">
            <template slot-scope="{row}">
              <span v-if="row.status ===1">使用</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align='center' width="150" v-if="isAdmiFlag">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleAddDialog('编辑', scope.row,3)">编辑</el-button>
              <el-button type="text" size="small" @click="(scope.row)">
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
import serve from '@/api/basicEquip.api'
import { getUserId, getAdminType, getUserType } from '@/common/cache'
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import ParkingManageDialog from './dialog/EquipTypeDialog'
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
      equipTypeName: '',
      isAdmiFlag: true,
      // 添加的模态框是否显示
      dialogFormVisible: {
        show: false
      },
      // 编辑和详情 打开弹框的时候 携带的数据
      dialogFromData: {},
      filterForm: [
        {
          type: 'input',
          label: '类型名称',
          placeholder: '类型名称',
          key: 'equipTypeName'
        },
        {
          type: 'select',
          label: '停车场管理公司',
          placeholder: '停车场管理公司',
          key: 'parkingId',
          options: []
        }
      ],
      // 表头
      tableHeaderData: [
        {
          label: '类型名称',
          prop: 'equipName',
          show: true
        },
        {
          label: '停车场管理公司',
          prop: 'parkingName',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          show: false
        },
        {
          label: '添加人',
          prop: 'create_by',
          show: true
        },
        {
          label: '添加时间',
          prop: 'updateTime',
          show: true
        },
        {
          label: '说明',
          prop: 'remarks',
          show: true
        }
      ],
      tableData: [],
      multipleSelection: [],
      // 停用和使用模态框
      messageData: {
        show: false,
        title: '操作提醒',
        content: ''
      },
      statusRow: {},
      parkingId: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getEquipList()
    this.getParkingList()
    this.isAdminF()
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    isAdminF() {
      const userType = getUserType()
      const isAdmin = getAdminType()
      if (userType === 1 && isAdmin === 1) {
        this.isAdmiFlag = false
      }
    },
    getEquipList() {
      const params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        equipTypeName: this.equipTypeName ? this.equipTypeName : '',
        parkingId: this.parkingId ? this.parkingId : ''
      }
      serve.getEquipType(params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.rows
          this.total = res.data.data.totalCount
        }
      })
    },
    // 获取停车场
    getParkingList() {
      var userId = getUserId()
      const params = {
        userId: userId
      }
      serve.getParkingList(params).then(res => {
        if (res.data.code === 200) {
          var idArr = []
          const selectData = res.data.data
          var newData = selectData.map(item => {
            idArr.push(item.parkingId)
            return {
              value: item.parkingId,
              label: item.parkingName
            }
          })
          this.filterForm[1].options = newData
        }
      })
    },
    handleSearch(params) {
      this.equipTypeName = params.equipTypeName
      this.parkingId = params.parkingId
      this.getEquipList()
    },
    exportData() {},
    handleAddDialog(title, paramsData, flag) {
      // 1 查 2增 3编辑
      this.dialogTitle = title
      if (flag === 1 || flag === 3) {
        const params = {
          detailId: paramsData.equipTypeId
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
        this.messageData.content = '是否停用该设备？'
      } else {
        this.messageData.content = '是否启用该设备？'
      }
      this.statusRow = data
    },
    // 停用和使用
    handleModalShow() {
      this.loading = true
      const params = {
        equipTypeId: this.statusRow.equipTypeId,
        isStop: this.statusRow.status === 1
      }
      serve.useOrStop(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.$message.success('修改成功!')
          this.getEquipList()
        } else {
          this.loading = false
          this.$message.error(res.data.msg)
        }
      })
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val
      this.getEquipList()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getEquipList()
    },
    // 关闭模态框后的操作
    handleDialogShow(data) {
      this.dialogFormVisible.show = false
      this.getEquipList()
    }
  }
}
</script>

<style lang="scss" scoped>
.equip-type {
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
