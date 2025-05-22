<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">
        添加商家
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="商家名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="商家编号">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" label="联系人">
        <template slot-scope="scope">
          <span>{{ scope.row.contact_person }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="省市区">
        <template slot-scope="scope">
          <span>{{ scope.row.province + ' ' + scope.row.city + ' ' + scope.row.district }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column width="250px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="250px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column> -->
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

    <!-- 添加/编辑商家对话框 -->
    <el-dialog :title="dialogStatus === 'create' ? '添加商家' : '编辑商家'" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="商家名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact_person">
          <el-input v-model="temp.contact_person" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>

        <el-form-item label="省市区" prop="region">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            placeholder="请选择省市区"
            filterable
            clearable
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="temp.address" type="textarea" :rows="3" />
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
import { getMerchantList, createMerchant, updateMerchant, deleteMerchant } from '@/api/merchant'
// import { getMerchantList, createMerchant, updateMerchant, deleteMerchant } from '@/mockApi/merchant'
import { Message, MessageBox } from 'element-ui'
import { isFastClick } from '@/utils/doubleClickUtil'
import chinaAreaData from 'china-area-data'
import { logAction } from '@/utils/StatisticUtil'
const options = Object.keys(chinaAreaData['86']).map(provinceCode => ({
  value: provinceCode,
  label: chinaAreaData['86'][provinceCode],
  children: Object.keys(chinaAreaData[provinceCode] || {}).map(cityCode => ({
    value: cityCode,
    label: chinaAreaData[provinceCode][cityCode],
    children: Object.keys(chinaAreaData[cityCode] || {}).map(areaCode => ({
      value: areaCode,
      label: chinaAreaData[cityCode][areaCode]
    }))
  }))
}))

export default {
  name: 'MerchantManagement',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10,
        keyword: ''
      },
      options: options,
      selectedOptions: [],
      temp: {
        id: undefined,
        name: '',
        contact_person: '',
        phone: '',
        printerSn: '',
        printerKey: '',
        address: '',
        region: {
          province: '',
          city: '',
          district: '',
          districtCode: ''
        }
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        name: [{ required: true, message: '商家名称不能为空', trigger: 'blur' }],
        contact_person: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        phone: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        region: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!value.province || !value.city || !value.district) {
              callback(new Error('请选择省市区'))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getMerchantList(this.listQuery).then(response => {
        if (response.code === 1) {
          this.list = response.data.data
          this.total = response.data.datacount
        } else {
          this.showError(response.msg)
        }
        this.listLoading = false
      }).catch(error => {
        console.error('获取商家列表失败:', error)
        this.listLoading = false
        this.showError('获取商家列表失败')
      })
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        contact_person: '',
        phone: '',
        printerSn: '',
        printerKey: '',
        address: '',
        region: {
          province: '',
          city: '',
          district: '',
          districtCode: ''
        }
      }
      this.selectedOptions = []
    },

    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    handleChange(value) {
      const provinceCode = value[0] || '' // 省编号
      const cityCode = value[1] || '' // 市编号
      const districtCode = value[2] || '' // 区编号

      const province = provinceCode ? chinaAreaData['86'][provinceCode] : '' // 省名称
      const city = cityCode ? chinaAreaData[provinceCode][cityCode] : '' // 市名称
      const district = districtCode ? chinaAreaData[cityCode][districtCode] : '' // 区名称

      this.temp.region = { province, city, district, districtCode }
    },

    createData() {
      if (isFastClick()) return
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.temp.region.province || !this.temp.region.city || !this.temp.region.district) {
            this.$message.error('请选择省市区')
            return
          }
          const { province, city, district, districtCode } = this.temp.region
          const submitData = {
            ...this.temp,
            province,
            city,
            district,
            districtCode
          }
          createMerchant(submitData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建商家成功',
                type: 'success',
                duration: 2000
              })
              logAction('创建商家', submitData)
            } else {
              this.showError(response.msg)
            }
          }).catch(error => {
            console.error('创建商家失败:', error)
            this.showError('创建商家失败')
          })
        }
      })
    },

    handleUpdate(row) {
      // 复制对象，避免修改原始数据
      this.temp = {
        ...row,
        region: {
          province: row.province || '',
          city: row.city || '',
          district: row.district || '',
          districtCode: row.districtCode || ''
        }
      }

      // 根据已有的省市区名称找到对应的 code
      let provinceCode = ''
      let cityCode = ''
      let districtCode = ''

      // 查找省 code
      if (row.province) {
        for (const code in chinaAreaData['86']) {
          if (chinaAreaData['86'][code] === row.province) {
            provinceCode = code
            break
          }
        }
      }

      // 查找市 code
      if (provinceCode && row.city && chinaAreaData[provinceCode]) {
        for (const code in chinaAreaData[provinceCode]) {
          if (chinaAreaData[provinceCode][code] === row.city) {
            cityCode = code
            break
          }
        }
      }

      // 查找区 code
      if (cityCode && row.district && chinaAreaData[cityCode]) {
        for (const code in chinaAreaData[cityCode]) {
          if (chinaAreaData[cityCode][code] === row.district) {
            districtCode = code
            break
          }
        }
      }

      this.selectedOptions = [provinceCode, cityCode, districtCode]
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.temp.region.province || !this.temp.region.city || !this.temp.region.district) {
            this.$message.error('请选择省市区')
            return
          }
          const { province, city, district, districtCode } = this.temp.region
          const tempData = {
            ...this.temp,
            province,
            city,
            district,
            districtCode
          }
          updateMerchant(tempData).then(response => {
            if (response.code === 1) {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '更新商家信息成功',
                type: 'success',
                duration: 2000
              })
              logAction('更新商家信息', tempData)
            } else {
              this.showError(response.msg)
            }
          }).catch(error => {
            console.error('更新商家信息失败:', error)
            this.showError('更新商家信息失败')
          })
        }
      })
    },

    handleDelete(row) {
      MessageBox.confirm('确认要删除该商家吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const obj = {
          id: row.id
        }
        deleteMerchant(obj).then(response => {
          if (response.code === 1) {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除商家成功',
              type: 'success',
              duration: 2000
            })
            logAction('删除商家', obj)
          } else {
            this.showError(response.msg)
          }
        }).catch(error => {
          console.error('删除商家失败:', error)
          this.showError('删除商家失败')
        })
      }).catch(() => {
        // 取消删除操作
      })
    },

    // handleUploadSuccess(response, file, fileList) {
    //   if (response.code === 1) {
    //     this.temp.license_image = response.data.url
    //     this.$notify({
    //       title: '成功',
    //       message: '上传图片成功',
    //       type: 'success',
    //       duration: 2000
    //     })
    //   } else {
    //     this.showError(response.msg || '上传图片失败')
    //   }
    // },

    // handleUploadError() {
    //   this.showError('上传图片失败')
    // },

    // beforeUpload(file) {
    //   const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
    //   const isLt2M = file.size / 1024 / 1024 < 2

    //   if (!isJPGOrPNG) {
    //     this.showError('上传图片只能是 JPG 或 PNG 格式!')
    //     return false
    //   }
    //   if (!isLt2M) {
    //     this.showError('上传图片大小不能超过 2MB!')
    //     return false
    //   }
    //   return true
    // },

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
