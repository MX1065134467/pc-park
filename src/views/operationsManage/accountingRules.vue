<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch" @connect="connect">
        <div class="handle-btn" slot="operate">
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
              <el-button type="text" size="small" @click="operate(scope.row, '查看')">查看</el-button>
              <el-button :disabled="isDisabled" type="text" v-if="scope.row.status !== 1" size="small" @click="operate(scope.row, '编辑')">编辑</el-button>
              <el-button :disabled="isDisabled" type="text" style="color:#909399" v-if="scope.row.status === 0" size="small" @click="operate(scope.row, '启用')">启用</el-button>
              <el-button :disabled="isDisabled" type="text" style="color:#909399" v-if="scope.row.status === 1" size="small" @click="stopRule(scope.row, '停用')">停用</el-button>
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
    <reminder-modal @handleDialog="handleDialog" :message="modalMessage">
      <div slot="content">
          {{modalMessage.content}}
        </div>
    </reminder-modal>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import serve from '@/api/operationManage.api'
import { getUserInfo } from '@/common/cache.js'
export default {
  name: 'accountingRules',
  components: {
    SearchFilter,
    ReminderModal
  },
  data () {
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
          placeholder: '停车场管理公司',
          key: 'park',
          options: [],
          value: '',
          disabled: false
        },
        {
          type: 'select',
          label: '停车场名称',
          placeholder: '停车场',
          key: 'garage',
          options: [],
          value: ''
        },
        {
          type: 'input',
          label: '计费规则名称',
          placeholder: '',
          key: 'accountRules'
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
          prop: 'parkingGarageName',
          show: true
        },
        {
          label: '计费规则编号',
          prop: 'ruleId',
          show: true
        },
        {
          label: '计费规则名称',
          prop: 'ruleName',
          show: true
        },
        {
          label: '计费方式',
          prop: 'ruleWay_str',
          show: true
        },
        {
          label: '用户类型',
          prop: 'customerType_str',
          show: true
        },
        {
          label: '适用车型',
          prop: 'carTypeName',
          show: true
        },
        {
          label: '免费时长',
          prop: 'freeDura',
          show: true
        },
        {
          label: '计费上限',
          prop: 'chargeUpperLimit',
          show: true
        },
        {
          label: '计费规则',
          prop: 'chargeRule',
          show: true
        },
        {
          label: '状态',
          prop: 'statusStr',
          show: true
        }
      ],
      tableData: [],
      modalMessage: {
        title: '',
        show: false,
        content: ''
      },
      garage: [],
      ruleName: null,
      parkingId: null,
      garageId: null
    }
  },
  created() {
    this.getList()
    this.getParkingList()
  },
  methods: {
    async getList() {
      const params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        userId: getUserInfo().userId,
        ruleName: this.ruleName,
        parkingId: this.parkingId,
        garageId: this.garageId
      }
      this.loading = true
      const { data: res } = await serve.getAccountList(params)
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.rows
        this.total = res.data.totalCount
        this.tableData.map(item => {
          item.freeDura = `${item.freeDura}分钟`
          const mode = { 1: '时长', 2: '时段', 3: '按次', 4: '阶梯分段' }
          item.ruleWay_str = mode[item.ruleWay]
          item.statusStr = item.status === 1 ? '启用' : item.status === 0 ? '禁用' : ''
          item.showFreeDura = item.showFreeDura + '小时'
          item.chargeUpperLimit = item.chargeUpperLimit === 0 ? '不限' : `${item.chargeUpperLimit}元`
          item.customerType_str = item.customerType === 1 ? '临停用户' : ''
          // 计费规则
          const a = `每${item.unitHourValue1}小时${item.unitHourAmount1}元;每满${item.unitHourValue3}小时,上限${item.upperLimitAmount}元`
          const b = `每${item.unitHourValue1}小时${item.unitHourAmount1}元;每增加${item.unitHourValue2}小时,增加${item.unitHourAmount2}元;每满${item.unitHourValue3}小时上限${item.upperLimitAmount}元`
          const c = `每次${item.unitHourAmount4}元,每次${item.unitHourValue4}小时内；满${item.unitNumValue}次,上限${item.upperLimitAmount2}元`
          const d = `满${item.unitHourValue3}小时,上限${item.upperLimitAmount}元`
          item.chargeRule = item.ruleWay === 1 ? a : item.ruleWay === 2 ? b : item.ruleWay === 3 ? c : item.ruleWay === 4 ? d : ''
        })
      } else {
        this.loading = false
        this.$message.info(res.msg)
      }
    },
    // 获取停车场列表
    async getParkingList() {
      const userId = getUserInfo().userId
      const { data: response } = await serve.getParkList({ userId })
      if (response.code === 200) {
        response.data.map(item => {
          console.log(item)
          this.garage = [...this.garage, ...item.garageIdAndName]
          this.filterForm[0].options.push({ value: item.parkingId, label: item.parkingName })
        })
        // 平台账户只有一个停车场  直接显示并禁用
        if (this.filterForm[0].options.length <= 1) {
          this.filterForm[0].value = this.filterForm[0].options[0].value
          this.filterForm[0].disabled = true
          this.connect(this.filterForm[0].value)
        }
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
    // 停用计费规则
    stopRule (e, type) {
      console.log(e, 'stoprules')
      this.modalMessage.title = type
      this.modalMessage.show = true
      this.modalMessage.ruleId = e.ruleId
      this.modalMessage.content = `是否${type}该规则？`
    },
    // 搜索
    async handleSearch(obj) {
      this.ruleName = obj.accountRules
      this.parkingId = obj.park
      this.garageId = obj.garage

      await this.getList()
    },
    // 添加
    handleAddDialog() {
      this.$router.push({ path: '/operationsManage/accounting-rules/add', query: { type: '添加' } })
    },
    // tabel 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    handleSizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getList()
    },
    // bun 操作
    operate(row, type) {
      this.rowDetail = row
      const { ruleId, parkingGarageId } = row
      switch (type) {
        case '查看':
          this.$router.push({ path: '/operationsManage/accounting-rules/add', query: { ruleId: ruleId, type: '查看' } })
          break
        case '编辑':
          this.$router.push({ path: '/operationsManage/accounting-rules/add', query: { ruleId: ruleId, type: '编辑' } })
          break
        case '启用':
          this.modalMessage.title = type
          this.modalMessage.show = true
          this.modalMessage.status = 1
          this.modalMessage.ruleId = ruleId
          this.modalMessage.garageId = parkingGarageId
          this.modalMessage.content = `是否${type}该规则？`
          break
      }
    },
    handleDialog(msg) {
      console.log(msg, 'msg')
      if (msg.title === '停用') {
        const params = {
          ruleId: msg.ruleId
        }
        serve.stopRules(params).then(res => {
          if (res.data.code === 200) {
            this.getList()
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        const params = {
          ruleId: msg.ruleId,
          status: msg.status,
          garageId: msg.garageId,
          carType: this.rowDetail.carType
        }
        serve.updateStatus(params).then(res => {
          if (res.data.code === 200) {
            this.getList()
            this.$message.success(res.data.msg)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
