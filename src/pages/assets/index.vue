<script setup lang="ts">
definePage({
  name: 'assets',
  style: {
    navigationBarTitleText: '资产',
  },
  layout: 'tabbar',
  middlewares: [
    'auth',
  ],
})
</script>

<template>
  <view class="assets-page">
    <view class="assets-page-title">
      <text>资产</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.assets-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
