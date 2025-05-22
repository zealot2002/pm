<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.pid" placeholder="选择项目" clearable class="filter-item" style="width: 200px" @change="handleProjectChange">
        <el-option v-for="item in projectOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加版本
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="所属项目">
        <template slot-scope="scope">
          <span>{{ getProjectName(scope.row.pid) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="版本标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="文件名">
        <template slot-scope="scope">
          <span>{{ scope.row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="提交人">
        <template slot-scope="scope">
          <span>{{ getEmployeeName(scope.row.eid) }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300px" align="center" label="内容">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div style="max-width: 500px; white-space: pre-wrap;">{{ scope.row.rem }}</div>
            <div slot="reference" class="ellipsis">{{ scope.row.rem }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.addtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: center; gap: 10px;">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" v-if="scope.row.eid + '' === userId + ''">编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pagecount"
      @pagination="getList"
    />

    <!-- 添加/编辑版本对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加版本' : '编辑版本'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="项目" prop="pid">
          <el-select v-model="temp.pid" placeholder="请选择项目" clearable>
            <el-option v-for="item in projectOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="文件名" prop="filename">
          <el-input v-model="temp.filename" />
        </el-form-item>
        <el-form-item label="内容" prop="rem">
          <el-input v-model="temp.rem" type="textarea" :rows="5" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getVersionList, addVersion, updateVersion } from '@/api/version'
import { getProjectList } from '@/api/project'
import { getAdminList } from '@/api/admin'
import { Message } from 'element-ui'
import { getUserId } from '@/utils/SpUtil'
import Pagination from '@/components/Pagination'

export default {
  name: 'VersionList',
  components: { Pagination },
  props: {
    pid: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      projectOptions: [],
      projectMap: {},
      employeeOptions: [],
      employeeMap: {},
      userId: getUserId(),
      listQuery: {
        page: 1,
        pagecount: 10,
        pid: undefined,
        eid: undefined
      },
      temp: {
        id: undefined,
        pid: undefined,
        title: '',
        filename: '',
        eid: undefined,
        rem: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        pid: [{ required: true, message: '项目不能为空', trigger: 'change' }],
        title: [{ required: true, message: '版本标题不能为空', trigger: 'blur' }],
        filename: [{ required: true, message: '文件名不能为空', trigger: 'blur' }],
        rem: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getProjects()
    this.getEmployees()
    if (this.pid) {
      this.listQuery.pid = this.pid
      this.temp.pid = this.pid
    }
    this.getList()
  },
  methods: {
    getProjects() {
      getProjectList({}).then(response => {
        if (response.code === 1) {
          this.projectOptions = response.data
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
    
    getProjectName(id) {
      return id && this.projectMap[id] ? this.projectMap[id] : '未指定'
    },
    
    getEmployeeName(id) {
      return id && this.employeeMap[id] ? this.employeeMap[id] : '未知员工'
    },
    
    handleProjectChange() {
      this.listQuery.page = 1
      this.getList()
    },
        
    formatTime(timestamp) {
      if (!timestamp) return '未知时间'
      
      const date = new Date(parseInt(timestamp) * 1000)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}`
    },
    getList() {
      this.listLoading = true
      getVersionList(this.listQuery).then(response => {
        if (response.code === 1) {
          this.list = response.data.data
          this.total = response.data.total || response.data.data.length
        } else {
          Message.error(response.msg || '获取版本列表失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取版本列表失败:', error)
        this.listLoading = false
        Message.error('获取版本列表失败')
      })
    },
    
    resetTemp() {
      this.temp = {
        id: undefined,
        pid: this.listQuery.pid,
        title: '',
        filename: '',
        eid: getUserId(),
        rem: ''
      }
    },
    
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addVersion(this.temp).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('创建成功')
              this.getList()
            } else {
              Message.error(response.msg || '创建失败')
            }
          }).catch(error => {
            console.error('创建版本失败:', error)
            Message.error('创建版本失败')
          })
        }
      })
    },
    
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateVersion(tempData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('更新成功')
              this.getList()
            } else {
              Message.error(response.msg || '更新失败')
            }
          }).catch(error => {
            console.error('更新版本失败:', error)
            Message.error('更新版本失败')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}
</style> 