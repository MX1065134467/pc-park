<template>
  <div class="container">
    <div
      class="ticket-wrap"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
    >
      <search-filter :filter-form="filterForm" @searchData="handleSearch" @connect="connect">
        <div class="handle-btn" slot="operate">
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
              :sortable="item.sort"
              :prop="item.prop"
            ></el-table-column>
          </template>
          <el-table-column fixed="right" label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="btn_check" @click="handleOptines(scope.row, '查看')">查看</el-button>
              <el-button :disabled="isDisabled || !scope.row.cannotBuy" type="text" size="small" class="btn_stop" @click="handleOptines(scope.row, '购买')">购买</el-button>
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
    <sale-list-check v-if="saleDate.isShow" :saleDate="saleDate"></sale-list-check>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import { getUserInfo } from '@/common/cache.js'
import saleListCheck from './dialog/saleListCheck'
import serve from '@/api/parkingCardSell.api'
export default {
  props: ['myId'],
  name: 'saleList',
  components: { SearchFilter, saleListCheck },
  data() {
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
          label: '停车场',
          placeholder: '停车场',
          key: 'garage',
          options: [],
          value: ''
        },
        {
          type: 'select',
          label: '车位卡类型',
          key: 'cardType',
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
          prop: 'parkingIdStr',
          show: true
        },
        {
          label: '停车场名称',
          prop: 'garageIdStr',
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
          label: '价格（￥）',
          prop: 'cardPrice',
          show: true,
          sort: true
        },
        {
          label: '可售数量',
          prop: 'spaceParking',
          show: true
        }
      ],
      tableData: [],
      saleDate: {
        isShow: false
      },
      garage: [] // 车库选项
    }
  },
  created() {
    this.getParkingList()
    this.init()
  },
  methods: {
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
    async init() {
      const userId = getUserInfo().userId
      const paeams = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        userId
      }
      await this.getSaleList(paeams)
    },
    // 车位卡列表
    async getSaleList(params) {
      this.loading = true
      const { data: res } = await serve.saleList(params)
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.rows
        this.total = res.data.totalCount
        this.tableData.map(item => {
          const type = {
            1: '包天卡',
            2: '次数卡',
            3: '时长卡'
          }
          item.parkingCardType = type[item.cardType]
          console.log(item)
          if (item.isLimitStock === 0) {
            item.spaceParking = '不限库存'
            item.cannotBuy = true
          } else {
            item.spaceParking = Math.min.call(Number(item.spaceParking), Number(item.stockNum))
            item.cannotBuy = Boolean(item.spaceParking)
          }
        })
      } else {
        this.loading = false
        this.$message.info(res.msg)
      }
    },
    // 搜索
    async handleSearch(obj) {
      const params = {
        parkingId: obj.park,
        cardName: obj.cardName,
        garageId: obj.garage,
        parkingCardType: obj.cardType,
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        userId: getUserInfo().userId
      }
      await this.getSaleList(params)
    },
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    // btn 操作
    handleOptines(row, type) {
      const { cardId, cardType } = row
      switch (type) {
        case '查看':
          this.saleDate.isShow = true
          this.saleDate.cardId = cardId
          break
        case '购买':
          this.$router.push({ name: 'buyCard', query: { cardId, cardType } })
          break
      }
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.init()
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">

.btn_check {
  color: #909399;
}
</style>
