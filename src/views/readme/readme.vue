<template>
  <div class="app-container">
    <div class="readme-content">
      <h2 class="title">商家项圈管理系统使用说明</h2>

      <div class="section">
        <h3>一、商家管理</h3>
        <div class="content">
          <p>管理所有合作商家的信息，确保数据的准确性和及时更新。</p>
          <p class="note">注意：一旦商家被使用，将无法进行编辑或删除。</p>
        </div>
      </div>

      <div class="section">
        <h3>二、批次规格管理</h3>
        <div class="content">
          <p>批次规格包括对外显示的名称和每个批次包含的项圈数量。</p>
          <p class="note">注意：一旦批次规格被使用，将无法进行编辑或删除。</p>
        </div>
      </div>

      <div class="section">
        <h3>三、项圈型号管理</h3>
        <div class="content">
          <p>项圈型号根据长度分为多种，例如15cm、20cm和25cm等，每种规格都有其独特的名称。</p>
          <p class="note">注意：一旦项圈型号被使用，将无法进行编辑或删除。</p>
        </div>
      </div>

      <div class="section">
        <h3>四、批次管理</h3>
        <div class="content">
          <p>在生产项圈时，系统按批次进行管理。每个批次的项圈数量可以是10个、100个等，具体数量由批次规格决定。</p>
          <p>当商家有采购需求时，系统根据项圈型号和批次规格的组合来满足需求。</p>
        </div>
      </div>

      <div class="section">
        <h3>五、操作流程</h3>
        <div class="content">
          <p>1. 录入商家信息。</p>
          <p>2. 录入批次规格信息。</p>
          <p>3. 录入项圈型号信息。</p>
          <p>4. 创建项圈批次，创建后批次状态为：<el-tag>待生产</el-tag>。</p>
          <p>5. 工厂加工项圈，将待生产的批次导出为Excel，发送给工厂进行加工。</p>
          <p>6. 收到工厂货箱后，核对批次信息并进行入库操作，状态变更为：<el-tag type="success">已入库</el-tag>。</p>
          <p>7. 根据商家的采购需求，进行项圈出库，状态变更为：<el-tag type="warning">已出库</el-tag>。</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Readme'
}
</script>

<style scoped>
.readme-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
  color: #303133;
}

.content {
  padding-left: 20px;
  color: #606266;
  line-height: 1.8;
}

.note {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
}

.el-tag {
  margin: 0 4px;
}
</style>
