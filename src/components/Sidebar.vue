<template>
  <div class="sidebar" ref="scrollBox">
    <el-menu router :default-active="currentPath" :unique-opened="true">
      <el-submenu v-for="menu in menuList" :key="menu.menuId" :index="String(menu.menuId)">
        <template slot="title">
          <!-- <img src=""> -->
          <i class="el-icon-menu"></i>
          <span>{{menu.menuName}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="item in menu.children" :key="item.menuId" :index="item.menuPath">{{item.menuName}}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { getMenuPermission } from '@/common/cache.js'
export default {
  name: 'Sidebar',
  props: {
    currentPath: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      menuList: [{
        name: '首页',
        submenu: [
          {
            name: '欢迎页',
            path: ''
          }
        ]
      }]
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getMenuList()
  },
  methods: {
    getMenuList() {
      const menu = getMenuPermission()
      this.menuList = menu
    }
  }
}
</script>

<style lang='scss' scoped>
.sidebar {
  width: 100%;
  // height: 100%;
  background-color: #202B35;
  .el-menu {
    border-right: none;
    background-color: #202B35;
  }
}
</style>
<style lang="scss">
.el-submenu {
  cursor: pointer;
  .el-submenu__title {
    color: #fff;
    img {
      margin-right: 5px;
    }
  }
  .el-menu--inline {
    background: #19232B;
    .el-menu-item.is-active {
      color: #409eff;
      background: #3b434a;
      box-shadow:0px 2px 8px 0px rgba(0,0,0,0.45);
      border-left: 2px solid #409eff;
    }
    .el-menu-item:focus, .el-menu-item:hover {
      background: #3b434a;
      box-shadow:0px 2px 8px 0px rgba(0,0,0,0.45);
    }
    .el-menu-item {
      color: #fff;
    }
    .el-menu-item-group__title {
      padding: 0px;
    }
  }
  .el-submenu__title:hover {
    background: #3b434a;
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.45);
  }
}
.sidebar {
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  width: 200px;
  height: calc(100vh - 64px);
}
.sidebar::-webkit-scrollbar {
  display:none
}
.aside-style:hover{
  color: red;
  .aside-style::-webkit-scrollbar {
    display: block
  }
}
.el-scrollbar__bar.is-vertical {
  width: 6px;
  top: 2px;
}
.el-scrollbar__bar {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  border-radius: 4px;
  opacity: 0;
  transition: opacity .12s ease-out;
}
.el-scrollbar__thumb {
  position: relative;
  display: block;
  width: 0px;
  height: 0;
  cursor: pointer;
  border-radius: inherit;
  background-color: rgba(144,147,153,.3);
  transition: background-color .3s;
}
</style>
