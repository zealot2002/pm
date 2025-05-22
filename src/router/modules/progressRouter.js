import Layout from '@/layout'

const progressRouter = {
  path: '/progress',
  component: Layout,
  redirect: '/progress/list',
  name: 'Progress',
  meta: {
    title: '进度管理',
    icon: 'el-icon-time'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/progress/list'),
      name: 'ProgressList',
      meta: { title: '进度列表' }
    }
  ]
}

export default progressRouter 