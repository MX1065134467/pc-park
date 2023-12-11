<template>
  <div class="menu-manage">
    <div class="top-nav">菜单列表</div>
    <div class="content">
      <div class="menu-list">
        <el-tree :data="data" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="add-edit">
        <div>
          <el-button size="mini" @click="insertMenu">新增</el-button>
          <el-button size="mini" @click="editMenu">编辑</el-button>
        </div>
        <div class="edit-content">
        </div>
      </div>
    </div>
    <div v-if="dialogFormVisible.show">
      <menu-dialog :title="title" :dialogFromData="menuInfo" @closeMenuDialog="menuDialogClosed" :dialogVisible='dialogFormVisible'></menu-dialog>
    </div>
  </div>
</template>

<script>
import menuDialog from './dialog/menuInfo'
import serve from '@/api/plateform.api'
export default {
  name: 'myCenter',
  components: {
    menuDialog
  },
  props: {},
  data() {
    return {
      title: '',
      currentMenu: '',
      menuInfo: {},
      dialogFormVisible: {
        show: false
      },
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      useInfo: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList()
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    getList () {
      const params = {
        isAdmin: JSON.parse(sessionStorage.getItem('userInfo')).isAdmin
      }
      serve.getSysMenuList(params).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleNodeClick(e) {
      console.log(e, 'nodeclick')
      this.currentMenu = e
    },
    menuDialogClosed () {},
    insertMenu() {
      if (this.currentMenu === '') {
        this.$message.warning('请先选择一个当前菜单，以便用于确定所添加菜单的位置')
      } else {
        this.dialogFormVisible.show = true
        this.title = '新增菜单'
        this.menuInfo = {
          id: this.currentMenu.id,
          label: this.currentMenu.label
        }
      }
    },
    editMenu() {
      if (this.currentMenu === '') {
        this.$message.warning('请先选择需要修改的菜单')
      } else {
        const params = {
          menuId: this.currentMenu.id
        }
        serve.getSysMenuById(params).then(res => {
          if (res.data.code === 200) {
            this.menuInfo = {
              spc: 'edit',
              id: this.currentMenu.id,
              label: this.currentMenu.label,
              pMenuId: res.data.data.pMenuId ? res.data.data.pMenuId : '无',
              radio: 2,
              menuName: res.data.data.menuName,
              path: res.data.data.menuPath ? res.data.data.menuPath : '无',
              order: res.data.data.orderNum,
              status: res.data.data.status + '',
              remark: res.data.data.remarks
            }
            this.title = '编辑菜单'
            this.dialogFormVisible.show = true
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-manage {
  height: 100%;
  .top-nav {
    height: 70px;
    background: #f2f2f2;
    line-height: 70px;
    font-size: 20px;
    padding-left: 20px;
  }
  .content {
    padding: 20px;
    display: flex;
    justify-content: flex-start;
    height: calc(100% - 90px);
    .edit-content {
      margin: 10px;
      margin-left: 50px;
    }
    .menu-list {
      padding: 0 20px;
      height: 100%;
      min-width: 150px;
      overflow: auto;
    }
    .add-edit {
      margin-left: 10px;
    }
  }
}
</style>
