<template>
  <div class="ticket-wrap container" v-loading="loading" element-loading-text="加载中"
    element-loading-spinner="el-icon-loading">
    <div class="head">
      <h3 class="head_title">停车记录详情</h3>
      <div class="rt_btns">
        <el-button size="small" type="primary" icon="el-icon-back" @click="$router.go(-1)">返 回</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content_grid">
        <h3>停车记录</h3>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>车牌号：</span>{{carInOut.carNo}}</el-col>
          <el-col :span="6"><span>停车场名称:</span>{{carInOut.garageName}}</el-col>
          <el-col :span="6"><span>车辆类型</span>{{carInOut.carTypeStr}}</el-col>
        </el-row>
        <el-row :gutter="20" class="first_grid">
          <el-col :span="6"><span>入场道闸：</span>{{carInOut.inGate}}</el-col>
          <el-col :span="6"><span>进场时间:</span>{{carInOut.inTime}}</el-col>
          <el-col :span="12" class="img_col"><span>进场照片：</span>
            <div class="img_list">
              <el-image style="width: 160px; height: 100px; border-radius: 4px"
                :src="carInOut.inImageUrl">
              </el-image>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import serve from '@/api/systemManage.api'
export default {
  name: 'parkingDetail',
  data () {
    return {
      loading: false,
      imgList: [],
      outImgList: [],
      allImg: [],
      carInOut: {},
      orderInfo: {},
      orderPay: {},
      allData: {},
      isList: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init () {
      const params = {
        inOutId: this.$route.query.inOutId
      }
      this.loading = true
      const { data: res } = await serve.getInRecordDetail(params)
      console.log(res)
      if (res.code === 200) {
        this.loading = false
        this.carInOut = res.data
        // this.imgList.push(this.carInOut.inImageUrl)
      } else {
        this.loading = false
      }
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
    padding: 0 20px;
    box-sizing: border-box;
    h3 {
      color: #ffffff;
      font-weight: normal;
      margin: 0;
    }
    .rt_btns {
      display: flex;
      align-items: center;
      .el-button:first-child{
        margin-right: 20px;
      }
    }
  }
  .content {
    overflow-y: auto;
    flex: 1;
    flex-grow: 1;
    padding: 20px;
    box-sizing: border-box;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #409eff;
      width: 1px;
    }
    .content_grid {
      h3 {
        color: #ffffff;
        background: #606266;
        padding: 10px;
        font-weight: normal;
      }
      .first_grid {
        padding: 0 10px;
        box-sizing: border-box;
        margin: 50px 0;
        color: #606266;
        font-size: 14px;
        .el-col {
          display: flex;
          align-items: flex-start;
          align-items: center;
          .img_list {
            .el-image:not(:last-child) {
              margin-right: 20px;
            }
          }
          span {
            font-weight: bold;
            width: 130px;
          }
        }
        .img_col {
          align-items: flex-start !important;
        }
      }
      .img_row {
        margin-bottom: 15px !important;
      }
      .pament_card {
        background: #e9ebef;
        padding: 10px 0;
      }
    }
  }
}
</style>
