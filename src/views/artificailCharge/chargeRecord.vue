<template>
  <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
  element-loading-spinner="el-icon-loading">
    <search-filter :filter-form="filterForm" @searchData="handleSearch">
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
          <el-table-column fixed="right" label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="btnHandle(scope.row, '详情')">详情</el-button>
              <el-button class="dispose" type="text" size="small" :disabled="(scope.row.blackId !== null) || isDisabled" @click="btnHandle(scope.row, '拉黑')">拉黑</el-button>
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
      <add-black-list @close="handleAddBlack" :blackData="blackData"></add-black-list>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import { getUserInfo } from '@/common/cache.js'
import serve from '@/api/artificailCharge.api'
import addBlackList from '@v/operationsManage/dialog/addBlackList'
export default {
  name: 'chargeRecord',
  components: {
    SearchFilter,
    addBlackList
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
          type: 'input',
          label: '车牌号',
          placeholder: '请输入车牌号',
          key: 'carNum'
        },
        {
          type: 'time',
          label: '订单时间',
          key: 'time',
          value: []
        }
      ],
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '订单号',
          prop: 'orderNo',
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
          label: '车牌号',
          prop: 'carNo',
          show: true
        },
        {
          label: '进场时间',
          prop: 'inTime',
          show: true
        },
        {
          label: '出场时间',
          prop: 'outTime',
          show: true
        },
        {
          label: '停车时长',
          prop: 'parkHour',
          show: true
        },
        {
          label: '用户类型',
          prop: 'showParkType',
          show: true
        },
        {
          label: '订单金额（￥）',
          prop: 'orderAmount',
          show: true
        },
        {
          label: '实付金额（￥）',
          prop: 'confirmAmount',
          show: true
        },
        {
          label: '付费方式',
          prop: 'showPayWay',
          show: true
        },
        {
          label: '订单时间',
          prop: 'createTime',
          show: true
        }
      ],
      tableData: [],
      blackData: {
        isShow: false,
        title: '',
        content: {
        }
      },
      carNo: null,
      startTime: null,
      endTime: null,
      payWay: null
    }
  },
  created() {
    this.payWay = this.$route.query.payWay
    this.getList()
  },
  methods: {
    // tabel 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 搜索
    handleSearch(obj) {
      this.carNo = obj.carNum
      this.startTime = obj.time !== null ? obj.time[0] : null
      this.endTime = obj.time !== null ? obj.time[1] : null
      this.getList()
    },
    async getList() {
      const params = {
        userId: getUserInfo().userId,
        carNo: this.carNo,
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        startTime: this.startTime,
        endTime: this.endTime,
        payWay: this.payWay
      }
      this.loading = true
      const { data: res } = await serve.getChargeList(params)
      if (res.code === 200) {
        this.loading = false
        this.tableData = res.data.rows
        this.total = res.data.totalCount
      } else {
        this.loading = false
      }
    },
    // btn 操作
    btnHandle(row, type) {
      const { orderId } = row
      switch (type) {
        case '详情':
          this.$router.push({ path: '/artificailCharge/charge-record/detail', query: { orderId: orderId } })
          break
        case '拉黑':
          this.block(orderId)
          break
      }
    },
    async block(id) {
      this.blackData.content = {}
      const params = {
        orderId: id
      }
      const { data: res } = await serve.chargeDetail(params)
      if (res.code === 200) {
        this.blackData.content = res.data
        // const entryImg = []
        // entryImg.push(this.IMAGEURL + this.blackData.content.carInOut.inImageUrl)
        // this.blackData.content.inImageUrl_list = entryImg
        this.blackData.content.inImageUrl_list = this.blackData.content.carInOut.inImages
        this.blackData.content.allImg = this.blackData.content.carInOut.snapshotList &&
        this.blackData.content.carInOut.snapshotList.map(v => v)
        // this.blackData.content.allImg = this.blackData.content.carInOut.snapshotList &&
        // this.blackData.content.carInOut.snapshotList.map(v => this.IMAGEURL + v)
      }
      this.blackData.title = '拉黑'
      this.blackData.parkingId = getUserInfo().parkingId
      this.blackData.userName = getUserInfo().userName
      this.blackData.orderId = id
      this.blackData.isShow = true
      this.blackData.status = 1
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getList()
    },
    handleAddBlack() {
      this.blackData.isShow = false
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
