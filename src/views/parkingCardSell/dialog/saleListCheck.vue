<template>
  <el-dialog title="查看" :visible.sync="saleDate.isShow" width="55%" :destroy-on-close="true" class="sale-dialog" :close-on-click-modal="false">
    <el-row :gutter="20">
      <el-col :span="8"><span>停车场名称：</span>{{ detailData.garageName }}</el-col>
      <el-col :span="8"><span>停车卡类型：</span>{{ detailData.cardType_str }}</el-col>
      <el-col :span="8"><span>停车卡名称：</span>{{ detailData.cardName }}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8"><span>有效期时间：</span>{{ detailData.validTime }}</el-col>
      <el-col :span="8"><span>价格：</span>{{ detailData.cardPrice }}</el-col>
      <el-col :span="8"><span>指定时间可用：</span>-</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24"><span>购买说明：</span>
        {{ detailData.remarks }}
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="saleDate.isShow = false">关 闭</el-button>
      </div>
  </el-dialog>
</template>

<script>
import serve from '@/api/parkingCardSell.api.js'
import { timeFormat } from '@/utils/util.js'
export default {
  props: {
    saleDate: Object
  },
  data () {
    return {
      detailData: {}
    }
  },
  created() {
    this.getDetail(this.saleDate.cardId)
  },
  methods: {
    getDetail(id) {
      serve.saleDetail(id).then(({ data: res }) => {
        if (res.code === 200) {
          this.detailData = res.data
          this.detailData.cardType_str = res.data.cardType === 1 ? '包天卡' : res.data.cardType === 2 ? '次数卡' : res.data.cardType === 3 ? '时长卡' : ''
          const beginDate = res.data.beginDate ? timeFormat(res.data.beginDate, 'yyyy-mm-dd') + '至' : ''
          const endDate = res.data.endDate ? timeFormat(res.data.endDate, 'yyyy-mm-dd') : ''
          if (res.data.cardType === 1) {
            this.detailData.validTime = res.data.configDay + '天'
          } else {
            if (res.data.validType === 1) this.detailData.validTime = `${beginDate} ${endDate}`
            if (res.data.validType === 2) this.detailData.validTime = `自购买起${res.data.effectiveDuration}天`
            if (res.data.validType === 3) this.detailData.validTime = '不限时间'
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.sale-dialog {
  .el-row {
    margin: 50px 0;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>
