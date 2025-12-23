<script setup lang="ts">
definePage({
  name: 'contract',
  style: {
    navigationBarTitleText: '合约',
  },
})
</script>

<template>
  <wd-navbar :safe-area-inset-top="true" :bordered="false" title="合约" />
  <view class="contract-page min-h-screen w-full flex flex-col justify-start gap-5 bg-white">
    <view class="w-full">
      <wd-text text="合约" size="0.975rem" bold color="#000" line-height="1rem" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.contract-page {
  padding: 1rem;
}
</style>
