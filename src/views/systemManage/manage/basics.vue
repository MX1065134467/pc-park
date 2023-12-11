<template>
  <div class='basics'>
    <el-form class="basics-form-style">
      <el-form-item label="停车场名称：">
        <span>{{parkInfo.parkingName || '--'}}</span>
      </el-form-item>
      <el-form-item label="统一社会信用代码：">
        <span>{{parkInfo.socialCode || '--'}}</span>
      </el-form-item>
      <el-form-item label="营业执照：">
        <el-image style="width: 120px; height: 100px" :src="imgBase" :preview-src-list="[imgBase]"></el-image>
      </el-form-item>
      <el-form-item label="负责人：">
        <span>{{parkInfo.contactPerson || '--'}}</span>
      </el-form-item>
      <el-form-item label="联系电话：">
        <span>{{parkInfo.contactPhone || '--'}}</span>
      </el-form-item>
      <el-form-item label="所属公司：">
        <span>{{parkInfo.company || '--'}}</span>
      </el-form-item>
      <el-form-item label="对外联系电话：">
        <span>{{parkInfo.publicPhone || '--'}}</span>
        <el-button class="form-button-style" type="text" @click="showEditTel = true" :disabled="isDisabled">编辑</el-button>
      </el-form-item>
      <el-form-item label="详细地址：">
        <span>{{parkInfo.address || '--'}}</span>
      </el-form-item>
      <el-form-item label="经纬度：">
        <span>{{parkInfo.longitude}}</span>
        <span>{{parkInfo.longitude && parkInfo.dimension ? '，' : '--'}}</span>
        <span>{{parkInfo.dimension}}</span>
        <el-button class="form-button-style" type="text" @click="showMap = true" :disabled="isDisabled">编辑</el-button>
      </el-form-item>
    </el-form>
    <!-- <baidu-map :visible="showMap" @map-confirm="affirmLocation" @cancel="showMap = false" />
     -->
    <div v-if="showMap">
      <TMap @cancel="showMap = false" @map-confirm="affirmLocation" :visible="showMap" ></TMap>
     <!-- <TMap @cancel="showMap = false" @map-confirm="affirmLocation" @getPlace="getPlace" :visible="showMap" ></TMap> -->
    </div>
    <el-dialog title="编辑" :visible.sync="showEditTel" width="30%" :close-on-click-modal="false">
      <el-form label-width="120px">
        <el-form-item label="对外联系电话：">
          <el-input v-model="externalTel" placeholder="请输入对外联系电话" style="width: 200px;"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditTel = false">取 消</el-button>
        <el-button type="primary" @click="affirmTel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import BaiduMap from '@c/BaiduMap'
import TMap from '../../../components/TMap.vue'
import serve from '@/api/systemManage.api'
export default {
  name: 'basics',
  components: {
    // BaiduMap
    TMap
  },
  props: {},
  data() {
    return {
      longitudeLatitude: {},
      showMap: false,
      imgBaseUrl: this.IMAGEURL,
      parkInfo: {
        parkingName: '',
        socialCode: '',
        businessUrl: '',
        contactPerson: '',
        contactPhone: '',
        company: '',
        publicPhone: '',
        address: '',
        longitude: '',
        dimension: ''
      },
      imgBase: '',
      isDisabled: false,
      messageData: {
        show: false,
        title: '修改对外联系电话'
      },
      externalTel: '',
      showEditTel: false
    }
  },
  computed: {},
  watch: {},
  created() {
    this.useInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if ((this.useInfo.isAdmin === 1 && this.useInfo.userType === 1) || this.useInfo.isAdmin === 0) {
      this.isDisabled = true
    }
  },
  mounted() {
    this.getBasic()
  },
  beforeDestroy() {},
  methods: {
    async getBasic() {
      const that = this
      const res = await serve.getBasic()
      if (res.data.code === 200) {
        that.parkInfo = res.data.data
        that.externalTel = res.data.data.publicPhone
        that.imgBase = that.imgBaseUrl + res.data.data.businessUrl
      } else {
        that.$message.info('非管理员不能查看')
      }
    },
    async affirmLocation(e) {
      const that = this
      // const e = that.longitudeLatitude
      const params = {
        dimension: e.lat ? e.lat : '',
        longitude: e.lng ? e.lng : '',
        publicPhone: that.externalTel ? that.externalTel : ''
      }
      const res = await serve.editBasic(params)
      if (res.data.code === 200) {
        that.getBasic()
      }
      that.showMap = false
    },
    getPlace (e) {
      console.log(e, 'val')
      this.longitudeLatitude = e
    },
    async affirmTel() {
      const params = {
        dimension: this.parkInfo.dimension ? this.parkInfo.dimension : '',
        longitude: this.parkInfo.longitude ? this.parkInfo.longitude : '',
        publicPhone: this.externalTel ? this.externalTel : ''
      }
      const res = await serve.editBasic(params)
      if (res.data.code === 200) {
        this.showEditTel = false
        this.getBasic()
      }
      this.messageData.show = false
    }
    // openEditTel() {
    //   this.messageData.show = true
    // },
    // cancelTel() {
    //   this.messageData.show = false
    // }
  }
}
</script>

<style lang="scss" scoped>
.basics {
  padding: 20px 60px;
  .form-button-style {
    margin-left: 16px;
  }
}
</style>
<style lang="scss">
.basics {
  .basics-form-style {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .el-form-item {
      width: 33%;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
}
</style>
