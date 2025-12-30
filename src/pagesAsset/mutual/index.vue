<script setup lang="ts">
import type { CoinItem } from '../components/CoinSelector.vue'
import CoinSelector from '../components/CoinSelector.vue'

definePage({
  name: 'mutual',
  style: {
    navigationBarTitleText: '',
    navigationStyle: 'custom',
  },
})

const router = useRouter()
const toast = useGlobalToast()

// 收款方账户
const recipientAccount = ref('')

// 币种
const selectedCoin = ref<CoinItem>({
  icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
  code: 'USDT',
  name: 'Tether',
})

// 金额
const amount = ref('0')
const availableBalance = ref('6216.0001 USDT')

// 币种选择弹窗
const showCoinPopup = ref(false)

// 选择币种
function selectCoin() {
  showCoinPopup.value = true
}

// 处理币种选择
function handleCoinSelect(coin: CoinItem) {
  selectedCoin.value = coin
  showCoinPopup.value = false
}

// 关闭弹窗
function handleClosePopup() {
  showCoinPopup.value = false
}

// 全部
function selectAll() {
  // 这里应该设置为可用余额
  const balance = availableBalance.value.replace(' USDT', '').trim()
  amount.value = balance
}

// 确认划转
function handleMutualTransfer() {
  if (!recipientAccount.value) {
    toast.warning('请输入收款人账户')
    return
  }
  if (!amount.value || Number.parseFloat(amount.value) <= 0) {
    toast.warning('请输入划转金额')
    return
  }
  console.log('互转', {
    recipient: recipientAccount.value,
    coin: selectedCoin.value.code,
    amount: amount.value,
  })
  // 执行互转逻辑
}
</script>

<template>
  <view class="mutual-page min-h-screen w-full flex flex-col bg-white">
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
      <template #title />
    </wd-navbar>

    <!-- 标题 -->
    <view class="flex items-center gap-2 bg-white px-4 py-3">
      <view class="w-1 rounded-full bg-[#00c853]" style="height: 1.25rem;" />
      <wd-text text="互转" size="1.25rem" color="#000" :bold="true" />
    </view>

    <!-- 主要内容 -->
    <view class="flex flex-1 flex-col px-4 py-4">
      <!-- 收款方输入 -->
      <view class="mb-4">
        <view class="rounded-lg bg-gray-100 p-3">
          <wd-text text="收款方" size="0.875rem" color="#666" class="mb-2 block" />
          <wd-input
            v-model="recipientAccount"
            custom-class="mutual-input"
            placeholder="请输入收款人账户"
            no-border
          />
        </view>
      </view>

      <!-- 币种选择 -->
      <view class="mb-4">
        <wd-text text="币种" size="0.875rem" color="#666" class="mb-2 block" />
        <view class="coin-select-card flex items-center justify-between rounded-lg bg-gray-100 p-3" @click="selectCoin">
          <view class="flex items-center gap-2">
            <view class="h-6 w-6 flex items-center justify-center overflow-hidden rounded-full">
              <wd-img
                :src="selectedCoin.icon"
                width="1.5rem"
                height="1.5rem"
                mode="aspectFill"
                :error-icon="false"
              />
            </view>
            <wd-text :text="selectedCoin.code" size="0.875rem" color="#000" :bold="true" />
          </view>
          <wd-icon name="arrow-right" size="0.875rem" color="#666" />
        </view>
      </view>

      <!-- 金额输入 -->
      <view class="mb-4">
        <view class="mb-2 flex items-center justify-between">
          <wd-text text="金额" size="0.875rem" color="#666" />
          <wd-text :text="`可用 ${availableBalance}`" size="0.875rem" color="#666" />
        </view>
        <view class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
          <wd-input
            v-model="amount"
            custom-class="mutual-input flex-1"
            placeholder="0"
            no-border
            type="digit"
          />
          <view class="flex items-center gap-1">
            <view class="flex items-center py-1">
              <wd-text :text="selectedCoin.code" size="0.75rem" color="#000" />
            </view>
            <wd-divider vertical />
            <view class="flex items-center py-1" @click.stop="selectAll">
              <wd-text text="全部" size="0.75rem" color="#00c853" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
      <wd-button
        type="primary"
        size="large"
        block
        custom-class="mutual-btn"
        :disabled="!recipientAccount || !amount || Number.parseFloat(amount) <= 0"
        @click="handleMutualTransfer"
      >
        <wd-text text="确认划转" size="1rem" color="#fff" :bold="true" />
      </wd-button>
    </view>

    <!-- 币种选择弹窗 -->
    <wd-popup
      v-model="showCoinPopup"
      position="bottom"
      round
      radius="8px 8px 0 0"
      custom-class="coin-select-popup"
      custom-style="height: 60vh; max-height: 60vh;"
      @close="handleClosePopup"
    >
      <CoinSelector
        :selected-code="selectedCoin.code"
        @select="handleCoinSelect"
        @close="handleClosePopup"
      />
    </wd-popup>
  </view>
</template>

<style scoped lang="scss">
.mutual-page {
  padding-bottom: 5rem;
}

::v-deep .mutual-input {
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
}

::v-deep .mutual-input .wd-input__inner {
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
}

::v-deep .mutual-btn {
  height: 2.75rem !important;
  border-radius: 0.5rem !important;
  border: none !important;
  background-color: #000 !important;
}

::v-deep .mutual-btn.wd-button--primary.is-disabled {
  background-color: #e0e0e0 !important;
  color: #999 !important;
}

.coin-select-card {
  cursor: pointer;
}
</style>
