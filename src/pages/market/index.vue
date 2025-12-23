<script setup lang="ts">
definePage({
  name: 'market',
  style: {
    navigationBarTitleText: '市场',
  },
})
</script>

<template>
  <wd-navbar :safe-area-inset-top="true" :bordered="false" title="市场" />
  <view class="market-page min-h-screen w-full flex flex-col justify-start gap-5 bg-white">
    <view class="w-full">
      <wd-text text="市场" size="0.975rem" bold color="#000" line-height="1rem" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.market-page {
  padding: 1rem;
}
</style>
