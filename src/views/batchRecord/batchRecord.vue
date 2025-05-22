<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="批次规格">
        <el-select v-model="searchForm.specificationId" placeholder="请选择批次规格" clearable @change="handleSearch">
          <el-option v-for="item in specificationList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="项圈型号">
        <el-select v-model="searchForm.modelId" placeholder="请选择项圈型号" clearable @change="handleSearch">
          <el-option v-for="item in collarModelList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" multiple collapse-tags placeholder="请选择状态" @change="handleStatusChange">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="handleCreateBatch">
          创建项圈批次
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column width="120" align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="批次号">
        <template slot-scope="scope">
          <span>{{ scope.row.batchname }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="批次规格">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.specName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="批次规格数量">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.batchnum }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="项圈型号">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.typeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="140" align="center" label="项圈长度（cm）">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.specLen }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ getStatusName(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="关联商家">
        <template slot-scope="scope">
          <el-button v-if="scope.row.shname" type="text" @click="handleViewMerchant(scope.row)">
            {{ scope.row.shname }}
          </el-button>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column width="200" align="center" label="项圈数量">
        <template slot-scope="scope">
          {{ scope.row.batchnum }}
        </template>
      </el-table-column>
      <el-table-column width="240" align="center" label="操作">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: center; gap: 10px;">
            <el-button v-if="scope.row.status === 0" size="mini" type="success" @click="handleCheckIn(scope.row)">
              入库
            </el-button>
            <el-button v-if="scope.row.status === 1" size="mini" type="warning" @click="handleCheckOut(scope.row)">
              出库
            </el-button>
            <el-button size="mini" type="primary" @click="handleViewCollars(scope.row)">
              查看项圈
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 创建批次对话框 -->
    <el-dialog title="创建批次" :visible.sync="createDialogVisible">
      <el-form ref="batchForm" :model="batchForm" :rules="batchRules" label-width="120px">
        <el-form-item label="批次规格名称" prop="specificationId">
          <el-select v-model="batchForm.specificationId" placeholder="请选择批次规格">
            <el-option v-for="item in specificationList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="项圈型号名称" prop="modelId">
          <el-select v-model="batchForm.modelId" placeholder="请选择项圈型号">
            <el-option v-for="item in collarModelList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createBatch">确认</el-button>
      </div>
    </el-dialog>

    <!-- 查看项圈对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="collarsDialogVisible" width="80%">
      <div class="dialog-header" style="margin-bottom: 15px;">
        <el-button type="success" icon="el-icon-download" :loading="exportLoading" @click="exportToExcel">
          导出Excel
        </el-button>
      </div>

      <el-table v-loading="collarsLoading" :data="collarsList" border fit highlight-current-row style="width: 100%">
        <el-table-column width="120" align="center" label="批次号">
          <span>{{ currentBatch.batchname }}</span>
        </el-table-column>
        <el-table-column width="120" align="center" label="批次规格名称">
          <span>{{ currentBatch.specName }}</span>
        </el-table-column>
        <el-table-column width="120" align="center" label="项圈型号">
          <span>{{ currentBatch.typeName }}</span>
        </el-table-column>
        <el-table-column width="200" align="center" label="项圈编码">
          <template slot-scope="scope">
            <span class="clickable-code" @click="showQRCode(scope.row.code)">{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column width="140" align="center" label="项圈长度（cm）">
          <span>{{ currentBatch.specLen }}</span>
        </el-table-column>
        <el-table-column width="180" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" align="center" label="状态">
          <span>{{ getStatusName(currentBatch.status) }}</span>
        </el-table-column>
        <el-table-column width="120" align="center" label="使用状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isUsed === 1 ? 'danger' : 'success'">{{ scope.row.isUsed === 1?'已使用':'未使用' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 出库对话框 -->
    <el-dialog title="出库操作" :visible.sync="checkOutDialogVisible" width="500px">
      <el-form ref="checkOutForm" :model="checkOutForm" :rules="checkOutRules" label-width="100px">
        <el-form-item label="批次号">
          <span>{{ currentCheckOutBatch.batchname }}</span>
        </el-form-item>

        <el-form-item label="商家名称" prop="merchantId">
          <el-autocomplete
            v-model="merchantKeyword"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入商家名称搜索"
            clearable
            @select="handleSelectMerchant"
            @clear="handleClearMerchant"
          >
            <template slot-scope="{ item }">
              <div class="merchant-item">
                <span>{{ item.name }}</span>
                <span class="merchant-id">ID: {{ item.id }}</span>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkOutDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCheckOut">确定</el-button>
      </div>
    </el-dialog>

    <!-- QR Code 对话框 -->
    <code-scanner
      code-type="barcode"
      :content="currentQRCodeValue"
      :visible.sync="qrCodeDialogVisible"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { Message, MessageBox } from 'element-ui'
import { export_json_to_excel } from '@/vendor/Export2Excel'
import { isFastClick } from '@/utils/doubleClickUtil'
// 导入API函数
import { createBatches, getBatchesList, checkInBatche, checkOutBatche, getCollarList } from '@/api/batchRecord'
import { getBatchSpecification } from '@/api/batch'
import { getCollarModelList } from '@/api/collarModel'
import { getMerchantList, getMerchantInfo } from '@/api/merchant'
import CodeScanner from '@/components/CodeScanner'
import { logAction } from '@/utils/StatisticUtil'

export default {
  name: 'batchRecord',
  components: { Pagination, CodeScanner },
  filters: {
    parseTime
  },
  data() {
    return {
      // 列表数据
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },

      // 创建批次对话框
      createDialogVisible: false,
      specificationList: [], // 批次规格列表
      collarModelList: [], // 项圈型号列表
      batchForm: {
        specificationId: '', // 批次规格ID
        modelId: '' // 项圈型号ID
      },
      batchRules: {
        specificationId: [
          { required: true, message: '请选择批次规格', trigger: 'change' }
        ],
        modelId: [
          { required: true, message: '请选择项圈型号', trigger: 'change' }
        ]
      },
      searchForm: {
        status: [], // 选中的状态数组
        specificationId: '', // 批次规格ID
        modelId: '' // 项圈型号ID
      },
      statusOptions: [
        { label: '待生产', value: 0 },
        { label: '已入库', value: 1 },
        { label: '已出库', value: 2 }
      ],
      // 查看项圈对话框
      collarsDialogVisible: false,
      collarsLoading: false,
      collarsList: [],
      currentBatch: {
        status: '',
        isUsed: 0
      },
      // 导出Excel相关
      exportLoading: false,
      // 出库对话框相关
      checkOutDialogVisible: false,
      currentCheckOutBatch: {},
      merchantKeyword: '',
      merchantList: [],
      checkOutForm: {
        merchantId: ''
      },
      checkOutRules: {
        merchantId: [
          { required: true, message: '请选择商家', trigger: 'change' }
        ]
      },
      // QR Code 相关
      qrCodeDialogVisible: false,
      currentQRCodeValue: ''
    }
  },
  computed: {
    dialogTitle() {
      return `批次号： ${this.currentBatch?.batchname || '-'} ，当前批次共 ${this.collarsList.length} 个项圈`
    }
  },
  created() {
    this.getList()
    this.getSpecificationList()
    this.getCollarModelList()
  },
  methods: {
    getStatusName(status) {
      if (status === 0) {
        return '待生产'
      } else if (status === 1) {
        return '已入库'
      } else if (status === 2) {
        return '已出库'
      }
    },
    handleCreateBatch() {
      this.createDialogVisible = true
    },

    // 获取批次列表
    getList() {
      this.listLoading = true
      const params = {
        page: this.listQuery.page + '',
        size: this.listQuery.limit + '',
        status: this.searchForm.status.join(','),
        specId: this.searchForm.specificationId ? this.searchForm.specificationId + '' : '', // 批次规格ID
        typeId: this.searchForm.modelId ? this.searchForm.modelId + '' : '' // 项圈型号ID
      }

      getBatchesList(params).then(response => {
        if (response.code === 1) {
          this.list = response.data.data || []
          this.total = response.data.datacount || 0
        } else {
          this.showError(response.msg || '获取批次列表失败')
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取批次列表失败:', error)
        this.showError('获取批次列表失败')
        this.listLoading = false
      })
    },

    // 获取批次规格列表
    getSpecificationList() {
      getBatchSpecification().then(response => {
        if (response.code === 1) {
          this.specificationList = response.data || []
        } else {
          this.showError('获取批次规格列表失败')
        }
      }).catch(() => {
        this.showError('获取批次规格列表失败')
      })
    },

    // 获取项圈型号列表
    getCollarModelList() {
      getCollarModelList().then(response => {
        if (response.code === 1) {
          this.collarModelList = response.data || []
        } else {
          this.showError('获取项圈型号列表失败')
        }
      }).catch(() => {
        this.showError('获取项圈型号列表失败')
      })
    },

    // 创建批次
    createBatch() {
      if (isFastClick()) return
      this.$refs.batchForm.validate(valid => {
        if (valid) {
          const obj = {
            cggid: this.batchForm.specificationId + '',
            ctypeid: this.batchForm.modelId
          }
          createBatches(obj).then(response => {
            if (response.code === 1) {
              this.createDialogVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '成功批量创建项圈',
                type: 'success',
                duration: 2000
              })
              // 重置表单
              this.$refs.batchForm.resetFields()
              logAction('批量创建项圈', obj)
            } else {
              this.showError(response.msg || '批量创建失败')
            }
          }).catch(() => {
            this.showError('批量创建失败')
          })
        }
      })
    },
    // 显示错误信息
    showError(msg) {
      Message({
        message: msg,
        type: 'error',
        duration: 2000
      })
    },

    // 处理入库
    handleCheckIn(row) {
      MessageBox.confirm('请仔细核对货箱上的批次号，确认要入库该批次吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        checkInBatche(params).then(response => {
          if (response.code === 1) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            logAction('入库', params)
          } else {
            this.showError(response.msg || '操作失败')
          }
        }).catch(() => { })
      })
    },
    handleViewMerchant(row) {
      const params = {
        id: row.merchantsId
      }
      getMerchantInfo(params).then(response => {
        if (response.code === 1) {
          this.$alert(`商家名称：${response.data.name}<br>商家地址：${response.data.address}<br>商家联系方式：${response.data.phone}`, '商家信息', {
            dangerouslyUseHTMLString: true
          })
        } else {
          this.showError(response.msg || '获取商家信息失败')
        }
      }).catch(() => {
        this.showError('获取商家信息失败')
      })
    },
    // 处理出库
    handleCheckOut(row) {
      this.currentCheckOutBatch = row
      this.checkOutDialogVisible = true
      this.merchantKeyword = ''
      this.merchantList = []
      this.checkOutForm.merchantId = ''
    },

    // 异步搜索商家
    querySearchAsync(queryString, callback) {
      // 清除之前的定时器
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      if (queryString.length === 0) {
        callback([])
        return
      }

      // 设置新的定时器，防止频繁请求
      this.searchTimeout = setTimeout(() => {
        const params = {
          page: '1',
          size: '100',
          keyword: this.merchantKeyword
        }
        getMerchantList(params).then(response => {
          if (response.code === 1) {
            const merchants = response.data.data || []
            // 格式化数据，用于下拉显示
            const results = merchants.map(item => ({
              value: item.name,
              name: item.name,
              id: item.id
            }))
            callback(results)
          } else {
            callback([])
            this.showError(response.msg || '搜索商家失败')
          }
        }).catch(error => {
          console.error('搜索商家失败:', error)
          callback([])
          this.showError('搜索商家失败')
        })
      }, 300)
    },

    // 选择商家
    handleSelectMerchant(item) {
      this.merchantKeyword = item.name
      this.checkOutForm.merchantId = item.id
    },

    // 清除商家选择
    handleClearMerchant() {
      this.merchantKeyword = ''
      this.checkOutForm.merchantId = ''
    },

    // 确认出库
    confirmCheckOut() {
      this.$refs.checkOutForm.validate(valid => {
        if (valid) {
          const params = {
            id: this.currentCheckOutBatch.id,
            merchantId: this.checkOutForm.merchantId
          }
          checkOutBatche(params).then(response => {
            if (response.code === 1) {
              this.checkOutDialogVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '出库成功',
                type: 'success',
                duration: 2000
              })
              logAction('出库', params)
            } else {
              this.showError(response.msg || '出库失败')
            }
          }).catch(() => {
            this.showError('出库失败')
          })
        }
      })
    },

    // 查看批次中的项圈
    handleViewCollars(row) {
      this.currentBatch = Object.assign({}, row)
      this.collarsDialogVisible = true
      this.collarsLoading = true
      this.collarsList = []

      const obj = {
        id: row.id + '',
        page: '1',
        size: 'no'
      }
      getCollarList(obj).then(response => {
        if (response.code === 1) {
          this.collarsList = response.data.data || []
        } else {
          this.showError(response.msg || '获取项圈列表失败')
        }
        this.collarsLoading = false
      }).catch(error => {
        console.error('获取项圈列表失败:', error)
        this.showError('获取项圈列表失败')
        this.collarsLoading = false
      })
    },

    // 处理状态变化
    handleStatusChange() {
      this.listQuery.page = 1 // 重置页码
      this.getList()
    },

    // 搜索处理
    handleSearch() {
      this.listQuery.page = 1 // 重置页码
      this.getList()
    },

    // 导出Excel
    exportToExcel() {
      if (this.collarsList.length === 0) {
        this.showError('没有数据可导出')
        return
      }

      this.exportLoading = true

      try {
        // 准备表头 - 与对话框表格保持一致
        const tHeader = ['批次号', '批次规格名称', '项圈型号', '项圈长度（cm）', '项圈编码', '创建时间', '状态']
        // 准备数据
        const data = this.collarsList.map(item => {
          const createdTime = parseTime(item.time, '{y}-{m}-{d} {h}:{i}:{s}')

          return [
            this.currentBatch.batchname, // 批次号
            this.currentBatch.specName, // 批次规格名称
            this.currentBatch.typeName, // 项圈型号
            this.currentBatch.specLen, // 项圈长度（cm）
            item.code, // 项圈编码
            createdTime, // 创建时间
            this.getStatusName(this.currentBatch.status) // 状态
          ]
        })

        // 文件名
        const filename = `${this.currentBatch.batchname}批次项圈列表_${parseTime(new Date(), '{y}{m}{d}{h}{i}{s}')}`

        // 导出Excel
        export_json_to_excel({
          header: tHeader,
          data,
          filename,
          autoWidth: true,
          bookType: 'xlsx'
        })

        this.$notify({
          title: '成功',
          message: '导出Excel成功',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        console.error('导出Excel失败:', error)
        this.showError('导出Excel失败')
      } finally {
        this.exportLoading = false
      }
    },

    // 显示二维码
    showQRCode(batchnum) {
      this.currentQRCodeValue = batchnum
      this.qrCodeDialogVisible = true
    }
  }
}
</script>

<style scoped>
.demo-form-inline {
  margin-bottom: 20px;
}

.dialog-header {
  display: flex;
  justify-content: flex-end;
}

.merchant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.merchant-id {
  font-size: 12px;
  color: #909399;
}

.el-select {
  min-width: 200px;
  width: 100%;
}

.el-form-item {
  margin-right: 20px;
}

.el-button--text {
  padding: 0;
  color: #409EFF;
}

.el-button--text:hover {
  color: #66b1ff;
}

.clickable-code {
  cursor: pointer;
  color: #409EFF;
  text-decoration: underline;
}
</style>
