<template>
  <div
    class="ticket-wrap container"
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
  >
  <h3 class="head_title">白名单免费卡</h3>
  <div style="margin-left: 50px;">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="10">
          <el-form-item label="停车场名称：" prop="garageName">
            <el-select v-model="ruleForm.garageName" placeholder="请选择" style="width:292px">
              <el-option  v-for="item in garage" :key="item.value" :label="item.garageName" :value="item.garageId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="免费卡名称：" prop="cardName">
            <el-input v-model="ruleForm.cardName" maxlength="10" placeholder="请输入免费卡名称(10个字)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="发行数量(张)："  label-width="120px" style="margin-left: 90px;" prop="count">
            <el-input-number v-model="ruleForm.count" :max=10000 :step="1" step-strictly :min="1"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="有效时间：" prop="isForever">
            <div style="display:flex;align-items:center;justify-content:flex-start;">
                <el-date-picker
                    @change="select"
                    v-model="ruleForm.value1"
                    :picker-options="pickerOPtions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy - MM - dd"
                    type="daterange"
                    :disabled="ishide"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                <!-- <el-radio v-model="ruleForm.isForever" label="2" style="margin-left: 15px;" :disabled="isSelect" @change="selectTime">长期</el-radio> -->
                <el-checkbox v-model="ruleForm.isForever"  style="margin-left: 15px;" :disabled="isSelect" @change="selectTime">长期</el-checkbox>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="13" style="margin-left: 70px;">
          <el-form-item label="状态：" >
             <el-switch v-model="ruleForm.status"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
          <el-col>
              <el-form-item label="说明：">
                <el-input v-model="ruleForm.desc" type="textarea" style="width:800px" rows="6" maxlength="100"></el-input>
              </el-form-item>
          </el-col>
      </el-row>
      <el-form-item>
        <div style="text-align: center;width: 48%;margin-top:40px;">
            <el-button style="width:140px;height:40px;margin-right:30px;" @click="cancel">取消</el-button>
            <el-button type="primary" @click="onSubmit('ruleForm')" style="width:140px;height:40px;">保存</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
 </div>
</template>

<script>
import { getUserInfo } from '@/common/cache.js'
import serve from '@/api/operationManage.api'
export default {
  name: 'whiteListFreeAdd',
  data() {
    return {
      pickerOPtions: {
        disabledDate(time) {
          return time.getTime() < (new Date().getTime() - 3600 * 1000 * 24)
        }
      },
      loading: false,
      isSelect: false,
      ishide: false,
      ruleForm: {
        garageName: '',
        cardName: '',
        count: 0,
        desc: '',
        status: true,
        value1: '',
        isForever: ''
      },
      garage: [],
      rules: {
        garageName: [{ required: true, message: '请选择停车场', trigger: ['blur', 'change'] }],
        count: [
          { required: true, message: '请输入发行数量', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '请输入发行数量', trigger: ['blur', 'change'] }
        ],
        cardName: [{ required: true, message: '请输入免费卡名称', trigger: 'blur' }]
        // isForever: [{ required: true, message: '请选择有效日期', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getParkingList()
  },
  methods: {
    // 获取停车场列表
    async getParkingList() {
      const userId = getUserInfo().userId
      const { data: response } = await serve.getParkList({ userId })
      if (response.code === 200) {
        response.data.map(item => {
          this.garage = [...this.garage, ...item.garageIdAndName]
        })
      }
    },
    cancel() {
      this.$router.push({ path: '/operationsManage/white-list-free' })
    },
    select(val) {
      if (val) {
        this.isSelect = true
      } else {
        this.isSelect = false
      }
    },
    selectTime(val) {
      if (val) {
        this.ishide = true
      } else {
        this.ishide = false
      }
    },
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        this.loading = true
        if (valid) {
          const params = {
            beginDate: this.ruleForm.value1[0],
            endDate: this.ruleForm.value1[1],
            cardName: this.ruleForm.cardName,
            garageId: this.ruleForm.garageName,
            status: this.ruleForm.status === true ? 1 : 0,
            desc: this.ruleForm.desc,
            count: this.ruleForm.count,
            isForever: this.ruleForm.isForever ? this.ruleForm.isForever : false,
            createBy: getUserInfo().userName
          }
          serve.whiteCardAdd(params).then(res => {
            if (res.data.code === 200) {
              this.loading = false
              this.$router.push({ name: 'whiteListFree' })
            }
          })
        } else {
          this.loading = false
          return false
        }
      })
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
  ::v-deep .el-form-item__label {
      padding: 0
  }
}
::v-deep .el-form-item__label {
    text-align: left;
}
::v-deep .el-row {
    margin: 30px 0;
}
</style>
