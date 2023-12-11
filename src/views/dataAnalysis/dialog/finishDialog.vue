<template>
  <div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible.show" width="800px" :close-on-click-modal="false">
      <div class="report">
        <div class="tip-font">报表生成中</div>
        <div class="icon-box">
          <span class="icon">
            <i class="el-icon-circle-check"></i>
          </span>
          <span class="icon-font">
            报表生成异步处理，需要耗费一段时间 请稍后到历史报表中查看下载
          </span>
        </div>
        <!-- <div class="loading">
          <i class="el-icon-loading"></i>
        </div> -->
        <el-button type="primary" @click="back">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {
    dialogVisible: {
      type: Object
    },
    reportData: {
      type: Object
    }
  },
  data() {
    return {
      dialogTitle: '报表提醒'
    }
  },
  methods: {
    back() {
      this.dialogVisible.show = false
    }
  },
  created() {
    console.log(this.reportData)
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-radius: 8px 8px 2px 2px;
  border-bottom: 1px solid #cccccc;
}
.report {
  width: 100%;
  text-align: center;
  .tip-font {
    margin-top: 20px;
    font-size: 24px;
    color: #333333;
  }
  .icon-box {
    margin: 0 auto;
    margin-top: 70px;
    width: 600px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    .icon {
      display: inline-block;
      width: 30%;
      font-size: 150px;
      color: red;
    }
    .icon-font {
      margin-top: 30px;
      display: inline-block;
      width: 70%;
      font-size: 18px;
      line-height: 40px;
    }
  }
  .loading {
    font-size: 40px;
    margin-bottom: 80px;
  }
}
</style>
