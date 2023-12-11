<template>
  <div class="ticket-wrap container" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
    <div class="head">
      <h3 class="head_title">销售会员卡</h3>
      <el-button size="small" type="primary" icon="el-icon-back" @click="$router.go(-1)">返 回</el-button>
    </div>
    <div class="content">
      <div class="content_grid">
        <h3>车位卡信息</h3>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="8"><span>停车场名称:</span>{{ detailData.garageName }}</el-col>
          <el-col :span="8"><span>停车卡类型：:</span>{{ detailData.cardType_str }}</el-col>
          <el-col :span="8"><span>停车卡名称：</span>{{ detailData.cardName }}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid img_row">
          <el-col :span="8"><span>有效期时间：</span>{{ detailData.validTime }}</el-col>
          <el-col :span="8"><span>价格：</span>{{ detailData.cardPrice }}</el-col>
          <el-col :span="8"><span>指定时间不可用：</span>~</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid img_row">
          <el-col :span="24"><span>购买说明：</span>{{ detailData.remarks }}</el-col>
        </el-row>
      </div>
      <div class="content_grid buyer-info">
        <h3>购买人信息</h3>
        <el-form :model="cardForm" ref="cardForm" :rules="rules" :inline="true" label-width="100px" label-position="left" class="card_form">
          <el-row :gutter="20" class="first_grid">
            <el-col :span="8">
              <el-form-item label="购买人姓名:" prop="peopleName">
                <el-input size="small" v-model="cardForm.peopleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话:" prop="peoplePhone">
                <el-input size="small" v-model="cardForm.peoplePhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车牌号:" prop="peopleCarNo">
                <el-input size="small" v-model="cardForm.peopleCarNo" class="uppercase "></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="8">
              <el-form-item label="身份证:" prop="identityCard">
                  <el-input size="small" v-model="cardForm.identityCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16" class="card-info">
              <el-form-item label="车辆信息:">
                  <el-input size="small" v-model="cardForm.carBrand" placeholder="品牌，例 大众"></el-input>
                  <el-input size="small" v-model="cardForm.carModel" placeholder="车型， 例 迈腾330T"></el-input>
                  <el-input size="small" v-model="cardForm.carColor" placeholder="颜色， 例 银灰色"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="first_grid">
            <el-col :span="8"><span>可用有效期:</span>{{this.detailData.validTime}}</el-col>
            <el-col :span="12"><span>备注:</span>
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="cardForm.remark"  maxlength="250" show-word-limit></el-input>
            </el-col>
          </el-row>
        </el-form>
      </div>
       <div class="footer">
        <el-button size="small" plain  @click="$router.go(-1)">取  消</el-button>
        <el-button size="small" type="primary" v-if="cardForm.cardType === 1" @click="confirm('下一步')">下一步</el-button>
        <el-button size="small" type="primary" v-if="cardForm.cardType !== 1" @click="confirm('确定')">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import serve from '@/api/parkingCardSell.api.js'
import { timeFormat } from '@/utils/util.js'
export default {
  name: 'buyCard',
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
    return {
      loading: false,
      cardForm: {
        peopleName: null, // 购买人姓名
        peoplePhone: null, // 电话
        peopleCarNo: null, // 车牌号
        identityCard: null, // 身份证
        carBrand: null, // 车辆信息
        carModel: null, // 车型
        carColor: null, // 车颜色
        remark: null,
        cardId: null,
        cardName: null,
        cardPrice: null,
        cardType: null,
        cardTypeNo: null,
        garageId: null,
        parkingId: null
      },
      rules: {
        peopleName: [{ required: true, message: '请填写购买人姓名', trigger: ['blur', 'change'] }],
        peoplePhone: [{ required: true, validator: this.validPhone, trigger: 'change' }],
        peopleCarNo: [{ required: true, validator: validatorCarNO, trigger: 'change' }],
        identityCard: [{ required: true, validator: this.isIDCard, trigger: 'change' }]
      },
      detailData: {}
    }
  },
  created() {
    this.getDetail(this.$route.query.cardId)
  },
  beforeRouteEnter(to, from, next) {
    if (to.name === 'name' && !!to.query) {
      next(vm => {
        vm.cardForm.cardType = to.query.cardType
      })
    }
    if (from.path === '/parkingCardSell/sale-list/createOrder' || from.path === '/parkingCardSell/sale-list/choiseStall') {
      const formData = JSON.parse(sessionStorage.getItem('orderInfo') || {})
      next(vm => {
        Object.assign(vm.cardForm, formData)
      })
    } else {
      next()
    }
  },
  methods: {
    validPhone(rule, value, callback) {
      const isPhone = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g.test(value)
      if (!isPhone) {
        callback(new Error('请填写有效电话号码'))
      } else {
        callback()
      }
    },
    isCarNumber (rule, value, callback) {
      var isTrue = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(value)
      if (!isTrue) {
        callback(new Error('请输入车牌号'))
      } else {
        callback()
      }
    },
    isIDCard(rule, value, callback) {
      var reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/g.test(value)
      if (!reg) {
        callback(new Error('请输入有效证件号码'))
      } else {
        callback()
      }
    },
    getDetail(id) {
      this.loading = true
      serve.saleDetail(id).then(({ data: res }) => {
        if (res.code === 200) {
          this.loading = false
          this.detailData = res.data
          this.cardForm.cardId = res.data.cardId
          this.cardForm.cardName = res.data.cardName
          this.cardForm.cardPrice = res.data.cardPrice
          this.cardForm.cardType = res.data.cardType
          this.cardForm.cardTypeNo = res.data.cardTypeNo
          this.cardForm.garageId = res.data.garageId
          this.cardForm.parkingId = res.data.parkingId
          this.detailData.cardType_str = res.data.cardType === 1 ? '包天卡' : res.data.cardType === 2 ? '次数卡' : res.data.cardType === 3 ? '时长卡' : ''
          const beginDate = res.data.beginDate ? timeFormat(res.data.beginDate, 'yyyy-mm-dd') + '  至  ' : ''
          const endDate = res.data.endDate ? timeFormat(res.data.endDate, 'yyyy-mm-dd') : ''
          if (res.data.cardType === 1 && res.data.validType === 2) {
            this.detailData.validTime = `自购买日起  ${res.data.configDay}  天`
          } else {
            if (res.data.validType === 1) this.detailData.validTime = `${beginDate} ${endDate}`
            if (res.data.validType === 2) this.detailData.validTime = `自购买起${res.data.effectiveDuration}天内有效`
            if (res.data.validType === 3) this.detailData.validTime = '不限时间'
          }
        } else {
          this.loading = false
          this.$message.info(res.msg)
        }
      })
    },
    confirm (type) {
      sessionStorage.removeItem('orderInfo')
      this.$refs.cardForm.validate(async valid => {
        if (valid) {
          this.cardForm.validTime = this.detailData.validTime
          sessionStorage.setItem('orderInfo', JSON.stringify(this.cardForm))
          if (type === '确定') {
            this.loading = true
            const { data: res } = await serve.buyCard(this.cardForm)
            if (res.code === 200) {
              this.loading = false
              this.$message.success('创建订单成功')
              const orderDetail = Object.assign(this.cardForm, res.data)
              sessionStorage.setItem('orderInfo', JSON.stringify(orderDetail))
              console.log(orderDetail, 'buycard-local**')
              this.$router.push({ path: '/parkingCardSell/sale-list/createOrder' })
            } else {
              this.$message.info(res.msg)
              this.loading = false
            }
          }
          if (type === '下一步') {
            this.$router.push({ name: 'choiseStall' })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .head {
    height: 45px;
    background: #606266;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    box-sizing: border-box;;
    h3 {
      color: #ffffff;
      font-weight: normal;
      margin: 0;
    }
  }
  .content {
    flex: 1;
    overflow-y: auto;
    flex-grow: 1;
    padding: 20px;
    box-sizing: border-box;
    &::-webkit-scrollbar {
        width: 2px;
    }
    &::-webkit-scrollbar-thumb {
      background: #409eff;
      width: 1px;
    }
    .content_grid {
      h3 {
        display: inline-block;
        border-bottom: 1px solid #333;
        font-weight: normal;
        padding: 0 12px 5px;
      }
       ::v-deep.first_grid {
         font-size: 14px;
          color: #606266;
          padding: 0 10px;
          box-sizing: border-box;
          margin-bottom: 50px;
        .card-info {
          .el-form-item {
            display: flex;
            .el-form-item__content {
              display: flex;
              .el-input {
                margin-right: 12px;
              }
            }
          }
        }
        .el-col {
          display: flex;
          align-items: flex-start;
          align-items: center;
          & > span {
            width: 130px;
          }
        }
      }
    }
    .buyer-info {
      .first_grid {
        margin-bottom: 20px;
      }
    }
    .uppercase  {
      text-transform: uppercase;
    }
    .footer {
      display: flex;
      justify-content: center;
      margin-top: 50px;
      .el-button:nth-child(2) {
        margin: 0 20px;
      }
    }
  }
}

</style>
