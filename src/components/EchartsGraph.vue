
<template>
  <div class="echarts-graph">
    <div :id="options.id" :style="{width:options.width,height:options.height}"></div>
  </div>
</template>

<script>
const Echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
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
      option: {
        container: {
          width: '',
          height: ''
        },
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orirnt: 'vertical',
          icon: 'circle',
          left: '85%',
          top: '200px',
          bottom: '0'
        },
        series: [
          {
            name: '',
            label: {
              position: 'inner',
              formatter: function(params) {
                return params.percent + '%'
              }
            },
            type: 'pie',
            radius: '65%',
            center: ['50%', '60%'],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              borderWidth: 1,
              borderColor: '#fff'
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
    getCharts() {
      this.myCharts = Echarts.init(document.getElementById(this.options.id))
      this.option.container.width = this.options.width
      this.option.container.height = this.options.height
      this.option.title.text = this.options.title
      this.option.title.subtext = this.options.subtext
      this.option.legend.data = this.options.legendData
      this.option.series[0].data = this.options.seriesData
      this.myCharts.setOption(this.option)
    }
  }
}
</script>

<style>
</style>
