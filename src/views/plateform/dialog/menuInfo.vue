<template>
  <div class="menu-info">
    <el-dialog :title="title" :visible.sync="dialogVisible.show" width="50%" :before-close="handleClose" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-row class="el-row">
          <el-col :span="12">
            <el-form-item label="当前菜单：">
              <span>{{dialogFromData.label ? dialogFromData.label : '无'}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单级别：" prop="radio">
              <el-radio-group v-model="ruleForm.radio">
                <el-radio :label="1">顶级</el-radio>
                <el-radio :label="2">同级</el-radio>
                <el-radio :label="3" v-if="!dialogFromData.spc">下级</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="el-row">
          <el-col :span="12">
            <el-form-item label="菜单名称：" prop="menuName">
              <el-input v-model="ruleForm.menuName" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单路径：" prop="path">
              <el-input v-model="ruleForm.path" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单顺序：" prop="order">
              <el-input v-model="ruleForm.order"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态:" prop="status">
              <el-select v-model="ruleForm.status">
                <el-option label="正常" value="1"></el-option>
                <el-option label="异常" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row  class="el-row">
          <el-col :span="12">
            <el-form-item label="菜单图标：" prop="">
              <ImgCropper :numLimit="1" :imgBaseUrl="IMAGEURL" :postCropWidth="20" :postCropHeight="20" @change="getImages($event)" @delete="deleteFile($event)" :introduceImg="coverList">
                建议正方形小图
              </ImgCropper>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row class="el-row">
          <el-col :span="18">
            <el-form-item label="说明:" prop="remark">
              <el-input v-model="ruleForm.remark" type="textarea" :rows="6" maxlength="500"></el-input>
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
// import ImgCropper from '@c/ImgCropper/ImgCropper'
import serve from '@/api/plateform.api'
export default {
  props: {
    dialogVisible: {
      type: Object
    },
    title: {
      type: String
    },
    dialogFromData: {
      type: Object
    }
  },
  components: {
    // ImgCropper
  },
  data() {
    return {
      ruleForm: {
        radio: '',
        menuName: '',
        path: '',
        order: '',
        status: '',
        remark: ''
      },
      rules: {
        radio: [
          { required: true, message: '请设置菜单级别', trigger: 'change' }
        ],
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        path: [{ required: true, message: '请输菜单路径', trigger: 'blur' }],
        order: [{ required: true, message: '请输入菜单顺序', trigger: 'blur' }],
        status: [
          { required: true, message: '请选择菜单状态', trigger: 'change' }
        ]
      },
      // 存放图片
      fileList: [],
      coverList: []
    }
  },
  created() {
    console.log(this.dialogFromData, 'dialogFromData')
    if (this.dialogFromData.spc && this.dialogFromData.spc === 'edit') {
      this.ruleForm = this.dialogFromData
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible.show = false
    },
    cancel(ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.dialogVisible.show = false
    },
    dialogOk(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          const params = {
            isAdmin: JSON.parse(sessionStorage.getItem('userInfo')).isAdmin,
            menuId: this.dialogFromData.id,
            menuLevel: this.ruleForm.radio * 1,
            menuName: this.ruleForm.menuName,
            menuPath: this.ruleForm.path,
            orderNum: this.ruleForm.order,
            remarks: this.ruleForm.remark,
            status: this.ruleForm.status * 1
          }
          // 编辑
          if (this.dialogFromData.spc && this.dialogFromData.spc === 'edit') {
            serve.updateSysMenu(params).then(res => {
              if (res.data.code === 200) {
                this.$message.success('修改成功,重新登录系统后生效')
                // this.$emit('closeMenuDialog')
              } else {
                this.$message.error(res.data.msg)
              }
            })
          } else {
            // 新增
            serve.insertSysMenu(params).then(res => {
              if (res.data.code === 200) {
                this.$message.success('新增成功,重新登录系统后生效')
                // this.$emit('closeMenuDialog')
              } else {
                this.$message.error(res.data.msg)
              }
            })
          }
          this.dialogVisible.show = false
        }
      })
    },
    getImages(file) {
      this.fileList.push(file.file)
    },
    deleteFile(file) {
      this.deleteFileList = file
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-info {
  .el-row {
    margin-top: 20px;
  }
}
::v-deep .upload-box .avatar-uploader-box .avatar-uploader .el-upload {
  width: 50px;
  height: 50px;
}
::v-deep .upload-box .avatar-uploader-box .avatar-uploader .avatar-uploader-icon {
  width: 50px;
  height: 50px;
  line-height: 50px;
}
</style>
