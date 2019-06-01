import Vue from 'vue'
import Router from 'vue-router'
import StartSelector from '@/components/StartSelector'
import ShoppingList from '@/components/ShoppingList'
import DistributeScreen from '@/components/DistributeScreen'

Vue.use(Router)

export default new Router({
  routes: [
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
    },
  ]
})
