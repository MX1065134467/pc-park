/* eslint-disable indent */
let IMAGE_URL = ''
let SOCKET_URL = ''
if (process.env.NODE_ENV === 'production') {
    switch (process.env.VUE_APP_ENV) {
        case 'develop':
            IMAGE_URL = 'http://192.168.10.58:8080/'
            SOCKET_URL = 'ws://192.168.10.58:58080/webSocket'
            break
        case 'test':
            // IMAGE_URL = 'https://touradmin.zhihuifh.cn/'
            IMAGE_URL = 'https://testpark.zhihuifh.cn:8073/parkpic/'
                // IMAGE_URL = 'http://172.16.151.33/'
            SOCKET_URL = 'ws://172.16.24.23:58080/webSocket'
            break
        case 'production':
            // IMAGE_URL = 'https://touradmin.zhihuifh.cn/'
            IMAGE_URL = 'http://172.16.87.22/'
            SOCKET_URL = 'ws://172.16.25.24:58869/webSocket'
            break
    }
} else {
    // IMAGE_URL = 'https://touradmin.zhihuifh.cn/'
    IMAGE_URL = 'http://192.168.100.81:8850/'
        //   SOCKET_URL = 'ws://192.168.100.81:58080/webSocket'
    SOCKET_URL = 'ws://192.168.10.58:58080/webSocket'
}

export {
    IMAGE_URL,
    SOCKET_URL
}