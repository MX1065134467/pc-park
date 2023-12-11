<template>
  <div class="equip-type-dialog">
    <el-dialog  :title="dialogTitle" :visible.sync="dialogVisible.show" width="800px" :close-on-click-modal="false">
      <el-form v-loading="loading" :model="form" ref="form" :rules="rules" :inline="true" :label-position="labelPosition" label-width="150px">
        <el-row class="el-row-col">
          <el-col :span="24">
            <el-form-item label="类型名称：" prop="equipName">
              <el-input v-if="!flagTypeCheck" v-model="form.equipName" placeholder="类型名称(最多30字符)" maxlength="30"></el-input>
              <p v-else>{{form.equipName ? form.equipName : '--'}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24">
            <div class="textarea">
              <el-form-item label="备注说明：" prop="remarks">
                <el-input v-if="!flagTypeCheck" v-model="form.remarks" type="textarea" :rows="6" placeholder="备注(最多255字符)" maxlength="255"></el-input>
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
import serve from '@/api/basicEquip.api'
export default {
  name: '',
  components: {},
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
    return {
      loading: false,
      labelPosition: 'left',
      updateFlag: false,
      flagTypeCheck: false,
      updateId: '',
      imgBaseUrl: '',
      form: {
        equipName: '',
        remarks: ''
      },
      rules: {
        equipName: [
          { required: true, message: '类型名称不能为空', trigger: 'blur' }
        ]
      }
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
      this.getEquipTypeDetailById(this.dialogFromData.detailId)
    } else if (this.dialogFromData.flagTypeCheck === 2) {
      console.log('添加')
    }
  },
  mounted() {},
  methods: {
    getEquipTypeDetailById(id) {
      const parmas = {
        equipTypeId: id
      }
      serve.getEquipById(parmas).then(res => {
        if (res.data.code === 200) {
          this.form.equipName = res.data.data.equipName
          this.form.remarks = res.data.data.remarks
        }
      })
    },
    handleOk(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.updateId) {
            this.form.equipTypeId = this.updateId
            serve.updateEquipType(this.form).then(res => {
              if (res.data.code === 200) {
                this.$message.success('修改成功!')
                this.$emit('handleDialog')
                this.loading = false
              } else {
                this.loading = false
                this.$message.error(res.data.msg)
              }
            })
          } else {
            serve.addEquipType(this.form).then(res => {
              if (res.data.code === 200) {
                this.$message.success('添加成功!')
                this.$emit('handleDialog')
                this.loading = false
              } else {
                this.loading = false
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
    }
  }
}
.equip-type-dialog {
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
