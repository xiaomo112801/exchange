<script setup lang="ts">
definePage({
  name: 'feedback',
  style: {
    navigationBarTitleText: '反馈',
  },
})
</script>

<template>
  <wd-navbar :safe-area-inset-top="true" :bordered="false" title="反馈" />
  <view class="feedback-page min-h-screen w-full flex flex-col justify-start gap-5 bg-white">
    <view class="w-full">
      <wd-text text="反馈" size="0.975rem" bold color="#000" line-height="1rem" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.feedback-page {
  padding: 1rem;
}
</style>
