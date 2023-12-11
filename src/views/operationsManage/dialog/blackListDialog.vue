<template>
  <div class="black_list">
     <el-dialog :title="dialogData.title" :visible.sync="dialogData.isShow" width="55%" :close-on-click-modal="false">
       <div class="dialob_content">
         <ul class="content_top">
           <li>
             <span>停车场名称：{{ dialogData.content.garageName}}</span>
             <span>车牌号：{{ dialogData.content.carNo}}</span>
             <span>提交时间：{{ dialogData.content.createTime}}</span>
           </li>
           <li>
             <span>提交人：{{ dialogData.content.createBy}}</span>
             <span v-if="dialogData.title === '查看' || dialogData.title === '复核'">原处理意见：{{ dealCount }}</span>
           </li>
           <li>
             <span v-if="dialogData.title === '复核'">提交人电话：13545010027</span>
             <span style="flex: 1">抓拍图片：
              <!-- <el-image style="width: 160px; height: 100px; border-radius: 4px;"
                v-for="(url, index) in dialogData.content.sysFileInfoList"
                :key="index + url"
                :src="url"
                :preview-src-list="srcList">
              </el-image> -->
              <el-image style="width: 160px; height: 100px; border-radius: 4px;"
                v-for="(url, index) in dialogData.content.sysFileInfoList"
                :key="index + url"
                :src="url"
                :preview-src-list="dialogData.content.sysFileInfoList">
              </el-image>
             </span>
           </li>
           <li>
             <span style="width: 70px;">拉黑原因：</span>
             {{ dialogData.content.blackReason}}
           </li>
         </ul>
         <div class="check_down" v-if="dialogData.title === '查看'">
           <p>
             <span>复核人：{{ dialogData.content.updateBy}}</span>
             <span>复核时间：{{ dialogData.content.updateTime}}</span>
             <span>复核处理意见：{{ reviewCount }}</span>
           </p>
           <div class="check_remark">
             <!-- <span>备注：{{ dialogData.content.remarks}}</span> -->
             <span>备注：</span>
             <article v-text="dialogData.content.remarks" style="margin-left: -245px"></article>
           </div>
         </div>
         <el-form :model="form" ref="form" :inline="true" label-width="100px" label-position="left" class="bottom_form" v-if="dialogData.title === '处理' || dialogData.title === '复核'">
          <el-row v-if="dialogData.title === '复核'">
            <el-form-item label="处理">
              <el-radio-group v-model="form.resource">
                <el-radio :label="1">同意</el-radio>
                <el-radio :label="2">驳回</el-radio>
                <el-radio :label="3">改判</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row v-if="dialogData.title === '处理' || form.resource === 3">
            <el-form-item label="处理"
            prop="dispose"
            :rules="[{ required: true, validator: this.valiAvatar, trigger: 'blur' }]"
              >
              <div class="select_days">
                拉黑
                <el-select v-model="form.dispose" @change="handleDispose">
                  <el-option v-for="day in daysOption" :key="day.value" :label="day.label" :value="day.value"></el-option>
                </el-select>
                天
              </div>
              <span style="margin: 0 10px">或</span>
              <div>自定义<el-input-number style="margin-left:10px" v-model="form.dispose" :step="1"  step-strictly :min="0"></el-input-number></div>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="备注">
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model="form.remark"></el-input>
            </el-form-item>
          </el-row>
         </el-form>
       </div>
       <div slot="footer" class="dialog-footer">
        <el-button size="small"  @click="cancel">{{ dialogData.title === '查看' ? '关 闭' : '取 消'}}</el-button>
        <el-button size="small" v-if="dialogData.title !== '查看'" type="primary" @click="handleOk(dialogData.title)">确 定</el-button>
      </div>
     </el-dialog>
  </div>
</template>

<script>
import serve from '@/api/operationManage.api'
export default {
  name: '',
  props: {
    dialogData: {
      type: Object
    }
  },
  data () {
    return {
      form: {
        resource: 1,
        remark: '',
        dispose: null
      },
      dispose: null,
      daysOption: [{
        value: 1,
        label: 1
      }, {
        value: 10,
        label: 10
      }, {
        value: 20,
        label: 20
      }, {
        value: 30,
        label: 30
      }]
    }
  },
  created() {
    this.form.dispose = this.dialogData.content.dayCount
    this.form.remark = this.dialogData.content.remarks
  },
  computed: {
    reviewCount() { // 复核处理时间
      return this.dialogData.content.reviewCount ? `拉黑 ${this.dialogData.content.reviewCount} 天` : `拉黑 ${this.dialogData.content.dayCount} 天`
    },
    dealCount() { // 原处理意见
      return this.dialogData.content.dealConut ? `拉黑 ${this.dialogData.content.dealConut} 天` : `拉黑 ${this.dialogData.content.dayCount} 天`
    }
  },
  methods: {
    handleDispose() {
      this.$refs.form.clearValidate('dispose')
    },
    valiAvatar(rule, value, callback) {
      const isInt = /[1-9]+/.test(value)
      if (!isInt) {
        callback(new Error('请填写处理意见'))
      } else {
        callback()
      }
    },
    cancel() {
      this.dialogData.isShow = false
    },
    handleOk(title) {
      console.log(title)
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (title === '处理') {
            const parsms = {
              blackId: this.dialogData.blackId,
              dealCount: this.form.dispose,
              remarks: this.form.remark,
              status: 9
            }
            const { data: res } = await serve.diaposeBalckList(parsms)
            if (res.code === 200) this.$message.success(res.msg)
            this.$emit('operationConfirm')
          }
          if (title === '复核') {
            const parsms = {
              blackId: this.dialogData.blackId,
              reviewCount: this.form.dispose,
              remarks: this.form.remark,
              optation: this.form.resource
            }
            const { data: res } = await serve.reCheck(parsms)
            if (res.code === 200) this.$message.success(res.msg)
            this.$emit('operationConfirm')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.black_list {
  .dialob_content {
    .content_top {
      li {
        display: flex;
        padding: 0 10px;
        box-sizing: border-box;
        margin-bottom: 40px;
        span {
          display: flex;
          width: 33%;
        }
        .el-image {
          margin-right: 24px;
        }
      }
    }
    .check_down,.bottom_form {
      padding: 30px 10px 0;
      box-sizing: border-box;
      border-top: 1px solid #ccc;
      .el-row {
        .el-form-item {
          width: 100%;
          display: flex;
          ::v-deep.el-form-item__content {
            flex: 0.7;
            display: flex;
            align-items: center;
          }
        }
      }
    }
    .check_down {
      p , .check_remark{
        display: flex;
        margin-bottom: 40px;
        span {
          width: 33%;
        }
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    .el-button:first-child{
      margin-right: 20px;
    }
  }
}
</style>
