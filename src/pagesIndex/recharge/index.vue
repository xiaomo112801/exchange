<script setup lang="ts">
const router = useRouter()
const route = useRoute()

definePage({
  name: 'recharge',
  style: {
    navigationBarTitleText: '充值',
    navigationStyle: 'custom',
  },
})

// 从路由参数获取币种信息
const coinCode = computed(() => route.query?.code as string || '')
const coinIcon = computed(() => route.query?.icon as string || '')

// 如果没有币种信息，跳转到币种选择页
onMounted(() => {
  if (!coinCode.value) {
    router.push({ path: '/pagesIndex/recharge/coinSelect' })
  }
})

// 充值地址
const depositAddress = ref('8GPWgMLDtPAjAGXhFdyHbDU3y8BthXqnFXSWk1LgHbW9')

// 主网
const network = ref('Solana')

// 交易信息
const transactionInfo = ref({
  minAmount: '0.01',
  arrivalTime: '10分钟',
  confirmations: '1次',
})

// 复制地址
function handleCopyAddress() {
  uni.setClipboardData({
    data: depositAddress.value,
    success: () => {
      uni.showToast({
        title: '已复制',
        icon: 'success',
      })
    },
  })
}

// 保存并分享
function handleSaveAndShare() {
  // 保存并分享逻辑
  console.log('保存并分享')
}
</script>

<template>
  <view class="recharge-page min-h-screen flex flex-col bg-white">
    <!-- 顶部导航栏 -->
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
    >
      <template #left>
        <wd-icon name="arrow-left" size="1.25rem" color="#000" @click="router.back()" />
      </template>
      <template #title>
        <view class="flex items-center gap-2">
          <wd-img v-if="coinIcon" :src="coinIcon" width="1.5rem" height="1.5rem" mode="aspectFill" />
          <wd-text :text="`充值${coinCode}`" size="1rem" color="#000" :bold="true" />
        </view>
      </template>
      <template #right>
        <view class="flex items-center gap-3">
          <wd-icon name="help" size="1.25rem" color="#666" />
          <wd-icon name="menu" size="1.25rem" color="#666" />
        </view>
      </template>
    </wd-navbar>

    <!-- 主要内容 -->
    <view v-if="coinCode" class="flex flex-1 flex-col px-4 py-4">
      <!-- QR码 -->
      <view class="mb-4 flex flex-col items-center">
        <view class="mb-2 h-48 w-48 flex items-center justify-center rounded-lg bg-white p-4 shadow-sm">
          <image
            src="https://via.placeholder.com/200"
            mode="aspectFit"
            class="h-full w-full"
          />
        </view>
        <wd-text
          :text="`此地址只可接收 ${coinCode}`"
          size="0.75rem"
          color="#999"
        />
      </view>

      <!-- 主网选择 -->
      <view class="mb-4 flex flex-col">
        <wd-text text="主网" size="0.875rem" color="#000" class="mb-2" />
        <view class="flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2">
          <wd-text :text="network" size="0.875rem" color="#000" />
          <wd-icon name="arrow-down" size="0.875rem" color="#666" />
        </view>
      </view>

      <!-- 充值地址 -->
      <view class="mb-4 flex flex-col">
        <view class="mb-2 flex items-center justify-between">
          <wd-text text="充值地址" size="0.875rem" color="#000" />
          <wd-text text="更多>" size="0.75rem" color="#666" />
        </view>
        <view class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
          <wd-text :text="depositAddress" size="0.75rem" color="#000" class="flex-1" />
          <wd-icon name="copy" size="1rem" color="#666" @click="handleCopyAddress" />
        </view>
      </view>

      <!-- 交易信息 -->
      <view class="mb-4 flex flex-col">
        <wd-text text="交易信息" size="0.875rem" color="#000" class="mb-2" />
        <view class="flex flex-col gap-2 rounded-lg bg-white">
          <view class="flex items-center justify-between border-b border-gray-100 pb-2">
            <wd-text text="最小充值数" size="0.875rem" color="#666" />
            <wd-text :text="`${transactionInfo.minAmount} ${coinCode}`" size="0.875rem" color="#000" />
          </view>
          <view class="flex items-center justify-between border-b border-gray-100 pb-2">
            <wd-text text="到账时间" size="0.875rem" color="#666" />
            <wd-text :text="transactionInfo.arrivalTime" size="0.875rem" color="#000" />
          </view>
          <view class="flex items-center justify-between">
            <wd-text text="区块确认数" size="0.875rem" color="#666" />
            <wd-text :text="transactionInfo.confirmations" size="0.875rem" color="#000" />
          </view>
        </view>
      </view>

      <!-- 重要提示 -->
      <view class="mb-4 flex flex-col gap-2 rounded-lg bg-gray-100 px-3 py-3">
        <view class="flex items-start gap-2">
          <wd-icon name="warning" size="1rem" color="#ff9800" />
          <view class="flex flex-1 flex-col gap-1">
            <wd-text
              text="1. 到账时间一般是10分钟-60分钟,如有疑问请联系 service@hotcoin.ltd"
              size="0.75rem"
              color="#666"
            />
            <wd-text
              :text="`2. 您充值${coinCode}上述地址后,需要整个${network}网络节点的确认,为了快速到账,您可以向${network}网络支付少量的手续费。`"
              size="0.75rem"
              color="#666"
            />
          </view>
        </view>
      </view>

      <!-- 保存并分享按钮 -->
      <wd-button
        type="primary"
        block
        custom-class="save-share-btn"
        @click="handleSaveAndShare"
      >
        <wd-text text="保存并分享" size="0.875rem" color="#fff" />
      </wd-button>

      <!-- Web3钱包发送代币 -->
      <view class="mt-4 text-center">
        <wd-text text="Web3钱包发送代币" size="0.75rem" color="#999" />
      </view>
    </view>
  </view>
</template>

  <style scoped lang="scss">
  .recharge-page {
    background-color: #fff;
  }

  ::v-deep .save-share-btn {
    background-color: #000 !important;
    border: none !important;
    height: 2.75rem !important;
    border-radius: 0.5rem !important;
  }
  </style>
