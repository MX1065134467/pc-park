<template>
  <div class="upload-btn-box">
    <div class="avatar-uploader-box">
      <!-- 方框样式 -->
      <el-upload
        :action="actionUrl"
        :auto-upload="false"
        :on-change="handleAvatarChange"
        :show-file-list="false"
        accept="image/*"
        class="avatar-uploader"
        ref="avatarUploader"
        :disabled="isDisabled">
        <el-button size="small" type="text" :disabled="isDisabled">更换</el-button>
      </el-upload>

      <!-- 上传提示文字样式 -->
      <div class="upload-tip">
        <slot></slot>
      </div>
    </div>

    <!-- 裁剪图片 start-->
    <vue-cropper-item @confirm="confirmCropper" ref="VueCropperItem" />
    <!-- 裁剪图片 end-->
  </div>
</template>

<script>
import vueCropperItem from './ImgCropperCircle'
export default {
  name: 'ImgCropperBtn',
  components: {
    vueCropperItem
  },
  props: {
    sizeLimit: {
      // 最大单文件大小
      type: Number,
      default: 10
    },
    postCropWidth: {
      // 裁剪后图片宽度
      type: Number,
      default: 0
    },
    postCropHeight: {
      // 裁剪后图片高度
      type: Number,
      default: 0
    },
    isCompress: {
      // 是否压缩
      type: Boolean,
      default: true
    },
    compress: {
      // 压缩率
      type: String,
      default: '0.8'
    }
  },
  data() {
    return {
      loading: false,
      actionUrl: '',
      isDisabled: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    // if (this.useInfo.isAdmin === 1 && this.useInfo.userType === 1) {
    //   this.isDisabled = true
    // }
  },
  methods: {
    // 上传之前
    beforeAvatarUpload(file) {
        console.log(file, 9999)
      return new Promise((resolve, reject) => {
        if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(file.name)) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject('上传图片只能是JPG或PNG格式!')
        }

        if (file.size > this.sizeLimit * 1024 * 1024) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject(`上传图片大小不能超过${this.sizeLimit}M!`)
        }

        resolve('符合表單規則')
      })
    },
    // 上传改变
    async handleAvatarChange(file, fileList) {
      try {
        await this.beforeAvatarUpload(file)
        this.showVueCropperItem(file)
      } catch (e) {
        this.$message.warning(JSON.stringify(e))
      }
    },
    async uploadOssApi(data) {
      this.$emit('change', data)
    },
    // 显示裁剪框
    showVueCropperItem(file) {
      this.$refs.VueCropperItem.init()
      this.$refs.VueCropperItem.fileName = file.name
      this.$refs.VueCropperItem.options.img = URL.createObjectURL(file.raw)
      this.setVueCropperOptions()
    },
    // 确认裁剪后上传
    async confirmCropper(file) {
      this.loading = true
      await this.uploadOssApi(file)
      this.loading = false
    },
    // 设置裁剪的配置
    setVueCropperOptions() {
      this.$refs.VueCropperItem.postCropWidth = this.postCropWidth
      this.$refs.VueCropperItem.postCropHeight = this.postCropHeight
      this.$refs.VueCropperItem.isCompress = this.isCompress // 是否压缩图片
      this.$refs.VueCropperItem.compress = this.compress // 压缩率
    }
  }
}
</script>

<style lang="scss">
.upload-btn-box {
  .avatar-uploader-box {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-bottom: 20px;
    padding-left: 80px;
    padding-top: 30px;
    .upload-tip {
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 12px;
      color: #606266;
    }
  }
}
</style>
