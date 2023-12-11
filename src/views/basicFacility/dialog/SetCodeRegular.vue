<template>
  <div>
    <el-dialog title="设置编号" :visible.sync="dialogVisible.show" width="40%" :before-close="handleClose" :show-close="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场：">
              <span>{{setCodeObj.parkingName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车场编号：">
              <span>{{setCodeObj.parkingCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车库名称：">
              <span>{{setCodeObj.garageName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车库编号：">
              <span>{{setCodeObj.numbering}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设置编号前缀:" prop="ruleBegin">
              <el-input placeholder="最长三个字符" v-model="ruleForm.ruleBegin" maxlength="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认起始编号:" prop="">
              <el-input placeholder="前缀+0001" :disabled="true" maxlength="20"></el-input>
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
    setCodeObj: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {
        ruleBegin: ''
      },
      rules: {
        ruleBegin: [
          { required: true, message: '请输入编号且最长为三个字符', max: 3, trigger: 'blur' }
        ]
      }
    }
  },
  created() {},
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
          const params = {
            garageFloorId: this.setCodeObj.garageFloorId
              ? this.setCodeObj.garageFloorId
              : null,
            garageId: this.setCodeObj.garageId,
            garageRegionId: this.setCodeObj.garageRegionId
              ? this.setCodeObj.garageRegionId
              : null,
            ruleBegin: this.ruleForm.ruleBegin,
            ruleEnd: 1
          }
          this.$emit('setRegular', params)
          this.dialogVisible.show = false
        }
      })
    }
  }
}
</script>

<style>
</style>
