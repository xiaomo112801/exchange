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

const router = useRouter()

function navigateToFood() {
  router.push({
    path: '/pagesIndex/food/index',
  })
}
</script>

<template>
  <view class="assets-page min-h-screen bg-gray-50">
    <view class="flex flex-col items-center justify-center px-4 py-8">
      <view class="mb-6 text-center">
        <wd-text text="资产" size="24px" color="#000" :bold="true" />
      </view>

      <!-- 膳食结构入口 -->
      <view
        class="mb-4 w-full max-w-sm rounded-lg bg-white p-4 shadow-sm transition-shadow active:shadow-md"
        @click="navigateToFood"
      >
        <view class="flex items-center gap-3">
          <view class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
            <wd-icon name="food" size="24px" color="#fff" />
          </view>
          <view class="flex-1">
            <wd-text text="膳食结构" size="16px" color="#000" :bold="true" />
            <wd-text text="查看膳食金字塔建议" size="12px" color="#666" class="mt-1 block" />
          </view>
          <wd-icon name="arrow-right" size="18px" color="#999" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.assets-page {
  // 页面样式
}
</style>
