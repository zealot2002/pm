/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const batchRouter = {
  path: '/batch',
  component: Layout,
  redirect: '/batch/batch',
  name: 'batch',
  meta: {
    title: '批次规格管理',
    icon: 'form'
  },
  children: [
    {
      path: 'batch',
      component: () => import('@/views/batch/batch'),
      name: '批次规格管理',
      meta: { title: '批次规格管理' }
    }
  ]
}
export default batchRouter
