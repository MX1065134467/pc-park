<template>
  <div class='data-reportform'>
    <div class="ticket-add-title">
      <div>创建报表</div>
      <el-button size="small" type="primary" icon="el-icon-data-line" @click="toHistoryReport">历史报表</el-button>
    </div>
    <div class="report-form-content">
      <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-row class="el-row-col">
          <el-col :span="24">
            <el-form-item label="报表名称" prop="reportName">
              <el-input v-model="ruleForm.reportName" class="input-style"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24">
            <el-form-item label="报表类型" prop="reportType">
              <el-select v-model="ruleForm.reportType" placeholder="报表类型" @change="handleTypeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="">
              <!-- <el-date-picker v-model="ruleForm.timeRange" type="daterange" format="yyyy - MM - dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> -->
              <!-- </el-date-picker> -->
              <div v-if="ruleForm.reportType === 1">
                <el-date-picker
                  v-model="timeRange"
                  type="date"
                  @change="timerChange(timeRange, 1)"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div v-if="ruleForm.reportType === 2">
                <el-date-picker
                  v-model="timeRange"
                  type="week"
                  format="yyyy 第 WW 周"
                  @change="timerChange(timeRange, 2)"
                  :picker-options="{'firstDayOfWeek': 1}"
                  placeholder="选择周">
                </el-date-picker>
              </div>
              <div v-if="ruleForm.reportType === 3">
                <el-date-picker
                  v-model="timeRange"
                  type="month"
                  @change="timerChange(timeRange, 3)"
                  placeholder="选择月">
                </el-date-picker>
              </div>
              <div v-if="ruleForm.reportType === 4">
                <el-date-picker
                  v-model="timeRange"
                  type="year"
                  @change="timerChange(timeRange, 4)"
                  placeholder="选择年">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="" prop="" v-if="ruleForm.reportType === 4">
              <el-radio v-model="ruleForm.type" label="1">分月</el-radio>
              <el-radio v-model="ruleForm.type" label="2">总计</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24">
            <el-form-item label="停车场" prop="useScenic">
              <el-select v-model="ruleForm.useScenic" multiple placeholder="停车场" class="scenic-style">
                <el-option v-for="item in scenicOption" :key="item.garage_id" :label="item.garage_name" :value="item.garage_id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24">
            <el-form-item label="报表备注" prop="reportMark">
              <el-input v-model="ruleForm.reportMark" class="input-style"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="el-row-col">
          <el-col :span="24">
            <el-form-item label="统计指标字段" prop="statisticsFlag">
              <el-select v-model="ruleForm.statisticsFlag" multiple placeholder="统计指标字段" class="scenic-style">
                <el-option v-for="item in statisticsOption" :key="item.value" :label="item.label" :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleOk('ruleForm')">生成报表</el-button>
        <el-button size="small" @click="resetFile('ruleForm')">重 置</el-button>
      </div>
    </div>
    <div v-if="dialogFormVisible.show">
      <finish-dialog :dialogVisible='dialogFormVisible' ref="finishDialog"></finish-dialog>
    </div>
  </div>
</template>

<script>
import finishDialog from './dialog/finishDialog'
// eslint-disable-next-line no-unused-vars
import serve from '@/api/dataAnalysis.api.js'
import moment from 'moment'
export default {
  name: '',
  components: {
    finishDialog
  },
  props: {},
  data() {
    var nameValid = (rule, value, callback) => {
      if (value.trim().length < 1 || value.trim().length > 40) {
        return callback(new Error('报表名称长度在1~40之间'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: {
        show: false
      },
      timeRange: '',
      ruleForm: {
        startDate: null,
        endDate: null,
        reportName: '',
        reportType: 1,
        // timeRange: ['', ''],
        type: '1',
        useScenic: [],
        reportMark: '',
        statisticsFlag: []
      },
      rules: {
        reportName: [
          { required: true, message: '请输入报表名称', trigger: 'blur' },
          { required: true, validator: nameValid }
        ],
        reportType: [
          { required: true, message: '请选择报表类型', trigger: 'blur' }
        ],
        timeRange: [
          { required: true, message: '请选择报表时间范围', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择报表按月或者总计', trigger: 'blur' }
        ],
        useScenic: [
          { required: true, message: '请选择作用景区', trigger: 'blur' }
        ],
        reportMark: [],
        statisticsFlag: [
          { required: true, message: '请选择统计标志字段', trigger: 'blur' }
        ]
      },
      options: [
        {
          value: 1,
          label: '日报'
        },
        {
          value: 2,
          label: '周报'
        },
        {
          value: 3,
          label: '月报'
        },
        {
          value: 4,
          label: '年报'
        }
      ],
      scenicOption: [],
      statisticsOption: [
        {
          value: 0,
          label: '临停收入'
        },
        {
          value: 1,
          label: '售卡销售额'
        },
        {
          value: 2,
          label: '现金收入'
        },
        {
          value: 3,
          label: '线上收入'
        },
        {
          value: 5,
          label: '系统缴费收入'
        },
        {
          value: 6,
          label: '自助缴费收入'
        },
        {
          value: 7,
          label: '收费总计'
        },
        // {
        //   value: 8,
        //   label: '售卡车流量'
        // },
        // {
        //   value: 9,
        //   label: '临停车流量'
        // },
        {
          value: 8,
          label: '总车流量'
        }
      ],
      reportData: {
        createTime: '',
        createTimeStr: '',
        fileName: '',
        filePath: '',
        id: '',
        reportDataCycle: '',
        effectScenicSpot: '',
        statisticalIndicator: ''
      }
    }
  },
  created() {
    this.ruleForm.timeRange = [new Date(moment().year(), moment().month(), moment().date()), new Date(moment().year(), moment().month(), moment().date(), 23, 59, 59)]
    if (this.$route.query.row) {
      this.checkFlag = true
    }
  },
  mounted() {
    this.getParkingList()
  },
  methods: {
    // 停车场列表
    getParkingList (parkName) {
      const params = {
        parkName: parkName || ''
      }
      this.parkListData = []
      this.currentPark = {}
      serve.getParkingList(params).then(res => {
        if (res.data.code === 200) {
          this.scenicOption = res.data.data
          // this.currentPark = this.parkListData[0]
          // 获取车库后来调用函数
        } else {
          this.$message({ type: 'warning', message: res.data.msg })
        }
      })
    },
    timerChange(e, type) {
      console.log(e, type)
      if (type === 1) {
        this.ruleForm.startDate = moment(e).startOf('day').valueOf()
        this.ruleForm.endDate = moment(e).endOf('day').valueOf()
      } else if (type === 2) {
        this.ruleForm.startDate = moment(e).startOf('week').add(1, 'days').valueOf()
        this.ruleForm.endDate = moment(e).endOf('week').add(1, 'days').valueOf()
      } else if (type === 3) {
        this.ruleForm.startDate = moment(e).startOf('month').valueOf()
        this.ruleForm.endDate = moment(e).endOf('month').valueOf()
      } else if (type === 4) {
        this.ruleForm.startDate = moment(e).startOf('year').valueOf()
        this.ruleForm.endDate = moment(e).endOf('year').valueOf()
      }
      console.log(this.ruleForm.startDate, this.ruleForm.endDate)
    },
    handleOk(form) {
      if (this.timeRange === '') {
        this.$message.warning('请选择报表类型和日期')
        return false
      }
      const params = {
        // endDate: new Date(this.ruleForm.timeRange[1]).getTime(),
        endDate: this.ruleForm.endDate,
        garageIds: this.ruleForm.useScenic.join(','),
        indicators: this.ruleForm.statisticsFlag.join(','),
        remarks: this.ruleForm.reportMark,
        reportName: this.ruleForm.reportName,
        reportSubType: Number(this.ruleForm.type),
        reportType: Number(this.ruleForm.reportType),
        // startDate: new Date(this.ruleForm.timeRange[0]).getTime()
        startDate: this.ruleForm.startDate
      }
      this.$refs[form].validate(valid => {
        if (valid) {
          this.dialogFormVisible.show = true
          serve.createReport(params).then(res => {

          })
        } else {
          this.$message.warning('请检查必填项')
          return false
        }
      })
      console.log(form, 'form---------->')
    },
    // 报表类型切换
    handleTypeChange(event) {
      // let nowDate = moment()
      // let endDate
      // switch (event) {
      //   case 1:
      //     endDate = nowDate
      //     break
      //   case 2:
      //     nowDate = moment().subtract(moment().day() - 1, 'days')
      //     endDate = moment().add(7 - moment().day(), 'days')
      //     break
      //   case 3:
      //     nowDate = moment().startOf('month')
      //     endDate = moment().endOf('month')
      //     break
      //   case 4:
      //     nowDate = moment().startOf('year')
      //     endDate = moment().endOf('year')
      //     break
      // }
      // this.ruleForm.timeRange = [new Date(nowDate.year(), nowDate.month(), nowDate.date()), new Date(nowDate.year(), endDate.month(), endDate.date(), 23, 59, 59)]
    },
    resetFile(form) {
      this.$refs[form].resetFields()
    },
    toHistoryReport() {
      this.$router.push({
        path: '/dataAnalysis/historyReport'
      })
    }
  },
  watch: {
    'ruleForm.useScenic'() {
      const arr = []
      for (var i = 0; i < this.scenicOption.length; i++) {
        this.ruleForm.useScenic.map(item => {
          if (item === this.scenicOption[i].label) {
            arr.push(this.scenicOption[i].label)
          }
        })
      }
      this.ruleForm.reportMark = arr.join(',')
    }
  }
}
</script>

<style lang='scss' scoped>
.data-reportform {
  height: 100%;
  background: #ffffff;
  .top-titlebox {
    height: 40px;
    padding: 5px 20px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    background: #f5f7f9;
    color: #333333;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
  }
  .report-form-content {
    padding: 50px;
    padding-top: 70px;
    .el-row-col {
      margin: 20px;
      .scenic-style {
        width: 800px;
      }
      .input-style {
        width: 800px;
      }
    }
  }
  .dialog-footer {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 300px;
    button {
      width: 120px;
      &:first-child {
        margin-right: 40px;
      }
    }
  }
}
</style>
