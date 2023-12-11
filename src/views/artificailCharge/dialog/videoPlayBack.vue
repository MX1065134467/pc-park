<template>
  <div class='container'>
    <el-dialog class='paySuccessDialog' width="80%" :title="dialogVisible.title" :visible.sync="dialogVisible.show" :close-on-click-modal="false" @close='close'>
      <div class="paySuccessBox" v-if="dialogVisible.show" style="height:800px;">
        <IchinaeVmsVideo ref="video" :video-option="videoOption" :vms-option="vmsOption" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IchinaeVmsVideo from 'ichinae-vms-video'
import base from '@/api/base'

export default {
  name: '',
  components: { IchinaeVmsVideo },
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
      timer: null,
      countDown: 3, // 倒计时
      videoOption: {
        size: 1, // 分频数  1 4 6
        text: '', // 水印名字
        // fontSize: 100, // 水印大小
        disabledDb: true // 禁用双击
      },
      vmsOption: {
        ipcLinkInfo: {
          serverIP: base.vmsUrl,
          serverPort: base.serverPort
        },
        vmslogin: {
          username: base.vmslogin.username,
          password: base.vmslogin.password
        }
      }
    }
  },
  created() {},
  mounted() {
    if (this.dialogVisible.show === true) {
      this.$nextTick(() => {
        this.$refs.video.pushvideo(this.dialogFromData.name, this.dialogFromData.id)
      })
    }
  },
  watch: {},
  computed: {
  },
  methods: {
    close () {
      this.dialogVisible.show = false
      this.$emit('videoPlayBackDialog')
    }
  }
}
</script>

<style lang='scss' scoped>
// ::v-deep .el-dialog__wrapper {
//   z-index: 99999 !important;
// }
::v-deep .el-dialog {
  border-radius: 4px !important;
  box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.2) !important;
  margin-top: 3vh !important;
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
// ::v-deep .el-date-picker {
//   z-index: 999999 !important;
// }
::v-deep .el-input-group {
  width: 40% !important;
}
::v-deep .el-input-group__append {
  background-color: #409eff !important;
  .el-icon-search {
    color: #fff !important;
  }
}
.container {
  .paySuccessDialog {
    .paySuccessBox {
      padding: 10px;
    }
  }
}
</style>
