<template>
  <div class="autu_add">
    <el-dialog v-loading="loading" :title="dialogData.title" :visible.sync="dialogData.isShow" width="55%" :destroy-on-close="true" :close-on-click-modal="false">
      <div class="content">
        <div class="content_grid">
          <h3>
            <div>停车记录</div>
          </h3>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="12"><span>车牌号：</span>{{itemObj.parkRecord.carNo}}</el-col>
            <el-col :span="12"><span>停车场名称:</span>{{itemObj.parkRecord.garageName}}</el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="12"><span>入场时间：</span>{{itemObj.parkRecord.inTime}}</el-col>
            <el-col :span="12"><span>出场时间:</span>{{itemObj.parkRecord.outTime}}</el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="12"><span>停车时长：</span>{{itemObj.parkRecord.parkHourStr}}</el-col>
            <el-col :span="12"><span>实付金额（￥）:</span>{{itemObj.parkRecord.confirmAmount}}</el-col>
          </el-row>
        </div>
        <div class="content_grid">
          <h3>
            <div>订单信息</div>
          </h3>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="12"><span>订单号：</span>{{itemObj.orderDetail.orderNo}}</el-col>
            <el-col :span="12"><span>订单时间:</span>{{itemObj.orderDetail.createTime}}</el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="12"><span>停车时长：</span>{{itemObj.orderDetail.parkHourStr}}</el-col>
            <el-col :span="12"><span>订单金额（￥）:</span>{{itemObj.orderDetail.orderAmount}}</el-col>
          </el-row>
        </div>
        <div class="content_grid">
          <h3>
            <div>结算信息</div>
          </h3>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="12"><span>结算状态：</span>{{itemObj.settleInfo.settleStatusStr}}</el-col>
            <el-col :span="12"><span>酒店名称:</span>{{itemObj.settleInfo.hotelName}}</el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="12"><span>收款账户：</span>{{itemObj.settleInfo.collectionAccount}}</el-col>
            <el-col :span="12"><span>结算时间:</span>{{itemObj.settleInfo.settleTime}}</el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="24" class="img_col"><span>付款凭证：</span>
              <div class="img_list">
                <el-image style="width: 160px; height: 100px; border-radius: 4px"
                  v-for="(url, index) in itemObj.settleInfo.paymentVoucherList"
                  :key="index + url"
                  :src="url"
                  :preview-src-list="itemObj.settleInfo.paymentVoucherList">
                </el-image>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="12"><span>备注说明：</span>{{itemObj.settleInfo.remarks}}</el-col>
          </el-row>
        </div>
        <div class="content_grid">
          <h3>
            <div>平账信息</div>
          </h3>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="12"><span>结算状态：</span>{{itemObj.balanceInfo.statusStr}}</el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid" v-if="itemObj.balanceInfo.status==3">
            <el-col :span="12"><span>操作人:</span>{{itemObj.balanceInfo.balanceBy}}</el-col>
            <el-col :span="12"><span>操作时间：</span>{{itemObj.balanceInfo.balanceTime}}</el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid" v-if="itemObj.balanceInfo.status==3">
            <el-col :span="24" class="img_col"><span>收款凭证：</span>
              <div class="img_list">
                <el-image style="width: 160px; height: 100px; border-radius: 4px"
                  v-for="(url, index) in itemObj.balanceInfo.collectVoucherList"
                  :key="index + url"
                  :src="url"
                  :preview-src-list="itemObj.balanceInfo.collectVoucherList">
                </el-image>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid" v-if="itemObj.balanceInfo.status==3">
            <el-col :span="12"><span>备注说明：</span>{{itemObj.balanceInfo.remarks}}</el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="cancel()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: '',
  props: {
    itemObj: {
      type: Object
    },
    dialogData: {
      type: Object
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    cancel() {
      this.form = {}
      this.updateList = []
      this.dialogData.isShow = false
    }
  }
}
</script>

<style scoped lang="scss">
.tipsInfo{
  color: red;
  margin-bottom: 30px;
  font-size: 12px;
  margin-left: 30px;
}
.container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .content {
    overflow-y: auto;
    flex: 1;
    flex-grow: 1;
    box-sizing: border-box;
    .content_grid {
      h3 {
        display: flex;
        color: #333;
        border-bottom: 1px solid #ccc;
        padding: 10px;
        font-weight: normal;
        margin-top: 0;
      }
      .first_grid {
        padding: 0 10px;
        box-sizing: border-box;
        margin:0 !important;
        margin-bottom: 50px !important;
        color: #606266;
        font-size: 14px;
        .el-col {
          display: flex;
          align-items: flex-start;
          align-items: center;
          .img_list {
            .el-image:not(:last-child) {
              margin-right: 20px;
            }
          }
          span {
            font-weight: bold;
            width: 130px;
          }
        }
        .img_col {
          align-items: flex-start !important;
        }
      }
      .img_row {
        margin-bottom: 15px !important;
      }
      .pament_card {
        background: #e9ebef;
        padding: 10px 0;
      }
    }
  }
}
  .autu_add {
    ::v-deep.el-dialog__body {
      min-height: 300px;
      _height:300px;
      .el-form {
        .el-row {
          .el-col {
            .el-form-item  {
              display: flex;
            }
          }
        }
      }
    }
    .el-dialog__footer {
      .dialog-footer {
        display: flex;
        justify-content: center;
        .el-button {
          &:first-child {
            margin-right: 20px;
          }
        }
      }
    }
    ::v-deep.el-input-group__append {
      background-color: #409eff !important;
      border: 1px solid #409eff;
      color: #fff;
    }
    .download_link {
      position: absolute;
      right: 0;
      top: 40px;
    }
  }
</style>
