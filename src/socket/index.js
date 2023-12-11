import {
  getUserInfo
} from '@/common/cache.js'
import {
  SOCKET_URL
} from '../../config'
import Bus from './bus.js'
const WEBSOCKET_URL = SOCKET_URL

var websocketConnectdCount = 0

export function newWebsocket() {
  var websocket = null
  // 判断当前环境是否支持Websocket
  if (window.WebSocket) {
    if (!websocket) {
      websocket = new WebSocket(WEBSOCKET_URL)
    } else {
      console.log('not support websocket')
    }

    // 连接成功建立得回调方法
    websocket.onopen = function (e) {
      heartCheck.reset().start() // 成功建立连接后，重置心跳检测
      websocket.send(
        JSON.stringify({
          // 连接成功将，用户ID传给服务端
          uid: getUserInfo().userId
        })
      )
      console.log('connected successfully')
    }

    // 连接发生错误 会继续尝试发生新得连接 5次
    websocket.onerror = function () {
      console.log('onerror连接发生错误')
      websocketConnectdCount++
      if (websocketConnectdCount <= 5) {
        newWebsocket()
      }
    }

    // 连接到消息得回调方法
    websocket.onmessage = function (e) {
      console.log('接受到消息了', e)
      var message = e
      if (message) {
        Bus.$emit('message', message)
      }
      heartCheck.reset().start() // 如果获取到消息，说明连接是正常的，重置心跳检测
    }

    // 接受到服务端关闭连接时的回调方法
    websocket.onclose = function () {
      console.log('onclose断开连接')
    }

    // 监听窗口事件 窗口关闭 主动断开连接
    window.onbeforeunload = function () {
      websocket.close()
    }

    // 心跳检测, 每隔一段时间检测连接状态，如果处于连接中，
    // 就向server端主动发送消息，来重置server端与客户端的最大连接时间，如果已经断开了，发起重连。
    var heartCheck = {
      timeout: 300000, // 5分钟发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。
      //   timeout: 3000,
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function () {
        clearTimeout(this.timeoutObj)
        clearTimeout(this.serverTimeoutObj)
        return this
      },
      start: function () {
        this.serverTimeoutObj = setInterval(function () {
          if (websocket.readyState === 1) {
            const status = sessionStorage.getItem('socet')
            if (status === '待收费') {
              console.log('连接状态，发送消息保持连接')
              websocket.send(
                JSON.stringify({
                  // 连接成功将，用户ID传给服务端
                  uid: getUserInfo().userId
                })
              )
              heartCheck.reset().start() // 如果获得消息 说明连接正常 重置心跳检测
            }
          } else {
            console.log('断开连接， 尝试重连')
            newWebsocket()
          }
        }, this.timeout)
      }
    }
  }
}
