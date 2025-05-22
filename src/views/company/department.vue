<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.cid" placeholder="选择公司" clearable class="filter-item" style="width: 200px" @change="handleCompanyChange">
        <el-option v-for="item in companyOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加部门
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="部门名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="所属公司">
        <template slot-scope="scope">
          <span>{{ getCompanyName(scope.row.cid) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="说明">
        <template slot-scope="scope">
          <span>{{ scope.row.rem }}</span>
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

    <!-- 添加/编辑部门对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加部门' : '编辑部门'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="公司" prop="cid">
          <el-select v-model="temp.cid" placeholder="请选择公司">
            <el-option v-for="item in companyOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="说明" prop="rem">
          <el-input v-model="temp.rem" type="textarea" :rows="3" />
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
import { getDepartmentList, addDepartment, updateDepartment, deleteDepartment } from '@/api/company'
import { getCompanyList } from '@/api/company'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'DepartmentManagement',
  data() {
    return {
      list: null,
      companyOptions: [],
      listLoading: true,
      listQuery: {
        cid: undefined
      },
      temp: {
        id: undefined,
        cid: undefined,
        name: '',
        rem: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        cid: [{ required: true, message: '请选择公司', trigger: 'change' }],
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCompanies()
    this.getList()
  },
  methods: {
    getCompanies() {
      getCompanyList().then(response => {
        if (response.code === 1) {
          this.companyOptions = response.data.data
        } else {
          Message.error(response.msg || '获取公司列表失败')
        }
      }).catch(error => {
        console.error('获取公司列表失败:', error)
        Message.error('获取公司列表失败')
      })
    },
    
    getList() {
      this.listLoading = true
      const params = {}
      if (this.listQuery.cid) {
        params.cid = this.listQuery.cid
      }
      
      getDepartmentList(params).then(response => {
        if (response.code === 1) {
          this.list = response.data.data
        } else {
          Message.error(response.msg || '获取部门列表失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取部门列表失败:', error)
        this.listLoading = false
        Message.error('获取部门列表失败')
      })
    },

    getCompanyName(cid) {
      const company = this.companyOptions.find(item => item.id === cid)
      return company ? company.name : '未知公司'
    },

    handleCompanyChange() {
      this.getList()
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        cid: this.listQuery.cid,
        name: '',
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
          addDepartment(this.temp).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('创建成功')
              this.getList()
            } else {
              Message.error(response.msg || '创建失败')
            }
          }).catch(error => {
            console.error('创建部门失败:', error)
            Message.error('创建部门失败')
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
          updateDepartment(tempData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('更新成功')
              this.getList()
            } else {
              Message.error(response.msg || '更新失败')
            }
          }).catch(error => {
            console.error('更新部门失败:', error)
            Message.error('更新部门失败')
          })
        }
      })
    },

    handleDelete(row) {
      MessageBox.confirm('确定要删除该部门吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDepartment({id: row.id, cid: row.cid}).then(response => {
          if (response.code === 1) {
            Message.success('删除成功')
            this.getList()
          } else {
            Message.error(response.msg || '删除失败')
          }
        }).catch(error => {
          console.error('删除部门失败:', error)
          Message.error('删除部门失败')
        })
      }).catch(() => {
        // 取消删除
      })
    }
  }
}
</script> 