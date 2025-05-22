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
        <el-form-item label="部门" prop="department" :disabled="dialogStatus === 'update' && userInfo.qx === 0">
          <el-input v-model="temp.department" :disabled="dialogStatus === 'update' && userInfo.qx === 0" />
        </el-form-item>
        <el-form-item label="公司" prop="belong" :disabled="dialogStatus === 'update' && userInfo.qx === 0">
          <el-input v-model="temp.belong" :disabled="dialogStatus === 'update' && userInfo.qx === 0" />
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
import { Message, MessageBox } from 'element-ui'
import { getUserType } from '@/utils/SpUtil'

export default {
  name: 'UserManagement',
  data() {
    return {
      list: null,
      listLoading: true,
      userInfo: {
        qx: getUserType()
      },
      temp: {
        id: undefined,
        name: '',
        empnum: '',
        passwd: '',
        department: '',
        belong: '',
        qx: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        empnum: [{ required: true, message: '员工编号不能为空', trigger: 'blur' }],
        passwd: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        department: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
        belong: [{ required: true, message: '公司不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
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
        belong: '',
        qx: 0
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