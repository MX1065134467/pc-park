<template>
  <div class='tab-detail'>
    <el-button size="small" type="primary" @click="isEdit = !isEdit" v-if="!isEdit">编辑信息</el-button>
    <div class="tab_user_main">
      <el-form ref="sizeForm" :model="sizeForm" :label-position="'left'" size="small" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="车牌号：" prop="carNo">
              <span>{{sizeForm.carNo}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="姓名：">
              <el-input v-model="sizeForm.userName" :disabled="!isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话：" prop="userPhone">
              <el-input v-model="sizeForm.userPhone" :disabled="!isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="身份证号码：" prop="identityCard">
              <el-input v-model="sizeForm.identityCard" :disabled="!isEdit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆信息：" class="car-message">
              <el-input v-model="sizeForm.carBrand" :disabled="!isEdit" placeholder="请输入车辆品牌"></el-input>
              <el-input v-model="sizeForm.carModel" :disabled="!isEdit" placeholder="请输入车辆车型"></el-input>
              <el-input v-model="sizeForm.carColor" :disabled="!isEdit" placeholder="请输入车辆颜色"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="累计停车次数：">
              <span>{{sizeForm.times}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="积分：">
              <span>{{sizeForm.scoreValue}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="违规记录：">
              <span>{{sizeForm.blackSize}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="停车卡记录：">
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table
              stripe
              border
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column resizable show-overflow-tooltip align='center' v-for='(item, index) in tableHeaderData' :key='index' :label='item.label' :prop='item.prop'>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="table.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="table.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </el-col>
        </el-row>
        <el-form-item size="medium" v-if="isEdit">
          <el-button @click="isEdit = !isEdit">取消</el-button>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import server from '@/api/userManage.api.js'
import moment from 'moment'
export default {
  name: '',
  components: {},
  props: {},
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
    var validatePhone = (rule, value, callback) => {
      if (value !== '') {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('手机号码填写错误'))
          return false
        } else {
          callback()
        }
      } else {
        callback(new Error('手机号码不能为空'))
        return false
      }
    }
    var validateDriverIdCard = (rule, value, callback) => {
      if (value !== '') {
        const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!regIdCard.test(value)) {
          callback(new Error('身份证号填写有误'))
          return false
        } else {
          callback()
        }
      } else {
        return true
        // callback()
        // callback(new Error('身份证不能为空'))
        // return false
      }
    }
    return {
      sizeForm: {
        carNo: '',
        userName: '',
        userPhone: '',
        identityCard: '',
        carBrand: '',
        carModel: '',
        carColor: '',
        scoreValue: '',
        times: ''
      },
      totalCount: 0,
      table: {
        pageNo: 1,
        pageSize: 10
      },
      isEdit: false,
      // 表格数据
      tableData: [],
      tableHeaderData: [
        {
          label: '停车场名称',
          prop: 'garageName'
        }, {
          label: '车位卡类型',
          prop: 'cardTypeStr'
        }, {
          label: '车位卡名称',
          prop: 'cardName'
        }, {
          label: '价格',
          prop: 'confirmAmount'
        },
        {
          label: '有效期',
          prop: 'validateTime'
        },
        {
          label: '状态',
          prop: 'statusStr'
        },
        {
          label: '余量',
          prop: 'leftNum'
        }
      ],
      rules: {
        userPhone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        identityCard: [
          { required: true, validator: validateDriverIdCard, trigger: 'blur' }
        ],
        carNo: [
          { required: true, message: '请输车牌号', trigger: 'blur' },
          { validator: validatorCarNO, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.params = {
      carId: this.$route.query.carId,
      ...this.table
    }
    this.getUserCenterDetail()
  },
  mounted () {
  },
  methods: {
    // 获取用户中心所有数据
    getUserCenterDetail() {
      server.getUserCenterDetail(this.params).then(res => {
        if (res.data.code === 200) {
          this.sizeForm = { ...res.data.data }
          this.tableData = res.data.data.pageCarInfoDto.rows
          this.totalCount = res.data.data.pageCarInfoDto.totalCount
          this.tableData.map(res => {
            res.validateTime = moment(res.beginDate).format('YYYY-MM-DD') + '至' + moment(res.endDate).format('YYYY-MM-DD')
            res.statusStr = res.status === 0 ? '草稿' : res.status === 1 ? '正常' : res.status === 2 ? '已过期' : '已用完'
            res.confirmAmount = Number(res.confirmAmount).toFixed(2)
            res.leftNum = res.cardType === 1 ? res.leftNum + '天' : res.cardType === 2 ? res.leftNum + '次' : res.leftNum + '小时'
          })
        }
      })
    },
    // 点击保存
    onSubmit() {
      const that = this
      const params = JSON.parse(JSON.stringify(that.sizeForm))
      delete params.pageCarInfoDto
      that.$refs.sizeForm.validate(valid => {
        if (valid) {
          server.getUpdateInfoDetail(params).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: res.data.msg ? res.data.msg : '编辑成功',
                type: 'success'
              })
              that.isEdit = !that.isEdit
            } else {
              this.$message.error(res.data.msg ? res.data.msg : '编辑错误')
            }
          })
        }
      })
    },
    // 编辑信息
    handleEdit() {},
    // 每页多少条
    handleSizeChange(val) {
      this.table.pageSize = val
      this.getUserCenterDetail()
    },
    // 页数改变
    handleCurrentChange(val) {
      this.table.pageNo = val
      this.getUserCenterDetail()
    }
  }
}
</script>

<style lang='scss' scoped>
.tab-detail {
  padding: 20px 20px 0 20px;
  overflow: hidden;
  >button {
    float: right;
  }
}
</style>
<style lang="scss">
.tab_user_main {
  padding: 0 20px;
  width: 93%;
  .el-form-item__content {
    .el-input {
      width: 200px;
    }
  }
  .el-row {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .el-form-item__content {
    text-align: center;
    >button {
      width: 100px;
      margin-right: 50px;
    }
  }
  .car-message {
    .el-form-item__content {
      .el-input {
        width: 173px;
        margin-right: 20px;
      }
    }
  }
}
</style>
