<template>
  <div class='reminder-modal'>
    <div class='resource-add-dialog reminder-modal'>
      <el-dialog :title="message.title" :visible.sync="message.show" width="700px" :close-on-click-modal="false">
        <div class="conntent-message">
          <slot name="content"></slot>
        </div>
        <div slot="footer" class="dialog-footer" v-if="!message.isFooterShow">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleOk">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  props: {
    message: {
      type: Object
    }
  },
  data () {
    return {
      isFooterShow: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    // 确定
    handleOk() {
      this.message.show = false
      this.$emit('handleDialog', this.message)
    },
    handleCancel() {
      this.message.show = false
      this.$emit('handleDialogCancel')
    }
  }
}
</script>

<style lang='scss' scoped>
.reminder-modal {
  .conntent-message {
    font-size: 32px;
    font-weight: 700;
    width: 100%;
    text-align: center;
  }
}
</style>
<style lang="scss">
@import "@/utils/resourceDialog.scss";
.reminder-modal {
  .el-dialog__body {
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
