
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
        title: {
          text: '',
          x: 'left',
          y: 'top'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 20,
          data: []
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: []
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
      this.myCharts = Echarts.init(
        document.getElementById(this.options.id)
      )
      this.option.title.text = this.options.title
      this.option.legend.data = this.options.legendData
      this.option.series[0].data = this.options.seriesData
      this.option.series[0].name = this.options.name
      this.myCharts.setOption(this.option)
    }
  }
}
</script>

<style lang="scss" scoped>
.ticket-type {
}
</style>
