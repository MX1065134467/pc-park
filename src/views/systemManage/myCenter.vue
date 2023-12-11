
<template>
  <div class="personal-center">
    <div class="ticket-wrap">
      <div class="top-title">个人中心</div>
      <div class="content">
        <div class="avator">
          <el-image :src="avatorUrl" alt="个人头像" class="personal-avator" />
          <div class="update-avator">
            <ImgCropperBtn
              :numLimit="1"
              :imgBaseUrl="imgBaseUrl"
              @change="getImages($event)"
              @delete="deleteFile($event)"
              :introduceImg="coverList"
            />
          </div>
        </div>
        <div class="right-box">
          <div class="one-box">
            <span class="label">姓名：</span>
            <span class="label-value">{{ personInfo.userName || "--" }}</span>
          </div>
          <div class="one-box">
            <span class="label">电话：</span>
            <span class="label-value">{{ personInfo.userPhone || "--" }}</span>
            <el-button
              size="small"
              type="text"
              @click="restPhone"
              :disabled="isDisabled"
              >换绑</el-button
            >
          </div>
          <div class="one-box">
            <span class="label">状态：</span>
            <span class="label-value" v-if="personInfo.status">{{
              Number(personInfo.status) === 1 ? "启用" : "禁用"
            }}</span>
            <span class="label-value" v-else>--</span>
          </div>
          <div class="one-box">
            <span class="label">归属：</span>
            <span class="label-value" style="margin-right: 18px">{{
              personInfo.parkingName || "--"
            }}</span>
          </div>
          <div class="one-box">
            <span class="label">角色：</span>
            <span class="label-value">{{ personInfo.roleName || "--" }}</span>
          </div>
          <div class="one-box">
            <span class="label">密码：</span>
            <span class="label-value" style="margin-left: 18px">******</span>
            <el-button
              size="small"
              type="text"
              @click="dialogVisible = true"
              >修改密码</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        :label-position="labelPosition"
        label-width="150px"
      >
        <el-row class="el-row-col">
          <el-col :span="24" class="col-style">
            <el-form-item label="原密码：" prop="oldPassWord">
              <el-input
                show-password
                v-model="form.oldPassWord"
                placeholder="请输入原密码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24" class="col-style">
            <el-form-item label="新密码：" prop="newPassWord">
              <el-input
                show-password
                v-model="form.newPassWord"
                placeholder="请输入字母+数字，8位至20位，必须包含#$%&_=字符"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24" class="col-style">
            <el-form-item label="确认密码：" prop="confirmPassWord">
              <el-input
                show-password
                v-model="form.confirmPassWord"
                placeholder="请输入您的新密码"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('form')">取 消</el-button>
        <el-button size="small" type="primary" @click="handleOk('form')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="换绑手机"
      :visible.sync="phoneDialogVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="phoneForm"
        ref="phoneForm"
        :rules="phoneRules"
        :label-position="labelPosition"
        label-width="150px"
      >
        <el-row class="el-row-col">
          <el-col :span="24" class="col-style">
            <el-form-item label="原手机号：" prop="oldPhone">
              <el-input v-model="phoneForm.oldPhone" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24" class="col-style">
            <el-form-item label="新手机号：" prop="newPhone">
              <el-input
                v-model="phoneForm.newPhone"
                placeholder="请输入新手机号"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24" class="col-style">
            <el-form-item label="输入登录密码：" prop="password">
              <!-- <el-input v-model="phoneForm.password" type="password" style="position:fixed;bottom:-9999px;display:none;"></el-input> -->
              <el-input
                show-password
                v-model="phoneForm.password"
                placeholder="请输入密码"
                autocomplete="new-password"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="phoneCancel('phoneForm')"
          >取 消</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="phoneHandleOk('phoneForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import serve from '@/api/systemManage.api'
import fileServe from '@/api/file.api'
import serves from '@/api/login.api.js'
import { removerToken, removeUserInfo } from '@/common/cache.js'
import ImgCropperBtn from '@c/ImgCropper/ImgCropperBtn'
import { JSEncrypt } from 'jsencrypt'
export default {
  name: 'myCenter',
  components: {
    ImgCropperBtn
  },
  props: {},
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value !== '') {
        if (value.length < 8) {
          callback(new Error('请输入至少8-20位的密码'))
          return false
        } else if (
          !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[#$%&_=])[A-Za-z\d#$%&_=]{8,20}$/.test(
            value
          )
        ) {
          callback(new Error('请输入字母+数字+特殊字符（#$%&_=），8 位至 20 位'))
          return false
        } else {
          callback()
        }
        // callback()
      }
    }
    var validateSurePassword = (rule, value, callback) => {
      if (value !== '') {
        if (value.length < 8) {
          callback(new Error('请输入至少8位确认密码'))
          return false
        } else if (value !== this.form.newPassWord) {
          callback(new Error('两次输入密码不一致'))
          return false
        } else {
          callback()
        }
        // callback()
      }
    }
    var validatePhone = (rule, value, callback) => {
      if (value !== '') {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('手机号码有误，请重填'))
          return false
        } else {
          callback()
        }
      }
    }
    return {
      userPhoto: '', // 未上传头像的时候默认变量
      RSAPublicParkKey: '',
      labelPosition: 'right',
      imgBaseUrl: this.IMAGEURL,
      avatorUrl: '',
      coverList: [],
      personInfo: {},
      dialogVisible: false,
      phoneDialogVisible: false,
      isDisabled: false,
      userId: '',
      form: {
        oldPassWord: '',
        newPassWord: '',
        confirmPassWord: ''
      },
      phoneForm: {
        oldPhone: '',
        newPhone: '',
        password: ''
      },
      rules: {
        oldPassWord: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassWord: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassWord: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validateSurePassword, trigger: 'blur' }
        ]
      },
      phoneRules: {
        newPhone: [
          { required: true, message: '请输入新手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.useInfo.isInitPwd === 1) {
      this.$message.warning('请修改初始密码')
      this.dialogVisible = true
    } else {
      this.dialogVisible = false
    }
    if (this.useInfo.isAdmin === 1 && this.useInfo.userType === 1) {
      this.isDisabled = true
    }
    this.getMsg()
    this.getTitle()
  },
  mounted() {},
  methods: {
    async getMsg() {
      const useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.userId = useInfo.userId
      const res = await serve.getPersonalInfo({ userId: this.userId })
      console.log(res)
      if (res.data.code === 200) {
        this.personInfo = res.data.data
        if (this.personInfo.userPhoto) {
          this.avatorUrl = this.imgBaseUrl + this.personInfo.userPhoto
          console.log(this.avatorUrl, 'this.avatorUrl')
        } else if (!this.personInfo.userPhoto) {
          this.userPhoto = require('@/assets/image/home/user_picture.png')
          this.avatorUrl = this.userPhoto
        }
        // const arr = this.personInfo.roleName.split(',')
        // const roleName = Array.from(new Set(arr))
        // this.personInfo.roleName = roleName.join(',')
        this.phoneForm.oldPhone = res.data.data.userPhone
      } else {
        this.$message.warning('获取数据失败!')
      }
    },
    async getImages(file) {
      const params = new FormData()
      params.append('file', file)
      const res = await fileServe.uploadSingleFile(params)
      if (res.data.code === 200) {
        const imgurl = res.data.data.filePath
        this.uploadAvator(imgurl)
      } else {
        this.$message.warning(res.data.msg)
      }
    },
    // 上传头像
    async uploadAvator(imgurl) {
      const params = {
        userId: this.personInfo.userId,
        userPhoto: imgurl
      }
      const suc = await serve.updatePersonalInfo(params)
      if (suc.data.code === 200) {
        this.$message.success('修改头像成功!')
        if (this.avatorUrl) {
          await this.deleteFile(this.personInfo.userPhoto)
        }
        await this.getMsg()
        this.$router.go(0)
      }
    },
    // 删除之前的图片
    deleteFile(fileurl) {
      const params = {
        fileId: fileurl
      }
      fileServe.deleteImg(params).then((res) => {
        if (res.data.code === 200) {
          this.avatorUrl = ''
        }
      })
    },
    getTitle () {
      serves.getTitles().then(res => {
        this.RSAPublicParkKey = res.data.RSAPublicParkKey
      })
    },
    // 修改密码
    cancel(form) {
      this.$refs[form].resetFields()
      this.dialogVisible = false
    },
    handleOk(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.form.oldPassWord === this.form.newPassWord) {
            this.$message.warning('新密码与原密码不能一样!')
            return false
          } else {
            const params = {
              oldPassWord: this.encryptedData(this.form.oldPassWord),
              newPassWord: this.encryptedData(this.form.newPassWord),
              confirmPassWord: this.encryptedData(this.form.confirmPassWord)
            }
            serve.updatePassword(params).then((res) => {
              if (res.data.code === 200) {
                this.$message.success('密码修改成功,请重新登录！')
                this.$refs[form].resetFields()
                this.dialogVisible = false
                removerToken()
                removeUserInfo()
                this.$router.replace('/')
              } else {
                this.$message.warning(res.data.msg)
              }
            })
          }
        }
      })
    },
    encryptedData(data) {
      // 新建JSEncrypt对象
      const encryptor = new JSEncrypt()
      const publicKey = this.RSAPublicParkKey
      // const psd = decode(publicKey)
      // const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCMsc8msY5QIlklXm5dA1t2Bjlxy/e3GWvsUWbRRVoJPououJ7MFX75X5cCc6rdgeHIiIdRo9guomrcFwQPvSDZI4wfmfIuPUlkGyANf+CTHCUXlNhn41fiLKbmwYbkosIzcD3LSG36x/1jekZN0/f2YYyEhvlmlAXPkcBBNuWAqwIDAQAB'
      // 设置公钥
      encryptor.setPublicKey(publicKey)
      // 加密数据
      return encryptor.encrypt(data)
    },
    restPhone() {
      this.phoneDialogVisible = true
      window.sessionStorage.removeItem('userPhone')
      this.phoneForm.newPhone = ''
      this.phoneForm.password = ''
    },
    // 修改手机号
    phoneCancel(form) {
      console.log(form)
      this.$refs[form].resetFields()
      this.phoneDialogVisible = false
    },
    phoneHandleOk(form) {
      if (this.phoneForm.oldPhone === this.phoneForm.newPhone) {
        this.$message.warning('新手机号码与原手机号码不能一样!')
        return false
      } else {
        const params = {
          password: this.phoneForm.password,
          userPhone: this.phoneForm.newPhone
        }
        serve.updatePhone(params).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('手机号修改成功,请重新登录！')
            this.$refs[form].resetFields()
            this.phoneDialogVisible = false
            removerToken()
            removeUserInfo()
            this.$router.replace('/')
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #ccc;
  margin: 0 20px;
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
.personal-center {
  width: 100%;
  height: 100%;
  background: #ffffff;
  .top-title {
    font-weight: 700;
    height: 60px;
    line-height: 60px;
    padding: 0 30px;
    width: calc(100% - 60px);
    color: #333333;
  }
  .content {
    display: flex;
    justify-content: flex-start;
    padding: 10px 120px;
    width: calc(100% - 240px);
    height: 100%;
    .avator {
      display: flex;
      flex-direction: column;
      .personal-avator {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: #ccc;
      }
      .update-avator {
        text-align: center;
      }
    }
    .right-box {
      width: 70%;
      margin-left: 100px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 20px;
      // background: pink;
      .one-box {
        width: 45%;
        height: 50px;
        line-height: 50px;
        margin-right: 5%;
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-start;
        .label {
          width: 30%;
          font-weight: 700;
        }
        .label-value {
          width: 70%;
        }
      }
    }
  }
  .el-row-col {
    margin: 20px;
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
