<template>
  <div class="autu_add">
    <el-dialog v-loading="loading" :title="dialogData.title" :visible.sync="dialogData.isShow" width="55%" :destroy-on-close="true" :close-on-click-modal="false">
      <el-form :model="form" ref="form" :rules="rules" :inline="true" label-width="120px">
        <el-row :gutter="20" v-if="dialogData.title === '添加'">
          <el-col :span="8">
           <el-form-item label="停车场" prop="parkNum">
             <el-cascader
              size="small"
              v-model="form.parkNum"
              :options="dialogData.parkingList">
            </el-cascader>
           </el-form-item>
           </el-col>
           <el-col :span="8">
            <el-form-item label="车牌号" prop="carNumber">
              <el-input size="small" v-model="form.carNumber" placeholder="车牌号"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialogData.title === '添加'">
          <el-col :span="8">
             <el-form-item label="名单类型" prop="listType">
              <el-select size="small" v-model="form.listType" placeholder="请选择">
                <el-option v-for="(sitem, sindex) of list_type" :key="sindex" :label="sitem.label" :value="sitem.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input size="small" v-model="form.name" placeholder="姓名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialogData.title === '添加'">
          <el-col :span="8">
            <el-form-item label="电话" prop="phoneNum">
              <el-input size="small" v-model="form.phoneNum" placeholder="电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="有效时间" prop="validity" label-width="108px">
              <el-date-picker
                size="small"
                v-model="form.validity"
                type="daterange"
                :picker-options="pickerOPtions"
                format="yyyy - MM - dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
       <el-row v-if="dialogData.title === '添加'">
         <el-form-item label="车辆信息" label-width="108px">
           <el-col :span="8">
             <el-input size="small" v-model="form.carBrand" placeholder="品牌，例 大众"></el-input>
           </el-col>
           <el-col :span="8">
             <el-input size="small" v-model="form.carMode" placeholder="车型， 例 迈腾330T"></el-input>
           </el-col>
           <el-col :span="8">
             <el-input size="small" v-model="form.colour" placeholder="颜色， 例 银灰色"></el-input>
           </el-col>
          </el-form-item>
       </el-row>
       <el-row v-if="dialogData.title === '添加'">
         <el-form-item label="添加图片" label-width="108px">
            <ImgCropper :numLimit="5" :imgBaseUrl="IMAGEURL" @change="getImages($event)" @delete="deleteFile($event)" :introduceImg="coverList"></ImgCropper>
          </el-form-item>
       </el-row>
       <el-row v-if="dialogData.title === '延时'" style="text-align:center">
         <el-form-item label="选择时间:">
            <el-date-picker
              size="small"
              v-model="form.delayTime"
              type="daterange"
              format="yyyy - MM - dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectTime"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
       </el-row>
       <!-- <el-row v-if="dialogData.title === '导入'" style="text-align:center">
         <el-form-item label="选择导入文件:">
            <el-input placeholder="未选择文件" v-model="importData">
              <el-button slot="append" size="small" type="primary">选择文件</el-button>
            </el-input>
            <a href="#" class="download_link">下载excel模板</a>
          </el-form-item>
       </el-row> -->
      </el-form>
      <!-- 查看 -->
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
import { getUserInfo } from '@/common/cache.js'
import { timeFormat } from '@/utils/util'

export default {
  name: '',
  components: { ImgCropper },
  props: {
    dialogData: {
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
    var validatorUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入姓名'))
        return false
      } else if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error('姓名长度应该在2-10之间'))
        return false
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
      beginTime: '',
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
        name: [{ required: true, validator: validatorUserName, trigger: 'blur' }],
        validity: [{ required: true, message: '请选择有效日期', trigger: 'blur' }],
        phoneNum: [{ required: true, validator: this.valiAvatar, trigger: 'blur' }]
      },
      importData: '',
      loading: false
    }
  },
  created() {
    if (this.dialogData.title === '延时') {
      this.beginTime = this.dialogData.info.beginTime
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
    selectTime(val) {
      if (val[0] !== this.beginTime) {
        this.form.delayTime[0] = timeFormat(this.beginTime, 'yyyy-mm-dd hh:mm:ss')
        this.$message.error('有效期开始时间不能修改')
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
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await this.batchUpload()

          if (this.dialogData.title === '添加') {
            const params = {
              beginTime: this.form.validity[0],
              endTime: this.form.validity[1],
              carNo: this.form.carNumber, // 车牌号
              cardBrand: this.form.carBrand, // 车辆品牌
              cardColor: this.form.colour, // 车辆颜色
              cardModel: this.form.carMode, // 车型
              userPhone: this.form.phoneNum, // 电话
              userName: this.form.name, // 姓名
              vipType: this.form.listType, // 名单类型
              sysFileInfoList: this.updateList, // 图片路径
              channelType: 1, // 社保渠道 1-后台录入,2-商家申报
              parkingId: this.form.parkNum[0],
              garageId: this.form.parkNum[1],
              status: 1,
              createBy: getUserInfo().userName
            }
            this.loading = true
            const { data: res } = await serve.addParkVip(params)
            if (res.code === 200) {
              this.loading = false
              this.$message.success('添加成功!')
              this.form = {}
              this.updateList = []
              this.dialogData.isShow = false
              this.$emit('confirmDialog')
            } else {
              this.loading = false
              this.$message.info(res.msg)
            }
          }
          if (this.dialogData.title === '延时') {
            this.$refs[formName].resetFields()
            const params = {
              beginTime: this.form.delayTime[0],
              endTime: this.form.delayTime[1],
              vipId: this.dialogData.vipId,
              status: 1
            }
            this.loading = true
            const { data: res } = await serve.updataStatus(params)
            if (res.code === 200) {
              this.loading = false
              this.$message.success('延时成功!')
              this.$emit('confirmDialog')
            } else {
              this.loading = false
            }
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
</style>
