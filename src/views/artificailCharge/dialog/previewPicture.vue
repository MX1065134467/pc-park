<template>
  <div class='previewPicture'>
    <el-dialog class='previewPictureDialog' width="70%" :title="dialogVisible.title" :visible.sync="dialogVisible.show" :close-on-click-modal="false">
      <div class="previewPictureContainer">
        <img :src="currentImg" alt="">
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  props: {
    // 模态框是否显示
    dialogVisible: {
      type: Object
    },
    //  模态框的form数据
    dialogFromData: {
      type: Object
    }
  },
  data() {
    return {
      currentImg: this.dialogFromData.currentImg
    }
  },
  created() {},
  mounted() {},
  watch: {},
  computed: {
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-dialog__wrapper {
  z-index: 99999999999 !important;
}
::v-deep .el-dialog {
  border-radius: 4px !important;
  box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.2) !important;
  margin-top: 10vh !important;
    .el-dialog__header {
      padding: 20px 0 20px !important;
      margin: 0 !important;
      border-bottom: 1px solid #e6e6e6 !important;
      .el-dialog__title {
        margin-left: 20px !important;
        font-size: 16px;
        font-weight: 600;
        color: #000000;
      }
    }
  .el-dialog__body {
    padding: 0 !important;
  }
}
.previewPictureContainer {
    padding: 30px;
    img {
      width: 100%;
    }
}
</style>
