<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加公司
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="公司名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="说明">
        <template slot-scope="scope">
          <span>{{ scope.row.rem }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.adddate }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="状态">
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

    <!-- 添加/编辑公司对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加公司' : '编辑公司'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="公司名称" prop="name">
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
import { getCompanyList, addCompany, updateCompany, deleteCompany } from '@/api/company'
import { Message, MessageBox } from 'element-ui'
import { getUserId } from '@/utils/SpUtil'

export default {
  name: 'CompanyManagement',
  data() {
    return {
      list: null,
      listLoading: true,
      temp: {
        id: undefined,
        name: '',
        rem: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCompanyList().then(response => {
        if (response.code === 1) {
          this.list = response.data.data
        } else {
          Message.error(response.msg || '获取公司列表失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取公司列表失败:', error)
        this.listLoading = false
        Message.error('获取公司列表失败')
      })
    },

    resetTemp() {
      this.temp = {
        id: undefined,
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
          addCompany(this.temp).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('创建成功')
              this.getList()
            } else {
              Message.error(response.msg || '创建失败')
            }
          }).catch(error => {
            console.error('创建公司失败:', error)
            Message.error('创建公司失败')
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
          updateCompany(tempData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('更新成功')
              this.getList()
            } else {
              Message.error(response.msg || '更新失败')
            }
          }).catch(error => {
            console.error('更新公司失败:', error)
            Message.error('更新公司失败')
          })
        }
      })
    },

    handleDelete(row) {
      MessageBox.confirm('确定要删除该公司吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCompany(row.id).then(response => {
          if (response.code === 1) {
            Message.success('删除成功')
            this.getList()
          } else {
            Message.error(response.msg || '删除失败')
          }
        }).catch(error => {
          console.error('删除公司失败:', error)
          Message.error('删除公司失败')
        })
      }).catch(() => {
        // 取消删除
      })
    }
  }
}
</script> 