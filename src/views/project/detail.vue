<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>项目详情</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="goBack">返回列表</el-button>
      </div>
      
      <el-descriptions :column="2" border v-loading="loading">
        <el-descriptions-item label="项目名称">{{ projectInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="项目ID">{{ projectInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ projectInfo.startdate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ projectInfo.enddate }}</el-descriptions-item>
        <el-descriptions-item label="说明" :span="2">{{ projectInfo.rem }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick" style="margin-top: 20px;">
      <el-tab-pane label="模块列表" name="modules">
        <div class="filter-container">
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreateModule" v-if="userInfo.qx === 1">
            添加模块
          </el-button>
        </div>

        <el-table v-loading="moduleLoading" :data="moduleList" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="ID" width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" label="模块名称">
            <template slot-scope="scope">
              <span>{{ scope.row.modelname }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" label="开始日期">
            <template slot-scope="scope">
              <span>{{ scope.row.startdate }}</span>
            </template>
          </el-table-column>
          <el-table-column width="150px" align="center" label="结束日期">
            <template slot-scope="scope">
              <span>{{ scope.row.enddate }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100px" align="center" label="后端负责人">
            <template slot-scope="scope">
              <span>{{ getEmployeeName(scope.row.bid) }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100px" align="center" label="前端负责人">
            <template slot-scope="scope">
              <span>{{ getEmployeeName(scope.row.fid) }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100px" align="center" label="设计负责人">
            <template slot-scope="scope">
              <span>{{ getEmployeeName(scope.row.did) }}</span>
            </template>
          </el-table-column>
          <el-table-column width="180px" align="center" label="操作">
            <template slot-scope="scope">
              <div style="display: flex; justify-content: center; gap: 10px;">
                <el-button type="primary" size="mini" @click="handleUpdateModule(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDeleteModule(scope.row)" v-if="userInfo.qx === 1">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      
      <el-tab-pane label="进度列表" name="progress">
        <progress-list :pid="projectId" />
      </el-tab-pane>

      <el-tab-pane label="日报列表" name="daily">
        <daily-list :pid="projectId" />
      </el-tab-pane>

      <el-tab-pane label="版本列表" name="version">
        <version-list :pid="projectId" />
      </el-tab-pane>
    </el-tabs>

    <!-- 模块编辑对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加模块' : '编辑模块'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="模块名称" prop="modelname">
          <el-input v-model="temp.modelname" />
        </el-form-item>
        <el-form-item label="说明" prop="rem">
          <el-input v-model="temp.rem" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startdate">
          <el-date-picker v-model="temp.startdate" type="date" placeholder="选择开始日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="结束日期" prop="enddate">
          <el-date-picker v-model="temp.enddate" type="date" placeholder="选择结束日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="后端负责人" prop="bid">
          <el-select v-model="temp.bid" placeholder="请选择后端负责人" clearable>
            <el-option v-for="item in employeeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="前端负责人" prop="fid">
          <el-select v-model="temp.fid" placeholder="请选择前端负责人" clearable>
            <el-option v-for="item in employeeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设计负责人" prop="did">
          <el-select v-model="temp.did" placeholder="请选择设计负责人" clearable>
            <el-option v-for="item in employeeOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createModule() : updateModule()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectList } from '@/api/project'
import { getModelList, addModel, updateModel, deleteModel } from '@/api/model'
import { getAdminList } from '@/api/admin'
import { Message, MessageBox } from 'element-ui'
import { getUserType } from '@/utils/SpUtil'

// 导入组件
import ProgressList from '@/views/progress/components/ProgressList'
import DailyList from '@/views/daily/components/DailyList'
import VersionList from '@/views/version/components/VersionList'

export default {
  name: 'ProjectDetail',
  components: {
    ProgressList,
    DailyList,
    VersionList
  },
  data() {
    return {
      projectId: null,
      projectInfo: {},
      loading: false,
      moduleList: [],
      moduleLoading: false,
      employeeOptions: [],
      activeTab: 'modules',
      userInfo: {
        qx: getUserType()
      },
      temp: {
        id: undefined,
        modelname: '',
        rem: '',
        startdate: '',
        enddate: '',
        pid: undefined,
        bid: undefined,
        fid: undefined,
        did: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        modelname: [{ required: true, message: '模块名称不能为空', trigger: 'blur' }],
        startdate: [{ required: true, message: '开始日期不能为空', trigger: 'change' }],
        enddate: [{ required: true, message: '结束日期不能为空', trigger: 'change' }]
      },
      employeeMap: {}
    }
  },
  created() {
    this.projectId = this.$route.params.id
    this.getProjectInfo()
    this.getModuleList()
    this.getEmployeeList()
  },
  methods: {
    goBack() {
      this.$router.push('/project/list')
    },
    
    getProjectInfo() {
      this.loading = true
      getProjectList({}).then(response => {
        if (response.code === 1) {
          // 从返回的项目列表中找到当前项目
          const project = response.data.data.find(item => item.id === Number(this.projectId))
          if (project) {
            this.projectInfo = project
          } else {
            Message.error('未找到项目信息')
          }
        } else {
          Message.error(response.msg || '获取项目信息失败')
        }
        this.loading = false
      }).catch(error => {
        console.error('获取项目信息失败:', error)
        this.loading = false
        Message.error('获取项目信息失败')
      })
    },
    
    getModuleList() {
      this.moduleLoading = true
      getModelList({ pid: this.projectId }).then(response => {
        if (response.code === 1) {
          this.moduleList = response.data.data
        } else {
          Message.error(response.msg || '获取模块列表失败')
        }
        this.moduleLoading = false
      }).catch(error => {
        console.error('获取模块列表失败:', error)
        this.moduleLoading = false
        Message.error('获取模块列表失败')
      })
    },
    
    getEmployeeList() {
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
    
    getEmployeeName(id) {
      return id && this.employeeMap[id] ? this.employeeMap[id] : '未指定'
    },
    
    handleTabClick() {
      // 切换标签页的处理逻辑
    },
    
    resetTemp() {
      this.temp = {
        id: undefined,
        modelname: '',
        rem: '',
        startdate: '',
        enddate: '',
        pid: this.projectId,
        bid: undefined,
        fid: undefined,
        did: undefined
      }
    },
    
    handleCreateModule() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    
    createModule() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addModel(this.temp).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('创建成功')
              this.getModuleList()
            } else {
              Message.error(response.msg || '创建失败')
            }
          }).catch(error => {
            console.error('创建模块失败:', error)
            Message.error('创建模块失败')
          })
        }
      })
    },
    
    handleUpdateModule(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    
    updateModule() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateModel(tempData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('更新成功')
              this.getModuleList()
            } else {
              Message.error(response.msg || '更新失败')
            }
          }).catch(error => {
            console.error('更新模块失败:', error)
            Message.error('更新模块失败')
          })
        }
      })
    },
    
    handleDeleteModule(row) {
      MessageBox.confirm('确定要删除该模块吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModel(row.id).then(response => {
          if (response.code === 1) {
            Message.success('删除成功')
            this.getModuleList()
          } else {
            Message.error(response.msg || '删除失败')
          }
        }).catch(error => {
          console.error('删除模块失败:', error)
          Message.error('删除模块失败')
        })
      }).catch(() => {
        // 取消删除
      })
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}
</style> 