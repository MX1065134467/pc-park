<template>
  <div class="park-manage">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch">
        <div class="handle-btn" slot="operate">
          <!-- <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
          <el-button size="small" v-if="isAdmiFlag" type="primary" icon="el-icon-edit" @click="handleAddDialog('新建车库','',2)">添加</el-button>
        </div>
      </search-filter>
      <div class="table-wrap">
        <el-table v-loading="loading" stripe border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align='center' type="selection">
          </el-table-column>
          <template v-for='(item, index) in tableHeaderData'>
            <el-table-column align='center' v-if="item.show" resizable show-overflow-tooltip :width="item.width" :key='index' :label='item.label' :prop='item.prop'></el-table-column>
          </template>
          <el-table-column align='center' prop="garageType" label='车库类型' width="120">
            <template slot-scope="{row}">
              <span v-if="row.garageType ===1">平面多车位</span>
              <span v-if="row.garageType ===2">多层多车位</span>
              <span v-if="row.garageType ===3">立体机械升降</span>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="status" label='状态' width="120">
            <template slot-scope="{row}">
              <span v-if="row.status ===1">正常</span>
              <span v-else-if="row.status ===0">停运</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align='center' width="200" v-if="isAdmiFlag">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="managePark(scope.row)">管理车位</el-button>
              <el-button type="text" size="small"  v-if="Number(scope.row.joinType) !== 0" @click="asyncData(scope.row)">同步</el-button>
              <el-button type="text" size="small" v-if="scope.row.status === 0" @click="handleAddDialog('编辑车库', scope.row, 3)">编辑</el-button>
              <el-button type="text" size="small" @click="generate(scope.row, 4)">生成二维码</el-button>
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
    <!-- 二维码展示 -->
    <el-dialog :visible.sync="dialogVisibleds"  width="20%">
      <vue-qr :text="qrCode" :size="200" ></vue-qr>
    </el-dialog>
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
import vueQr from 'vue-qr'
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import ParkingManageDialog from './dialog/EquipTypeDialog'
import serve from '@/api/basicEquip.api'
import { getUserId, getAdminType, getUserType } from '@/common/cache'
export default {
  name: 'myCenter',
  components: {
    SearchFilter,
    ReminderModal,
    ParkingManageDialog,
    vueQr
  },
  props: {},
  data() {
    return {
      qrCode: '', // 二维码
      dialogVisibleds: false,
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
          label: '停车场管理公司',
          placeholder: '停车场管理公司',
          key: 'parkingId',
          options: [],
          disabled: false,
          value: ''
        },
        {
          type: 'input',
          label: '停车场名称',
          placeholder: '停车场名称',
          key: 'garageName'
        },
        {
          type: 'select',
          label: '车库类型',
          placeholder: '车库类型',
          key: 'garageType',
          options: [
            {
              value: '',
              label: '全部'
            },
            {
              value: '1',
              label: '平面多车位'
            },
            {
              value: '2',
              label: '多层多车位'
            },
            {
              value: '3',
              label: '立体机械升降'
            }
          ],
          value: ''
        }
      ],
      // 表头
      tableHeaderData: [
        {
          label: '停车场管理公司',
          prop: 'parkingName',
          show: true
        },
        {
          label: '车场编号',
          prop: 'numbering',
          show: true
        },
        {
          label: '停车场名称',
          prop: 'garageName',
          show: true
        },
        {
          label: '车库类型',
          prop: 'garageType',
          show: false
        },
        {
          label: '车位数总数',
          prop: 'parkingCount',
          show: true
        },
        {
          label: '可用车位',
          prop: 'parkingAvailable',
          show: true
        },
        {
          label: '公共车位',
          prop: 'parkingPublic',
          show: true
        },
        {
          label: '私人车位',
          prop: 'parkingPrivate',
          show: true
        },
        {
          label: '状态',
          prop: 'status'
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
      parkingId: '',
      userIdList: []
    }
  },
  computed: {},
  watch: {},
  created() {
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
          this.userIdList = idArr
          this.filterForm[0].options = newData
          const userType = getUserType()
          if (userType === 2) {
            this.filterForm[0].disabled = true
            this.filterForm[0].value = newData[0].value
          }
          this.parkingId = newData[0].parkingId
          this.getParkGarageList()
        }
      })
    },
    getParkGarageList() {
      const params = {
        garageId: [],
        garageName: this.garageName ? this.garageName : '',
        garageType: this.garageType ? this.garageType : '',
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        parkingId: null,
        userIdList: this.userIdList,
        userId: getUserId()
      }
      serve.getParkGarageList(params).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.rows
          this.total = res.data.data.totalCount
        }
      })
    },
    handleSearch(params) {
      if (params.parkingId) {
        this.userIdList = []
        this.userIdList.push(params.parkingId)
      } else {
        this.userIdList.push(params.parkingId)
      }
      this.garageName = params.garageName
      this.garageType = params.garageType
      this.getParkGarageList()
    },
    exportData() {},
    managePark(row) {
      this.$router.push({
        path: '/basicFacility/manage-park',
        query: {
          garageId: row.garageId
        }
      })
    },
    handleAddDialog(title, paramsData, flag) {
      this.$router.push({
        path: '/basicFacility/parkManagePage',
        query: {
          name: title,
          garageId: paramsData && paramsData.garageId ? paramsData.garageId : ''
        }
      })
    },
    // 选中表单
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 停用和使用的模态框
    stopOrStartUse(data) {
      this.messageData.show = true
      if (data.status === 1) {
        this.messageData.content = '是否停用该停车库？'
      } else {
        this.messageData.content = '是否启用该停车库？'
      }
      this.statusRow = data
    },
    // 停用和使用
    handleModalShow() {
      // 接口
      const params = {
        garageId: this.statusRow.garageId,
        status: this.statusRow.status === 0 ? 1 : 0
      }
      serve.stopOrUse(params).then(res => {
        if (res.data.code === 200) {
          this.$message.success('修改成功!')
          this.getParkGarageList()
        }
      })
    },
    // 同步
    asyncData(row) {
      if (Number(row.joinType) === 0) {
        this.$message.error('请填写设备对应Ip和端口号!')
        return
      }
      this.loading = true
      const params = {
        garageId: row.garageId
      }
      serve.asyncData(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.$message.success('同步成功!')
          this.getParkGarageList()
        } else {
          this.loading = false
          this.$message.error(res.data.msg)
        }
      })
    },
    // 生成二维码
    generate(row) {
      const params = {
        garageId: row.garageId
      }
      serve.getGenerate(params).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.dialogVisibleds = true
          this.$message.success('生成二维码成功!')
          this.qrCode = res.data.data
        }
        console.log(this.qrCode)
      })
    },
    // 每页多少条
    handleSizeChange(val) {
      this.pageSize = val
      this.getParkGarageList()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.currentPage = val
      this.getParkGarageList()
    },
    // 关闭模态框后的操作
    handleDialogShow(data) {
      this.getParkGarageList()
    }
  }
}
</script>

<style lang="scss" scoped>
.park-manage {
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
  ::v-deep .el-dialog__header {
    border-bottom: none;
  }
  ::v-deep .el-dialog__body img{
    margin-left: 50px;
  }
}

</style>
