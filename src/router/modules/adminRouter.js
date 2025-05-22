import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/admin/user',
  name: 'Admin',
  meta: {
    title: '用户管理',
    icon: 'el-icon-user',
    roles: ['admin'] // 只有超级管理员可见
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/admin/user'),
      name: 'UserList',
      meta: { title: '用户列表', roles: ['admin'] }
    }
  ]
}

export default adminRouter 