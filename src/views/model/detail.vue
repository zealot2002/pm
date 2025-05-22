<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>模块详情</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">返回列表</el-button>
      </div>
      
      <el-descriptions :column="2" border v-loading="loading">
        <el-descriptions-item label="模块名称">{{ moduleInfo.modelname }}</el-descriptions-item>
        <el-descriptions-item label="模块ID">{{ moduleInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="所属项目">{{ getProjectName(moduleInfo.pid) }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ moduleInfo.startdate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ moduleInfo.enddate }}</el-descriptions-item>
        <el-descriptions-item label="后端负责人">{{ getEmployeeName(moduleInfo.bid) }}</el-descriptions-item>
        <el-descriptions-item label="前端负责人">{{ getEmployeeName(moduleInfo.fid) }}</el-descriptions-item>
        <el-descriptions-item label="设计负责人">{{ getEmployeeName(moduleInfo.did) }}</el-descriptions-item>
        <el-descriptions-item label="说明" :span="2">{{ moduleInfo.rem }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick" style="margin-top: 20px;">
      <el-tab-pane label="进度状态" name="progress">
        <progress-list :pid="moduleInfo.pid" />
      </el-tab-pane>

      <el-tab-pane label="日报列表" name="daily">
        <daily-list :pid="moduleInfo.pid" :mid="moduleId" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getModelList } from '@/api/model'
import { getProjectList } from '@/api/project'
import { getAdminList } from '@/api/admin'
import { Message } from 'element-ui'

// 导入组件
import ProgressList from '@/views/progress/components/ProgressList'
import DailyList from '@/views/daily/components/DailyList'

export default {
  name: 'ModuleDetail',
  components: {
    ProgressList,
    DailyList
  },
  data() {
    return {
      moduleId: null,
      moduleInfo: {},
      loading: false,
      activeTab: 'progress',
      projectOptions: [],
      projectMap: {},
      employeeOptions: [],
      employeeMap: {}
    }
  },
  created() {
    this.moduleId = this.$route.params.id
    this.getProjects()
    this.getEmployees()
    this.getModuleInfo()
  },
  methods: {
    goBack() {
      this.$router.push('/model/list')
    },
    
    getProjects() {
      getProjectList({}).then(response => {
        if (response.code === 1) {
          this.projectOptions = response.data.data
          // 创建项目ID到名称的映射
          this.projectOptions.forEach(item => {
            this.projectMap[item.id] = item.name
          })
        } else {
          Message.error(response.msg || '获取项目列表失败')
        }
      }).catch(error => {
        console.error('获取项目列表失败:', error)
        Message.error('获取项目列表失败')
      })
    },
    
    getEmployees() {
      getAdminList({}).then(response => {
        if (response.code === 1) {
          this.employeeOptions = response.data.data
          // 创建员工ID到姓名的映射
          this.employeeOptions.forEach(item => {
            this.employeeMap[item.id] = item.name
          })
        } else {
          Message.error(response.msg || '获取员工列表失败')
        }
      }).catch(error => {
        console.error('获取员工列表失败:', error)
        Message.error('获取员工列表失败')
      })
    },
    
    getModuleInfo() {
      this.loading = true
      getModelList({}).then(response => {
        if (response.code === 1) {
          // 从返回的模块列表中找到当前模块
          const module = response.data.data.find(item => item.id === Number(this.moduleId))
          if (module) {
            this.moduleInfo = module
          } else {
            Message.error('未找到模块信息')
          }
        } else {
          Message.error(response.msg || '获取模块信息失败')
        }
        this.loading = false
      }).catch(error => {
        console.error('获取模块信息失败:', error)
        this.loading = false
        Message.error('获取模块信息失败')
      })
    },
    
    getProjectName(id) {
      return id && this.projectMap[id] ? this.projectMap[id] : '未知项目'
    },
    
    getEmployeeName(id) {
      return id && this.employeeMap[id] ? this.employeeMap[id] : '未指定'
    },
    
    handleTabClick() {
      // 切换标签页的处理逻辑
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}
</style> 