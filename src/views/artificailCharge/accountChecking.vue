<template>
  <div class="container">
    <div class="ticket-wrap" v-loading="loading" element-loading-text="加载中"
      element-loading-spinner="el-icon-loading">
      <el-row :gutter="20" class="head">
        <el-col :span="6"><span>当前停车场：{{detail.garageName}}</span></el-col>
        <el-col :span="6">{{time}}</el-col>
        <el-col :span="6" style="display: flex">
          <el-date-picker
          size="small"
          v-model="day"
          type="daterange"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-button style="margin-left: 20px" type="primary" size="small" icon="el-icon-search" @click="onSubmit">查 看</el-button>
        </el-col>
      </el-row>
      <div class="content">
        <div class="card">
          <h3 class="title">人工收费车辆</h3>
          <div class="inner">
            <img src="~@/assets/image/earl/car_icon.png" alt="">
            <div class="inner_txt">
            <b>{{ detail.peopleToll }}</b>车次
            </div>
          </div>
        </div>
        <div class="card">
          <h3 class="title">已收费用</h3>
          <div class="inner">
            <img src="~@/assets/image/earl/wallet_icon.png" alt="">
            <div class="inner_txt">
              <b>{{ detail.charged }}</b>元
            </div>
          </div>
        </div>
        <div class="card">
          <h3 class="title">剩余车位</h3>
          <div class="inner">
            <img src="~@/assets/image/earl/parking_icon.png" alt="">
            <div class="inner_txt">
              <b>{{ detail.overSpace }}</b>
              <div class="rt_info">
                <p><span>总车位：</span>{{ detail.allSpace }}</p>
                <p><span>使用：</span>{{ detail.usedSpace }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import serve from '@/api/artificailCharge.api'
import { getUserInfo } from '@/common/cache.js'
import { timeFormat } from '@/utils/util'
export default {
  name: 'accountChecking',
  data () {
    return {
      loading: false,
      time: null,
      day: [],
      detail: {},
      timer: null
    }
  },
  created() {
    this.init()
  },
  beforeMount() {
    this.timer = setInterval(() => {
      this.time = timeFormat(new Date())
    }, 1000)
  },
  beforeDestroy() {
    window.clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    async init() {
      const params = {
        userId: getUserInfo().userId,
        startTime: null || this.day[0],
        endTime: null || this.day[1]
      }
      this.loading = true
      const { data: res } = await serve.getInfo(params)
      if (res.code === 200) {
        this.loading = false
        this.detail = res.data
      } else {
        this.loading = false
        this.$message.info(res.msg)
      }
    },
    onSubmit() {
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  box-sizing: border-box;
  .head {
    .el-col {
      &:first-child {
        span {
          padding: 10px 20px;
          background: #f2f2f2;
          font-weight: bold;
        }
      }
      &:nth-child(2) {
        font-weight: bolder;
      }
    }
  }
  .content {
    display: flex;
    margin-top: 25px;
    justify-content: space-around;
    .card {
      background: #f2f2f2;
      padding: 0px 30px 20px;
      box-sizing: border-box;
      width: 30%;
      h3 {
        text-align: center;
      }
      .inner {
        display: flex;
        align-items: center;
        img {
          width: 100px;
          height: auto;
        }
        .inner_txt {
          flex: 1;
          flex-flow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          b {
            font-size: 22px;
          }
          .rt_info {
            margin-left: 50px;
            span {
              text-align-last:justify
            }
          }
        }
      }
    }
  }
}
</style>
