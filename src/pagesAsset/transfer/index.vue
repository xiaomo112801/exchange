<script setup lang="ts">
import type { CoinItem } from '../components/CoinSelector.vue'
import CoinSelector from '../components/CoinSelector.vue'

definePage({
  name: 'transfer',
  style: {
    navigationBarTitleText: '划转',
    navigationStyle: 'custom',
  },
})

const router = useRouter()
const toast = useGlobalToast()

// 账户类型列表
const accountTypes = ['理财资产', '平台资产', '合约资产']

// 转账账户
const fromAccount = ref('现货账户')
const fromAccountType = ref('理财资产')
const toAccount = ref('永续合约账户')
const toAccountType = ref('合约资产')
// 是否已交换位置（控制动画最终停留状态）
const isSwapped = ref(false)

// 账户类型选择弹窗
const showAccountTypePopup = ref(false)
const selectingAccount = ref<'from' | 'to'>('from') // 当前正在选择的是"从"还是"到"

// 交换账户（带位置交换动画）
function swapAccounts() {
  const tempAccount = fromAccount.value
  const tempType = fromAccountType.value
  fromAccount.value = toAccount.value
  fromAccountType.value = toAccountType.value
  toAccount.value = tempAccount
  toAccountType.value = tempType
  // 切换位置状态，让动画从 A 状态过渡到 B 状态并停留
  isSwapped.value = !isSwapped.value
}

// 选择账户类型
function selectAccountType(type: 'from' | 'to') {
  selectingAccount.value = type
  showAccountTypePopup.value = true
}

// 处理账户类型选择
function handleAccountTypeSelect(type: string) {
  if (selectingAccount.value === 'from') {
    fromAccountType.value = type
    // 根据账户类型更新账户名称
    if (type === '理财资产') {
      fromAccount.value = '现货账户'
    }
    else if (type === '平台资产') {
      fromAccount.value = '平台账户'
    }
    else if (type === '合约资产') {
      fromAccount.value = '永续合约账户'
    }
  }
  else {
    toAccountType.value = type
    // 根据账户类型更新账户名称
    if (type === '理财资产') {
      toAccount.value = '现货账户'
    }
    else if (type === '平台资产') {
      toAccount.value = '平台账户'
    }
    else if (type === '合约资产') {
      toAccount.value = '永续合约账户'
    }
  }
  showAccountTypePopup.value = false
}

// 关闭账户类型弹窗
function handleCloseAccountTypePopup() {
  showAccountTypePopup.value = false
}

// 币种
const selectedCoin = ref<CoinItem>({
  icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
  code: 'USDT',
  name: 'Tether',
})

// 数量
const amount = ref('')
const availableBalance = ref('0 USDT')

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
  amount.value = '0'
}

// 立即划转
function handleTransfer() {
  if (!amount.value || Number.parseFloat(amount.value) <= 0) {
    toast.warning('请输入划转数量')
    return
  }
  console.log('划转', {
    from: fromAccount.value,
    to: toAccount.value,
    coin: selectedCoin.value.code,
    amount: amount.value,
  })
  // 执行划转逻辑
}
</script>

<template>
  <view class="transfer-page min-h-screen w-full flex flex-col bg-white">
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
      <template #right>
        <wd-icon class-prefix="custom" name="lishijilu" size="1.35rem" color="#666" @click="router.push({ path: '/pagesAsset/transfer/record' })" />
      </template>
    </wd-navbar>

    <!-- 标题 -->
    <view class="flex items-center gap-2 bg-white px-4 py-3">
      <view class="w-1 rounded-full bg-[#00c853]" style="height: 1.25rem;" />
      <wd-text text="划转" size="1.25rem" color="#000" :bold="true" />
    </view>

    <!-- 主要内容 -->
    <view class="flex flex-1 flex-col px-4 py-4">
      <!-- 转账详情卡片 -->
      <view class="transfer-card mb-4 flex items-center justify-center rounded-lg bg-gray-100 p-4">
        <!-- 从账户 -->
        <view class="mr-4 flex flex-1 flex-col">
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <view class="h-1.5 w-1.5 rounded-full bg-black" />
              <wd-text text="从" size="0.875rem" color="#000" class="flex-shrink-0" />
              <view class="account-text-wrapper flex items-center overflow-hidden" :class="{ 'account-top-swapped': isSwapped }" @click.stop="selectAccountType('from')">
                <wd-text :text="fromAccount" size="0.875rem" color="#000" />
              </view>
            </view>
            <view class="flex items-center gap-2">
              <wd-icon name="arrow-right" size="0.875rem" color="#666" />
            </view>
          </view>

          <!-- 连接线 -->
          <view class="relative my-2 flex items-center">
            <view class="absolute bottom-0 left-0 top-0 w-px border-l border-gray-300 border-dashed" style="margin-left: 0.375rem;" />
          </view>

          <!-- 到账户 -->
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <view class="h-1.5 w-1.5 rounded-full bg-black" />
              <wd-text text="到" size="0.875rem" color="#000" class="flex-shrink-0" />
              <view class="account-text-wrapper flex items-center overflow-hidden" :class="{ 'account-bottom-swapped': isSwapped }" @click.stop="selectAccountType('to')">
                <wd-text :text="toAccount" size="0.875rem" color="#000" />
              </view>
            </view>
            <view class="flex items-center gap-2">
              <wd-icon name="arrow-right" size="0.875rem" color="#666" />
            </view>
          </view>
        </view>
        <view class="transfer-swap-btn h-6 w-6 flex items-center justify-center rounded-full bg-[#00c853]" :class="{ 'swap-rotating': isSwapped }" @click="swapAccounts">
          <wd-icon name="translate-bold" size="1rem" custom-class="rotate-90" color="#fff" />
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

      <!-- 数量输入 -->
      <view class="mb-4">
        <view class="mb-2 flex items-center justify-between">
          <wd-text text="数量" size="0.875rem" color="#666" />
          <wd-text :text="`可用 ${availableBalance}`" size="0.75rem" color="#666" />
        </view>
        <view class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
          <wd-input
            v-model="amount"
            custom-class="transfer-input flex-1"
            placeholder="请输入划转数量"
            no-border
            type="digit"
          />
          <view class="flex items-center gap-1">
            <view class="py-1" @click.stop="selectAll">
              <wd-text text="USDT" size="0.75rem" color="#000" />
            </view>
            <wd-divider vertical />
            <view class="py-1" @click.stop="selectAll">
              <wd-text text="全部" size="0.75rem" color="#00c853" />
            </view>
          </view>
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="mb-6">
        <wd-text text="今日可用 0 USDT 当前账户中没有余额," size="0.75rem" color="#666" />
        <wd-text text="立即存入加密货币" size="0.75rem" color="#00c853" class="underline" />
        <view class="mt-2 flex flex-col gap-1">
          <view class="flex items-start gap-1">
            <wd-text text="-" size="0.75rem" color="#666" />
            <wd-text text="只有将资产划转到对应账户才能进行交易" size="0.75rem" color="#666" />
          </view>
          <view class="flex items-start gap-1">
            <wd-text text="-" size="0.75rem" color="#666" />
            <wd-text text="不同账户划转不收取手续费" size="0.75rem" color="#666" />
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
        custom-class="transfer-btn"
        :disabled="!amount || Number.parseFloat(amount) <= 0"
        @click="handleTransfer"
      >
        <wd-text text="立即划转" size="1rem" color="#fff" :bold="true" />
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

    <!-- 账户类型选择弹窗 -->
    <wd-popup
      v-model="showAccountTypePopup"
      position="bottom"
      round
      radius="8px 8px 0 0"
      custom-class="account-type-popup"
      @close="handleCloseAccountTypePopup"
    >
      <view class="flex flex-col bg-white">
        <view class="border-b border-gray-100 px-4 py-3">
          <wd-text :text="selectingAccount === 'from' ? '选择转出账户类型' : '选择转入账户类型'" size="1rem" color="#000" :bold="true" />
        </view>
        <view class="flex flex-col">
          <view
            v-for="type in accountTypes"
            :key="type"
            class="flex items-center justify-between border-b border-gray-100 px-4 py-3"
            :class="{ 'bg-gray-50': (selectingAccount === 'from' ? fromAccountType : toAccountType) === type }"
            @click="handleAccountTypeSelect(type)"
          >
            <wd-text :text="type" size="0.875rem" color="#000" />
            <wd-icon
              v-if="(selectingAccount === 'from' ? fromAccountType : toAccountType) === type"
              name="check"
              size="1rem"
              color="#00c853"
            />
          </view>
        </view>
        <wd-gap height="1rem" />
      </view>
    </wd-popup>
  </view>
</template>

<style scoped lang="scss">
.transfer-page {
  padding-bottom: 5rem;
}

.transfer-card {
  position: relative;
}

.transfer-swap-btn {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.transfer-swap-btn.swap-rotating {
  transform: rotate(180deg);
}

.account-text-wrapper {
  display: inline-block;
  transition: transform 0.35s ease;
  cursor: pointer;
}

.account-top-swapped {
  transform: translateY(2.3rem);
}

.account-bottom-swapped {
  transform: translateY(-2.3rem);
}

.coin-select-card {
  cursor: pointer;
}

::v-deep .transfer-input {
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
}

::v-deep .transfer-input .wd-input__inner {
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
}

::v-deep .transfer-btn {
  height: 2.75rem !important;
  border-radius: 0.5rem !important;
  border: none !important;
  background-color: #000 !important;
}
</style>
