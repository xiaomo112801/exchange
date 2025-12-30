<script setup lang="ts">
definePage({
  name: 'userAbout',
  style: {
    navigationBarTitleText: '关于我们',
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

// 应用信息
const appInfo = ref({
  name: 'BitArk',
  version: '6.0.5',
  build: '20250101',
})

// 关于信息列表
const aboutList = ref([
  {
    title: '官方网站',
    subtitle: 'www.bitark.com',
    icon: 'link',
    path: '',
  },
  {
    title: '用户协议',
    subtitle: '',
    icon: 'document',
    path: 'material-symbols:news-outline',
  },
  {
    title: '隐私政策',
    subtitle: '',
    icon: 'lock',
    path: '',
  },
  {
    title: '检查更新',
    subtitle: '当前版本 6.0.5',
    icon: 'refresh1',
    path: '',
  },
])

// 处理点击
function handleClick(item: any) {
  if (item.path) {
    navigateTo({ name: item.path })
  }
  else {
    console.log(`进入${item.title}`)
  }
}
</script>

<template>
  <view class="about-page min-h-screen w-full flex flex-col bg-white">
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
    </wd-navbar>

    <!-- 主要内容区域 -->
    <view class="flex flex-1 flex-col items-center px-4 py-8">
      <!-- Logo -->
      <view class="mb-6 h-24 w-24 flex items-center justify-center rounded-full from-blue-400 to-blue-600 bg-gradient-to-br">
        <wd-text text="BA" size="2rem" color="#fff" :bold="true" />
      </view>

      <!-- 应用名称 -->
      <wd-text :text="appInfo.name" size="1.5rem" color="#000" :bold="true" class="mb-2" />

      <!-- 版本信息 -->
      <wd-text :text="`版本 ${appInfo.version}`" size="0.9rem" color="#666" class="mb-8" />

      <!-- 关于信息列表 -->
      <view class="w-full">
        <view
          v-for="(item, index) in aboutList"
          :key="index"
          class="flex items-center justify-between border-b border-gray-100 py-4"
          @click="handleClick(item)"
        >
          <view class="flex items-center gap-3">
            <wd-icon :name="item.icon" size="1.2rem" color="#000" />
            <wd-text :text="item.title" size="0.95rem" color="#000" />
          </view>
          <view class="flex items-center gap-2">
            <wd-text
              v-if="item.subtitle"
              :text="item.subtitle"
              size="0.85rem"
              color="#666"
            />
            <wd-icon name="arrow-right" size="1rem" color="#999" />
          </view>
        </view>
      </view>

      <!-- 版权信息 -->
      <view class="mt-auto pb-8 text-center">
        <wd-text text="© 2025 BitArk. All rights reserved." size="0.75rem" color="#999" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.about-page {
  // 页面样式
}
</style>
