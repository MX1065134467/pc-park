<template>
  <div class="han-movement" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
      <search-filter :filter-form="filterForm" @searchData="handleSearch"></search-filter>
      <div class="table-wrap">
      <el-table
        stripe
        border
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
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
            <el-button style="margin-left: 20px" type="primary" size="small" @click="btnHandle(scope.row)">出场</el-button>
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
    <charge-dialog v-if="chargeInfo.isShow" :chargeInfo="chargeInfo" @goNext="goNext"/>
    <payment v-if="payment.isShow" :payment="payment" @confirm="confirm" @cancel="cancel"/>
  </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import serve from '@/api/artificailCharge.api'
import chargeDialog from './dialog/chargeDialog'
import payment from './dialog/payment'
import { getUserInfo } from '@/common/cache.js'
import paymentMixin from '@/mixin/paymentMixin.js'
export default {
  name: 'handMovement',
  mixins: [paymentMixin],
  components: {
    SearchFilter,
    chargeDialog,
    payment
  },
  data () {
    return {
      loading: false,
      filterForm: [
        {
          type: 'input',
          label: '车牌号',
          placeholder: '请输入车牌号',
          key: 'carNo'
        }
      ],
      tableHeaderData: [
        {
          label: '订单号',
          prop: 'orderNo',
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
          prop: 'parkTime',
          show: true
        },
        {
          label: '用户类型',
          prop: 'parkType_str',
          show: true
        },
        {
          label: '订单金额（￥）',
          prop: 'orderAmount',
          show: true
        }
      ],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      chargeInfo: {
        isShow: false
      },
      payment: {
        isShow: false
      },
      row: {},
      carNo: null
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init () {
      const { userId } = JSON.parse(sessionStorage.getItem('userInfo'))
      const params = {
        carNo: this.carNo ? this.carNo.trim() : null,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        userId: String(userId)
      }
      const { data: res } = await serve.handMovement(params)
      if (res.code === 200) {
        this.total = res.data.totalCount
        this.tableData = res.data.rows
        this.tableData.map(item => {
          const parkObj = { 1: '车位卡', 2: '临停', 3: 'VIP' }
          item.parkType_str = parkObj[item.parkType]
        })
      }
    },
    // 搜索
    handleSearch(obj) {
      this.carNo = obj.carNo
      this.init()
    },
    // 分页
    handleSizeChange (size) {
      this.pageSize = size
      this.iinit()
    },
    handleCurrentChange (page) {
      this.currentPage = page
      this.init()
    },
    // 出场按钮
    btnHandle (row) {
      this.row = row
      this.chargeInfo.content = row
      this.chargeInfo.isShow = true
    },
    goNext() {
      this.payment.content = this.row
      this.payment.isShow = true
    },
    async confirm() {
      this.startLoading()
      const params = {
        orderId: this.row.orderId,
        payAmount: this.row.billingAmount,
        purchaseWay: 6,
        userId: getUserInfo().userId
      }
      const { data: res } = await serve.cashPay(params)
      if (res.code === 200) {
        this.payment.isShow = false
        this.$message.success(res.msg)
        this.$router.push({
          query: { notifyData: null }
        })
        this.endLoading()
        this.$notify.closeAll()
        this.init()
      }
    },
    cancel() {
    }
  }
}
</script>

<style scoped lang="scss">

</style>
