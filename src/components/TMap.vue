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
// import maps from 'qqmap'
import { jsonp } from 'vue-jsonp'
var markerLayer
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
      console.log(window, 'window')
      const lat = sessionStorage.getItem('lat') ? Number(JSON.parse(sessionStorage.getItem('lat')).latitude) : null
      const lng = sessionStorage.getItem('lat') ? Number(JSON.parse(sessionStorage.getItem('lat')).longitude) : null
      console.log(lat, lng, 'lat')
      var that = this
      // 定义地图中心点坐标
      var center = new window.TMap.LatLng(27.979716, 109.59023)
      // 定义map变量，调用 TMap.Map() 构造函数创建地图
      that.map = new window.TMap.Map(document.getElementById('container'), {
        center: center, // 设置地图中心点坐标
        zoom: 13, // 设置地图缩放级别
        pitch: 0, // 设置俯仰角
        rotation: 0 // 设置地图旋转角度
      })
      // 获取点击后的地址
      that.map.on('click', function(event) {
        // 获取点击后的地图坐标并设置Marker
        that.shopInfo.lng = event.latLng.lng
        that.shopInfo.lat = event.latLng.lat
        console.log(event, 'event')
        if (markerLayer) {
          markerLayer.setGeometries([])
        }
        markerLayer = new window.TMap.MultiMarker({
          map: that.map,
          styles: {
            // 点标记样式
            marker: new window.TMap.MarkerStyle({
              width: 20, // 样式宽
              height: 30, // 样式高
              anchor: { x: 10, y: 30 }, // 描点位置
              src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png' // 标记路径
            })
          }
        })
        // markerLayer.add({ position: event.latLng })
        markerLayer.add({
          id: that.shopInfo.lat,
          position: new window.TMap.LatLng(that.shopInfo.lat, that.shopInfo.lng)
        })
      })
      if (lat && lng) {
        console.log(111)
        if (markerLayer) {
          markerLayer.setGeometries([])
        }
        markerLayer = new window.TMap.MultiMarker({
          map: that.map,
          styles: {
            // 点标记样式
            marker: new window.TMap.MarkerStyle({
              width: 20, // 样式宽
              height: 30, // 样式高
              anchor: { x: 10, y: 30 }, // 描点位置
              src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png' // 标记路径
            })
          }
        })
        markerLayer.updateGeometries({
          id: lat,
          position: new window.TMap.LatLng(lat, lng)
        })
        that.map.setCenter(new window.TMap.LatLng(lat, lng))
      }
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
      console.log(item, 'item')
      const that = this
      jsonp('https://apis.map.qq.com/ws/geocoder/v1/?address=', {
        output: 'jsonp',
        address: item.address || that.addressKeyword,
        region: '中国',
        key: 'XIRBZ-TWKWD-AAX4Q-HEKFK-JGPIO-YNBTJ'
      })
        .then(function (response) {
          console.log(response, 'response')
          if (response.message === '查询无结果') {
            that.$message.warning('查询无结果')
            return false
          }
          that.shopInfo.lng = response.result.location.lng
          that.shopInfo.lat = response.result.location.lat
          that.address = item.address
          if (markerLayer) {
            markerLayer.setGeometries([])
          }
          // that.init(that.shopInfo.lat, that.shopInfo.lng)
          markerLayer = new window.TMap.MultiMarker({
            map: that.map,
            styles: {
              // 点标记样式
              marker: new window.TMap.MarkerStyle({
                width: 20, // 样式宽
                height: 30, // 样式高
                anchor: { x: 10, y: 30 }, // 描点位置
                src: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png' // 标记路径
              })
            }
          })
          that.map.setCenter(new window.TMap.LatLng(that.shopInfo.lat, that.shopInfo.lng))
          markerLayer.updateGeometries({
            id: that.shopInfo.lat,
            position: new window.TMap.LatLng(that.shopInfo.lat, that.shopInfo.lng)
          })
        })
        .catch(function (error) {
          console.log(error)
        })
      // this.getAddressKeyword1(item.address)
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
          console.log(that.restaurants, 'that.restaurants')
        })
        .catch(function (error) {
        //   console.log(error)
        })
    },
    getAddressKeyword() {
      this.handleSelect(this.addressKeyword)
      // 通过getLocation();方法获取位置信息值
      // this.getAddress.getLocation(this.addressKeyword)
    },
    /***
     * 确认
     */
    confirm: function () {
      console.log(this.shopInfo, 'this.shopInfo')
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
