<template>
  <div>
    <el-dialog
      :title="titleText"
      :visible.sync="dialogVisible"
      width="460px"
      center
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <div class="code-container">
        <div ref="codeContainer" />
        <div v-if="content" class="code-content">
          <span>{{ content }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'

export default {
  name: 'CodeScanner',
  props: {
    // 码类型: 'qrcode' 或 'barcode'
    codeType: {
      type: String,
      required: true,
      validator: value => ['qrcode', 'barcode'].includes(value)
    },
    // 码内容
    content: {
      type: String,
      required: true
    },
    // 对话框是否可见
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    titleText() {
      return this.codeType === 'qrcode' ? '二维码' : '条形码'
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.$nextTick(() => {
          this.renderCode()
        })
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
    }
  },
  methods: {
    renderCode() {
      if (!this.content) return

      const container = this.$refs.codeContainer
      if (!container) return

      // 清空容器
      container.innerHTML = ''

      if (this.codeType === 'qrcode') {
        this.renderQRCode(container)
      } else {
        this.renderBarcode(container)
      }
    },
    renderQRCode(container) {
      // 创建 canvas 元素
      const canvas = document.createElement('canvas')
      container.appendChild(canvas)

      // 生成二维码
      QRCode.toCanvas(canvas, this.content, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: 'H'
      }, (error) => {
        if (error) {
          console.error('Error generating QR code:', error)
        }
      })
    },
    renderBarcode(container) {
      // 创建 SVG 元素
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      container.appendChild(svg)

      // 生成条形码
      try {
        JsBarcode(svg, this.content, {
          format: 'CODE128',
          width: 2,
          height: 80,
          displayValue: false,
          margin: 1
        })
      } catch (error) {
        console.error('Error generating barcode:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .code-content {
    margin-top: 1px;
    font-size: 24px;
    text-align: center;
    word-break: break-all;
  }
}
</style>
