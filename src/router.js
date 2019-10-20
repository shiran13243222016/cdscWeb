import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

//点击导航菜单的时候有时候会出现一个错误警告，官方说是路由文件的版本的问题，以下是解决办法之一
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};
if (window.localStorage.getItem('bindUrl')) {
  store.commit("bindUrl", window.localStorage.getItem('bindUrl'))
}
import roleRouter from './rolerouter'

Vue.use(Router);

export default new Router({
  routes: [
      ...roleRouter,
    {
      path: '/login',
      component: resolve => require(['./components/common/Login.vue'], resolve)
    },
    {
      path: '/registered',
      component: resolve => require(['./components/pages/Registered.vue'], resolve)
    },
    {
      path: '/registerSuccess',
      component: resolve => require(['./components/pages/RegisterSuccess.vue'], resolve)
    },

    {
      path: '*',
      redirect: '/404'
    }
  ]
})
