<script setup lang="ts">
import { computed, ref } from 'vue'
import AppKlineChart from '@/components/AppKlineChart.vue'
import BaseTabs from '@/components/BaseTabs.vue'
// import KlineChartDemo from '@/components/KlineChartDemo.vue'
// import TradingViewChart from '@/components/TradingViewChart.vue'

interface Props {
  coinData: {
    name: string
    code: string
    icon: string
    price: number
    changePercent: number
    high24h: number
    low24h: number
    volume24h: string
    markPrice: number
  }
  tradingSymbol: string
}

defineProps<Props>()

// 时间周期
const timeInterval = ref('15分')
const timeIntervals = ref(['15分', '1小时', '2小时', '4小时', '1日', '更多'])

// 技术指标
const indicatorIndex = ref(0)
const indicators = ref(['MA', 'EMA', 'BOLL', 'MACD', 'RSI', 'WR'])

// 表现数据
const performanceData = ref([
  { label: '今日', value: '+1.53%', isPositive: true },
  { label: '7天', value: '+4.23%', isPositive: true },
  { label: '30天', value: '-11.68%', isPositive: false },
  { label: '90天', value: '-18.26%', isPositive: false },
  { label: '180天', value: '-17.18%', isPositive: false },
  { label: '1年', value: '-8.98%', isPositive: false },
])

// 订单簿
const orderBookTab = ref(0)
// const orderBookTabList = [
//   { title: '当前盘口', name: 0 },
//   { title: '实时成交', name: 1 },
// ]
// 盘口示例数据（按截图风格，量单位 K）
const buyOrders = ref([
  { price: 0.00963, amount: 9.71 },
  { price: 0.00962, amount: 9.07 },
  { price: 0.00940, amount: 6.32 },
  { price: 0.00918, amount: 5.95 },
  { price: 0.00910, amount: 9.48 },
  { price: 0.00892, amount: 6.95 },
  { price: 0.00868, amount: 5.91 },
  { price: 0.00856, amount: 9.48 },
  { price: 0.00839, amount: 9.69 },
  { price: 0.00820, amount: 9.52 },
  { price: 0.00808, amount: 11.5 },
  { price: 0.00790, amount: 9.74 },
  { price: 0.00775, amount: 10.86 },
  { price: 0.00761, amount: 10.83 },
  { price: 0.00748, amount: 11.57 },
  { price: 0.00734, amount: 8.80 },
  { price: 0.00714, amount: 13.26 },
  { price: 0.00703, amount: 12.24 },
  { price: 0.00680, amount: 10.18 },
])

const sellOrders = ref([
  { price: 0.00964, amount: 9.10 },
  { price: 0.00965, amount: 5.46 },
  { price: 0.00994, amount: 7.74 },
  { price: 0.01026, amount: 8.85 },
  { price: 0.01036, amount: 5.85 },
  { price: 0.01053, amount: 6.37 },
  { price: 0.01074, amount: 5.64 },
  { price: 0.01078, amount: 7.55 },
  { price: 0.01129, amount: 5.57 },
  { price: 0.01160, amount: 6.82 },
  { price: 0.01174, amount: 4.81 },
  { price: 0.01210, amount: 4.42 },
  { price: 0.01220, amount: 5.95 },
  { price: 0.01264, amount: 6.18 },
  { price: 0.01273, amount: 5.40 },
  { price: 0.01304, amount: 5.46 },
])

const maxDepth = computed(() => {
  const maxBuy = Math.max(...buyOrders.value.map(i => i.amount), 1)
  const maxSell = Math.max(...sellOrders.value.map(i => i.amount), 1)
  return Math.max(maxBuy, maxSell)
})

// 分时 & 指标设置弹窗
const showSettingPopup = ref(false)

// 实时成交（示例数据）
const trades = ref([
  { time: '12:30:15', price: 90870.5, amount: 0.0123, side: 'buy' },
  { time: '12:30:10', price: 90869.8, amount: 0.0345, side: 'sell' },
  { time: '12:30:05', price: 90870.2, amount: 0.0201, side: 'buy' },
  { time: '12:30:02', price: 90869.6, amount: 0.0456, side: 'sell' },
  { time: '12:29:58', price: 90870.0, amount: 0.0311, side: 'buy' },
])

function handleTimeIntervalChange(interval: string) {
  timeInterval.value = interval
}

function formatPrice(price: number) {
  return price.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 2 })
}

function formatDepthAmount(amount?: number) {
  if (amount === undefined || amount === null)
    return ''
  return `${amount.toFixed(2)}K`
}
</script>

<template>
  <view class="flex flex-col">
    <!-- 价格信息 -->
    <view class="border-b border-gray-200 bg-white py-4">
      <view class="flex items-start justify-between gap-4">
        <view class="mr-5 flex flex-col items-start gap-1.5">
          <wd-text text="最新价格" size="12px" color="#999" class="leading-tight" />
          <wd-text :text="formatPrice(coinData.price)" size="28px" color="#000" :bold="true" class="leading-tight" />
          <view class="flex items-center gap-1.5">
            <wd-text text="≈" size="14px" color="#666" />
            <wd-text
              :text="`¥ ${(coinData.price * 7.08).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`"
              size="14px" color="#666"
            />
            <wd-text
              :text="`${coinData.changePercent > 0 ? '+' : ''}${coinData.changePercent}%`" size="14px"
              :color="coinData.changePercent > 0 ? '#00c853' : '#f44336'"
              :bold="true"
            />
          </view>
        </view>
        <view class="min-w-[120px] flex flex-1 flex-col items-end gap-1">
          <view class="w-full flex items-center justify-between gap-2 whitespace-nowrap">
            <wd-text text="24H最高" size="12px" color="#999" />
            <wd-text :text="formatPrice(coinData.high24h)" size="12px" color="#000" />
          </view>
          <view class="w-full flex items-center justify-between gap-2 whitespace-nowrap">
            <wd-text text="24H最低" size="12px" color="#999" />
            <wd-text :text="formatPrice(coinData.low24h)" size="12px" color="#000" />
          </view>
          <view class="w-full flex items-center justify-between gap-2 whitespace-nowrap">
            <wd-text text="24H量" size="12px" color="#999" />
            <wd-text :text="`${coinData.volume24h} ${coinData.code}`" size="12px" color="#000" />
          </view>
        </view>
      </view>
      <view class="mt-2">
        <wd-text text="标记价格" size="12px" color="#999" />
        <wd-text :text="formatPrice(coinData.markPrice)" size="12px" color="#666" class="ml-1" />
      </view>
    </view>

    <!-- 时间周期选择 -->
    <view class="border-t border-gray-200 bg-white py-2">
      <view class="flex items-center gap-2">
        <view class="scrollbar-none min-w-0 flex flex-1 items-center gap-2 overflow-x-auto">
          <view
            v-for="interval in timeIntervals" :key="interval"
            class="min-w-[48px] flex items-center justify-center whitespace-nowrap rounded px-3 py-1"
            :class="timeInterval === interval ? 'bg-green-500' : 'bg-gray-100'"
            @click="handleTimeIntervalChange(interval)"
          >
            <wd-text
              :text="interval" size="12px"
              :color="timeInterval === interval ? '#fff' : '#666'"
            />
          </view>
          <view class="min-w-12 flex items-center justify-center whitespace-nowrap rounded bg-gray-100 px-3 py-1">
            <wd-text text="深" size="12px" color="#666" />
          </view>
        </view>
        <wd-icon name="setting" size="16px" color="#666" class="flex-shrink-0" @click="showSettingPopup = true" />
      </view>
    </view>

    <!-- K线图表 -->
    <view class="relative bg-white">
      <!-- 统一使用 AppKlineChart 方便调试 -->
      <AppKlineChart
        :symbol="tradingSymbol"
        :time-interval="timeInterval"
        :indicator-index="indicatorIndex"
        :indicators="indicators"
      />

      <!-- <KlineChartDemo
        :symbol="tradingSymbol"
        :time-interval="timeInterval"
        :indicator-index="indicatorIndex"
        :indicators="indicators"
      /> -->
    </view>

    <!-- 技术指标选择 -->
    <view class="border-t border-gray-200 bg-white py-2">
      <view class="scrollbar-none flex items-center gap-2 overflow-x-auto">
        <view
          v-for="(indicator, index) in indicators" :key="indicator" class="whitespace-nowrap rounded px-3 py-1"
          :class="indicatorIndex === index ? 'bg-green-500' : 'bg-gray-100'" @click="indicatorIndex = index"
        >
          <wd-text :text="indicator" size="12px" :color="indicatorIndex === index ? '#fff' : '#666'" />
        </view>
      </view>
    </view>

    <!-- 表现数据 -->
    <view class="border-t border-gray-200 bg-white py-3">
      <view class="scrollbar-none flex items-center gap-4 overflow-x-auto">
        <view v-for="item in performanceData" :key="item.label" class="whitespace-nowrap text-center">
          <wd-text :text="item.label" size="12px" color="#999" class="mb-1 block" />
          <wd-text :text="item.value" size="14px" :color="item.isPositive ? '#00c853' : '#f44336'" :bold="true" />
        </view>
      </view>
    </view>

    <!-- 订单簿 -->
    <view class="min-h-[300px] border-t border-gray-200 bg-white">
      <view class="pt-2">
        <BaseTabs v-model="orderBookTab" :bordered="false" custom-class="login-tabs">
          <wd-tab title="当前盘口" :name="0">
            <view class="py-3">
              <view class="mb-2 flex items-center justify-between px-2 text-[12px] text-gray-500">
                <span>买  数量</span>
                <span>价格 USDT</span>
                <span>数量  卖</span>
              </view>
              <view class="divide-y divide-gray-100">
                <view
                  v-for="i in Math.max(buyOrders.length, sellOrders.length)"
                  :key="i"
                  class="flex items-center justify-between px-2 py-1"
                >
                  <!-- 买盘 -->
                  <view class="relative flex-1 pr-2">
                    <view
                      v-if="buyOrders[i - 1]"
                      class="absolute inset-y-1 right-0 rounded-l bg-green-50"
                      :style="{ width: `${Math.min(100, (buyOrders[i - 1].amount / maxDepth) * 100)}%` }"
                    />
                    <view class="relative flex items-center gap-2 text-[12px]">
                      <span class="text-gray-600">{{ buyOrders[i - 1]?.amount ? formatDepthAmount(buyOrders[i - 1].amount) : '' }}</span>
                      <span :style="{ color: '#00c853' }">
                        {{ buyOrders[i - 1]?.price ? buyOrders[i - 1].price.toFixed(5) : '' }}
                      </span>
                    </view>
                  </view>

                  <!-- 卖盘 -->
                  <view class="relative flex-1 pl-2 text-right">
                    <view
                      v-if="sellOrders[i - 1]"
                      class="absolute inset-y-1 left-0 rounded-r bg-red-50"
                      :style="{ width: `${Math.min(100, (sellOrders[i - 1].amount / maxDepth) * 100)}%` }"
                    />
                    <view class="relative flex items-center justify-end gap-2 text-[12px]">
                      <span :style="{ color: '#f44336' }">
                        {{ sellOrders[i - 1]?.price ? sellOrders[i - 1].price.toFixed(5) : '' }}
                      </span>
                      <span class="text-gray-600">{{ sellOrders[i - 1]?.amount ? formatDepthAmount(sellOrders[i - 1].amount) : '' }}</span>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </wd-tab>
          <wd-tab title="实时成交" :name="1">
            <view class="trades-table-wrap pb-2">
              <wd-table
                :data="trades"
                size="small"
                :border="false"
                :stripe="false"
                row-height="5rem"
                class="trades-table"
              >
                <wd-table-col prop="time" label="时间" width="70" />
                <wd-table-col prop="side" label="方向" width="50">
                  <template #value="{ row }">
                    <span :style="{ color: row.side === 'buy' ? '#00c853' : '#f44336' }">
                      {{ row.side === 'buy' ? '买入' : '卖出' }}
                    </span>
                  </template>
                </wd-table-col>
                <wd-table-col prop="price" label="价格 USDT" min-width="70">
                  <template #value="{ row }">
                    <span :style="{ color: row.side === 'buy' ? '#00c853' : '#f44336' }">
                      {{ row.price.toFixed(5) }}
                    </span>
                  </template>
                </wd-table-col>
                <wd-table-col prop="amount" label="数量 STABLE" min-width="90" align="right">
                  <template #value="{ row }">
                    {{ row.amount.toFixed(1) }}K
                  </template>
                </wd-table-col>
              </wd-table>
            </view>
          </wd-tab>
        </BaseTabs>
      </view>
    </view>

    <!-- 分时 & 指标设置弹窗 -->
    <wd-popup
      v-model="showSettingPopup"
      position="bottom"
      round
      custom-style="height: 260px; max-height: 260px;"
    >
      <view class="px-4 py-3">
        <view class="mb-3 flex items-center justify-between">
          <wd-text text="设置" size="16px" color="#000" :bold="true" />
          <wd-icon name="close" size="18px" color="#999" @click="showSettingPopup = false" />
        </view>

        <!-- 分时 -->
        <view class="mb-2">
          <wd-text text="分时" size="13px" color="#999" class="mb-2 block" />
          <view class="grid grid-cols-4 gap-2">
            <view
              v-for="interval in timeIntervals"
              :key="interval"
              class="flex items-center justify-center border rounded px-2 py-1"
              :class="timeInterval === interval ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'"
              @click="handleTimeIntervalChange(interval)"
            >
              <wd-text
                :text="interval"
                size="12px"
                :color="timeInterval === interval ? '#00c853' : '#666'"
              />
            </view>
          </view>
        </view>

        <!-- 指标 -->
        <view class="mt-3">
          <wd-text text="指标" size="13px" color="#999" class="mb-2 block" />
          <view class="grid grid-cols-4 gap-2">
            <view
              v-for="(indicator, index) in indicators"
              :key="indicator"
              class="flex items-center justify-center border rounded px-2 py-1"
              :class="indicatorIndex === index ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'"
              @click="indicatorIndex = index"
            >
              <wd-text
                :text="indicator"
                size="12px"
                :color="indicatorIndex === index ? '#00c853' : '#666'"
              />
            </view>
          </view>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<style scoped lang="scss">
/* 隐藏滚动条 */
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* 实时成交表格样式优化，贴近交易所效果 */
:deep(.trades-table) {
  font-size: 12px;
}

:deep(.trades-table .wd-table__header) {
  background-color: transparent;
}

:deep(.trades-table .wd-table__header th) {
  padding-top: 4px;
  padding-bottom: 4px;
  color: #999;
}

:deep(.trades-table .wd-table__body td) {
  padding-top: 3px;
  padding-bottom: 3px;
}

:deep(.trades-table .wd-table__row) {
  height: 22px;
}

.trades-table-wrap {
  max-height: 360px;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>
