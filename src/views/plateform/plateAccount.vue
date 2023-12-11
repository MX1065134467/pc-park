<template>
  <div class="plate-account">
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
          <el-table-column align='center' prop="user_type" label='账户类型'>
            <template slot-scope="{row}">
              <span v-if="row.user_type ===1">平台</span>
              <span v-else-if="row.user_type ===2">停车场</span>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="status" label='状态'>
            <template slot-scope="{row}">
              <span v-if="row.status ===1">启用</span>
              <span v-else-if="row.status ===0">停用</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align='center' width="200">
            <template slot-scope="scope">
              <el-button @click="resetPassword(scope.row)" type="text" size="small">重置密码</el-button>
              <el-button @click="handleAddDialog('查看', scope.row,1)" type="text" size="small">查看</el-button>
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
      <plate-account-dialog v-bind:dialogVisible='dialogFormVisible' @handleDialog="handleDialogShow" :dialogFromData="dialogFromData" :dialogTitle="dialogTitle"></plate-account-dialog>
    </div>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import PlateAccountDialog from './dialog/PlateAccountDialog'
import serve from '@/api/plateform.api'
import servePswd from '@/api/systemManage.api'
export default {
  name: 'myCenter',
  components: {
    SearchFilter,
    ReminderModal,
    PlateAccountDialog
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
      filterForm: [
        {
          type: 'input',
          label: '姓名',
          placeholder: '姓名',
          key: 'userName'
        },
        {
          type: 'input',
          label: '电话',
          placeholder: '电话',
          key: 'userPhone'
        }
      ],
      // 表头
      tableHeaderData: [
        {
          label: '账户',
          prop: 'user_phone',
          show: true
        },
        {
          label: '姓名',
          prop: 'user_name',
          show: true
        },
        {
          label: '电话',
          prop: 'user_phone',
          show: true
        },
        {
          label: '密码',
          prop: 'password',
          show: true
        },
        {
          label: '账户类型',
          prop: 'user_type',
          show: false
        },
        {
          label: '停车场管理公司',
          prop: 'parking_name',
          show: true
        },
        {
          label: '状态',
          prop: 'status',
          show: false
        },
        {
          label: '创建时间',
          prop: 'create_time',
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
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getPlateList()
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    getPlateList() {
      this.loading = true
      const params = {
        admin: true,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        userName: this.userName ? this.userName : '',
        userPhone: this.userPhone ? this.userPhone : ''
      }
      serve.getPlateList(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.tableData = res.data.data.rows
          this.tableData.map(item => {
            item.password = '******'
          })
          this.total = res.data.data.totalCount
        }
      })
    },
    handleSearch(params) {
      this.userName = params.userName
      this.userPhone = params.userPhone
      this.getPlateList()
    },
    // 导出
    exportData() {},
    handleAddDialog(title, paramsData, flag) {
      // 1 查 2增 3编辑
      this.dialogTitle = title
      if (flag === 1 || flag === 3) {
        const params = {
          detailId: paramsData.user_id
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
        this.messageData.content = '是否停用该账户？'
      } else {
        this.messageData.content = '是否启用该账户？'
      }
      this.statusRow = data
    },
    // 停用和使用
    handleModalShow() {
      this.loading = true
      // 接口
      const params = {
        isStop: this.statusRow.status === 1,
        userId: this.statusRow.user_id
      }
      serve.stopOrUseAccount(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.$message.success('修改成功!')
          this.getPlateList()
        } else {
          this.loading = false
          this.$message.error(res.data.msg)
        }
      })
    },
    resetPassword(row) {
      this.$confirm('确认重置此账户密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        const params = {
          userId: row.user_id
        }
        servePswd.getAssets(params).then(res => {
          if (res.data.code === 200) {
            this.loading = false
            this.$message.success('重置成功!')
            this.getPlateList()
          } else {
            this.loading = false
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val
      this.getPlateList()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getPlateList()
    },
    // 关闭模态框后的操作
    handleDialogShow(data) {
      this.getPlateList()
    }
  }
}
</script>

<style lang="scss" scoped>
.plate-account {
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
