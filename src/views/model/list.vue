<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.pid" placeholder="选择项目" clearable class="filter-item" style="width: 200px" @change="handleProjectChange">
        <el-option v-for="item in projectOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate" v-if="userInfo.qx === 1">
        添加模块
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="模块名称">
        <template slot-scope="scope">
          <router-link :to="'/model/detail/'+scope.row.id" class="link-type">
            <span>{{ scope.row.modelname }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="所属项目">
        <template slot-scope="scope">
          <span>{{ getProjectName(scope.row.pid) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="开始日期">
        <template slot-scope="scope">
          <span>{{ scope.row.startdate }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="结束日期">
        <template slot-scope="scope">
          <span>{{ scope.row.enddate }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="后端负责人">
        <template slot-scope="scope">
          <span>{{ getEmployeeName(scope.row.bid) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="前端负责人">
        <template slot-scope="scope">
          <span>{{ getEmployeeName(scope.row.fid) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="设计负责人">
        <template slot-scope="scope">
          <span>{{ getEmployeeName(scope.row.did) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: center; gap: 10px;">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)" v-if="userInfo.qx === 1">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑模块对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加模块' : '编辑模块'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="项目" prop="pid">
          <el-select v-model="temp.pid" placeholder="请选择项目">
            <el-option v-for="item in projectOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
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
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getModelList, addModel, updateModel, deleteModel } from '@/api/model'
import { getProjectList } from '@/api/project'
import { getAdminList } from '@/api/admin'
import { Message, MessageBox } from 'element-ui'
import { getUserType, getUserId } from '@/utils/SpUtil'

export default {
  name: 'ModelList',
  data() {
    return {
      list: [],
      listLoading: true,
      projectOptions: [],
      projectMap: {},
      employeeOptions: [],
      employeeMap: {},
      userInfo: {
        qx: getUserType(),
        eid: getUserId()
      },
      listQuery: {
        pid: undefined,
        eid: getUserId()
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
        pid: [{ required: true, message: '请选择项目', trigger: 'change' }],
        modelname: [{ required: true, message: '模块名称不能为空', trigger: 'blur' }],
        startdate: [{ required: true, message: '开始日期不能为空', trigger: 'change' }],
        enddate: [{ required: true, message: '结束日期不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getProjects()
    this.getEmployees()
    this.getList()
  },
  methods: {
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
    
    getProjectName(id) {
      return id && this.projectMap[id] ? this.projectMap[id] : '未知项目'
    },
    
    getEmployeeName(id) {
      return id && this.employeeMap[id] ? this.employeeMap[id] : '未指定'
    },
    
    handleProjectChange() {
      this.getList()
    },

    getList() {
      this.listLoading = true
      const params = {
        eid: this.listQuery.eid
      }
      
      if (this.listQuery.pid) {
        params.pid = this.listQuery.pid
      }
      
      getModelList(params).then(response => {
        if (response.code === 1) {
          this.list = response.data.data
        } else {
          Message.error(response.msg || '获取模块列表失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取模块列表失败:', error)
        this.listLoading = false
        Message.error('获取模块列表失败')
      })
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        modelname: '',
        rem: '',
        startdate: '',
        enddate: '',
        pid: this.listQuery.pid,
        bid: undefined,
        fid: undefined,
        did: undefined
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
          addModel(this.temp).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('创建成功')
              this.getList()
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
          updateModel(tempData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('更新成功')
              this.getList()
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

    handleDelete(row) {
      MessageBox.confirm('确定要删除该模块吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModel(row.id).then(response => {
          if (response.code === 1) {
            Message.success('删除成功')
            this.getList()
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
.link-type {
  color: #409EFF;
  text-decoration: none;
}
</style> 