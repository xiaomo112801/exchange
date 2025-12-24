<script setup lang="ts">
import { ref, computed } from 'vue'
interface CoinListItem {
  id: number
  symbol: string
  pair: string
  label: string
  volumeText: string
  lastPrice: string
  lastPriceCny: string
  changePercent: string
}

// 先用本地示例数据，后续可以接入真实接口或通过 props 传入
const coins = ref<CoinListItem[]>([
  {
    id: 1,
    symbol: 'ETH',
    pair: 'ETH / USDT',
    label: '永续',
    volumeText: '27.95亿',
    lastPrice: '2,939.47',
    lastPriceCny: '¥ 20,696.66',
    changePercent: '-3.72%',
  },
  {
    id: 2,
    symbol: 'BTC',
    pair: 'BTC / USDT',
    label: '永续',
    volumeText: '13.63亿',
    lastPrice: '87,663',
    lastPriceCny: '¥ 617,230.97',
    changePercent: '-2.47%',
  },
  {
    id: 3,
    symbol: 'SOL',
    pair: 'SOL / USDT',
    label: '永续',
    volumeText: '6.61亿',
    lastPrice: '123.3',
    lastPriceCny: '¥ 868.14',
    changePercent: '-3.66%',
  },
])

// 左侧表头：市值 / 成交额 可切换
const metricType = ref<'marketCap' | 'volume'>('volume')
const metricLabel = computed(() => (metricType.value === 'marketCap' ? '市值' : '成交额'))

function switchMetric(type: 'marketCap' | 'volume') {
  metricType.value = type
}

const originalCoins = [...coins.value]

function normalizeNumber(val: string): number {
  const cleaned = val.replace(/[,%¥\s]/g, '').replace(/,/g, '')
  const n = Number(cleaned)
  return Number.isNaN(n) ? NaN : n
}

function handleSort(column: any) {
  const dir = column.sortDirection as number
  if (!dir) {
    coins.value = [...originalCoins]
    return
  }
  const prop = column.prop as keyof CoinListItem
  const sorted = [...coins.value].sort((a, b) => {
    const av = a[prop] as unknown as string
    const bv = b[prop] as unknown as string
    const an = normalizeNumber(String(av))
    const bn = normalizeNumber(String(bv))
    if (!Number.isNaN(an) && !Number.isNaN(bn)) {
      return (an - bn) * dir
    }
    return String(av).localeCompare(String(bv)) * dir
  })
  coins.value = sorted
}
</script>

<template>
  <view class="w-full bg-white">
    <!-- 表格列表：3 列 = 左（市值/成交额）| 中（最新价）| 右（24H涨跌幅），使用表头 -->
    <view class="">
      <wd-table
        :data="coins"
        size="small"
        :border="false"
        :stripe="false"

        class="coin-list-table"
        @sort-method="handleSort"
      >
        <!-- 列 1：左列 = 币种 + 市值/成交额（可排序），约占 40% -->
        <wd-table-col prop="symbol" width="40%" label="成交额" sortable>
          <!-- 表头：市值 / 成交额 开关（小号灰色字体，使用 rem 单位） -->
          <template #label>
            <view class="flex items-center text-[0.7rem] text-gray-400">
              <view class="inline-flex rounded-full bg-gray-100 px-0.5 py-[2px]">
                <text
                  class="rounded-full px-2"
                  :class="metricType === 'marketCap' ? 'bg-white text-gray-900' : 'text-gray-500'"
                  @click="switchMetric('marketCap')"
                >
                  市值
                </text>
                <text
                  class="rounded-full px-2"
                  :class="metricType === 'volume' ? 'bg-white text-gray-900' : 'text-gray-500'"
                  @click="switchMetric('volume')"
                >
                  成交额
                </text>
              </view>
            </view>
          </template>
          <template #value="{ row }">
            <view class="flex flex-col">
              <view class="flex items-baseline gap-1">
                <wd-text :text="row.symbol" size="14px" color="#000" :bold="true" />
                <wd-text text="/ USDT" size="12px" color="#999" />
              </view>
              <view class="mt-1 flex items-center gap-2">
                <wd-text :text="metricLabel" size="0.7rem" color="#999" />
                <wd-text :text="row.volumeText" size="0.7rem" color="#999" />
              </view>
            </view>
          </template>
        </wd-table-col>

        <!-- 列 2：中列 = 最新价（可排序），约占 30% -->
        <wd-table-col prop="lastPrice" width="30%" label="最新价" align="right" sortable>
          <template #value="{ row }">
            <view class="flex flex-col items-end">
              <wd-text :text="row.lastPrice" size="14px" color="#000" :bold="true" />
              <wd-text :text="row.lastPriceCny" size="0.7rem" color="#999" />
            </view>
          </template>
        </wd-table-col>

        <!-- 列 3：右列 = 24H 涨跌幅（可排序），约占 30% -->
        <wd-table-col prop="changePercent" width="30%" label="24H涨跌幅" align="right" sortable>
          <template #value="{ row }">
            <view class="flex items-center justify-end">
              <view class="min-w-[52px] rounded-md bg-[#f64c3c] px-2 py-1 text-center">
                <wd-text :text="row.changePercent" size="0.8rem" color="#fff" />
              </view>
            </view>
          </template>
        </wd-table-col>
      </wd-table>
    </view>
  </view>
</template>

<style scoped lang="scss">
  :deep(.wd-sort-button__left) {
    font-size: 0.7rem !important;
    color:#ccc
  }

  :deep(.wd-sort-button__right) {
    font-size: 0.85rem !important;
    color:#ccc
  }

  :deep(.wd-table__content--header .wd-table__cell) {
    padding: 0 10px !important;
    height: 2rem !important;
    min-height: 2rem !important;
  }

  :deep(.wd-table__header) {
    height: 2rem !important;
    min-height: 2rem !important;
  }
</style>
