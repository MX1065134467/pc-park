<template>
  <div id="basic">
    <section class="section-style">
      <header class="header-style">
        <Navigation></Navigation>
      </header>
      <section class="content-style">
        <aside class="aside-style">
          <Sidebar :currentPath="currentPath" @handleScroll="handleScroll"></Sidebar>
          <div class="el-scrollbar__bar is-vertical">
            <div class="el-scrollbar__thumb" ref="scrollbar" style="height: 14.3036%; transform: translateY(0px);">
            </div>
          </div>
        </aside>
        <main class="main-style">
          <BreadCrumbs v-show="showBreadCrumbs"></BreadCrumbs>
          <div :class="[!showBreadCrumbs ? 'main-content-wrap1' : 'main-content-wrap']">
            <!-- <transition name="fade-transform" mode="out-in"> -->
              <router-view/>
            <!-- </transition> -->
          </div>
          <div class="footer-wrap">
            <span>Copyright © {{ new Date().getFullYear() }} 北京中电兴发科技有限公司</span>
          </div>
        </main>
      </section>
    </section>
     <el-input ref="inputFocus" style="position: fixed" :autofocus="true" v-model.lazy="QRCodeNumber" type="text" @change="preparePay" v-click-outside/>
  </div>
</template>

<script>
import Sidebar from '@c/Sidebar'
import Navigation from '@c/Navigation'
import BreadCrumbs from '@c/BreadCrumbs'
import paymentMixin from '@/mixin/paymentMixin.js'
export default {
  name: 'Basic',
  mixins: [paymentMixin],
  components: {
    Sidebar,
    Navigation,
    BreadCrumbs
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (to.meta.parentPath) {
        vm.currentPath = to.meta.parentPath
      } else {
        vm.currentPath = to.path
      }
      vm.showBreadCrumbs = to.meta.title === '待收费' ? Boolean(0) : Boolean(1)
    })
  },
  beforeRouteUpdate (to, from, next) {
    if (to.meta.parentPath) {
      this.currentPath = to.meta.parentPath
    } else {
      this.currentPath = to.path
    }
    this.showBreadCrumbs = to.meta.title === '待收费' ? Boolean(0) : Boolean(1)
    console.log(this.showBreadCrumbs, 'this.showBreadCrumbs')
    next()
  },
  data() {
    return {
      currentPath: '',
      year: 2020,
      QRCodeNumber: '', // 主扫支付二维码
      showBreadCrumbs: true
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.inputFocus.focus()
    // })
  },
  methods: {
    logout() {
      this.$router.push({ name: 'login' })
    },
    handleScroll(num) {
      this.$refs.scrollbar.style.transform = `translateY(${num}px)`
    }
  }
}
</script>

<style lang="scss" scoped>
#basic {
  width: 100%;
  min-width: 1366px;
  height: auto;
  background: #f5f7f9;
  .section-style {
    min-height: 100vh;
    display: flex;
    flex: 1;
    flex-direction: column;
    .header-style {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
    }
    .content-style {
      flex: 1;
      display: flex;
      flex-direction: row;
      padding-top: 64px;
      .aside-style {
        flex: 0 0 200px;
        border-right: none;
        background-color: #202B35;
        height: calc(100vh - 64px);
        overflow-y: hidden;
        overflow-x: hidden;
        position: relative;
      }
      .main-style {
        padding: 20px 20px 0px 20px;
        // overflow-x: hidden;
        flex-grow: 1;
        .main-content-wrap {
          height: calc(100vh - 164px);
          margin-bottom: 20px;
          overflow-y: scroll;
          background: #fff;
          .fade-enter-active,
          .fade-leave-active {
            transition: opacity 0.28s
          }
          .fade-enter,
          .fade-leave-active {
            opacity: 0;
          }
          /* fade-tranform*/
          .fade-transform-leave-active,
          .fade-transform-enter-active {
            transition: all .5s;
          }
          .fade-transform-enter {
            opacity: 0;
            transform: translateX(-30px);
          }
          .fade-transform-leave-to {
            opacity: 0;
            transform: translateX(30px);
          }
        }
        .main-content-wrap1 {
          height: 100%;
          margin-bottom: 0;
          // height: calc(100vh - 110px);
          overflow-y: scroll;
          background: #fff;
          .fade-enter-active,
          .fade-leave-active {
            transition: opacity 0.28s
          }
          .fade-enter,
          .fade-leave-active {
            opacity: 0;
          }
          /* fade-tranform*/
          .fade-transform-leave-active,
          .fade-transform-enter-active {
            transition: all .5s;
          }
          .fade-transform-enter {
            opacity: 0;
            transform: translateX(-30px);
          }
          .fade-transform-leave-to {
            opacity: 0;
            transform: translateX(30px);
          }
        }
        .main-content-wrap::-webkit-scrollbar {
          display:none
        }
      }
    }
  }
  .footer-wrap {
    background: #f5f7f9;
    padding: 10px 0;
    bottom: 0px;
    position: fixed;
    width: calc(100% - 200px);
    left: 200px;
    text-align: center;
    color: #999;
    font-size: 14px;
    z-index: 9999;
  }
}
</style>
<style lang="scss">
.forbidden_btn {
  font-size: 12px !important;
  color: red !important;
}
.green {
  font-size: 12px !important;
  color: #67c23a !important;
}
</style>
