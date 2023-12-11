<template>
  <div
    class="ticket-wrap container"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
  >
    <h3 class="head_title">{{ head_title }}</h3>
    <el-form
      :inline="true"
      :model="formInline"
      class="form-inline"
      ref="accountForm"
    >
      <el-row :gutter="20">
        <el-col :span="6" :lg="6">
          <el-form-item
            label="停车场"
            prop="parkNum"
            :rules="[
              { required: true, message: '请选择停车场/车库', trigger: 'blur' }
            ]"
          >
            <el-cascader
              size="small"
              :disabled="disabled"
              v-model="formInline.parkNum"
              :options="parkOptions"
            >
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6" :lg="6">
          <el-form-item
            label="计费规则名称:"
            prop="ruleName"
            :rules="[
              {
                required: true,
                message: '请填写计费规则名称',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              size="small"
              v-model="formInline.ruleName"
              placeholder=""
              :disabled="disabled"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :lg="6">
          <el-form-item label="免费时长：">
            <el-input-number
              size="small"
              :min="0"
              :max="9999"
              v-model="formInline.freeDura"
              :disabled="disabled"
              @change="handleChange"
            >
            </el-input-number>
            分钟
          </el-form-item>
        </el-col>
        <el-col :span="6" :lg="6">
          <el-form-item label="计费上限：">
            <el-input-number
              size="small"
              :min="0"
              :max="99999999"
              v-model="formInline.chargeUpperLimit"
              :precision="2"
              :disabled="disabled"
            ></el-input-number>
          </el-form-item>
          <i
            class="tip"
            style="position: absolute; left: 82%; top: 40px; font-size: 12px"
            >备注： 0 表示无上限</i
          >
        </el-col>
      </el-row>
      <el-form-item label="针对用户类型：">
        <el-radio
          v-model="formInline.customerType"
          :label="1"
          :disabled="disabled"
          >临停车主</el-radio
        >
      </el-form-item>
      <el-form-item label="适用车型：">
        <el-radio-group v-model="formInline.carType">
          <el-radio
            v-for="item in carTypeList"
            :label="item.car_type"
            :disabled="disabled"
            :key="item.car_type"
            >{{ item.item_name }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="计费方式：">
        <el-radio-group v-model="formInline.ruleWay" :disabled="disabled">
          <el-radio :label="1">时长计费</el-radio>
          <el-radio :label="2">时段计费</el-radio>
          <el-radio :label="3">按次计费</el-radio>
          <el-radio :label="4">阶梯分段计费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="默认规则："
        v-if="
          formInline.ruleWay === 1 ||
            formInline.ruleWay === 2 ||
            formInline.ruleWay === 3 ||
            formInline.ruleWay === 4
        "
      >
        <div class="rule_box">
          <div class="rule_top">
            <i class="one">1</i>
            <div
              class="col"
              v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"
            >
              <span>每</span
              ><el-input-number
                size="small"
                :min="0.5"
                :step="0.5"
                step-strictly
                :max="9999"
                v-model="formInline.unitHourValue1"
                :disabled="disabled"
              ></el-input-number
              ><span>小时</span>
            </div>
            <div
              class="col"
              v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"
            >
              <span></span
              ><el-input-number
                size="small"
                :min="0"
                :max="9999"
                v-model="formInline.unitHourAmount1"
                :precision="2"
                :disabled="disabled"
              ></el-input-number
              ><span>元</span>
            </div>
            <div class="col" v-if="formInline.ruleWay === 2">
              <span>每增加</span
              ><el-input-number
                size="small"
                :min="0.5"
                :step="0.5"
                step-strictly
                :max="9999"
                v-model="formInline.unitHourValue2"
                :disabled="disabled"
              ></el-input-number
              ><span>小时</span>
            </div>
            <div class="col" v-if="formInline.ruleWay === 2">
              <span>增加</span
              ><el-input-number
                size="small"
                :min="0"
                step-strictly
                :max="9999"
                v-model="formInline.unitHourAmount2"
                :precision="2"
                :disabled="disabled"
              ></el-input-number
              ><span>元</span>
            </div>
            <div class="col" v-if="formInline.ruleWay === 3">
              <span>每次</span
              ><el-input-number
                size="small"
                :min="0.5"
                :step="0.5"
                step-strictly
                :max="9999"
                v-model="formInline.unitHourValue4"
                :disabled="disabled"
              ></el-input-number
              ><span>小时内</span>
            </div>
            <div class="col" v-if="formInline.ruleWay === 3">
              <span>每次</span
              ><el-input-number
                size="small"
                :min="0"
                :max="9999"
                v-model="formInline.unitHourAmount4"
                :precision="2"
                :disabled="disabled"
              ></el-input-number
              ><span>元</span>
            </div>
            <div
              class="col"
              v-if="formInline.ruleWay === 4"
              style="display: block;"
            >
              <div v-for="(item, index) in add_desc_list" :key="index" style="display:flex">
                <el-input-number
                  size="small"
                  :min="0"
                  :precision="2"
                  :max="9999"
                  v-model="item.beginHourValue"
                  :disabled="freeDisabled"
                ></el-input-number
                ><span>小时</span>
                <span>至</span>
                <el-input-number
                  size="small"
                  :min="item.beginHourValue"
                  :precision="2"
                  :max="9999"
                  v-model="item.endHourValue"
                  :disabled="upperDisabled"
                  @change="val => handleChangeHour(val, index)"
                ></el-input-number>
                <span>小时</span>
                <span>(含)，</span>
                <span>收费</span>
                <el-input-number
                  size="small"
                  :min="0"
                  :max="9999"
                  :precision="2"
                  v-model="item.unitAmount"
                  :disabled="disabled"
                ></el-input-number>
                <span>元</span>
                <div style="display:flex"  v-show="isHidden">
                  <i
                    class="el-icon-circle-plus-outline"
                    @click="addDescItem"
                    v-show="index == 0"
                    style="font-size: 25px;"
                  ></i>
                </div>
                <div v-show="isHidden">
                  <i
                    class="el-icon-remove-outline"
                    style="font-size: 25px;"
                    v-show="index === (add_desc_list.length - 1) && index !== 0"
                    @click="removeDescItem(index)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div class="rule_down" style="margin-top: 20px">
            <i class="one">2</i>
            <div
              class="col"
              v-if="formInline.ruleWay === 4">
              <span>每满</span
              ><el-input-number
                size="small"
                :min="0"
                :precision="2"
                :max="9999"
                v-model="plusTime"
                :disabled="freeDisabled"
              ></el-input-number
              ><span>小时</span>
            </div>
            <div
              class="col"
              v-if="formInline.ruleWay === 4">
              <span>上限</span
              ><el-input-number
                size="small"
                :min="0"
                :max="9999"
                v-model="plusTimeAdd"
                :precision="2"
                :disabled="disabled"
              ></el-input-number
              ><span>元</span>
            </div>
            <div class="col" v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"><span>每满</span><el-input-number size="small" :min="0.5" :step="0.5" step-strictly :max="9999" v-model="formInline.unitHourValue3" :disabled="disabled"></el-input-number><span>小时</span></div>
            <div class="col" v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"><span>上限</span><el-input-number size="small" :min="0" :max="9999" v-model="formInline.upperLimitAmount" :precision="2" :disabled="disabled"></el-input-number><span>元</span></div>
            <!-- <div class="col" v-if="formInline.ruleWay === 3">每次<el-input-number v-model="formInline.two_everyHour" :disabled="disabled"></el-input-number>小时内</div> -->
            <div class="col" v-if="formInline.ruleWay === 3">
              <span>满</span
              ><el-input-number
                size="small"
                :min="1"
                :max="9999"
                v-model="formInline.unitNumValue"
                :disabled="disabled"
              ></el-input-number
              ><span>次</span>
            </div>
            <div class="col" v-if="formInline.ruleWay === 3">
              <span>上限</span
              ><el-input-number
                size="small"
                :min="0"
                :max="9999"
                v-model="formInline.upperLimitAmount2"
                :precision="2"
                :disabled="disabled"
              ></el-input-number
              ><span>元</span>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div
      class="form_table"
      v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"
    >
      <p style="color: #606266; font-size: 14px; margin-bottom: 20px">
        指定时间段计费规则：
      </p>
      <el-table
        stripe
        border
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <!-- <el-table-column align='center' :selectable="() => !(this.$route.query.type === '查看')" type="selection"> -->
        <el-table-column width="100px" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"
          resizable
          key="0"
          align="center"
          show-overflow-tooltip
          width="380"
          label="时间段期间"
        >
          <template slot-scope="scope">
            <el-time-picker
              size="small"
              :disabled="disabled"
              is-range
              editable
              format="HH:mm"
              v-model="scope.row.periodTime"
              value-format="HH:mm:ss"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </template>
        </el-table-column>
        <el-table-column
          v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"
          key="1"
          resizable
          align="center"
          show-overflow-tooltip
          label="基础时长"
        >
          <template slot-scope="scope">
            <el-input-number
              size="small"
              :min="0.5"
              :step="0.5"
              step-strictly
              :max="9999"
              v-model="scope.row.baseValue"
              :disabled="disabled"
            ></el-input-number
            >小时
          </template>
        </el-table-column>
        <el-table-column
          v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"
          key="2"
          resizable
          align="center"
          show-overflow-tooltip
          label="基础费用"
        >
          <template slot-scope="scope">
            <el-input-number
              size="small"
              :min="0"
              :max="9999"
              v-model="scope.row.baseAmount"
              :precision="2"
              :disabled="disabled"
            ></el-input-number
            >元
          </template>
        </el-table-column>
        <el-table-column
          v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"
          key="3"
          resizable
          align="center"
          show-overflow-tooltip
          label="续时"
        >
          <template slot-scope="scope">
            <el-input-number
              size="small"
              :min="0.5"
              :step="0.5"
              step-strictly
              :max="9999"
              v-model="scope.row.continueValue"
              :disabled="disabled"
            ></el-input-number
            >小时
          </template>
        </el-table-column>
        <el-table-column
          v-if="formInline.ruleWay === 1 || formInline.ruleWay === 2"
          key="4"
          resizable
          align="center"
          show-overflow-tooltip
          label="续费"
        >
          <template slot-scope="scope">
            <el-input-number
              size="small"
              :min="0"
              :max="9999"
              v-model="scope.row.continueAmount"
              :precision="2"
              :disabled="disabled"
            ></el-input-number
            >元
          </template>
        </el-table-column>
      </el-table>
    </div>
    <footer>
      <el-button v-if="!disabled" size="small" @click="$router.go(-1)"
        >取 消</el-button
      >
      <el-button size="small" type="primary" @click="handleOk">确 定</el-button>
    </footer>
  </div>
</template>
<script>
import serve from '@/api/operationManage.api'
import { getUserInfo } from '@/common/cache.js'
export default {
  name: 'accountRulesAdd',
  data() {
    return {
      add_desc_list: [
        {
          beginHourValue: 0,
          endHourValue: 0,
          unitAmount: 0,
          orderNum: 1
        }
      ], // 新增的规格参数
      loading: false,
      freeDisabled: true,
      upperDisabled: false,
      disabled: this.$route.query.type === '查看',
      parkOptions: [],
      value: null,
      carTypeList: [],
      addIsow: false,
      isHidden: true,
      formInline: {
        parkNum: [], // 停车场
        ruleName: null, // 计费规则名称
        freeDura: 0, // 免费时长
        chargeUpperLimit: 0, // 计费上限
        customerType: 1, // 针对用户类型：1-临停
        carType: '',
        ruleWay: 1, // 计费方式：
        unitHourValue1: 0, // 每单位小时
        unitHourAmount1: 0, // 单位小时收取金额
        unitHourValue2: 0, // 每增加单位小时数值(按时段)
        unitHourAmount2: 0, // 增加单位小时收取金额(按时段)
        unitHourValue4: 0.5, // 每次对应的单位小时(按次)
        unitHourAmount4: 0, // 每次收取金额(按次)
        // ...console
        unitHourValue3: 0, // 每满单位小时
        upperLimitAmount: 0, // 上限收取金额
        // two_everyHour: 8,
        unitNumValue: 1, // 每满单位次数数值(按次)
        upperLimitAmount2: 0, // 上限收取金额(按次)
        status: 0
      },
      tableData: [
        {
          periodTime: ['8:00:00', '22:00:00'],
          baseValue: null, // 基础时长
          baseAmount: null, // 基础费用
          continueValue: null, // 续时
          continueAmount: null, // 续费
          orderNum: 1, // 顺序记录
          status: 0
        },
        {
          periodTime: ['8:00:00', '22:00:00'],
          baseValue: null,
          baseAmount: null,
          continueValue: null,
          continueAmount: null,
          orderNum: 2,
          status: 0
        }
      ],
      head_title: '',
      plusTime: 0,
      plusTimeAdd: 0
    }
  },
  created() {
    this.queryGarageList()
    this.getCarTypeList()
    if (this.$route.query.ruleId) {
      this.getDetail()
    }
    if (this.$route.query.type === '查看') {
      this.isHidden = false
    }
  },
  beforeRouteEnter(to, from, next) {
    to.meta.title = to.query.type + '计费规则'
    next(vm => {
      vm.head_title = to.query.type + '计费规则'
    })
  },
  methods: {
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
          this.parkOptions.push(parentObj)
        })
      }
    },
    async getCarTypeList() {
      const { data: res } = await serve.getCarTypeList({})
      if (res.code === 200) {
        this.carTypeList = res.data
        this.formInline.carType = res.data[0].car_type
      }
    },
    changeSwitch(e) {
      console.log(e)
    },
    handleChange(value) {
      this.add_desc_list[0].beginHourValue = value / 60
      this.add_desc_list[0].endHourValue = value / 60
      console.log(this.add_desc_list)
      if (this.formInline.freeDura > 0) {
        this.upperDisabled = false
      }
    },
    // 新增规格参数
    addDescItem() {
      this.addIsow = true
      if (this.add_desc_list.length < 5) {
        this.add_desc_list.push({
          beginHourValue: this.add_desc_list[this.add_desc_list.length - 1].endHourValue,
          endHourValue: 0,
          unitAmount: 0,
          orderNum: this.add_desc_list.length + 1
        })
      } else {
        this.$message('只能添加5个默认规则')
      }
    },
    //
    // 至多少小时的value值
    handleChangeHour(val, index) {
      if (this.add_desc_list.length > index) {
        this.plusTime = val
        this.add_desc_list[index + 1].beginHourValue = val
        this.add_desc_list[index + 1].endHourValue = val
      }
      if (this.$route.query.type === '编辑') {
        this.plusTime = this.add_desc_list[this.add_desc_list.length - 1].endHourValue
      }
      // this.addDescItem()
    },
    // 删除新增规格
    removeDescItem(index) {
      this.add_desc_list.splice(index, 1)
      this.plusTime = this.add_desc_list[this.add_desc_list.length - 1].endHourValue
    },
    // 详情
    getDetail() {
      const params = {
        ruleId: this.$route.query.ruleId
      }
      this.loading = true
      serve.rulesDetail(params).then(({ data: res }) => {
        if (res.code === 200) {
          this.loading = false
          if (res.data.ruleWay === 4) {
            this.plusTime = res.data.unitHourValue3
            this.plusTimeAdd = res.data.upperLimitAmount
            this.add_desc_list = res.data.parkingRulext2s
            if (this.$route.query.type === '编辑') {
              this.upperDisabled = false
            }
          }
          Object.assign(this.formInline, res.data)
          this.formInline.parkNum = [
            res.data.parkingId,
            res.data.parkingGarageId
          ]
          const parkingRules = res.data.parkingRules
          parkingRules.forEach((item, index) => {
            item.beginTime = item.beginTime ? item.beginTime : null
            item.endTime = item.endTime ? item.endTime : null
            item.periodTime = [item.beginTime, item.endTime]
            // item.status = Boolean(item.status)
            Object.assign(this.tableData[index], res.data.parkingRules[index])
          })
        }
      })
    },
    handleOk() {
      if (this.$route.query.type === '查看') {
        this.$router.go(-1)
      } else {
        const params = this.formInline
        this.tableData.forEach(item => {
          if (item.beginTime) {
            item.beginTime = item.periodTime && item.periodTime[0]
            item.endTime = item.periodTime && item.periodTime[1]
          }
          if (item.periodTime.length === 2) {
            item.beginTime = item.periodTime && item.periodTime[0]
            item.endTime = item.periodTime && item.periodTime[1]
          }
          item.status = Number(item.status)
          return item
        })
        params.createBy = getUserInfo().userName
        params.parkingRules = this.tableData
        params.parkingId = this.formInline.parkNum[0]
        params.parkingGarageId = this.formInline.parkNum[1]
        this.$refs.accountForm.validate(async valid => {
          if (valid) {
            if (this.$route.query.type === '编辑') {
              if (this.formInline.ruleWay === 4) {
                params.parkingRules = null
                params.unitHourValue3 = this.add_desc_list[this.add_desc_list.length - 1].endHourValue
                params.upperLimitAmount = this.plusTimeAdd
                params.parkingRulext2s = this.add_desc_list
                serve.updataAccount(params).then(res => {
                  this.$message.success(res.data.msg)
                  this.$router.push({ name: 'accountingRules' })
                })
              } else {
                serve.updataAccount(params).then(res => {
                  if (res.data.code === 200) {
                    this.$message.success(res.data.msg)
                    this.$router.push({ name: 'accountingRules' })
                  }
                })
              }
            }
            if (this.$route.query.type === '添加') {
              this.loading = true
              if (this.formInline.ruleWay === 4) {
                params.parkingRules = null
                params.unitHourValue3 = this.plusTime
                params.upperLimitAmount = this.plusTimeAdd
                params.parkingRulext2s = this.add_desc_list
                serve.addRules(params).then(res => {
                  console.log(res, 9999)
                  this.loading = false
                  this.$message.success(res.data.msg)
                  this.$router.push({ name: 'accountingRules' })
                })
              } else if (this.formInline.ruleWay !== 4) {
                serve.addRules(params).then(res => {
                  if (res.data.code === 200) {
                    this.loading = false
                    this.$message.success(res.data.msg)
                    this.$router.push({ name: 'accountingRules' })
                  } else {
                    this.loading = false
                  }
                })
              }
            }
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .head_title {
    background: #606266;
    padding: 10px 0 10px 20px;
    box-sizing: border-box;
    margin-top: 0;
    color: #fff;
    font-weight: normal;
  }
  .form-inline,
  .form_table {
    padding: 10px 25px;
    box-sizing: border-box;
    .el-form-item {
      display: flex;
      ::v-deep.el-form-item__content {
        .el-cascader {
          width: 100%;
        }
        flex: 1;
        .rule_box {
          width: 100%;
          .rule_top,
          .rule_down {
            width: 100%;
            display: flex;
            align-items: center;
            .one {
              border: 2px solid #777;
              width: 23px;
              border-radius: 50%;
              text-align: center;
              line-height: 23px;
              font-size: 16px;
              font-weight: bold;
              margin-right: 10px;
            }
            .col {
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-right: 20px;
              span {
                display: inline-block;
                width: 42px;
                // text-align: right;
              }
              .el-input-number {
                margin: 0 6px;
              }
            }
          }
          .rule_top {
            .col {
              display: flex;
              justify-content: space-around;
              align-items: center;
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
  footer {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    .el-button:first-child {
      margin-right: 20px;
    }
  }
}
</style>
