<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
      element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch" @connect="connect">
        <div class="handle-btn" slot="operate">
          <el-button :disabled="isDisabled" size="small" type="primary" icon="el-icon-edit" @click="addCard">添加</el-button>
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
              <el-button type="text" size="small" @click="handleOptines(scope.row, '查看')">查看</el-button>
              <el-button :disabled="isDisabled" type="text" size="small" class="btn_edit" @click="handleOptines(scope.row, '编辑')">编辑</el-button>
              <el-button :disabled="isDisabled" type="text" size="small" class="btn_check" v-if="scope.row.status === 1" @click="handleOptines(scope.row, '停售')">停售</el-button>
              <el-button :disabled="isDisabled" type="text" size="small" class="btn_stop" v-if="scope.row.status === 0 && scope.row.isShow" @click="handleOptines(scope.row, '起售')">起售</el-button>
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
import serve from '@/api/operationManage.api'
import { getUserInfo } from '@/common/cache.js'
import ReminderModal from '@c/ReminderModal'
import { timeFormat } from '@/utils/util.js'
export default {
  name: 'parkingCard',
  components: { SearchFilter, ReminderModal },
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
          type: 'select',
          label: '车位卡类型',
          key: 'parkType',
          options: [
            {
              value: null,
              label: '全部'
            },
            {
              value: '1',
              label: '包天卡'
            },
            {
              value: '2',
              label: '次数卡'
            },
            {
              value: '3',
              label: '时长卡'
            }
          ],
          value: null
        },
        {
          type: 'input',
          label: '车位卡名称',
          placeholder: '请输入车位卡名称',
          key: 'cardName'
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
          label: '车位卡类型',
          prop: 'parkingCardType',
          show: true
        },
        {
          label: '车位卡编号',
          prop: 'cardTypeNo',
          show: true
        },
        {
          label: '车位卡名称',
          prop: 'cardName',
          show: true
        },
        {
          label: '售价（￥）',
          prop: 'cardPrice',
          show: true
        },
        {
          label: '持有用户',
          prop: 'holdingUsers',
          show: true
        },
        {
          label: '累计销量',
          prop: 'cumulativeSales',
          show: true
        },
        {
          label: '有效期',
          prop: 'validity',
          show: true
        },
        {
          label: '状态',
          prop: 'status_str',
          show: true
        }
      ],
      tableData: [],
      garage: [], // 车库选项
      modalMessage: {
        title: '',
        show: false,
        content: ''
      },
      parkingId: null,
      garageId: null,
      cardName: null,
      parkingCardType: null
    }
  },
  async created () {
    this.loading = true
    await this.getParkingList()
    await this.getList()
  },
  methods: {
    async getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        parkingId: this.parkingId || getUserInfo().parkingId,
        garageId: this.garageId,
        cardName: this.cardName,
        parkingCardType: this.parkingCardType
      }
      const { data: res } = await serve.getParkingCardList(params)
      if (res.code === 200) {
        this.loading = false
        this.total = res.data.totalCount
        this.tableData = res.data.rows
        this.tableData.map(item => {
          const type = {
            1: '包天卡',
            2: '次数卡',
            3: '时长卡'
          }
          const beginDate = item.beginDate ? timeFormat(item.beginDate, 'yyyy-mm-dd') + '至' : ''
          const endDate = item.endDate ? timeFormat(item.endDate, 'yyyy-mm-dd') : ''
          if (item.cardType === 1 && item.validType === 2) {
            item.validity = `自购买日起  ${item.configDay}  天`
          } else {
            if (item.validType === 1) item.validity = `${beginDate} ${endDate}`
            if (item.validType === 2) item.validity = `自购买日起  ${item.effectiveDuration}  天`
            if (item.validType === 3) item.validity = '不限时间'
          }
          item.parkingCardType = type[item.cardType]
          item.status_str = item.status === 1 ? '正常' : item.status === 0 ? '停用' : ''
          // 如果当前车位卡已过期 不能起售
          const expires = new Date(item.endDate).getTime()
          if (expires && expires < new Date().getTime()) {
            item.isShow = false
          } else {
            item.isShow = true
          }
        })
      } else {
        this.loading = false
        this.$message.info(res.msg)
      }
    },
    // tabel 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索
    async handleSearch(obj) {
      console.log(obj, 'obk')
      this.parkingId = obj.park
      this.garageId = obj.garage
      this.cardName = obj.cardName
      this.parkingCardType = obj.parkType

      await this.getList()
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
    // 添加车位卡
    addCard() {
      this.$router.push({ path: '/operationsManage/parking-card/add', query: { type: '添加' } })
    },
    // tabele btn操作
    handleOptines(row, type) {
      const { cardId } = row
      switch (type) {
        case '查看':
          this.$router.push({ path: '/operationsManage/parking-card/add', query: { cardId: cardId, type: '查看' } })
          break
        case '编辑':
          this.$router.push({ path: '/operationsManage/parking-card/add', query: { cardId: cardId, type: '编辑' } })
          break
        case '停售':
          this.modalMessage.show = true
          this.modalMessage.title = type
          this.modalMessage.content = '是否停售该车位卡？'
          this.modalMessage.itemID = cardId
          break
        case '起售':
          this.modalMessage.show = true
          this.modalMessage.title = type
          this.modalMessage.content = '是否起售该车位卡？'
          this.modalMessage.itemID = cardId
          break
      }
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
    async handleDialog(val) {
      const params = {
        cardId: val.itemID.toString(),
        status: val.title === '停售' ? 0 : val.title === '起售' ? 1 : ''
      }
      const { data: res } = await serve.changeStatus(params)
      if (res.code === 200) {
        this.$message.success(res.msg)
        this.getList()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.btn_check {
  color: #f56c6c;
}
.btn_stop { color: #909399;}
</style>
