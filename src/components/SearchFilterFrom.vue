<template>
  <div class='search-filter'>
    <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
      <el-form-item :label="item.label + ' : '" v-for="(item, index) of formInline.filterForm" :key="index" :prop="'filterForm.' + index + '.value'">
        <el-input size="small" v-model="item.value" :placeholder="item.placeholder" v-if="item.type === 'input'" clearable></el-input>
        <el-select size="small" :filterable="item.filterable" :disabled="item.disabled ? true : false" :clearable="!item.clearable" v-model="item.value" :placeholder="item.placeholder" @change="(value, type) => {changeSelect(value, item.label)}" @focus="getSelectData(item.key)" v-if="item.type === 'select'" @clear="clear(item.key)">
          <el-option v-for="(sitem, sindex) of item.options" :key="sindex" :label="sitem.label" :value="sitem.value"></el-option>
        </el-select>
        <el-date-picker :unlink-panels="true" size="small" v-if="item.type === 'time'" v-model="item.value" type="daterange" format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-date-picker :unlink-panels="true" size="small" v-if="item.type === 'date'" v-model="item.value" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        <el-radio-group size="small" v-model="item.value" v-if="item.type === 'radiogroup'">
          <el-radio :label="item1.label" v-for="(item1, index) of item.radioGroup" :key="index">{{item1.text}}</el-radio>
        </el-radio-group>
        <el-cascader v-if="item.type==='cascader'" v-model="item.value" :options="item.options" clearable></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="operate-btn">
      <slot name="operate"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  /*
  filterForm传值：
  1. type -  类型，input select 或者时间选择框time
  2. label: label名称
  3. placeholder： 提示文字，可传可不传。
  4. key: 搜索的时候，需要给后台传递的key值
  5. 如果是select
    （1）selectOption： select下拉框的选项值
    （2）value: select下拉框默认的值
  6. maxlength: 最大字符限制
  7. 示例：
      {
        type: 'select',
        label: '状态',
        placeholder: '状态',
        options: [{
          value: '全部',
          label: '全部'
        }, {
          value: '开发中',
          label: '开发中'
        }, {
          value: '维护中',
          label: '维护中'
        }],
        value: '全部'
        key: 'select'
      },
      {
        type: 'time',
        label: '时间',
        key: 'time'
      },
      {
        type: 'input',
        label: '供应商名称',
        key: 'cname'
      }
  */
  props: {
    filterForm: {
      type: Array
    }
  },
  data() {
    return {
      formInline: {
        filterForm: []
      }
    }
  },
  created() {},
  mounted() {
    this.formInline.filterForm = this.filterForm
  },
  methods: {
    getSelectData(params) {
      // 售卖渠道
      if (params === 'saleChannelName') {
      } else if (params === 'verifyStateName') {
        // 核销状态
      }
    },
    onSubmit() {
      // 将数组组装成key:value形式
      const obj = {}
      this.formInline.filterForm.forEach(res => {
        obj[res.key] = res.value
      })
      this.$emit('searchData', { ...obj })
      // 点击搜索后，将搜索条件清空
      // this.$refs.formInline.resetFields()
    },
    // 将搜索条件清空
    handleResetFields() {
      this.$refs.formInline.resetFields()
    },
    changeSelect(val, type) {
      if (type === '停车场管理公司') {
        this.$emit('connect', val)
      }
    },
    clear(val) {
      this.formInline.filterForm.forEach(res => {
        if (res.key === val) {
          res.value = null
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.search-filter {
  padding: 20px;
  padding-top: 5px;
  padding-bottom: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  form {
    flex: 1;
  }
  .operate-btn {
    margin-top: -5px;
  }
}
</style>
<style lang="scss">
.search-filter {
  .el-form-item {
    margin-bottom: 5px !important;
  }
}
</style>
