<template>
  <div class="parking-manage">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible.show" width="1200px" :close-on-click-modal="false">
      <el-form v-loading="loading" v-if="!flagTypeCheck" :model="form" ref="form" :rules="rules" :inline="true" :label-position="labelPosition" label-width="150px">
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="公司编号：" prop="parkingCode">
              <el-input v-model="form.parkingCode" placeholder="公司编号(最长50字符)" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车场管理公司：" prop="parkingName">
              <el-input v-model="form.parkingName" placeholder="停车场管理公司(最长50字符)" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="负责人：" prop="contactPerson">
              <el-input v-model="form.contactPerson" placeholder="负责人姓名(最长30字符)" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款账户：" prop="receiptAccount">
              <el-input v-model="form.receiptAccount" placeholder="收款账户(最长50字符)" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="联系电话：" prop="contactPhone">
              <el-input v-model="form.contactPhone" :disabled="flagTypeCheck?true:false" placeholder="联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社会统一信用代码：" prop="socialCode">
              <el-input v-model="form.socialCode" :disabled="flagTypeCheck?true:false" placeholder="社会统一信用代码(最长50字符)" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="对外联系电话：" prop="publicPhone">
              <el-input v-model="form.publicPhone" placeholder="对外联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="省市区：" prop="provincecity">
              <el-cascader class="el-cascader-menu" ref="cascader" v-model="form.provincecity" :options="provinceList"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="address">
              <el-input v-model="form.address" placeholder="详细地址(最长50字符)" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12" class="location">
            <el-form-item label="经纬度:" prop="longitude">
              <i class="el-icon-location" style="font-size: 32px;" @click="showMap = true"></i>
              <el-input style="width: 87%; margin-left: 3%;" readonly v-model="form.longitude" placeholder="经度"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-input style="width: 100%;" readonly v-model="form.dimension" placeholder="纬度"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <div style="display:flex;">
              <div style="color:#F56C6C;margin-top:15px;margin-right:5px;">*</div>
              <el-form-item label="营业执照:" prop="businessUrl">
                <ImgCropper :numLimit="1" :imgBaseUrl="IMAGEURL" @change="getImages($event)" @delete="deleteFile($event)" :introduceImg="coverList">
                  建议正方形小图
                </ImgCropper>
              </el-form-item>
            </div>
            <div v-show="showBusinessUrlFlag" style="color:#F56C6C;margin-top:-20px;margin-left:160px;font-size:12px;">请上传营业执照</div>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24">
            <div class="textarea">
              <el-form-item label="备注说明：" prop="remarks">
                <el-input v-model="form.remarks" type="textarea" :rows="6" placeholder="备注(最长255字符)" maxlength="255"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-form v-if="flagTypeCheck" :model="form" :inline="true" :label-position="labelPosition" label-width="150px">
        <el-row class="el-row-col">
          <el-col :span="8">
            <div class="check-div">停车场管理公司：
              <span class="check-value">{{form.parkingName}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="check-div">社会统一信用代码：
              <span class="check-value">{{form.socialCode}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="check-div-pic">
              <div class="cer-font">营业执照:</div>
              <img class="check-value" :src="form.businessUrl" width="100px" height="100px" alt="">
            </div>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="8">
            <div class="check-div">详细地址：
              <span class="check-value">{{form.address}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="check-div">
              <i class="el-icon-location" style="font-size: 20px;"></i>
              经纬度:
              <span class="check-value">{{form.longitude}} {{form.dimension}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="8">
            <div class="check-div">负责人：
              <span class="check-value">{{form.contactPerson}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="check-div">联系电话：
              <span class="check-value">{{form.contactPhone}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="check-div">添加人:
              <span class="check-value">{{form.createBy}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <div class="check-div">
            车库：
            <div class="table-div">
              <el-table :data="CarData" border style="width: 90%">
                <el-table-column prop="garageName" label="车库名称">
                </el-table-column>
                <el-table-column prop="parkingCount" label="车位数">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    <span>{{scope.row.status === 1 ? '启用' :'停用'}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </div>
        </el-row>
        <el-row class="el-row-col" v-if="form.remarks">
          <el-col :span="24">
            <div class="check-div">备注说明：
              <span class="check-value">{{form.remarks}}</span>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!flagTypeCheck">
        <el-button size="small" @click="dialogVisible.show = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleOk('form')">确 定</el-button>
      </div>

      <div slot="footer" class="dialog-footer" v-if="flagTypeCheck">
        <el-button type="primary" @click="dialogVisible.show = false">返 回</el-button>
      </div>
    </el-dialog>

    <!-- <baidu-map :visible="showMap" @cancel="showMap = false" @map-confirm="confirmLocation" />
     -->
     <div v-if="showMap">
    <!-- <TMap @cancel="showMap = false" @map-confirm="confirmLocation" @getPlace="getPlace" :visible="showMap" ></TMap> -->
    <TMap @cancel="showMap = false" @map-confirm="confirmLocation" :visible="showMap" ></TMap>
    </div>
  </div>
</template>

<script>
import citys from '@/utils/citys'
// import baiduMap from '@c/BaiduMap'
import TMap from '../../../components/TMap.vue'
import ImgCropper from '@c/ImgCropper/ImgCropper'
import serve from '@/api/plateform.api'
import ImgServe from '@/api/file.api'
import gargeServe from '@/api/garageManage.api'
export default {
  name: '',
  components: {
    ImgCropper,
    // baiduMap
    TMap
  },
  props: {
    // 模态框是否显示
    dialogVisible: {
      type: Object
    },
    // 模态框的form数据
    dialogFromData: {
      type: Object
    },
    // 模态框的title
    dialogTitle: {
      type: String
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value !== '') {
        var isPhone = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/
        var isMob = /^([0-9]{3,4}-)?[0-9]{7,8}$/
        if (isPhone.test(value) || isMob.test(value)) {
          callback()
        } else {
          callback(new Error('手机号码有误，请重填'))
          return false
        }
      } else {
        callback()
      }
    }
    return {
      longitudeLatitude: {},
      loading: false,
      labelPosition: 'left',
      flagTypeCheck: false,
      showMap: false,
      updateId: '',
      showBusinessUrlFlag: false,
      form: {
        parkingCode: '',
        parkingName: '',
        socialCode: '',
        provincecity: [],
        address: '',
        longitude: '',
        dimension: '',
        company: '',
        receiptAccount: '',
        publicPhone: '',
        contactPerson: '',
        contactPhone: '',
        businessUrl: '',
        remarks: ''
      },
      cascaderProps: {
        emitPath: true,
        value: 'label'
      },
      // 存放图片
      fileList: [],
      coverList: [],
      rules: {
        parkingCode: [
          { required: true, message: '请输入公司编号', trigger: 'blur' }
        ],
        parkingName: [
          { required: true, message: '请输入停车场名称', trigger: 'blur' }
        ],
        socialCode: [
          { required: true, message: '请输入社会统一信用代码', trigger: 'blur' }
        ],
        contactPerson: [
          { required: true, message: '负责人姓名', trigger: 'blur' }
        ],
        contactPhone: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          },
          { validator: validatePhone, trigger: 'blur' }
        ],
        provincecity: [
          {
            required: true,
            message: '请选择省市区',
            trigger: ['blur', 'change']
          }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请选择经纬度', trigger: 'change' }
        ],
        company: [
          { required: true, message: '请输入所属属公司', trigger: 'blur' }
        ],
        receiptAccount: [
          { required: true, message: '请输入收款账户', trigger: 'blur' }
        ],
        publicPhone: [
          { required: false, message: '请输入对外联系方式', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
        // businessUrl: [
        //   { required: true, message: '请上传营业执照', trigger: 'blur' }
        // ]
      },
      provinceList: citys,
      CarData: []
    }
  },
  created() {
    if (
      this.dialogFromData.flagTypeCheck === 1 ||
      this.dialogFromData.flagTypeCheck === 3
    ) {
      if (this.dialogFromData.flagTypeCheck === 1) {
        this.flagTypeCheck = true
      }
      this.updateId = this.dialogFromData.detailId
      this.getGargeList(this.updateId)
      this.getParkDetailById(this.dialogFromData.detailId)
    } else if (this.dialogFromData.flagTypeCheck === 2) {
      console.log('添加')
    }
  },
  mounted() {},
  methods: {
    getParkDetailById(id) {
      const params = {
        parkingId: id
      }
      serve.getParkDetailById(params).then(res => {
        if (res.data.code === 200) {
          this.form = res.data.data
          var detailData = res.data.data
          // 省市区显示
          if (
            detailData.provinceId &&
            detailData.cityId &&
            detailData.countyId
          ) {
            const arr = []
            arr.push(String(detailData.provinceId))
            arr.push(String(detailData.cityId))
            arr.push(String(detailData.countyId))
            this.form.provincecity = arr
          }
          if (detailData.businessUrl) {
            const obj = {
              id: detailData.businessUrl,
              filePath: detailData.businessUrl
            }
            this.coverList.push(obj)
          }
          // 图片显示
          if (detailData.businessUrl) {
            this.form.businessUrl = this.IMAGEURL + detailData.businessUrl
          }
        }
      })
    },
    // 根据停车场Id获取停车库
    getGargeList(id) {
      const params = {
        parkingId: id
      }
      gargeServe.getGarageList(params).then(res => {
        if (res.data.code === 200) {
          this.CarData = res.data.data
        }
      })
    },
    // 判断位置
    findIndex(str, symbol, num) {
      var x = str.indexOf(symbol)
      for (var i = 0; i < num; i++) {
        x = str.indexOf(symbol, x + 1)
      }
      return x
    },
    handleOk(form) {
      const that = this
      if (!that.form.businessUrl && !that.fileList.length) {
        this.showBusinessUrlFlag = true
      }
      this.$refs[form].validate(async valid => {
        if (valid) {
          that.loading = true
          await that.uploadImg()
          await that.handleProvince(that.form.provincecity)
          if (!that.form.businessUrl) {
            this.showBusinessUrlFlag = true
            // that.$message.warning('营业执照为必填项!')
            this.loading = false
            return
          } else {
            if (that.form.businessUrl.indexOf('http') !== -1) {
              // 存在前缀
              const posIndex = that.findIndex(that.form.businessUrl, '/', 2)
              that.form.businessUrl = that.form.businessUrl.substr(posIndex + 1)
            }
          }
          if (that.updateId) {
            delete that.form.createBy
            delete that.form.createTime
            delete that.form.updateBy
            delete that.form.updateTime
            serve.updatePark(that.form).then(res => {
              if (res.data.code === 200) {
                that.loading = false
                that.$message.success('修改成功!')
                that.deleteOldFile()
                that.dialogVisible.show = false
                that.$emit('handleDialog')
              } else {
                that.loading = false
                that.$message.warning(res.data.msg)
              }
            })
          } else {
            serve.insertPark(that.form).then(res => {
              if (res.data.code === 200) {
                that.loading = false
                that.$message.success('新增成功!')
                that.dialogVisible.show = false
                that.$emit('handleDialog')
              } else {
                that.loading = false
                that.$message.warning(res.data.msg)
              }
            })
          }
        }
      })
    },
    // 判断是否有图片
    async uploadImg() {
      const that = this
      if (that.fileList.length) {
        const params = new FormData()
        that.fileList.map(item => {
          params.append('file', item)
        })
        const res = await ImgServe.uploadSingleFile(params)
        if (res.data.code === 200) {
          that.form.businessUrl = res.data.data.filePath
        } else {
          that.$message.warning(res.data.msg)
        }
      }
    },
    // 处理省市区
    handleProvince(province) {
      if (province && province.length) {
        this.form.provinceId = province[0]
        this.form.cityId = province[1]
        this.form.countyId = province[2]
        // delete this.form.provincecity
      }
    },
    getImages(file) {
      this.fileList = []
      this.fileList.push(file.file)
      this.showBusinessUrlFlag = false
    },
    deleteFile(file) {
      this.deleteFileList = file
      this.form.businessUrl = ''
      this.showBusinessUrlFlag = true
      this.fileList = []
    },
    deleteOldFile() {
      const file = this.deleteFileList
      if (file && file.id) {
        const params = {
          fileId: file.filePath
        }
        ImgServe.deleteImg(params).then(res => {
          if (res.data.code === 200) {
            // this.$message.success('图片删除成功')
          }
        })
      } else {
        this.fileList = []
      }
    },
    // 百度地图选择经纬度
    confirmLocation(e) {
      // this.form.dimension = data.lat
      // this.form.longitude = data.lng
      // const e = this.longitudeLatitude
      // this.form.longitude = e.lng.toFixed(6) + ''
      // this.form.dimension = e.lat.toFixed(6) + ''
      this.form.longitude = e.lng
      this.form.dimension = e.lat
      this.showMap = false
    },
    getPlace (e) {
      console.log(e, 'val')
      this.longitudeLatitude = e
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #ccc;
  margin: 0 20px;
}
::v-deep .el-scrollbar__wrap {
  height: 300px;
}
::v-deep .el-dialog__body {
  padding: 20px 30px;
  .el-form-item {
    width: 100%;
    .el-form-item__content {
      width: 70%;
      .el-cascader {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
.parking-manage {
  width: 100%;
  .el-row-col {
    margin: 20px 0;
    .check-div {
      margin: 20px;
      .check-value {
        margin-left: 20px;
      }
      .table-div {
        width: 90%;
        margin-left: 5%;
      }
    }
    .check-div-pic {
      display: flex;
      margin-left: 20px;
      .check-value {
        margin-left: 20px;
      }
      .cer-font {
        margin-top: 20px;
      }
    }
  }
  .dialog-footer {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      width: 120px;
      &:first-child {
        margin-right: 40px;
      }
    }
  }
  .showImg {
    width: 100px;
    height: 100px;
  }
}
</style>
