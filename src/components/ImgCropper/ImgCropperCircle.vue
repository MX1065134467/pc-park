<template>
  <!-- 裁剪图片 start-->
  <el-dialog title="裁剪图片" width="700px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :append-to-body="true" :visible.sync="isShowCropper">
    <!-- 主区域 start -->
    <div class="vue-cropper-box">
      <!-- 裁剪框 start -->
      <div class="vue-cropper-content">
        <div class="show-cropper" v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <VueCropper ref="cropper" :img="options.img" :outputSize="options.outputSize" :outputType="options.outputType" :info="options.info" :centerBox="options.centerBox" :canScale="options.canScale" :autoCrop="options.autoCrop" :autoCropWidth="options.autoCropWidth" :autoCropHeight="options.autoCropHeight" :fixedBox="options.fixedBox" :fixed="options.fixed" :fixedNumber="options.fixedNumber" :original="options.original" :full="options.full" @realTime="realTime" @imgLoad="imgLoad"></VueCropper>
        </div>
      </div>
      <!-- 裁剪框 end -->

      <!--底部 设置按钮 start-->
      <div class="vue-cropper-bottom">
        <p class="vue-cropper-bottom-item">
          自定义尺寸：
          <el-switch v-model="options.fixedBox" active-color="#13ce66" inactive-color="#ff4949" :active-value="false" :inactive-value="true"></el-switch>
        </p>
        <p class="vue-cropper-bottom-item">
          <el-tooltip class="item" effect="dark" content="放大图片" placement="bottom">
            <i class="el-icon-zoom-in scale" @click="changeScale(1)"></i>
          </el-tooltip>
        </p>
        <p class="vue-cropper-bottom-item">
          <el-tooltip class="item" effect="dark" content="缩小图片" placement="bottom">
            <i class="el-icon-zoom-out scale" @click="changeScale(-1)"></i>
          </el-tooltip>
        </p>
        <p class="vue-cropper-bottom-item">
          <el-tooltip class="item" effect="dark" content="向左旋转90°" placement="bottom">
            <i class="el-icon-refresh-left scale" @click="rotateLeft"></i>
          </el-tooltip>
        </p>
        <p class="vue-cropper-bottom-item">实际截取图片大小：{{this.realSize.width}}×{{this.realSize.height}}</p>
      </div>
      <!--底部 设置按钮 end-->
    </div>
    <!-- 主区域 end -->

    <span slot="footer" class="dialog-footer">
      <el-button v-if="isShowCropper" @click="cancelCubeImg">取消</el-button>
      <el-button v-if="isShowCropper" type="danger" :disabled="loading" :loading="isLoading" @click="onCubeImg">确定</el-button>
    </span>
  </el-dialog>
  <!-- 裁剪图片 end-->
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  name: 'vue-cropper-item',
  components: {
    VueCropper
  },
  data() {
    return {
      isCompress: true, // 是否压缩
      compress: 0.8, // 压缩率
      isShowCropper: false,
      options: {
        img: '',
        info: true,
        outputSize: 1,
        outputType: 'jpeg', // 裁剪生成图片的格式
        centerBox: true, // 截图框是否被限制在图片里面
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框, 只有自动截图开启 宽度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: false, //  固定截图框大小 不允许改变
        fixed: false, // 开启宽度和高度比例
        fixedNumber: [4, 4],
        original: false, // 上传图片按照原始比例渲染
        full: true // 是否输出原图比例的截图
      },
      fileName: null,
      imgScale: '',
      loading: false,
      isLoading: false,
      previews: {},
      realSize: {
        width: '',
        height: ''
      },
      postCropWidth: 0,
      postCropHeight: 0
    }
  },
  methods: {
    // 初始化
    init() {
      this.isShowCropper = true
      this.loading = true
    },

    // 图片加载完成
    imgLoad(data) {
      if (data === 'success') {
        this.loading = false
        this.isLoading = false
        this.imgScale = this.$refs.cropper.scale
        if (this.postCropWidth !== 0 && this.postCropHeight !== 0) {
          this.options.autoCropWidth = Math.round(
            this.imgScale * this.postCropWidth
          )
          this.options.autoCropHeight = Math.round(
            this.imgScale * this.postCropHeight
          )
          this.options.fixedBox = true
        }
      } else {
        this.$message.error('图片格式错误，请重新上传图片')
        this.isShowCropper = false
      }
    },

    // 裁剪图放大或缩小
    changeScale(val) {
      this.$refs.cropper.changeScale(val)
    },

    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },

    // 裁剪图片上传
    onCubeImg(file) {
      this.isLoading = true
      this.$refs.cropper.getCropData(data => {
        // console.log(data, '获取截图的base64 数据')
        this.isLoading = false
        this.isShowCropper = false
        this.options.img = ''

        let file = null
        if (this.isCompress) {
          // 是否压缩
          const img = new Image()
          img.src = data
          img.onload = () => {
            const _data = this.onImgCompression(img)
            file = this.dataURLtoFile(_data, this.fileName)
            // console.log('图片大小-压缩过:', (file.size / 1024).toFixed(2), 'kb，', '压缩率：', this.compress)
            this.$emit('confirm', file)
          }
        } else {
          file = this.dataURLtoFile(data, this.fileName)
          // console.log('图片大小-未压缩:', (file.size / 1024).toFixed(2), 'kb')
          this.$emit('confirm', file)
        }
      })
    },

    // 将裁剪base64的图片转换为file文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },

    // 压缩图片
    onImgCompression(img) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const width = img.width
      const height = img.height
      canvas.width = width
      canvas.height = height
      // 铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, width, height)
      // 进行压缩
      const compress = this.compress || 0.8 // 压缩率
      return canvas.toDataURL('image/jpeg', compress)
    },

    // 取消裁剪
    cancelCubeImg() {
      this.isShowCropper = false
      this.$message.info('取消裁剪图片！')
    },
    realTime(img) {
      this.realSize = {
        width: Math.round(img.w / this.imgScale),
        height: Math.round(img.h / this.imgScale)
      }
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
::v-deep .cropper-view-box {
  border-radius: 50%;
}
.vue-cropper-box {
  width: 100%;
  height: 450px;
  .vue-cropper-content {
    width: 100%;
    height: 90%;
    padding-bottom: 20px;
    text-align: center;
    display: flex;
    justify-content: space-between;

    .show-cropper {
      width: 100%;
      height: 100%;
    }
    .show-preview {
      width: 50%;
      height: 100%;
      margin: 5px;
      overflow: hidden;
    }
  }

  .vue-cropper-bottom {
    display: flex;
    flex-flow: wrap row;
    align-items: center;
    &-item {
      margin-right: 15px;
    }
    .scale {
      font-size: 24px;
      color: dodgerblue;
      vertical-align: middle;
      &:hover {
        color: mediumseagreen;
        box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
      }
    }
  }
}
</style>
