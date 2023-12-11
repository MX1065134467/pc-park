<template>
  <div class='role'>
    <div class="panel-style">
      <div class="panel-head-style">
        <span>角色管理</span>
        <span>
          <el-button size="mini" type="primary" plain @click="openRoleDialog('新增角色')" :disabled="isDisabled">新增</el-button>
          <el-button size="mini" type="primary" plain @click="openRoleDialog('修改角色')" :disabled="isDisabled">编辑</el-button>
        </span>
      </div>
      <ul class="panel-body-style">
        <li class="role-style"
        v-show="isShow"
          v-for="item in roleData"
          :key="item.roleId"
          :style="{background: activeRoleId === item.roleId ? '#F5F7FA' : '#ffffff'}"
          @click="getRolePower(item)">
          {{ item.roleName }}</li>
          <el-tree :data="roleData" :props="roleProps" @node-click="getRolePower" node-key="roleId" ref="tree" default-expand-all :expand-on-click-node="false" :highlight-current="true">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
          <el-button
            type="text"
            size="mini"
            v-if="data.status === 0">
            (禁用)
          </el-button>
          <el-button
            type="text"
            size="mini"
            v-if="data.status === 1">
            (启用)
          </el-button>
        </span>
            </span>
          </el-tree>
      </ul>
    </div>
    <div class="set-style">
      <el-button type="primary" @click="savePower" :disabled="isDisabled">关联菜单</el-button>
    </div>
    <div class="panel-style">
      <div class="panel-head-style">
        <span>对应菜单</span>
      </div>
      <div class="panel-body-style">
        <el-tree
          ref="tree"
          node-key="menuId"
          show-checkbox
          default-expand-all
          :data="menusData"
          :props="menusProps"
          :default-checked-keys="checkedMenusList">
        </el-tree>
      </div>
    </div>
    <div v-if="roleDialog.show">
      <system-organize-dialog  v-bind:menuAddDialog="roleDialog" @handleDialogShow="affirmRole"  />
    </div>
  </div>
</template>

<script>
import serve from '@/api/systemManage.api'
import SystemOrganizeDialog from './dialog/systemOrganizeDialog'
// import serve from '../../api/systemManage.api'
export default {
  name: 'role',
  components: {
    SystemOrganizeDialog
  },
  props: {},
  data() {
    return {
      superMenuId: [],
      roleData: [],
      menusData: [],
      menusProps: {
        children: 'children',
        label: 'menuName'
      },
      roleProps: {
        children: 'children',
        label: 'label'
      },
      isDisabled: false,
      checkedMenusList: [],
      roleDialog: {
        title: '',
        show: false,
        flag: null,
        remarks: ''
      },
      activeRoleId: '',
      activeRole: '',
      useInfo: '',
      userId: '',
      isShow: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (this.useInfo.isAdmin === 1 && this.useInfo.userType === 1) {
      this.isDisabled = true
    }
    this.userId = this.useInfo.userId
    this.getRoleList()
    this.getMenuList()
    // this.getMenuAllList()
  },
  mounted() {
  },
  beforeDestroy() {},
  methods: {
    async getRoleList() { // 获取角色列表
      const res = await serve.getRoleList()
      if (res.data.code === 200) {
        this.roleTree(res.data.data)
        this.roleDialog.remarks = res.data.data.sysRole
        this.activeRoleId = ''
        this.activeRole = ''
        // this.$refs.tree.setCheckedKeys([])
      } else {
        this.$message.error(res.data.msg ? res.data.msg : '获取数据失败')
      }
    },
    async getMenuList() { // 获取菜单列表
      const res = await serve.getMenuList()
      if (res.data.code === 200) {
        const menu = this.menuTree(res.data.data)
        this.menusData = menu
      } else {
        this.$message.error(res.data.msg ? res.data.msg : '获取数据失败')
      }
    },
    async getPower(id) { // 获取权限
      const res = await serve.getPower({ roleId: id })
      if (res.data.code === 200) {
        this.handlePower(res.data.data)
      } else {
        this.$message.error(res.data.msg ? res.data.msg : '查询权限信息失败')
      }
    },
    async addPower(data) { // 增加权限
      const res = await serve.addPower(data)
      if (res.data.code === 200) {
        this.$message.success('关联权限成功')
      } else {
        this.$message.error(res.data.msg ? res.data.msg : '查询权限信息失败')
      }
    },
    async affirmRole(data) { // 新增/修改角色
      let res, resMsg
      if (data.roleId) {
        res = await serve.updateRole(data)
        resMsg = '修改角色失败'
      } else {
        res = await serve.addRole(data)
        resMsg = '添加角色失败'
      }
      if (res.data.code === 200) {
        this.getRoleList()
      } else {
        this.$message.error(res.data.msg ? res.data.msg : resMsg)
      }
    },
    handlePower(data) { // 移除父菜单id
      const menuTreeId = []
      data.map(item => {
        if (this.superMenuId.indexOf(item.menuId) === -1) {
          menuTreeId.push(item.menuId)
        }
      })
      this.$refs.tree.setCheckedKeys(menuTreeId)
    },
    savePower() {
      console.log(this.activeRoleId)
      if (this.activeRoleId === '') {
        this.$message.warning('请选择角色')
        return
      }
      const menuPower = []
      const checkedMenu = this.$refs.tree.getCheckedNodes(false, true)
      console.log(checkedMenu)
      checkedMenu.map(item => {
        console.log(item)
        menuPower.push({
          menuId: item.menuId,
          parkingId: this.useInfo.parkingId,
          roleId: this.activeRoleId
        })
      })
      this.addPower(menuPower)
    },
    openRoleDialog(title) {
      this.roleDialog.title = title
      this.roleDialog.flag = null
      if (title === '修改角色') {
        const isEdit = this.activeRoleId !== ''
        if (!isEdit) this.$message.warning('请选择角色')
        this.roleDialog.flag = isEdit ? this.activeRole : null
        this.roleDialog.show = isEdit ? Boolean(1) : Boolean(0)
      } else {
        this.roleDialog.show = true
      }
    },
    getRolePower(data) {
      this.activeRoleId = data.roleId
      this.activeRole = data
      this.$refs.tree.setCheckedKeys([])
      if (!data.children) {
        this.getPower(data.roleId)
      }
    },
    // 处理角色数据
    roleTree(data) {
      const that = this
      if (data.parse === null) {
        that.isShow = true
      } else {
        const arr = []
        const dataArray = JSON.parse(JSON.stringify(data))
        dataArray.sysRole.forEach(item => {
          arr.push({ label: item.roleName, roleId: item.roleId, status: item.status })
        })
        // console.log(that.status)
        const arrList = {
          label: data.parkIngName,
          children: arr
        }
        const arr1 = []
        arr1.push(arrList)
        // console.log(arr1)
        that.roleData = arr1
      }
    },
    menuTree(data) { // 组装菜单数据
      const menu = []
      this.superMenu = []
      data.map(item => {
        // console.log(item, 3333)
        if (item.pMenuId) {
          const index = menu.findIndex(subItem => subItem.menuId === item.pMenuId)
          if (!menu[index].children) {
            menu[index].children = []
          }
          menu[index].children.push(item)
        } else {
          this.superMenuId.push(item.menuId)
          menu.push(item)
        }
      })
      return menu
    }
  }
}
</script>

<style lang="scss" scoped>
.role {
  height: calc(100% - 40px);
  padding: 20px 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .panel-style {
    width: 30%;
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    border: 1px solid #EBEEF5;
    color: #303133;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    .panel-head-style {
      width: 100%;
      flex: 0 0 60px;
      line-height: 60px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      span {
        font-size: 20px;
        font-weight: bold;
      }
    }
    .panel-body-style {
      flex: 1;
      overflow-y: auto;
      .role-style {
        height: 40px;
        line-height: 40px;
        padding-left: 18px;
        cursor: pointer;
        &:hover {
          background: #F5F7FA !important;
        }
      }
    }
    .panel-body-style::-webkit-scrollbar {
      display: none;
    }
  }
  .set-style {
    width: 30%;
    height: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
