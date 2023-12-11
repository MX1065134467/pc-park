<template>
  <div class="plane-park">
    <div class="top-box">
      <div>
        <span style="color:red">*</span> 是否分区：
        <el-radio-group class="radio" v-model="isRegion">
          <el-radio :disabled="!showFlag" :label="1">是</el-radio>
          <el-radio :disabled="!showFlag" :label="0">否</el-radio>
        </el-radio-group>
      </div>
      <div class="right-boxs">
        <span style="color:red">*</span> 总车位数:
        <el-input-number class="area-name" :disabled="isRegion === 1" placeholder="最大车位数10000" v-model="parkingCount" :max="10000" :min="1"></el-input-number>
        <span style="margin-left:20px;font-size:12px;color:#cccccc">备注:各个区总车位之和(最大值10000)</span>
      </div>
    </div>
    <div v-if="isRegion === 1">
      <div v-if="!showFlag" style="margin:20px;color:#cccccc;font-size:16px;">提示：修改各区的车位数不能小于原来的车位数</div>
      <div class="area-box" v-for="(item,index) of areaArr" :key="item.index">
        <div class="area">
          <div>
            区名称：
            <el-input class="area-name" :disabled="item.disabled ? true: false" v-model="item.regionName" placeholder="最长5字符" maxlength="5"></el-input> 区
          </div>
          <div>
            车位数：
            <el-input-number v-model="item.parkingCount" :max="1000" :min="item.disabled? showAreaArr[index].parkingCount : 0" @change="((val)=> {handleChange(val,index)})"></el-input-number>
          </div>
        </div>
        <div class="icon-box" v-if="index === 0 && showFlag">
          <i class="el-icon-circle-plus-outline icon-class" @click="addArea"></i>
        </div>
        <div v-else-if="showFlag" class="icon-box">
          <i class="el-icon-remove-outline icon-class" @click="decreaseArea(index)"></i>
        </div>
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
    regionArr: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: true,
      isRegion: '',
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
  computed: {
    oldData() {
      return JSON.parse(JSON.stringify(this.regionArr))
    }
  },
  watch: {
    isRegion() {
      if (this.showFlag) {
        if (this.isRegion === 0) {
          this.areaArr = [
            {
              regionName: '',
              parkingCount: ''
            }
          ]
          this.parkingCount = 0
        }
      }
    },
    oldData: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== '{}') {
          this.showFlag = false
          this.isRegion = newVal.isRegion
          this.parkingCount = newVal.parkingCount
          const areaArr = []
          newVal.region.map(item => {
            let obj = {}
            obj = {
              disabled: true,
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
    if (this.regionArr && this.regionArr.region) {
      this.showAreaArr = this.regionArr.region
    }
  },
  mounted() {},
  methods: {
    addArea() {
      const obj = {
        regionName: '',
        parkingCount: ''
      }
      this.areaArr.push(obj)
      if (this.areaArr.length >= 10) {
        this.$message.warning('分区个数不能超过10个')
      }
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
    handleChange(val, index) {
      this.handleTotalCount()
    },
    // 处理总车位数
    handleTotalCount() {
      let totalCount = 0
      this.areaArr.map(item => {
        totalCount = totalCount + item.parkingCount
      })
      this.parkingCount = totalCount
    },
    save() {
      if (this.isRegion === '') {
        this.$message.warning('请选择是否分区！')
        return
      } else if (!this.parkingCount) {
        this.$message.warning('请填写总车位数！')
      } else {
        if (this.isRegion === 1) {
          this.areaArr.map(item => {
            delete item.disabled
          })
        }
        var obj = {
          isRegion: this.isRegion,
          parkingCount: this.parkingCount,
          areaArr: this.isRegion === 1 ? this.areaArr : []
        }
        var flag = true
        var numCount = 0
        obj.areaArr.forEach(item => {
          if (item.parkingCount === '') {
            this.$message.warning('请填写总车位数！')
            flag = false
          } else {
            if (item.parkingCount === 0) {
              this.$message.warning('车库数目不能为0！')
              flag = false
            }
            numCount = numCount + item.parkingCount
          }
          if (item.regionName === '') {
            this.$message.warning('请填写分区名称！')
            flag = false
          }
        })
        if (obj.isRegion === 1 && numCount !== Number(obj.parkingCount)) {
          this.$message.warning('分区车位总数与总车位数不一致！')
          return
        }
      }
      if (flag) {
        this.$emit('save', obj, 1)
      }
    },
    cancel() {
      this.isRegion = ''
      this.parkNum = ''
      this.parkingCount = ''
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
.plane-park {
  padding: 0 40px;
  margin-left: 5px;
  .top-box {
    width: 80%;
    display: flex;
    div {
      width: 50%;
      font-size: 14px;
      color: #606266;
      .radio {
        margin-left: 7px;
      }
      .area-name {
        width: 200px;
        margin-left: 25px;
      }
    }
    .right-boxs {
      margin-left: 50px;
    }
  }
  .area-box {
    width: 45%;
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
    margin-top: 20px;
    width: 80%;
    text-align: center;
    .btn {
      margin: 30px;
    }
  }
}
</style>
