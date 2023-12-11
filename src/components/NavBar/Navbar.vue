<template>
  <div class="navbar clearfix">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="breadcrumb-container"
      v-if="levelList.length"
    >
      <el-breadcrumb-item v-for="item in levelList" :key="item.path">
        <router-link :to="item.redirect || item.path">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      levelList: []
    }
  },
  watch: {
    $route() {
      this.getBreadCrumb()
    }
  },
  created() {
    this.getBreadCrumb()
  },
  methods: {
    getBreadCrumb() {
      let metched = this.$route.matched.filter(item => item.name)
      const first = metched[0]
      if (
        first &&
        first.name.trim().toLocaleLowerCase() !==
          'Dashboard'.toLocaleLowerCase()
      ) {
        metched = [{ path: '/dashboard', meta: { title: 'Home' } }].concat(
          metched
        )
      }

      this.levelList = metched
    }
  }
}
</script>

<style scoped>
.navbar {
  padding: 10px;
  box-sizing: border-box;
}
</style>
