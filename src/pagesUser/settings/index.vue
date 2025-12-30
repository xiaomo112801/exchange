<script setup lang="ts">
definePage({
  name: 'userSettings',
  style: {
    navigationBarTitleText: '设置',
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

// 设置列表
const settingsList = ref([
  {
    title: '语言',
    subtitle: '简体中文',
    icon: 'internet',
    path: '',
  },
  {
    title: '主题',
    subtitle: '跟随系统',
    icon: 'a-precisemonitor',
    path: '',
  },
  {
    title: '消息通知',
    subtitle: '',
    icon: 'notification',
    path: '',
    hasSwitch: true,
    switchValue: true,
  },
  {
    title: '清除缓存',
    subtitle: '128MB',
    icon: 'delete1',
    path: '',
  },
])

// 处理点击
function handleClick(item: any) {
  if (item.path) {
    navigateTo({ name: item.path })
  }
  else {
    console.log(`进入${item.title}设置`)
  }
}

// 切换开关
function toggleSwitch(item: any) {
  item.switchValue = !item.switchValue
}
</script>

<template>
  <view class="settings-page min-h-screen w-full flex flex-col bg-white">
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
        v-for="(item, index) in settingsList"
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
          <wd-switch
            v-if="item.hasSwitch"
            :model-value="item.switchValue"
            @click.stop="toggleSwitch(item)"
          />
          <wd-icon v-else name="arrow-right" size="1rem" color="#999" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.settings-page {
  // 页面样式
}
</style>
