<template>
  <div class="charge_dialog">
    <el-dialog title="" custom-class="charge-dialog" :visible.sync="chargeInfo.isShow" width="55%" :destroy-on-close="true" :show-close="false" :close-on-click-modal="false">
      <el-row :gutter="20">
        <el-col :span="8"><span>停车场：</span>{{ chargeInfo.content.chargeParam.garageName }}</el-col>
        <el-col :span="8"><span>车牌号：</span>{{ chargeInfo.content.chargeParam.carNum }}</el-col>
        <el-col :span="8"><span>用户类型：</span>{{ customType }}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8"><span>进场时间：</span>{{ inTime }}</el-col>
        <el-col :span="8"><span>入场道闸：</span>{{ chargeInfo.content.chargeParam.inGate }}</el-col>
        <el-col :span="8"><span>入场照片：</span>
          <div v-if="inImages.length">
            <el-image
              style="width: 100px; height: 66px;margin-right: 20px"
              v-for="(url,index) in inImages"
              :key="index"
              :src="url"
              :preview-src-list="inImages">
            </el-image>
          </div>
          <span v-else style="color: cornflowerblue">暂无</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8"><span>出场时间：</span>{{ outTime }}</el-col>
        <el-col :span="8"><span>出场道闸：</span>{{ chargeInfo.content.chargeParam.outGate }}</el-col>
        <el-col :span="8"><span>出场照片：</span>
          <div v-if="outImages.length">
            <el-image
              style="width: 100px; height: 66px;margin-right: 20px"
              v-for="(url,index) in outImages"
              :key="index"
              :src="url"
              :preview-src-list="outImages">
            </el-image>
          </div>
          <span v-else style="color: cornflowerblue">暂无</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8"><span>订单号：</span>{{ chargeInfo.content.chargeParam.orderNum }}</el-col>
        <el-col :span="8"><span style="width: 118px">订单金额（￥）：</span>{{ chargeInfo.content.billingAmount }}</el-col>
        <el-col :span="8"><span>停车时间：</span>{{ chargeInfo.content.chargeParam.parkHour }} 小时</el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="next">人工收费</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { timeFormat } from '@/utils/util'
export default {
  props: {
    chargeInfo: Object || {}
  },
  data () {
    return {
      inImages: [],
      outImages: [],
      customType: null
    }
  },
  created() {
    console.log(this.chargeInfo, 'chargeInfo')
    const parkObj = { 1: '车位卡', 2: '临停', 3: 'VIP' }
    this.customType = parkObj[this.chargeInfo.content.parkType]
    this.inImages = this.chargeInfo.content.inImages
    this.outImages = this.chargeInfo.content.outImages
  },
  computed: {
    inTime() {
      return timeFormat(this.chargeInfo.content.chargeParam.inTime)
    },
    outTime () {
      return timeFormat(this.chargeInfo.content.chargeParam.outTime)
    }
  },
  methods: {
    next() {
      this.chargeInfo.isShow = false
      this.$emit('goNext')
    }
  }
}
</script>

<style scoped lang="scss">
.charge_dialog {
  ::v-deep.charge-dialog{
    .el-dialog__header {
      border: none;
    }
    .el-dialog__body {
      padding: 30px;
      box-sizing: border-box;
    }
  }
   .el-row:not(:first-child) {
    margin-top: 50px;
    .el-col {
      display: flex;
      // align-items: center;
      span {
        width: 80px;
      }
    }
   }
  .dialog-footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
::v-deep .el-dialog__wrapper {
  z-index: 99999999999 !important;
}
</style>
