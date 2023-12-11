<template>
  <div class="upload-box">
    <div class="avatar-uploader-box">
      <!-- 图片预览 -->
      <div :key="item.filePath" class="image-preview" v-for="(item, index) in imageArr">
        <!-- 上传的图片 -->
        <img
          :src="imgBaseUrl + item.filePath"
          @mouseover.stop="item.isShowPopup = true"
          class="avatar"
          v-if="item.filePath"/>
        <img
          :src="item.url"
          @mouseover.stop="item.isShowPopup = true"
          class="avatar"
          v-else />
        <!-- 显示查看和删除的按钮弹窗 -->
        <div
          @mouseleave="item.isShowPopup = false"
          class="avatar-uploader-popup"
          v-show="(item.filePath || item.url) && item.isShowPopup">
          <i @click="previewImg(item)" class="el-icon-zoom-in"></i>
          <i @click="delImageUrl(index)" class="el-icon-delete"></i>
        </div>
      </div>
      <!-- 方框样式 -->
      <el-upload
        :action="actionUrl"
        :auto-upload="false"
        :on-change="handleAvatarChange"
        :show-file-list="false"
        accept="image/*"
        class="avatar-uploader"
        ref="avatarUploader">
        <span
          element-loading-background="rgba(0, 0, 0, 0.8)"
          element-loading-spinner="el-icon-loading"
          element-loading-text="上传中"
          style="display:block;"
          v-loading="loading">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </span>
      </el-upload>
      <!-- 上传提示文字样式 -->
      <div class="upload-tip">
        <slot></slot>
      </div>
    </div>
    <!-- 查看大图 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body center title="图片查看" :close-on-click-modal="false">
      <img :src="imgSrc" alt width="100%" />
    </el-dialog>
    <!-- 裁剪图片 start-->
    <vue-cropper-item @confirm="confirmCropper" ref="VueCropperItem" />
    <!-- 裁剪图片 end-->
  </div>
</template>
<script>
import vueCropperItem from './ImgCropperItem'
export default {
  name: 'ImgCropper',
  components: {
    vueCropperItem
  },
  props: {
    /**
     * 外部传入的图片信息
     * 传入数据格式：
     * [...{..., filePath: 图片路径, ... }...]
     */
    introduceImg: {
      type: Array,
      default: function() {
        return []
      }
    },
    numLimit: {
      // 最大允许上传个数
      type: Number,
      default: 1
    },
    sizeLimit: {
      // 最大单文件大小
      type: Number,
      default: 10
    },
    imgBaseUrl: {
      // 已上传图片服务器路径
      type: String,
      required: true
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
      dialogVisible: false,
      imageArr: [],
      imgSrc: '',
      actionUrl: '/park-core/v1.0/file/uploadSingle'
    }
  },
  computed: {},
  watch: {
    introduceImg: {
      handler() {
        const isArray = Object.prototype.toString.call(this.introduceImg) === '[object Array]'
        if (isArray && this.introduceImg.length > 0) {
          this.introduceImg.forEach(item => {
            item.isShowPopup = false
          })
          this.imageArr = JSON.parse(JSON.stringify(this.introduceImg))
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  methods: {
    // 上传之前
    beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
        if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(file.name)) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject('上传图片只能是JPG或PNG格式!')
        }

        if (file.size > this.sizeLimit * 1024 * 1024) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject(`上传图片大小不能超过${this.sizeLimit}M!`)
        }
        if (this.imageArr.length === this.numLimit) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject(`最多上传${this.numLimit}张图片`)
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
    // 转换图片并emit
    async uploadOssApi(data) {
      const fileReader = new FileReader()
      const id = Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36)
      fileReader.readAsDataURL(data)
      fileReader.onload = () => {
        const imgUrl = fileReader.result
        this.imageArr.push({
          id: id,
          url: imgUrl,
          isShowPopup: false
        })
      }
      this.$emit('change', { id: id, file: data })
    },
    // 预览图片
    previewImg(data) {
      if (data.filePath) {
        this.imgSrc = `${this.imgBaseUrl}${data.filePath}`
      } else {
        this.imgSrc = data.url
      }
      this.dialogVisible = true
    },
    // 删除图片
    delImageUrl(index) {
      const data = this.imageArr[index]
      this.$emit('delete', data)
      this.imageArr.splice(index, 1)
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
      console.log( this.$refs.VueCropperItem, 666)
      this.$refs.VueCropperItem.postCropWidth = this.postCropWidth
      this.$refs.VueCropperItem.postCropHeight = this.postCropHeight
      this.$refs.VueCropperItem.isCompress = this.isCompress // 是否压缩图片
      this.$refs.VueCropperItem.compress = this.compress // 压缩率
    }
  }
}
</script>

<style lang="scss">
$width: 89px;
$height: 89px;

.upload-box {
  .avatar-uploader-box {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-bottom: 20px;
    min-width: 350px;
    .avatar-uploader {
      .el-upload {
        width: $width;
        height: $height;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
        .el-loading-spinner {
          width: $width;
          height: $height;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 0;
          top: 0;
          .el-loading-text {
            margin: 0;
          }
        }
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: $width;
        height: $height;
        line-height: $height;
        text-align: center;
      }
    }
    .image-preview {
      position: relative;
      padding-right: 20px;
      .avatar {
        width: $width;
        height: $height;
        display: block;
        border-radius: 6px;
      }
      .avatar-uploader-popup {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: $width;
        height: $height;
        background: rgba($color: #000000, $alpha: 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 20px;
        border-radius: 6px;
        i {
          width: 30%;
          text-align: center;
          padding: 0 5%;
          font-size: 24px;
        }
      }
    }
    .upload-tip {
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 12px;
      color: #606266;
      max-width: 350px;
      line-height: 20px;
    }
  }
}
</style>
