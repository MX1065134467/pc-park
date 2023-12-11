<template>
  <div class='makeUpAdmissionRecord'>
    <el-dialog class='makeUpAdmissionRecordDialog' width="35%" :title="dialogVisible.title" :visible.sync="dialogVisible.show" :close-on-click-modal="false" @close="enterCancel">
      <div class="makeUpAdmissionRecordContainer">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="入场时间：" prop="enterTime">
            <el-date-picker
              style="width:100%"
              v-model="ruleForm.enterTime"
              type="datetime"
              value-format="timestamp"
              placeholder="选择时间"
              @change="timeChange"
              >
            </el-date-picker>
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
          <el-form-item label="车牌号：" prop="carNumber">
            <el-input v-model="ruleForm.carNumber" placeholder="请输入车牌号（临牌）或手机号"></el-input>
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
        </el-form>
      </div>
      <div class="footer">
        <div class="footerButtonBox">
          <el-button plain class="footerButton" size="small" @click="enterCancel">取消</el-button>
          <el-button  class="footerButton" type="primary" size="small" :loading="currentSure" @click="goMakeSure">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import serve from '@/api/parkingCharge.api'
import moment from 'moment'

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
      equipmentList: [],
      currentSure: false,
      carStyleList: [],
      ruleForm: {
        enterTime: '',
        carNumber: '',
        equipment: '',
        CarStype: ''
      },
      rules: {
        enterTime: [{ required: true, message: '请选择入场时间', trigger: 'change' }],
        carNumber: [
          { required: true, message: '请输入车牌号（临牌）或手机号', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: carPhoneValid }
        ],
        equipment: [{ required: true, message: '请选择入场口', trigger: 'change' }],
        CarStype: [{ required: true, message: '请选择车型', trigger: 'change' }]
      }
    }
  },
  created() {},
  mounted() {
    this.pendingChargeList()
    this.carStyle()
  },
  watch: {},
  computed: {
  },
  methods: {
    enterCancel () {
      this.dialogVisible.show = false
    },
    timeChange (e) {
      console.log(e, 'e')
    },
    goMakeSure () {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.$message.warning('请检查必填项')
          return false
        } else {
          this.currentSure = true
          const params = {
            carNum: this.ruleForm.carNumber,
            createBy: JSON.parse(sessionStorage.getItem('userInfo')).userName,
            garageId: this.dialogFromData.garageId,
            parkingId: this.dialogFromData.parkingId,
            inGate: this.ruleForm.equipment,
            passTime: moment(this.ruleForm.enterTime),
            vehType: this.ruleForm.CarStype
          }
          serve.supple(params).then(res => {
            if (res.data.code === 200) {
              this.$message.success('入场补录成功')
              this.dialogVisible.show = false
              this.$emit('makeUpAdmissionRecordDialog')
            } else {
              this.$message.error(res.data.msg)
            }
            this.currentSure = false
          })
        }
      })
    },
    // 车型查询
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
// ::v-deep .el-dialog__wrapper {
//   z-index: 99999999999 !important;
// }
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
.makeUpAdmissionRecord {
  .makeUpAdmissionRecordDialog {
    .makeUpAdmissionRecordContainer {
      padding: 24px 30px 0;
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
