<template>
  <div class="multi-layer">
    <div class="sum-park">
      <span style="color:red">*</span> 总车位数：
      <el-input class="sumpark" :disabled="true" v-model="parkingCount" placeholder="总车位数"></el-input> 个
    </div>
    <div class="one-layer" v-for="(item,index) of layerArr" :key="index">
      <div class="left-box">
        <div class="set-layer">设置楼层：
          <el-input class="area-name" :disabled="!showFlag" v-model="item.floorName"></el-input> 层</div>
        <div class="is-depart">
          <div>
            <span style="color:red">*</span> 是否分区：
            <el-radio-group class="radio" v-model="item.isRegion" :disabled="!showFlag" @change="((val) => {radioChange(val, index)})">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
          <div>楼层车位数：
            <el-input-number v-if="item.isRegion === 0" v-model="item.parkingCount" @change="((val)=> {layerCountChange(val,index)})" :min="1" :max="5000"></el-input-number>
            <el-input-number disabled v-if="item.isRegion === 1" v-model="item.parkingCount" @change="((val)=> {layerCountChange(val,index)})" :min="1"></el-input-number>
          </div>
        </div>
        <div v-if="item.isRegion === 1">
          <div class="area-box" v-for="(secondItem,secondIndex) of item.region" :key="secondItem.secondIndex">
            <div class="area">
              <div>
                区名称：
                <el-input class="area-name" :disabled="!showFlag" v-model="secondItem.regionName" ></el-input> 区
              </div>
              <div>
                车位数：
                <el-input-number v-model="secondItem.parkingCount" :min="!showFlag? showFloorData[index].region[secondIndex].parkingCount : 1" @change="((val)=> {handleChange(val,secondIndex,index)})" :max="1000"></el-input-number>
              </div>
            </div>
            <div class="icon-box" v-if="secondIndex === 0 && showFlag">
              <i class="el-icon-circle-plus-outline icon-class" @click="addArea(index,secondIndex)"></i>
            </div>
            <div v-else-if="showFlag" class="icon-box">
              <i class="el-icon-remove-outline icon-class" @click="decreaseArea(index,secondIndex)"></i>
            </div>
          </div>
        </div>

      </div>
      <div v-if="index === 0 && showFlag" class="icon-box">
        <i class="el-icon-circle-plus-outline icon-class" @click="addLayer(index)"></i>
      </div>
      <div v-else-if="showFlag" class="icon-box">
        <i class="el-icon-remove-outline icon-class" @click="decreaseLayer(index)"></i>
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
    floorData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showFlag: true,
      parkingCount: '',
      rules: {
        isRegion: [
          { required: true, message: '请选择是否分区', trigger: 'change' }
        ]
      },
      layerArr: [
        {
          floorName: '',
          isRegion: '',
          parkingCount: '',
          region: [
            {
              regionName: '',
              parkingCount: ''
            }
          ]
        }
      ],
      showFloorData: []
    }
  },
  watch: {
    floorData: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== '{}') {
          this.showFlag = false
          console.log(newVal, oldVal, 855)
          this.parkingCount = newVal.parkingCount
          const layerArr = []
          const newValArr = newVal.floorData
          newValArr.map(item => {
            let obj = {}
            obj = {
              garageFloorId: item.garageFloorId,
              floorName: item.floorName,
              isRegion: item.isRegion,
              parkingCount: item.parkingCount,
              region: item.region
            }
            const areaArr = []
            item.region.map(item => {
              let objArea = {}
              objArea = {
                garageRegionId: item.garageRegionId,
                regionName: item.regionName,
                parkingCount: item.parkingCount
              }
              areaArr.push(objArea)
            })
            layerArr.push(obj)
          })
          this.layerArr = JSON.parse(JSON.stringify(layerArr))
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    if (this.floorData && this.floorData.floorData) {
      this.showFloorData = JSON.parse(JSON.stringify(this.floorData.floorData))
      console.log(this.showFloorData)
    }
  },
  methods: {
    // 给车库总数和总车位数自动赋值
    handleChange(val, secondIndex, index) {
      var totalCount = 0
      this.layerArr.map(item => {
        var layerCount = 0
        if (item.isRegion === 1) {
          // 分区
          item.region.map((secondItem, secondIndex) => {
            layerCount = layerCount + secondItem.parkingCount
          })
        } else {
          // 不分区
          layerCount = item.parkingCount
        }
        item.parkingCount = layerCount
        totalCount = totalCount + item.parkingCount
      })
      this.parkingCount = totalCount
    },
    // 不分区 手动输入楼层车位数
    layerCountChange(val, index) {
      var count = 0
      this.layerArr.map(item => {
        count = count + Number(item.parkingCount)
      })
      this.parkingCount = count
    },
    addArea(index, secondIndex) {
      const obj = {
        regionName: '',
        parkingCount: ''
      }
      this.layerArr[index].region.push(obj)
      console.log(this.layerArr[index], 855)
      var totalCount = 1
      this.layerArr[index].region.map(item => {
        totalCount = totalCount + Number(item.parkingCount)
      })
      this.parkingCount = totalCount
      this.layerArr[index].parkingCount = totalCount
      if (this.layerArr[index].region.length >= 10) {
        this.$message.warning('分区个数不能超过10个')
      }
    },
    decreaseArea(index, secondIndex) {
      var indexPos = this.layerArr[index].region.findIndex((item, index) => {
        if (index === secondIndex) {
          return index
        }
      })
      // 总车位减
      this.parkingCount =
        this.parkingCount -
        this.layerArr[index].region[secondIndex].parkingCount
      // 楼层减
      this.layerArr[index].parkingCount =
        this.layerArr[index].parkingCount -
        this.layerArr[index].region[secondIndex].parkingCount
      this.layerArr[index].region.splice(indexPos, 1)
    },
    addLayer(index) {
      const obj = {
        floorName: '',
        isRegion: '',
        parkingCount: '',
        region: [
          {
            regionName: '',
            parkingCount: ''
          }
        ]
      }
      this.layerArr.push(obj)
      if (this.layerArr.length >= 5) {
        this.$message.warning('楼层个数不能超过5个')
      }
    },
    decreaseLayer(index) {
      var indexPos = this.layerArr.findIndex((item, index1) => {
        if (index === index1) {
          return index1
        }
      })
      this.parkingCount = this.parkingCount - this.layerArr[index].parkingCount
      this.layerArr.splice(indexPos, 1)
    },
    cancel() {
      this.layerArr = [
        {
          floorName: '',
          isRegion: '',
          parkingCount: '',
          region: [
            {
              regionName: '',
              parkingCount: ''
            }
          ]
        }
      ]
      this.$router.push({
        path: '/basicFacility/park-manage'
      })
    },
    save() {
      var flag = true
      for (const [index, item] of new Map(
        this.layerArr.map((item, i) => [i, item])
      )) {
        if (item.isRegion === '') {
          flag = false
          this.$message.warning('请选择是否分区！')
          break
        }
        if (item.floorName === '') {
          flag = false
          this.$message.warning('请填写楼层！')
          break
        }
        // 分区（自动计算）
        if (item.isRegion === 1) {
          this.layerArr[index].region.forEach(secondItem => {
            if (secondItem.parkingCount === 0) {
              this.$message.warning('请填写分区车位数！')
              flag = false
            }
            if (secondItem.regionName === '') {
              this.$message.warning('请填写分区名称！')
              flag = false
            }
          })
        } else {
          // 不分区（手动输入楼层车位数）
          if (!item.parkingCount) {
            flag = false
            this.$message.warning('请填写楼层车位数！')
          }
          // 不分区删除分区内容
          delete this.layerArr[index].region
        }
      }
      if (flag) {
        const parkInfoObj = {
          parkingCount: this.parkingCount,
          layerArr: this.layerArr
        }
        this.$emit('save', parkInfoObj, 2)
      }
    },
    radioChange(val, index) {
      console.log(this.parkingCount, 852)
      if (val === 0) {
        if (this.parkingCount === '' || this.parkingCount >= 0) {
          this.parkingCount = 1
        } else {
          // 不分区
          this.layerArr[index].region.map(item => {
            this.parkingCount =
            Number(this.parkingCount) - Number(item.parkingCount)
          })
        }
      } else {
        if (this.parkingCount === '' || this.parkingCount >= 0) {
          this.parkingCount = 1
        } else {
          this.parkingCount =
          Number(this.parkingCount) - Number(this.layerArr[index].parkingCount)
        }
      }

      this.layerArr[index].parkingCount = 1
      this.layerArr[index].region = [
        {
          regionName: '',
          parkingCount: ''
        }
      ]
      console.log(val, index)
    }
  }
}
</script>

<style lang="scss" scoped>
.multi-layer {
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
  .one-layer {
    width: 82%;
    display: flex;
    margin-bottom: 20px;
    .left-box {
      width: calc(100% - 70px);
      padding: 20px;
      background: #f2f7f7;
      .set-layer {
        margin-left: 40px;
        color: #606266;
        font-size: 14px;
        .area-name {
          width: 100px;
        }
      }
      .is-depart {
        margin-top: 40px;
        margin-left: 20px;
        width: 100%;
        display: flex;
        div {
          width: 50%;
          font-size: 14px;
          color: #606266;
          .radio {
            margin-left: 7px;
          }
          .area-name {
            width: 100px;
          }
        }
      }
      .el-row-col {
        margin: 20px;
        .area-name {
          width: 100px;
        }
      }
      .area-box {
        width: 55%;
        display: flex;
        padding-left: 20px;
        margin: 5px;
        justify-content: flex-start;
        .area {
          width: 90%;
          display: flex;
          padding: 20px;
          justify-content: space-between;
          background: #eaeaea;
          .area-name {
            width: 100px;
          }
        }
        .icon-box {
          margin-top: 25px;
          margin-left: 5px;
          .icon-class {
            font-size: 20px;
          }
        }
      }
    }
    .icon-box {
      margin-left: 10px;
      .icon-class {
        font-size: 26px;
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
