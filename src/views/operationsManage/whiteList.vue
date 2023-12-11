<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch" @connect="connect">
        <div class="handle-btn" slot="operate">
          <el-button size="small" type="primary" icon="el-icon-download" @click="downloadExcel">下载导入模板</el-button>
          <!-- <el-button size="small" type="primary" icon="el-icon-upload2" @click="readExcel">导入</el-button> -->
          <el-button :disabled="isDisabled" size="small" type="danger" icon="el-icon-delete" @click="deleteData">移除</el-button>
          <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button>
          <el-button :disabled="isDisabled" size="small" type="primary" icon="el-icon-edit" @click="handleAddDialog('添加')">添加</el-button>
        </div>
      </search-filter>
      <div style="margin-left:20px;">
        <el-upload
            :disabled="isDisabled"
            class="upload-demo"
            :action="actionUrl"
            accept=".xls,.xlsx"
            :headers="headers"
            :file-list="fileList"
            :on-change="handleChange"
            :on-success="handleAvatarSuccess"
            :show-file-list="false">
            <el-button size="small" type="primary" icon="el-icon-upload2" :disabled="isDisabled">导入</el-button>
        </el-upload>
      </div>
      <div class="table-wrap">
        <el-table stripe border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column align='center' type="selection" :selectable="checkSelectable">
          </el-table-column>
          <template v-for='(item, index) in tableHeaderData'>
            <el-table-column align='center' v-if="item.show" resizable show-overflow-tooltip :width="item.width" :key='index' :label='item.label' :prop='item.prop'></el-table-column>
          </template>
          <el-table-column fixed="right" label="操作" align='center'>
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="stopOrStartUse(scope.row, '查看')">查看</el-button>
              <el-button :disabled="isDisabled" type="text" size="small" class="stopClass" v-if="scope.row.status === 1" @click="stopOrStartUse(scope.row, '限制')">限制</el-button>
              <el-button :disabled="isDisabled" type="text" size="small" class="delay_btn" v-if="scope.row.status === 2 && scope.row.vipType !== 3" @click="stopOrStartUse(scope.row, '延时')">延时</el-button>
              <el-button :disabled="isDisabled" type="text" size="small" class="delay_btn" v-if="scope.row.status === 3" @click="stopOrStartUse(scope.row, '恢复')">恢复</el-button>
              <el-button :disabled="isDisabled" type="text" size="small" class="remove_btn" v-if="scope.row.status === 1 || scope.row.status === 3 || scope.row.status === 2" @click="stopOrStartUse(scope.row, '移除')">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20,30,40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <addWhiteList v-if="dialogData.isShow" :dialogData.sync="dialogData" @confirmDialog="confirmDialog"></addWhiteList>
    <!-- 查看 dialog -->
    <el-dialog title="查看" :visible.sync="checkDialog" class="check_dialog" :close-on-click-modal="false">
      <ul class="check_content">
        <li>
          <span>停车场名称: {{checkData.garageStr}}</span>
          <span>车牌号：{{checkData.carNo}}</span>
          <span>名单类型：{{checkData.vipTypeStr}}</span>
        </li>
        <li>
          <span>姓名：{{checkData.userName}}</span>
          <span>电话：{{checkData.userPhone}}</span>
          <span>添加人：{{checkData.createBy}}</span>
        </li>
        <li>
          <span>添加时间：{{checkData.createTime}}</span>
          <span>状态：{{checkData.statusStr}}</span>
          <span>操作时间：{{checkData.updateTime}}</span>
        </li>
        <li><span>有效时间：{{checkData.beginTime}} 至 {{checkData.endTime}}</span><span>操作人：{{checkData.updateBy}}</span><span></span> </li>
        <li><span>车辆信息：{{checkData.cardBrand}} {{checkData.cardModel}} {{checkData.cardColor}}</span></li>
        <li>
          <el-image style="width: 160px; height: 100px; border-radius: 4px"
            v-for="(url, index) in srcList"
            :key="index + url"
            :src="url"
            :preview-src-list="srcList">
          </el-image>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 限制？解除限制 -->
    <reminder-modal @handleDialog="handleDialog" :message="modalMessage">
      <div slot="content">
          {{modalMessage.content}}
        </div>
    </reminder-modal>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import addWhiteList from './dialog/addWhiteList'
import ReminderModal from '@c/ReminderModal'
import serve from '@/api/operationManage.api'
import { getUserInfo, getToken } from '@/common/cache.js'
import { timeFormat, downloadFile } from '@/utils/util.js'
export default {
  name: 'white',
  components: { SearchFilter, addWhiteList, ReminderModal },
  data () {
    const { isAdmin, userType } = JSON.parse(sessionStorage.getItem('userInfo'))
    const token = getToken()
    return {
      fileList: [],
      currentlicensesType: 1,
      actionUrl: '/park-core/v1.0/ParkVipInfo/import',
      headers: { Authorization: token },
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
          type: 'select',
          label: '状态',
          placeholder: '状态',
          key: 'parkType',
          options: [
            {
              value: null,
              label: '全部'
            },
            {
              value: '0',
              label: '移除'
            },
            {
              value: '1',
              label: '正常'
            },
            {
              value: '2',
              label: '过期'
            },
            {
              value: '3',
              label: '限制'
            }
          ],
          value: null
        }
      ],
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '停车场管理公司',
          prop: 'parkingIdStr',
          show: true
        },
        {
          label: '停车场名称',
          prop: 'garageStr',
          show: true
        },
        {
          label: '姓名',
          prop: 'userName',
          show: true
        },
        {
          label: '车牌号',
          prop: 'carNo',
          show: true
        },
        {
          label: '白名单类型',
          prop: 'vipTypeStr',
          show: true
        },
        {
          label: '申报渠道',
          prop: 'channelTypeStr',
          show: true
        },
        {
          label: '状态',
          prop: 'statusStr',
          show: true
        },
        {
          label: '有效期',
          prop: 'validity',
          show: true
        },
        {
          label: '添加时间',
          prop: 'createTime',
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
      modalMessage: {
        title: '',
        show: false,
        content: ''
      },
      garage: [], // 车库数据
      childrenParking: [],
      parkingId: null,
      garageId: null,
      carNo: null,
      status: null
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
    handleChange(file, fileList) {
      this.fileList = fileList
      // var param = new FormData()
      // this.fileList.forEach(
      //   (val, index) => {
      //     param.append('file', val.raw)
      //   }
      // )
      // serve.importParkVipInfo(param).then(res => {
      //   console.log(res, 5522, res.data)
      //   this.fileList = []
      // })
    },
    handleAvatarSuccess(res) {
      if (res.code === 200) {
        if (res.data.errorIndexList.length === 0) {
          this.$message.success(`总共导入${res.data.totalCount}条数据,成功${res.data.successCount}条,失败${res.data.errorCount}条`)
        } else {
          this.$message.success(`总共导入${res.data.totalCount}条数据,成功${res.data.successCount}条,失败${res.data.errorCount}条,失败行数${res.data.errorIndexList}行`)
        }
      } else {
        this.$message.error(res.msg)
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
        // console.log(response.data, 'response', this.filterForm[0].options.length)
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
    // 获取列表
    async getList() {
      const params = {
        parkingId: this.parkingId,
        garageId: this.garageId,
        carNo: this.carNo,
        status: this.status,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        userId: getUserInfo().userId
      }
      const { data: res } = await serve.getList(params)
      this.loading = true
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.rows && res.data.rows
        this.total = res.data.totalCount
        this.tableData.map(item => {
          item.validity = `${item.beginTime} - ${item.endTime}`
        })
      } else {
        this.loading = false
      }
    },
    // 搜索
    handleSearch(obj) {
      this.parkingId = obj.park
      this.garageId = obj.garage
      this.carNo = obj.carNum
      this.status = obj.parkType

      this.getList()
    },
    // 导入
    readExcel() {
    },
    // 移除
    deleteData() {
      if (!this.multipleSelection.length) return this.$message.info('请选择移除名单!')
      const removeArr = []
      this.multipleSelection.map(v => {
        const obj = {
          status: 0,
          vipId: v.vipId,
          updateBy: getUserInfo().userName
        }
        removeArr.push(obj)
        this.modalMessage.title = '批量移除'
        this.modalMessage.show = true
        this.modalMessage.content = '是否从白名单中移除该车主？'
        this.modalMessage.removeList = removeArr
      })
    },
    downloadExcel() {
      serve.downloadExcels().then(res => {
        if (res.status === 200) {
          downloadFile(res.data, 'vip白名单导入模板')
        }
      })
    },
    // 导出
    exportData() {
      const arrList = []
      this.multipleSelection.map((item) => {
        arrList.push(item.vipId)
      })
      const params = {
        parkingId: this.parkingId,
        garageId: this.garageId,
        carNo: this.carNo,
        status: this.status,
        ids: arrList,
        userId: getUserInfo().userId
      }
      serve.ParkVipInfo(params).then((res) => {
        if (res.status === 200) {
          downloadFile(res.data, '白名单名单')
        }
      })
    },
    // 添加
    handleAddDialog(title) {
      this.dialogData.title = title
      this.dialogData.parkingList = this.childrenParking
      this.dialogData.isShow = true
    },
    // 限制
    limited(row, type) {
      this.modalMessage.title = type
      this.modalMessage.show = true
      this.modalMessage.content = `是否从白名单中${type}该车主？`
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
    // 修改状态弹框 确定按钮
    handleDialog(val) {
      if (val.title === '批量移除') {
        serve.removeList(val.removeList).then(res => {
          if (res.data.code === 200) {
            this.$message.success('批量移除成功')
            this.getList()
          }
        })
      } else {
        const params = {
          vipId: val.vipId,
          status: val.changeIdx,
          updateBy: getUserInfo().userName
        }
        serve.updataStatus(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改状态成功')
            this.getList()
          }
        })
      }
    },
    stopOrStartUse(row, type) {
      this.rowDetail = row
      const vipId = row.vipId
      const idx = ['移除', '正常', '过期', '限制'].indexOf(type)
      switch (type) {
        case '查看':
          serve.checkDetail(vipId).then(res => {
            if (res.data.code === 200) {
              this.checkData = res.data.data
              console.log(this.checkData, 'this.checkData')
              this.checkData.beginTime = timeFormat(this.checkData.beginTime, 'yyyy-mm-dd')
              this.checkData.endTime = timeFormat(this.checkData.endTime, 'yyyy-mm-dd')
              this.srcList = this.checkData.sysFileInfoList.map(v => this.IMAGEURL + v)
            }
          })
          this.checkDialog = true
          break
        case '限制':
          this.modalMessage.title = type
          this.modalMessage.show = true
          this.modalMessage.content = '是否从白名单中暂时限制该车主？'
          this.modalMessage.vipId = vipId
          this.modalMessage.changeIdx = idx
          break
        case '延时':
          this.dialogData.title = type
          this.dialogData.vipId = vipId
          this.dialogData.isShow = true
          this.dialogData.info = row
          break
        case '恢复':
          this.modalMessage.title = type
          this.modalMessage.show = true
          this.modalMessage.content = '是否从白名单中解除该车主限制？'
          this.modalMessage.vipId = vipId
          this.modalMessage.changeIdx = 1
          break
        case '移除':
          this.modalMessage.title = type
          this.modalMessage.show = true
          this.modalMessage.content = '是否从白名单中移除该车主？'
          this.modalMessage.vipId = vipId
          this.modalMessage.changeIdx = idx
      }
    },
    confirmDialog() {
      this.dialogData.isShow = false
      this.getList()
    },
    checkSelectable(row) {
      if (row.statusStr !== '移除') return true
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
