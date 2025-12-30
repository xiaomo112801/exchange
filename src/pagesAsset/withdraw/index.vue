<script setup lang="ts">
definePage({
  name: 'withdraw',
  style: {
    navigationBarTitleText: '提现',
    navigationStyle: 'custom',
  },
})

const router = useRouter()
const route = useRoute()
const toast = useGlobalToast()

// 币种 - 从路由参数获取或使用默认值
function getInitialCoin() {
  const query = route.query || {}
  return {
    icon: (query.icon as string) || 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/bitcoin.png',
    code: (query.code as string) || 'USDT',
    name: (query.name as string) || 'Tether',
  }
}

const selectedCoin = ref<{
  icon: string
  code: string
  name: string
}>(getInitialCoin())

// 监听路由变化，更新币种信息
watch(() => route.query, (newQuery) => {
  if (newQuery && (newQuery.code || newQuery.icon || newQuery.name)) {
    selectedCoin.value = {
      icon: (newQuery.icon as string) || selectedCoin.value.icon,
      code: (newQuery.code as string) || selectedCoin.value.code,
      name: (newQuery.name as string) || selectedCoin.value.name,
    }
  }
}, { immediate: true })

// 数量
const amount = ref('')
const availableBalance = computed(() => {
  return `0 ${selectedCoin.value?.code || 'USDT'}`
})

// 提现地址
const withdrawAddress = ref('')
const addressList = ref<string[]>([])

// 提现密码
const withdrawPassword = ref('')

// 手续费
const fee = ref('0.00')
const receiveAmount = computed(() => {
  const amt = Number.parseFloat(amount.value) || 0
  const feeAmount = Number.parseFloat(fee.value) || 0
  return (amt - feeAmount).toFixed(8).replace(/\.?0+$/, '')
})

// 选择币种
function selectCoin() {
  router.push({ path: '/pagesAsset/withdraw/coinSelect' })
}

// 全部
function selectAll() {
  // 这里应该设置为可用余额
  amount.value = '0'
}

// 选择地址
function selectAddress() {
  console.log('选择地址')
  // navigateTo({ name: 'addressList' })
}

// 添加地址
function addAddress() {
  console.log('添加地址')
  // navigateTo({ name: 'addAddress' })
}

// 立即提现
function handleWithdraw() {
  if (!amount.value || Number.parseFloat(amount.value) <= 0) {
    toast.warning('请输入提现数量')
    return
  }
  if (!withdrawAddress.value) {
    toast.warning('请选择或输入提现地址')
    return
  }
  if (!withdrawPassword.value) {
    toast.warning('请输入提现密码')
    return
  }
  console.log('提现', {
    coin: selectedCoin.value?.code || 'USDT',
    amount: amount.value,
    address: withdrawAddress.value,
    password: withdrawPassword.value,
    fee: fee.value,
    receiveAmount: receiveAmount.value,
  })
  // 执行提现逻辑
}
</script>

<template>
  <view class="withdraw-page min-h-screen w-full flex flex-col bg-white">
    <!-- 顶部导航栏 -->
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
      fixed
      title="提现"
      custom-style="background-color: white !important;"
    >
      <template #left>
        <wd-icon name="arrow-left" size="1.25rem" color="#000" @click="router.back()" />
      </template>
      <template #right>
        <wd-icon class-prefix="custom" name="lishijilu" size="1.35rem" color="#666" @click="router.push({ path: '/pagesAsset/withdraw/record' })" />
      </template>
    </wd-navbar>

    <!-- 主要内容 -->
    <view class="flex flex-1 flex-col px-4 py-4">
      <!-- 币种选择 -->
      <view class="mb-4">
        <wd-text text="币种" size="0.875rem" color="#666" class="mb-2 block" />
        <view class="coin-select-card flex items-center justify-between rounded-lg bg-gray-100 p-3" @click="selectCoin">
          <view class="flex items-center gap-2">
            <wd-img v-if="selectedCoin?.icon" :src="selectedCoin.icon" width="1.5rem" height="1.5rem" mode="aspectFill" />
            <view v-else class="h-6 w-6 flex items-center justify-center rounded-full bg-[#00c853]">
              <wd-text :text="selectedCoin?.code?.charAt(0) || 'T'" size="0.75rem" color="#fff" :bold="true" />
            </view>
            <wd-text :text="selectedCoin?.code || 'USDT'" size="0.875rem" color="#000" :bold="true" />
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
            custom-class="withdraw-input flex-1"
            placeholder="请输入提现数量"
            no-border
            type="digit"
          />
          <view class="flex items-center gap-1">
            <view class="py-1" @click.stop="selectAll">
              <wd-text :text="selectedCoin?.code || 'USDT'" size="0.75rem" color="#000" />
            </view>
            <wd-divider vertical />
            <view class="py-1" @click.stop="selectAll">
              <wd-text text="全部" size="0.75rem" color="#00c853" />
            </view>
          </view>
        </view>
      </view>

      <!-- 提现地址 -->
      <view class="mb-4">
        <view class="mb-2 flex items-center justify-between">
          <wd-text text="提现地址" size="0.875rem" color="#666" />
          <view class="flex items-center gap-1" @click="addAddress">
            <wd-icon name="add" size="0.875rem" color="#00c853" />
            <wd-text text="添加地址" size="0.75rem" color="#00c853" />
          </view>
        </view>
        <view class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
          <wd-input
            v-model="withdrawAddress"
            custom-class="withdraw-input flex-1"
            placeholder="请选择或输入提现地址"
            no-border
          />
          <view v-if="addressList.length > 0" class="py-1" @click.stop="selectAddress">
            <wd-icon name="arrow-down" size="0.875rem" color="#666" />
          </view>
        </view>
      </view>

      <!-- 提现密码 -->
      <view class="mb-4">
        <wd-text text="提现密码" size="0.875rem" color="#666" class="mb-2 block" />
        <view class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
          <wd-input
            v-model="withdrawPassword"
            custom-class="withdraw-input flex-1"
            placeholder="请输入提现密码"
            no-border
            type="password"
            password
          />
        </view>
      </view>

      <!-- 手续费和到账金额 -->
      <view class="mb-4 rounded-lg bg-gray-50 p-3">
        <view class="mb-2 flex items-center justify-between">
          <wd-text text="手续费" size="0.875rem" color="#666" />
          <wd-text :text="`${fee} ${selectedCoin?.code || 'USDT'}`" size="0.875rem" color="#000" />
        </view>
        <view class="flex items-center justify-between border-t border-gray-200 pt-2">
          <wd-text text="到账金额" size="0.875rem" color="#666" />
          <wd-text :text="`${receiveAmount} ${selectedCoin?.code || 'USDT'}`" size="0.875rem" color="#000" :bold="true" />
        </view>
      </view>

      <!-- 提示信息 -->
      <view class="mb-6">
        <view class="mb-2 flex flex-col gap-1">
          <view class="flex items-start gap-1">
            <wd-text text="-" size="0.75rem" color="#666" />
            <wd-text text="提现需要经过审核，审核通过后到账" size="0.75rem" color="#666" />
          </view>
          <view class="flex items-start gap-1">
            <wd-text text="-" size="0.75rem" color="#666" />
            <wd-text text="请确保提现地址正确，错误地址将导致资产丢失" size="0.75rem" color="#666" />
          </view>
          <view class="flex items-start gap-1">
            <wd-text text="-" size="0.75rem" color="#666" />
            <wd-text :text="`最小提现金额为 10 ${selectedCoin?.code || 'USDT'}`" size="0.75rem" color="#666" />
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
        custom-class="withdraw-btn"
        :disabled="!amount || Number.parseFloat(amount) <= 0 || !withdrawAddress || !withdrawPassword"
        @click="handleWithdraw"
      >
        <wd-text text="立即提现" size="1rem" color="#fff" :bold="true" />
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.withdraw-page {
  padding-bottom: 5rem;
}

.coin-select-card {
  cursor: pointer;
}

::v-deep .withdraw-input {
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
}

::v-deep .withdraw-input .wd-input__inner {
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
}

::v-deep .withdraw-btn {
  height: 2.75rem !important;
  border-radius: 0.5rem !important;
  border: none !important;
  background-color: #999 !important;
}

::v-deep .withdraw-btn.wd-button--primary:not(.is-disabled) {
  background-color: #000 !important;
  color: #fff !important;
}

::v-deep .withdraw-btn.wd-button--primary.is-disabled {
  background-color: #999 !important;
  color: #fff !important;
}
</style>
