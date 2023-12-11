<template>
  <div>
    <el-dialog title="设置编号" :visible.sync="dialogVisible.show" width="40%" :before-close="handleClose" :show-close="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车场：">
              <span>{{parkingInfo.parkingName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车场编号：">
              <span>{{parkingInfo.parkingCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="车库名称：">
              <span>{{parkingInfo.garageName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车库编号：">
              <span>{{parkingInfo.numbering}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设置编号:" prop="detailCode">
              <el-input v-model="ruleForm.detailCode" placeholder="最多50字符" maxlength="50"></el-input>
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
    parkingInfo: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {
        detailCode: ''
      },
      rules: {
        detailCode: [{ required: true, message: '请输入编号', trigger: 'blur' }]
      }
    }
  },
  created() {
    if (this.parkingInfo.detailCode) {
      this.ruleForm.detailCode = this.parkingInfo.detailCode
    }
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
          const params = {
            garageDetailId: this.parkingInfo.garageDetailId,
            status: this.parkingInfo.status,
            detailCode: this.ruleForm.detailCode
          }
          this.$emit('pointSpace', params)
          this.dialogVisible.show = false
        }
      })
    }
  }
}
</script>

<style>
</style>
