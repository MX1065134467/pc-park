<template>
  <div class="equip-manage">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch">
        <div class="handle-btn" slot="operate">
          <!-- <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
          <el-button size="small" v-if="isAdmiFlag" type="primary" icon="el-icon-edit" @click="handleAddDialog('添加','',2)">添加</el-button>
        </div>
      </search-filter>
      <div class="table-wrap">
        <el-table stripe border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align='center' type="selection">
          </el-table-column>
          <template v-for='(item, index) in tableHeaderData'>
            <el-table-column align='center' v-if="item.show" resizable show-overflow-tooltip :width="item.width" :key='index' :label='item.label' :prop='item.prop'></el-table-column>
          </template>
          <el-table-column align='center' prop="commonUse" label='状态' width="120">
            <template slot-scope="{row}">
              <span v-if="row.status ===1">使用</span>
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align='center' width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleAddDialog('查看', scope.row,1)">查看</el-button>
              <el-button type="text" size="small" @click="handleAddDialog('编辑', scope.row,3)" :disabled="!isAdmiFlag">编辑</el-button>
              <el-button type="text" size="small" @click="(scope.row)">
                <i class="stopClass" v-if="scope.row.status === 1" @click="stopOrStartUse(scope.row)" :disabled="!isAdmiFlag">停用</i>
                <i class="startClass" v-else @click="stopOrStartUse(scope.row)" :disabled="!isAdmiFlag">启用</i>
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
      <equip-manage-dialog v-bind:dialogVisible='dialogFormVisible' @handleDialog="handleDialogShow" :dialogFromData="dialogFromData" :dialogTitle="dialogTitle"></equip-manage-dialog>
    </div>
  </div>
</template>

<script>
import serve from '@/api/basicEquip.api'
import { getUserId, getAdminType, getUserType } from '@/common/cache'
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import EquipManageDialog from './dialog/EquipManageDialog'
export default {
  name: 'myCenter',
  components: {
    SearchFilter,
    ReminderModal,
    EquipManageDialog
  },
  props: {},
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      isAdmiFlag: true,
      // 添加的模态框是否显示
      dialogFormVisible: {
        show: false
      },
      // 编辑和详情 打开弹框的时候 携带的数据
      dialogFromData: {},
      filterForm: [
        {
          type: 'select',
          label: '设备名称',
          placeholder: '设备名称',
          key: 'equipTypeId',
          options: []
        },
        {
          type: 'cascader',
          label: '停车场',
          key: 'parkingId',
          options: []
        }
      ],
      // 表头
      tableHeaderData: [
        {
          label: '设备名称',
          prop: 'equipName',
          show: true
        },
        {
          label: '设备序列号',
          prop: 'equipSerial',
          show: true
        },
        {
          label: '所属公司',
          prop: 'parkingName',
          show: true
        },
        {
          label: '设备位置',
          prop: 'roadWayName',
          show: true
        },
        {
          label: '设备详细位置',
          prop: 'equipPosition',
          show: true
        },
        {
          label: '停车场',
          prop: 'garageName',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          show: false
        },
        {
          label: '添加人',
          prop: 'updateBy',
          show: true
        },
        {
          label: '添加时间',
          prop: 'updateTime',
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
      equipTypeId: '',
      parkingId: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getEquipTypeList()
    this.getParkingList()
    this.getEquipList()
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
    // 获取设备类型select框信息
    getEquipTypeList() {
      serve.getEquipTypeSelect().then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          const newData = data.map(item => {
            return {
              value: item.equipTypeId,
              label: item.equipName
            }
          })
          this.filterForm[0].options = newData
        }
      })
    },
    // 获取停车场
    getParkingList() {
      const userId = getUserId()
      const params = {
        userId: userId
      }
      serve.getParkingList(params).then(res => {
        if (res.data.code === 200) {
          var data = res.data.data
          var cascaderOptions = data.map(item => {
            var childrenList = []
            if (item.garageIdAndName && item.garageIdAndName.length !== 0) {
              childrenList = item.garageIdAndName.map(secondItem => {
                return {
                  value: secondItem.garageId,
                  label: secondItem.garageName
                }
              })
            }
            return {
              value: item.parkingId,
              label: item.parkingName,
              children: childrenList.length ? childrenList : []
            }
          })
          cascaderOptions.map(item => {
            if (item.children.length === 0) {
              delete item.children
            }
          })
          this.filterForm[1].options = cascaderOptions
        }
      })
    },
    // 获取设备列表
    getEquipList() {
      const params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        equipTypeId: this.equipTypeId ? this.equipTypeId : '',
        parkingId: this.parkingId ? this.parkingId : '',
        garageId: this.garageId ? this.garageId : ''
      }
      serve.getEquipList(params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.rows
          this.total = res.data.data.totalCount
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    handleSearch(params) {
      this.equipTypeId = params.equipTypeId
      if (params.parkingId) {
        this.parkingId = params.parkingId[0]
        this.garageId = params.parkingId[1]
      }
      this.getEquipList()
    },
    exportData() {},
    handleAddDialog(title, paramsData, flag) {
      console.log(title, paramsData, flag, 'title, paramsData, flag')
      // 1 查 2增 3编辑
      this.dialogTitle = title
      if (flag === 1 || flag === 3) {
        const params = {
          garageId: paramsData.garageId,
          detailId: paramsData.equipId
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
        this.messageData.content = '是否使用该设备？'
      }
      this.statusRow = data
    },
    // 停用和使用
    handleModalShow() {
      const params = {
        equip_id: this.statusRow.equipId,
        isStop: this.statusRow.status === 1
      }
      serve.equipStopOrUse(params).then(res => {
        if (res.data.code === 200) {
          this.$message.success('修改成功!')
          this.getEquipList()
        } else {
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
.equip-manage {
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
