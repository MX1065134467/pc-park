<template>
  <div>
    <el-card>
      <div class="parkingChargeTopCard">
        <el-row>
          <el-col :span="8">
            <div class="parkingChargeTopCardBox">
              <div class="parkingChargeTopCardBoxChild">
                当前停车场：<span>{{
                  parkingLotInformation.garageName
                    ? parkingLotInformation.garageName
                    : "暂无"
                }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="parkingChargeTopCardBox">
              <div class="parkingChargeTopCardBoxChild">
                收费员：<span>{{
                  parkingLotInformation.userName
                    ? parkingLotInformation.userName
                    : "暂无"
                }}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="parkingChargeTopCardRightTime">
              <div class="parkingChargeTopCardBoxTime">{{ time }}</div>
              <div>
                <el-button
                  type="primary"
                  plain
                  size="mini"
                  class="videoButton"
                  @click="videoPlayBack"
                  >视频回放</el-button
                >
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="border"></div>
        <el-row>
          <el-col :span="16">
            <el-select
              v-model="equipment"
              placeholder="设备名称"
              size="small"
              class="equipment"
            >
              <el-option
                v-for="(item, index) in equipmentList"
                :key="index"
                :label="item.name"
                :value="item.lanecode"
              >
              </el-option>
            </el-select>
            <el-button
              class="stopButton"
              size="small"
              @click="brakeControl('锁闸', 2)"
              >锁闸</el-button
            >
            <el-button
              class="openButton"
              size="small"
              @click="brakeControl('开闸', 0)"
              >开闸</el-button
            >
            <el-button
              class="closeButton"
              size="small"
              @click="brakeControl('关闸', 1)"
              >关闸</el-button
            >
            <el-button
              class="unlockButton"
              size="small"
              @click="brakeControl('解锁', 3)"
              >解锁</el-button
            >
          </el-col>
          <el-col :span="8" class="humanSettlementButtonBox">
            <el-button
              class="humanSettlementButton"
              size="small"
              :disabled="noPower"
              @click="humanSettlement"
              >人工结算</el-button
            >
            <el-button
              class="humanSettlementButton"
              size="small"
              :disabled="noPower"
              @click="withoutLicenceCar"
              >无牌临牌</el-button
            >
          </el-col>
        </el-row>
        <div class="vehicleInformationStatistics">
          <div class="vehicleInformationStatisticsChild">
            <div class="vehicleInformationStatisticsLi">
              <img
                src="@/assets/image/chargeAeait/trafficFlow.png"
                alt=""
                class="vehicleInformationStatisticsChildImg"
              />
              <img
                src="@/assets/image/chargeAeait/nowCar1@2x.png"
                class="nowCar1"
              />
            </div>
            <div class="vehicleInformationStatisticsLi1">
              <p class="currenTrafficFlowNum">
                {{
                  parkingLotInformation.trafficFlow
                    ? parkingLotInformation.trafficFlow
                    : "0"
                }}
              </p>
              <p class="currenTrafficFlowText">当前车流量</p>
            </div>
            <div class="vehicleInformationStatisticsLi">
              <p>
                进场：{{
                  parkingLotInformation.inFlow
                    ? parkingLotInformation.inFlow
                    : "0"
                }}
              </p>
              <p>
                出场：{{
                  parkingLotInformation.outFlow
                    ? parkingLotInformation.outFlow
                    : "0"
                }}
              </p>
              <!-- <img src="@/assets/image/chargeAeait/nowCar2@2x.png" class="nowCar2"> -->
            </div>
          </div>
          <div class="vehicleInformationStatisticsChild1">
            <div class="vehicleInformationStatisticsLi">
              <img
                src="@/assets/image/chargeAeait/ice-achievement bonus-o.png"
                alt=""
                class="vehicleInformationStatisticsChildImg"
              />
              <img
                src="@/assets/image/chargeAeait/already1@2x.png"
                class="nowCar1"
              />
            </div>
            <div class="vehicleInformationStatisticsLi1">
              <p class="currenTrafficFlowNum">
                {{
                  parkingLotInformation.chargedFee
                    ? parkingLotInformation.chargedFee
                    : "0"
                }}
              </p>
              <p class="currenTrafficFlowText">已收费用（￥）</p>
            </div>
            <div class="vehicleInformationStatisticsLi">
              <p>
                人工：{{
                  parkingLotInformation.manualChargedFee
                    ? parkingLotInformation.manualChargedFee
                    : "0"
                }}
              </p>
              <p>
                系统：{{
                  parkingLotInformation.systemChargedFee
                    ? parkingLotInformation.systemChargedFee
                    : "0"
                }}
              </p>
              <!-- <img src="@/assets/image/chargeAeait/already2@2x.png" class="nowCar2"> -->
            </div>
          </div>
          <div class="vehicleInformationStatisticsChild2">
            <div class="vehicleInformationStatisticsLi">
              <img
                src="@/assets/image/chargeAeait/remainderCar.png"
                alt=""
                class="vehicleInformationStatisticsChildImg"
              />
              <img
                src="@/assets/image/chargeAeait/carStall1@2x.png"
                class="nowCar1"
              />
            </div>
            <div class="vehicleInformationStatisticsLi1">
              <p class="currenTrafficFlowNum">
                {{
                  parkingLotInformation.leaveSpaces
                    ? parkingLotInformation.leaveSpaces
                    : "0"
                }}
              </p>
              <p class="currenTrafficFlowText">剩余车位</p>
            </div>
            <div class="vehicleInformationStatisticsLi">
              <p>
                总车位：{{
                  parkingLotInformation.sumSpaces
                    ? parkingLotInformation.sumSpaces
                    : "0"
                }}
              </p>
              <p>
                使用：{{
                  parkingLotInformation.usingSpaces
                    ? parkingLotInformation.usingSpaces
                    : "0"
                }}
              </p>
              <!-- <img src="@/assets/image/chargeAeait/carStall2@2x.png" class="nowCar2"> -->
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div class="parkingChargeMainBox">
      <div class="parkingChargeMainBoxLeftContent">
        <div class="parkingChargeMainBoxLeftContentComeGoOn">
          <el-card>
            <div class="parkingChargeMainBoxLeftContentComeGoOnCard">
              <div class="parkingChargeMainBoxLeftContentCome">
                <div class="parkingChargeMainBoxLeftContentComeTitle">
                  <div class="parkingChargeMainBoxLeftContentComeTitleName">
                    入场
                  </div>
                  <div
                    v-show="isOrder"
                    class="parkingChargeMainBoxLeftContentComeTitleTime"
                  >
                    {{ orderDetail.inTime }}
                  </div>
                  <div
                    v-show="isOrder"
                    class="parkingChargeMainBoxLeftContentComeTitlePlateNumber"
                  >
                    {{ orderDetail.carNo }}
                  </div>
                </div>
                <div
                  v-show="isOrder === false"
                  class="parkingChargeMainBoxLeftContentComeContent"
                >
                  <img
                    src="@/assets/image/chargeAeait/statusImg@2x.png"
                    alt=""
                  />
                  <div class="parkingChargeMainBoxLeftContentComeContentText">
                    欢迎使用{{ title ? title : "" }}
                  </div>
                </div>
                <div
                  v-show="isOrder && inImages === null"
                  class="parkingChargeMainBoxLeftContentComeContent"
                >
                  <img
                    src="@/assets/image/chargeAeait/noCarImg@2x.png"
                    alt=""
                  />
                  <div class="parkingChargeMainBoxLeftContentComeContentText">
                    车辆未被识别
                  </div>
                </div>
                <div
                  v-show="isOrder && inImages !== null"
                  class="parkingChargeMainBoxLeftContentComeContent"
                  @click="preImgDialog('enter')"
                >
                  <img :src="inImages" alt="" class="preImg" />
                </div>
              </div>
              <div class="parkingChargeMainBoxLeftContentCome">
                <div class="parkingChargeMainBoxLeftContentComeTitle">
                  <div class="parkingChargeMainBoxLeftContentComeTitleName">
                    出场
                  </div>
                  <div
                    v-show="isOrder"
                    class="parkingChargeMainBoxLeftContentComeTitleTime"
                  >
                    {{ orderDetail.outTime }}
                  </div>
                  <div
                    v-show="isOrder"
                    class="parkingChargeMainBoxLeftContentComeTitlePlateNumber"
                  >
                    {{ orderDetail.carNo }}
                  </div>
                </div>
                <div
                  v-show="isOrder === false"
                  class="parkingChargeMainBoxLeftContentComeContent"
                >
                  <img
                    src="@/assets/image/chargeAeait/statusImg@2x.png"
                    alt=""
                  />
                  <div class="parkingChargeMainBoxLeftContentComeContentText">
                    欢迎使用{{ title ? title : "" }}
                  </div>
                </div>
                <div
                  v-show="isOrder && outImages === ''"
                  class="parkingChargeMainBoxLeftContentComeContent"
                >
                  <img
                    src="@/assets/image/chargeAeait/noCarImg@2x.png"
                    alt=""
                  />
                  <div class="parkingChargeMainBoxLeftContentComeContentText">
                    车辆未被识别
                  </div>
                </div>
                <div
                  v-show="isOrder && outImages !== ''"
                  class="parkingChargeMainBoxLeftContentComeContent"
                  @click="preImgDialog('go')"
                >
                  <img :src="outImages" alt="" class="preImg" />
                </div>
              </div>
            </div>
          </el-card>
        </div>
        <div class="parkingChargeMainBoxLeftContentOrderBox">
          <el-card class="order-card-padding">
            <el-tabs
              v-model="orderTab"
              @tab-click="handleClick"
              :tab-position="tabPosition"
              style="height: 134px;"
            >
              <el-tab-pane label="最近订单" name="0">
                <div v-swiper:mySwiper="swiperOption">
                  <div class="swiper-wrapper">
                    <div
                      class="swiper-slide"
                      :key="index"
                      v-for="(item, index) in orderList"
                    >
                      <el-card shadow="hover" class="cardPadding">
                        <div
                          class="swiperBox"
                          @dblclick="currentOrderDetail(item)"
                        >
                          <div class="swiperBoxTitle">
                            <el-row>
                              <el-col :span="10">
                                <div class="swiperLicensePlateNumber">
                                  {{ item.carNo }}
                                </div>
                              </el-col>
                              <el-col :span="14">
                                <div class="swiperFee">
                                  收费金额：￥{{ item.orderAmount }}
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="swiperEnterTime">
                            入场时间：{{ item.inTime }}
                          </div>
                          <div class="swiperEnterTime">
                            出场时间：{{ item.outTime }}
                          </div>
                          <div class="swiperBoxBottom">
                            <el-row>
                              <el-col :span="10">
                                <div class="swiperBoxBottomStyle">
                                  车型：{{ item.carTypeStr }}
                                </div>
                              </el-col>
                              <el-col :span="14">
                                <div class="swiperBoxBottomHour">
                                  停车时长：{{ item.parkTimeStr }}
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div v-show="item.isChecked" class="statusChecked">
                            <img
                              src="@/assets/image/chargeAeait/checked.png"
                              alt=""
                            />
                          </div>
                        </div>
                      </el-card>
                    </div>
                  </div>
                  <div></div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="无牌车辆" name="1">
                <div v-swiper:mySwiper1="swiperOption">
                  <div class="swiper-wrapper">
                    <div
                      class="swiper-slide"
                      :key="index"
                      v-for="(item, index) in withoutLicenceList"
                    >
                      <el-card shadow="hover" class="cardPadding">
                        <div
                          class="swiperBox"
                          @dblclick="currentWithoutLicence(item)"
                        >
                          <div class="swiperBoxTitle">
                            <el-row>
                              <el-col :span="12">
                                <div class="swiperLicensePlateNumber">
                                  {{ item.carNo ? item.carNo : "暂无" }}
                                </div>
                              </el-col>
                              <el-col :span="12">
                                <div
                                  class="swiperFee"
                                  style="text-align:right;"
                                >
                                  待出场
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div
                            class="swiperEnterTime"
                            style="margin:18px 0 18px 0;"
                          >
                            入场时间：{{ item.inTime ? item.inTime : "暂无" }}
                          </div>
                          <div class="swiperBoxBottom">
                            <el-row>
                              <el-col :span="12">
                                <div class="swiperBoxBottomStyle">
                                  车型：{{
                                    item.carTypeStr ? item.carTypeStr : "暂无"
                                  }}
                                </div>
                              </el-col>
                            </el-row>
                          </div>
                          <div v-show="item.isChecked" class="statusChecked">
                            <img
                              src="@/assets/image/chargeAeait/checked.png"
                              alt=""
                            />
                          </div>
                        </div>
                      </el-card>
                    </div>
                  </div>
                  <div></div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div
              @click="prev"
              class="swiper-button-prev-custom"
              onmouseover='LeftArrows.style.display="none";activeLeftArrows.style.display="block"'
              onmouseout='LeftArrows.style.display="block";activeLeftArrows.style.display="none"'
            >
              <img
                class="LeftArrows"
                id="LeftArrows"
                src="@/assets/image/chargeAeait/leftArrows.png"
                alt=""
                style="width:48px;height:48px;"
              />
              <img
                class="activeLeftArrows"
                id="activeLeftArrows"
                src="@/assets/image/chargeAeait/activeLeftArrows.png"
                alt=""
                style="width:48px;height:48px;"
              />
            </div>
            <div
              @click="next"
              class="swiper-button-next-custom"
              onmouseover='RightArrows.style.display="none";activeRightArrows.style.display="block"'
              onmouseout='RightArrows.style.display="block";activeRightArrows.style.display="none"'
            >
              <img
                class="RightArrows"
                id="RightArrows"
                src="@/assets/image/chargeAeait/rightArrows.png"
                alt=""
                style="width:48px;height:48px;"
              />
              <img
                class="activeRightArrows"
                id="activeRightArrows"
                src="@/assets/image/chargeAeait/activeRightArrows.png"
                alt=""
                style="width:48px;height:48px;"
              />
            </div>
          </el-card>
        </div>
      </div>
      <div class="parkingChargeMainBoxRightContent">
        <el-card class="RightContentCard">
          <div v-if="isOrder === false" class="box">
            <div class="rightContentTttle">停车收费</div>
            <div class="rightContentBorder"></div>
            <div v-if="isOrder === false" class="rightContentOrder">
              <img src="@/assets/image/chargeAeait/noCarGo@2x.png" alt="" />
              <div class="rightContentText">暂无出场车辆</div>
            </div>
          </div>
          <div v-if="isOrder" class="box">
            <div class="rightContentTttle">停车收费</div>
            <div class="rightContentBorder"></div>
            <div class="rightContentHaveOrder">
              <div class="rightContentOrderDetail">
                当前车辆：<span>{{ orderDetail.carNo }}</span>
              </div>
            </div>
            <div class="rightContentHaveOrder carStyle">
              <div class="rightContentOrderDetail">
                车辆类型：
                <span>{{ orderDetail.chargeParam.carTypeStr }}</span>
                <el-popover
                  v-if="isPay === false"
                  @hide="popoverHide"
                  placement="bottom"
                  width="180"
                  trigger="click"
                >
                  <div
                    class="carStyleCard"
                    v-for="(item, index) in carStyleList"
                    :key="index"
                    @dblclick="currentCarStyleClick(item)"
                  >
                    <el-card shadow="hover" class="elCard">
                      <div class="carStyleCardTitle">{{ item.ruleName }}</div>
                      <div class="carStyleCardStyle">
                        适用车型：<span>{{ item.carTypeStr }}</span>
                      </div>
                      <div class="carStyleCardMoney">
                        计费方式：<span>{{ item.ruleWay }}</span>
                      </div>
                      <div class="imgPosition">
                        <img
                          src="@/assets/image/chargeAeait/noChecked.png"
                          alt=""
                        />
                      </div>
                      <div v-show="item.isShow" class="imgPosition">
                        <img
                          src="@/assets/image/chargeAeait/checked.png"
                          alt=""
                        />
                      </div>
                    </el-card>
                  </div>
                  <el-button slot="reference" class="slotButton"> </el-button>
                </el-popover>
              </div>
            </div>
            <div class="rightContentHaveOrder">
              <div class="rightContentOrderDetail">
                用户类型：<span>{{ orderDetail.chargeParam.parkTypeStr }}</span>
              </div>
            </div>
            <div class="rightContentHaveOrder">
              <div class="rightContentOrderDetail">
                停车时长：<span>{{ orderDetail.chargeParam.parkTimeStr }}</span>
              </div>
            </div>
            <div class="rightContentHaveOrder">
              <div class="rightContentOrderDetail">
                {{ isPay === false ? "应收费用" : "实收费用" }}：<span
                  class="money"
                  >￥ {{ orderDetail.billingAmount }}</span
                >
              </div>
            </div>
            <div class="rightContentHaveOrder">
              <div class="rightContentOrderDetail">
                支付状态：<span class="waitPay" v-if="isPay === false"
                  >待支付</span
                ><span class="yetPay" v-if="isPay">已支付</span>
              </div>
            </div>
          </div>
        </el-card>
        <div v-if="isOrder">
          <div v-if="isPay === false" class="RMBPayBox">
            <el-button type="danger" class="RMBPay" @click="RMBPay"
              >现金收费</el-button
            >
          </div>
          <div v-if="isPay" class="RMBPayBox">
            <el-button type="danger" class="RMBPayed"
              >已完结({{ countDown }}s)</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="humanSettlementVisible.show">
      <human-settlement
        v-bind:dialogVisible="humanSettlementVisible"
        @humanSettlementDialog="humanSettlementDialogShow"
        :dialogFromData="humanSettlementFromData"
      ></human-settlement>
    </div>
    <div v-if="withoutLicenceCarVisible.show">
      <without-licence-car
        v-bind:dialogVisible="withoutLicenceCarVisible"
        @withoutLicenceCarDialog="withoutLicenceCarDialogShow"
        :dialogFromData="withoutLicenceCarFromData"
      ></without-licence-car>
    </div>
    <div v-if="makeUpAdmissionRecordVisible.show">
      <make-up-admission-record
        v-bind:dialogVisible="makeUpAdmissionRecordVisible"
        @makeUpAdmissionRecordDialog="makeUpAdmissionRecordDialogShow"
        :dialogFromData="makeUpAdmissionRecordFromData"
      ></make-up-admission-record>
    </div>
    <div v-if="confirmDepartureVisible.show">
      <confirm-departure
        v-bind:dialogVisible="confirmDepartureVisible"
        @confirmDepartureDialog="confirmDepartureDialogShow"
        :dialogFromData="confirmDepartureFromData"
      ></confirm-departure>
    </div>
    <div v-if="previewPictureVisible.show">
      <preview-picture
        v-bind:dialogVisible="previewPictureVisible"
        @previewPictureDialog="previewPictureDialogShow"
        :dialogFromData="previewPictureFromData"
      ></preview-picture>
    </div>
    <div v-if="RmbPayVisible.show">
      <rmb-pay
        v-bind:dialogVisible="RmbPayVisible"
        @RmbPayDialog="RmbPayDialogShow"
        :dialogFromData="RmbPayFromData"
      ></rmb-pay>
    </div>
    <div v-if="paySuccessVisible.show">
      <pay-success
        v-bind:dialogVisible="paySuccessVisible"
        @paySuccessDialog="paySuccessShow"
        :dialogFromData="paySuccessFromData"
      ></pay-success>
    </div>
    <div v-if="videoPlayBackVisible.show">
      <video-playBack
        v-bind:dialogVisible="videoPlayBackVisible"
        @videoPlayBackDialog="videoPlayBackShow"
        :dialogFromData="videoPlayBackFromData"
      ></video-playBack>
    </div>
    <el-input
      ref="inputFocus"
      style="position:absolute;left:-99999px;"
      :autofocus="true"
      v-model.lazy="QRCodeNumber"
      type="text"
      @change="preparePay"
      v-clickoutside="hiddenSomething"
    />
  </div>
</template>

<script>
import serve from "@/api/parkingCharge.api";
import { timeFormat } from "@/utils/util";
import humanSettlement from "./dialog/humanSettlementDialog.vue";
import withoutLicenceCar from "./dialog/withoutLicenceCar.vue";
import makeUpAdmissionRecord from "./dialog/makeUpAdmissionRecord.vue";
import confirmDeparture from "./dialog/confirmDeparture.vue";
import previewPicture from "./dialog/previewPicture.vue";
import RmbPay from "./dialog/RMBPay.vue";
import paySuccess from "./dialog/paySuccess.vue";
import videoPlayBack from "./dialog/videoPlayBack.vue";
// import { getCarHireMsg } from '@/socket/index'
import Bus from "@/socket/bus";
import { newWebsocket } from "@/socket/index";
import clickoutside from "../../utils/clickoutside.js";
import moment from "moment";

export default {
  name: "",
  components: {
    humanSettlement,
    withoutLicenceCar,
    makeUpAdmissionRecord,
    confirmDeparture,
    previewPicture,
    RmbPay,
    paySuccess,
    videoPlayBack
  },
  directives: {
    clickoutside
  },
  data() {
    return {
      setTime: null,
      picFilePath: "",
      picPlateFilePath: "",
      title: sessionStorage.getItem("title"),
      orderIds: null,
      noPower: false,
      focusShow: false,
      isPay: false, // 已支付状态
      isOrder: false, // 进出场图片
      inImages: "",
      outImages: "",
      tabPosition: "left",
      orderDetail: {
        chargeParam: {
          carTypeStr: "",
          parkTypeStr: "",
          parkTimeStr: ""
        },
        billingAmount: "",
        carNo: "",
        orderNo: "",
        createTime: "",
        garageId: "",
        orderId: "",
        parkingId: "",
        carType: "",
        outGate: "",
        inTime: "",
        outTime: ""
      },
      currentCarStyleKey: null,
      time: null,
      isChecked: false,
      equipment: null,
      equipmentList: [],
      orderTab: "0",
      orderList: [],
      withoutLicenceList: [],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination"
        },
        slidesPerView: 3,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      currentTab: "0",
      humanSettlementVisible: {
        // 人工结算
        show: false,
        title: "人工结算",
        obj: ""
      },
      humanSettlementFromData: {}, // 人工结算数据
      withoutLicenceCarVisible: {
        // 无牌车登记
        show: false,
        title: "无牌车登记",
        obj: ""
      },
      withoutLicenceCarFromData: {}, // 人无牌车登记数据
      makeUpAdmissionRecordVisible: {
        // 入场纪录补登
        show: false,
        title: "入场记录补登",
        obj: ""
      },
      makeUpAdmissionRecordFromData: {}, // 入场纪录补登数据
      confirmDepartureVisible: {
        // 人工结算-未搜索到入场纪录
        show: false,
        title: "人工结算",
        obj: ""
      },
      confirmDepartureFromData: {}, // 人工结算-未搜索到入场纪录数据
      previewPictureVisible: {
        // 图片预览
        show: false,
        title: "",
        obj: ""
      },
      previewPictureFromData: {}, // 图片预览数据
      RmbPayVisible: {
        // 现金支付
        show: false,
        title: "支付",
        obj: ""
      },
      RmbPayFromData: {}, // 现金支付数据
      paySuccessVisible: {
        // 扫码支付成功
        show: false,
        title: "支付",
        obj: ""
      },
      paySuccessFromData: {}, // 扫码支付成功数据
      videoPlayBackVisible: {
        // 视频回放
        show: false,
        title: "视频回放",
        obj: ""
      },
      videoPlayBackFromData: {}, // 视频回放数据
      carStyleList: [],
      countDown: null, // 已完结倒计时
      QRCodeNumber: "",
      timer: null,
      timers: null,
      parkingLotInformation: {
        garageName: "",
        userName: "",
        trafficFlow: "",
        inFlow: "",
        outFlow: "",
        chargedFee: "",
        manualChargedFee: "",
        systemChargedFee: "",
        leaveSpaces: "",
        sumSpaces: "",
        usingSpaces: ""
      } // 获取待收费信息
    };
  },
  beforeMount() {
    this.timer = setInterval(() => {
      this.time = timeFormat(new Date());
    }, 1000);
  },
  async created() {
    sessionStorage.setItem("socet", "待收费");
    await this.getPendingChargeInfo(); // 获取待收费信息
    this.pendingChargeList(); // 车道闸口
    this.carInOutList(); // 待出场无牌车辆记录列表
    this.PaidList(); // 最近订单列表
    this.carStyleCutList(); // 车型切换列表
    // getCarHireMsg(this.getSock)
    newWebsocket();
    Bus.$on("message", res => {
      this.getSock(res);
    });
  },
  mounted() {
    this.foucs();
  },
  methods: {
    hiddenSomething() {
      if (this.humanSettlementVisible.show) {
        this.bulr();
      } else if (this.confirmDepartureVisible.show) {
        this.bulr();
      } else if (this.makeUpAdmissionRecordVisible.show) {
        this.bulr();
      } else if (this.withoutLicenceCarVisible.show) {
        this.bulr();
      } else if (this.videoPlayBackVisible.show) {
        this.bulr();
      } else if (this.RmbPayVisible.show) {
        this.bulr();
      } else {
        this.foucs();
      }
    },
    handleClick(e) {
      console.log(e.name);
      this.currentTab = e.name;
      if (e.name === "0") {
      } else if (e.name === "1") {
        this.carInOutList();
      }
    },
    preparePay(val) {
      if (val !== undefined) {
        this.QRCodeNumber = val;
        this.handleScanCode();
      }
    },
    handleScanCode() {
      const payMode = this.QRCodeNumber && this.QRCodeNumber.slice(0, 1) * 1;
      const params = {
        authCode: this.QRCodeNumber,
        garageId: this.orderDetail.garageId,
        orderId: this.orderDetail.orderId,
        parkingId: this.orderDetail.parkingId,
        payAmount: this.orderDetail.billingAmount,
        // payAmount: 0.01,
        purchaseWay: payMode, // 1-微信,2-支付宝,3-运营卡,4-现金
        userId: JSON.parse(sessionStorage.getItem("userInfo")).userId
      };
      serve.codePay(params).then(res => {
        if (res.data.code === 200) {
          this.paySuccessFromData = {
            orderId: this.orderDetail.orderId
          };
          this.paySuccessVisible.show = true;
        } else {
          this.$message.error("支付失败,请重新出场生成新订单！");
        }
        this.QRCodeNumber = "";
      });
    },
    prev() {
      if (this.currentTab === "0") {
        this.mySwiper.slidePrev();
      } else if (this.currentTab === "1") {
        this.mySwiper1.slidePrev();
      }
    },
    next() {
      if (this.currentTab === "0") {
        this.mySwiper.slideNext();
      } else if (this.currentTab === "1") {
        this.mySwiper1.slideNext();
      }
    },
    currentWithoutLicence(e) {
      this.withoutLicenceList.map(item => {
        item.isChecked = false;
        if (e.inOutId === item.inOutId) {
          item.isChecked = true;
        }
      });
      this.withoutLicenceCarVisible.show = true;
      e.picFilePath = this.picFilePath;
      e.picPlateFilePath = this.picPlateFilePath;
      this.withoutLicenceCarFromData = e;
    },
    // 关闭人工结算dialog
    humanSettlementDialogShow(type, data) {
      console.log(type, data, "type, data");
      if (type === "noEnterLog") {
        this.confirmDepartureVisible.show = true;
        this.confirmDepartureFromData = {
          garageId: this.parkingLotInformation.garageId,
          parkingId: this.parkingLotInformation.parkingId
        };
      } else if (type === "makeSure") {
        console.log(data, "有订单状态下展示");
        clearInterval(this.timers);
        this.focusShow = true;
        // this.orderDetail = data
        this.orderDetail.chargeParam.carTypeStr = data.carTypeStr;
        this.orderDetail.chargeParam.parkTypeStr = data.parkTypeStr;
        this.orderDetail.billingAmount = data.orderAmount;
        this.orderDetail.carNo = data.carNo;
        this.orderDetail.chargeParam.parkTimeStr = data.parkTimeStr;
        this.orderDetail.orderNo = data.orderNo;
        this.orderDetail.createTime = data.orderTime;
        this.orderDetail.garageId = data.garageId;
        this.orderDetail.orderId = data.orderId;
        this.orderDetail.parkingId = data.parkingId;
        this.orderDetail.carType = data.carType;
        this.orderDetail.outGate = data.outGate;
        this.isPay = false;
        this.isOrder = true;
      }
      const params = {
        orderId: data.orderId
      };
      serve.getInOutFileList(params).then(res => {
        if (res.data.code === 200) {
          if (
            res.data.data.inPicFilePath === "nullnull" ||
            res.data.data.inPicFilePath === "nullnull"
          ) {
            this.inImages = "";
          } else {
            this.inImages = res.data.data.inPicFilePath;
          }
          if (res.data.data.outPicFilePath === "nullnull") {
            this.outImages = "";
          } else {
            this.outImages = res.data.data.outPicFilePath;
          }
        }
      });
    },
    // 最近订单详情
    currentOrderDetail(item) {
      console.log(item, "item");
      this.orderList.map(e => {
        e.isChecked = false;
        if (item.inOutId === e.inOutId) {
          e.isChecked = true;
        }
      });
      clearInterval(this.timers);
      this.orderDetail.carNo = item.carNo;
      this.orderDetail.chargeParam.carTypeStr = item.carTypeStr;
      this.orderDetail.chargeParam.parkTypeStr = item.parkTypeStr;
      this.orderDetail.chargeParam.parkTimeStr = item.parkTimeStr;
      this.orderDetail.billingAmount = item.orderAmount;
      this.orderDetail.inTime = item.inTime;
      this.orderDetail.outTime = item.outTime;
      if (
        item.inPicFilePath !== "nullnull" ||
        item.inPicFilePath !== "nullnull"
      ) {
        this.inImages = item.inPicFilePath;
      } else {
        this.inImages = "";
      }
      if (item.outPicFilePath !== "nullnull") {
        this.outImages = item.outPicFilePath;
      } else {
        this.outImages = "";
      }
      this.isOrder = true;
      this.isPay = true;
      this.count();
    },
    humanSettlement() {
      this.humanSettlementVisible.show = true;
      this.humanSettlementFromData = {
        garageId: this.parkingLotInformation.garageId,
        parkingId: this.parkingLotInformation.parkingId
      };
    },
    // 关闭无牌临牌dialog
    withoutLicenceCarDialogShow(data, id) {
      console.log(data, id, "isd");
      // data === close,正常关闭
      // data === noEnterLog,跳转入场补登
      if (data === "noEnterLog") {
        this.makeUpAdmissionRecordVisible.show = true;
        this.makeUpAdmissionRecordFromData = {
          garageId: this.parkingLotInformation.garageId,
          parkingId: this.parkingLotInformation.parkingId
        };
      } else if (data === "close") {
        this.orderDetail.carType = id;
        this.picFilePath = null;
        this.picPlateFilePath = null;
        this.carInOutList(); // 刷新待出场无牌车辆记录列表
        this.PaidList(); // 刷新最近订单列表
        this.getPendingChargeInfo(); // 刷新待收费信息
        this.foucs();
      } else if (data === "open") {
        this.picFilePath = null;
        this.picPlateFilePath = null;
        this.carInOutList(); // 刷新待出场无牌车辆记录列表
        this.PaidList(); // 刷新最近订单列表
        this.getPendingChargeInfo(); // 刷新待收费信息
        this.foucs();
        this.orderDetailList(id); // 展示订单详情，15s关闭
      }
    },
    withoutLicenceCar() {
      this.withoutLicenceCarVisible.show = true;
      this.withoutLicenceCarFromData = {
        garageId: this.parkingLotInformation.garageId,
        parkingId: this.parkingLotInformation.parkingId,
        picFilePath: this.picFilePath,
        picPlateFilePath: this.picPlateFilePath
      };
    },
    // 关闭入场记录补登dialog
    makeUpAdmissionRecordDialogShow() {
      this.getPendingChargeInfo(); // 刷新待收费信息
      this.carInOutList(); // 待出场无牌车辆记录列表
      this.foucs();
    },
    // 关闭人工结算-未搜索到入场纪录dialog
    confirmDepartureDialogShow(data) {
      if (data === "noEnter") {
        this.makeUpAdmissionRecordVisible.show = true;
        this.makeUpAdmissionRecordFromData = {
          garageId: this.parkingLotInformation.garageId,
          parkingId: this.parkingLotInformation.parkingId
        };
      } else if (data === "close") {
        this.foucs();
      }
    },
    currentCarStyleClick(e) {
      console.log(e, "点击了");
      this.carStyleList.map(item => {
        item.isShow = false;
        if (e.carType === item.carType) {
          item.isShow = true;
        }
      });
      this.currentCarStyleKey = e.id; // 点击车型后给临时变量赋值
      console.log(e.carType, this.orderDetail.carType, "type");
      if (e.carType === this.orderDetail.carType) {
        this.$message.warning("所选车型与原订单车型相同，请重新选择");
        return false;
      } else {
        this.isOrder = false;
        this.$message.success("正在生成新的订单，请稍后...");
        this.carStyleCut(e);
      }
    },
    // 车型切换
    carStyleCut(e) {
      const params = {
        carType: e.carType,
        laneCode: this.orderDetail.outGate,
        orderId: this.orderDetail.orderId
      };
      serve.calculate(params).then(res => {
        if (res.data.code === 200) {
          this.$message.success("新订单生成成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 车型切换列表
    carStyleCutList() {
      const params = {
        garageId: this.parkingLotInformation.garageId
      };
      serve.carStyleCut(params).then(res => {
        if (res.data.code === 200) {
          this.carStyleList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 车型弹出框关闭事件，关闭后发送请求，重新生成订单
    popoverHide() {
      console.log("关闭了");
      // 需要判断修改的车型和未修改之前是否一样
    },
    // 关闭图片预览
    previewPictureDialogShow() {},
    // 图片预览
    preImgDialog(e) {
      if (e === "enter") {
        this.previewPictureVisible.title = "入场抓拍图";
        this.previewPictureFromData = {
          currentImg: this.inImages
        };
      } else if (e === "go") {
        this.previewPictureVisible.title = "出场抓拍图";
        this.previewPictureFromData = {
          currentImg: this.outImages
        };
      }
      this.previewPictureVisible.show = true;
    },
    // 视频回放
    videoPlayBack() {
      // this.$message.success('开发中，敬请期待！')
      if (this.equipment === null) {
        this.$message.warning("请先选择要回放的设备！");
        return false;
      } else {
        const r = this.equipmentList.find(t => {
          return this.equipment === t.lanecode;
        });
        console.log(r, "r");
        this.videoPlayBackFromData = {
          name: r.name,
          id: r.vmsIpcId
        };
        this.videoPlayBackVisible.show = true;
      }
    },
    // 控制闸
    brakeControl(e, type) {
      if (this.equipment === null) {
        this.$message.warning("请先选择要" + e + "的设备！");
        return false;
      } else {
        const params = {
          laneCode: this.equipment,
          operType: type,
          userId: JSON.parse(sessionStorage.getItem("userInfo")).userId
        };
        serve.operate(params).then(res => {
          if (res.data.code === 200) {
            this.$message.success(e + "成功");
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    // 现金支付关闭dialog
    async RmbPayDialogShow(orderId) {
      await this.orderDetailList(orderId); // 展示订单详情，15s关闭
      await this.getPendingChargeInfo(); // 刷新待收费信息
      this.carInOutList(); // 刷新待出场无牌车辆记录列表
      this.PaidList(); // 刷新最近订单列表
    },
    orderDetailList(params) {
      return new Promise((resolve, reject) => {
        serve.orderDetail({ orderId: params }).then(res => {
          if (res.data.code === 200) {
            const response = res.data.data;
            this.orderDetail.carNo = response.carNo;
            this.orderDetail.chargeParam.carTypeStr = response.carTypeStr;
            this.orderDetail.chargeParam.parkTypeStr = response.parkTypeStr;
            this.orderDetail.chargeParam.parkTimeStr = response.parkTimeStr;
            this.orderDetail.billingAmount = response.orderAmount;
            this.orderDetail.createTime = response.orderTime;
            if (
              response.inPicFilePath !== "nullnull" ||
              response.inPicFilePath !== "nullnull"
            ) {
              this.inImages = response.inPicFilePath;
            } else {
              this.inImages = "";
            }
            if (response.outPicFilePath !== "nullnull") {
              this.outImages = response.outPicFilePath;
            } else {
              this.outImages = "";
            }
            this.isOrder = true;
            this.isPay = true;
            clearInterval(this.timers);
            this.count();
            resolve();
          } else {
            this.$message.error(res.data.msg);
            reject(res.data.msg);
          }
        });
      });
    },
    // 现金支付
    RMBPay() {
      this.RmbPayVisible.show = true;
      this.RmbPayFromData = this.orderDetail;
    },
    foucs() {
      this.$refs.inputFocus.focus();
    },
    bulr() {
      this.$refs.inputFocus.blur();
    },
    count() {
      const count = 15;
      this.countDown = count;
      this.timers = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown--;
        } else {
          clearInterval(this.timers);
          this.isOrder = false;
        }
      }, 1000);
    },
    // 扫码支付关闭
    paySuccessShow(data) {
      console.log(data, "orderid");
      this.orderDetailList(data); // 展示订单详情，15s关闭
    },
    openSuccess() {
      this.paySuccessVisible.show = true;
    },
    // 关闭回放
    videoPlayBackShow() {
      this.foucs();
    },
    // 获取待收费信息
    getPendingChargeInfo() {
      const params = {
        userId: JSON.parse(sessionStorage.getItem("userInfo")).userId
      };
      return new Promise((resolve, reject) => {
        serve.getPendingChargeInfo(params).then(res => {
          if (res.data.code === 200) {
            this.parkingLotInformation = res.data.data;
            resolve();
          } else if (res.data.code === 403) {
            this.$message.warning("当前登录账户没有此页面操作权限！");
            this.noPower = true;
          } else {
            this.$message.error(res.data.msg);
            reject(res.data.msg);
          }
        });
      });
    },
    // 车道闸口查询
    pendingChargeList() {
      const params = {
        userId: JSON.parse(sessionStorage.getItem("userInfo")).userId
      };
      serve.pendingChargeList(params).then(res => {
        if (res.data.code === 200) {
          this.equipmentList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 待出场无牌车辆记录列表
    carInOutList() {
      const params = {
        garageId: this.parkingLotInformation.garageId
      };
      serve.carInOutList(params).then(res => {
        if (res.data.code === 200) {
          this.withoutLicenceList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    getSock(msg) {
      if (msg.data !== "服务器连接成功！") {
        clearInterval(this.timers);
        let data = msg.data;
        data = JSON.parse(data);
        console.log(data, "socketDatta");
        if (data.code === 1) {
          this.$message.warning("未识别到车牌号，请录入入场信息");
          this.withoutLicenceCarVisible.show = true;
          this.withoutLicenceCarFromData = {
            garageId: this.parkingLotInformation.garageId,
            parkingId: this.parkingLotInformation.parkingId,
            picFilePath: data.picFilePath,
            picPlateFilePath: data.picPlateFilePath
          };
          return false;
        } else if (data.code === 2) {
          this.$message.warning("未识别到车牌号，请录入出场信息");
          this.withoutLicenceCarVisible.show = true;
          this.withoutLicenceCarFromData = {
            garageId: this.parkingLotInformation.garageId,
            parkingId: this.parkingLotInformation.parkingId,
            picFilePath: data.picFilePath,
            picPlateFilePath: data.picPlateFilePath
          };
          console.log(
            this.withoutLicenceCarFromData,
            "this.withoutLicenceCarFromData"
          );
          return false;
        } else if (data.code === 3) {
          this.$message.warning("未查询到入场纪录，请补录入场记录");
          this.makeUpAdmissionRecordVisible.show = true;
          this.makeUpAdmissionRecordFromData = {
            garageId: this.parkingLotInformation.garageId,
            parkingId: this.parkingLotInformation.parkingId
          };
          this.picFilePath = data.picFilePath;
          this.picPlateFilePath = data.picPlateFilePath;
          return false;
        } else if (data.code === 4) {
          this.$message.warning(
            "请为当前停车场当前出场车辆车型适配一条适用计费规则"
          );
          return false;
        } else if (data.code === 5) {
          this.getPendingChargeInfo(); // 刷新待收费信息
          return false;
        }
        this.isOrder = true;
        if (this.paySuccessVisible.show === true) {
          this.paySuccessVisible.show = false;
        }
        if (data.status === 0) {
          this.isPay = false;
        } else if (data.status === 1) {
          this.isPay = true;
          this.count();
        }
        if (data.carNo !== "" || data.carNo !== null) {
          this.imagesList(data.orderId);
        }
        this.orderDetail = data;
        this.orderDetail.createTime = moment(data.createTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    },
    imagesList(orderId) {
      this.orderIds = null;
      this.orderIds = orderId;
      const params = {
        orderId: orderId
      };
      serve.getInOutFileList(params).then(res => {
        if (res.data.code === 200) {
          if (
            res.data.data.inPicFilePath === "nullnull" ||
            res.data.data.inPicFilePath === "nullnull"
          ) {
            this.inImages = "";
          } else {
            this.inImages = res.data.data.inPicFilePath;
          }
          if (
            res.data.data.outPicFilePath === "nullnull" ||
            res.data.data.outPicFilePath === "nullnull"
          ) {
            this.outImages = "";
          } else {
            this.outImages = res.data.data.outPicFilePath;
          }
          if (this.inImages === "" || this.outImages === "") {
            this.setTime = setTimeout(() => {
              this.imagesList(this.orderIds);
            }, 3000);
          }
        }
      });
    },
    // 最近订单列表
    PaidList() {
      const params = {
        garageId: this.parkingLotInformation.garageId
      };
      serve.PaidList(params).then(res => {
        if (res.data.code === 200) {
          this.orderList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  destroyed() {
    clearTimeout(this.setTime);
  }
};
</script>

<style lang="scss" scoped>
.parkingChargeTopCard {
  .parkingChargeTopCardBox {
    font-size: 18px;
    .parkingChargeTopCardBoxChild {
      color: rgba(0, 0, 0, 0.45);
      span {
        font-weight: 600;
        color: #3d3d3d;
      }
    }
  }
  .parkingChargeTopCardRightTime {
    display: flex;
    justify-content: space-between;
    .parkingChargeTopCardBoxTime {
      font-size: 18px;
      font-weight: 600;
      color: #3d3d3d;
    }
  }
  .border {
    border: 1px solid #f6f6f6;
    margin: 20px 0;
  }
  .stopButton {
    width: 88px !important;
    background: #f5222d !important;
    color: #fff !important;
    border-radius: 4px !important;
    border: 1px solid #f5222d !important;
  }
  .openButton {
    width: 88px !important;
    background: #52c41a !important;
    color: #fff !important;
    border-radius: 4px !important;
    border: 1px solid #52c41a !important;
  }
  .closeButton {
    width: 88px !important;
    background: #539fff !important;
    color: #fff !important;
    border-radius: 4px !important;
    border: 1px solid #539fff !important;
  }
  .unlockButton {
    width: 88px !important;
    color: #409eff !important;
    border-radius: 4px !important;
    border: 1px solid #409eff !important;
  }
  .humanSettlementButtonBox {
    display: flex;
    justify-content: flex-end;
    .humanSettlementButton {
      width: 88px !important;
      color: #fff !important;
      background: #409eff !important;
      border-radius: 4px !important;
      border: 1px solid #409eff !important;
    }
  }
  .equipment {
    margin-right: 40px;
  }
  .vehicleInformationStatistics {
    display: flex;
    justify-content: space-between;
    margin-top: 28px;
    .vehicleInformationStatisticsChild {
      width: 30%;
      height: 90px;
      display: flex;
      justify-content: space-between;
      background: url("../../assets/image/chargeAeait/trafficFlowNow@2x.png")
        no-repeat;
      background-size: 100% 100%;
      .vehicleInformationStatisticsLi {
        text-align: center;
        margin: auto;
        width: 33%;
        position: relative;
        .nowCar1 {
          width: 66px;
          position: absolute;
          left: -20px;
          bottom: -16px;
        }
        .nowCar2 {
          width: 120px;
          position: absolute;
          right: 15px;
          bottom: -38px;
        }
        .vehicleInformationStatisticsChildImg {
          width: 70px;
          height: 70px;
        }
        p {
          color: #fff;
          font-size: 12px;
          margin: 8px 0;
          text-align: left;
          margin-left: 20%;
        }
      }
      .vehicleInformationStatisticsLi1 {
        margin: auto 0;
        width: 33%;
        .currenTrafficFlowNum {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
        }
        .currenTrafficFlowText {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          margin-top: 15px;
        }
      }
    }
    .vehicleInformationStatisticsChild1 {
      width: 33%;
      height: 90px;
      display: flex;
      justify-content: space-between;
      background: url("../../assets/image/chargeAeait/haveFees2x.png") no-repeat;
      background-size: 100% 100%;
      .vehicleInformationStatisticsLi {
        text-align: center;
        margin: auto;
        width: 33%;
        position: relative;
        .nowCar1 {
          width: 66px;
          position: absolute;
          left: -15px;
          bottom: -25px;
        }
        .nowCar2 {
          width: 102px;
          position: absolute;
          right: 15px;
          bottom: -38px;
        }
        .vehicleInformationStatisticsChildImg {
          width: 70px;
          height: 70px;
        }
        p {
          color: #fff;
          font-size: 12px;
          margin: 8px 0;
          text-align: left;
          margin-left: 20%;
        }
      }
      .vehicleInformationStatisticsLi1 {
        margin: auto 0;
        width: 33%;
        .currenTrafficFlowNum {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
        }
        .currenTrafficFlowText {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          margin-top: 15px;
        }
      }
    }
    .vehicleInformationStatisticsChild2 {
      width: 33%;
      height: 90px;
      display: flex;
      justify-content: space-between;
      background: url("../../assets/image/chargeAeait/remainingSpace@2x.png")
        no-repeat;
      background-size: 100% 100%;
      .vehicleInformationStatisticsLi {
        text-align: center;
        margin: auto;
        width: 33%;
        position: relative;
        .nowCar1 {
          width: 66px;
          position: absolute;
          left: -15px;
          bottom: -25px;
        }
        .nowCar2 {
          width: 90px;
          position: absolute;
          right: 15px;
          bottom: -38px;
        }
        .vehicleInformationStatisticsChildImg {
          width: 70px;
          height: 70px;
        }
        p {
          color: #fff;
          font-size: 12px;
          margin: 8px 0;
          text-align: left;
          margin-left: 20%;
        }
      }
      .vehicleInformationStatisticsLi1 {
        margin: auto 0;
        width: 33%;
        .currenTrafficFlowNum {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
        }
        .currenTrafficFlowText {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          margin-top: 15px;
        }
      }
    }
  }
}
.parkingChargeMainBox {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  .parkingChargeMainBoxLeftContent {
    width: 77%;
    .parkingChargeMainBoxLeftContentComeGoOn {
      .parkingChargeMainBoxLeftContentComeGoOnCard {
        display: flex;
        justify-content: space-between;
        .parkingChargeMainBoxLeftContentCome {
          width: 49%;
          .parkingChargeMainBoxLeftContentComeTitle {
            display: flex;
            justify-content: space-between;
            background-color: #f2f3f6;
            padding: 10px;
            .parkingChargeMainBoxLeftContentComeTitleName {
              font-size: 12px;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.85);
            }
            .parkingChargeMainBoxLeftContentComeTitleTime {
              font-size: 12px;
              color: rgba(0, 0, 0, 0.65);
            }
            .parkingChargeMainBoxLeftContentComeTitlePlateNumber {
              font-size: 12px;
              font-weight: 600;
              color: rgba(0, 0, 0, 0.85);
            }
          }
          .parkingChargeMainBoxLeftContentComeContent {
            width: 100%;
            height: 290px;
            background-color: #fbfbfb;
            text-align: center;
            img {
              width: 400px;
              height: 110px;
              vertical-align: middle;
              margin-top: 40px;
            }
            .preImg {
              cursor: pointer;
              width: 100%;
              height: 100%;
              background: no-repeat;
              background-size: contain;
              margin-top: 0;
            }
            .parkingChargeMainBoxLeftContentComeContentText {
              text-align: center;
              font-size: 16px;
              color: #555555;
            }
          }
        }
        .parkingChargeMainBoxLeftContentGoOn {
          width: 50%;
        }
      }
    }
    .parkingChargeMainBoxLeftContentOrderBox {
      margin-top: 15px;
      .order-card-padding {
        ::v-deep .el-card__body {
          padding: 15px 15px 0 15px !important;
        }
        ::v-deep .el-tabs__active-bar {
          height: 12px !important;
          top: 13px !important;
        }
      }
      .swiper-slide {
        margin-right: 12px !important;
        width: 26% !important;
        ::v-deep .cardPadding {
          .el-card__body {
            padding: 0 !important;
          }
        }
        .swiperBox {
          cursor: pointer;
          width: 100% !important;
          position: relative;
          background: #ffffff;
          // border: 1px solid #eaeaea;
          // border-radius: 4px;
          padding: 12px;
          box-sizing: border-box;
          position: relative;
          .statusChecked {
            position: absolute;
            bottom: -5px;
            right: 0;
            // display: none;
          }
          .swiperBoxTitle {
            // display: flex;
            // justify-content: space-between;
            .swiperLicensePlateNumber {
              font-size: 14px;
              font-weight: 500;
              color: rgba(0, 0, 0, 0.85);
              margin-bottom: 14px;
            }
            .swiperFee {
              font-size: 14px;
              font-weight: 500;
              color: #f5222d;
            }
          }
          .swiperEnterTime {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.45);
            margin-bottom: 10px;
          }
          .swiperBoxBottom {
            // display: flex;
            // justify-content: space-between;
            .swiperBoxBottomStyle {
              font-size: 12px;
              color: rgba(0, 0, 0, 0.45);
              // margin-right: 30%;
            }
            .swiperBoxBottomHour {
              font-size: 12px;
              color: #f5222d;
            }
          }
        }
      }
    }
  }
  .parkingChargeMainBoxRightContent {
    width: 22%;
    box-sizing: border-box;
    position: relative;
    .RightContentCard {
      height: 100%;
      ::v-deep .el-card__body {
        padding: 0 !important;
        .box {
          .rightContentTttle {
            padding: 20px 0 0 20px;
            font-size: 14px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
          }
          .rightContentBorder {
            border: 1px solid #f6f6f6;
            margin: 16px 0 0 0;
          }
          .rightContentOrder {
            padding: 0 20px 20px 20px;
            text-align: center;
            img {
              width: 100%;
              margin-top: 30%;
            }
            .rightContentText {
              font-size: 14px;
              color: #999999;
            }
          }
          .carStyle {
            display: flex;
            justify-content: flex-start;
          }
          .rightContentHaveOrder {
            padding-left: 20px;
            .rightContentOrderDetail {
              margin-top: 24px;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.45);
              img {
                vertical-align: middle;
                margin-left: 12px;
              }
              span {
                color: rgba(0, 0, 0, 0.85);
              }
              .money {
                font-size: 20px;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.85);
              }
              .waitPay {
                color: #f5222d;
              }
              .yetPay {
                color: #52c41a;
              }
              .slotButton {
                display: inline-block;
                background: url("../../assets/image/chargeAeait/carStyle.png")
                  no-repeat;
                background-size: 14px 14px;
                border: none;
                margin-left: 13px;
              }
            }
          }
        }
      }
    }
    .RMBPayBox {
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -98px;
      ::v-deep .RMBPay {
        width: 196px;
        margin-bottom: 13px;
        background: #f5222d;
        border-radius: 4px;
      }
      ::v-deep .RMBPayed {
        width: 196px;
        margin-bottom: 13px;
        background: #f5f5f5;
        border-radius: 4px;
        color: rgba(0, 0, 0, 0.3);
        border: none;
      }
    }
  }
}
::v-deep .videoButton {
  background: none !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #409eff !important;
}
::v-deep .el-tabs__nav-wrap::after {
  height: 0 !important;
}
::v-deep .el-card__body {
  position: relative;
  .swiper-button-prev-custom {
    position: absolute;
    top: 50%;
    z-index: 2000;
    margin-top: -21px;
    margin-left: 82px;
    .activeLeftArrows {
      display: none;
      position: absolute;
      top: -3.5px;
      left: 0px;
    }
  }
  .swiper-button-next-custom {
    position: absolute;
    top: 54%;
    right: -5px;
    z-index: 2000;
    margin-top: -25px;
    .activeRightArrows {
      display: none;
      position: absolute;
      top: 4px;
      right: 0px;
    }
  }
}
::v-deep .elCard {
  margin-top: 12px !important;
  .el-card__body {
    padding: 12px !important;
  }
}
::v-deep .elCard:nth-child(0) {
  margin-top: 0 !important;
}
::v-deep .el-tabs--left .el-tabs__active-bar.is-left,
.el-tabs--left .el-tabs__nav-wrap.is-left::after {
  right: auto;
  left: 10px;
}
.carStyleCard {
  position: relative;
  .carStyleCardTitle {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px;
  }
  .carStyleCardStyle {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    margin-bottom: 10px;
    span {
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .carStyleCardMoney {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
  .imgPosition {
    position: absolute;
    bottom: -4px;
    right: 0px;
  }
}
</style>
