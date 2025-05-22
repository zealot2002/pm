<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加项目
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="项目名称">
        <template slot-scope="scope">
          <router-link :to="'/project/detail/'+scope.row.id" class="link-type">
            <span>{{ scope.row.name }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="说明">
        <template slot-scope="scope">
          <span>{{ scope.row.rem }}</span>
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
      <el-table-column width="180px" align="center" label="操作">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: center; gap: 10px;">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)" v-if="userInfo.qx === 1">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑项目对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加项目' : '编辑项目'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="temp.name" />
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectList, addProject, updateProject, deleteProject } from '@/api/project'
import { Message, MessageBox } from 'element-ui'
import { getUserType } from '@/utils/SpUtil'

export default {
  name: 'ProjectList',
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
        rem: '',
        startdate: '',
        enddate: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
        startdate: [{ required: true, message: '开始日期不能为空', trigger: 'change' }],
        enddate: [{ required: true, message: '结束日期不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getProjectList({}).then(response => {
        if (response.code === 1) {
          this.list = response.data.data
        } else {
          Message.error(response.msg || '获取项目列表失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取项目列表失败:', error)
        this.listLoading = false
        Message.error('获取项目列表失败')
      })
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        rem: '',
        startdate: '',
        enddate: ''
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
          addProject(this.temp).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('创建成功')
              this.getList()
            } else {
              Message.error(response.msg || '创建失败')
            }
          }).catch(error => {
            console.error('创建项目失败:', error)
            Message.error('创建项目失败')
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
          updateProject(tempData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('更新成功')
              this.getList()
            } else {
              Message.error(response.msg || '更新失败')
            }
          }).catch(error => {
            console.error('更新项目失败:', error)
            Message.error('更新项目失败')
          })
        }
      })
    },

    handleDelete(row) {
      MessageBox.confirm('确定要删除该项目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProject(row.id).then(response => {
          if (response.code === 1) {
            Message.success('删除成功')
            this.getList()
          } else {
            Message.error(response.msg || '删除失败')
          }
        }).catch(error => {
          console.error('删除项目失败:', error)
          Message.error('删除项目失败')
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