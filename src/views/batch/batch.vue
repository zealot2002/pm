<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加批次规格
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="数量">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
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

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />

    <!-- 添加/编辑批次规格对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加批次规格' : '编辑批次规格'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input v-model="temp.num" placeholder="请输入数量" />
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
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { createBatchSpecification, getBatchSpecification, updateBatchSpecification, deleteBatchSpecification } from '@/api/batch'
import { Message } from 'element-ui'
import { isFastClick } from '@/utils/doubleClickUtil'
import { logAction } from '@/utils/StatisticUtil'
export default {
  name: 'BatchManagement',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      },
      temp: {
        id: -1,
        name: '',
        num: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        num: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getBatchSpecification(this.listQuery).then(response => {
        if (response.code === 1) {
          this.list = response.data
          this.total = response.data.length
        } else {
          this.showError(response.msg)
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取批次规格列表失败:', error)
        this.listLoading = false
        this.showError('获取批次规格列表失败')
      })
    },

    resetTemp() {
      this.temp = {
        id: -1,
        name: '',
        num: 0
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
      if (isFastClick()) return
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            name: this.temp.name,
            num: parseInt(this.temp.num)
          }
          createBatchSpecification(params).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建批次规格成功',
                type: 'success',
                duration: 2000
              })
              logAction('创建批次规格', params)
            } else {
              this.showError(response.msg)
            }
          }).catch(error => {
            console.error('创建批次规格失败:', error)
            this.showError('创建批次规格失败')
          })
        }
      })
    },

    handleUpdate(row) {
      this.temp = Object.assign({}, row) // 复制对象，避免修改原始数据
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      if (isFastClick()) return
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            id: parseInt(this.temp.id),
            name: this.temp.name,
            num: parseInt(this.temp.num)
          }
          updateBatchSpecification(params).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '更新批次规格成功',
                type: 'success',
                duration: 2000
              })
              logAction('更新批次规格', params)
            } else {
              this.showError(response.msg)
            }
          }).catch(error => {
            console.error('更新批次规格失败:', error)
            this.showError('更新批次规格失败')
          })
        }
      })
    },

    handleDelete(row) {
      this.$confirm('确定要删除该批次规格吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteBatchSpecification(params).then(response => {
          if (response.code === 1) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除批次规格成功',
              type: 'success',
              duration: 2000
            })
            logAction('删除批次规格', params)
          } else {
            this.showError(response.msg)
          }
        }).catch(error => {
          console.error('删除批次规格失败:', error)
          this.showError('删除批次规格失败')
        })
      }).catch(() => {
        // Do nothing
      })
    },

    showError(msg) {
      Message({
        message: msg,
        type: 'error',
        duration: 2000
      })
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}

.filter-item {
  margin-bottom: 10px;
}

.el-upload__tip {
  line-height: 1.2;
}
</style>
