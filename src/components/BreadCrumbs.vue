<template>
  <div class="crumbs">
    <div class="directory">
      <img src="../assets/image/directory.svg">
    </div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) of routerList" :key="index" :to="item.path">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routerList: []
    }
  },
  mounted() {
    this.handlerouterChange()
  },
  methods: {
    handlerouterChange() {
      this.routerList = []
      for (const routeInfo of this.$route.matched) {
        if (routeInfo.path !== '/login' && routeInfo.path !== '/basic') {
          // 二级
          if (this.$route.meta.firstMenu) {
            const obj = {
              name: this.$route.meta.firstMenu,
              path: this.$route.meta.parentPath
            }
            this.routerList.push(obj)
          }
          // 三级
          if (this.$route.meta.secondMenu) {
            const obj = {
              name: this.$route.meta.secondMenu,
              path: this.$route.meta.parentPath
            }
            this.routerList.push(obj)
          }
          // 如果路由有多个相同的name值时，在meta中添加一个title属性
          routeInfo.name = this.$route.meta.title
          this.routerList.push(routeInfo)
          this.routerList = this.routerList.from(new Set(this.routerList))
        }
      }
    }
  },
  watch: {
    $route: {
      handler: function() {
        this.handlerouterChange()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
$bgcolor: #ffffff;
$color: #333333;
.crumbs {
  color: $color;
  // background: $bgcolor;
  padding: 15px;
  padding-top: 0px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 0px;
  .el-breadcrumb {
    font-size: 16px;
  }
  .directory {
    margin-right: 10px;
    width: 26px;
    height: 26px;
    img {
      width: 100%;
    }
  }
}
</style>
