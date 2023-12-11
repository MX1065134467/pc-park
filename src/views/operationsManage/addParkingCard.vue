<template>
  <div class="ticket-wrap container" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
    <h3 class="head_title" v-text="head_title"></h3>
    <el-form :inline="true" :model="formInline" ref="formInline" :rules="rules" class="form-inline" label-width="140px" label-position="left">
       <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="车位卡类型:">
            <el-radio-group v-model="formInline.cardType" :disabled="disabled" @change="changeStatus">
              <el-radio :label="1">包天卡</el-radio>
              <el-radio :label="2">次数卡</el-radio>
              <el-radio :label="3">时长卡</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车位卡名称:" prop="cardName">
            <el-input v-model="formInline.cardName" size="small" placeholder="" :disabled="disabled" maxlength="10" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预售价" prop="cardPrice">
            <el-input-number size="small" :min="0" v-model="formInline.cardPrice" :precision="2" :disabled="disabled" step-strictly></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="停车场/车库:" class="parking-name" prop="parkNum">
             <el-cascader
              size="small"
              :disabled="disabled"
              v-model="formInline.parkNum"
              :options="childrenParking">
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="库存量:" prop="stockNum">
            <el-input-number size="small" :min="0" v-model="formInline.stockNum" :disabled="disabled || formInline.isLimitStock === 0" :step="1" step-strictly></el-input-number>
            <el-checkbox v-model="formInline.isLimitStock" :true-label="0" :false-label="1" style="margin-left: 12px" :disabled="disabled" @change="stockChange">不限库存</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formInline.cardType === 2">
          <el-form-item label="可用次数:" prop="useNum">
            <el-input-number size="small" :min="0" v-model="formInline.useNum" :disabled="disabled" :step="1" step-strictly ></el-input-number><span style="margin-left:10px">次</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formInline.cardType === 3">
          <el-form-item label="可用时长:" prop="useTime">
            <el-input-number size="small" :min="0"  v-model="formInline.useTime" :disabled="disabled" :step="1" step-strictly :max="9999"></el-input-number><span style="margin-left:10px">小时</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8" v-if="formInline.cardType === 1">
          <el-form-item label="配置天数:">
            <el-input-number size="small" :min="1" v-model="formInline.configDay" :disabled="disabled"></el-input-number>
            <span style="margin-left:10px">天</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formInline.cardType === 2" key="limitTime">
          <el-form-item label="每次是否限时:" prop="limitTime">
            <el-radio-group v-model="formInline.isLimitTime" :disabled="disabled" @change="changeLimit">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0" style="margin-left: -16px">否</el-radio>
            </el-radio-group>
            <el-input-number style="margin-left: 20px" size="small" :min="0" :max="99" v-model="formInline.limitTime" :disabled="disabled" v-if="formInline.isLimitTime === 1"></el-input-number>
            <span style="margin-left:10px" v-show="formInline.isLimitTime===1">小时</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="有效期:" class="valid-date" :prop="valid_date">
            <el-radio-group v-model="formInline.validType" :disabled="disabled" @change="changeStatus">
              <el-radio :label="1">指定有效期</el-radio>
              <el-radio :label="2">购买日起算</el-radio>
              <el-radio :label="3" v-if="formInline.cardType !== 1">不限时间</el-radio>
            </el-radio-group>
            <el-input-number style="margin-left: 20px" size="small" :min="0" v-model="formInline.effectiveDuration" :disabled="disabled" v-if="(formInline.validType === 2 && formInline.cardType !== 1)" :step="1" step-strictly></el-input-number>
            <span style="margin-left: 10px" v-if="(formInline.validType === 2 && formInline.cardType !== 1)">天内有效</span>
            <div class="data-picker-box" v-if="formInline.validType === 1">
              <el-date-picker
                align="left"
                size="small"
                :disabled="disabled"
                :picker-options="pickerOPtions"
                type="date"
                v-model.lazy="formInline.beginDate"
                value-format="timestamp"
                placeholder="开始日期">
              </el-date-picker>
              至
              <el-date-picker
                prefix-icon="~"
                align="center"
                size="small"
                :disabled="otherDisabled"
                :picker-options="pickerOPtions"
                type="date"
                v-model.lazy="formInline.endDate"
                value-format="timestamp"
                placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否指定时间可用:">
            <div class="assign_time">
              <el-radio-group v-model="formInline.isUseSection" :disabled="true">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
              <el-table stripe border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" v-if="formInline.isUseSection === 2">
                <el-table-column align='center' type="selection" :disabled="disabled"></el-table-column>
                <el-table-column
                  resizable
                  key="0"
                  align='center'
                  show-overflow-tooltip
                  width="380"
                  label="时间段期间">
                  <template slot-scope="scope">
                    <el-time-picker
                      size="small"
                      :disabled="disabled"
                      is-range
                      editable
                      v-model="scope.row.periodTime"
                      value-format="HH:mm:ss"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围">
                    </el-time-picker>
                  </template>
                </el-table-column>
                 <el-table-column
                  key="2"
                  resizable
                  align='center'
                  show-overflow-tooltip
                  label="类型">
                  <template slot-scope="scope">
                    <span>{{ scope.row.check ? '可用' : '不可用' }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="购买说明:" class="remark">
            <el-input type="textarea" :rows="6" v-model="formInline.remarks" :disabled="disabled" maxlength="250" placeholder="请输入购买说明，最多250字"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <footer>
      <el-button v-if="!disabled" size="small" @click="$router.go(-1)">取 消</el-button>
      <el-button size="small" type="primary" @click="confirm">确 定</el-button>
    </footer>
  </div>
</template>

<script>
import serve from '@/api/operationManage.api'
import { getUserInfo } from '@/common/cache.js'
export default {
  name: 'addParkingCard',
  data () {
    return {
      loading: false,
      disabled: this.$route.query.type === '查看',
      pickerOPtions: {
        disabledDate(time) {
          return time.getTime() < (new Date().getTime() - 3600 * 1000 * 24)
        }
      },
      formInline: {
        cardType: 1, // 车位卡类型 1-包天卡;2-次数卡;3-时长卡
        cardName: null, // 车位卡名称
        cardPrice: 0, // 预售价
        parkNum: null, // 停车场/车库
        stockNum: '', // 库存量
        isLimitStock: 1, // 不限库存 1-是,0-否
        useNum: null, // 可用次数
        useTime: null, // 可用时长
        isLimitTime: 1, // 是否限时 1-是,0-否
        limitTime: null, // 限时时长
        configDay: 1, // 配置天数
        validType: 1, // 有效期选择 1-指定有效期,2-购买日计算,3-不限时间
        beginDate: '',
        endDate: '',
        effectiveDuration: 0, // 购买日期起算 **天内有效
        isUseSection: 0, // 是否指定可用时间段(1-是,0-否)
        remarks: null, // 购买说明
        status: 1 // 1-启用,0-停用
      },
      parkOptions: [],
      multipleSelection: [],
      tableData: [
        {
          periodTime: '11'
        },
        {
          periodTime: ''
        }
      ],
      childrenParking: [],
      head_title: '',
      rules: {
        cardName: [{ required: true, message: '请输入车位卡名称', trigger: 'blur' }],
        stockNum: [{ required: true, msg: '请输入正确的库存量', validator: this.valid_stockNum, trigger: ['blur', 'change'] }],
        cardPrice: [{ required: true, msg: '请输入预售价', validator: this.valid_stockNum, trigger: ['change', 'blur'] }],
        parkNum: [{ required: true, message: '请选择停车场 / 车库', trigger: ['blur', 'change'] }],
        useNum: [{ required: true, msg: '请输入可用次数', validator: this.valid_limitTime, trigger: ['blur', 'change'] }],
        useTime: [{ required: true, message: '请输入可用时长', validator: this.valid_limitTime, trigger: ['blur', 'change'] }],
        configDay: [{ required: true, message: '请输入配置天数', trigger: ['blur', 'change'] }],
        limitTime: [{ required: true, message: '请输入有效限时时间', validator: this.valid_Time, trigger: ['blur', 'change'] }],
        beginDate: [{ required: true, message: '请选择开始日期', trigger: ['blur', 'change'] }],
        allDate: [{ required: true, validator: this.valid_time, trigger: ['blur', 'change'] }],
        effectiveDuration: [{ required: true, msg: '请输入有效天数', validator: this.valid_configDay, trigger: ['blur', 'change'] }]
      }
    }
  },
  async created() {
    await this.queryGarageList()
    if (this.$route.query.cardId) {
      await this.getDetail(this.$route.query.cardId)
    }
  },
  beforeRouteEnter(to, from, next) {
    to.meta.title = to.query.type + '车位卡'
    next(vm => {
      vm.head_title = to.query.type + '车位卡'
    })
  },
  watch: {
    calcDate: {
      handler(val) {
        this.formInline.configDay = val.configDay
        this.formInline.beginDate = val.beginDate
        if (this.formInline.cardType === 1 && this.formInline.validType === 1) {
          this.formInline.endDate = new Date(val.beginDate).getTime() + 3600 * 1000 * 24 * (val.configDay - 1)
        }
      }
    }
  },
  computed: {
    calcDate () {
      const { configDay, beginDate } = this.formInline
      return {
        configDay,
        beginDate
      }
    },
    otherDisabled() {
      return this.$route.query.type === '查看' || (this.formInline.cardType === 1 && this.formInline.validType === 1)
    },
    valid_date() {
      let result = ''
      if (this.formInline.cardType === 1) {
        if (this.formInline.validType === 1) {
          result = 'beginDate'
        } else {
          this.$refs.formInline.clearValidate(['beginDate', 'effectiveDuration', 'allDate'])
        }
      } else {
        if (this.formInline.validType === 1) {
          result = 'allDate'
        } else if (this.formInline.validType === 2) {
          result = 'effectiveDuration'
        } else {
          this.$refs.formInline.clearValidate(['beginDate', 'effectiveDuration', 'allDate'])
          result = null
        }
      }
      return result
    }
  },
  methods: {
    valid_stockNum(rule, value, callback) {
      const isInt = /^[1-9]\d{0,3}$/.test(value)
      if (!isInt) {
        callback(new Error(`${rule.msg}`))
      } else {
        callback()
      }
    },
    valid_limitTime(rule, value, callback) {
      const endNumber = rule.fullField === 'useNum' ? 999 : rule.fullField === 'useTime' ? 9999 : 99
      if (value > 0 && value <= Number(endNumber)) {
        callback()
      } else {
        callback(new Error(`${rule.msg}`))
      }
    },
    valid_Time(rule, value, callback) {
      const endNumber = rule.fullField === 'useNum' ? 999 : rule.fullField === 'useTime' ? 9999 : 99
      if (value >= 0 && value <= Number(endNumber)) {
        callback()
      } else {
        callback(new Error(`${rule.msg}`))
      }
    },
    valid_time(rule, value, callback) {
      if (!!this.formInline.beginDate && !!this.formInline.endDate) {
        callback()
      } else {
        callback(new Error('请选择开始和结束日期'))
      }
    },
    valid_configDay(rule, value, callback) {
      const isInt = /^[1-9]\d{0,2}$/.test(value)
      if (!isInt) {
        callback(new Error(`${rule.msg}`))
      } else {
        callback()
      }
    },
    //  选择不限库存 清除验证
    stockChange(val) {
      if (val === 0) {
        this.formInline.stockNum = ''
        this.rules.stockNum = null
        this.$nextTick(() => {
          this.$refs.formInline.clearValidate('stockNum')
        })
      }
    },
    // 改变是否限时状态
    changeLimit(val) {
      if (val === 2) {
        this.$nextTick(() => {
          this.$refs.formInline.clearValidate('limitTime')
        })
      }
    },
    // 获取停车场列表
    async queryGarageList() {
      const userId = getUserInfo().userId
      const { data: res } = await serve.getParkList({ userId })
      if (res.code === 200) {
        res.data.map(v => {
          const childrenArr = []
          v.garageIdAndName.filter(item => {
            if (item.status === 1) {
              const childObj = {
                value: item.garageId,
                label: item.garageName
              }
              childrenArr.push(childObj)
            }
          })
          const parentObj = {
            value: v.parkingId,
            label: v.parkingName,
            children: childrenArr
          }
          this.childrenParking.push(parentObj)
        })
      }
    },
    // 是否指定时间可用 表格选怎操作
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 查询详情
    async getDetail(id) {
      this.loading = true
      const { data: res } = await serve.queryCardDetail(id)
      if (res.code === 200) {
        this.loading = false
        Object.assign(this.formInline, res.data)
        this.formInline.parkNum = [res.data.parkingId, res.data.garageId]
        const beginDate = res.data.beginDate ? new Date(res.data.beginDate).getTime() : ''
        const endDate = res.data.endDate ? new Date(res.data.endDate).getTime() : ''
        this.formInline.beginDate = beginDate
        this.formInline.endDate = endDate || ''
      } else {
        this.loading = false
      }
    },
    confirm() {
      if (this.formInline.isLimitTime === 0) {
        this.$nextTick(() => {
          this.$refs.formInline.clearValidate('limitTime')
        })
      }
      if (this.formInline.isLimitStock === 0) {
        this.rules.stockNum = null
        this.$refs.formInline.clearValidate('stockNum')
        // this.$nextTick(() => {
        //   this.$refs.formInline.clearValidate('stockNum')
        // })
      }
      const type = this.$route.query.type
      if (type === '查看') {
        this.$router.go(-1)
      }
      this.$refs.formInline.validate(async valid => {
        if (valid) {
          this.formInline.parkingId = this.formInline.parkNum && this.formInline.parkNum[0]
          this.formInline.garageId = this.formInline.parkNum && this.formInline.parkNum[1]
          if (type === '添加') {
            if (this.formInline.beginDate > this.formInline.endDate) {
              this.$message('开始时间必须小于结束时间')
            } else {
              this.loading = true
              const { data: res } = await serve.addParkingCard(this.formInline)
              if (res.code === 200) {
                this.loading = false
                this.$message.success('添加成功！')
                this.$router.go(-1)
              } else {
                this.loading = false
                this.$message.error(res.msg)
              }
            }
          }
          if (type === '编辑') {
            if (this.formInline.beginDate > this.formInline.endDate) {
              this.$message('开始时间必须小于结束时间')
            } else {
              const { data: res } = await serve.editParkingCard(this.formInline)
              if (res.code === 200) {
                this.$message.success(res.msg)
                this.$router.go(-1)
              } else {
                this.loading = false
                this.$message.error(res.msg)
              }
            }
          }
        } else {
          return false
        }
      })
    },
    changeStatus(val) {
      this.formInline.beginDate = this.formInline.endDate = ''
      if (val === 3) {
        this.$refs.formInline.clearValidate(['beginDate', 'effectiveDuration', 'allDate'])
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .head_title {
    background: #606266;
    padding: 10px 0 10px 20px;
    box-sizing: border-box;
    margin-top: 0;
    color: #fff;
    font-weight: normal;
  }
  .form-inline {
    flex: 1;
    padding: 10px 25px;
    box-sizing: border-box;
    .remark {
      width: 100%;
      ::v-deep.el-form-item__content {
        width: 60%;
      }
    }
    ::v-deep.parking-name {
      width: 100%;
      display: flex;
      .el-form-item__content {
        flex: 1;
        .el-cascader {
          width: 75%;
        }
      }
    }
    ::v-deep.valid-date {
      width: 100%;
      display: flex;
      .el-form-item__content {
        display: flex;
        // flex: 1;
        align-items: center;
        .data-picker-box {
          border-radius: 4px;
          border: 1px solid #DCDFE6;
          display: flex;
          align-items: center;
          height: 32px;
          margin-left: 20px;
          .el-date-editor {
            width: 180px;
            .el-input__inner {
              border: none !important;
              padding: 0 !important;
              text-align: center;
            }
          }
        }
      }
    }
  }
  footer {
    display: flex;
    justify-content: center;
    .el-button:first-child {
      margin-right: 20px;
    }
  }
}
</style>
