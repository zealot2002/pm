/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const batchRecordRouter = {
  path: '/batchRecord',
  component: Layout,
  redirect: '/batchRecord/batchRecord',
  name: 'batchRecord',
  meta: {
    title: '批次管理',
    icon: 'clipboard'
  },
  children: [
    {
      path: 'batchRecord',
      component: () => import('@/views/batchRecord/batchRecord'),
      name: '批次管理',
      meta: { title: '批次管理' }
    }
  ]
}
export default batchRecordRouter
