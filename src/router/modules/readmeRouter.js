/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const readmeRouter = {
  path: '/readme',
  component: Layout,
  redirect: '/readme/readme',
  name: 'readme',
  meta: {
    title: '系统使用说明',
    icon: 'people'
  },
  children: [
    {
      path: 'readme',
      component: () => import('@/views/readme/readme'),
      name: '系统使用说明',
      meta: { title: '系统使用说明', icon: 'documentation' }
    }
  ]
}
export default readmeRouter
