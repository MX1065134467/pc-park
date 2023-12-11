<template>
  <div class='confirmDeparture'>
    <el-dialog class='confirmDepartureDialog' width="35%" :title="dialogVisible.title" :visible.sync="dialogVisible.show" :close-on-click-modal="false" @close="enterCancel">
      <div class="mconfirmDepartureContainer">
        <el-form ref="form" :model="form" :rules="rules1" label-width="100px">
          <el-form-item label="出场时间：">
            {{form.goTime}}
          </el-form-item>
          <el-form-item label="出场口：" prop="equipment1">
            <el-select v-model="form.equipment1" placeholder="请选择出场口" class="equipment">
              <el-option
                v-for="(item, index) in equipmentList1"
                :key="index"
                :label="item.name"
                :value="item.lanecode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车牌号：">
            <el-input v-model="form.carNumber" placeholder="请输入车牌号/手机号" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" class="searchButton" @click="search"></el-button>
            </el-input>
            <span class="noEnterLog" @click="noEnterLog">
              <img src="@/assets/image/chargeAeait/noEnterLog.png" alt="" style="width:16px;">
              <span>未搜索到入场纪录？</span>
            </span>
          </el-form-item>
          <el-form-item label="入场纪录：">
            <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td>入场时间</td>
                <td>{{admissionRecords.inTime ? admissionRecords.inTime : '暂无'}}</td>
              </tr>
              <tr>
                <td>车牌号/手机号</td>
                <td>{{admissionRecords.carNo ? admissionRecords.carNo : '暂无'}}</td>
              </tr>
              <tr>
                <td>车型</td>
                <td>{{admissionRecords.carTypeStr ? admissionRecords.carTypeStr : '暂无'}}</td>
              </tr>
            </table>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <div class="footerButtonBox">
          <el-button plain class="footerButton" size="small" @click="enterCancel">取消</el-button>
          <el-button  class="footerButton" type="primary" size="small" :loading="currentSure" @click="goMakeSure">确认离场</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import serve from '@/api/parkingCharge.api'
import moment from 'moment'
import { timeFormat } from '@/utils/util'

export default {
  name: '',
  components: {},
  props: {
    // 模态框是否显示
    dialogVisible: {
      type: Object
    },
    //  模态框的form数据
    dialogFromData: {
      type: Object
    }
  },
  data() {
    return {
      currentSure: false,
      equipmentList1: [],
      form: {
        goTime: '',
        carNumber: ''
      },
      rules1: {
        equipment1: [{ required: true, message: '请选择出场口', trigger: 'change' }]
      },
      admissionRecords: {
        inTime: '',
        carNo: '',
        carTypeStr: ''
      }
    }
  },
  created() {
    this.goTime()
    this.pendingCharge()
  },
  mounted() {},
  watch: {},
  computed: {
  },
  methods: {
    goTime () {
      this.form.goTime = timeFormat(new Date())
    },
    enterCancel () {
      this.dialogVisible.show = false
    },
    search () {
      const params = {
        carNum: this.form.carNumber,
        garageId: this.dialogFromData.garageId
      }
      serve.recordIn(params).then(res => {
        if (res.data.code === 200) {
          this.admissionRecords = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    noEnterLog () {
      this.dialogVisible.show = false
      this.$emit('confirmDepartureDialog', 'noEnter')
    },
    goMakeSure () {
      if (!this.admissionRecords.inOutId) {
        this.$message.warning('没有入场纪录数据')
        return false
      }
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message.warning('请先选择出场口再提交')
          return false
        } else {
          this.currentSure = true
          const params = {
            carNum: this.admissionRecords.carNo,
            carType: this.admissionRecords.carType,
            garageId: this.admissionRecords.garageId,
            outGate: this.form.equipment1,
            outTime: moment(this.form.goTime),
            parkCode: this.admissionRecords.parkCode,
            parkingId: this.admissionRecords.parkingId
          }
          serve.vehicleExit(params).then(res => {
            if (res.data.code === 200) {
              this.$message.success('车辆离场成功,请支付')
              this.dialogVisible.show = false
              this.$emit('confirmDepartureDialog', 'close')
            } else if (res.data.code === 0) {
              this.$message.success('在免费停车时长内,直接放行')
              this.dialogVisible.show = false
              this.$emit('confirmDepartureDialog', 'close')
            } else {
              this.$message.error(res.data.msg)
            }
            this.currentSure = false
          })
        }
      })
    },
    // 车道闸口查询
    pendingCharge () {
      const params = {
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId
      }
      serve.pendingChargeList(params).then(res => {
        if (res.data.code === 200) {
          const aa = res.data.data
          aa.forEach(item => {
            if (item.gateType === 0) {
              // 入场口闸道
              // this.equipmentList.push(item)
            } else if (item.gateType === 1) {
              this.equipmentList1.push(item)
            }
          })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-form-item__label {
  font-size: 14px !important;
  color: rgba(0,0,0,0.45) !important;
}
.el-form-item__content::after{
  font-size: 14px !important;
  color: rgba(0,0,0,0.85) !important;
}
::v-deep .el-dialog {
border-radius: 4px !important;
box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.2) !important;
    .el-dialog__header {
      padding: 20px 0 20px !important;
      margin: 0 !important;
      border-bottom: 1px solid #e6e6e6 !important;
      .el-dialog__title {
        margin-left: 20px !important;
        font-size: 16px;
        font-weight: 600;
        color: #000000;
      }
    }
  .el-dialog__body {
    padding: 0 !important;
  }
}
table {
  border: 1px solid #eaeaea;
  width: 100%;
  tr {
    border: 1px solid #eaeaea;
    td:nth-child(1) {
      width: 30%;
      background: #f5f5f5;
    }
    td:nth-child(2) {
      text-align: center;
      color: #999;
    }
    td {
      border: 1px solid #eaeaea;
      padding-left: 3%;
    }
  }
}
::v-deep .el-input-group {
  width: 60% !important;
}
::v-deep .el-input-group__append {
  background-color: #409eff !important;
  .el-icon-search {
    color: #fff !important;
  }
}
.confirmDeparture {
  .confirmDepartureDialog {
    .mconfirmDepartureContainer {
      padding: 20px 30px 0;
      .noEnterLog {
        cursor: pointer;
        margin-top: 2px;
        img {
          vertical-align: middle;
          margin-right: 5px;
          margin-left: 17px;
          display: inline;
        }
        span {
          font-size: 12px;
          color: rgba(0,0,0,0.45);
          vertical-align: middle;
        }
      }
    }
  }
}
.footer {
      border-top: 1px solid #e6e6e6;
      padding: 0 !important;
        .footerButtonBox {
          text-align: right;
          margin: 10px 30px 0 0;
          ::v-deep .footerButton {
          width: 88px !important;
          margin: 0 0 10px 16px;
        }
      }
    }
</style>
