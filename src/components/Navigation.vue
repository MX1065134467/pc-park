<template>
  <div class="navigation">
    <div class="left-content">
      <img src="../assets/image/home/logo@2x.png">
      <p>{{title ? title : ''}}</p>
    </div>
    <div class="right-content">
      <div class="user-content">
        <div class="user-info">
          <el-image class="user-photo-style" :src="userPhoto" @error="errLoadImg" />
          <i>您好，{{userName}}</i>
          <el-image class="quit-photo-style" :src="logoutPhoto" title="退出系统" @click="handleCommand" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serve from '@/api/systemManage.api'
import { removerToken, removeUserInfo, getUserName } from '@/common/cache.js'
export default {
  name: 'Navigation',
  data() {
    return {
      userName: '账户',
      userPhoto: '',
      logoutPhoto: require('@/assets/image/home/logout.png'),
      title: sessionStorage.getItem('title')
    }
  },
  computed: {},
  created() {
    const useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getMsg(useInfo.userId)
    this.getUserName()
  },
  mounted() {},
  methods: {
    getUserName() {
      this.userName = getUserName()
    },
    getMsg(id) {
      serve.getPersonalInfo({ userId: id }).then(res => {
        if (res.data.code === 200) {
          const personInfo = res.data.data
          this.userName = personInfo.userName
          this.userPhoto = this.IMAGEURL + personInfo.userPhoto
        } else {
          this.$message.warning('获取数据失败!')
        }
      })
    },
    errLoadImg() {
      this.userPhoto = require('@/assets/image/home/user_picture.png')
    },
    handleCommand(data) {
      this.$confirm('确认退出系统吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        serve.signOutInfo().then(res => {
          if (res.data.code === 200) {
            sessionStorage.setItem('menu-permission', '')
            removerToken()
            removeUserInfo()
            this.$router.replace('/')
          } else {
            this.$message.warning('退出失败!')
          }
        })
      })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.navigation {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #fff;
  padding: 15px 33px;
  box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
  align-items: center;
  .left-content {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 24px;
    color: #333;
    img {
      margin-right: 12px;
    }
    p {
      padding: 0px;
    }
  }
  .right-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    .user-content {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      .user-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        .user-photo-style {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 6px;
        }
        .quit-photo-style {
          width: 30px;
          height: 30px;
        }
        i {
          font-size: 16px;
          color: #000;
          margin-right: 24px;
        }
      }
    }
  }
  .footer-wrap {
    background: rgba(215, 215, 215, 1);
    padding: 8px 0;
    bottom: 0px;
    position: fixed;
    width: 100%;
    left: 0px;
    text-align: center;
    color: #999;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
<style lang="scss">
.left-content {
  p {
    margin: 0px;
  }
}
</style>
