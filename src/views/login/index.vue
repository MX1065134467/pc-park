<template>
  <el-container class="login">
    <el-main class="main">
      <div class="login-gray">
        <div class="login-box">
          <div class="login-title">
            <img src="../../assets/image/home/logo@2x.png">
            <p>{{title ? title : ''}}</p>
          </div>
          <el-form :model="ruleForm" :label-position="labelPosition" label-width="80px" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="账号：" prop="account">
              <el-input v-model.trim="ruleForm.account" placeholder="登录账户手机号"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input type="password" v-model.trim="ruleForm.password" @keyup.enter.native="login('ruleForm')" placeholder="密码"></el-input>
            </el-form-item>
            <span class="forgetPswd">*如有遗忘，请联系管理员</span>
            <el-button class="login-btn" type="primary" @click="login('ruleForm')" @keyup.enter="login('ruleForm')" style="width: 100%;">登录</el-button>
          </el-form>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import serve from '@/api/login.api.js'
import { JSEncrypt } from 'jsencrypt'
// import { decode } from 'js-base64'
import { saveToken, saveUserInfo, saveMenuPermission } from '@/common/cache.js'
export default {
  name: 'Login',
  components: {},
  props: {},
  data() {
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
      title: '',
      RSAPublicParkKey: '',
      timer: null,
      count: 60,
      valiadFont: '获取验证码',
      labelPosition: 'left',
      ruleForm: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  watch: {},
  created() {
    this.getTitle()
  },
  mounted() {},
  methods: {
    sendCode() {
      if (this.ruleForm.account === '') {
        this.$message({
          message: '请输入手机号码！',
          type: 'warning'
        })
      } else {
        if (!/^1[3456789]\d{9}$/.test(this.ruleForm.account)) {
          this.$message({
            message: '您输入的手机号有误，请重新填写！',
            type: 'warning'
          })
          return false
        } else {
          this.getSeconds()
        }
      }
    },
    getTitle () {
      serve.getTitles().then(res => {
        this.title = res.data.systemName
        this.RSAPublicParkKey = res.data.RSAPublicParkKey
        sessionStorage.setItem('title', this.title)
      })
    },
    getSeconds() {
      const that = this
      if (this.valiadFont === '获取验证码') {
        const timer = setInterval(function() {
          that.count--
          that.valiadFont = that.count + 'S'
          if (that.count <= 0) {
            clearInterval(timer)
            that.count = 60
            that.valiadFont = '获取验证码'
          }
        }, 1000)
      }
    },
    login(ruleForm) {
      // this.$router.push({ name: 'basic' })
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          const parmas = {
            loginName: this.ruleForm.account,
            passWord: this.encryptedData(this.ruleForm.password)
          }
          serve.login(parmas).then(res => {
            if (res.data.code === 200) {
              const data = res.data.data
              const menu = this.menuTree(data.sysMenuList)
              saveMenuPermission(menu)
              saveToken(data.token)
              saveUserInfo(data.userInfo)
              this.$router.push({ name: 'basic' })
            } else {
              this.$message.warning(res.data.msg)
            }
          })
        }
      })
    },
    menuTree(data) { // 组装菜单数据
      const menu = []
      data.map(item => {
        if (item.pMenuId) {
          const index = menu.findIndex(subItem => subItem.menuId === item.pMenuId)
          if (!menu[index].children) {
            menu[index].children = []
          }
          menu[index].children.push(item)
        } else {
          menu.push(item)
        }
      })
      return menu
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
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100vh;
  background: #f6f6f6;
  .header {
    color: #ffffff;
    font-size: 28px;
    padding: 5px 20px 10px 5px;
    background: #336666;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    img {
      width: 85px;
      margin-top: 2px;
    }
  }
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px;
    background: url('../../assets/image/home/flag.png') no-repeat;
    background-size: cover;
    .login-gray {
      // width: 27%;
      width: 520px;
      .login-box {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 14px 28px 0px rgba(17, 32, 72, 0.4);
        width: 100%;
        text-align: center;
        border-radius: 8px;
        .login-title {
          background: url('../../assets/image/home/login_bg.png');
          height: 250px;
          color: #fff;
          font-size: 32px;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          img {
            margin-bottom: 23px;
            width: 200px;
          }
        }
        form {
          padding: 60px 100px;
        }
        .vailidate-code {
          display: flex;
        }
        .forgetPswd {
          float: right;
          color: #336666;
          font-size: 12px;
          margin-top: -10px;
        }
        .login-btn {
          width: 70%;
          margin: 20px auto;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.login {
  .el-form-item__label {
    font-size: 16px;
  }
}
</style>
