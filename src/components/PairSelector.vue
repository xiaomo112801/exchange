<script setup lang="ts">
interface PairItem {
  name: string
  pair: string
  price: string
  cny: string
  change: string
  badge?: string
  type?: string
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

function handleSelect(item: PairItem) {
  emit('select', item)
}

function isActive(item: PairItem) {
  return props.selectedCode && item.name === props.selectedCode
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

    <view class="flex flex-1 flex-col gap-2 overflow-y-auto py-2.5">
      <view
        v-for="(item, idx) in pairs"
        :key="item.pair"
        class="flex items-center justify-between rounded-lg px-3 py-2.5"
        :class="isActive(item) ? 'active-pair' : ''"
      >
        <view class="flex flex-col gap-1">
          <view class="flex items-center gap-1">
            <wd-text :text="item.name" size="15px" color="#000" :bold="true" />
            <wd-text text="/USDT" size="12px" color="#999" />
          </view>
          <view class="flex items-center gap-2">
            <wd-text :text="tagLabel" size="12px" color="#999" />
            <wd-text v-if="item.badge" :text="item.badge" size="12px" color="#58c12f" />
          </view>
        </view>
        <view class="flex items-center gap-3">
          <view class="flex flex-col items-end gap-0.5">
            <wd-text :text="item.price" size="17px" color="#000" :bold="true" />
            <wd-text :text="item.cny" size="13px" color="#999" />
          </view>
          <wd-button
            size="small"
            type="success"
            custom-class="pair-change-btn"
            @click.stop="handleSelect(item)"
          >
            <wd-text :text="item.change" size="13px" color="#fff" />
          </wd-button>
        </view>
      </view>
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
