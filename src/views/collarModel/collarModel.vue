<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加项圈型号
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="型号名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="长度（cm）">
        <template slot-scope="scope">
          <span>{{ scope.row.len }}</span>
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

    <el-dialog :title="dialogStatus === 'create' ? '添加项圈型号' : '编辑项圈型号'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入型号名称" />
        </el-form-item>
        <el-form-item label="长度（cm）" prop="len">
          <el-input v-model="temp.len" type="textarea" placeholder="请输入型号长度" />
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
import Pagination from '@/components/Pagination'
import { Message } from 'element-ui'
import { isFastClick } from '@/utils/doubleClickUtil'
import { createCollarModel, getCollarModelList, updateCollarModel, deleteCollarModel } from '@/api/collarModel'
export default {
  name: 'CollarModel',
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
        name: '',
        len: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '型号名称不能为空', trigger: 'blur' }],
        len: [{ required: true, message: '型号数量必须大于0', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCollarModelList({}).then(response => {
        if (response.code === 1) {
          this.list = response.data
          this.total = response.data.length
        } else {
          this.showError(response.msg || '获取项圈型号列表失败')
        }
        this.listLoading = false
      }).catch(() => {
        this.showError('获取项圈型号列表失败')
        this.listLoading = false
      })
    },

    resetTemp() {
      this.temp = {
        name: '',
        len: 0
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
          createCollarModel(this.temp).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建项圈型号成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.showError(response.msg || '创建项圈型号失败')
            }
          }).catch(() => {
            this.showError('创建项圈型号失败')
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
      if (isFastClick()) return
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateCollarModel(this.temp).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '更新项圈型号成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.showError(response.msg || '更新项圈型号失败')
            }
          }).catch(() => {
            this.showError('更新项圈型号失败')
          })
        }
      })
    },

    handleDelete(row) {
      this.$confirm('确定要删除该项圈型号吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(' del id : ' + row.id)
        const obj = {
          id: row.id
        }

        deleteCollarModel(obj).then(response => {
          if (response.code === 1) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除项圈型号成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.showError(response.msg || '删除项圈型号失败')
          }
        }).catch(() => {
          this.showError('删除项圈型号失败')
        })
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
</style>
