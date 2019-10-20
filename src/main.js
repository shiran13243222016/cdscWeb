import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import cookie from 'js-cookie'
import RestClient from './lib/restClient'
import * as filters from './filter'
import Clipboard from 'v-clipboard'
Vue.use(Clipboard);


Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});
// icon
import 'vue-awesome/icons'
import Icons from 'vue-awesome/components/Icon'
Vue.component('icon', Icons);

import VueParticles from 'vue-particles'
Vue.use(VueParticles)

// ui按需引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import roleRouter from "./rolerouter";
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  if(sessionStorage.getItem("token")) {
    next();
  }else {
    if(to.path === '/login'){
      next();
    }else {
      if(to.path === '/registered'){
        next();
      }else{
        if(to.path === '/RegisterSuccess'){
          next()
        }else{
          next({
            path:'/login'
          })
        }
      }
    }
  }
});
Vue.prototype.RestClient = RestClient;
Vue.prototype.Cookie = cookie;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
