import Layout from '@/layout'

const versionRouter = {
  path: '/version',
  component: Layout,
  redirect: '/version/list',
  name: 'Version',
  meta: {
    title: '版本管理',
    icon: 'el-icon-s-flag'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/version/list'),
      name: 'VersionList',
      meta: { title: '版本列表' }
    }
  ]
}

export default versionRouter 