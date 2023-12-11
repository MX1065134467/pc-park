<template>
  <div class="park-manage-page" v-loading="loading">
    <div class="top-nav">{{title}}</div>
    <div class="content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" :label-position="labelPosition">
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="停车场管理公司:" prop="parkingId">
              <el-select v-model="ruleForm.parkingId" placeholder="请选择" class="select-class">
                <el-option v-for="item of parkLists" :key="item.parkingId" :label="item.parkingName" :value="item.parkingId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="停车场（库）名称：" prop="garageName">
              <el-input v-model="ruleForm.garageName" class="input-style" placeholder="停车场（库）名称(最长15字符)" maxlength="15"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <div class="province-class">
              <el-form-item label="车场（库）位置：" prop="provincecity">
                <el-cascader class="el-cascader-menu" ref="cascader" v-model="ruleForm.provincecity" :options="provinceList"></el-cascader>
              </el-form-item>
              <el-form-item prop="address">
                <el-input class="province-input" v-model="ruleForm.address" placeholder="详细地址(最长50字符)" maxlength="50"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经纬度：" prop="longitude">
              <i class="el-icon-location" style="font-size: 32px;" @click="showMap = true"></i>
              <span class="span-style" v-show="ruleForm.longitude">{{ruleForm.longitude}} &nbsp; {{ruleForm.dimension}}</span>
              <el-input v-show="!ruleForm.longitude" class="no-data" placeholder="请选择经纬度" v-model="ruleForm.longitude" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="对接类型：" prop="joinType">
              <el-radio-group v-model="ruleForm.joinType" @change="hardWareChange">
                <el-radio :label="1">海康PMS</el-radio>
                <el-radio :label="0">暂不涉及</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面图：">
              <ImgCropper :numLimit="1" :imgBaseUrl="IMAGEURL" @change="getImages($event)" @delete="deleteFile($event)" :introduceImg="coverList">
                建议正方形小图
              </ImgCropper>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="el-row-col">
          <el-col :span="12">
             <!-- prop="contactPhone" -->
            <el-form-item label="对外联系电话" prop="contactPhone">
              <el-input v-model="ruleForm.contactPhone" class="input-style" placeholder="请输入对外联系电话" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="el-row-col" v-if="showIpRow">
          <el-col :span="12">
            <el-form-item label="IP地址：" prop="joinIp">
              <el-input v-model="ruleForm.joinIp" class="input-style"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口号：" prop="joinPort">
              <el-input v-model.number="ruleForm.joinPort" class="input-style"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="el-row-col">
          <el-col :span="24">
            <el-form-item label="车库类型：" prop="garageType">
              <el-radio-group v-model="ruleForm.garageType">
                <el-radio :disabled="updateId !== '' " :label="1">平面多车位</el-radio>
                <el-radio :disabled="updateId !== '' " :label="2">多层多车位</el-radio>
                <el-radio :disabled="updateId !== '' " :label="3">立体机械升降</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- <baidu-map :visible="showMap" @cancel="showMap = false" @map-confirm="confirmLocation" /> -->
    <div v-if="showMap">
    <TMap @cancel="showMap = false" @map-confirm="confirmLocation" @getPlace="getPlace" :visible="showMap" ></TMap>
    <!-- <TMap @cancel="showMap = false" @map-confirm="confirmLocation" @getPlace="getPlace" :visible="showMap" ></TMap> -->
    </div>
    <div v-if="planeParkDialog.show">
      <plane-park v-bind:regionArr='regionArr' @save="saveData"></plane-park>
    </div>
    <div v-if="multiLayerDialog.show">
      <MultiLayer v-if="Number(ruleForm.garageType)=== 2" :floorData="floorData" @save="saveData"></MultiLayer>
    </div>
    <div v-if="DimensionaDialog.show">
      <DimensionalLift v-if="Number(ruleForm.garageType)=== 3" :DimensionalLiftData="DimensionalLiftData" @save="saveData"></DimensionalLift>
    </div>
  </div>
</template>

<script>
import citys from '@/utils/citys'
// import baiduMap from '@c/BaiduMap'
import TMap from '../../../components/TMap.vue'
import PlanePark from '../parkType/PlanePark'
import MultiLayer from '../parkType/MultiLayer'
import DimensionalLift from '../parkType/DimensionalLift'
import ImgCropper from '@c/ImgCropper/ImgCropper'
import ImgServe from '@/api/file.api'
import serve from '@/api/basicEquip.api'
import { getUserId } from '@/common/cache.js'
export default {
  name: '',
  components: {
    // baiduMap,
    TMap,
    PlanePark,
    MultiLayer,
    DimensionalLift,
    ImgCropper
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      console.log(value, 855)
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
    var validateIp = (rule, value, callback) => {
      if (value !== '') {
        if (
          !/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/.test(
            value
          )
        ) {
          callback(new Error('请填写正确的Ip地址!'))
          return false
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateNum = (rule, value, callback) => {
      if (value !== '') {
        if (
          !/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(
            value
          )
        ) {
          callback(new Error('请填写正确的正数!'))
          return false
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      longitudeLatitude: {},
      loading: false,
      labelPosition: 'left',
      rules: {
        parkingId: [
          { required: true, message: '请选择停车场', trigger: 'change' }
        ],
        garageName: [
          { required: true, message: '请输入车库名称', trigger: 'blur' }
        ],
        provincecity: [
          {
            type: 'array',
            required: true,
            message: '请选择车库位置',
            trigger: 'change'
          }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '请选择经纬度', trigger: 'change' }
        ],
        garageType: [
          { required: true, message: '请选择车库类型', trigger: 'change' }
        ],
        parkingCount: [
          { required: true, message: '请填写总车位数', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ],
        joinType: [
          { required: true, message: '请选对接类型', trigger: 'blur' }
        ],
        joinIp: [
          { required: true, message: '请填写Ip地址', trigger: 'change' },
          { validator: validateIp, trigger: 'change' }
        ],
        contactPhone: [
          { required: false, message: '请输入对外联系方式', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        joinPort: [
          { required: true, message: '请填写端口', trigger: 'blur' },
          {
            required: true,
            type: 'number',
            message: '端口号必须是数字值',
            trigger: 'blur'
          }
        ]
      },
      ruleForm: {
        parkingId: '',
        garageName: '',
        provincecity: [],
        address: '',
        dimension: '',
        longitude: '',
        garageType: 0,
        isRegion: '',
        parkingCount: '',
        joinType: 0,
        joinIp: '',
        joinPort: '',
        urlImage: '',
        deleteUrlImage: '',
        contactPhone: '' // 对外联系电话
      },
      parkLists: [],
      showMap: false,
      provinceList: citys,
      isRegion: '', // 平面多车位是否分区
      parkingCount: '', // 总车位数
      region: [], // 分区数据(平面多车位和立体机械升降)
      floor: [], // 多层多车位数据
      updateId: '',
      DimensionalLiftData: {},
      floorData: {},
      regionArr: {},
      planeParkDialog: {
        show: false
      },
      multiLayerDialog: {
        show: false
      },
      DimensionaDialog: {
        show: false
      },
      showIpRow: false,
      coverList: [],
      fileList: []
    }
  },
  created() {
    this.title = this.$route.query.name
    this.updateId = this.$route.query.garageId
    if (this.updateId) {
      this.getDetailById(this.updateId)
    }
    this.getParkingList()
  },
  beforeRouteEnter(to, form, next) {
    to.meta.title = to.query.name
    next(vm => {
      // console.log(vm)
    })
  },
  watch: {
    'ruleForm.garageType'() {
      this.planeParkDialog.show = false
      this.multiLayerDialog.show = false
      this.DimensionaDialog.show = false
      if (this.ruleForm.garageType === 1) {
        this.planeParkDialog.show = true
      }
      if (this.ruleForm.garageType === 2) {
        this.multiLayerDialog.show = true
      }
      if (this.ruleForm.garageType === 3) {
        this.isRegion = 1
        this.DimensionaDialog.show = true
      }
    }
  },
  mounted() {},
  methods: {
    // 获取停车场
    getParkingList() {
      var userId = getUserId()
      const params = {
        userId: userId
      }
      serve.getParkingList(params).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.parkLists = res.data.data
        }
      })
    },
    getDetailById(id) {
      const params = {
        garageId: id
      }
      serve.getDetailById(params).then(res => {
        if (res.data.code === 200) {
          this.ruleForm.parkingId = res.data.data.parkingId
          this.ruleForm.garageName = res.data.data.garageName
          const provinceArr = []
          provinceArr.push(res.data.data.provinceId)
          provinceArr.push(res.data.data.cityId)
          provinceArr.push(res.data.data.countyId)
          this.ruleForm.provincecity = provinceArr
          this.ruleForm.address = res.data.data.address
          this.ruleForm.dimension = res.data.data.dimension
          this.ruleForm.longitude = res.data.data.longitude
          if (res.data.data.contactPhone === null) {
            this.ruleForm.contactPhone = ''
          } else {
            this.ruleForm.contactPhone = res.data.data.contactPhone
          }
          this.ruleForm.joinType = Number(res.data.data.joinType)
          if (res.data.data.urlImage) {
            this.ruleForm.urlImage = this.IMAGEURL + res.data.data.urlImage
            const fileObj = {
              id: res.data.data.urlImage,
              filePath: res.data.data.urlImage
            }
            this.coverList.push(fileObj)
          }
          if (this.ruleForm.joinType !== 0) {
            this.showIpRow = true
          } else {
            this.showIpRow = false
          }
          this.ruleForm.joinIp = res.data.data.joinIp
          this.ruleForm.joinPort = Number(res.data.data.joinPort)
          this.ruleForm.garageType = res.data.data.garageType
          // 平面多车位 总车位数
          if (this.ruleForm.garageType === 1) {
            this.planeParkDialog.show = true
            const obj = {
              isRegion: res.data.data.isRegion,
              parkingCount: res.data.data.parkingCount,
              region: res.data.data.region
            }
            this.regionArr = obj
          } else if (this.ruleForm.garageType === 2) {
            // 多层多车位
            this.multiLayerDialog.show = true
            const obj = {
              parkingCount: res.data.data.parkingCount,
              floorData: res.data.data.floor
            }
            this.floorData = obj
          } else if (this.ruleForm.garageType === 3) {
            // 立体机械升降
            this.DimensionaDialog.show = true
            const dimensionObj = {
              parkingCount: res.data.data.parkingCount,
              DimensionalLiftData: res.data.data.region
            }
            this.DimensionalLiftData = dimensionObj
          }
        }
      })
    },
    // 百度地图选择经纬度
    confirmLocation(e) {
      // const e = this.longitudeLatitude
      // this.ruleForm.longitude = e.lng.toFixed(6) + ''
      // this.ruleForm.dimension = e.lat.toFixed(6) + ''
      this.ruleForm.longitude = e.lng
      this.ruleForm.dimension = e.lat
      this.showMap = false
    },
    getPlace (e) {
      console.log(e, 'val')
      this.longitudeLatitude = e
    },
    // 判断位置
    findIndex(str, symbol, num) {
      var x = str.indexOf(symbol)
      for (var i = 0; i < num; i++) {
        x = str.indexOf(symbol, x + 1)
      }
      return x
    },
    // 存储数据
    saveData(data, type) {
      this.handleData(data, type)
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const that = this
          that.loading = true
          await that.uploadImg()
          if (
            that.ruleForm.urlImage &&
            that.ruleForm.urlImage.indexOf('http') !== -1
          ) {
            // 存在前缀
            const posIndex = that.findIndex(that.ruleForm.urlImage, '/', 2)
            that.ruleForm.urlImage = that.ruleForm.urlImage.substr(posIndex + 1)
          }
          that.handleProvince(that.ruleForm.provincecity)
          var isEqualFlag = true
          if (that.ruleForm.garageType === 2) {
            isEqualFlag = this.isEqual(
              that.ruleForm.parkingCount,
              2,
              that.floor
            )
          } else if (that.ruleForm.garageType === 3) {
            isEqualFlag = that.isEqual(
              that.ruleForm.parkingCount,
              3,
              that.region
            )
          }
          if (!isEqualFlag) {
            return
          }
          const params = {
            urlImage: that.ruleForm.urlImage ? that.ruleForm.urlImage : null,
            deleteUrlImage: that.ruleForm.deleteUrlImage
              ? that.ruleForm.deleteUrlImage
              : '',
            garageId: that.updateId ? that.updateId : null,
            parkingId: that.ruleForm.parkingId,
            garageName: that.ruleForm.garageName,
            contactPhone: that.ruleForm.contactPhone,
            provinceId: that.ruleForm.provinceId,
            cityId: that.ruleForm.cityId,
            countyId: that.ruleForm.countyId,
            address: that.ruleForm.address,
            longitude: that.ruleForm.longitude,
            dimension: that.ruleForm.dimension,
            joinType: that.ruleForm.joinType,
            joinIp: that.ruleForm.joinIp,
            joinPort: that.ruleForm.joinPort,
            garageType: that.ruleForm.garageType, // 车库类型(1-平面,2-多层,3-立体机械)
            isRegion:
              that.isRegion !== null && that.isRegion !== undefined
                ? that.isRegion
                : null, // 是否分区(1-分,0-否) 平面多车位的分区
            parkingCount: that.ruleForm.parkingCount, // 总车位数
            // 分区数据(平面多车位和立体机械升降)
            region: that.region ? that.region : [],
            // 多层多车位的数据
            floor: that.floor ? that.floor : [],
            parkingGarageDetail: []
          }
          if (that.updateId !== '') {
            // 修改
            serve.updateGarage(params).then(res => {
              if (res.data.code === 200) {
                that.loading = false
                that.$message.success('修改成功!')
                that.floor = []
                that.region = []
                that.$router.push({
                  path: '/basicFacility/park-manage'
                })
              } else {
                that.$message.error(res.data.msg)
                that.loading = false
              }
            })
          } else {
            // 新增
            serve.inserParking(params).then(res => {
              if (res.data.code === 200) {
                that.loading = false
                that.$message.success('添加成功!')
                that.floor = []
                that.region = []
                that.$router.push({
                  path: '/basicFacility/park-manage'
                })
              } else {
                that.$message.error(res.data.msg)
                that.loading = false
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleData(data, type) {
      if (type === 1) {
        // 平面多车位
        this.isRegion = data.isRegion
        this.ruleForm.parkingCount = data.parkingCount
        this.region = data.areaArr
      } else if (type === 2) {
        // 多层多车位
        this.ruleForm.parkingCount = data.parkingCount
        this.floor = data.layerArr
      } else if (type === 3) {
        this.ruleForm.parkingCount = data.parkingCount
        this.region = data.areaArr
      }
    },
    isEqual(parkingCount, type, data) {
      var numCount = 0
      if (type === 2) {
        data.map(item => {
          numCount = numCount + Number(item.parkingCount)
        })
      } else {
        data.map(item => {
          numCount = numCount + Number(item.parkingCount)
        })
      }
      if (Number(parkingCount) === numCount) {
        return true
      } else {
        this.$message.warning('各区车位数之和与车位总数不一致！')
        this.loading = false
        return false
      }
    },
    handleProvince(province) {
      this.ruleForm.provinceId = province[0]
      this.ruleForm.cityId = province[1]
      this.ruleForm.countyId = province[2]
    },
    hardWareChange(val) {
      if (val === 1) {
        this.showIpRow = true
      } else {
        this.showIpRow = false
        this.ruleForm.joinPort = ''
        this.ruleForm.joinIp = ''
      }
    },
    getImages(file) {
      this.fileList = []
      this.fileList.push(file.file)
    },
    deleteFile(file) {
      this.ruleForm.deleteUrlImage = file.filePath
      this.ruleForm.urlImage = ''
    },
    // 上传图片
    async uploadImg() {
      if (this.fileList.length) {
        const params = new FormData()
        this.fileList.map(item => {
          params.append('file', item)
        })
        const res = await ImgServe.uploadSingleFile(params)
        if (res.data.code === 200) {
          this.ruleForm.urlImage = res.data.data.filePath
        } else {
          this.$message.warning(res.data.msg)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.park-manage-page {
  .top-nav {
    height: 70px;
    background: #f2f2f2;
    line-height: 70px;
    font-size: 20px;
    padding-left: 20px;
  }
  .content {
    padding: 40px 40px 0 40px;
    width: 80%;
    .el-row-col {
      width: 100%;
      margin: 20px 0;
      .select-class {
        width: 90%;
      }
      .input-style {
        width: 90%;
      }
      .province-class {
        display: flex;
        justify-content: flex-start;
        .province-input {
          width: 300px;
          margin-left: -100px;
        }
      }
      .span-style {
        margin-left: 20px;
      }
      .no-data {
        margin-left: 5%;
        width: 80%;
      }
      .sumpark {
        width: 150px;
      }
    }
  }
}
</style>
