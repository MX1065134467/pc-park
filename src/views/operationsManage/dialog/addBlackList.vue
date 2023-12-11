<template>
  <div class="add_black_list">
    <el-dialog :title="blackData.title" :visible.sync="blackData.isShow" width="55%" :destroy-on-close="true" :close-on-click-modal="false">
      <el-form :model="addList" ref="form" :rules="rules" :inline="true" label-width="100px" label-position="left" class="add_form" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
        <ul class="content_top" v-if="blackData.title === '拉黑'">
           <li>
             <span>停车管理公司：{{blackData.content.parkingName}}</span>
             <span>车库： {{blackData.content.garageName}}</span>
             <span>车牌号：{{blackData.content.carNo}}</span>
           </li>
           <li>
             <span>入场时间：{{blackData.content.inTime}}</span>
             <span>出场时间：{{blackData.content.outTime}}</span>
             <span>用户类型：{{blackData.content.showParkType}}</span>
           </li>
           <li>
             <span style="flex: 1">入场照片：
              <el-image style="width: 160px; height: 100px; border-radius: 4px;"
                v-for="(url, index) in blackData.content.inImageUrl_list"
                :key="index + url"
                :src="url"
                :preview-src-list="blackData.content.inImageUrl_list">
              </el-image>
             </span>
           </li>
           <li>
             <span style="flex: 1">抓拍图片：
              <el-image style="width: 160px; height: 100px; border-radius: 4px;"
                v-for="(url, index) in blackData.content.allImg"
                :key="index + url"
                :src="url"
                :preview-src-list="blackData.content.allImg">
              </el-image>
             </span>
           </li>
         </ul>
         <el-row :gutter="20" v-if="blackData.title === '添加'">
          <el-col :span="12">
           <el-form-item label="停车场" prop="parkNum">
             <el-cascader
             size="small"
              v-model="addList.parkNum"
              :options="blackData.parkingList">
            </el-cascader>
           </el-form-item>
           </el-col>
        </el-row>
        <el-row :gutter="20" v-if="blackData.title === '添加'">
          <el-col :span="8">
            <el-form-item label="车牌号:" prop="carNumber">
              <el-input size="small" v-model="addList.carNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="获取渠道:">
              后台
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="处理:" class="item_days" prop="dispose">
          <div class="select_days">
            拉黑
            <el-select v-model="addList.dispose" size="small" @change="handleDispose">
              <el-option v-for="day in daysOption" :key="day.value" :label="day.label" :value="day.value"></el-option>
            </el-select>
            天
          </div>
          <span style="margin: 0 10px">或</span>
          <div>自定义<el-input-number :step="1" :min="1" step-strictly size="small" style="margin-left:10px" v-model="addList.dispose"></el-input-number></div>
        </el-form-item>
        <el-form-item label="执行周期:" prop="startTime" v-if="blackData.title === '添加'">
          <el-date-picker
            size="small"
            v-model="addList.startTime"
            type="date"
            :picker-options="pickerOPtions"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
          <span style="margin: 0 15px">至</span>
          <el-input size="small" v-model="calcTime" readonly class="readonly_input"></el-input>
        </el-form-item>
        <el-form-item label="证据上传:">
          <ImgCropper :numLimit="5" :imgBaseUrl="IMAGEURL" @change="getImages($event)" @delete="deleteFile($event)" :introduceImg="coverList"></ImgCropper>
        </el-form-item>
        <el-form-item label="拉黑原因：">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="addList.remark" maxlength="250" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="handleClose(blackData.title)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImgCropper from '@c/ImgCropper/ImgCropper'
import serve from '@/api/operationManage.api'
import ImgServe from '@/api/file.api'
import { timeFormat } from '@/utils/util.js'
export default {
  props: {
    blackData: {
      type: Object
    }
  },
  components: { ImgCropper },
  data () {
    var validatorCarNO = (rule, value, callback) => {
      const plateNumberReg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/
      if (value !== '') {
        if (!plateNumberReg.test(value)) {
          callback(new Error('车牌号有误，请重填'))
          return false
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      pickerOPtions: {
        disabledDate(time) {
          return time.getTime() < (new Date().getTime() - 3600 * 1000 * 24)
        }
      },
      addList: {
        carNumber: '',
        channel: '后台',
        startTime: new Date(),
        dispose: 1,
        remark: '',
        parkNum: '' // 停车场/车库 Id

      },
      imgBaseUrl: this.IMAGEURL,
      coverList: [],
      fileList: [],
      updateList: [],
      daysOption: [{
        value: 1,
        label: 1
      }, {
        value: 10,
        label: 10
      }, {
        value: 20,
        label: 20
      }, {
        value: 30,
        label: 30
      }],
      rules: {
        parkNum: [{ required: true, message: '请选择停车场', trigger: 'blur' }],
        carNumber: [
          { required: true, message: '请输车牌号', trigger: 'blur' },
          { validator: validatorCarNO, trigger: 'blur' }
        ],
        dispose: [{ required: true, validator: this.valiAvatar, trigger: 'change' }],
        startTime: [{ required: true, message: '请选择有效日期', trigger: 'blur' }]
      },
      loading: false
    }
  },
  created() {
    console.log(this.blackData, 'blackData')
  },
  computed: {
    calcTime() {
      if (this.addList.startTime === null) {
        return
      }
      if (this.addList.dispose === '永久') {
        return this.addList.dispose
      } else {
        const d = new Date(this.addList.startTime)
        const plus = this.addList.dispose * 1 - 1
        const newDate = d.setDate(d.getDate() + plus)
        return timeFormat(newDate, 'yyyy-mm-dd') || 0
      }
    }
  },
  methods: {
    handleDispose() {
      this.$refs.form.clearValidate('dispose')
    },
    valiAvatar(rule, value, callback) {
      const isInt = /^[0-9]+/.test(value)
      if (!isInt) {
        callback(new Error('请填写处理意见'))
      } else {
        callback()
      }
    },
    getImages(event) {
      this.fileList.push(event)
    },
    //  上传图片
    async batchUpload() {
      if (this.fileList.length) {
        const params = new FormData()
        this.fileList.map(item => {
          params.append('files', item.file)
        })
        const res = await ImgServe.uploadBatchImg(params)
        if (res.data.code === 200) {
          res.data.data.map(item => {
            this.updateList.push(item.filePath)
            this.fileList = []
          })
        } else {
          this.$message.warning(res.data.msg)
        }
      }
    },
    // 删除图片
    deleteFile(file) {
      if (file && file.id) {
        this.fileList.map(item => {
          if (item.id === file.id) {
            this.fileList.splice(item, 1)
          }
        })
      } else {
        this.fileList = []
      }
    },
    cancel() {
      this.blackData.isShow = false
      this.updateList = []
      this.addList = {}
    },
    handleClose() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await this.batchUpload()
          const params = {
            carNo: this.addList.carNumber || this.blackData.content.carNo, // 车牌号
            channelType: 1,
            beginTime: timeFormat(this.addList.startTime),
            endTime: `${this.calcTime} 00:00:00`,
            blackReason: this.addList.remark,
            dayCount: this.addList.dispose, // 拉黑时间
            sysFileInfoList: this.updateList,
            parkingId: (this.addList.parkNum && this.addList.parkNum[0]) || this.blackData.content.carInOut.parkingId,
            garageId: (this.addList.parkNum && this.addList.parkNum[1]) || this.blackData.content.carInOut.garageId,
            status: this.blackData.status || 9,
            createBy: this.blackData.userName,
            orderId: this.blackData.orderId // 停车记录页面拉黑需要
          }
          this.loading = true
          const { data: res } = await serve.addBlackList(params)
          if (res.code === 200) {
            this.loading = false
            this.$refs.form.resetFields()
            this.$message.success('拉黑成功！')
            this.updateList = []
            this.blackData.isShow = false
            this.$emit('close')
          } else {
            this.loading = false
            return this.$message.info('添加黑名单失败！')
          }
        } else {
          // console.log(this.updateList, this.addList, this.calcTime, '***', this.blackData)
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.add_black_list {
  .el-dialog__body {
    padding-bottom: 0;
  }
  .content_top {
    li {
      display: flex;
      padding: 0 10px;
      box-sizing: border-box;
      margin-bottom: 20px;
      span {
        display: flex;
        width: 33%;
      }
      .el-image {
        margin-right: 24px;
      }
    }
  }
  .add_form {
    padding: 0 10px;
    box-sizing: border-box;
    .el-row {
      .el-col  {
        display: flex;
      }
    }
    .park_row {
      margin-bottom: 30px;
      .el-col {
        .img_list {
          margin-left: 10px;
        }
        span{ width: 100px;}
      }
    }
  }
  .el-form-item {
    width: 100%;
    display: flex;
    ::v-deep.el-form-item__content {
      flex: 1;
      display: flex;
      align-items: center;
      .el-date-editor{
        .el-input__inner {
          width: 220px;
        }
      }
    }
  }
  .item_days {
    ::v-deep.el-form-item__content {
      flex: 1;
      display: flex;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    .el-button:first-child{
      margin-right: 20px;
    }
  }
  ::v-deep.readonly_input{
    .el-input__inner {
      width: 220px;
    }
  }
}
</style>
