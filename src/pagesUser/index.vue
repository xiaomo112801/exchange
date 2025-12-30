<script setup lang="ts">
definePage({
  name: 'userCenter',
  style: {
    navigationBarTitleText: '个人中心',
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

// 用户信息
const userInfo = ref({
  username: 'z101191791',
  uid: '101191791',
  avatar: '',
  vipLevel: 'V0',
  isVerified: false,
})

// 快捷功能列表
const quickFeatures = ref([
  {
    icon: 'star',
    title: '邀请奖励',
    path: 'invite',
  },
  {
    icon: 'gift',
    title: '福利中心',
    path: '',
  },
  {
    icon: 'wallet',
    title: '我的卡券',
    path: '',
  },
  {
    icon: 'share',
    title: '分享APP',
    path: '',
  },
])

// 设置列表
const settingsList = ref([
  {
    title: '账户安全',
    subtitle: '立即绑定',
    subtitleColor: '#00c853',
    icon: 'secured',
    path: 'userSecurity',
  },
  {
    title: '设置',
    icon: 'setting1',
    path: 'userSettings',
  },
  {
    title: '帮助中心',
    icon: 'help-circle',
    path: 'userHelp',
  },
  {
    title: '关于我们',
    subtitle: '版本 6.0.5',
    subtitleColor: '#00c853',
    showDot: true,
    icon: 'info-circle',
    path: 'userAbout',
  },
  {
    title: '退出当前帐户',
    titleColor: '#f64c3c',
    icon: 'logout',
    path: '',
  },
])

// 复制UID
function copyUID() {
  uni.setClipboardData({
    data: userInfo.value.uid,
    showToast: false,
    success: () => {
      toast.success('UID已复制')
    },
  })
}

// 处理功能点击
function handleFeatureClick(item: any) {
  if (item.path) {
    router.push({ name: item.path })
  }
}

// 处理设置项点击
function handleSettingClick(item: any) {
  if (item.path) {
    // 使用路径跳转，确保路由可用
    const pathMap: Record<string, string> = {
      userSecurity: '/pagesUser/security/index',
      userSettings: '/pagesUser/settings/index',
      userHelp: '/pagesUser/help/index',
      userAbout: '/pagesUser/about/index',
      userVerify: '/pagesUser/verify/index',
    }
    const targetPath = pathMap[item.path] || item.path
    navigateTo({ path: targetPath })
  }
  else if (item.title === '退出当前帐户') {
    // 退出登录逻辑
    uni.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 执行退出登录
          console.log('退出登录')
        }
      },
    })
  }
}

// 解锁VIP
function unlockVIP() {
  console.log('解锁VIP')
}
</script>

<template>
  <view class="user-center-page min-h-screen w-full flex flex-col bg-white">
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
          <wd-icon name="moon" size="1.25rem" color="#000" />
          <wd-icon name="headphone" size="1.25rem" color="#000" />
        </view>
      </template>
    </wd-navbar>

    <!-- 主要内容区域 -->
    <view class="flex flex-1 flex-col">
      <!-- 用户信息区域 -->
      <view class="box-border flex items-start justify-between bg-white px-4 py-5">
        <view class="flex items-start gap-3">
          <!-- 头像 -->
          <view class="relative">
            <view
              class="h-16 w-16 flex items-center justify-center rounded-full from-green-400 to-green-600 bg-gradient-to-br"
            >
              <wd-icon name="user" size="2rem" color="#fff" />
            </view>
            <!-- VIP徽章 -->
            <view class="absolute left-1/2 rounded bg-gray-400 px-1.5 py-0.5 -bottom-1 -translate-x-1/2">
              <view class="flex items-center gap-1">
                <wd-icon name="diamond" size="0.6rem" color="#fff" />
                <wd-text :text="userInfo.vipLevel" size="0.6rem" color="#fff" />
              </view>
            </view>
          </view>

          <!-- 用户信息 -->
          <view class="flex flex-col gap-1">
            <wd-text :text="userInfo.username" size="1.1rem" color="#000" :bold="true" />
            <view class="flex items-center gap-2">
              <wd-text :text="`UID:${userInfo.uid}`" size="0.85rem" color="#666" />
              <wd-icon name="copy" size="0.85rem" color="#666" @click.stop="copyUID" />
            </view>
            <!-- 未认证徽章 -->
            <view
              v-if="!userInfo.isVerified" class="w-fit flex items-center gap-0.5 rounded bg-orange-500 px-1 py-0.5"
              @click="navigateTo({ path: '/pagesUser/verify/index' })"
            >
              <wd-icon name="warning" size="0.65rem" color="#fff" />
              <wd-text text="未认证" size="0.65rem" color="#fff" />
            </view>
          </view>
        </view>

        <!-- 右箭头 -->
        <!-- <wd-icon name="arrow-right" size="1.25rem" color="#999" /> -->
      </view>

      <!-- 快捷功能 -->
      <view class="box-border flex items-center justify-around bg-white px-4 py-4">
        <view
          v-for="(item, index) in quickFeatures"
          :key="index"
          class="flex flex-col items-center gap-2"
          @click="handleFeatureClick(item)"
        >
          <view class="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
            <wd-icon :name="item.icon" size="1.5rem" color="#000" />
          </view>
          <wd-text :text="item.title" size="0.75rem" color="#000" />
        </view>
      </view>

      <!-- VIP升级横幅 -->
      <view class="mx-4 mb-4 flex items-center justify-between rounded-lg bg-gray-800 px-3 py-3">
        <view class="flex flex-1 items-center gap-3">
          <wd-text text="VIP" size="1.5rem" color="#fff" :bold="true" custom-style="font-style: oblique 15dep !important;" class="flex-shrink-0" />
          <wd-text text="VIP 升级,尽享更高折扣的交易费率" size="0.8rem" color="#fff" class="flex-1" />
        </view>
        <wd-button
          type="success"
          size="small"
          custom-class="unlock-vip-btn"
          @click="unlockVIP"
        >
          <wd-text text="解锁VIP" size="0.75rem" color="#000" />
        </wd-button>
      </view>
      <!-- 设置列表 -->
      <view class="box-border flex flex-1 flex-col bg-white px-4 py-2">
        <view
          v-for="(item, index) in settingsList"
          :key="index"
          class="flex items-center justify-between border-b border-gray-100 py-3"
          @click="handleSettingClick(item)"
        >
          <view class="flex items-center gap-3">
            <wd-icon :name="item.icon" size="1.1rem" :color="item.titleColor || '#000'" />
            <wd-text :text="item.title" size="0.95rem" :color="item.titleColor || '#000'" />
          </view>
          <view class="flex items-center gap-2">
            <view v-if="item.showDot" class="h-1.5 w-1.5 rounded-full bg-green-500" />
            <wd-text
              v-if="item.subtitle"
              :text="item.subtitle"
              size="0.85rem"
              :color="item.subtitleColor || '#666'"
            />
            <wd-icon name="arrow-right" size="1rem" color="#999" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
::v-deep .unlock-vip-btn {
  border: none !important;
  background: #fff !important;
  color: #000 !important;
  // padding: 0.08rem 0.7rem !important;
  // border-radius: 1.2rem !important;
  // height: auto !important;
  // min-width: auto !important;
  // flex-shrink: 0 !important;
}
</style>
