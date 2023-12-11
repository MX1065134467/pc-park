<template>
  <div class="plate-account-dialog">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible.show" width="1200px" :close-on-click-modal="false">
      <el-form  v-loading="loading" :model="form" ref="form" :rules="rules" :inline="true" :label-position="labelPosition" label-width="150px">
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="姓名：" prop="userName">
              <el-input v-if="!flagTypeCheck" v-model="form.userName" placeholder="姓名(最多30字符)" maxlength="30"></el-input>
              <p v-else>{{form.userName ? form.userName : '--'}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="userPhone">
              <el-input v-if="!flagTypeCheck" v-model="form.userPhone" :disabled="flagTypeCheck?true:false" placeholder="联系电话"></el-input>
              <p v-else>{{form.userPhone ? form.userPhone : '--'}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col" v-if="flagTypeCheck">
          <el-col :span="12">
            <el-form-item label="账户类型：">
              <p>{{form.userType ? form.userType === 1 ? '平台' : form.userType === 2 ? '停车场':'--':'--'}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：">
              <p>{{form.status === 1 ? '启用' : form.status === 0 ? '停用': '--'}}</p>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="角色：">
              <p>{{form.roleName ? detailObj.roleName :'--'}}</p>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row class="el-row-col" v-if="flagTypeCheck">

          <el-col :span="12">
            <el-form-item label="添加时间：">
              <p>{{form.createTime ? form.createTime:'--'}}</p>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <div class="textarea">
              <el-form-item label="备注说明：" prop="remarks">
                <el-input v-if="!flagTypeCheck" v-model="form.remarks" type="textarea" :rows="6" placeholder="备注"></el-input>
                <p v-else>{{form.remarks ? form.remarks : '--'}}</p>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer" v-if="!flagTypeCheck">
        <el-button size="small" @click="dialogVisible.show = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleOk('form')">确 定</el-button>
      </div>

      <div slot="footer" class="dialog-footer" v-if="flagTypeCheck">
        <el-button type="primary" @click="dialogVisible.show = false">返 回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import serve from '@/api/plateform.api'
// import ImgCropper from '@c/ImgCropper/ImgCropper'
export default {
  name: '',
  components: {
    // ImgCropper
  },
  props: {
    // 模态框是否显示
    dialogVisible: {
      type: Object
    },
    // 模态框的form数据
    dialogFromData: {
      type: Object
    },
    // 模态框的title
    dialogTitle: {
      type: String
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
    return {
      labelPosition: 'left',
      updateFlag: false,
      flagTypeCheck: false,
      updateId: '',
      loading: false,
      form: {
        userName: '',
        userPhone: '',
        remarks: ''
      },
      rules: {
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      CarData: []
    }
  },
  created() {
    if (
      this.dialogFromData.flagTypeCheck === 1 ||
      this.dialogFromData.flagTypeCheck === 3
    ) {
      if (this.dialogFromData.flagTypeCheck === 1) {
        this.flagTypeCheck = true
      } else {
        this.updateFlag = true
      }
      this.updateId = this.dialogFromData.detailId
      this.getTravelDetailById(this.dialogFromData.detailId)
    } else if (this.dialogFromData.flagTypeCheck === 2) {
      console.log('添加')
    }
  },
  mounted() {},
  methods: {
    getTravelDetailById(id) {
      const params = {
        userId: id
      }
      serve.getAccountInfo(params).then(res => {
        if (res.data.code === 200) {
          this.form = res.data.data
        }
      })
    },
    handleOk(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.loading = true
          const params = {
            userName: this.form.userName,
            userPhone: this.form.userPhone,
            remarks: this.form.remarks,
            userId: this.updateId ? this.updateId : ' '
          }
          console.log(this.updateId)
          if (!this.updateId) {
            serve.addAccount(params).then(res => {
              if (res.data.code === 200) {
                this.loading = false
                this.$message.success('添加成功!')
                this.dialogVisible.show = false
                this.$emit('handleDialog')
              } else {
                this.loading = false
                this.$message.error(res.data.msg)
              }
            })
          } else {
            // 修改
            serve.updateAccount(params).then(res => {
              if (res.data.code === 200) {
                this.loading = false
                this.$message.success('修改成功!')
                this.dialogVisible.show = false
                this.$emit('handleDialog')
              } else {
                this.$message.error(res.data.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #ccc;
  margin: 0 20px;
}
::v-deep .el-scrollbar__wrap {
  height: 300px;
}
::v-deep .el-dialog__body {
  padding: 20px 30px;
  .el-form-item {
    width: 100%;
    .el-form-item__content {
      width: 70%;
      .el-cascader {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
.plate-account-dialog {
  width: 100%;
  .el-row-col {
    margin: 20px 0;
  }
  .dialog-footer {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      width: 120px;
      &:first-child {
        margin-right: 40px;
      }
    }
  }
}
</style>
