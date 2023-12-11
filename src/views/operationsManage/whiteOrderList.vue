<template>
  <div class="container">
    <div
      class="ticket-wrap"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
    >
      <search-filter
        :filter-form="filterForm"
        @searchData="handleSearch"
      >
        <div class="handle-btn" slot="operate">
          <el-button size="small" type="primary" icon="el-icon-download" @click="getCard"
            >发送卡片</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            @click="handleAddDialog"
            >导出免费卡</el-button
          >
        </div>
      </search-filter>
      <div class="table-wrap">
        <el-table
          stripe
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection"> </el-table-column>
          <template v-for="(item, index) in tableHeaderData">
            <el-table-column
              align="center"
              v-if="item.show"
              resizable
              show-overflow-tooltip
              :width="item.width"
              :key="index"
              :label="item.label"
              :prop="item.prop"
            ></el-table-column>
          </template>
          <el-table-column fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                class="stopClass"
                @click="stopOrStartUse(scope.row, '详情')"
                >详情</el-button
              >
              <el-button
                type="text"
                size="small"
                class="remove_btn"
                v-if="scope.row.status=== 2 && scope.row.isUse === false"
                @click="stopOrStartUse(scope.row, '启用')"
                >启用</el-button
              >
              <el-button
                type="text"
                size="small"
                class="remove_btn"
                v-if="scope.row.status === 1 && scope.row.isUse === false"
                @click="stopOrStartUse(scope.row, '停用')"
                >停用</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 50, 80, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 停用和使用模态框 -->
    <reminder-modal
      @handleDialog="handleModalShow"
      v-bind:message="modalMessage"
    >
      <div slot="content">
        {{ modalMessage.content }}
      </div>
    </reminder-modal>
    <!-- 查看详情的dialog -->
    <el-dialog
      title="详情"
      :visible.sync="checkDialog"
      class="check_dialog"
      :close-on-click-modal="false"
    >
      <ul class="check_content">
        <li>
          <span>停车场名称: {{this.name}}</span>
          <span>免费卡名称：{{checkData.cardName}}</span>
          <span>卡号：{{checkData.cardNo ? checkData.cardNo : '--'}}</span>
        </li>
        <li>
          <span>有效期：{{this.validityTime}}</span>
          <span>状态：{{checkData.status === 1 ? '启用' : checkData.status === 2 ? '停用' : checkData.status === 3 ? '已过期' : checkData.status === 4 ? '已绑定' : ''}}</span>
        </li>
        <li>
          <span>使用订单：{{checkData.orderId ? checkData.orderId : '--'}}</span>
          <span>订单时间：{{checkData.orderTime ? checkData.orderTime : '--'}}</span>
          <span>车牌：{{checkData.carNo ? checkData.carNo : '--'}}</span>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 发送卡片dialog -->
    <el-dialog  title="发送卡片"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      :visible.sync="cardDialog"
      class="check_dialog"
      :close-on-click-modal="false">
      <ul class="check_content">
        <li>
          <span>卡片名称: {{this.whiteList.cardName}}</span>
        </li>
        <li>
          <div style="display:flex;justify-content: space-between;align-items:center">
              <span>手机号：</span>
              <el-input style="width:260px;margin-right: 30px;" v-model="manyPhone"></el-input>
              <div class="unload">
                 {{ upload_file || "导入手机号" }}
                 <input
                   type="file"
                   accept=".xls,.xlsx"
                   class="upload_file"
                   @change="readExcel($event)"
                 />
              </div>
              <!-- <el-button type="success" @click="uploadFile">导入手机号</el-button> -->
              <el-button type="primary" @click="downfile">下载导入模板</el-button>
          </div>
        </li>
        <li>
          <span>发放数量：<el-input-number v-model="number"  @change="handleChange" :min="1" :max=9 :step="1" step-strictly></el-input-number></span>
        </li>
        <li>
          <span>发放总数：{{(manyPhone.split(',')).length}}*{{this.number}}张</span>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelCard">取消</el-button>
        <el-button size="small" type="primary" @click="sumbit">确定发放</el-button>
      </div>
    </el-dialog>
    <!-- // 导出卡的模板  -->
    <!-- <div class="export_content" style="opacity:0;">
        <div class="bgc" v-for="(item, index) in barList" :key="index" :id="'newImg' + index">
            <div class="title">
                <img src="../../assets/image/down_logo.png"/>
                <div>{{item.garageIdName}}</div>
            </div>
            <div class="context">
                <div class="left">
                    <div class="erwei">
                        <VueQrcode :value="item.url" :options="{ size: 170 }" backgroundColor="#EAF6FD"></VueQrcode>
                    </div>
                    <div class="bar_code">
                        <barcode
                            :value="item.cardNo"
                            :height="60"
                            background="#EAF6FD"
                        ></barcode>
                    </div>
                    <div class="left_title">凤凰智慧城市管理运营有限责任公司出品</div>
                </div>
                <div class="right">
                    <div class="title_one">使用说明</div>
                    <div>1、该卡不退不换，可免费停车一次</div>
                    <div>2、打开微信扫一扫，识别左侧二维码，具体按照步骤提示，即可使用</div>
                    <div>3、该卡为不记名一次性卡，请注意二维码和卡号信息安全</div>
                    <div class="time">有效期：{{item.useTime}}</div>
                </div>
            </div>
        </div>
      </div> -->
    </div>
</template>

<script>
import SearchFilter from '@c/SearchFilterFrom'
import ReminderModal from '@c/ReminderModal'
import serve from '@/api/operationManage.api'
import XLSX from 'xlsx'
// import html2canvas from 'html2canvas'
// import VueBarcode from 'vue-barcode'
// import VueQrcode from '@xkeshi/vue-qrcode'
// import JSZip from 'jszip'
// import FileSaver from 'file-saver'
import { timeFormat } from '@/utils/util.js'
// 引入xlsx
export default {
  name: 'whiteOrderList',
  components: { SearchFilter, ReminderModal },
  data() {
    return {
      // 条形码数据
      barcodeNum: '',
      qrCode: '', // 二维码
      barList: [],
      number: 0,
      upload_file: '',
      lists: [],
      whiteList: {},
      imgsData: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      manyPhone: '',
      garage: [], // 车库数据
      checkDialog: false, // 查看 dialog
      cardDialog: false, // 发送卡片dialog
      filterForm: [
        {
          type: 'input',
          label: '卡号',
          placeholder: '请输入卡号',
          key: 'carNum'
        },
        {
          type: 'select',
          label: '卡状态',
          placeholder: '状态',
          key: 'parkType',
          options: [
            {
              value: null,
              label: '全部'
            },
            {
              value: '1',
              label: '启用'
            },
            {
              value: '2',
              label: '停用'
            },
            {
              value: '3',
              label: '已过期'
            },
            {
              value: '4',
              label: '已绑定'
            }
          ],
          value: null
        },
        {
          type: 'select',
          label: '导出状态',
          placeholder: '导出状态',
          key: 'export',
          options: [
            {
              value: null,
              label: '全部'
            },
            {
              value: '1',
              label: '已导出'
            },
            {
              value: '0',
              label: '未导出'
            }
          ],
          value: null
        }
      ],
      tableHeaderData: [
        {
          label: '停车场名称',
          prop: 'garageIdName',
          show: true
        },
        {
          label: '编号',
          prop: 'no',
          show: true
        },
        {
          label: '免费卡名称',
          prop: 'cardName',
          show: true
        },
        {
          label: '卡号',
          prop: 'cardNo',
          show: true
        },
        {
          label: '有效期',
          prop: 'useTime',
          show: true
        },
        {
          label: '状态',
          prop: 'statusStr',
          show: true
        },
        {
          label: '使用状态',
          prop: 'isUseStatus',
          show: true
        },
        {
          label: '导出状态',
          prop: 'isExportStatus',
          show: true
        }
      ],
      tableData: [],
      modalMessage: {
        title: '',
        show: false,
        content: ''
      },
      status: null,
      isExport: null,
      parkingId: null,
      isTime: false,
      isDate: false,
      name: '',
      cardNo: null,
      validityTime: '',
      checkData: {}
    }
  },
  created() {
    this.whiteList = JSON.parse(sessionStorage.getItem('whiteList'))
    console.log(this.whiteList)
    this.getWhiteList()
  },
  //   watch: {
  //     barList: function() {
  //         this.$nextTick(() => {
  //             console.log(new Date(), 9999, timeFormat(new Date().getTime()))
  //             this.getExportList()
  //         })
  //     }
  //   },
  methods: {
    // 获取明细列表
    async getWhiteList() {
      console.log(timeFormat(new Date().getTime()))
      const params = {
        // cardName:  this.whiteList.cardName,
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        cardNo: this.cardNo ? this.cardNo : null,
        garageId: this.whiteList.garageId,
        isExport: this.isExport,
        onceMasterId: this.whiteList.onceMasterId,
        status: this.status,
        parkingId: this.parkingId
      }
      this.loading = true
      await serve.detailList(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false
          this.tableData = res.data.data.rows
          this.total = res.data.data.totalCount
          this.tableData.map(item => {
            item.isExportStatus = item.isExport === false ? '否' : item.isExport === true ? '是' : ''
            item.isUseStatus = item.isUse === false ? '否' : item.isUse === true ? '是' : ''
            item.statusStr = item.status === 1 ? '启用' : item.status === 2 ? '停用' : item.status === 3 ? '已过期' : item.status === 4 ? '已绑定' : ''
          })
        } else {
          this.loading = false
        }
      })
    },
    // 查看
    stopOrStartUse(row, type) {
      const params = {
        id: row.onceCardId
      }
      switch (type) {
        case '详情':
          this.name = row.garageIdName
          this.validityTime = row.useTime
          serve.inDetail(params).then(res => {
            if (res.data.code === 200) {
              this.checkData = res.data.data
            }
          })
          this.checkDialog = true
          break
        case '启用':
          this.modalMessage.title = type
          this.modalMessage.show = true
          this.modalMessage.content = '是否启用该免费卡?'
          this.modalMessage.id = row.onceCardId
          this.modalMessage.status = row.status === 1 ? 2 : 1
          break
        case '停用':
          this.modalMessage.title = type
          this.modalMessage.show = true
          this.modalMessage.content = '是否停用该免费卡?'
          this.modalMessage.id = row.onceCardId
          this.modalMessage.status = row.status === 1 ? 2 : 1
      }
    },
    // 发送卡
    getCard() {
      this.cardDialog = true
    },
    sumbit() {
      const phone = (this.manyPhone).split(',')
      // if(phone.length === 1) {
      //     this.$message.error('发放卡片失败')
      // }else {
      const params = {
        num: this.number,
        onceMasterId: this.whiteList.onceMasterId,
        sum: this.number * phone.length,
        phones: phone
      }
      this.loading = true
      serve.giveCard(params).then(res => {
        if (res.data.code === 200) {
          this.cardDialog = false
          this.number = 1
          this.manyPhone = ''
          this.upload_file = ''
          this.loading = false
          this.$message.success('发放卡片成功')
          this.getWhiteList()
        } else {
          console.log(res)
          this.$message.error(res.data.msg)
          this.number = 1
          this.manyPhone = ''
          this.upload_file = ''
          this.loading = false
        }
      })
      // }
    },

    //  getExportList() {
    //     var zip = new JSZip()
    //     let imgList = []
    //     const cache = {}
    //     let myCanvas = [...document.getElementsByClassName('bgc')]
    //     for (let i= 0; i < myCanvas.length; i++) {
    //         let p = new Promise((resolve, reject) => {
    //             console.log(new Date(), 777, timeFormat(new Date().getTime()))
    //             this.loading = true
    //             html2canvas(myCanvas[i]).then(canvas => {
    //                 var imgUri = canvas.toDataURL('image/jpeg').split(';base64,')[1]
    //                 let fileName = `白名单免费卡${i}.png`
    //                 zip.folder("images").file(fileName, imgUri, {base64: true})
    //                 resolve(imgUri)
    //                 cache[fileName] = imgUri
    //             })
    //         })
    //         imgList.push(p)
    //     }
    //     Promise.all(imgList).then(_ => {
    //         let i = timeFormat(new Date().getTime())
    //         let zipName = `白名单免费卡${i}.zip`
    //         zip.generateAsync({type:"blob"}).then(ctx => { //
    //             console.log(new Date(), 888, timeFormat(new Date().getTime()))
    //             FileSaver.saveAs(ctx, zipName) //
    //         })
    //     })
    //     this.loading = false
    //     this.getWhiteList()
    // },
    handelExport(response, type) {
      const i = timeFormat(new Date().getTime())
      const fileName = `白名单免费卡${i}.zip`
      const blob = new Blob([response.data], {
        type: type + ';charset=utf-8'
      })
      const src = window.URL.createObjectURL(blob)
      if (src) {
        const a = document.createElement('a')
        a.setAttribute('href', src)
        a.setAttribute('download', fileName)
        const evObj = document.createEvent('MouseEvents')
        evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null)
        a.dispatchEvent(evObj)
      }
    },
    handleAddDialog() {
      const arrList = []
      this.multipleSelection.map((item) => {
        arrList.push(item.onceCardId)
      })
      this.loading = true
      if (this.multipleSelection.length > 0) {
        const params = arrList
        serve.getExportList(params).then(res => {
          if (res.data.code === 200) {
            serve.exportList(params).then(res => {
              if (res.status === 200) {
                this.handelExport(res, 'application/zip')
                serve.exportStatus(params).then(res => {
                  if (res.data.code === 200) {
                    this.getWhiteList()
                  }
                })
              } else {
                this.loading = false
                this.$message.error('导出失败')
              }
            })
          } else {
            this.loading = false
            this.$message.error(res.data.msg)
          }
        })
      } else {
        this.$message.error('请先勾选导出的数据')
        this.loading = false
      }
    },
    // handleAddDialog() {
    //     let arrList = []
    //     this.multipleSelection.map((item) => {
    //       arrList.push(item.onceCardId)
    //     })
    //     if(this.multipleSelection.length > 0) {
    //         const params = {
    //         cardNo: this.cardNo,
    //         garageId: this.whiteList.garageId,
    //         isExport: this.isExport,
    //         ids:  arrList,
    //         onceMasterId: this.whiteList.onceMasterId,
    //         status: this.status,
    //         }
    //         this.loading = true
    //         serve.exportPic(params).then(res => {
    //             if(res.data.code === 200) {
    //                 console.log(new Date(), 666, timeFormat(new Date().getTime()))
    //                 this.barList = res.data.data
    //                 this.$set(this.barList, res.data.data)
    //             }
    //         })
    //     }else {
    //         this.$message.error('请先勾选导出的数据')
    //     }
    // },
    // 下载导入模板
    downfile() {
      const downloadData = [
        {
          number: '1',
          phone: '15735651234'
        },
        {
          number: '2',
          phone: '18723562341'
        }
      ]
      let str = '序号,手机号码\n'
      // 增加\t为了不让表格显示科学计数法或者其他格式
      for (let i = 0; i < downloadData.length; i++) {
        for (const key in downloadData[i]) {
          str += `${downloadData[i][key] + '\t'},`
        }
        str += '\n'
      }
      // encodeURIComponent解决中文乱码
      const uri = 'data:text/xls;charset=utf-8,\ufeff' + encodeURIComponent(str)
      // 通过创建a标签实现
      const link = document.createElement('a')
      link.href = uri
      // 对下载的文件命名
      link.download = '免费卡导入模板.xls'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    readExcel(e) {
      // 读取表格文件
      const that = this
      const files = e.target.files
      if (files.length <= 0) {
        return false
      } else if (!/.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
        return false
      } else {
        // 更新获取文件名
        that.upload_file = files[0].name
      }
      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          const wsname = workbook.SheetNames[0] // 取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) // 生成json表格内容
          that.lists = []
          // 从解析出来的数据中提取相应的数据
          ws.forEach(item => {
            that.lists.push({
              number: item['序号'],
              phone: item['手机号码']
            })
          })
          // console.log(that.lists)
          if (that.lists[0].number === undefined && that.lists[0].phone === undefined) {
            that.upload_file = ''
            that.$message.error('导入模板不正确,请重新下载导入模板再上传')
            return false
          } else {
            that.lists.map((obj) => {
              that.manyPhone = that.lists.map((obj) => {
                return obj.phone
              }).join(',')
            })
          }
        } catch (e) {
          return false
        }
      }
      fileReader.readAsBinaryString(files[0])
    },
    handleChange(val) {
      this.number = val
    },
    // 停用启用接口联调
    handleModalShow(msg) {
      const params = {
        id: msg.id,
        status: msg.status
      }
      serve.inStatus(params).then(res => {
        if (res.data.code === 200) {
          this.getWhiteList()
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 搜索
    async handleSearch(obj) {
      this.status = obj.parkType
      this.cardNo = obj.carNum
      this.isExport = obj.export
      await this.getWhiteList()
    },
    // 分页
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getWhiteList()
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.getWhiteList()
    },
    // tabel 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    cancelCard() {
      this.number = 1
      this.manyPhone = ''
      this.cardDialog = false
      this.upload_file = ''
    },
    cancel() {
      this.checkDialog = false
      this.checkData = {}
    }
  }
}
</script>

<style scoped lang="scss">
.remove_btn {
  color: #606266;
}
.stopClass {
  color: red;
}

.unload {
  border: none;
  border-radius: 4px;
  background-color: #67C23A;
  height: 40px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  min-width: 80px;
  *zoom: 1;
  color: #fff;
  margin: 10px;
}
.upload_file {
  font-size: 20px;
  opacity: 0;
  position: absolute;
  filter: alpha(opacity=0);
  width: 60px;
}
.container {
  .check_dialog {
    .check_content {
      li {
        display: flex;
        padding: 0 10px;
        box-sizing: border-box;
        margin-bottom: 40px;
        span {
          flex: 1;
        }
        .el-image {
          margin-right: 24px;
        }
      }
    }
  }
}
.bgc {
    height:428px;
    width: 678px;
    background: url('../../assets/image/download.png') no-repeat;
    .title {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 30px 0 36px 0;
        img{
            width: 30px;
            height: 28px;
            padding-right: 10px;
        }
        div {
            font-size: 26px;
            font-weight: 500;
            color: #174193;
        }
    }
    .context {
        margin: 0 30px;
        display: flex;
        justify-content: space-between;
        .left {
            display: flex;
            flex-direction: column;
            margin-top: -15px;
            .erwei {
                text-align: center;
            }
            .left_title {
                text-align: center;
                font-size: 14px;
                color: #3979be;
                padding-top: 25px;
            }
        }
        .right {
            display: flex;
            flex-direction: column;
            margin-left: 39px;
            .title_one {
                text-align: center;
                font-size: 20px;
                color: #174193;
            }
            div {
                color: #174193;
                font-size: 17px;
                line-height: 25px;
                margin: 10px 0;
            }
            .time {
                margin: 58px 0 0 70px;
                font-size: 14px;
                color: #3979be;
            }
        }
    }
}
</style>
