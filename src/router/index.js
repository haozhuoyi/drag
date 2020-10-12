import Vue from 'vue'
import Router from 'vue-router'
import dragTest from '@/components/dragTest'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dragTest',
      component: dragTest
    }
  ]
})
