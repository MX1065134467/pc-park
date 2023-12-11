<template>
  <div>
    <el-dialog
      width="30%"
      :before-close="cancel"
      :closable="false"
      :mask-closable="false"
      :visible="visible"
      :close-on-click-modal="false"
    >
      <span>
       <el-autocomplete
          v-model="addressKeyword"
          placeholder="请输入地址来直接查找相关位置"
          @input="mapInput"
          clearable
          style="margin-bottom:20px;width:100%;"
          :fetch-suggestions="querySearch"
          @select="handleSelect"
          >
          <el-button slot="append" icon="el-icon-search" @click="getAddressKeyword"></el-button>
       </el-autocomplete>
        <div id="container" style="width:100%;height:400px;"></div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import maps from 'qqmap'
import { jsonp } from 'vue-jsonp'
export default {
  components: {},
  data () {
    return {
      markersArray: [],
      restaurants: [],
      map: null,
      getAddress: null,
      getAddCode: null,
      addressKeyword: '',
      shopInfo: {
        lng: '',
        lat: '',
        addr: ''
      }
    }
  },
  props: {
    visible: Boolean
  },
  created () {},

  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    // 初始化地图
    init() {
      var that = this
      maps.init('XIRBZ-TWKWD-AAX4Q-HEKFK-JGPIO-YNBTJ', () => {
        var myLatlng = new qq.maps.LatLng(27.979716, 109.59023)
        var myOptions = {
          zoom: 13,
          center: myLatlng,
          mapTypeId: qq.maps.MapTypeId.ROADMAP
        }
        that.map = new qq.maps.Map(
          document.getElementById('container'),
          myOptions
        )
        // 获取点击后的地址
        qq.maps.event.addListener(that.map, 'click', function(event) {
          // 获取点击后的地图坐标
          that.shopInfo.lng = event.latLng.getLng()
          that.shopInfo.lat = event.latLng.getLat()
          that.getAddressCode()
          const latLng = new qq.maps.LatLng(that.shopInfo.lat, that.shopInfo.lng)
          if (that.markersArray) {
            that.markersArray.forEach(item => {
              item.setMap(null)
            })
          }
          const marker = new qq.maps.Marker({
            map: that.map,
            position: latLng
          })
          that.markersArray.push(marker)
        })

        // 调用地址显示地图位置并设置地址
        that.getAddress = new qq.maps.Geocoder({
          complete: function(result) {
            that.map.setCenter(result.detail.location)
            that.shopInfo.lng = result.detail.location.lng
            that.shopInfo.lat = result.detail.location.lat
            if (that.markersArray) {
              that.markersArray.forEach(item => {
                item.setMap(null)
              })
            }
            const latLng = new qq.maps.LatLng(result.detail.location.lat, result.detail.location.lng)
            const marker = new qq.maps.Marker({
              map: that.map,
              position: latLng
            })
            that.markersArray.push(marker)
            that.$emit('getPlace', that.shopInfo)
          }
        })
        // 通过坐标来显示地图地址
        that.getAddCode = new qq.maps.Geocoder({
          complete: function(result) {
            that.addressKeyword = result.detail.address
            that.shopInfo.addr = result.detail.address
            that.$emit('getPlace', that.shopInfo)
          }
        })
      })
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      this.getAddressKeyword1(item.address)
    },
    mapInput (e) {
      const that = this
      jsonp('https://apis.map.qq.com/ws/place/v1/suggestion', {
        output: 'jsonp',
        keyword: e,
        region: '中国',
        key: 'XIRBZ-TWKWD-AAX4Q-HEKFK-JGPIO-YNBTJ'
      })
        .then(function (response) {
          const arr = response.data
          arr.forEach(item => {
            item.value = item.title
          })
          that.restaurants = arr
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getAddressKeyword1 (e) {
      this.getAddress.getLocation(e)
    },
    // 通过地址获得位置
    getAddressKeyword() {
      // 通过getLocation();方法获取位置信息值
      this.getAddress.getLocation(this.addressKeyword)
    },
    // 通过坐标获得地址
    getAddressCode() {
      var lat = parseFloat(this.shopInfo.lat)
      var lng = parseFloat(this.shopInfo.lng)
      var latLng = new qq.maps.LatLng(lat, lng)
      // 调用获取位置方法
      this.getAddCode.getAddress(latLng)
    },
    /***
     * 确认
     */
    confirm: function () {
      this.$emit('map-confirm', this.shopInfo)
    },
    /***
     * 取消
     */
    cancel: function () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.serachinput {
  width: 300px;
  box-sizing: border-box;
  padding: 9px;
  border: 1px solid #dddee1;
  line-height: 20px;
  font-size: 16px;
  height: 38px;
  color: #333;
  position: relative;
  border-radius: 4px;
  -webkit-box-shadow: #666 0px 0px 10px;
  -moz-box-shadow: #666 0px 0px 10px;
  box-shadow: #666 0px 0px 10px;
}
::v-deep .el-dialog__header {
  border-bottom: 0 !important;
}
</style>
