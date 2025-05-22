<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加用户
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="员工编号">
        <template slot-scope="scope">
          <span>{{ scope.row.empnum }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="部门">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="公司">
        <template slot-scope="scope">
          <span>{{ scope.row.belong }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="权限">
        <template slot-scope="scope">
          <el-tag :type="scope.row.qx === 1 ? 'danger' : 'success'">
            {{ scope.row.qx === 1 ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: center; gap: 10px;">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加用户' : '编辑用户'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="员工编号" prop="empnum" :disabled="dialogStatus === 'update' && userInfo.qx === 0">
          <el-input v-model="temp.empnum" :disabled="dialogStatus === 'update' && userInfo.qx === 0" />
        </el-form-item>
        <el-form-item label="密码" prop="passwd">
          <el-input v-model="temp.passwd" type="password" />
        </el-form-item>
        <el-form-item label="公司" prop="belongName" :disabled="dialogStatus === 'update' && userInfo.qx === 0">
          <el-select 
            v-model="temp.belongName" 
            placeholder="请选择公司" 
            :disabled="dialogStatus === 'update' && userInfo.qx === 0"
            @change="handleCompanyChange"
          >
            <el-option 
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="departmentName" :disabled="dialogStatus === 'update' && userInfo.qx === 0">
          <el-select 
            v-model="temp.departmentName" 
            placeholder="请选择部门" 
            :disabled="dialogStatus === 'update' && userInfo.qx === 0 || !temp.belongName"
            @change="handleDepartmentChange"
          >
            <el-option 
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="qx" :disabled="dialogStatus === 'update' && userInfo.qx === 0">
          <el-select v-model="temp.qx" placeholder="请选择权限" :disabled="dialogStatus === 'update' && userInfo.qx === 0">
            <el-option label="普通用户" :value="0" />
            <el-option label="管理员" :value="1" />
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
import { getAdminList, addAdmin, updateAdmin, deleteAdmin } from '@/api/admin'
import { getCompanyList, getDepartmentList } from '@/api/company'
import { Message, MessageBox } from 'element-ui'
import { getUserType } from '@/utils/SpUtil'

export default {
  name: 'UserManagement',
  data() {
    return {
      list: null,
      listLoading: true,
      companyList: [],
      departmentList: [],
      userInfo: {
        qx: getUserType()
      },
      temp: {
        id: undefined,
        name: '',
        empnum: '',
        passwd: '',
        department: '',
        departmentName: '',
        belong: '',
        belongName: '',
        qx: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        empnum: [{ required: true, message: '员工编号不能为空', trigger: 'blur' }],
        passwd: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        belongName: [{ required: true, message: '公司不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.fetchCompanyList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAdminList({}).then(response => {
        if (response.code === 1) {
          this.list = response.data.data
        } else {
          Message.error(response.msg || '获取用户列表失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取用户列表失败:', error)
        this.listLoading = false
        Message.error('获取用户列表失败')
      })
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        empnum: '',
        passwd: '',
        department: '',
        departmentName: '',
        belong: '',
        belongName: '',
        qx: 0
      }
    },

    fetchCompanyList() {
      getCompanyList({}).then(response => {
        if (response.code === 1) {
          this.companyList = response.data.data || []
        } else {
          Message.error(response.msg || '获取公司列表失败')
        }
      }).catch(error => {
        console.error('获取公司列表失败:', error)
        Message.error('获取公司列表失败')
      })
    },
    
    handleCompanyChange(companyName) {
      this.temp.departmentName = ''
      this.temp.department = ''
      this.departmentList = []
      
      // 根据公司名称找到对应的公司ID
      const selectedCompany = this.companyList.find(item => item.name === companyName)
      if (!selectedCompany) return
      
      // 保存公司ID
      this.temp.belong = selectedCompany.id
      
      getDepartmentList({ cid: selectedCompany.id }).then(response => {
        if (response.code === 1) {
          this.departmentList = response.data.data || []
        } else {
          Message.error(response.msg || '获取部门列表失败')
        }
      }).catch(error => {
        console.error('获取部门列表失败:', error)
        Message.error('获取部门列表失败')
      })
    },
    
    handleDepartmentChange(departmentName) {
      // 根据部门名称找到对应的部门ID
      const selectedDepartment = this.departmentList.find(item => item.name === departmentName)
      if (!selectedDepartment) return
      
      // 保存部门ID
      this.temp.department = selectedDepartment.id
    },

    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.departmentList = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addAdmin(this.temp).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('创建成功')
              this.getList()
            } else {
              Message.error(response.msg || '创建失败')
            }
          }).catch(error => {
            console.error('创建用户失败:', error)
            Message.error('创建用户失败')
          })
        }
      })
    },

    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      
      // 将名称和ID保存到对应字段
      this.temp.belongName = this.temp.belong
      this.temp.departmentName = this.temp.department
      
      // 根据公司名称查找ID
      const selectedCompany = this.companyList.find(item => item.name === this.temp.belongName)
      if (selectedCompany) {
        this.temp.belong = selectedCompany.id
        
        // 加载该公司下的部门列表
        getDepartmentList({ cid: selectedCompany.id }).then(response => {
          if (response.code === 1) {
            this.departmentList = response.data.data || []
            
            // 根据部门名称查找ID
            const selectedDepartment = this.departmentList.find(item => item.name === this.temp.departmentName)
            if (selectedDepartment) {
              this.temp.department = selectedDepartment.id
            }
          }
        }).catch(error => {
          console.error('获取部门列表失败:', error)
        })
      }
      
      this.temp.passwd = '' // 清空密码字段
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
          updateAdmin(tempData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('更新成功')
              this.getList()
            } else {
              Message.error(response.msg || '更新失败')
            }
          }).catch(error => {
            console.error('更新用户失败:', error)
            Message.error('更新用户失败')
          })
        }
      })
    },

    handleDelete(row) {
      MessageBox.confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(row.id).then(response => {
          if (response.code === 1) {
            Message.success('删除成功')
            this.getList()
          } else {
            Message.error(response.msg || '删除失败')
          }
        }).catch(error => {
          console.error('删除用户失败:', error)
          Message.error('删除用户失败')
        })
      }).catch(() => {
        // 取消删除
      })
    }
  }
}
</script> 