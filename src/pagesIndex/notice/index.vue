<script setup lang="ts">
const router = useRouter()

definePage({
  name: 'notice',
  style: {
    navigationBarTitleText: '消息中心',
    navigationStyle: 'custom',
  },
})

// 导航标签
const activeTab = ref(0)
const tabs = ['全部', '公告', '系统', '行情', '交易']

// 是否显示通知横幅
const showNotificationBanner = ref(true)

// 消息列表数据
interface MessageItem {
  id: number
  title: string
  content: string
  subContent?: string
  time: string
  tag: string
  type: 'activity' | 'announcement'
  isRead?: boolean
}

const messages = ref<MessageItem[]>([
  {
    id: 1,
    title: '热门直播开播提醒',
    content: '今日热播,秦老师合约专研直播间马上开播!主播Ms-秦,快来占座解锁最新行情!',
    time: '11:58:00',
    tag: '活动',
    type: 'activity',
    isRead: false,
  },
  {
    id: 2,
    title: 'Hotcoin关于【Hotcoin 新币狂飙季(第3期):前72小时交易享双倍积分,单人最高赢$666代币空投!】活动奖励已发放的公告',
    content: 'Hotcoin举办的【Hotcoin 新币狂飙季(第3期):前72小时交易享双倍积分,单人最高赢$666代币空投!】奖励已发放',
    subContent: 'Hotcoin举办的【Hotcoin 新币狂飙季(第3期):前72小时交易享双倍积分,单人最高赢$666代币空投!】奖励已发放',
    time: '10:49:52',
    tag: '最新公告',
    type: 'announcement',
    isRead: false,
  },
  {
    id: 3,
    title: 'Hotcoin关于【限时交易打卡:单人轻松赢4,220 USDT】活动奖励已发放的公告',
    content: 'Hotcoin举办的【限时交易打卡:单人轻松赢4,220 USDT】奖励已发放',
    subContent: 'Hotcoin举办的【限时交易打卡:单人轻松赢4,220 USDT】奖励已发放',
    time: '10:45:30',
    tag: '最新公告',
    type: 'announcement',
    isRead: false,
  },
  {
    id: 4,
    title: 'Hotcoin关于【WHO空投第2期|新用户双倍拿,老用户不掉队,60,000 WHO 福利全面开放】活动奖励已发放的公告',
    content: 'Hotcoin举办的【WHO空投第2期|新用户双倍拿,老用户不掉队,60,000 WHO 福利全面开放】奖励已发放',
    subContent: 'Hotcoin举办的【WHO空投第2期|新用户双倍拿,老用户不掉队,60,000 WHO 福利全面开放】奖励已发放',
    time: '10:38:58',
    tag: '最新公告',
    type: 'announcement',
    isRead: false,
  },
])

function handleTabChange(index: number) {
  activeTab.value = index
}

function closeNotificationBanner() {
  showNotificationBanner.value = false
}

function handleMessageClick(message: MessageItem) {
  // 标记为已读
  message.isRead = true
  // 跳转到消息详情页
  router.push({
    name: 'noticeDetail',
    params: {
      id: message.id.toString(),
    },
  })
}

// 将所有未读消息标记为已读
function markAllAsRead() {
  messages.value.forEach((message) => {
    if (!message.isRead) {
      message.isRead = true
    }
  })
}
</script>

<template>
  <view class="notice-page min-h-screen flex flex-col bg-white">
    <!-- 顶部导航栏 -->
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
      title="消息中心"
    >
      <template #left>
        <wd-icon name="arrow-left" size="1.25rem" color="#000" @click="router.back()" />
      </template>
      <template #right>
        <view class="flex items-center gap-3">
          <wd-icon name="clear" size="1.25rem" color="#666" @click="markAllAsRead" />
          <wd-icon name="setting" size="1.25rem" color="#666" />
        </view>
      </template>
    </wd-navbar>

    <!-- 通知横幅 -->
    <view
      v-if="showNotificationBanner"
      class="flex items-center justify-between bg-gray-100 px-3 py-2"
    >
      <view class="flex flex-1 items-center gap-2">
        <wd-icon name="notification" size="1rem" color="#666" />
        <wd-text
          text="开启消息通知,将会收到来自手机系统的消息!"
          size="0.75rem"
          color="#666"
        />
      </view>
      <view class="flex-shrink-0" @click="closeNotificationBanner">
        <wd-icon name="close" size="0.875rem" color="#999" />
      </view>
    </view>

    <!-- 导航标签 -->
    <view class="mx-4 mt-3 flex items-center gap-4 border-b border-gray-100">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="relative pb-2"
        :class="activeTab === index ? 'border-b-2 border-[#00c853]' : ''"
        @click="handleTabChange(index)"
      >
        <wd-text
          :text="tab"
          size="0.875rem"
          :color="activeTab === index ? '#00c853' : '#666'"
          :bold="activeTab === index"
        />
      </view>
    </view>

    <!-- 消息列表 -->
    <view class="flex flex-1 flex-col px-4 py-4">
      <!-- 今日标题 -->
      <view class="mb-3">
        <wd-text text="今日" size="1rem" color="#000" :bold="true" />
      </view>

      <!-- 消息列表项 -->
      <view class="flex flex-col">
        <view
          v-for="message in messages"
          :key="message.id"
          class="flex items-start gap-3 border-b border-gray-100 py-3"
          @click="handleMessageClick(message)"
        >
          <view class="mt-1 h-2 w-2 flex-shrink-0 rounded-full" :class="message.isRead ? '' : 'bg-[#00c853]'" />

          <!-- 消息内容 -->
          <view class="min-w-0 flex flex-1 flex-col gap-1">
            <wd-text :text="message.title" size="0.875rem" color="#000" :bold="true" />
            <wd-text :text="message.content" size="0.75rem" color="#666" />
            <wd-text
              v-if="message.subContent"
              :text="message.subContent"
              size="0.7rem"
              color="#999"
              class="mt-1"
            />
            <view class="mt-1 flex items-center gap-2">
              <wd-text :text="message.time" size="0.7rem" color="#999" />

              <wd-text :text="message.tag" size="0.65rem" color="#666" />
            </view>
          </view>

          <!-- 右侧箭头 -->
          <view class="flex-shrink-0">
            <wd-icon name="arrow-right" size="0.875rem" color="#999" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

  <style scoped lang="scss">
  .notice-page {
    background-color: #fff;
  }
  </style>
