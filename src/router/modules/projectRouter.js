import Layout from '@/layout'

const projectRouter = {
  path: '/project',
  component: Layout,
  redirect: '/project/list',
  name: 'Project',
  meta: {
    title: '项目管理',
    icon: 'el-icon-folder',
    roles: ['admin'] // 超级管理员可见
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/project/list'),
      name: 'ProjectList',
      meta: { title: '项目列表' }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/project/detail'),
      name: 'ProjectDetail',
      meta: { title: '项目详情', activeMenu: '/project/list' },
      hidden: true
    }
  ]
}

export default projectRouter 