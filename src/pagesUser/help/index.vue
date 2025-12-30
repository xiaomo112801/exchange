<script setup lang="ts">
definePage({
  name: 'userHelp',
  style: {
    navigationBarTitleText: '帮助中心',
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

// 帮助分类列表
const helpCategories = ref([
  {
    title: '常见问题',
    icon: 'help-circle',
    items: [
      '如何注册账户？',
      '如何充值？',
      '如何提现？',
      '如何交易？',
    ],
  },
  {
    title: '交易指南',
    icon: 'chart',
    items: [
      '现货交易说明',
      '合约交易说明',
      '杠杆交易说明',
    ],
  },
  {
    title: '安全指南',
    icon: 'shield',
    items: [
      '如何保护账户安全？',
      '如何设置资金密码？',
      '如何绑定谷歌验证器？',
    ],
  },
])

// 展开/收起
const expandedCategories = ref<Record<string, boolean>>({})

function toggleCategory(key: string) {
  expandedCategories.value[key] = !expandedCategories.value[key]
}
</script>

<template>
  <view class="help-page min-h-screen w-full flex flex-col bg-white">
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
        v-for="(category, index) in helpCategories"
        :key="index"
        class="mb-4 rounded-lg bg-gray-50"
      >
        <view
          class="flex items-center justify-between px-4 py-3"
          @click="toggleCategory(String(index))"
        >
          <view class="flex items-center gap-3">
            <wd-icon :name="category.icon" size="1.2rem" color="#000" />
            <wd-text :text="category.title" size="0.95rem" color="#000" :bold="true" />
          </view>
          <wd-icon
            :name="expandedCategories[String(index)] ? 'arrow-up' : 'arrow-down'"
            size="1rem"
            color="#999"
          />
        </view>
        <view v-if="expandedCategories[String(index)]" class="border-t border-gray-200">
          <view
            v-for="(item, itemIndex) in category.items"
            :key="itemIndex"
            class="border-b border-gray-100 px-4 py-3 last:border-b-0"
            @click="console.log(item)"
          >
            <wd-text :text="item" size="0.9rem" color="#666" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.help-page {
  // 页面样式
}
</style>
