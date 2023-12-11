<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
      element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch" @connect="connect">
        <div class="handle-btn" slot="operate">
          <!-- <el-button size="small" type="primary" icon="el-icon-download" @click="exportData">导出</el-button> -->
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
              <el-button type="text" size="small" @click="detail(scope.row)">查看</el-button>
              <!-- <el-button type="text" size="small" @click="block(scope.row, '提醒')">提醒</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="tableData"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10,20,30,40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          ref="pagination"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import serve from '@/api/operationManage.api'
import { getUserInfo } from '@/common/cache.js'
export default {
  name: 'userParkingCard',
  components: { SearchFilter },
  data () {
    return {
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
          type: 'input',
          label: '车牌号',
          placeholder: '请输入车牌号',
          key: 'carNum'
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
              value: '3',
              label: '时长卡'
            },
            {
              value: '2',
              label: '次数卡'
            },
            {
              value: '1',
              label: '包天卡'
            }
          ],
          value: null
        },
        {
          type: 'select',
          label: '状态',
          key: 'status',
          clearable: true,
          options: [
            {
              value: null,
              label: '全部'
            },
            {
              value: '1',
              label: '正常'
            },
            {
              value: '2',
              label: '已过期'
            },
            {
              value: '3',
              label: '已用完'
            }
          ],
          value: '1'
        }
      ],
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '车位卡卡号',
          prop: 'cardNo',
          show: true
        },
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
          prop: 'cardTypeStr',
          show: true
        },
        {
          label: '车位卡名称',
          prop: 'cardName',
          show: true
        },
        {
          label: '车牌号',
          prop: 'carNum',
          show: true
        },
        {
          label: '姓名',
          prop: 'userName',
          show: true
        },
        {
          label: '电话',
          prop: 'userPhone',
          show: true
        },
        {
          label: '有效期',
          prop: 'expirationDate',
          show: true
        },
        {
          label: '余量',
          prop: 'leftNum',
          show: true
        },
        {
          label: '状态',
          prop: 'statusStr',
          show: true
        },
        {
          label: '支付时间',
          prop: 'payTime',
          show: true
        }
      ],
      tableData: [],
      garage: [], // 车库选项
      parkingId: null,
      carNum: null,
      cardType: null,
      status: 1
    }
  },
  created () {
    this.getList()
    this.getParkingList()
  },
  methods: {
    async getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        parkingId: this.parkingId || getUserInfo().parkingId,
        garageId: this.garageId,
        carNum: this.carNum,
        cardType: this.cardType,
        status: this.status
      }
      this.loading = true
      const { data: res } = await serve.getUserCardList(params)
      console.log(res)
      if (res.code === 200) {
        this.loading = false
        // this.currentPage = res.data.currentPage
        this.total = res.data.totalCount
        this.tableData = res.data.rows
        this.tableData.map(item => {
          if (item.cardType === 1) {
            item.leftNum = item.leftNum + '天'
          } else if (item.cardType === 2) {
            item.leftNum = item.leftNum + '次'
          } else {
            item.leftNum = item.leftNum + '分钟'
          }
        })
        // this.$nextTick(() => {
        //   this.$refs.pagination.internalCurrentPage = this.currentPage
        // })
      } else {
        this.loading = false
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
    handleSearch(obj) {
      this.parkingId = obj.park || getUserInfo().parkingId
      this.carNum = obj.carNum
      this.garageId = obj.garage
      this.cardType = obj.cardType
      this.status = obj.status
      this.getList()
    },
    // exportData() {},
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    detail(row) {
      this.$router.push({ path: '/operationsManage/user-parking-card/detail', query: { orderId: row.orderId, cardId: row.cardId, customerCardId: row.customerCardId } })
    },
    // 分页
    handleSizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      console.log(page, this.currentPage, 'handlepage')
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
