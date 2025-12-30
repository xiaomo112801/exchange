<script setup lang="ts">
// 币种数据接口
export interface CoinItem {
  code: string
  name: string
  nameZh?: string // 中文名
  icon: string
  value?: string // 右侧显示的值，默认显示 "--"
}

const props = withDefaults(defineProps<{
  coins?: CoinItem[]
  selectedCode?: string // 当前选中的币种代码
}>(), {
  coins: () => [],
  selectedCode: '',
})

const emit = defineEmits<{
  (e: 'select', coin: CoinItem): void
  (e: 'close'): void
}>()

// 搜索关键词
const searchKeyword = ref('')

// 默认币种列表（根据图片中的币种）
const defaultCoins = ref<CoinItem[]>([
  {
    code: 'USDT',
    name: 'Tether',
    nameZh: '泰达币',
    icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
  },
  {
    code: 'BTC',
    name: 'BTC',
    icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/bitcoin.png',
  },
  {
    code: 'ETH',
    name: 'ETH',
    icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/ethereum.png',
  },
  {
    code: 'LTC',
    name: 'LITECOIN',
    icon: 'https://via.placeholder.com/40',
  },
  {
    code: 'ETC',
    name: 'ETC',
    icon: 'https://via.placeholder.com/40',
  },
  {
    code: 'EOS',
    name: 'EOS',
    icon: 'https://via.placeholder.com/40',
  },
  {
    code: 'TRX',
    name: 'TRX',
    icon: 'https://via.placeholder.com/40',
  },
  {
    code: 'XRP',
    name: '瑞波币',
    nameZh: '瑞波币',
    icon: 'https://via.placeholder.com/40',
  },
  {
    code: 'BCH',
    name: 'BCH',
    icon: 'https://via.placeholder.com/40',
  },
  {
    code: 'DOGE',
    name: 'DOGE',
    icon: 'https://via.placeholder.com/40',
  },
  {
    code: 'MANA',
    name: 'MANA',
    icon: 'https://via.placeholder.com/40',
  },
])

// 使用传入的 coins 或默认数据
const coins = computed(() => props.coins.length > 0 ? props.coins : defaultCoins.value)

// 过滤后的币种列表
const filteredCoins = computed(() => {
  if (!searchKeyword.value) {
    return coins.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return coins.value.filter((coin) => {
    return (
      coin.code.toLowerCase().includes(keyword)
      || coin.name.toLowerCase().includes(keyword)
      || (coin.nameZh && coin.nameZh.toLowerCase().includes(keyword))
    )
  })
})

// 选择币种
function handleSelectCoin(coin: CoinItem) {
  emit('select', coin)
}

// 取消搜索
function handleCancel() {
  searchKeyword.value = ''
  emit('close')
}

// 清空搜索
function handleClearSearch() {
  searchKeyword.value = ''
}
</script>

<template>
  <view class="coin-selector h-full flex flex-col bg-white">
    <!-- 搜索栏和取消按钮 -->
    <view class="flex items-center gap-2 px-4 py-3">
      <view class="flex flex-1 items-center px-3 py-2">
        <wd-icon name="search" size="0.875rem" color="#999" class="mr-2" />
        <wd-input
          v-model="searchKeyword"
          custom-class="coin-search-input flex-1"
          placeholder="搜索"
          no-border
          @input="handleClearSearch"
        />
      </view>
      <view class="py-2" @click="handleCancel">
        <wd-text text="取消" size="0.875rem" color="#000" />
      </view>
    </view>

    <!-- 标题 -->
    <view class="px-4 pb-2">
      <wd-text text="币种列表" size="1rem" color="#000" :bold="true" />
    </view>

    <!-- 币种列表 -->
    <view class="flex-1 overflow-y-auto px-4">
      <view
        v-for="coin in filteredCoins"
        :key="coin.code"
        class="coin-item flex items-center justify-between py-3"
        :class="{ 'coin-item-selected': selectedCode === coin.code }"
        @click="handleSelectCoin(coin)"
      >
        <view class="flex flex-1 items-center gap-3">
          <!-- 币种图标 -->
          <view class="coin-icon-wrapper h-8 w-8 flex items-center justify-center overflow-hidden rounded-full">
            <wd-img
              :src="coin.icon"
              width="1.75rem"
              height="1.75rem"
              mode="aspectFill"
              :error-icon="false"
            />
          </view>

          <!-- 币种信息 -->
          <view class="flex flex-1 flex-col">
            <wd-text :text="coin.code" size="0.875rem" color="#000" :bold="true" />
            <wd-text
              :text="coin.nameZh || coin.name"
              size="0.75rem"
              color="#999"
              class="mt-0.5"
            />
          </view>
        </view>

        <!-- 右侧值（默认显示 --） -->
        <view class="ml-2">
          <wd-text :text="coin.value || '--'" size="0.875rem" color="#999" />
        </view>
      </view>

      <!-- 无搜索结果 -->
      <view v-if="filteredCoins.length === 0" class="flex items-center justify-center py-8">
        <wd-text text="暂无搜索结果" size="0.875rem" color="#999" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.coin-selector {
  min-height: 60vh;
  max-height: 80vh;
}

.coin-search-input {
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
}

::v-deep .coin-search-input .wd-input__inner {
  border: none !important;
  background-color: transparent !important;
  padding: 0 !important;
  font-size: 0.875rem !important;
}

.coin-item {
  cursor: pointer;
}

.coin-icon-wrapper {
  flex-shrink: 0;
}

::v-deep .coin-icon-wrapper .wd-img {
  border-radius: 50%;
}
</style>
