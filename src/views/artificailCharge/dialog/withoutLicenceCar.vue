<template>
  <div class='withoutLicenceCar'>
    <el-dialog class='withoutLicenceCarDialog' width="35%" :title="dialogVisible.title" :visible.sync="dialogVisible.show" :close-on-click-modal="false" @close="enterCancel">
      <div class="enterGoTabs">
        <el-tabs v-model="enterGo" @tab-click="tabClick" class="tabHeight">
          <el-tab-pane label="入场" name="0" v-if="!dialogFromData.carId">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="入场时间：" prop="enterTime">
                {{ruleForm.enterTime}}
              </el-form-item>
              <el-form-item label="车型：" prop="CarStype">
                <el-select v-model="ruleForm.CarStype" placeholder="请选择车型" style="width:100%;">
                  <el-option
                  v-for="(item, index) in carStyleList"
                  :key="index"
                  :label="item.item_name"
                  :value="item.car_type"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车牌号：" prop="carNumber">
                <el-input v-model="ruleForm.carNumber" placeholder="请输入车牌号（临牌）或手机号"></el-input>
              </el-form-item>
              <el-form-item label="入场口：" prop="equipment">
                <el-select v-model="ruleForm.equipment" placeholder="请选择入场口" style="width:100%;" class="equipment">
                <el-option
                  v-for="(item, index) in equipmentList"
                  :key="index"
                  :label="item.name"
                  :value="item.lanecode">
                </el-option>
              </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="出场" :name="dialogFromData.carId ? '0' : '1'">
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
              <div v-if="!dialogFromData.carId">
                <el-form-item label="车牌号：">
                <el-input v-model="form.carNumber" placeholder="请输入车牌号/手机号" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search" class="searchButton" @click="search"></el-button>
                </el-input>
                <span class="noEnterLog" @click="noEnterLog">
                  <img src="@/assets/image/chargeAeait/noEnterLog.png" alt="" style="width:16px;">
                  <span>未搜索到入场纪录？</span>
                </span>
              </el-form-item>
              </div>
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
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="enterGo === '0' && !dialogFromData.carId" class="footer">
        <div class="footerButtonBox">
          <el-button plain class="footerButton" size="small" @click="enterCancel">取消</el-button>
          <el-button  class="footerButton" type="primary" size="small" :disabled="disableA" :loading="currentSure" @click="enterMakeSure">确认入场</el-button>
        </div>
      </div>
      <div v-if="enterGo === '1' || dialogFromData.carId" class="footer">
        <div class="footerButtonBox">
          <el-button plain class="footerButton" size="small" @click="enterCancel">取消</el-button>
          <el-button  class="footerButton" type="primary" size="small" :disabled="disableB" :loading="currentSure" @click="goMakeSure">确认离场</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { timeFormat } from '@/utils/util'
import moment from 'moment'
import serve from '@/api/parkingCharge.api'

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
    var carPhoneValid = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
      const plateNumber = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/
      if (phoneReg.test(value) || plateNumber.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的车牌号或手机号'))
      }
    }
    return {
      disableA: false,
      disableB: false,
      equipmentList: [],
      equipmentList1: [],
      enterGo: '0',
      carStyleList: [],
      currentSure: false,
      parkOutId: null,
      ruleForm: {
        enterTime: null,
        CarStype: null,
        carNumber: ''
      },
      rules: {
        CarStype: [{ required: true, message: '请选择车型', trigger: 'change' }],
        equipment: [{ required: true, message: '请选择入场口', trigger: 'change' }],
        carNumber: [
          { required: true, message: '请输入车牌号（临牌）或手机号', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: carPhoneValid }
        ]
      },
      rules1: {
        equipment1: [{ required: true, message: '请选择出场口', trigger: 'change' }]
      },
      form: {
        goTime: null,
        carNumber: '',
        equipment: ''
      },
      admissionRecords: {
        inTime: '',
        carNo: '',
        carTypeStr: ''
      }
    }
  },
  created() {
    this.enterTime()
    this.carStyle()
    this.pendingChargeList()
  },
  mounted() {
    console.log(this.dialogFromData, 'dialogFromData')
    // if (this.dialogVisible.show === true && this.dialogFromData.inOutId) {
    this.admissionRecords = this.dialogFromData
    // }
    if (this.dialogVisible.show === true && this.dialogFromData.carId) {
      this.goTime()
    }
  },
  watch: {},
  computed: {
  },
  methods: {
    tabClick (e) {
      console.log(e.name, 'e.name')
      if (e.name === '0') {
        this.enterTime()
      } else if (e.name === '1') {
        this.goTime()
      }
    },
    enterMakeSure () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.$message.warning('请检查必填项')
          return false
        } else {
          this.currentSure = true
          const params = {
            carNum: this.ruleForm.carNumber,
            inGate: this.ruleForm.equipment,
            passTime: moment(this.ruleForm.enterTime),
            vehType: this.ruleForm.CarStype,
            createBy: JSON.parse(sessionStorage.getItem('userInfo')).userName,
            garageId: this.dialogFromData.garageId,
            parkingId: this.dialogFromData.parkingId,
            picFilePath: this.dialogFromData.picFilePath,
            picPlateFilePath: this.dialogFromData.picPlateFilePath
          }
          serve.regist(params).then(res => {
            if (res.data.code === 200) {
              this.$message.success('入场登记成功')
              this.dialogVisible.show = false
              this.$emit('withoutLicenceCarDialog', 'close')
            } else {
              this.$message.error(res.data.msg)
            }
            this.currentSure = false
          })
        }
      })
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
          console.log(this.admissionRecords, 'this.admissionRecords')
          const params = {
            carNum: this.admissionRecords.carNo,
            carType: this.admissionRecords.carType,
            garageId: this.admissionRecords.garageId,
            outGate: this.form.equipment1,
            outTime: moment(this.form.goTime),
            parkCode: this.admissionRecords.parkCode,
            parkingId: this.admissionRecords.parkingId,
            picFilePath: this.dialogFromData.picFilePath,
            picPlateFilePath: this.dialogFromData.picPlateFilePath
          }
          serve.vehicleExit(params).then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.dialogVisible.show = false
              this.$emit('withoutLicenceCarDialog', 'close', res.data.data.chargeParam.carType)
            } else if (res.data.code === 0) {
              this.$message.success('在免费停车时长内,直接放行')
              this.dialogVisible.show = false
              this.$emit('withoutLicenceCarDialog', 'open', res.data.data.orderId)
            } else {
              this.$message.error(res.data.msg)
            }
            this.currentSure = false
          })
        }
      })
    },
    enterCancel () {
      this.form.carNumber = ''
      // this.$refs.ruleForm.resetFields()
      this.dialogVisible.show = false
      this.$emit('withoutLicenceCarDialog', 'close')
    },
    noEnterLog () {
      this.dialogVisible.show = false
      this.$emit('withoutLicenceCarDialog', 'noEnterLog')
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
    enterTime () {
      this.ruleForm.enterTime = timeFormat(new Date())
    },
    goTime () {
      this.form.goTime = timeFormat(new Date())
    },
    carStyle () {
      serve.carTypeList().then(res => {
        if (res.data.code === 200) {
          this.carStyleList = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 车道闸口查询
    pendingChargeList () {
      const params = {
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId
      }
      serve.pendingChargeList(params).then(res => {
        if (res.data.code === 200) {
          const aa = res.data.data
          aa.forEach(item => {
            if (item.gateType === 0) {
              this.equipmentList.push(item)
            } else if (item.gateType === 1) {
              this.equipmentList1.push(item)
            }
          })
          if (this.equipmentList.length === 0) {
            this.disableA = true
          } else {
            this.disableA = false
          }
          if (this.equipmentList1.length === 0) {
            this.disableB = true
          } else {
            this.disableB = false
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
// ::v-deep .el-dialog__wrapper {
//   z-index: 99999999999 !important;
// }
::v-deep .el-form-item {
  margin-left: -17px !important;
}
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
::v-deep .tabHeight .el-tabs__nav-wrap::after {
  height: 2px !important;
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
.withoutLicenceCar {
  .withoutLicenceCarDialog {
    .enterGoTabs {
      padding: 24px 30px;
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
  }
}
</style>
