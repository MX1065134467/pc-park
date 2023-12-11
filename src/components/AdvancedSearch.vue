<template>
  <div class='resource-add-dialog advanced-search' :class="dialogVisible.class">
    <el-dialog :title="dialogVisible.title" :visible.sync="dialogVisible.show" :width="dialogVisible.width ? dialogVisible.width : '1100px'" :close-on-click-modal="false">
      <el-form :model="form" ref="form">
        <el-form-item
          :label="item.label + ' : '"
          v-for="(item, index) of form.resourceDialog"
          :key="index" :prop="`resourceDialog.${index}.value`"
          :class="{'textarea': item.type === 'textarea', 'related_notes': item.selectOptionType}"
          :rules="item.rules">
          <el-input v-model="item.value" :placeholder="item.placeholder" v-if="item.type==='input'"></el-input>
          <el-select v-model="item.value" v-if="item.type === 'select'" @change="handleChange(item, index)">
            <el-option v-for="(sitem, sindex) of item.options" :key="sindex" :label="sitem.label" :value="sitem.value"></el-option>
          </el-select>
          <el-select v-model="item.valueType" :multiple="item.multiple" v-if="item.type === 'select' && item.selectOptionType">
            <el-option v-for="(sitem, sindex) of item.selectOptionType" :key="sindex" :label="sitem.label" :value="sitem.value"></el-option>
          </el-select>
          <el-date-picker
            v-if="item.type === 'time'"
            v-model="item.value"
            type="daterange"
            format="yyyy - MM - dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
          <el-input
            v-model="item.value"
            type="textarea"
            :rows="5"
            v-if="item.type==='textarea'"
            :placeholder="item.placeholder">
          </el-input>
          <el-input-number v-model="item.value" :min="0" v-if="item.type === 'inputNum'"></el-input-number>
          <div class="text_message" v-if="item.type === 'text'">{{item.value}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogVisible.footerShow !== false">
        <el-button @click="dialogVisible.show = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import serve from ''
export default {
  name: '',
  components: {},
  props: {
    // 模态框是否显示
    dialogVisible: {
      type: Object
    }
  },
  data () {
    return {
      form: {
        resourceDialog: []
      }
    }
  },
  created () {
    this.form.resourceDialog = this.dialogVisible.form
  },
  mounted () {},
  methods: {
    // 确定
    handleOk() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const obj = {}
          this.form.resourceDialog.map(res => {
            obj[res.key] = res.value
            if (res.valueType) {
              obj[res.keyType] = res.valueType
            }
          })
          this.$emit('handleDialog', obj)
        } else {
          return false
        }
      })
    },
    handleChange(item, index) {
      if (item.handleChange) {
        serve.getSelectParamByType({
          ticketType: item.value
        }).then(res => {
          this.form.resourceDialog[index].selectOptionType = []
          this.form.resourceDialog[index].valueType = []
          for (const obj in res.data) {
            this.form.resourceDialog[index].selectOptionType.push({
              label: res.data[obj],
              value: res.data[obj]
            })
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped></style>
<style lang="scss">
@import "@/utils/resourceDialog.scss";
.advanced-search {
  .el-dialog .el-form-item {
    margin-bottom: 35px !important;
    .el-form-item__content{
      .el-select {
        width: 100%;
      }
    }
  }
  .textarea {
    width: 100%;
    .el-form-item__label {
      width: 15%;
    }
    .el-form-item__content {
      width: 80%;
    }
  }
  .related_notes {
    width: 100% !important;
    .el-form-item__label {
      width: 15% !important;
    }
    .el-form-item__content {
      width: 80% !important;
      .el-select {
        width: 30% !important;
        margin-right: 20px;
      }
    }
  }
}
</style>
