<script setup lang="ts">
definePage({
  name: 'trade',
  style: {
    navigationBarTitleText: '交易',
    navigationStyle: 'custom',
  },
  layout: 'tabbar',
})

const router = useRouter()

// 交易模式标签
const tradeModeTab = ref(0)
const tradeModeTabs = ['现货', '杠杆', 'C2C']

// 买入/卖出标签
const buySellTab = ref(0)
const buySellTabs = ['买入', '卖出']

// 订单类型
const orderType = ref('限价委托')

// 表单数据
const tradeForm = ref({
  price: '0.00946',
  quantity: '',
  amount: '',
  advancedLimit: false,
})

// 当前交易对
const tradingPair = ref('STABLE/USDT')
const priceChange = ref(-7.72)
const priceChangePercent = ref(-7.72)

// 可用余额
const availableBalance = ref('0 USDT')

// 订单簿数据
const orderBook = ref({
  sellOrders: [
    { price: '0.01026', quantity: '7.61K' },
    { price: '0.01000', quantity: '7.27K' },
    { price: '0.00985', quantity: '9.14K' },
    { price: '0.00965', quantity: '7.09K' },
    { price: '0.00944', quantity: '10.57K' },
  ],
  currentPrice: '0.00943',
  buyOrders: [
    { price: '0.00942', quantity: '6.35K' },
    { price: '0.00928', quantity: '7.22K' },
    { price: '0.00914', quantity: '6.86K' },
    { price: '0.00899', quantity: '8.08K' },
    { price: '0.00884', quantity: '8.93K' },
    { price: '0.00873', quantity: '6.17K' },
  ],
  buyPercent: 57,
  sellPercent: 43,
})

// 底部tab
const bottomTab = ref(0)
const bottomTabs = ['当前委托', '资产']

// 资产数据
const assets = ref({
  STABLE: {
    frozen: '0.00000000',
    available: '0.00000000',
  },
  USDT: {
    frozen: '0.000000',
    available: '0.000000',
  },
})

// 滑块值
const sliderValue = ref(0)

// 买入/卖出
function handleTrade() {
  const action = buySellTab.value === 0 ? '买入' : '卖出'
  console.log(`${action} STABLE`, tradeForm.value)
}

// 选择订单簿价格
function selectOrderPrice(price: string) {
  tradeForm.value.price = price
}
</script>

<template>
  <view class="trade-page min-h-screen w-full flex flex-col bg-white">
    <!-- 顶部导航栏 -->
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
      fixed
      custom-style="background-color: white !important;"
    >
      <template #title>
        <view class="flex items-center gap-2">
          <wd-text :text="tradingPair" size="1rem" color="#000" :bold="true" />
          <wd-icon name="arrow-down" size="0.75rem" color="#666" />
        </view>
      </template>
      <template #right>
        <view class="flex items-center gap-3">
          <wd-icon name="view" size="1.125rem" color="#666" />
          <wd-icon name="more" size="1.125rem" color="#666" />
        </view>
      </template>
    </wd-navbar>

    <!-- 主要内容 -->
    <view class="flex flex-1 flex-col overflow-hidden">
      <!-- 交易模式标签 -->
      <view class="border-b border-gray-100 bg-white px-4">
        <wd-tabs v-model="tradeModeTab" :bordered="false" custom-class="trade-mode-tabs">
          <wd-tab
            v-for="(tab, index) in tradeModeTabs"
            :key="index"
            :title="tab"
            :name="index"
          />
        </wd-tabs>
      </view>

      <!-- 价格变化显示 -->
      <view class="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-2">
        <view class="flex items-center gap-2">
          <wd-text :text="tradingPair" size="0.875rem" color="#666" />
          <wd-text
            :text="`${priceChangePercent > 0 ? '+' : ''}${priceChangePercent}%`"
            size="0.875rem"
            :color="priceChangePercent >= 0 ? '#00c853' : '#f44336'"
          />
        </view>
      </view>

      <!-- 买入/卖出和订单簿区域 -->
      <view class="flex flex-1 overflow-hidden">
        <!-- 左侧：买入/卖出表单 -->
        <view class="flex flex-1 flex-col border-r border-gray-100 bg-white">
          <!-- 买入/卖出标签 -->
          <view class="flex border-b border-gray-100">
            <view
              v-for="(tab, index) in buySellTabs"
              :key="index"
              class="flex-1 cursor-pointer border-b-2 px-4 py-3 text-center transition-colors"
              :class="buySellTab === index ? 'border-green-500 bg-green-50' : 'border-transparent'"
              @click="buySellTab = index"
            >
              <wd-text
                :text="tab"
                size="1rem"
                :color="buySellTab === index ? '#00c853' : '#666'"
                :bold="buySellTab === index"
              />
            </view>
          </view>

          <!-- 表单内容 -->
          <view class="flex-1 overflow-y-auto p-4">
            <!-- 可用余额 -->
            <view class="mb-4 flex items-center justify-between">
              <wd-text text="可用" size="0.875rem" color="#666" />
              <view class="flex items-center gap-1">
                <wd-text :text="availableBalance" size="0.875rem" color="#666" />
                <wd-icon name="add" size="0.875rem" color="#00c853" />
              </view>
            </view>

            <!-- 订单类型 -->
            <view class="mb-4">
              <wd-text text="限价委托" size="0.875rem" color="#000" class="mb-2 block" />
              <view class="flex items-center gap-1">
                <wd-text :text="orderType" size="0.875rem" color="#666" />
                <wd-icon name="info" size="0.75rem" color="#999" />
              </view>
            </view>

            <!-- 价格输入 -->
            <view class="mb-4">
              <wd-text text="价格(USDT)" size="0.875rem" color="#000" class="mb-2 block" />
              <wd-input
                v-model="tradeForm.price"
                size="large"
                custom-class="trade-input"
                placeholder="请输入价格"
              />
              <wd-text text="≈ ¥ 0.06" size="0.75rem" color="#999" class="mt-1 block" />
            </view>

            <!-- 数量输入 -->
            <view class="mb-4">
              <wd-text text="数量" size="0.875rem" color="#000" class="mb-2 block" />
              <wd-input
                v-model="tradeForm.quantity"
                size="large"
                custom-class="trade-input"
                placeholder="请输入数量"
              />
              <wd-text text="STABLE" size="0.75rem" color="#999" class="mt-1 block" />
            </view>

            <!-- 滑块 -->
            <view class="mb-4">
              <view class="relative h-2 w-full rounded-full bg-gray-200">
                <view
                  class="absolute left-0 top-0 h-full rounded-full bg-green-500 transition-all"
                  :style="{ width: `${sliderValue}%` }"
                />
                <view
                  class="absolute top-1/2 h-4 w-4 rounded-full bg-green-500 shadow-md transition-all -translate-y-1/2"
                  :style="{ left: `calc(${sliderValue}% - 0.5rem)` }"
                />
              </view>
            </view>

            <!-- 交易额输入 -->
            <view class="mb-4">
              <wd-text text="交易额" size="0.875rem" color="#000" class="mb-2 block" />
              <wd-input
                v-model="tradeForm.amount"
                size="large"
                custom-class="trade-input"
                placeholder="请输入交易额"
              />
              <wd-text text="USDT" size="0.75rem" color="#999" class="mt-1 block" />
            </view>

            <!-- 高级限价 -->
            <view class="mb-4 flex items-center">
              <wd-checkbox v-model="tradeForm.advancedLimit" />
              <wd-text text="高级限价" size="0.875rem" color="#666" class="ml-2" />
            </view>

            <!-- 买入/卖出按钮 -->
            <wd-button
              :type="buySellTab === 0 ? 'success' : 'error'"
              size="large"
              block
              custom-class="trade-btn"
              @click="handleTrade"
            >
              <wd-text
                :text="`${buySellTab === 0 ? '买入' : '卖出'} STABLE`"
                size="1rem"
                color="#fff"
                :bold="true"
              />
            </wd-button>
          </view>
        </view>

        <!-- 右侧：订单簿 -->
        <view class="w-40 flex flex-col border-l border-gray-100 bg-white">
          <view class="border-b border-gray-100 bg-gray-50 px-3 py-2">
            <view class="flex items-center justify-between">
              <wd-text text="价格 (USDT)" size="0.75rem" color="#666" />
              <wd-text text="数量 (STABLE)" size="0.75rem" color="#666" />
            </view>
          </view>

          <view class="flex-1 overflow-y-auto">
            <!-- 卖单（红色） -->
            <view
              v-for="(order, index) in orderBook.sellOrders"
              :key="`sell-${index}`"
              class="flex cursor-pointer items-center justify-between border-b border-gray-50 px-3 py-1.5 hover:bg-gray-50"
              @click="selectOrderPrice(order.price)"
            >
              <wd-text :text="order.price" size="0.75rem" color="#f44336" />
              <wd-text :text="order.quantity" size="0.75rem" color="#666" />
            </view>

            <!-- 当前价格 -->
            <view class="border-y-2 border-gray-200 bg-gray-50 px-3 py-2">
              <view class="text-center">
                <wd-text :text="orderBook.currentPrice" size="1.125rem" color="#000" :bold="true" />
                <wd-text text="≈ ¥ 0.06" size="0.75rem" color="#999" class="mt-1 block" />
              </view>
            </view>

            <!-- 买单（绿色） -->
            <view
              v-for="(order, index) in orderBook.buyOrders"
              :key="`buy-${index}`"
              class="flex cursor-pointer items-center justify-between border-b border-gray-50 px-3 py-1.5 hover:bg-gray-50"
              @click="selectOrderPrice(order.price)"
            >
              <wd-text :text="order.price" size="0.75rem" color="#00c853" />
              <wd-text :text="order.quantity" size="0.75rem" color="#666" />
            </view>
          </view>

          <!-- 市场指标 -->
          <view class="border-t border-gray-100 bg-gray-50 px-3 py-2">
            <view class="mb-2 flex items-center justify-between">
              <view class="flex-1 rounded bg-green-500/20 px-2 py-1 text-center">
                <wd-text :text="`B ${orderBook.buyPercent}%`" size="0.75rem" color="#00c853" />
              </view>
              <view class="flex-1 rounded bg-red-500/20 px-2 py-1 text-center">
                <wd-text :text="`${orderBook.sellPercent}% S`" size="0.75rem" color="#f44336" />
              </view>
            </view>
            <view class="flex items-center gap-1">
              <wd-text text="0.00001" size="0.75rem" color="#666" />
              <wd-icon name="arrow-down" size="0.625rem" color="#999" />
              <wd-icon name="menu" size="0.75rem" color="#999" />
            </view>
          </view>
        </view>
      </view>

      <!-- 底部Tab：当前委托/资产 -->
      <view class="border-t border-gray-200 bg-white">
        <wd-tabs v-model="bottomTab" :bordered="false" custom-class="bottom-tabs">
          <wd-tab
            v-for="(tab, index) in bottomTabs"
            :key="index"
            :title="tab"
            :name="index"
          >
            <template #default>
              <view class="min-h-40 p-4">
                <!-- 当前委托内容 -->
                <view v-if="bottomTab === 0" class="flex flex-col items-center justify-center py-8">
                  <wd-text text="您在此账户没有资产" size="0.875rem" color="#999" class="mb-6" />
                  <view class="flex items-center gap-6">
                    <view class="flex flex-col items-center">
                      <view class="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                        <wd-icon name="refresh1" size="1.5rem" color="#666" />
                      </view>
                      <wd-text text="充值" size="0.75rem" color="#666" />
                    </view>
                    <view class="flex flex-col items-center">
                      <view class="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                        <wd-icon name="wallet" size="1.5rem" color="#666" />
                      </view>
                      <wd-text text="买币" size="0.75rem" color="#666" />
                    </view>
                    <view class="flex flex-col items-center">
                      <view class="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                        <wd-icon name="exchange1" size="1.5rem" color="#666" />
                      </view>
                      <wd-text text="划转" size="0.75rem" color="#666" />
                    </view>
                  </view>
                </view>

                <!-- 资产内容 -->
                <view v-else class="flex flex-col">
                  <wd-text text="当前交易资产" size="0.875rem" color="#000" :bold="true" class="mb-4" />

                  <!-- STABLE资产 -->
                  <view class="mb-4">
                    <wd-text text="STABLE" size="0.875rem" color="#000" :bold="true" class="mb-2 block" />
                    <view class="flex items-center justify-between">
                      <wd-text text="冻结" size="0.75rem" color="#666" />
                      <view class="flex items-center gap-2">
                        <wd-text :text="assets.STABLE.frozen" size="0.75rem" color="#666" />
                        <wd-text text="(¥0.00)" size="0.75rem" color="#999" />
                      </view>
                    </view>
                    <view class="mt-1 flex items-center justify-between">
                      <wd-text text="可用" size="0.75rem" color="#666" />
                      <view class="flex items-center gap-2">
                        <wd-text :text="assets.STABLE.available" size="0.75rem" color="#666" />
                        <wd-text text="(¥0.00)" size="0.75rem" color="#999" />
                      </view>
                    </view>
                  </view>

                  <!-- USDT资产 -->
                  <view>
                    <wd-text text="USDT" size="0.875rem" color="#000" :bold="true" class="mb-2 block" />
                    <view class="flex items-center justify-between">
                      <wd-text text="冻结" size="0.75rem" color="#666" />
                      <view class="flex items-center gap-2">
                        <wd-text :text="assets.USDT.frozen" size="0.75rem" color="#666" />
                        <wd-text text="(¥0.00)" size="0.75rem" color="#999" />
                      </view>
                    </view>
                    <view class="mt-1 flex items-center justify-between">
                      <wd-text text="可用" size="0.75rem" color="#666" />
                      <view class="flex items-center gap-2">
                        <wd-text :text="assets.USDT.available" size="0.75rem" color="#666" />
                        <wd-text text="(¥0.00)" size="0.75rem" color="#999" />
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </template>
          </wd-tab>
        </wd-tabs>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.trade-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

::v-deep .trade-mode-tabs {
  border: none !important;
}

::v-deep .trade-mode-tabs .wd-tabs__nav {
  background-color: transparent !important;
}

::v-deep .trade-mode-tabs .wd-tabs__nav-item {
  padding: 0.75rem 1rem !important;
  color: #666 !important;
}

::v-deep .trade-mode-tabs .wd-tabs__nav-item.is-active {
  color: #000 !important;
  font-weight: bold !important;
}

::v-deep .trade-input {
  border: 1px solid #e5e5e5 !important;
  border-radius: 0.25rem !important;
}

::v-deep .trade-btn {
  height: 2.75rem !important;
  border-radius: 0.25rem !important;
}

::v-deep .trade-btn.wd-button--success {
  background-color: #00c853 !important;
}

::v-deep .trade-btn.wd-button--error {
  background-color: #f44336 !important;
}

::v-deep .bottom-tabs {
  border: none !important;
}

::v-deep .bottom-tabs .wd-tabs__nav {
  background-color: white !important;
  border-bottom: 1px solid #e5e5e5 !important;
}

::v-deep .bottom-tabs .wd-tabs__nav-item {
  padding: 0.75rem 1rem !important;
  color: #666 !important;
}

::v-deep .bottom-tabs .wd-tabs__nav-item.is-active {
  color: #000 !important;
  font-weight: bold !important;
  border-bottom: 2px solid #000 !important;
}

::v-deep .bottom-tabs .wd-tabs__content {
  max-height: 40vh;
  overflow-y: auto;
}
</style>
