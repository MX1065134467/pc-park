import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './utils/global.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'

// import style (>= Swiper 6.x)
import 'swiper/swiper-bundle.css'

import { IMAGE_URL } from '../config'
Vue.config.productionTip = false

Vue.prototype.IMAGEURL = IMAGE_URL

Vue.use(VueAwesomeSwiper /* { default options with global component } */)

const Bus = new Vue()
new Vue({
  router,
  store,
  data () {
    return {
      Bus
    }
  },
  render: h => h(App)
}).$mount('#app')
