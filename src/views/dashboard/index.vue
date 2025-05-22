<template>
  <div class="dashboard-container">
    <div class="dashboard-header">交易担保后台</div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
    }
  },
  mounted() {
    // Set iframe height dynamically based on viewport
    this.adjustIframeHeight()
    // Adjust height on window resize
    window.addEventListener('resize', this.adjustIframeHeight)
  },
  beforeUnmount() {
    // Clean up event listener
    window.removeEventListener('resize', this.adjustIframeHeight)
  },
  methods: {
    adjustIframeHeight() {
      const headerHeight = document.querySelector('.dashboard-header').offsetHeight
      const windowHeight = window.innerHeight
      const iframeHeight = windowHeight - headerHeight

      const iframe = document.querySelector('.metabase-dashboard iframe')
      if (iframe) {
        iframe.style.height = `${iframeHeight}px`
      }
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-header {
  text-align: center;
  font-size: 40px;
  color: #666;
  padding: 15px 0;
  flex-shrink: 0;
}

.metabase-dashboard {
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
}

.metabase-dashboard iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
