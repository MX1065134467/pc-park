<template>
  <div class="equip-manage-dialog">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible.show" width="60%" :close-on-click-modal="false">
      <el-form v-loading="loading" :model="form" ref="form" :rules="rules" :inline="true" :label-position="labelPosition" label-width="160px">
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="设备类型：" prop="equipTypeId">
              <el-select v-if="!flagTypeCheck" :disabled="flagTypeCheck" v-model="form.equipTypeId" placeholder="请选择" class="select-class">
                <el-option v-for="item of equipList" :key="item.equipTypeId" :label="item.equipName" :value="item.equipTypeId"></el-option>
              </el-select>
              <p v-else>{{form.equipTypeId}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属停车场管理公司:" prop="parkingId">
              <el-select v-if="!flagTypeCheck" :disabled="flagTypeCheck" v-model="form.parkingId" placeholder="请选择" class="select-class" @change="parkingIdChange">
                <el-option :disabled="flagTypeCheck" v-for="item of parkLists" :key="item.parkingId" :label="item.parkingName" :value="item.parkingId"></el-option>
              </el-select>
              <p v-else>{{form.parkingId}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="所属停车场:" prop="garageId">
              <el-select v-if="!flagTypeCheck" :disabled="flagTypeCheck" v-model="form.garageId" placeholder="请选择" class="select-class" @change="garageChange">
                <el-option :disabled="flagTypeCheck" v-for="item of garagesList" :key="item.garageId" :label="item.garageName" :value="item.garageId"></el-option>
              </el-select>
              <p v-else>{{form.garageId}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备位置：">
              <el-select v-if="!flagTypeCheck" :disabled="flagTypeCheck" v-model="form.roadWayId" placeholder="请选择" class="select-class">
                <el-option v-for="(item, index) of equipmentLocation" :key="index" :label="item.name" :value="item.roadWayId"></el-option>
              </el-select>
              <p v-else>{{form.roadWayName}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="VMS设备ID：">
              <el-input v-if="!flagTypeCheck" v-model="form.vmsIpcId" placeholder="VMS设备ID(最多30字符)"  maxlength="30"></el-input>
              <p v-else>{{form.vmsIpcId ? form.vmsIpcId : '--'}}</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备详细位置：" prop="equipPosition">
              <el-input v-if="!flagTypeCheck" v-model="form.equipPosition" placeholder="设备位置(最多50字符)"  maxlength="50"></el-input>
              <p v-else>{{form.equipPosition ? form.equipPosition : '--'}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">

          <el-col :span="12">
            <el-form-item label="设备序列号：" prop="equipSerial">
              <el-input v-if="!flagTypeCheck" v-model="form.equipSerial" placeholder="设备序列号(最多50字符)" maxlength="50"></el-input>
              <p v-else>{{form.equipSerial ? form.equipSerial : '--'}}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="12">
            <el-form-item label="设备照片：">
              <ImgCropper v-if="!flagTypeCheck" :numLimit="1" :imgBaseUrl="IMAGEURL" @change="getImages($event)" @delete="deleteFile($event)" :introduceImg="coverList">
                建议正方形小图
              </ImgCropper>
              <img v-else-if="flagTypeCheck && form.equipUrl" class="check-value" :src="form.equipUrl" width="100px" height="100px" alt="">
              <span v-else>--</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="el-row-col">
          <el-col :span="24">
            <div class="textarea">
              <el-form-item label="备注说明：" prop="remarks">
                <el-input v-if="!flagTypeCheck" v-model="form.remarks" type="textarea" :rows="6" placeholder="备注(最多255字符)" maxlength="255"></el-input>
                <p v-else>{{form.remarks ? form.remarks : '--'}}</p>
              </el-form-item>
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
  </div>
</template>

<script>
import serve from '@/api/basicEquip.api'
import { getUserId } from '@/common/cache'
import ImgCropper from '@c/ImgCropper/ImgCropper'
import ImgServe from '@/api/file.api'
export default {
  name: '',
  components: {
    ImgCropper
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
    return {
      loading: false,
      labelPosition: 'left',
      equipList: [],
      parkLists: [],
      garagesList: [],
      equipmentLocation: [],
      coverList: [],
      updateFlag: false,
      flagTypeCheck: false,
      updateId: '',
      form: {
        equipTypeId: '',
        parkingId: '',
        equipPosition: '',
        garageId: '',
        equipSerial: '',
        remarks: '',
        equipUrl: '',
        roadWayId: '',
        vmsIpcId: null
      },
      rules: {
        equipTypeId: [
          { required: true, message: '设备类型不能为空', trigger: 'change' }
        ],
        parkingId: [
          { required: true, message: '所属停车场不能为空', trigger: 'change' }
        ],
        equipPosition: [
          { required: true, message: '设备位置不能为空', trigger: 'blur' }
        ],
        garageId: [
          { required: true, message: '所属车库不能为空', trigger: 'change' }
        ]
      },
      fileList: [],
      deleteFileList: []
    }
  },
  async created() {
    var flagCheck = false
    if (
      this.dialogFromData.flagTypeCheck === 1 ||
      this.dialogFromData.flagTypeCheck === 3
    ) {
      if (this.dialogFromData.flagTypeCheck === 1) {
        this.flagTypeCheck = true
        flagCheck = true
      } else {
        this.updateFlag = true
      }
      this.updateId = this.dialogFromData.detailId
      await this.getEquipList()
      await this.getParkingList()
      await this.getEquipTypeDetailById(this.dialogFromData.detailId, flagCheck)
    } else if (this.dialogFromData.flagTypeCheck === 2) {
      this.getEquipList()
      this.getParkingList()
    }
  },
  mounted() {
    if (this.dialogFromData.garageId) {
      this.getEquipmentLocationList(this.dialogFromData.garageId)
    }
  },
  watch: {},
  methods: {
    // 获取类型列表
    getEquipList() {
      serve.getEquipTypeSelect().then(res => {
        if (res.data.code === 200) {
          this.equipList = res.data.data
        }
      })
    },
    // 获取停车场列表
    getParkingList() {
      const userId = getUserId()
      const params = {
        userId: userId
      }
      serve.getParkingList(params).then(res => {
        if (res.data.code === 200) {
          this.parkLists = res.data.data
        }
      })
    },
    // 获取停车库
    getGarageList(id) {
      const params = {
        parkingId: id
      }
      serve.getGarageList(params).then(res => {
        if (res.data.code === 200) {
          var arr = res.data.data.map(item => {
            return {
              garageName: item.garageName,
              garageId: item.garageId
            }
          })
          this.garagesList = arr
        }
      })
    },
    getEquipmentLocationList(id) {
      const params = {
        garageId: id
      }
      serve.getEquipmentLocationList(params).then(res => {
        if (res.data.code === 200) {
          this.equipmentLocation = res.data.data
        }
      })
    },
    parkingIdChange(parkingId) {
      this.garagesList = []
      this.form.garageId = ''
      this.getGarageList(parkingId)
    },
    garageChange(garageId) {
      this.equipmentLocationList = []
      this.getEquipmentLocationList(garageId)
    },
    getImages(file) {
      this.fileList = []
      this.fileList.push(file.file)
    },
    deleteFile(file) {
      this.deleteFileList = file
      this.form.equipUrl = ''
      this.fileList = []
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
          this.form.equipUrl = res.data.data.filePath
        } else {
          this.$message.warning(res.data.msg)
        }
      }
    },
    // 删除图片
    deleteOldFile() {
      const file = this.deleteFileList
      if (file && file.id) {
        const params = {
          fileId: file.filePath
        }
        ImgServe.deleteImg(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success('图片删除成功')
          }
        })
      } else {
        this.fileList = []
      }
    },
    // 获取详情
    getEquipTypeDetailById(id, flagCheck) {
      const parmas = {
        equipId: id
      }
      serve.getEquipDetail(parmas).then(res => {
        if (res.data.code === 200) {
          const obj = res.data.data
          this.form.equipPosition = obj.equipPosition
          this.form.equipSerial = obj.equipSerial
          if (obj.equipUrl !== '') {
            this.form.equipUrl = this.IMAGEURL + obj.equipUrl
            const fileObj = {
              id: obj.equipUrl,
              filePath: obj.equipUrl
            }
            this.coverList.push(fileObj)
          }
          this.form.remarks = obj.remarks
          if (flagCheck) {
            this.form.parkingId = obj.parkingName
            this.form.garageId = obj.garageName
            this.form.equipTypeId = obj.equipName
            this.form.roadWayName = obj.roadWayName
            this.form.vmsIpcId = obj.vmsIpcId
          } else {
            this.form.parkingId = obj.parkingId
            this.getGarageList(obj.parkingId)
            this.getEquipmentLocationList(obj.garageId)
            this.form.garageId = obj.garageId
            this.form.roadWayId = obj.roadWayId
            this.form.equipTypeId = obj.equipTypeId
            this.form.vmsIpcId = obj.vmsIpcId
          }
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
      this.$refs[form].validate(async valid => {
        if (valid) {
          this.loading = true
          await this.uploadImg()
          // if (!this.form.equipUrl) {
          //   this.$message.warning('设备照片为必填项!')
          //   return
          // } else {
          //   if (this.form.businessUrl.indexOf('http') !== -1) {
          //     // 存在前缀
          //     const posIndex = this.findIndex(this.form.businessUrl, '/', 2)
          //     this.form.equipUrl = this.form.equipUrl.substr(posIndex + 1)
          //   }
          // }
          if (this.form.equipUrl.indexOf('http') !== -1) {
            // 存在前缀
            const posIndex = this.findIndex(this.form.equipUrl, '/', 2)
            this.form.equipUrl = this.form.equipUrl.substr(posIndex + 1)
          }
          if (this.updateId) {
            this.form.equipId = this.updateId
            serve.updateEquipInfo(this.form).then(res => {
              if (res.data.code === 200) {
                this.loading = false
                this.$message.success('修改成功!')
                this.$emit('handleDialog')
                this.deleteOldFile()
              } else {
                this.loading = false
                this.$message.error(res.data.msg)
              }
            })
          } else {
            serve.addEquip(this.form).then(res => {
              if (res.data.code === 200) {
                this.loading = false
                this.$message.success('添加成功!')
                this.$emit('handleDialog')
              } else {
                this.loading = false
                this.$message.error(res.data.msg)
              }
            })
          }
        }
      })
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
    }
  }
}
::v-deep .el-select {
  width: 100%;
}
.equip-manage-dialog {
  width: 100%;
  .el-row-col {
    margin: 20px 0;
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
}
</style>
