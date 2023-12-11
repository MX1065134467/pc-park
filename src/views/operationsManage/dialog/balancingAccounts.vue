<template>
  <div class="autu_add">
    <el-dialog v-loading="loading" :title="dialogData.title" :visible.sync="dialogData.isShow" width="55%" :destroy-on-close="true" :close-on-click-modal="false">
      <div class="content">
        <div class="content_grid">
          <h3>
            <div>订单信息<span class="tipsInfo"> 请务必仔细核对订单号 请确认您已收到该酒店支付的款项，再进行平账操作</span></div>
          </h3>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="10"><span>酒店名称：</span>{{itemObj.hotelName}}</el-col>
            <el-col :span="10"><span>订单总金额（￥）:</span>{{itemObj.orderAmount}}</el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="20" class="img_col"><span>付款凭证：</span>
              <div class="img_list">
                <el-image style="width: 160px; height: 100px; border-radius: 4px"
                  v-for="(url, index) in itemObj.paymentVoucherList"
                  :key="index + url"
                  :src="url"
                  :preview-src-list="itemObj.paymentVoucherList">
                </el-image>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid img_row">
            <el-col :span="10"><span>收款账户：</span>{{itemObj.collectAccount}}</el-col>
            <el-col :span="10"><span>结算时间:</span>{{itemObj.settleTime}}</el-col>
            <!-- <el-col :span="12" class="img_col"><span>出场照片：</span>
              <div class="img_list">
                <el-image style="width: 160px; height: 100px; border-radius: 4px"
                  v-for="(url, index) in imgList"
                  :key="index + url"
                  :src="imgList[1]"
                  :preview-src-list="imgList">
                </el-image>
              </div>
            </el-col> -->
          </el-row>
        </div>
      </div>
      <el-form :model="form" ref="form" :rules="rules" :inline="true" label-width="120px" label-position="left" class="form-box-style">
       <el-row>
        <el-col :span="24">
          <el-form-item label="收款凭证" class="form-item-style">
            <ImgCropper :numLimit="5" :imgBaseUrl="IMAGEURL" @change="getImages($event)" @delete="deleteFile($event)" :introduceImg="coverList"></ImgCropper>
          </el-form-item>
        </el-col>
       </el-row>
       <el-row :gutter="20">
          <el-col :span="20">
             <el-form-item label="备注说明" prop="balanceRemark">
              <el-input type="textarea" size="small" v-model="form.balanceRemark" placeholder="请输入备注说明"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="handleOk('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImgCropper from '@c/ImgCropper/ImgCropper'
import ImgServe from '@/api/file.api'
import serve from '@/api/operationManage.api'

export default {
  name: '',
  components: { ImgCropper },
  props: {
    dialogData: {
      type: Object
    },
    itemObj: {
      type: Object
    }
  },
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
      imgBaseUrl: this.IMAGEURL,
      list_type: [
        {
          value: '0',
          label: '客户招待'
        },
        {
          value: '1',
          label: '公司员工'
        },
        {
          value: '2',
          label: '其他'
        }
      ],
      form: {
        parkNum: '', // 停车场/车库 Id
        carNumber: '',
        listType: '',
        name: '',
        phoneNum: '',
        validity: null,
        carBrand: '',
        carMode: '',
        colour: '',
        delayTime: null // 延时时间
      },
      coverList: [],
      fileList: [],
      updateList: [],
      rules: {
        parkNum: [{ required: true, message: '请选择停车场', trigger: 'blur' }],
        carNumber: [
          { required: true, message: '请输车牌号', trigger: 'blur' },
          { validator: validatorCarNO, trigger: 'blur' }
        ],
        listType: [{ required: true, message: '请选择名单类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        validity: [{ required: true, message: '请选择有效日期', trigger: 'blur' }],
        phoneNum: [{ required: true, validator: this.valiAvatar, trigger: 'blur' }]
      },
      importData: '',
      loading: false
    }
  },
  methods: {
    valiAvatar(rule, value, callback) {
      const isInt = /^1[3456789]\d{9}$/.test(value)
      if (!isInt) {
        callback(new Error('请填写有效电话号码'))
      } else {
        callback()
      }
    },
    // 上传图片
    async getImages (event) {
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
          })
          this.fileList = []
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
    handleOk (formName) {
      if (this.loading) {
        return
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await this.batchUpload()
          const params = {
            balanceId: this.itemObj.balanceId,
            balanceRemark: this.form.balanceRemark,
            collectVoucherList: this.updateList
          }
          this.loading = true
          const { data: res } = await serve.balanceAccount(params)
          if (res.code === 200) {
            this.loading = false
            this.$message.success('操作成功!')
            this.form = {}
            this.updateList = []
            this.dialogData.isShow = false
            this.$emit('confirmDialog')
          } else {
            this.loading = false
            this.$message.info(res.msg)
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.form = {}
      this.updateList = []
      this.dialogData.isShow = false
    }
  }
}
</script>

<style scoped lang="scss">
.tipsInfo{
  color: red;
  margin-bottom: 30px;
  font-size: 12px;
  margin-left: 30px;
}
.container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .content {
    overflow-y: auto;
    flex: 1;
    flex-grow: 1;
    box-sizing: border-box;
    .content_grid {
      h3 {
        display: flex;
        color: #333;
        border-bottom: 1px solid #ccc;
        padding: 10px;
        font-weight: normal;
        margin-top: 0;
      }
      .first_grid {
        padding: 0 10px;
        box-sizing: border-box;
        color: #606266;
        font-size: 14px;
        margin:0 !important;
        margin-bottom: 50px !important;
        .el-col {
          display: flex;
          align-items: flex-start;
          align-items: center;
          .img_list {
            .el-image:not(:last-child) {
              margin-right: 20px;
            }
          }
          span {
            font-weight: bold;
            width: 120px;
          }
        }
        .img_col {
          align-items: flex-start !important;
        }
      }
      .img_row {
        margin-bottom: 15px !important;
      }
      .pament_card {
        background: #e9ebef;
        padding: 10px 0;
      }
    }
  }
}
  .autu_add {
    ::v-deep.el-dialog__body {
      min-height: 300px;
      _height:300px;
      .el-form {
        .el-row {
          .el-col {
            .el-form-item  {
              display: flex;
            }
          }
        }
      }
    }
    .el-dialog__footer {
      .dialog-footer {
        display: flex;
        justify-content: center;
        .el-button {
          &:first-child {
            margin-right: 20px;
          }
        }
      }
    }
    ::v-deep.el-input-group__append {
      background-color: #409eff !important;
      border: 1px solid #409eff;
      color: #fff;
    }
    .download_link {
      position: absolute;
      right: 0;
      top: 40px;
    }
  }
  .form-box-style{
    padding: 0 20px;
    margin-top:40px
  }
</style>
