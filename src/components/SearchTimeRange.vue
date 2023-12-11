<template>
  <div class='search-time-range'>
    <div class="search-time-range-content">
      <div class="filter_time_range">
        <div v-for="(item, index) of timeRange.time" :key="index">
          <template v-if="item.type === 'radioGroup'">
            <el-radio-group size="small" v-model="item.value" @change="handleRadioChange($event, item1.type, item)" v-for="(item1, index1) of item.timeSelect" :key="index1">
              <el-radio :label="item1.key" v-if="item1.type ==='timeRange'">
                <span class="demonstration">{{item1.label}}</span>
                <el-date-picker
                  v-model="item.range"
                  type="daterange"
                  format="yyyy - MM - dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-radio>
              <el-radio v-else v-bind:key="item1.key" :label="item1.key">{{item1.label}}</el-radio>
            </el-radio-group>
          </template>
          <div v-if="item.type === 'input'" class="search-input">
            <label>{{item.label}}：</label>
            <el-input size="small" v-model="item.value"></el-input>
          </div>
        </div>
        <div class="search_btn">
          <el-button size="small" type="primary" icon="el-icon-search" @click="handleViewData">{{timeRange.searchText}}</el-button>
        </div>
      </div>
      <div class="operate-btn">
        <slot name="operate"></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: '',
  components: {},
  /*
  timeRange: {
    searchText: '查看',
    time: [{
      type: 'radioGroup',
      value: '',
      range: '',
      key: 'time',
      timeSelect: [
        {
          label: '时间段',
          key: 10,
          type: 'timeRange'
        },
        {
          label: '当天',
          key: 1
        },
        {
          label: '本周',
          key: 2
        },
        {
          label: '本月',
          key: 3
        },
        {
          label: '本年',
          key: 4
        }
      ]
    }, {
      type: 'input',
      label: '供应商名称',
      key: 'name',
      value: ''
    }]
  }
  */
  props: {
    timeRange: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  methods: {
    handleRadioChange(e, type, data) {
      // 如果点击时间过滤的其他选项，将timerange置空
      if (type !== 'timeRange') {
        data.range = ''
      }
    },
    handleViewData() {
      // 将数组组装成key:value形式
      const obj = {}
      this.timeRange.time.forEach((res) => {
        if (res.range) {
          obj[res.key] = res.range
        } else {
          obj[res.key] = res.value
        }
      })
      this.$emit('handleTime', { ...obj })
    }
  }
}
</script>

<style lang='scss' scoped>
// 过滤条件
.search-time-range {
  background: #fff;
  padding: 16px 0px;
  margin: 0 20px;
  font-size: 16px;
  color: #333;
  font-weight: bold;
  border-bottom: 1px dashed #E8E8E8;
  .search-time-range-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .demonstration {
    margin-right: 10px;
  }
  .filter_time_range {
    padding: 5px;
    display: flex;
    align-items: center;
    >div {
      margin-right: 20px;
    }
    .search_btn {
      margin-left: 20px;
      display: inline-block;
    }
    .el-radio-group {
      margin-right: 20px;
      .el-radio {
        display: flex;
        align-items: center;
      }
      .el-radio__label {
        font-size: 16px;
        color: #333;
        font-weight: bold;
      }
    }
    .search-input {
      display: flex;
      align-items: center;
      label {
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
.search-time-range {
  .el-radio__label {
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
}
</style>
