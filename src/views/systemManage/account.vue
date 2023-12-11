<template>
  <div class='system-account'>
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
      <!-- 搜索条件 -->
      <search-filter :filter-form="filterForm" @searchData="handleSearch">
        <div class="handle-btn" slot="operate">
          <!-- <el-button type="primary" size="small" icon="el-icon-download" @click="exportData">导出</el-button> -->
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="handleAddDialog('添加账户')" :disabled="isDisabled">添加账户</el-button>
        </div>
      </search-filter>
      <!-- 表格数据 -->
      <div class="table-wrap">
        <el-table stripe border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" >
          <!-- :cell-style="tableCellStyle" -->
          <el-table-column resizable show-overflow-tooltip align='center' v-for='(item, index) in tableHeaderData' :key='index' :label='item.label' :prop='item.prop'>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align='center' width="200">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="viewAccount(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="handleAddDialog('编辑账户', scope.row)" :disabled="isDisabled">编辑</el-button>
              <el-button type="text" size="small" class="forbidden_btn" v-if="scope.row.status === 1 || scope.row.status === 3" @click="handleReminder(scope.row, '是否禁用该账户？', 0)" :disabled="isDisabled">禁用</el-button>
              <el-button type="text" size="small" class="green" v-if="scope.row.status === 0" @click="handleReminder(scope.row, '是否启用该账户？', 1)" :disabled="isDisabled">启用</el-button>
              <!-- <el-button type="text" size="small" class="forbidden_btn" v-if="scope.row.status === 2" @click="handleReminder(scope.row, '是否确定删除该账户？', 3)">删除</el-button> -->
              <el-button type="text" size="small" class="forbidden_btn"  @click="handleReminder(scope.row, '是否重置该账户密码？', 4)" :disabled="isDisabled">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="table.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="table.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="table.total">
        </el-pagination>
      </div>
    </div>
    <!-- 添加和编辑模态框 -->
    <div v-if="dialogFormVisible.show">
      <system-terminal-dialog v-bind:dialogVisible='dialogFormVisible' @handleDialog="handleDialogShow" :dialogFromData="dialogFromData"></system-terminal-dialog>
    </div>
    <!-- 停用和使用模态框 -->
    <div v-if="messageData.show">
      <reminder-modal @handleDialog="handleModalShow" v-bind:message="messageData">
        <div slot="content">
          {{messageData.content}}
        </div>
      </reminder-modal>
    </div>
    <!-- 查看 -->
    <div v-if="checkDialog.show">
      <account-view :checkDialogData="checkDialogData" :checkDialog="checkDialog" />
    </div>

  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import SystemTerminalDialog from './dialog/systemTerminalDialog'
import AccountView from './dialog/accountView'
import serve from '@/api/systemManage.api'
import moment from 'moment'
export default {
  name: 'account',
  components: {
    SearchFilter,
    ReminderModal,
    SystemTerminalDialog,
    AccountView
  },
  props: {},
  data() {
    return {
      loading: false,
      useInfo: {},
      table: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      tableParams: {
        pageNum: 1,
        pageSize: 10
      },
      isDisabled: false,
      // 搜索
      filterForm: [
        {
          type: 'input',
          label: '姓名',
          placeholder: '请输入姓名',
          key: 'name'
        },
        {
          type: 'input',
          label: '电话',
          placeholder: '请输入电话',
          key: 'telephone'
        }
      ],
      // 表头
      tableHeaderData: [
        {
          label: '账户类型',
          prop: 'user_type_name'
        },
        {
          label: '所属管理公司',
          prop: 'parking_name'
        },
        {
          label: '账户',
          prop: 'user_phone'
        },
        {
          label: '姓名',
          prop: 'user_name'
        },
        {
          label: '联系电话',
          prop: 'user_phone'
        },
        {
          label: '角色',
          prop: 'role_name'
        },
        {
          label: '添加时间',
          prop: 'create_time'
        },
        {
          label: '状态',
          prop: 'statusStr'
        }
      ],
      // 表格数据
      tableData: [],
      // 添加的模态框是否显示
      dialogFormVisible: {
        show: false,
        title: '',
        obj: ''
      },
      searchParams: '',
      // 停用和使用模态框
      messageData: {
        show: false,
        title: '操作提醒',
        content: '',
        flag: ''
      },
      // 详情 打开弹框的时候 携带的数据
      checkDialog: {
        show: false
      },
      checkDialogData: {}
    }
  },
  created() {
    this.useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.useInfo.isAdmin === 1 && this.useInfo.userType === 1) {
      this.isDisabled = true
    }
  },
  mounted() {
    this.getSystemAcountList()
  },
  methods: {
    // 表格的值
    getSystemAcountList() {
      // this.tableParams = {
      //   pageNum: this.table.currentPage,
      //   pageSize: this.table.pageSize,
      //   orgCode: getUserInfo().orgCode
      // }
      const params = {
        admin: false,
        pageNo: this.table.currentPage,
        pageSize: this.table.pageSize,
        userName: this.userName ? this.userName : '',
        userPhone: this.userPhone ? this.userPhone : ''
      }
      this.loading = true
      serve.getSystemAcountList(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.tableData = res.data.data.rows
          this.table.total = res.data.data.totalCount
          this.tableData.map(value => {
            value.loginTime = moment(value.loginTime).format(
              'YYYY-MM-DD hh:ss:mm'
            )
            value.createTime = moment(value.createTime).format(
              'YYYY-MM-DD hh:ss:mm'
            )
            value.statusStr =
              value.status === 1 ? '正常' : value.status === 2 ? '禁用' : '锁定'
          })
        }
      })
    },
    // tableCellStyle(row, rowIndex, column) {
    //   if (row.row.parking_name === '阳阳得停车管理公司' && row.columnIndex === 5) {
    //     return 'text-decoration:underline;'
    //   }
    // },

    // 搜索传过来的值
    handleSearch(params) {
      console.log(params)
      this.userName = params.name
      this.userPhone = params.telephone
      this.getSystemAcountList()
    },
    viewAccount(data) {
      this.checkDialog.show = true
      const params = {
        userId: data.user_id
      }
      this.checkDialogData = params
    },
    // 添加模态框
    handleAddDialog(title, paramsData) {
      if (paramsData) {
        this.dialogFromData = paramsData
      } else {
        this.dialogFromData = {}
      }
      this.dialogFormVisible = {
        title: title,
        show: true
      }
    },
    // 关闭模态框后的操作
    handleDialogShow(data) {
      this.getSystemAcountList()
    },
    // 停用和使用的模态框
    handleReminder(data, content, flag) {
      // console.log(data)
      this.messageData.show = true
      this.messageData.content = content
      this.messageData.tableData = data
      this.messageData.flag = flag
      this.statusRow = data
    },
    // 停用和使用
    handleModalShow() {
      if (this.messageData.flag === 0 || this.messageData.flag === 1) {
        const params = {
          isStop: this.statusRow.status === 1,
          userId: this.statusRow.user_id
        }
        serve.stopOrUseAccount(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改成功!')
            this.getSystemAcountList()
          }
        })
      }
      const obj = {
        userId: this.messageData.tableData.user_id
      }
      if (this.messageData.flag === 3) {
        obj.status = this.messageData.tableData.status
        // serve.getDelSystemAcount(obj).then(res => {
        //   this.hanldeResposeData(res, '删除')
        // })
      } else if (this.messageData.flag === 4) {
        // obj.status =
        //   this.messageData.flag === 1 ? (obj.status === 1 ? 3 : 2) : 1
        serve.getAssets(obj).then(res => {
          this.hanldeResposeData(res, '修改状态')
        })
      }
    },
    hanldeResposeData(res, message) {
      if (res.data.code === 200) {
        this.dialogFormVisible.show = false
        this.$message({
          message: res.data.msg ? res.data.msg : message + '成功',
          type: 'success'
        })
        this.getSystemAcountList()
      } else {
        this.$message.error(res.data.msg ? res.data.msg : message + '失败')
      }
    },
    // 每页多少条
    handleSizeChange(val) {
      this.table.pageSize = val
      this.getSystemAcountList()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.table.currentPage = val
      this.getSystemAcountList()
    },
    // 导出
    exportData() {}
  }
}
</script>

<style lang='scss' scoped>
  .houseTypeClass {
    background-color: blue;
  }
</style>
