/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const merchantRouter = {
  path: '/merchant',
  component: Layout,
  redirect: '/merchant/merchant',
  name: 'merchant',
  meta: {
    title: '商家管理',
    icon: 'user'
  },
  children: [
    {
      path: 'merchant',
      component: () => import('@/views/merchant/merchant'),
      name: '商家管理',
      meta: { title: '商家管理' }
    }
  ]
}
export default merchantRouter
