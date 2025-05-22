import Vue from 'vue'
import Router from 'vue-router'
// import { logView } from '@/utils/StatisticUtil'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { getUserType } from '@/utils/SpUtil'

// 导入路由模块
// import collarRouter from './modules/collarRouter'
import companyRouter from './modules/companyRouter'
import adminRouter from './modules/adminRouter'
import projectRouter from './modules/projectRouter'
import modelRouter from './modules/modelRouter'
import progressRouter from './modules/progressRouter'
import dailyRouter from './modules/dailyRouter'
import versionRouter from './modules/versionRouter'

// 基础路由，所有用户都可访问
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: { title: '登录页' }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

// 定义超级管理员路由模块
const adminRoutes = [
  companyRouter,
  adminRouter,
  projectRouter,
  modelRouter,
  dailyRouter,
  versionRouter
]

// 定义普通用户路由模块
const normalRoutes = [
  projectRouter,
  modelRouter,
  dailyRouter,
  versionRouter
]

// 定义不同用户类型的路由集合
const routeModules = {
  // 超级管理员路由
  admin: [
    ...adminRoutes
  ],

  // 普通用户路由
  normal: [
    ...normalRoutes
  ]
}

// 过滤掉无效路由
Object.keys(routeModules).forEach(key => {
  routeModules[key] = routeModules[key].filter(Boolean)
})

/**
 * 获取异步路由配置
 * 根据用户类型返回不同的路由
 */
export function getAsyncRoutes() {
  const routes = getRoutesByType() || routeModules.normal

  return [
    ...routes,
    { path: '*', redirect: '/404', hidden: true }
  ]
}

/**
 * 根据用户类型获取对应的路由配置
 */
function getRoutesByType() {
  try {
    const type = String(getUserType())
    console.log('zzy getRoutesByType type ', type)

    switch (type) {
      case '1':
        return routeModules.admin
      default:
        return routeModules.normal
    }
  } catch (error) {
    console.warn('获取用户类型失败，使用默认路由', error)
    return routeModules.normal
  }
}

// 创建路由实例
const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

// 在路由实例创建后添加全局后置守卫
router.afterEach((to) => {
  // 路由切换完成后自动记录访问
  // 如果需要添加访问日志，可以在这里添加
})

// 在路由实例创建后添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 存储上一个页面路径
  if (from.path) {
    sessionStorage.setItem('prepage', from.meta.title)
  }
  next()
})

export default router
