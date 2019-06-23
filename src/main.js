import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faNetworkWired,faUserSecret, faFile, faSync, faImage, faGlasses, faLink, faFileCode, faCode, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
 
library.add(faUserSecret)
library.add(faFile)
library.add(faSync)
library.add(faImage)
library.add(faGlasses)
library.add(faLink)
library.add(faFileCode)
library.add(faCode)
library.add(faTimes)
library.add(faCheck)
library.add(faNetworkWired)
 
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
