
<template>
  <div class="echarts-graph">
    <div :id="options.id" :style="{width:options.width,height:options.height}"></div>
  </div>
</template>

<script>
import china from 'echarts/map/json/china.json'
const Echarts = require('echarts/lib/echarts')
require('echarts/map/js/china')
require('echarts/lib/chart/scatter')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  name: '',
  components: {},
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      myCharts: null,
      geoCoordMap: {},
      option: {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (typeof params.value[2] === 'undefined') {
              return params.name + ' : ' + params.value
            } else {
              return params.name + ' : ' + params.value[2]
            }
          }
        },
        geo: {
          show: true,
          map: 'china',
          left: 40,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: '#ccc',
              borderColor: '#D8D8D8'
            },
            emphasis: {
              areaColor: '#FFFF66'
            }
          }
        },
        series: [
          {
            name: '散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: function(val) {
              return 8
            },
            label: {
              normal: {
                formatter: '{b}',
                position: 'bottom',
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#61A0A8'
              }
            }
          }
        ]
      }
    }
  },
  created() {},
  mounted() {
    if (Object.keys(this.options).length !== 0) {
      this.getCharts()
    }
  },
  methods: {
    convertData(data, geoCoordMap) {
      var res = []
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name]
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          })
        }
      }
      return res
    },
    getCharts() {
      var geoCoordMap = {}
      Echarts.registerMap('china', china)
      var mapFeatures = Echarts.getMap('china').geoJson.features
      mapFeatures.forEach(function(v) {
        // 地区名称
        var name = v.properties.name
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp
      })
      this.myCharts = Echarts.init(document.getElementById(this.options.id))
      this.option.series[0].data = this.convertData(
        this.options.seriesdata,
        geoCoordMap
      )
      this.myCharts.setOption(this.option)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
