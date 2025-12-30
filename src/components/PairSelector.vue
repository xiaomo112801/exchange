<script setup lang="ts">
import CoinList from '@/components/CoinList.vue'

interface PairItem {
  name: string
  pair: string
  price: string
  cny: string
  change: string
  badge?: string
  type?: string
}

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

const props = withDefaults(defineProps<{
  tabs?: string[]
  subTabs?: string[]
  activeTab?: number
  activeSubTab?: number
  pairs: PairItem[]
  selectedCode?: string
  tagLabel?: string
}>(), {
  tabs: () => ['自选', '合约', '现货'],
  subTabs: () => ['USDT本位', 'USDC本位', '币本位'],
  activeTab: 1,
  activeSubTab: 0,
  selectedCode: '',
  tagLabel: '永续',
})

const emit = defineEmits<{
  (e: 'update:activeTab', v: number): void
  (e: 'update:activeSubTab', v: number): void
  (e: 'select', item: PairItem): void
}>()

const tabIndex = ref(props.activeTab)
const subTabIndex = ref(props.activeSubTab)

watch(() => props.activeTab, (v) => {
  tabIndex.value = v
})

watch(() => props.activeSubTab, (v) => {
  subTabIndex.value = v
})

function handleTabChange(i: number) {
  tabIndex.value = i
  emit('update:activeTab', i)
}

function handleSubTabChange(i: number) {
  subTabIndex.value = i
  emit('update:activeSubTab', i)
}

// 将 PairItem 转换为 CoinListItem
const coinList = computed<CoinListItem[]>(() => {
  return props.pairs.map((item, index) => ({
    id: index + 1,
    symbol: item.name,
    pair: item.pair,
    label: props.tagLabel || '永续',
    volumeText: item.badge || '0',
    lastPrice: item.price,
    lastPriceCny: item.cny,
    changePercent: item.change,
  }))
})

// 处理 CoinList 的行点击，转换为 PairItem 并触发 select 事件
function handleCoinListRowClick(coinItem: CoinListItem) {
  // 找到对应的 PairItem
  const pairItem = props.pairs.find(p => p.name === coinItem.symbol)
  if (pairItem) {
    emit('select', pairItem)
  }
}
</script>

<template>
  <view class="h-full flex flex-col bg-white p-4">
    <view class="sticky top-0 z-5 flex items-center justify-between border-b border-gray-100 bg-white pb-2">
      <wd-search placeholder="搜索" shape="round" custom-class="flex-1" />
      <wd-icon name="close" size="18px" color="#666" @click="emit('select', { name: '', pair: '', price: '', cny: '', change: '' })" />
    </view>

    <view class="flex gap-1 border-b border-gray-100 py-1">
      <view
        v-for="(tab, index) in tabs"
        :key="tab"
        class="px-2 py-1"
        :class="tabIndex === index ? 'font-bold text-black' : ''"
        @click="handleTabChange(index)"
      >
        <wd-text :text="tab" size="14px" :color="tabIndex === index ? '#000' : '#999'" :bold="tabIndex === index" />
      </view>
    </view>

    <view class="flex items-center justify-between border-b border-gray-100 py-2">
      <view class="flex gap-1">
        <view
          v-for="(tab, index) in subTabs"
          :key="tab"
          class="px-2 py-1"
          :class="subTabIndex === index ? 'font-bold text-black' : ''"
          @click="handleSubTabChange(index)"
        >
          <wd-text :text="tab" size="14px" :color="subTabIndex === index ? '#000' : '#999'" :bold="subTabIndex === index" />
        </view>
      </view>
      <view class="flex items-center gap-1">
        <wd-text :text="tagLabel" size="13px" color="#000" />
        <wd-icon name="arrow-down" size="12px" color="#000" />
      </view>
    </view>

    <view class="flex flex-1 flex-col overflow-y-auto">
      <CoinList
        :coins="coinList"
        :disable-navigation="true"
        :on-row-click="handleCoinListRowClick"
      />
    </view>
  </view>
</template>

  <style scoped lang="scss">
  .active-pair {
    background-color: #e6f6ec;
    border: 1px solid #b5e3c5;
  }

  .pair-change-btn {
    background-color: #3bb149 !important;
    border: none !important;
    height: 32px !important;
    min-width: 80px !important;
    padding: 0 12px !important;
    border-radius: 6px !important;
  }
  </style>
