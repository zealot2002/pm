import Layout from '@/layout'

const modelRouter = {
  path: '/model',
  component: Layout,
  redirect: '/model/list',
  name: 'Model',
  meta: {
    title: '模块管理',
    icon: 'el-icon-s-grid',
    roles: ['admin'] // 超级管理员可见
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/model/list'),
      name: 'ModelList',
      meta: { title: '模块列表' }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/model/detail'),
      name: 'ModelDetail',
      meta: { title: '模块详情', activeMenu: '/model/list' },
      hidden: true
    }
  ]
}

export default modelRouter 