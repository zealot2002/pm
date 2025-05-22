import Layout from '@/layout'

const dailyRouter = {
  path: '/daily',
  component: Layout,
  redirect: '/daily/list',
  name: 'Daily',
  meta: {
    title: '日报管理',
    icon: 'el-icon-document'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/daily/list'),
      name: 'DailyList',
      meta: { title: '日报列表' }
    }
  ]
}

export default dailyRouter 