<template>
  <div class="dimensional-lift">
    <div class="sum-park">
      <span style="color:red">*</span> 总车位数：
      <el-input class="sumpark" :disabled="true" v-model="parkingCount" placeholder="总车位数"></el-input> 个
    </div>
    <div v-if="!showFlag" style="margin:20px;color:#cccccc;font-size:16px;">提示：修改升降库的车位数不能小于原来的车位数</div>
    <div class="area-box" v-for="(item,index) of areaArr" :key="item.index">
      <div class="area">
        <div>
          升降库：
          <el-input class="area-name" :disabled="!showFlag" v-model="item.regionName"></el-input> 库
        </div>
        <div>
          车位数：
          <el-input-number v-model="item.parkingCount" :min="1" @change="inputChange" :max="50"></el-input-number>
        </div>
      </div>
      <div class="icon-box" v-if="index === 0 && showFlag">
        <i class="el-icon-circle-plus-outline icon-class" @click="addArea"></i>
      </div>
      <div v-else-if="showFlag" class="icon-box">
        <i class="el-icon-remove-outline icon-class" @click="decreaseArea(index)"></i>
      </div>
    </div>
    <div class="btn-group">
      <el-button class="btn" size="medium" v-if="showFlag" @click="cancel"> 取 消 </el-button>
      <el-button type="primary" class="btn" size="medium" @click="save"> 保 存 </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    DimensionalLiftData: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: true,
      parkingCount: '',
      areaArr: [
        {
          regionName: '',
          parkingCount: ''
        }
      ],
      showAreaArr: []
    }
  },
  watch: {
    DimensionalLiftData: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== '{}') {
          this.showFlag = false
          this.parkingCount = newVal.parkingCount
          const areaArr = []
          newVal.DimensionalLiftData.map(item => {
            let obj = {}
            obj = {
              garageRegionId: item.garageRegionId,
              regionName: item.regionName,
              parkingCount: item.parkingCount
            }
            areaArr.push(obj)
          })
          this.areaArr = areaArr
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    if (
      this.DimensionalLiftData &&
      this.DimensionalLiftData.DimensionalLiftData
    ) {
      this.showAreaArr = this.DimensionalLiftData.DimensionalLiftData
    }
  },
  methods: {
    addArea() {
      const obj = {
        regionName: '',
        parkingCount: ''
      }
      this.areaArr.push(obj)
    },
    decreaseArea(index) {
      var indexPos = this.areaArr.findIndex((item, index1) => {
        if (index === index1) {
          return index1
        }
      })
      this.parkingCount =
        this.parkingCount - this.areaArr[indexPos].parkingCount
      this.areaArr.splice(indexPos, 1)
    },
    inputChange() {
      var count = 0
      this.areaArr.map(item => {
        count = count + item.parkingCount
      })
      this.parkingCount = count
    },
    save() {
      var flag = true
      // 各个区域的升降库名称和总车位数不能为空
      this.areaArr.map(item => {
        if (item.parkingCount === 0) {
          this.$message.warning('车位数不能为0！')
          flag = false
          return
        }
        if (item.regionName === '') {
          this.$message.warning('请填写升降库名称！')
          flag = false
        }
      })
      if (flag) {
        const saveObj = {
          parkingCount: this.parkingCount,
          areaArr: this.areaArr
        }
        this.$emit('save', saveObj, 3)
      }
    },
    cancel() {
      this.areaArr = [
        {
          regionName: '',
          parkingCount: ''
        }
      ]
      this.$router.push({
        path: '/basicFacility/park-manage'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dimensional-lift {
  padding: 0 40px;
  .sum-park {
    font-size: 14px;
    color: #606266;
    margin-bottom: 20px;
  }
  .sumpark {
    margin-left: 10px;
    width: 150px;
  }
  .area-box {
    width: 40%;
    margin-top: 5px;
    display: flex;
    justify-content: flex-start;
    .area {
      width: 90%;
      display: flex;
      padding: 20px;
      justify-content: space-between;
      background: #f2f2f2;
      .area-name {
        width: 100px;
      }
    }
    .icon-box {
      margin-top: 30px;
      margin-left: 5px;
      .icon-class {
        font-size: 20px;
      }
    }
  }
  .btn-group {
    width: 80%;
    text-align: center;
    .btn {
      margin: 30px;
    }
  }
}
</style>
