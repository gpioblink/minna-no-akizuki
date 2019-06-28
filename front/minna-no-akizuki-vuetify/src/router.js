import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import StartSelector from './views/StartSelector'
import ShoppingList from './views/ShoppingList'
import DistributeScreen from './views/DistributeScreen'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/',
      name: 'StartSelector',
      component: StartSelector
    },
    {
      path: '/:cartId',
      name: 'StartSelector',
      component: StartSelector
    },
    {
      path: '/list/:cartId',
      name: 'ShoppingList',
      component: ShoppingList,
      props: (route) => ({
        cartId: route.params.cartId
      })
    },
    {
      path: '/dist/:cartId',
      name: 'DistributeScreen',
      component: DistributeScreen
    }
  ]
})
