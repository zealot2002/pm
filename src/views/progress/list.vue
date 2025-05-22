<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.pid" placeholder="选择项目" clearable class="filter-item" style="width: 200px" @change="handleProjectChange">
        <el-option v-for="item in projectOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      
      <el-button class="filter-item" type="primary" @click="getList">
        查询
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
          <span>{{ scope.row.modelname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="所属项目">
        <template slot-scope="scope">
          <span>{{ getProjectName(scope.row.pid) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state === 1 ? 'success' : 'warning'">
            {{ scope.row.state === 1 ? '已完成' : '未完成' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="实际完成日期">
        <template slot-scope="scope">
          <span>{{ scope.row.enddate || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="备注">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <div style="max-width: 300px;">{{ scope.row.rem || '无' }}</div>
            <div slot="reference" class="ellipsis">{{ scope.row.rem || '无' }}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="未按时完成原因">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.reason">
            <div style="max-width: 300px;">{{ scope.row.reason }}</div>
            <div slot="reference" class="ellipsis">{{ scope.row.reason }}</div>
          </el-popover>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="解决方案">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" v-if="scope.row.scheme">
            <div style="max-width: 300px;">{{ scope.row.scheme }}</div>
            <div slot="reference" class="ellipsis">{{ scope.row.scheme }}</div>
          </el-popover>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">更新进度</el-button>
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

    <!-- 更新进度对话框 -->
    <el-dialog title="更新进度" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="temp.state">
            <el-radio :label="0">未完成</el-radio>
            <el-radio :label="1">已完成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="rem">
          <el-input v-model="temp.rem" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="完成日期" prop="enddate" v-if="temp.state === 1">
          <el-date-picker v-model="temp.enddate" type="date" placeholder="选择完成日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="未完成原因" prop="reason" v-if="temp.state === 0">
          <el-input v-model="temp.reason" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="解决方案" prop="scheme" v-if="temp.state === 0">
          <el-input v-model="temp.scheme" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProgressList, updateProgress } from '@/api/progress'
import { getProjectList } from '@/api/project'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProgressList',
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
      listQuery: {
        page: 1,
        pagecount: 10,
        pid: undefined,
        eid: undefined
      },
      temp: {
        id: undefined,
        state: 0,
        rem: '',
        enddate: '',
        reason: '',
        scheme: ''
      },
      dialogFormVisible: false,
      rules: {
        state: [{ required: true, message: '请选择状态', trigger: 'change' }],
        enddate: [{ required: true, message: '完成日期不能为空', trigger: 'change', validator: this.validateEnddate }]
      }
    }
  },
  created() {
    this.getProjects()
    if (this.pid) {
      this.listQuery.pid = this.pid
    }
    this.getList()
  },
  methods: {
    validateEnddate(rule, value, callback) {
      if (this.temp.state === 1 && !value) {
        callback(new Error('完成日期不能为空'))
      } else {
        callback()
      }
    },
    
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
    
    getProjectName(id) {
      return id && this.projectMap[id] ? this.projectMap[id] : '未知项目'
    },
    
    handleProjectChange() {
      this.listQuery.page = 1
      this.getList()
    },
    
    getList() {
      this.listLoading = true
      getProgressList(this.listQuery).then(response => {
        if (response.code === 1) {
          this.list = response.data.data
          this.total = response.data.total || response.data.data.length
        } else {
          Message.error(response.msg || '获取进度列表失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取进度列表失败:', error)
        this.listLoading = false
        Message.error('获取进度列表失败')
      })
    },
    
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateProgress(tempData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              Message.success('更新成功')
              this.getList()
            } else {
              Message.error(response.msg || '更新失败')
            }
          }).catch(error => {
            console.error('更新进度失败:', error)
            Message.error('更新进度失败')
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
  max-width: 150px;
}
</style> 