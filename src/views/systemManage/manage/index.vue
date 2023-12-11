<template>
  <div class='manage'>
    <!-- <div v-if="isShow">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基础信息" name="first" :key="1">
        <basics />
      </el-tab-pane>
        <el-tab-pane label="财务管理" name="second" :key="2">
          <finance />
        </el-tab-pane>
      <el-tab-pane label="分账记录" name="third" :key="3">
        <sub-account />
      </el-tab-pane>
    </el-tabs>
    </div> -->
    <div>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="first" :key="1">
        <basics />
        </el-tab-pane>
        <el-tab-pane label="分账记录" name="third" :key="2">
          <sub-account />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Basics from './basics'
// import Finance from './finance'
import SubAccount from './subaccount'
export default {
  name: 'manage',
  components: {
    Basics,
    // Finance,
    SubAccount
  },
  props: {},
  data() {
    return {
      activeName: 'first',
      pageNo: 1,
      pageSize: 10,
      isShow: true
    }
  },
  computed: {},
  watch: {},
  created() {
    // this.useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // // 1  凤凰 显示一个 2 赫章 显示两个
    // if (this.useInfo.payScenes === '1') {
    //   this.isShow = false
    // } else if (this.useInfo.payScenes === '2') {
    //   this.isShow = true
    // }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
    }
  }
}
</script>

<style lang="scss" scoped></style>
