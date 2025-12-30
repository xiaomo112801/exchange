<script setup lang="ts">
definePage({
  name: 'userSecurity',
  style: {
    navigationBarTitleText: '账户安全',
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
const toast = useGlobalToast()

// 安全设置列表
const securityList = ref([
  {
    title: '登录密码',
    subtitle: '已设置',
    subtitleColor: '#00c853',
    icon: 'lock-on',
    path: '',
  },
  {
    title: '手机号',
    subtitle: '未绑定',
    subtitleColor: '#f64c3c',
    icon: 'mobile',
    path: '',
  },
  {
    title: '邮箱',
    subtitle: '未绑定',
    subtitleColor: '#f64c3c',
    icon: 'mail',
    path: '',
  },
  {
    title: '谷歌验证器',
    subtitle: '未绑定',
    subtitleColor: '#f64c3c',
    icon: 'shield',
    path: '',
  },
  {
    title: '资金密码',
    subtitle: '未设置',
    subtitleColor: '#f64c3c',
    icon: 'wallet',
    path: '',
  },
])

// 处理点击
function handleClick(item: any) {
  if (item.path) {
    navigateTo({ name: item.path })
  }
  else {
    toast.info(`进入${item.title}设置`)
  }
}
</script>

<template>
  <view class="security-page min-h-screen w-full flex flex-col bg-white">
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
    <view class="flex flex-1 flex-col px-4 py-4">
      <view
        v-for="(item, index) in securityList"
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
            :text="item.subtitle"
            size="0.85rem"
            :color="item.subtitleColor || '#666'"
          />
          <wd-icon name="arrow-right" size="1rem" color="#999" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.security-page {
  // 页面样式
}
</style>
