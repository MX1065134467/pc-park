<template>
  <div>
    <el-dialog title="指定车位" :visible.sync="dialogVisible.show" width="40%" :before-close="handleClose" :show-close="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场：">
              <span>{{carInfo.parkingName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车场编号：">
              <span>{{carInfo.parkingCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车库名称：">
              <span>{{carInfo.garageName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车库编号：">
              <span>{{carInfo.numbering}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="设置为：" prop="status">
              <el-radio-group v-model="ruleForm.status">
                <el-radio :label="2">私家车位</el-radio>
                <el-radio :label="3">车位卡车位</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号:" prop="carNo">
              <el-input v-model="ruleForm.carNo" placeholder="最多8位字符" maxlength="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="driverName">
              <el-input v-model="ruleForm.driverName" placeholder="最多20字符" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话号:" prop="driverPhoto">
              <el-input v-model="ruleForm.driverPhoto"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="dialogOk('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Object
    },
    carInfo: {
      type: Object
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value !== '') {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('手机号码有误，请重填'))
          return false
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validatorCarNO = (rule, value, callback) => {
      const plateNumberReg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/
      if (value !== '') {
        if (!plateNumberReg.test(value)) {
          callback(new Error('车牌号有误，请重填'))
          return false
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        status: '',
        carNo: '',
        driverName: '',
        driverPhoto: ''
      },
      rules: {
        status: [
          {
            required: true,
            type: 'number',
            message: '请设置类型',
            trigger: 'change'
          },
          {
            required: true,
            type: 'number',
            message: '请设置类型',
            trigger: 'blur'
          }
        ],
        carNo: [
          { required: true, message: '请输车牌号', trigger: 'blur' },
          { validator: validatorCarNO, trigger: 'blur' }
        ],
        driverName: [
          { required: true, message: '请输车主姓名', trigger: 'blur' }
        ],
        driverPhoto: [
          { required: true, message: '请输电话号码', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.ruleForm.status =
      this.carInfo.status === 2 || this.carInfo.status === 3
        ? this.carInfo.status
        : ''
    this.ruleForm.carNo = this.carInfo.carNo
    this.ruleForm.driverName = this.carInfo.userName
    this.ruleForm.driverPhoto = this.carInfo.userPhone
  },
  methods: {
    handleClose() {},
    cancel(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.dialogVisible.show = false
      this.$emit('cancel')
    },
    dialogOk(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.ruleForm.garageDetailId = this.carInfo.garageDetailId
          this.$emit('pointSpace', this.ruleForm)
          this.dialogVisible.show = false
        }
      })
    }
  }
}
</script>

<style>
</style>
