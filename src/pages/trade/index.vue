<script setup lang="ts">
import PairSelector from '@/components/PairSelector.vue'

definePage({
  name: 'trade',
  style: {
    navigationBarTitleText: '交易',
    navigationStyle: 'custom',
  },
  layout: 'tabbar',
})

const router = useRouter()

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

// 买入/卖出标签
const buySellTab = ref(0)
const buySellTabs = ['买入', '卖出']

// 订单类型
const orderType = ref('限价委托')
const orderTypes = ['限价委托', '市价委托']
const showOrderTypePopup = ref(false)

// 选择订单类型
function selectOrderType(type: string) {
  orderType.value = type
  showOrderTypePopup.value = false
}

// 价格精度
const pricePrecision = ref('0.00001')
const pricePrecisionOptions = ['0.00001', '0.0001', '0.001', '0.01']
const showPricePrecisionPopup = ref(false)

// 选择价格精度
function selectPricePrecision(precision: string) {
  pricePrecision.value = precision
  showPricePrecisionPopup.value = false
}

// 根据精度获取小数位数
function getDecimalPlaces(precision: string): number {
  const precisionNum = Number.parseFloat(precision)
  if (precisionNum >= 1)
    return 0
  const str = precisionNum.toString()
  if (str.includes('e')) {
    return Math.abs(Number.parseInt(str.split('e')[1], 10))
  }
  return str.split('.')[1]?.length || 0
}

// 格式化价格，根据精度四舍五入后补零到5位小数
function formatPrice(price: string | number): string {
  const priceNum = typeof price === 'string' ? Number.parseFloat(price) : price
  if (Number.isNaN(priceNum))
    return price.toString()
  const decimalPlaces = getDecimalPlaces(pricePrecision.value)
  // 先按精度四舍五入，然后补零到5位小数
  const roundedPrice = Number.parseFloat(priceNum.toFixed(decimalPlaces))
  return roundedPrice.toFixed(5)
}

// 表单数据
const tradeForm = ref({
  price: '0.00946',
  quantity: '',
  amount: '',
})

// 当前交易对
const tradingPair = ref('STABLE/USDT')
const priceChangePercent = ref(-7.72)

// 交易对选择弹窗
const showPairPopup = ref(false)
const pairTabIndex = ref(1) // 0自选 1合约 2现货
const pairSubTabIndex = ref(0) // 0 USDT本位 1 USDC本位 2 币本位
const pairList = ref([
  { name: 'POWER', pair: 'POWER/USDT', price: '0.21037', cny: '¥ 1.48', change: '+0.25%', badge: '新币上线' },
  { name: 'BTC', pair: 'BTC/USDT', price: '92,062.4', cny: '¥ 650,890.37', change: '+3.10%' },
  { name: 'ETH', pair: 'ETH/USDT', price: '3,168.9', cny: '¥ 22,404.43', change: '+4.44%' },
  { name: 'LTC', pair: 'LTC/USDT', price: '83.82', cny: '¥ 592.61', change: '+1.98%' },
  { name: 'XRP', pair: 'XRP/USDT', price: '2.104', cny: '¥ 14.87', change: '+3.61%' },
  { name: 'ETC', pair: 'ETC/USDT', price: '13.543', cny: '¥ 95.75', change: '+2.29%' },
  { name: 'BSV', pair: 'BSV/USDT', price: '20.5', cny: '¥ 144.93', change: '+1.44%' },
  { name: 'BCH', pair: 'BCH/USDT', price: '601.74', cny: '¥ 4,254.36', change: '+1.71%' },
  { name: 'DOGE', pair: 'DOGE/USDT', price: '0.14399', cny: '¥ 1.04', change: '+3.44%' },
])

// 处理交易对选择
function handlePairSelect(item: any) {
  tradingPair.value = item.pair
  showPairPopup.value = false
  // 这里可以根据选择的交易对更新其他数据
}

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
    { price: '0.01050', quantity: '8.21K' },
    { price: '0.01075', quantity: '9.45K' },
    { price: '0.01100', quantity: '7.88K' },
    { price: '0.01125', quantity: '6.92K' },
    { price: '0.01150', quantity: '8.67K' },
    { price: '0.01175', quantity: '7.33K' },
    { price: '0.01200', quantity: '9.12K' },
  ],
  currentPrice: '0.00943',
  buyOrders: [
    { price: '0.00942', quantity: '6.35K' },
    { price: '0.00928', quantity: '7.22K' },
    { price: '0.00914', quantity: '6.86K' },
    { price: '0.00899', quantity: '8.08K' },
    { price: '0.00884', quantity: '8.93K' },
    { price: '0.00873', quantity: '6.17K' },
    { price: '0.00860', quantity: '7.45K' },
    { price: '0.00850', quantity: '8.23K' },
    { price: '0.00840', quantity: '6.78K' },
    { price: '0.00830', quantity: '9.12K' },
    { price: '0.00820', quantity: '7.89K' },
    { price: '0.00810', quantity: '8.56K' },
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

// 历史委托
function handleHistoryOrders() {
  router.push({ name: 'tradeHistory' })
}

// 选择订单簿价格
function selectOrderPrice(price: string) {
  tradeForm.value.price = price
}

// 订单显示模式：'all' 显示所有，'buy' 只显示买入，'sell' 只显示卖出
const orderDisplayMode = ref<'all' | 'buy' | 'sell'>('all')

// 切换订单显示模式
function toggleOrderDisplayMode() {
  if (orderDisplayMode.value === 'all') {
    orderDisplayMode.value = 'buy'
  }
  else if (orderDisplayMode.value === 'buy') {
    orderDisplayMode.value = 'sell'
  }
  else {
    orderDisplayMode.value = 'all'
  }
}

// 获取当前显示模式对应的 SVG 图片 URL
const orderDisplayIcon = computed(() => {
  if (orderDisplayMode.value === 'all') {
    return 'https://s2023.oss-cn-qingdao.aliyuncs.com/resource/svg/light/morenpan.svg?2.0.1765373252560'
  }
  else if (orderDisplayMode.value === 'buy') {
    return 'https://s2023.oss-cn-qingdao.aliyuncs.com/resource/svg/light/mairupan.svg?2.0.1765373252560'
  }
  else {
    return 'https://s2023.oss-cn-qingdao.aliyuncs.com/resource/svg/light/maichupan.svg?2.0.1765373252560'
  }
})

// 根据显示模式返回显示的订单列表
const displayedSellOrders = computed(() => {
  if (orderDisplayMode.value === 'sell') {
    // 只显示卖出时，显示12条
    return orderBook.value.sellOrders.slice(0, 12)
  }
  else if (orderDisplayMode.value === 'all') {
    // 显示全部时，显示6条卖出订单（总共12条，买入卖出各6条）
    return orderBook.value.sellOrders.slice(0, 6)
  }
  return []
})

const displayedBuyOrders = computed(() => {
  if (orderDisplayMode.value === 'buy') {
    // 只显示买入时，显示12条
    return orderBook.value.buyOrders.slice(0, 12)
  }
  else if (orderDisplayMode.value === 'all') {
    // 显示全部时，显示6条买入订单（总共12条，买入卖出各6条）
    return orderBook.value.buyOrders.slice(0, 6)
  }
  return []
})

// 根据显示模式动态计算grid布局类
const orderBookGridClass = computed(() => {
  if (orderDisplayMode.value === 'all') {
    // 显示全部：三行布局（卖出、价格、买入）
    return 'grid-rows-[1fr_auto_1fr]'
  }
  else if (orderDisplayMode.value === 'buy') {
    // 只显示买入：两行布局（价格、买入）
    return 'grid-rows-[auto_1fr]'
  }
  else {
    // 只显示卖出：两行布局（卖出、价格）
    return 'grid-rows-[1fr_auto]'
  }
})

const hideSliderLabel = ref(true)
function changeLabelStatus() {
  hideSliderLabel.value = !hideSliderLabel.value
}

// 输入框焦点状态 - 每个输入框独立管理
const priceFocused = ref(false)
const quantityFocused = ref(false)
const amountFocused = ref(false)

// 清除所有输入框的焦点状态
function clearAllFocus() {
  priceFocused.value = false
  quantityFocused.value = false
  amountFocused.value = false
}

function handlePriceFocus() {
  clearAllFocus()
  priceFocused.value = true
}

function handlePriceBlur() {
  priceFocused.value = false
}

function handleQuantityFocus() {
  clearAllFocus()
  quantityFocused.value = true
}

function handleQuantityBlur() {
  quantityFocused.value = false
}

function handleAmountFocus() {
  clearAllFocus()
  amountFocused.value = true
}

function handleAmountBlur() {
  amountFocused.value = false
}

// 联动计算标志，避免循环更新
const isCalculating = ref(false)

// 监听数量变化，自动计算交易额
watch(() => tradeForm.value.quantity, (newVal: string) => {
  if (isCalculating.value)
    return
  if (!newVal || !tradeForm.value.price) {
    tradeForm.value.amount = ''
    return
  }
  const quantity = Number.parseFloat(newVal)
  const price = Number.parseFloat(tradeForm.value.price)
  if (!Number.isNaN(quantity) && !Number.isNaN(price) && price > 0) {
    isCalculating.value = true
    tradeForm.value.amount = (quantity * price).toFixed(8).replace(/\.?0+$/, '')
    nextTick(() => {
      isCalculating.value = false
    })
  }
})

// 监听交易额变化，自动计算数量
watch(() => tradeForm.value.amount, (newVal: string) => {
  if (isCalculating.value)
    return
  if (!newVal || !tradeForm.value.price) {
    tradeForm.value.quantity = ''
    return
  }
  const amount = Number.parseFloat(newVal)
  const price = Number.parseFloat(tradeForm.value.price)
  if (!Number.isNaN(amount) && !Number.isNaN(price) && price > 0) {
    isCalculating.value = true
    tradeForm.value.quantity = (amount / price).toFixed(8).replace(/\.?0+$/, '')
    nextTick(() => {
      isCalculating.value = false
    })
  }
})

// 监听价格变化，如果两个值都存在，重新计算
watch(() => tradeForm.value.price, (newVal: string) => {
  if (isCalculating.value)
    return
  if (!newVal)
    return

  const price = Number.parseFloat(newVal)
  if (Number.isNaN(price) || price <= 0)
    return

  // 如果数量有值，重新计算交易额
  if (tradeForm.value.quantity) {
    const quantity = Number.parseFloat(tradeForm.value.quantity)
    if (!Number.isNaN(quantity)) {
      isCalculating.value = true
      tradeForm.value.amount = (quantity * price).toFixed(8).replace(/\.?0+$/, '')
      nextTick(() => {
        isCalculating.value = false
      })
    }
  }
  // 如果交易额有值，重新计算数量
  else if (tradeForm.value.amount) {
    const amount = Number.parseFloat(tradeForm.value.amount)
    if (!Number.isNaN(amount)) {
      isCalculating.value = true
      tradeForm.value.quantity = (amount / price).toFixed(8).replace(/\.?0+$/, '')
      nextTick(() => {
        isCalculating.value = false
      })
    }
  }
})

// 市场指标样式
const buyBarStyle = computed(() => ({
  width: `${orderBook.value.buyPercent}%`,
}))

const sellBarStyle = computed(() => ({
  width: `${orderBook.value.sellPercent}%`,
}))
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
        <wd-text text="币币交易" size="1.125rem" color="#000" :bold="true" />
      </template>
    </wd-navbar>

    <!-- 交易对和价格信息 -->
    <view
      class="trading-pair-header fixed left-0 right-0 z-10 border-b border-gray-100 bg-white px-4 py-2"
      :style="{ top: `${navbarHeight}px` }"
    >
      <view class="flex items-center justify-between">
        <view class="flex items-center gap-2" @click="showPairPopup = true">
          <view class="h-6 w-6 flex items-center justify-center">
            <wd-img src="https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/bitcoin.png" width="100%" height="100%" />
          </view>
          <wd-text :text="tradingPair" size="1rem" color="#000" :bold="true" />
          <wd-icon name="arrow-down" size="0.75rem" color="#666" />
          <wd-text
            :text="`${priceChangePercent > 0 ? '+' : ''}${priceChangePercent}%`"
            size="0.875rem"
            :color="priceChangePercent >= 0 ? '#00c853' : '#f44336'"
          />
        </view>
        <view class="flex items-center gap-3">
          <wd-icon class-prefix="custom" name="kxiantu" size="1.8rem" color="#666" @click="router.push({ name: 'coinDetail', query: { id: 1 } })" />
          <wd-icon name="more" size="1.125rem" color="#666" />
        </view>
      </view>
    </view>

    <!-- 使用 z-paging 实现滚动内容 -->
    <z-paging
      :refresher-enabled="false"
      :auto-height="true"
      :safe-area-inset-top="false"
      :fixed="false"
      refresher-default-style="none"
      refresher-background="transparent"
      class="trade-content-paging"
    >
      <!-- 占位元素，避免内容被固定的交易对头部遮挡 -->
      <view class="trading-pair-placeholder" />

      <!-- 主要内容 -->
      <view class="flex flex-col px-4">
        <!-- 买入/卖出和订单簿区域 -->
        <view class="trade-form-container flex flex-1 gap-2">
          <!-- 左侧：买入/卖出表单 -->
          <view class="min-w-0 flex flex-1 flex-col gap-3 bg-white">
            <!-- 买入/卖出标签 -->
            <view class="flex border-b border-gray-100 rounded-full bg-gray-50">
              <view
                v-for="(tab, index) in buySellTabs"
                :key="index"
                class="flex-1 cursor-pointer rounded-full px-1 py-1 text-center transition-colors"
                :class="buySellTab === index ? (index === 0 ? 'bg-[#00c853]' : 'bg-[#f44336]') : 'bg-transparent'"
                @click="buySellTab = index"
              >
                <wd-text
                  :text="tab"
                  size="0.875rem"
                  :color="buySellTab === index ? '#fff' : '#666'"
                  :bold="buySellTab === index"
                />
              </view>
            </view>

            <!-- 表单内容 -->
            <view class="flex flex-1 flex-col gap-3">
              <!-- 可用余额 -->
              <view class="flex items-center justify-between">
                <wd-text text="可用" size="0.875rem" color="#666" />
                <view class="flex items-center gap-1">
                  <wd-text :text="availableBalance" size="0.875rem" color="#666" />
                  <wd-icon name="add" size="0.575rem" color="#fff" custom-class="add-icon" />
                </view>
              </view>

              <!-- 订单类型 -->
              <view class="flex items-center justify-between rounded bg-gray-100 px-2 py-1.5" @click="showOrderTypePopup = true">
                <view class="flex flex-1 items-center gap-1">
                  <wd-text :text="orderType" size="0.875rem" color="#000" />
                  <wd-icon name="info-circle" size="0.75rem" color="#666" />
                </view>
                <wd-icon name="arrow-down" size="0.75rem" color="#666" />
              </view>

              <!-- 价格输入 -->
              <view>
                <view
                  class="trade-input-container flex items-center rounded p-1 px-2"
                  :class="priceFocused ? 'trade-input-focused' : 'bg-gray-100'"
                >
                  <view class="w-[60%] flex flex-col gap-0.5">
                    <wd-text text="价格(USDT)" size="0.775rem" color="#666" />
                    <wd-input
                      v-model="tradeForm.price"
                      custom-class="trade-input p-0"
                      :placeholder="priceFocused ? '' : '请输入价格'"
                      @focus="handlePriceFocus"
                      @blur="handlePriceBlur"
                    />
                  </view>
                  <view class="flex flex-1 items-center justify-end">
                    <wd-text text="委托价" size="0.875rem" color="#000" custom-class="whitespace-nowrap" />
                    <wd-icon name="translate-bold" size="0.875rem" color="#666" />
                  </view>
                </view>
                <wd-text text="≈ ¥ 0.06" size="0.75rem" color="#999" class="mt-1 block" />
              </view>
              <!-- 数量输入 -->
              <view>
                <view
                  class="trade-input-container flex items-center rounded p-1 px-2"
                  :class="quantityFocused ? 'trade-input-focused' : 'bg-gray-100'" style="min-height: 2rem;"
                >
                  <view :class="(quantityFocused || tradeForm.quantity) ? 'w-full' : 'w-[60%]'" class="flex flex-col justify-center gap-0.5">
                    <view v-if="quantityFocused || tradeForm.quantity" style="height: 0.775rem; line-height: 0.775rem;">
                      <wd-text text="数量" size="0.775rem" color="#666" />
                    </view>
                    <wd-input
                      v-model="tradeForm.quantity"
                      custom-class="trade-input p-0"
                      :placeholder="(quantityFocused || tradeForm.quantity) ? '' : '数量'"
                      @focus="handleQuantityFocus"
                      @blur="handleQuantityBlur"
                    />
                  </view>
                  <view v-if="!(quantityFocused || tradeForm.quantity)" class="flex flex-1 items-center justify-end">
                    <wd-text text="STABLE" size="0.875rem" color="#999" custom-class="whitespace-nowrap" />
                  </view>
                </view>
              </view>
              <!-- 滑块 -->
              <view>
                <wd-slider
                  v-model="sliderValue"
                  :min="0"
                  :max="100"
                  active-color="#00c853"
                  inactive-color="#e5e5e5"
                  :hide-label="hideSliderLabel"
                  hide-min-max
                  :dragstart="changeLabelStatus"
                  :dragend="false"
                  custom-class="changeLabelStatus"
                />
              </view>
              <!-- 交易额输入 -->
              <view>
                <view
                  class="trade-input-container flex items-center rounded p-1 px-2"
                  :class="amountFocused ? 'trade-input-focused' : 'bg-gray-100'"
                >
                  <view :class="(amountFocused || tradeForm.amount) ? 'w-full' : 'w-[60%]'" class="flex flex-col justify-center gap-0.5">
                    <view v-if="amountFocused || tradeForm.amount" style="height: 0.775rem; line-height: 0.775rem;">
                      <wd-text text="交易额" size="0.775rem" color="#666" />
                    </view>
                    <wd-input
                      v-model="tradeForm.amount"
                      custom-class="trade-input p-0"
                      :placeholder="(amountFocused || tradeForm.amount) ? '' : '交易额'"
                      @focus="handleAmountFocus"
                      @blur="handleAmountBlur"
                    />
                  </view>
                  <view v-if="!(amountFocused || tradeForm.amount)" class="flex flex-1 items-center justify-end">
                    <wd-text text="USDT" size="0.875rem" color="#999" custom-class="whitespace-nowrap" />
                  </view>
                </view>
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
          <view class="order-book-container flex flex-shrink-0 flex-col gap-2 bg-white" style="width: 8.5rem;">
            <view class="flex items-center justify-between">
              <view class="flex flex-col items-start">
                <wd-text text="价格" size="0.62rem" color="#666" />
                <wd-text text="(USDT)" size="0.62rem" color="#666" />
              </view>
              <view class="flex flex-col items-end">
                <wd-text text="数量" size="0.62rem" color="#666" align="right" />
                <wd-text text="(STABLE)" size="0.62rem" color="#666" align="right" />
              </view>
            </view>

            <view class="order-book-content grid min-h-0 flex-1 gap-2" :class="orderBookGridClass">
              <!-- 卖单区域（红色） -->
              <view v-if="orderDisplayMode === 'all' || orderDisplayMode === 'sell'" class="order-sell-list order-list-grid">
                <view
                  v-for="(order, index) in displayedSellOrders"
                  :key="`sell-${index}`"
                  class="order-item flex cursor-pointer items-center justify-between border-b border-gray-50 bg-red-50/60 hover:bg-red-50/80"
                  @click="selectOrderPrice(order.price)"
                >
                  <wd-text :text="formatPrice(order.price)" size="0.75rem" color="#f44336" />
                  <wd-text :text="order.quantity" size="0.75rem" color="#666" />
                </view>
              </view>

              <!-- 当前价格 -->
              <view class="order-price-section flex-shrink-0 border-gray-200 bg-white">
                <view class="text-left">
                  <wd-text :text="formatPrice(orderBook.currentPrice)" size="1.25rem" color="#000" :bold="true" />
                  <wd-text text="≈ ¥ 0.06" size="0.75rem" color="#999" class="mt-1 block" />
                </view>
              </view>

              <!-- 买单区域（绿色） -->
              <view v-if="orderDisplayMode === 'all' || orderDisplayMode === 'buy'" class="order-buy-list order-list-grid">
                <view
                  v-for="(order, index) in displayedBuyOrders"
                  :key="`buy-${index}`"
                  class="order-item flex cursor-pointer items-center justify-between border-b border-gray-50 bg-green-50/60 hover:bg-green-50/80"
                  @click="selectOrderPrice(order.price)"
                >
                  <wd-text :text="formatPrice(order.price)" size="0.75rem" color="#00c853" />
                  <wd-text :text="order.quantity" size="0.75rem" color="#666" />
                </view>
              </view>
            </view>

            <!-- 市场指标 -->
            <view class="flex-shrink-0 gap-1 border-t">
              <view class="mb-2 flex items-center gap-1">
                <view class="flex items-center justify-start rounded-0.5 bg-green-50/60 py-0.4 text-center" :style="buyBarStyle">
                  <view class="mr-1.5 flex items-center justify-center border border-[#00c853] rounded-0.5 border-solid px-0.5">
                    <wd-text text="B" size="0.75rem" color="#00c853" />
                  </view>
                  <wd-text :text="`${orderBook.buyPercent}%`" size="0.75rem" color="#00c853" custom-class="block border-1 border-gray-50" />
                </view>
                <view class="flex items-center justify-end rounded-0.5 bg-red-50/60 py-0.4 text-center" :style="sellBarStyle">
                  <wd-text :text="`${orderBook.sellPercent}%`" size="0.75rem" color="#f44336" />
                  <view class="ml-1.5 flex items-center justify-center border border-color-[#f44336] rounded-0.5 border-solid px-0.5">
                    <wd-text text="S" size="0.75rem" color="#f44336" />
                  </view>
                </view>
              </view>
              <view class="flex items-center justify-between gap-2">
                <view class="min-h-[1.45rem] flex flex-1 cursor-pointer items-center justify-between gap-1 rounded bg-gray-100 px-2" @click="showPricePrecisionPopup = true">
                  <wd-text :text="pricePrecision" size="0.75rem" color="#666" />
                  <wd-icon name="arrow-down" size="0.625rem" color="#999" />
                </view>
                <view class="h-[1.45rem] min-h-[1.45rem] min-w-[1.45rem] w-[1.45rem] flex cursor-pointer items-center justify-center rounded bg-gray-100" @click="toggleOrderDisplayMode">
                  <img :src="orderDisplayIcon" alt="order-display-toggle" class="h-0.75rem w-0.75rem">
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 订单类型选择弹窗 -->
        <wd-popup v-model="showOrderTypePopup" position="bottom" custom-class="order-type-popup">
          <view class="order-type-popup-content flex flex-col rounded-t-lg bg-white">
            <view class="border-b border-gray-100 px-4 py-3">
              <wd-text text="选择订单类型" size="1rem" color="#000" :bold="true" />
            </view>
            <view class="flex flex-col">
              <view
                v-for="(type, index) in orderTypes"
                :key="index"
                class="flex items-center justify-between border-b border-gray-100 px-4 py-3"
                :class="{ 'bg-gray-50': orderType === type }"
                @click="selectOrderType(type)"
              >
                <wd-text :text="type" size="0.875rem" color="#000" />
                <wd-icon v-if="orderType === type" name="check" size="1rem" color="#00c853" />
              </view>
            </view>
            <wd-gap height="1rem" />
          </view>
        </wd-popup>

        <!-- 价格精度选择弹窗 -->
        <wd-popup v-model="showPricePrecisionPopup" position="bottom" custom-class="price-precision-popup">
          <view class="price-precision-popup-content flex flex-col rounded-t-lg bg-white py-1">
            <view class="flex flex-col">
              <view
                v-for="(precision, index) in pricePrecisionOptions"
                :key="index"
                class="flex items-center justify-center border-b border-gray-100 px-4 py-5"

                @click="selectPricePrecision(precision)"
              >
                <wd-text :text="precision" size="0.875rem" :color="pricePrecision === precision ? '#00c853' : '#000'" />
              </view>
            </view>
            <view class="border-t border-gray-100 px-4 py-3">
              <wd-button type="default" block @click="showPricePrecisionPopup = false">
                <wd-text text="取消" size="0.875rem" color="#666" />
              </wd-button>
            </view>
          </view>
        </wd-popup>
        <wd-gap height="0.5rem" />
        <!-- 底部Tab：当前委托/资产 -->
        <view class="relative border-t border-gray-200 bg-white">
          <view class="bottom-tabs-wrapper flex items-center justify-between">
            <wd-tabs v-model="bottomTab" :bordered="false" custom-class="bottom-tabs">
              <wd-tab
                v-for="(tab, index) in bottomTabs"
                :key="index"
                :title="tab"
                :name="index"
              >
                <template #default>
                  <view class="min-h-40 py-4">
                    <!-- 当前委托内容 -->
                    <view v-if="bottomTab === 0" class="flex flex-col items-center justify-center py-8">
                      <wd-text text="您在此账户没有资产" size="0.875rem" color="#999" class="mb-6" />
                      <view class="flex items-center gap-6">
                        <view class="flex flex-col items-center" @click="router.push({ name: 'coinSelect' })">
                          <view class="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                            <wd-icon class-prefix="custom" name="recharge" size="1.5rem" color="#666" />
                          </view>
                          <wd-text text="充值" size="0.75rem" color="#666" />
                        </view>
                        <view class="flex flex-col items-center">
                          <view class="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                            <wd-icon name="wallet" size="1.5rem" color="#666" />
                          </view>
                          <wd-text text="买币" size="0.75rem" color="#666" />
                        </view>
                        <view class="flex flex-col items-center" @click="router.push({ name: 'transfer' })">
                          <view class="mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                            <wd-icon class-prefix="custom" name="zijinhuazhuan" size="1.5rem" color="#666" />
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
            <view class="trade-history absolute right-0 top-0 flex items-center justify-center" @click="handleHistoryOrders">
              <wd-icon class-prefix="custom" name="lishijilu" size="1.325rem" color="#666" />
            </view>
          </view>
        </view>
      </view>
    </z-paging>

    <!-- 交易对选择弹窗 -->
    <wd-popup
      v-model="showPairPopup"
      position="bottom"
      round
      radius="12px 12px 0 0"
      custom-class="pair-popup"
      custom-style="height: 65vh; max-height: 65vh;"
    >
      <PairSelector
        :active-tab="pairTabIndex"
        :active-sub-tab="pairSubTabIndex"
        :pairs="pairList"
        :selected-code="tradingPair.split('/')[0]"
        @update:active-tab="pairTabIndex = $event"
        @update:active-sub-tab="pairSubTabIndex = $event"
        @select="handlePairSelect"
      />
    </wd-popup>
  </view>
</template>

<style scoped lang="scss">
.trade-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  // overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.trade-history{
  height:var(--wot-tabs-nav-height, 42px)
}

::v-deep .add-icon {
  background-color: #00c853 !important;
  padding:0.1rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
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

::v-deep .trade-mode-tabs .wd-tabs__line {
  background-color: #00c853 !important;
}

::v-deep .trade-input {
  border: none !important;
  border-radius: 0.25rem !important;
  position: static !important;
  background-color: #f3f4f6 !important;
  // height:auto !important;
}

::v-deep .trade-input .wd-input__inner {
  border: none !important;
  border-bottom: none !important;
  background-color: #f3f4f6 !important;
  height:auto !important;
}

::v-deep .trade-input .wd-input__wrapper {
  border: none !important;
  border-bottom: none !important;
  position: static !important;
  background-color: #f3f4f6 !important;
}

::v-deep .trade-input .wd-input {
  position: static !important;
  background-color: #f3f4f6 !important;
}

::v-deep .trade-btn {
  height: 2.75rem !important;
  border-radius: 0.25rem !important;
  border: none !important;
}

::v-deep .trade-btn.wd-button--success {
  background-color: #00c853 !important;
  color: #fff !important;
}

::v-deep .trade-btn.wd-button--success .wd-button__content {
  color: #fff !important;
}

::v-deep .trade-btn.wd-button--error {
  background-color: #f44336 !important;
  color: #fff !important;
}

::v-deep .trade-btn.wd-button--error .wd-button__content {
  color: #fff !important;
}

::v-deep .trade-slider {
  height: 0.25rem !important;
}

::v-deep .trade-slider .wd-slider__track {
  height: 0.25rem !important;
  background-color: #e5e5e5 !important;
}

::v-deep .trade-slider .wd-slider__bar {
  height: 0.25rem !important;
  background-color: #00c853 !important;
}

::v-deep .trade-slider .wd-slider__button {
  width: 0.75rem !important;
  height: 0.75rem !important;
  background-color: #00c853 !important;
  border: none !important;
}

::v-deep .bottom-tabs {
  border: none !important;
  flex: 0 0 auto !important;
}

::v-deep .bottom-tabs .wd-tabs__nav {
  display: flex !important;
  align-items: center !important;
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  border-bottom: none !important;
  justify-content: flex-start !important;
}

::v-deep .bottom-tabs .wd-tabs__nav-item {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 0.5rem !important;
  flex: none !important;
  font-weight: bolder !important;
  color: #9f9f9f !important;
}

::v-deep .bottom-tabs .wd-tabs__nav-item.is-active {
  color: #000 !important;
  border-bottom: none !important;
}

::v-deep .bottom-tabs .wd-tabs__line {
  background-color: #00c853 !important;
}

.history-icon-position {
  top: 50%;
  transform: translateY(-50%);
}

::v-deep .bottom-tabs .wd-tabs__content {
  max-height: 28vh;
  overflow-y: auto;
}

::v-deep .order-type-popup {
  border-radius: 0.5rem 0.5rem 0 0 !important;
  z-index: 10000 !important;
}

::v-deep .order-type-popup .wd-popup__mask {
  z-index: 9999 !important;
}

::v-deep .order-type-popup .wd-popup__content {
  z-index: 10000 !important;
  padding: 0 !important;
  border-radius: 0.5rem 0.5rem 0 0 !important;
  padding-bottom: var(--wot-tabbar-height, 5rem) !important;
}

::v-deep .price-precision-popup {
  border-radius: 0.5rem 0.5rem 0 0 !important;
  z-index: 10000 !important;
}

::v-deep .price-precision-popup .wd-popup__mask {
  z-index: 9999 !important;
}

::v-deep .price-precision-popup .wd-popup__content {
  z-index: 10000 !important;
  padding: 0 !important;
  border-radius: 0.5rem 0.5rem 0 0 !important;
  padding-bottom: var(--wot-tabbar-height, 5rem) !important;
}

::v-deep .price-precision-popup-content {
  width: 100% !important;
}

::v-deep .order-type-popup-content {
  width: 100% !important;
  min-height: auto !important;
  max-height: none !important;
  overflow: visible !important;
}

::v-deep .wd-slider__button{
  height:1rem !important;
  width:1rem !important;
}

.slider-container {
  padding: 0 0.5rem;
  overflow: visible;
}

::v-deep .slider-container .wd-slider {
  overflow: visible !important;
}

::v-deep .slider-container .wd-slider__wrapper {
  overflow: visible !important;
}

.trade-content-paging {
  overflow: hidden !important;
  padding-top: 0 !important;
}

.trading-pair-header {
  z-index: 10 !important;
}

.trading-pair-placeholder {
  height: 2.86rem; // 占位高度，与交易对头部高度一致（py-2 + 内容高度）
}

// 为输入框容器添加平滑过渡
.trade-input-container:not(.trade-input-focused) {
  border: 1px solid transparent !important;
  height:2rem !important;
  min-height:2rem !important;
}

.trade-input-container.trade-input-focused {
  background-color: white !important;
  border: 1px solid #000 !important;
  height: 2rem !important;
  min-height: 2rem !important;
}

::v-deep .trade-input-focused .trade-input {
  background-color: white !important;
  // transition: background-color 0.2s ease !important;
}

::v-deep .trade-input-focused .trade-input .wd-input__inner {
  background-color: white !important;
  // transition: background-color 0.2s ease !important;
}

::v-deep .trade-input-focused .trade-input .wd-input__wrapper {
  background-color: white !important;
  // transition: background-color 0.2s ease !important;
}

::v-deep .trade-input-focused .trade-input .wd-input {
  background-color: white !important;
  // transition: background-color 0.2s ease !important;
}

// 订单簿样式
.trade-form-container {
  align-items: stretch;
}

.order-book-container {
  display: flex;
  flex-direction: column;
}

.order-book-content {
  display: grid;
  min-height: 0;
  flex: 1;
}

.order-list-grid {
  display: grid;
  grid-auto-rows: 1fr;
  min-height: 0;
  overflow-y: auto;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 0;
}

.order-price-section {
  flex-shrink: 0;
}

/* 交易对选择弹窗高度 */
::v-deep .pair-popup {
  height: 75vh !important;
  max-height: 75vh !important;
  border-top-left-radius: 1.2rem !important;
  border-top-right-radius: 1.2rem !important;
}
</style>
