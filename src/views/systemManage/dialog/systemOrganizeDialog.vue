<template>
  <div class="resource-add-dialog system-organize-dialog">
    <el-dialog
      :title="menuAddDialog.title"
      :visible.sync="menuAddDialog.show"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" ref="form" :rules="rules" v-loading="loading">
        <el-form-item label="角色名称:" prop="roleName">
          <el-input
            v-model="form.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择角色状态"
            @change="changeRadio"
          >
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明:" class="textarea" prop="remarks">
          <el-input
            type="textarea"
            :rows="5"
            v-model="form.remarks"
            maxlength="120"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="menuAddDialog.show = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="handleOk"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    menuAddDialog: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      form: {
        roleName: '',
        status: null,
        remarks: '',
        parkingId: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 15, message: '角色名称不超过15个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择角色状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.form.parkingId = useInfo.parkingId
    if (this.menuAddDialog.title === '修改角色') {
      console.log(this.menuAddDialog)
      this.menuAddDialog.remarks.forEach((item) => {
        if (item.roleId === this.menuAddDialog.flag.roleId) {
          this.form.status = item.status
          this.form.remarks = item.remarks
          this.form.roleName = item.roleName
        }
      })
    }
  },
  mounted() {
    this.form = { ...this.form, ...this.menuAddDialog.flag }
  },
  methods: {
    changeRadio(val) {
      console.log(val)
      console.log(this.menuAddDialog.title)
      if (this.menuAddDialog.title === '修改角色') {
        if (val === 0) {
          this.$confirm('该角色可能还有账户在使用，是否禁用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {})
            .catch(() => {
              if (val === 0) {
                this.form.status = '启用'
              } else {
                this.form.status = '禁用'
              }
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        }
      }
    },
    handleOk() {
      this.$refs.form.validate((valid) => {
        this.loading = true
        if (valid) {
          this.loading = false
          this.menuAddDialog.show = false
          this.$emit('handleDialogShow', this.form)
          this.$message.success('操作成功')
        } else {
          this.loading = false
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped></style>
<style lang="scss">
@import "@/utils/resourceDialog.scss";
.system-organize-dialog {
  .el-form-item__content {
    width: 260px !important;
    .el-select {
      width: 100%;
    }
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
  }
  .textarea {
    .el-form-item__label {
      width: 15% !important;
    }
    .el-form-item__content {
      width: 82% !important;
    }
  }

  .el-form-item__content {
    display: flex;
    align-items: center;
  }
}
</style>
