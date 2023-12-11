<template>
  <div class='park-wrap'>
    <p class='list-title'>停车场列表</p>
    <div class="list-search">
      <el-input placeholder="请输入停车场名称" v-model="parkName" clearable @clear="getParkList">
        <el-button slot="append" icon="el-icon-search" @click="getParkList">搜索</el-button>
      </el-input>
    </div>
    <ul class="list-wrap">
      <li class="list-item" v-for="item in parkList" :key="item.garage_id" @click="choosePark(item)">{{ item.garage_name }}</li>
    </ul>
  </div>
</template>

<script>
// import serve from '@/api/dataAnalysis.api.js'
export default {
  name: 'ParkList',
  components: {},
  props: {
    parkList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      parkName: '',
      // parkList: [
      //   { id: 1, name: '恒大停车场' },
      //   { id: 2, name: '万达停车场' },
      //   { id: 3, name: '绿地停车场' }
      // ],
      fullParkList: [],
      searchParkList: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // this.getParkingList()
  },
  beforeDestroy() {},
  methods: {
    getParkList() {
      this.$emit('parkNameSearch', this.parkName)
    },
    choosePark(data) {
      this.$emit('choosePark', data)
    }
    // getParkingList () {,
    //   const params = {
    //     parkName: ''
    //   }
    //   serve.getParkingList(params).then(res => {
    //     console.log(res)
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.park-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  padding: 0 10px;
  .list-title {
    height: 48px;
    line-height: 48px;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }
  .list-wrap {
    margin-top: 20px;
    .list-item {
      width: 100%;
      height: 48px;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      background: #ffffff;
      border-bottom: 1px solid #ebeef5;
      transition: background-color .25s ease;
      &:hover {
        background: #f5f7fa;
      }
    }
  }
}
</style>
