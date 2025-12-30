<script setup lang="ts">
const router = useRouter()

definePage({
  name: 'notice',
  style: {
    navigationBarTitleText: '消息中心',
    navigationStyle: 'custom',
  },
})

// 导航栏高度
const navbarHeight = ref(44) // 默认高度
const instance = getCurrentInstance()

onMounted(() => {
  // 动态计算导航栏高度
  nextTick(() => {
    setTimeout(() => {
      uni.createSelectorQuery().in(instance).select('.wd-navbar').boundingClientRect((data: any) => {
        if (data) {
          navbarHeight.value = data.height
        }
      }).exec()
    }, 200)
  })
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
  {
    id: 5,
    title: '系统维护通知',
    content: '系统将于今晚22:00-24:00进行维护升级，期间可能影响部分功能使用，请提前做好准备。',
    time: '09:30:00',
    tag: '系统',
    type: 'announcement',
    isRead: true,
  },
  {
    id: 6,
    title: 'BTC价格波动提醒',
    content: 'BTC价格在短时间内上涨超过5%，当前价格为 $92,500，请注意风险控制。',
    time: '09:15:23',
    tag: '行情',
    type: 'activity',
    isRead: false,
  },
  {
    id: 7,
    title: '新币上线公告',
    content: '新币种 LIT/USDT 已正式上线交易，前24小时交易享受手续费优惠。',
    time: '08:50:12',
    tag: '最新公告',
    type: 'announcement',
    isRead: true,
  },
  {
    id: 8,
    title: '交易手续费调整通知',
    content: '自2025年1月1日起，现货交易手续费将调整为0.1%，合约交易手续费保持不变。',
    subContent: '具体调整详情请查看官网公告',
    time: '08:30:45',
    tag: '最新公告',
    type: 'announcement',
    isRead: false,
  },
  {
    id: 9,
    title: 'ETH价格突破提醒',
    content: 'ETH价格已突破 $3,200 关口，当前价格为 $3,215，创近期新高。',
    time: '08:10:30',
    tag: '行情',
    type: 'activity',
    isRead: true,
  },
  {
    id: 10,
    title: '账户安全提醒',
    content: '检测到您的账户在异地登录，如非本人操作，请立即修改密码并联系客服。',
    time: '07:45:20',
    tag: '系统',
    type: 'announcement',
    isRead: false,
  },
  {
    id: 11,
    title: '充值到账通知',
    content: '您的 USDT 充值 1000 USDT 已到账，请查收。',
    time: '07:20:15',
    tag: '交易',
    type: 'activity',
    isRead: true,
  },
  {
    id: 12,
    title: '提现审核通过',
    content: '您的提现申请已审核通过，资金将在1-3个工作日内到账。',
    time: '06:55:40',
    tag: '交易',
    type: 'announcement',
    isRead: false,
  },
  {
    id: 13,
    title: '新功能上线',
    content: '合约交易新增止盈止损功能，帮助您更好地控制风险，提升交易体验。',
    subContent: '详情请查看使用教程',
    time: '06:30:10',
    tag: '最新公告',
    type: 'announcement',
    isRead: true,
  },
  {
    id: 14,
    title: '市场行情分析',
    content: '今日市场整体上涨，BTC、ETH等主流币种表现强劲，建议关注市场动态。',
    time: '06:00:00',
    tag: '行情',
    type: 'activity',
    isRead: false,
  },
  {
    id: 15,
    title: '活动奖励发放',
    content: '【限时交易打卡】活动奖励已发放，请前往活动中心查看。',
    time: '05:40:25',
    tag: '活动',
    type: 'activity',
    isRead: true,
  },
  {
    id: 16,
    title: '系统升级完成',
    content: '系统维护已完成，所有功能已恢复正常使用，感谢您的耐心等待。',
    time: '05:20:50',
    tag: '系统',
    type: 'announcement',
    isRead: false,
  },
  {
    id: 17,
    title: 'LTC价格提醒',
    content: 'LTC价格在短时间内波动超过3%，当前价格为 $85.20，请注意风险。',
    time: '05:00:30',
    tag: '行情',
    type: 'activity',
    isRead: true,
  },
  {
    id: 18,
    title: '新用户福利',
    content: '新用户注册即送100 USDT体验金，完成实名认证再送50 USDT，活动限时7天。',
    subContent: '活动详情请查看官网',
    time: '04:30:15',
    tag: '活动',
    type: 'activity',
    isRead: false,
  },
  {
    id: 19,
    title: '交易异常提醒',
    content: '检测到您的账户存在异常交易行为，为保障账户安全，已临时冻结部分功能。',
    time: '04:00:00',
    tag: '系统',
    type: 'announcement',
    isRead: false,
  },
  {
    id: 20,
    title: '合约爆仓提醒',
    content: '您的合约持仓已触发强制平仓，请及时关注账户余额变化。',
    time: '03:45:20',
    tag: '交易',
    type: 'announcement',
    isRead: true,
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
      fixed
      title="消息中心"
      custom-style="background-color: white !important;"
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

    <!-- 导航标签 - 固定在顶部 -->
    <view class="sticky-tabs-wrapper" :style="{ top: `${navbarHeight}px` }">
      <view class="sticky-tabs-content mx-4 flex items-center gap-4 border-b border-gray-100 bg-white">
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
    </view>

    <!-- 占位元素，避免内容被固定的 tabs 遮挡 -->
    <view class="tabs-placeholder" />

    <z-paging
      :refresher-enabled="false"
      :auto-height="true"
      :safe-area-inset-top="false"
      :fixed="false"
      refresher-default-style="none"
      refresher-background="transparent"
    >
      <!-- 通知横幅 -->
      <template #top>
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
      </template>

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
    </z-paging>
  </view>
</template>

  <style scoped lang="scss">
  .notice-page {
    background-color: #fff;
  }

  .tabs-placeholder {
    height: 3rem; // 占位高度，与 tabs 高度一致
  }

  .sticky-tabs-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 10;
    background-color: white;
  }

  .sticky-tabs-content {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  </style>
