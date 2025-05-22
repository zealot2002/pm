import Layout from '@/layout'

const companyRouter = {
  path: '/company',
  component: Layout,
  redirect: '/company/company',
  name: 'Company',
  meta: {
    title: '公司管理',
    icon: 'el-icon-office-building',
    roles: ['admin'] // 只有超级管理员可见
  },
  children: [
    {
      path: 'company',
      component: () => import('@/views/company/company'),
      name: 'CompanyList',
      meta: { title: '公司列表', roles: ['admin'] }
    },
    {
      path: 'department',
      component: () => import('@/views/company/department'),
      name: 'DepartmentList',
      meta: { title: '部门列表', roles: ['admin'] }
    }
  ]
}

export default companyRouter 