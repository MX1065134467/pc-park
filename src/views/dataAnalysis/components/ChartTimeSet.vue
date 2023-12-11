<template>
  <div class="time-panel">
    <ul class="time-type-list">
      <li
        :class="{ 'active': activeType === item.key }"
        v-for="item in timeGroup"
        :key="item.key"
        @click="changeType(item)">{{ item.name }}</li>
    </ul>
    <el-date-picker
      v-model="time"
      :type="activeType"
      :clearable="false"
      :format="activeType === 'week' ? 'yyyy 第 WW 周' : ''"
      @change="changeTime">
    </el-date-picker>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'ChartTimeSet',
  components: {},
  props: {
    types: {
      type: Array,
      required: true,
      validator: function(value) {
        if (value.length === 0) {
          return false
        }
        const timeType = ['date', 'week', 'month', 'year']
        const isTrue = value.some(item => timeType.includes(item) === false)
        return !isTrue
      }
    }
  },
  data() {
    return {
      timeType: {
        date: { name: '日', key: 'date' },
        week: { name: '周', key: 'week' },
        month: { name: '月', key: 'month' },
        year: { name: '年', key: 'year' }
      },
      timeGroup: [],
      activeType: this.types[0],
      time: new Date()
    }
  },
  computed: {},
  watch: {},
  created() {
    this.setTimeGroup()
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    setTimeGroup() {
      this.timeGroup = []
      this.types.map(item => {
        this.timeGroup.push(this.timeType[item])
      })
    },
    changeType(data) {
      this.activeType = data.key
      this.time = new Date()
      this.changeTime(this.time)
    },
    changeTime(data) {
      let startTime,
        endTime
      if (this.activeType === 'week') {
        startTime = moment(data).startOf('week').add(1, 'day').format('x')
        endTime = moment(data).endOf('week').add(1, 'day').format('x')
        this.$emit('getTimeRange', [startTime, endTime, this.activeType])
        return
      }
      startTime = moment(data).startOf(this.activeType).format('x')
      endTime = moment(data).endOf(this.activeType).format('x')
      this.$emit('getTimeRange', [startTime, endTime, this.activeType])
    }
  }
}
</script>

<style lang="scss" scoped>
.time-panel {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  .time-type-list {
    display: flex;
    flex-direction: row;
    margin-right: 10px;
    li {
      font-size: 14px;
      cursor: pointer;
      color: #000000;
      padding: 0 6px;
      &:hover {
        color: #409EFF;
      }
    }
    .active {
      color: #409EFF;
    }
  }
}
</style>
