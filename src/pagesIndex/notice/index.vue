<script setup lang="ts">
const router = useRouter()

definePage({
  name: 'notice',
  style: {
    navigationBarTitleText: '公告',
    navigationStyle: 'custom',
  },
})
</script>

<template>
  <view class="notice-page">
    <wd-navbar
      :safe-area-inset-top="true"
      left-arrow
      :bordered="false"
      title="消息中心"
      @click-left="router.back()"
    />
  </view>
</template>
