<template>
  <div class="container">
    <div
      class="ticket-wrap"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
    >
      <search-filter
        :filter-form="filterForm"
        @searchData="handleSearch"
      >
        <div class="handle-btn" slot="operate">
          <el-button size="small" type="primary" icon="el-icon-download" @click="exportList"
            >导出</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="handleAddDialog"
            >添加</el-button
          >
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
          <el-table-column align="center" type="selection"> </el-table-column>
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
              <el-button
                type="text"
                size="small"
                @click="stopOrStartUse(scope.row, '明细')"
                >明细</el-button
              >
              <el-button
                type="text"
                size="small"
                class="stopClass"
                @click="stopOrStartUse(scope.row, '详情')"
                >详情</el-button
              >
              <el-button
                type="text"
                size="small"
                class="remove_btn"
                v-if="scope.row.status === 0"
                @click="stopOrStartUse(scope.row, '启用')"
                >启用</el-button
              >
              <el-button
                type="text"
                size="small"
                class="remove_btn"
                v-if="scope.row.status === 1"
                @click="stopOrStartUse(scope.row, '停用')"
                >停用</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 停用和使用模态框 -->
    <reminder-modal
      @handleDialog="handleModalShow"
      v-bind:message="modalMessage"
    >
      <div slot="content">
        {{ modalMessage.content }}
      </div>
    </reminder-modal>
    <!-- 查看详情的dialog -->
    <el-dialog
      title="详情"
      :visible.sync="checkDialog"
      class="check_dialog"
      :close-on-click-modal="false"
    >
      <ul class="check_content">
        <li>
          <span>停车场名称: {{detailInfo.garageIdName}}</span>
          <span>免费卡名称：{{detailInfo.cardName}}</span>
          <span>发行数量（张）：{{detailInfo.count}}</span>
        </li>
        <li>
          <span>有效期：{{this.validityTime}}</span>
          <span>添加时间：{{detailInfo.createTime}}</span>
          <span>添加人：{{detailInfo.createBy}}</span>
        </li>
        <li>
          <span>状态：{{detailInfo.status === 1 ? '启用' : detailInfo.status === 0 ? '停用' : '已过期'}}</span>
        </li>
        <li><span>说明：{{detailInfo.desc}}</span></li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import serve from '@/api/operationManage.api'
import { getUserInfo } from '@/common/cache.js'
import { downloadFile, timeFormat } from '@/utils/util'

export default {
  name: 'whiteListFree',
  components: { SearchFilter, ReminderModal },
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      checkDialog: false, // 查看 dialog
      filterForm: [
        {
          type: 'select',
          label: '停车场名称',
          placeholder: '停车场名称',
          key: 'garage',
          options: [],
          value: ''
        },
        {
          type: 'input',
          label: '免费卡名称',
          placeholder: '请输入免费卡名称',
          key: 'cardName'
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
              value: '1',
              label: '启用'
            },
            {
              value: '0',
              label: '停用'
            },
            {
              value: '2',
              label: '已过期'
            }
          ],
          value: null
        }
      ],
      tableHeaderData: [
        {
          label: '停车场名称',
          prop: 'garageIdName',
          show: true
        },
        {
          label: '编号',
          prop: 'no',
          show: true
        },
        {
          label: '免费卡名称',
          prop: 'cardName',
          show: true
        },
        {
          label: '数量',
          prop: 'count',
          show: true
        },
        {
          label: '说明',
          prop: 'desc',
          show: true
        },
        {
          label: '有效期',
          prop: 'validity',
          show: true
        },
        {
          label: '添加人',
          prop: 'createBy',
          show: true
        },
        {
          label: '添加时间',
          prop: 'createTime',
          show: true
        },
        {
          label: '状态',
          prop: 'statusStr',
          show: true
        }
      ],
      tableData: [],
      garage: [], // 车库数据
      modalMessage: {
        title: '',
        show: false,
        content: ''
      },
      cardName: '',
      detailInfo: {},
      garageId: null,
      parkingId: null,
      status: null,
      validityTime: ''
    }
  },
  created() {
    this.getParkingList()
    this.getWhiteFreeCard()
  },
  methods: {
    // 获取白名单列表
    async getWhiteFreeCard() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        cardName: this.cardName,
        garageId: this.garageId,
        status: this.status
        // userId: getUserInfo().userId
      }
      const { data: res } = await serve.getWhiteFreeCard(params)
      this.loading = true
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.rows
        this.total = res.data.totalCount
        this.tableData.map(item => {
          if (item.beginDate === null && item.endDate === null) {
            item.validity = '长期有效'
          } else {
            item.validity = `${timeFormat(item.beginDate, 'yyyy-mm-dd')} 至 ${timeFormat(item.endDate, 'yyyy-mm-dd')}`
          }
          item.statusStr = item.status === 1 ? '启用' : item.status === 0 ? '停用' : item.status === 2 ? '已过期' : ''
        })
      } else {
        this.loading = false
      }
    },
    // 获取停车场列表
    async getParkingList() {
      const userId = getUserInfo().userId
      const { data: response } = await serve.getParkList({ userId })
      if (response.code === 200) {
        response.data.map(item => {
          this.garage = [...this.garage, ...item.garageIdAndName]
        })
        this.filterForm[0].options = []
        this.garage.map(item => {
          const obj = {
            value: item.garageId,
            label: item.garageName
          }
          this.filterForm[0].options.push(obj)
          this.filterForm[0].value = null
        })
      }
    },
    // 查看
    stopOrStartUse(row, type) {
      const params = {
        id: row.onceMasterId
      }
      switch (type) {
        case '详情':
          this.validityTime = row.validity
          console.log(row)
          serve.outDetail(params).then(res => {
            if (res.data.code === 200) {
              console.log(res.data.data)
              this.detailInfo = res.data.data
            }
          })
          this.checkDialog = true
          break
        case '启用':
          this.modalMessage.title = type
          this.modalMessage.show = true
          this.modalMessage.content = '是否启用该免费卡?'
          this.modalMessage.id = row.onceMasterId
          this.modalMessage.status = row.status === 1 ? 0 : 1
          break
        case '停用':
          this.modalMessage.title = type
          this.modalMessage.show = true
          this.modalMessage.content = '是否停用该免费卡?'
          this.modalMessage.id = row.onceMasterId
          this.modalMessage.status = row.status === 1 ? 0 : 1
          break
        case '明细':
          this.$router.push({
            path: '/operationsManage/white-order-list',
            query: { row: row }
          })
          sessionStorage.setItem('whiteList', JSON.stringify(row))
      }
    },
    // 跳转到添加
    handleAddDialog() {
      this.$router.push({
        path: '/operationsManage/white-list-free/add',
        query: { type: '添加' }
      })
    },
    // 停用启用接口联调
    handleModalShow(msg) {
      const params = {
        id: msg.id,
        status: msg.status
      }
      serve.outStatus(params).then(res => {
        if (res.data.code === 200) {
          console.log(res.data)
          this.getWhiteFreeCard()
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    exportList() {
      const arrList = []
      this.multipleSelection.map((item) => {
        arrList.push(item.onceMasterId)
      })
      const params = {
        cardName: this.cardName,
        ids: arrList,
        status: this.status,
        garageId: this.garageId
      }
      serve.exportExcel(params).then(res => {
        console.log(res)
        if (res.status === 200) {
          downloadFile(res.data, '免费卡名单')
        }
      })
    },
    // 搜索
    async handleSearch(obj) {
      console.log(obj)
      this.garageId = obj.garage
      this.cardName = obj.cardName
      this.status = obj.parkType
      await this.getWhiteFreeCard()
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getWhiteFreeCard()
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.getWhiteFreeCard()
    },
    // tabel 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    cancel() {
      this.checkDialog = false
      //   this.checkData = {}
    }
  }
}
</script>

<style scoped lang="scss">
.remove_btn {
  color: #606266;
}
.stopClass {
  color: red;
}
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
  }
}
</style>
