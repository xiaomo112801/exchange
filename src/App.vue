<script setup lang="ts">
onLaunch(() => {})
</script>

<style lang="scss">
.app,
page,
body,
view {
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.page-wraper {
  min-height: calc(100vh - var(--window-top));
  box-sizing: border-box;
  background: #f9f9f9;
}

.wot-theme-dark.page-wraper {
  background: #222;
}

.wd-icon{
  background-color: transparent !important;
}

.wot-theme-dark body {
  color: #f5f5f5;
  background-color: black;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 全局隐藏横向/纵向滚动条，保留滚动功能 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

::-webkit-scrollbar-thumb {
  background: transparent;
}

* {
  -ms-overflow-style: none; /* IE 10+ */
  scrollbar-width: none; /* Firefox */
}
</style>
