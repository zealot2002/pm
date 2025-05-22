/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const collarModelRouter = {
  path: '/collarModel',
  component: Layout,
  redirect: '/collarModel/collarModel',
  name: 'collarModel',
  meta: {
    title: '项圈型号管理',
    icon: 'component'
  },
  children: [
    {
      path: 'collarModel',
      component: () => import('@/views/collarModel/collarModel'),
      name: '项圈型号管理',
      meta: { title: '项圈型号管理' }
    }
  ]
}
export default collarModelRouter
