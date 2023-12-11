<template>
  <div class='account-view-dialog'>
    <el-dialog title="查看" :visible.sync="checkDialog.show" width="1000px" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="账户：">
          <!-- <span>{{this.checkDialog.concent.userId}}</span> -->
          <span>{{form.userPhone ? form.userPhone : '--'}}</span>
        </el-form-item>
        <el-form-item label="姓名：">
          <span>{{form.userName ? form.userName : '--'}}</span>
        </el-form-item>
        <el-form-item label="联系电话：">
          <span>{{form.userPhone ? form.userPhone : '--'}}</span>
        </el-form-item>
        <el-form-item label="所属管理公司：">
          <span>{{form.parkingName ? form.parkingName : '--'}}</span>
        </el-form-item>
        <el-form-item label="类型：">
          <span>{{form.userType ? form.userType === 1 ? '平台' : form.userType === 2 ? '停车场':'--':'--'}}</span>
        </el-form-item>
        <el-form-item label="状态：">
          <span>{{form.status === 0 ? '停用' : '启用'}}</span>
        </el-form-item>
        <el-form-item label="角色：">
          <span>{{form.roleName ? form.roleName : '--'}}</span>
        </el-form-item>
        <el-form-item label="添加人：">
          <span>{{form.createBy ? form.createBy : '--'}}</span>
        </el-form-item>
        <el-form-item label="添加时间：">
          <span>{{form.createTime ? form.createTime : '--'}}</span>
        </el-form-item>
        <el-form-item label="备注说明：" style="width:100%;">
          <span>{{form.remarks ? form.remarks : '--'}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="checkDialog.show = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import serve from '@/api/systemManage.api'
export default {
  name: 'accountView',
  components: {},
  props: {
    // 模态框的数据
    checkDialog: {
      type: Object
    },
    checkDialogData: {
      type: Object
    }
  },
  data() {
    return {
      viewId: '',
      form: {}
    }
  },
  created() {
    this.viewId = this.checkDialogData.userId
    this.getView(this.viewId)
  },
  mounted() {},
  methods: {
    getView(id) {
      const params = {
        userId: id
      }
      serve.getAccountInfo(params).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.form = res.data.data
        }
      })
    },
    handleOk() {}
  }
}
</script>

<style lang='scss' scoped></style>
<style lang="scss">
.account-view-dialog {
  .el-dialog {
    .el-form {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .el-form-item {
        width: 33%;
      }
    }
    .el-dialog__footer {
      text-align: center;
    }
  }
}
</style>
