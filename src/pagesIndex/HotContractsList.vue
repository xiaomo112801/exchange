<script setup lang="ts">
interface ContractItem {
  id: number
  symbol: string
  pair: string
  label: string
  volumeText: string
  lastPrice: string
  lastPriceCny: string
  changePercent: string
}

// 先用本地示例数据，后续可以接入真实接口
const contracts = ref<ContractItem[]>([
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
</script>

<template>
  <view class="w-full bg-white">
    <view
      v-for="item in contracts"
      :key="item.id"
      class="flex items-center justify-between px-4 py-3 border-b border-gray-100"
    >
      <!-- 左侧：合约标识 -->
      <view class="flex flex-col justify-center">
        <view class="flex items-baseline gap-1">
          <wd-text :text="item.symbol" size="16px" color="#000" :bold="true" />
          <wd-text text="/ USDT" size="12px" color="#999" />
        </view>
        <view class="mt-1 flex items-center gap-2">
          <wd-text text="永续" size="12px" color="#999" />
          <wd-text :text="item.volumeText" size="12px" color="#999" />
        </view>
      </view>

      <!-- 中间：最新价 -->
      <view class="flex flex-col items-end justify-center">
        <wd-text :text="item.lastPrice" size="16px" color="#000" :bold="true" />
        <wd-text :text="item.lastPriceCny" size="12px" color="#999" />
      </view>

      <!-- 右侧：24H 涨跌幅 -->
      <view class="ml-3">
        <view class="min-w-[72px] rounded-full bg-[#f64c3c] px-3 py-1 text-center">
          <wd-text :text="item.changePercent" size="14px" color="#fff" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
</style>


