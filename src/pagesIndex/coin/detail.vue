<script setup lang="ts">
import PairSelector from '@/components/PairSelector.vue'
// 导入标签页组件
import MarketTab from './components/MarketTab.vue'
import OverviewTab from './components/OverviewTab.vue'

definePage({
  name: 'coinDetail',
  style: {
    navigationBarTitleText: '币种详情',
    navigationStyle: 'custom',
  },
})

const router = useRouter()
const route = useRoute()
const coinId = computed(() => (route.query?.id as string) || '1')

const coinDataMap: Record<string, {
  name: string
  code: string
  icon: string
  price: number
  change: number
  changePercent: number
  high24h: number
  low24h: number
  volume24h: string
  markPrice: number
}> = {
  1: {
    name: '比特币',
    code: 'BTC',
    icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/bitcoin.png',
    price: 90870.2,
    change: 1.71,
    changePercent: 1.71,
    high24h: 91721.0,
    low24h: 87688.1,
    volume24h: '1.63万',
    markPrice: 90864.9,
  },
  2: {
    name: '以太坊',
    code: 'ETH',
    icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/ethereum.png',
    price: 3420.5,
    change: 2.15,
    changePercent: 2.15,
    high24h: 3450.8,
    low24h: 3350.2,
    volume24h: '2.45万',
    markPrice: 3418.3,
  },
  3: {
    name: 'USDT',
    code: 'USDT',
    icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
    price: 7.08,
    change: 0.01,
    changePercent: 0.14,
    high24h: 7.10,
    low24h: 7.05,
    volume24h: '10.5万',
    markPrice: 7.08,
  },
}

const coinData = computed(() => coinDataMap[coinId.value] || coinDataMap[1])

// 根据 coinId 映射交易对符号
const symbolMap: Record<string, string> = {
  1: 'BINANCE:BTCUSDT',
  2: 'BINANCE:ETHUSDT',
  3: 'BINANCE:USDTUSDT',
}

const tradingSymbol = computed(() => {
  return symbolMap[coinId.value] || 'BINANCE:BTCUSDT'
})

// 标签页
const tabIndex = ref(0)

// 收藏状态
const isFavorited = ref(false)

// 交易对弹窗
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

function handlePairSelect(_item: any) {
  showPairPopup.value = false
}

function toggleFavorite() {
  isFavorited.value = !isFavorited.value
}

function handleOpenPosition() {
  // 开仓逻辑
  console.log('开仓')
}

function handleClosePosition() {
  // 平仓逻辑
  console.log('平仓')
}
</script>

<template>
  <view class="detail-page mx-auto h-full min-h-screen w-full flex flex-col bg-gray-50">
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
      fixed
      custom-style="background-color: white !important;"
      custom-class="coin-detail-navbar"
    >
      <template #left>
        <wd-icon name="arrow-left" size="20px" color="#000" @click="router.back()" />
      </template>
      <template #title>
        <view class="flex items-center justify-center gap-2" @click="showPairPopup = true">
          <wd-img :src="coinData.icon" width="24px" height="24px" />
          <wd-text :text="`${coinData.code}/USDT`" size="16px" color="#000" :bold="true" />
          <view class="inline-flex items-center justify-center rounded-md bg-gray-100 px-2 py-1 leading-none">
            <wd-text text="永续" size="12px" color="#666" />
          </view>
          <wd-icon name="arrow-down" size="12px" color="#666" />
        </view>
      </template>
      <template #right>
        <view class="relative z-2 min-w-[88px] flex items-center justify-end gap-3">
          <wd-icon
            :name="isFavorited ? 'star-fill' : 'star'" size="18px" :color="isFavorited ? '#ffd700' : '#666'"
            @click="toggleFavorite"
          />
          <wd-icon name="refresh1" size="18px" color="#666" />
        </view>
      </template>
    </wd-navbar>
    <view class="box-border w-full flex flex-col pt-9">
      <!-- 标签页 -->
      <view class="bg-white px-4">
        <BaseTabs v-model="tabIndex" :bordered="false" custom-class="login-tabs">
          <wd-tab title="行情" :name="0">
            <MarketTab :coin-data="coinData" :trading-symbol="tradingSymbol" />
          </wd-tab>
          <wd-tab title="概况" :name="1">
            <OverviewTab :coin-data="coinData" />
          </wd-tab>
          <!-- 数据标签页内容 -->
          <!-- <wd-tab title="数据" :name="2">
            <view class="px-5 py-4">
              <wd-text text="数据 内容" size="14px" color="#666" />
            </view>
          </wd-tab> -->

          <!-- 热币严选标签页内容 -->
          <!-- <wd-tab title="热币严选" :name="3">
            <view class="px-5 py-4">
              <wd-text text="热币严选 内容" size="14px" color="#666" />
            </view>
          </wd-tab> -->
        </BaseTabs>
      </view>
    </view>

    <!-- 底部操作栏（弹窗显示时隐藏） -->
    <view
      v-if="!showPairPopup"
      class="fixed bottom-0 left-0 right-0 z-100 h-[60px] flex items-center justify-between border-t border-gray-200 bg-white px-3 py-2"
    >
      <view class="flex flex-nowrap items-center gap-3 px-1">
        <wd-icon name="more" size="20px" color="#666" />
        <wd-text text="杠杆" size="14px" color="#666" class="whitespace-nowrap" />
        <wd-text text="现货" size="14px" color="#666" class="whitespace-nowrap" />
      </view>
      <view class="flex flex-nowrap items-center gap-2 px-1">
        <wd-button type="success" size="large" custom-class="action-btn shrink-0" @click="handleOpenPosition">
          <wd-text text="开仓" size="14px" color="#fff" custom-class="whitespace-nowrap" />
        </wd-button>
        <wd-button type="error" size="large" custom-class="action-btn shrink-0" @click="handleClosePosition">
          <wd-text text="平仓" size="14px" color="#fff" custom-class="whitespace-nowrap" />
        </wd-button>
      </view>
    </view>

    <!-- 交易对选择弹窗（公共组件） -->
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
        :selected-code="coinData.code"
        @update:active-tab="pairTabIndex = $event"
        @update:active-sub-tab="pairSubTabIndex = $event"
        @select="handlePairSelect"
      />
    </wd-popup>
  </view>
</template>

<style scoped lang="scss">
::v-deep .login-tabs {
  border: none !important;
  width: 100% !important;

}

::v-deep .login-tabs .wd-tabs__nav-container {
  padding: 0 !important; /* 使用父级 px-4 的留白 */
  margin-left: -0.3rem !important;
  box-sizing: border-box !important;
}

/* 去掉头部包裹层的默认内边距，确保与内容左侧对齐 */
::v-deep .login-tabs .wd-tabs__header {
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .login-tabs .wd-tabs__nav-wrap {
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .login-tabs .wd-tabs__nav {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .login-tabs .wd-tabs__nav-item {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 6px !important; /* 留少量间距 */
  flex: none;
  text-align: center;
}

::v-deep .login-tabs .wd-tabs__nav-item.is-active {
  color: #00c853 !important;
  font-weight: bold !important;
}

::v-deep .login-tabs .wd-tabs__line {
  background-color: #00c853 !important;
  height: 2px !important;
}

/* 调整 navbar 标题与左侧间距，使标题更靠左且不遮挡返回键 */
::v-deep .coin-detail-navbar .wd-navbar__left {
  padding-left: 0.5rem !important;
  min-width: 40px !important;
}

::v-deep .coin-detail-navbar .wd-navbar__content {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
  min-height: 44px !important;
  flex: 1;
  box-sizing: border-box !important;
  background-color: white !important;
}

::v-deep .coin-detail-navbar .wd-navbar__title {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  flex: 1 !important;
  margin-left: 1.75rem !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* 防止 navbar 内容溢出视口宽度 */
::v-deep .coin-detail-navbar {
  width: 100% !important;
  box-sizing: border-box !important;
  background-color: white !important;
}

::v-deep .coin-detail-navbar .wd-navbar {
  background-color: white !important;
}

::v-deep .coin-detail-navbar .wd-navbar__wrapper {
  background-color: white !important;
}

::v-deep .coin-detail-navbar .wd-navbar__content {
  background-color: white !important;
}

/* 交易对选择弹窗高度 */
::v-deep .pair-popup {
  height: 75vh !important;
  max-height: 75vh !important;
  border-top-left-radius: 1.2rem !important;
  border-top-right-radius: 1.2rem !important;
}

::v-deep .action-btn {
  min-width: 80px !important;
  height: 40px !important;
  border-radius: 4px !important;
}

::v-deep .action-btn.wd-button--success {
  background-color: #00c853 !important;
}

::v-deep .action-btn.wd-button--error {
  background-color: #f44336 !important;
}
</style>
