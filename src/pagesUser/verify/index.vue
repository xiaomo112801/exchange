<script setup lang="ts">
definePage({
  name: 'userVerify',
  style: {
    navigationBarTitleText: '账户认证',
    navigationStyle: 'custom',
    globalStyle: {
      'app-plus': {
        animationType: 'slide-in-left',
        animationDuration: 300,
      },
    },
  },
})

const router = useRouter()

// 当前选中的认证类型
const activeTab = ref<'unverified' | 'standard' | 'advanced'>('unverified')

// 权益列表
const benefits = ref([
  {
    icon: 'people',
    title: 'C2C购买&出售',
    value: '$10K每日',
    hasCheck: false,
  },
  {
    icon: 'wallet',
    title: '数字货币提现',
    value: '2BTC每日',
    hasCheck: false,
  },
  {
    icon: 'wallet',
    title: '数字货币充值',
    value: '',
    hasCheck: true,
  },
  {
    icon: 'target',
    title: '现货交易',
    value: '',
    hasCheck: true,
  },
  {
    icon: 'document',
    title: '合约交易',
    value: '',
    hasCheck: true,
  },
])

// 切换认证类型
function switchTab(type: 'unverified' | 'standard' | 'advanced') {
  activeTab.value = type
}
</script>

<template>
  <view class="verify-page min-h-screen w-full flex flex-col bg-white">
    <!-- 顶部导航栏 -->
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
      fixed
      custom-style="background-color: white !important;"
    >
      <template #left>
        <wd-icon name="arrow-left" size="1.25rem" color="#000" @click="router.back()" />
      </template>
      <template #right>
        <view class="flex items-center gap-4">
          <view class="flex items-center gap-1">
            <wd-text text="澳大利亚" size="0.85rem" color="#000" />
            <wd-icon name="arrow-down" size="0.85rem" color="#000" />
          </view>
          <wd-icon name="headphone" size="1.25rem" color="#000" />
        </view>
      </template>
    </wd-navbar>

    <!-- 主要内容区域 -->
    <view class="flex flex-1 flex-col items-center px-4 py-8">
      <!-- 认证状态图标 -->
      <view class="relative mb-4 flex items-center justify-center">
        <!-- 橙色盾牌背景 -->
        <view class="relative h-32 w-32 flex items-center justify-center rounded-full bg-orange-500">
          <wd-icon name="shield" size="4rem" color="#fff" />
          <view class="absolute inset-0 flex items-center justify-center">
            <wd-icon name="warning" size="2.5rem" color="#fff" />
          </view>
          <!-- 绿色箭头装饰（圆形） -->
          <view class="absolute h-10 w-10 flex items-center justify-center rounded-full bg-green-500 -right-1 -top-1">
            <wd-icon name="arrow-right" size="1.2rem" color="#fff" class="rotate-45" />
          </view>
          <view class="absolute h-10 w-10 flex items-center justify-center rounded-full bg-green-500 -bottom-1 -left-1">
            <wd-icon name="arrow-right" size="1.2rem" color="#fff" class="-rotate-45" />
          </view>
          <!-- 星星装饰 -->
          <view class="absolute top-1/2 h-3 w-3 rounded-full bg-white -right-5 -translate-y-1/2" />
          <view class="absolute top-1/2 h-3 w-3 rounded-full bg-white -left-5 -translate-y-1/2" />
        </view>
      </view>

      <!-- 未认证文字 -->
      <wd-text text="未认证" size="1.2rem" color="#000" :bold="true" class="mb-6" />

      <!-- 认证类型标签 -->
      <view class="mb-8 w-full flex items-center gap-2">
        <view
          class="flex-1 rounded-lg px-4 py-2 text-center"
          :class="activeTab === 'unverified' ? 'bg-gray-200' : 'bg-white'"
          @click="switchTab('unverified')"
        >
          <wd-text text="未认证" size="0.9rem" :color="activeTab === 'unverified' ? '#000' : '#999'" />
        </view>
        <view
          class="flex-1 rounded-lg px-4 py-2 text-center"
          :class="activeTab === 'standard' ? 'bg-gray-200' : 'bg-white'"
          @click="switchTab('standard')"
        >
          <wd-text text="个人标准认证" size="0.9rem" :color="activeTab === 'standard' ? '#000' : '#999'" />
        </view>
        <view
          class="flex-1 rounded-lg px-4 py-2 text-center"
          :class="activeTab === 'advanced' ? 'bg-gray-200' : 'bg-white'"
          @click="switchTab('advanced')"
        >
          <wd-text text="个人高级认证" size="0.9rem" :color="activeTab === 'advanced' ? '#000' : '#999'" />
        </view>
      </view>

      <!-- 权益列表 -->
      <view class="w-full">
        <wd-text text="您当前拥有的权益:" size="1rem" color="#000" :bold="true" class="mb-4" />
        <view class="flex flex-col gap-3">
          <view
            v-for="(item, index) in benefits"
            :key="index"
            class="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
          >
            <view class="flex items-center gap-3">
              <view class="h-10 w-10 flex items-center justify-center rounded-full bg-white">
                <wd-icon :name="item.icon" size="1.5rem" color="#000" />
              </view>
              <wd-text :text="item.title" size="0.95rem" color="#000" />
            </view>
            <view class="flex items-center gap-2">
              <wd-text v-if="item.value" :text="item.value" size="0.85rem" color="#666" />
              <wd-icon v-if="item.hasCheck" name="check" size="1rem" color="#00c853" />
            </view>
          </view>
        </view>
      </view>

      <!-- 底部企业认证链接 -->
      <view class="mt-8 w-full">
        <view class="flex items-center justify-center gap-1">
          <wd-text text="如果您是企业用户,请申请" size="0.85rem" color="#666" />
          <wd-text text="企业认证" size="0.85rem" color="#00c853" @click="console.log('企业认证')" />
          <wd-text text=">" size="0.85rem" color="#00c853" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.verify-page {
  // 页面样式
}
</style>
