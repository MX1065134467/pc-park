<template>
  <div class="container">
    <h3 class="head_title">用户车位卡详情</h3>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
         <el-tab-pane label="车位卡信息" name="first">
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8"><span>车位卡卡号：</span>{{parkingCardInfo.cardNo}}</el-col>
            <el-col :span="8"><span>停车场名称：</span>{{parkingCardInfo.garageName}}</el-col>
            <el-col :span="8"><span>车位卡类型：</span>{{parkingCardInfo.cardTypeStr}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8"><span>车位卡编号：</span>{{parkingCardInfo.cardTypeNo}}</el-col>
            <el-col :span="8"><span>停车卡名称：</span>{{parkingCardInfo.cardName}}</el-col>
            <el-col :span="8"><span>可用有效期：</span>{{parkingCardInfo.expirationDate}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8"><span>可用：</span>{{parkingCardInfo.leftNumStr}}</el-col>
            <el-col :span="8"><span>价格（￥）：</span>{{parkingCardInfo.cardPrice}}</el-col>
            <el-col :span="8"><span>限制规则：</span>~</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8"><span>车牌号：</span>{{parkingCardInfo.carNum}}</el-col>
            <el-col :span="8"><span>车主姓名：</span>{{parkingCardInfo.userName}}</el-col>
            <el-col :span="8"><span>电话：</span>{{parkingCardInfo.userPhone}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8"><span>身份证：</span>{{parkingCardInfo.identityCard}}</el-col>
            <el-col :span="8"><span>车辆信息：</span>{{parkingCardInfo.carInfo}}</el-col>
            <el-col :span="8" v-show="parkingCardInfo.cardType === 1"><span>车位号：</span>{{parkingCardInfo.garageDetailId}}</el-col>
          </el-row>
          <!-- <el-row :gutter="20">
            <el-col :span="8"><span>剩余时长：</span>{{parkingCardInfo.leftNum}}</el-col>
          </el-row> -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="second">
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="8"><span>订单号：</span>{{orderInfo.orderNo}}</el-col>
            <el-col :span="8"><span>订单时间：</span>{{orderInfo.orderTime}}</el-col>
            <el-col :span="8"><span>办理人：</span>{{orderInfo.handlerName}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8"><span>订单金额（￥）：</span>{{orderInfo.orderFee}}</el-col>
            <el-col :span="8"><span>购买人姓名：</span>{{orderInfo.userName}}</el-col>
            <el-col :span="8"><span>电话：</span>{{orderInfo.userPhone}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8"><span>身份证：</span>{{orderInfo.identityCard}}</el-col>
            <el-col :span="8"><span>车位卡卡号：</span>{{orderInfo.cardNo}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24"><span>备注：</span>{{orderInfo.remarks}}</el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="使用记录" name="third">
        <div class="content">
          <div class="search">
            停车时间：
            <el-date-picker
                size="small"
                v-model="validity"
                type="daterange"
                format="yyyy - MM - dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
              <el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 20px" @click="search">搜索</el-button>
          </div>
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
                  <el-button type="text" size="small" @click="detail(scope.row)">详情</el-button>
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import serve from '@/api/operationManage.api'
import { timeFormat } from '@/utils/util.js'
export default {
  name: 'parkingCardDetail',
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      activeName: 'first',
      validity: '',
      multipleSelection: [],
      tableHeaderData: [
        {
          label: '停车场',
          prop: 'garageName',
          show: true
        },
        {
          label: '车牌号',
          prop: 'carNum',
          show: true
        },
        {
          label: '订单号',
          prop: 'orderNo',
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
          label: '停车时间',
          prop: 'parkHour',
          show: true
        },
        {
          label: '用户类型',
          prop: 'parkTypeStr',
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
          prop: 'payWayStr',
          show: true
        },
        {
          label: '订单时间',
          prop: 'payTime',
          show: true
        },
        {
          label: '剩余',
          prop: 'leftNum',
          show: true
        }
      ],
      tableData: [],
      parkingCardInfo: {}, // 车位卡信息
      orderInfo: {}, // 订单信息
      cardId: null,
      endTime: null,
      startTime: null
    }
  },
  created() {
    this.cardId = this.$route.query.cardId
    this.showTabs()
    this.init()
    this.getUsageRecord()
  },
  methods: {
    async init() {
      this.loading = true
      const { data: res } = await serve.querUserCardDetail(this.$route.query.orderId)
      if (res.code === 200) {
        this.loading = false
        this.parkingCardInfo = res.data.customerCardDto
        this.parkingCardInfo.identityCard = this.parkingCardInfo.identityCard.replace(/^(.{6})(?:\w+)(.{4})$/, '$1********$2')
        this.orderInfo = res.data.orderInfo
        this.orderInfo.identityCard = this.orderInfo.identityCard.replace(/^(.{6})(?:\w+)(.{4})$/, '$1********$2')
        this.orderInfo.orderTime = timeFormat(res.data.orderInfo.orderTime)
      } else {
        this.loading = false
        this.$message.info(res.msg)
      }
    },
    // 获取用户车位卡使用记录
    async getUsageRecord() {
      const params = {
        endTime: this.endTime,
        startTime: this.startTime,
        cardId: this.cardId,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        customerCardId: this.$route.query.customerCardId
      }
      const { data: res } = await serve.getUsage(params)
      if (res.code === 200) {
        this.total = res.data.totalCount
        this.tableData = res.data.rows
      }
    },
    showTabs() {
      if (this.$route.query.activeName != null) {
        this.activeName = this.$route.query.activeName
      }
    },
    handleClick(tab, event) {
      this.activeName = tab.name
      // console.log(tab, event)
    },
    search() {
      this.startTime = this.validity ? this.validity[0] : null
      this.endTime = this.validity ? this.validity[1] : null
      this.getUsageRecord()
    },
    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    // 分页
    handleSizeChange(size) {
      this.pageSize = size
      this.getUsageRecord()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getUsageRecord()
    },
    detail(row) {
      this.$router.push({ path: '/parkingCardSell/sale-record/parking-detail', query: { orderId: row.orderId, activeName: this.activeName } })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .head_title {
    background: #606266;
    padding: 10px 0 10px 20px;
    box-sizing: border-box;
    margin-top: 0;
    color: #fff;
    font-weight: normal;
  }
  .tabs {
    padding: 10px 25px;
    box-sizing: border-box;
    .content {
      color: #666;
      font-size: 14px;
      .el-row {
        margin-bottom: 40px;
      }
    }
  }
}
</style>
