import Vue from 'vue'
import VueRouter from 'vue-router'
import Search from '../views/Search.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Search',
    component: Search
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/universe',
    name: 'Universe',
    component: () => import(/* webpackChunkName: "about" */ '../views/Universe.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
