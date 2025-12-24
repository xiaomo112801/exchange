<script setup lang="ts">
definePage({
  name: 'invite',
  style: {
    navigationBarTitleText: '邀请好友',
    navigationStyle: 'custom',
  },
})

const router = useRouter()
const toast = useGlobalToast()

// 返佣通知列表
const rebateNotifications = ref([
  '****766Y 获得现货返佣 U.00001696 LCT',
  '****1816 获得现货返佣 0.105418 USDT',
  '****1234 获得合约返佣 0.523456 USDT',
  '****5678 获得现货返佣 0.234567 BTC',
])

// 当前显示的返佣通知索引
const currentNotificationIndex = ref(0)

// 自动滚动返佣通知
let notificationTimer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  notificationTimer = setInterval(() => {
    currentNotificationIndex.value = (currentNotificationIndex.value + 1) % rebateNotifications.value.length
  }, 3000)
})

onUnmounted(() => {
  if (notificationTimer) {
    clearInterval(notificationTimer)
  }
})

// 邀请链接
const inviteLink = ref('https://m.hotcoinv5.com/register?hotcoinid=1&icCode=a608106f')
const overseasLink = ref('https://m.hotcoin.com/register?hotcoinid=1&icCode=a608106f')

// 复制链接
function copyLink(link: string) {
  uni.setClipboardData({
    data: link,
    showToast: false,
    success: () => {
      toast.success('链接已复制')
    },
  })
}

// 我的邀请统计数据
const inviteStats = ref({
  totalRebate: '0.0000', // 累计返佣(USDT)
  totalContractRebate: '0.0000', // 累计合约返佣(USDT)
  totalInvited: '0', // 累计邀请人数
})

// 立即邀请
function handleInvite() {
  // 可以跳转到分享页面或显示二维码
  console.log('立即邀请')
}

// 显示二维码
function showQRCode() {
  // 可以显示二维码弹窗
  console.log('显示二维码')
}
</script>

<template>
  <view class="invite-page min-h-screen w-full flex flex-col bg-gray-50">
    <!-- 顶部导航栏 -->
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
      fixed
      custom-style="background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%) !important;"
      custom-class="invite-navbar"
    >
      <template #left>
        <wd-icon name="arrow-left" size="1.25rem" color="#fff" @click="router.back()" />
      </template>
      <template #right>
        <view class="flex items-center gap-4">
          <view class="h-8 w-8 flex items-center justify-center rounded-full bg-white/20">
            <wd-icon name="help-circle" size="1rem" />
          </view>
          <view class="h-8 w-8 flex items-center justify-center rounded-full bg-white/20">
            <wd-icon name="gift" size="1rem" />
          </view>
        </view>
      </template>
    </wd-navbar>

    <!-- 主要内容区域 -->
    <view class="flex flex-1 flex-col">
      <!-- 标题和返佣信息区域 -->
      <view class="header-section relative w-full px-4 pb-4 pt-6">
        <view class="relative z-10">
          <wd-text text="邀请好友" size="1.35rem" color="#fff" :bold="true" class="mb-2 block" />
          <wd-text text="充值即可获取佣金" size="1.35rem" color="#00c853" :bold="true" class="mb-4 block" />
        </view>

        <!-- 背景装饰 -->
        <view class="absolute inset-0 overflow-hidden">
          <view class="absolute h-64 w-64 rounded-full bg-green-500/10 blur-3xl -right-20 -top-20" />
          <view class="absolute h-64 w-64 rounded-full bg-blue-500/10 blur-3xl -bottom-20 -left-20" />
        </view>
      </view>

      <!-- 如何邀请部分 -->
      <view class="how-to-invite-section relative z-20 mx-4 mb-4 rounded-xl bg-white p-4 -mt-20">
        <wd-text text="如何邀请" size="1.125rem" color="#000" :bold="true" class="mb-4 block" />

        <!-- 步骤流程图 -->
        <view class="flex items-center justify-between">
          <!-- 步骤1 -->
          <view class="flex flex-1 flex-col items-center">
            <view class="mb-2 h-12 w-12 flex items-center justify-center">
              <wd-img src="/static/images/invite_step1.png" width="100%" height="100%" />
            </view>
            <wd-text text="发送邀请给好友" size="0.75rem" color="#666" class="text-center" />
          </view>

          <!-- 箭头 -->
          <wd-img src="/static/images/arrow.png" width="1.25rem" height="1.25rem" />

          <!-- 步骤2 -->
          <view class="flex flex-1 flex-col items-center">
            <view class="mb-2 h-12 w-12 flex items-center justify-center">
              <wd-img src="/static/images/invite_step2.png" width="100%" height="100%" />
            </view>
            <wd-text text="好友注册并交易" size="0.75rem" color="#666" class="text-center" />
          </view>

          <!-- 箭头 -->
          <wd-icon name="arrow-right" size="1.25rem" color="#00c853" class="mx-2" />
          <wd-img src="/static/images/arrow.png" width="1.25rem" height="1.25rem" />
          <!-- 步骤3 -->
          <view class="flex flex-1 flex-col items-center">
            <view class="mb-2 h-12 w-12 flex items-center justify-center">
              <wd-img src="/static/images/invite_step3.png" width="100%" height="100%" />
            </view>
            <wd-text text="获得相应比例奖励" size="0.75rem" color="#666" class="text-center" />
          </view>
        </view>
      </view>

      <!-- 我的邀请链接 -->
      <view class="invite-links-section mx-4 mb-4 rounded-xl bg-white p-4">
        <!-- 我的邀请链接 -->
        <view class="mb-3">
          <view class="mb-2 flex items-center justify-between">
            <wd-text text="我的邀请链接" size="1rem" color="#000" :bold="true" />
            <view class="h-8 w-8 flex items-center justify-center rounded" @click="copyLink(inviteLink)">
              <wd-icon name="file-copy" size="1.125rem" color="#999" />
            </view>
          </view>
          <view class="rounded-lg bg-gray-50 p-3" @click="copyLink(inviteLink)">
            <wd-text :text="inviteLink" size="0.75rem" color="#666" class="break-all" />
          </view>
        </view>
      </view>

      <!-- 我的邀请统计 -->
      <view class="my-invite-section mx-4 mb-20 rounded-xl bg-white p-4">
        <view class="mb-3 flex items-center justify-between">
          <wd-text text="我的邀请" size="1.125rem" color="#000" :bold="true" />
          <wd-icon name="arrow-right" size="1.125rem" color="#999" />
        </view>

        <!-- 统计卡片 -->
        <view class="grid grid-cols-2 gap-3">
          <!-- 左侧卡片 -->
          <view class="rounded-lg bg-gray-50 p-3">
            <wd-text text="累计合约返佣(USDT)" size="0.75rem" color="#999" class="block" />
            <wd-text :text="inviteStats.totalContractRebate" size="1.125rem" color="#000" :bold="true" class="mb-2 block" />
          </view>

          <!-- 右侧卡片 -->
          <view class="rounded-lg bg-gray-50 p-3">
            <wd-text text="累计邀请人数" size="0.75rem" color="#999" class="block" />
            <wd-text :text="inviteStats.totalInvited" size="1.125rem" color="#000" :bold="true" class="mb-2 block" />
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="fixed bottom-0 left-0 right-0 z-100 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
      <wd-button
        type="success"
        size="large"
        custom-class="invite-btn"
        block
        @click="handleInvite"
      >
        <wd-text text="立即邀请" size="1rem" color="#fff" :bold="true" />
      </wd-button>
      <view class="ml-3 h-10 w-10 flex items-center justify-center border-1 border-gray-200" @click="showQRCode">
        <wd-icon name="qrcode" size="1.5rem" color="#00c853" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.invite-page {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 20%, #f5f5f5 20%);
}

.header-section {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  min-height: 12.5rem;
}

.notification-container {
  backdrop-filter: blur(0.625rem);
}

.notification-content {
  transition: transform 0.5s ease-in-out;
}

::v-deep .invite-navbar {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%) !important;
}

::v-deep .invite-navbar .wd-navbar__content {
  background: transparent !important;
}

::v-deep .invite-navbar .wd-navbar__left,
::v-deep .invite-navbar .wd-navbar__right {
  color: #fff !important;
}

::v-deep .invite-btn {
  min-width: 12.5rem !important;
  height: 2.75rem !important;
  border-radius: 0.5rem !important;
  background-color: #00c853 !important;
  flex: 1 !important;
}

::v-deep .invite-btn.wd-button--success {
  background-color: #00c853 !important;
}

::v-deep .invite-btn .wd-button__content {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
