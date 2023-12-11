<template>
  <div class="resource-add-dialog system-terminal-dialog">
    <div
      class="ticket-wrap"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-dialog
        :title="dialogVisible.title"
        :visible.sync="dialogVisible.show"
        width="1000px"
        :close-on-click-modal="false"
      >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="姓名：" prop="user_name">
            <el-input
              v-model="form.user_name"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="user_phone">
            <el-input
              v-model="form.user_phone"
              placeholder="请输入联系电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否为收费员" prop="radio">
            <el-radio-group v-model="form.radio" @change="changeRadio">
              <el-radio label="1" v-model="form.radio">是</el-radio>
              <el-radio label="0" v-model="form.radio">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="角色：" prop="role">
            <el-select v-model="form.role" multiple placeholder="请选择角色">
              <el-option
                v-for="item in roleOptions"
                :key="item.role"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled == 1 ? false : true"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="归属停车场：">
            <el-select
              :key="parkCar"
              v-model="form.garage"
              :multiple="selected"
              placeholder="请选择归属停车场"
              @change="handel"
            >
              <el-option
                v-for="data in garageOptions"
                :key="data.garage"
                :label="data.garageName"
                :value="data.garageId"
              ></el-option>
            </el-select>
            <el-select
              v-if="form.radio == 1"
              style="margin-top: 10px"
              v-model="form.equipIdList"
              :multiple="true"
              placeholder="请选择设备"
            >
              <el-option
                v-for="item in equipList"
                :key="item.equipId"
                :label="item.equipName"
                :value="item.equipId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注说明：">
            <el-input
              v-model="remark"
              type="textarea"
              :rows="3"
              maxlength="120"
              placeholder="请输入备注，最多120字"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="reset('form')">取 消</el-button>
          <el-button size="small" type="primary" @click="handleOk('form')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import serve from '@/api/systemManage.api'
import { getParkingId } from '@/common/cache.js'
export default {
  name: 'systemTerminalDialog',
  components: {},
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
    var validatePhone = (rule, value, callback) => {
      if (value !== '') {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('联系电话填写错误'))
          return false
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入联系电话'))
        return false
      }
    }
    return {
      form: {
        user_name: '',
        user_phone: '',
        role: [],
        garage: '',
        radio: '0',
        equipIdList: []
      },
      remark: '',
      updateId: '',
      loading: false,
      rules: {
        user_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 15, message: '长度不能超过15个字符', trigger: 'blur' }
        ],
        user_phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        garage: [
          { required: true, message: '请选择归属停车场', trigger: 'blur' }
        ],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }],
        radio: [
          { required: true, message: '请选择是否为收费员', trigger: 'change' }
        ]
      },
      roleOptions: [],
      garageOptions: [],
      selected: true,
      roleSelect: false,
      parkCar: 1,
      equipList: []
    }
  },
  created() {
    this.updateId = this.dialogFromData.user_id
    this.form = { ...this.form, ...this.dialogFromData }
    if (this.updateId) {
      this.getTravelDetailById(this.updateId)
    }
    // this.getparking(this.updateId)
  },
  mounted() {
    this.getRoleList()
    this.getPark()
  },
  methods: {
    changeRadio(e) {
      this.radio = e
      if (e === '1') {
        ++this.parkCar
        this.form.garage = ''
        this.selected = false
      } else if (e === '0') {
        ++this.parkCar
        this.form.garage = []
        this.selected = true
      }
    },
    handel() {
      this.$refs.form.clearValidate('garage')
      if (this.form.radio === '1') {
        this.getEquipList(this.form.garage)
      }
    },
    getEquipList(id) {
      const params = {
        garageId: id
      }
      serve.getEquipListByGatageId(params).then((res) => {
        if (res.data.code === 200) {
          if (res.data.data.length === 0) {
            this.equipList = []
            this.form.equipIdList = []
          } else {
            this.equipList = res.data.data
          }
          // if (this.updateId) {
          //   this.form.equipIdList = [9]
          // }
        }
      })
    },
    // 查看每条数据详情
    getTravelDetailById(id) {
      const params = {
        userId: id
      }
      serve.getAccountInfo(params).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          this.form.role = []
          this.form.garage = []
          this.remark = res.data.data.remarks
          this.form.radio = String(res.data.data.isToll)
          this.changeRadio(this.form.radio)
          if (res.data.data.roleId === null) {
            this.form.role = []
          } else {
            const roles = res.data.data.roleId.split(',')
            for (var i in roles) {
              this.form.role.push(Number(roles[i]))
            }
          }
          if (this.form.radio === '1') {
            this.form.garage = Number(res.data.data.garageId)
            this.getEquipList(this.form.garage)
            this.form.equipIdList = []
            const equipIdList = res.data.data.equipId.split(',')
            equipIdList.forEach((item) => {
              this.form.equipIdList.push(Number(item))
            })
          } else {
            const garages = res.data.data.garageId.split(',')
            for (var item in garages) {
              this.form.garage.push(Number(garages[item]))
            }
          }
        }
      })
    },
    // 获取角色
    getRoleList() {
      serve.getRole().then((res) => {
        this.roleOptions = []
        if (res.data.code === 200) {
          res.data.data.sysRole.map((data) => {
            this.roleOptions.push({
              value: data.roleId,
              label: data.roleName,
              disabled: data.status
            })
          })
        }
      })
    },
    // 获取所属车位
    getPark() {
      var parkingId = getParkingId()
      const params = {
        parkingId: Number(parkingId)
      }
      serve.getParking(params).then((res) => {
        // console.log(res)
        this.garageOptions = []
        if (res.data.code === 200) {
          res.data.data.map((item) => {
            this.garageOptions.push({
              garageId: item.garageId,
              garageName: item.garageName
            })
          })
        }
      })
    },
    // 取消清空
    reset(formName) {
      this.dialogVisible.show = false
      this.$refs[formName].resetFields()
    },
    // 保存
    handleOk(form) {
      const that = this
      const array = []
      if (!this.selected) {
        array.push(JSON.parse(JSON.stringify(that.form.garage)))
      }
      that.$refs[form].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            userName: that.form.user_name,
            userPhone: that.form.user_phone,
            remark: that.remark,
            garageIdList: this.selected ? that.form.garage : array,
            roleIdList: that.form.role,
            userId: that.updateId ? that.updateId : ' ',
            isToll: that.radio ? that.radio : '0',
            equipIdList: that.form.equipIdList
          }
          if (!that.updateId) {
            serve.addAccount(params).then((res) => {
              // console.log(res)
              if (res.data.code === 200) {
                that.$message.success('更新成功')
                that.loading = false
                that.dialogVisible.show = false
                that.$emit('handleDialog')
              } else if (res.data.code === 405) {
                that.loading = false
                that.$message.warning(res.data.msg)
              }
            })
          } else {
            serve.addAccount(params).then((res) => {
              if (res.data.code === 200) {
                that.$message.success('更新成功')
                that.loading = false
                that.dialogVisible.show = false
                that.$emit('handleDialog')
              } else if (res.data.code === 405) {
                that.loading = false
                that.$message.warning(res.data.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped></style>
<style lang="scss">
@import "@/utils/resourceDialog.scss";
.system-terminal-dialog {
  .el-dialog {
    .address {
      .el-form-item__content {
        .el-input {
          width: 280px;
        }
      }
    }
  }
  .el-input {
    width: 280px;
  }
  .radio_group {
    .el-form-item__content {
      display: flex;
      align-items: center;
      .el-radio-group {
        display: flex;
        margin-right: 30px;
      }
      .el-select {
        margin-right: 30px;
      }
    }
  }
}
</style>
