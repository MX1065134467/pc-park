<template>
  <div class="columnar-graph">
    <div :id="options.id" :style="{width:options.width,height:options.height}"></div>
  </div>
</template>

<script>
const Echarts = require('echarts/lib/echarts')
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
        backgroundColor: '#f2f2f2',
        color: ['#5C9BD5', '#ED7E30'],
        title: {
          text: '',
          top: 20,
          left: '50%',
          textStyle: {
            fontSize: 20,
            color: '#333333'
          }
        },
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: [
            { name: '', textStyle: '#5C9BD5' },
            { name: '', textStyle: '#ED7E30' }
          ]
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        animation: false,
        grid: {
          top: '15%',
          left: '15%',
          bottom: '10%',
          right: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            },
            nameTextStyle: {
              color: '#333333'
            },
            axisLine: {
              lineStyle: {
                color: '#333333'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#333333'
              },
              margin: 20
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#333333'
              },
              formatter: '{value}'
            },
            splitLine: {
              lineStyle: {
                color: '#333333'
              }
            },
            axisLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '',
            type: 'pictorialBar',
            symbol: 'path://M214,1079l8-6h16l8,6-8,6H222Z',
            symbolSize: [60, 16],
            symbolOffset: [-39, -8],
            symbolPosition: 'end',
            z: 12,
            data: [
              {
                value: '',
                itemStyle: {
                  color: '#4476A1'
                }
              },
              {
                value: '',
                itemStyle: {
                  color: '#4476A1'
                }
              }
            ]
          },
          {
            name: '',
            type: 'pictorialBar',
            symbol: 'path://M214,1079l8-6h16l8,6-8,6H222Z',
            symbolSize: [60, 16],
            symbolOffset: [39, -8],
            symbolPosition: 'end',
            z: 12,
            data: [
              {
                value: '',
                itemStyle: {
                  color: '#B55E24'
                }
              },
              {
                value: '',
                itemStyle: {
                  color: '#B55E24'
                }
              }
            ]
          },
          {
            name: '',
            type: 'pictorialBar',
            symbol: 'path://M214,1079l8-6h16l8,6-8,6H222Z',
            symbolSize: [60, 16],
            symbolOffset: [-39, 8],
            z: 12,
            data: [
              {
                value: '',
                itemStyle: {
                  color: '#4476A1'
                }
              },
              {
                value: '',
                itemStyle: {
                  color: '#4476A1'
                }
              }
            ]
          },
          {
            name: '',
            type: 'pictorialBar',
            symbol: 'path://M214,1079l8-6h16l8,6-8,6H222Z',
            symbolSize: [60, 16],
            symbolOffset: [39, 8],
            z: 12,
            data: [
              {
                value: '',
                itemStyle: {
                  color: '#B55E24'
                }
              },
              {
                value: '',
                itemStyle: {
                  color: '#B55E24'
                }
              }
            ]
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                // opacity: .7
              }
            },
            barWidth: '60',
            data: [
              {
                value: '',
                itemStyle: {
                  color: '#5C9BD5'
                }
              },
              {
                value: '',
                itemStyle: {
                  color: '#5C9BD5'
                }
              }
            ]
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                // opacity: .7
              }
            },
            barWidth: '60',
            data: [
              {
                value: '',
                itemStyle: {
                  color: '#ED7E30'
                }
              },
              {
                value: '',
                itemStyle: {
                  color: '#ED7E30'
                }
              }
            ]
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
      this.option.xAxis[0].data = this.options.xAxisData
      // legend 赋值
      if (this.options.legendData) {
        this.option.legend.data[0].name = this.options.legendData[0]
        this.option.legend.data[1].name = this.options.legendData[1]
        this.option.series[0].name = this.options.legendData[0]
        this.option.series[1].name = this.options.legendData[1]
      }
      // 将获取的数据给表格赋值 数据格式 data = [{ blue: 100, orange: 80 }, {blue: 60, orange: 40 }]
      const data = this.options.data
      for (let i = 0; i < this.option.series.length; i = i + 2) {
        this.option.series[i].data[0].value = data[0].blue
        this.option.series[i].data[1].value = data[1].blue
        this.option.series[i + 1].data[0].value = data[0].orange
        this.option.series[i + 1].data[1].value = data[1].orange
      }
      this.myCharts.setOption(this.option)
    }
  }
}
</script>

<style lang="scss" scoped>
.columnar-graph {}
</style>
