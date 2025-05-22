/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const collarRouter = {
  path: '/collar',
  component: Layout,
  redirect: '/collar/collar',
  name: 'collar',
  meta: {
    title: '项圈管理',
    icon: 'el-icon-s-tools'
  },
  children: [
    {
      path: '项圈管理',
      component: () => import('@/views/collar/collar'),
      name: '项圈管理',
      meta: { title: '项圈管理', icon: 'el-icon-s-tools' }
    }
  ]
}
export default collarRouter
