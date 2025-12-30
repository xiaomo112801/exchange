<script setup lang="ts">
const router = useRouter()

definePage({
  name: 'withdrawCoinSelect',
  style: {
    navigationBarTitleText: '选择提现币种',
    navigationStyle: 'custom',
  },
})

// 搜索关键词
const searchKeyword = ref('')

// 是否隐藏暂停提现
const hideSuspended = ref(true)

// 热门币种
const hotCurrencies = ref([
  { code: 'USDT', name: 'Tether' },
  { code: 'USDC', name: 'USD Coin' },
  { code: 'BTC', name: 'Bitcoin' },
  { code: 'ETH', name: 'Ethereum' },
  { code: 'LTC', name: 'Litecoin' },
  { code: 'BNB', name: 'BNB' },
  { code: 'SOL', name: 'Solana' },
])

// 币种数据
interface CoinItem {
  code: string
  name: string
  icon: string
  suspended?: boolean
}

const allCoins = ref<CoinItem[]>([
  { code: 'A2Z', name: 'Arena-Z', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'AA', name: 'ARAI', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'AAPLX', name: 'Apple xStock', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'AAVE', name: 'Aave', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'AB', name: 'AB', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'ACB', name: 'ACBTOKEN', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'ACT', name: 'Act I : The AI Prophecy', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'AI', name: 'Sleepless AI', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'BTC', name: 'Bitcoin', icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/bitcoin.png', suspended: false },
  { code: 'ETH', name: 'Ethereum', icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/ethereum.png', suspended: false },
  { code: 'USDT', name: 'Tether', icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png', suspended: false },
  { code: 'USDC', name: 'USD Coin', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'SOL', name: 'Solana', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'BNB', name: 'BNB', icon: 'https://via.placeholder.com/40', suspended: false },
  { code: 'LTC', name: 'Litecoin', icon: 'https://via.placeholder.com/40', suspended: true },
])

// 按首字母分组
const groupedCoins = computed(() => {
  const filtered = allCoins.value.filter((coin) => {
    if (hideSuspended.value && coin.suspended) {
      return false
    }
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      return coin.code.toLowerCase().includes(keyword) || coin.name.toLowerCase().includes(keyword)
    }
    return true
  })

  const groups: Record<string, CoinItem[]> = {}
  filtered.forEach((coin) => {
    const firstLetter = coin.code.charAt(0).toUpperCase()
    if (!groups[firstLetter]) {
      groups[firstLetter] = []
    }
    groups[firstLetter].push(coin)
  })

  return groups
})

// 字母索引
const letters = computed(() => {
  return Object.keys(groupedCoins.value).sort()
})

// 选择币种
function handleCoinSelect(coin: CoinItem) {
  router.push({
    path: '/pagesAsset/withdraw/index',
    query: {
      code: coin.code,
      name: coin.name,
      icon: coin.icon,
    },
  })
}
</script>

<template>
  <view class="coin-select-page min-h-screen flex flex-col bg-white">
    <!-- 顶部导航栏 -->
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
      fixed
      custom-style="background-color: white !important;"
    >
      <template #left>
        <wd-icon name="arrow-left" size="1.25rem" color="#000" @click="router.back()" />
      </template>
      <template #title>
        <wd-text text="选择提现币种" size="1rem" color="#000" :bold="true" />
      </template>
      <template #right>
        <view class="flex items-center gap-3">
          <wd-icon name="help-circle" size="1.25rem" color="#666" />
        </view>
      </template>
    </wd-navbar>

    <!-- 搜索栏 -->
    <view class="mt-2 flex items-center justify-center px-4">
      <wd-search
        v-model="searchKeyword"
        placeholder="搜索币种"
        shape="round"
        hide-cancel
        custom-class="w-full"
      />
    </view>

    <!-- 热门币种 -->
    <view class="mx-4 mt-4 flex flex-col">
      <view class="mb-3 flex items-center gap-1">
        <wd-icon name="fire" size="1rem" color="#f44336" />
        <wd-text text="热门币种" size="0.875rem" color="#000" :bold="true" />
      </view>
      <view class="flex flex-wrap gap-2">
        <view
          v-for="coin in hotCurrencies"
          :key="coin.code"
          class="flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-1"
          @click="handleCoinSelect({ code: coin.code, name: coin.name, icon: '' })"
        >
          <wd-text :text="coin.code" size="0.725rem" color="#000" />
        </view>
      </view>
    </view>

    <!-- 全部币种 -->
    <view class="mx-4 mt-4 flex flex-1 flex-col overflow-hidden">
      <view class="mb-3 flex items-center justify-between">
        <wd-text text="全部币种" size="0.875rem" color="#000" :bold="true" />
      </view>

      <!-- 币种列表 -->
      <view class="flex-1 overflow-hidden">
        <wd-index-bar :sticky="true" custom-class="coin-index-bar">
          <view v-for="letter in letters" :key="letter">
            <wd-index-anchor :index="letter" />
            <view class="flex flex-col">
              <view
                v-for="coin in groupedCoins[letter]"
                :key="coin.code"
                class="flex items-center rounded-lg bg-white py-2"
                @click="handleCoinSelect(coin)"
              >
                <wd-img :src="coin.icon" width="1.5rem" height="1.5rem" mode="aspectFill" class="mr-2" />
                <view class="flex flex-1 flex-col">
                  <wd-text :text="coin.code" size="0.875rem" color="#000" :bold="true" />
                  <wd-text :text="coin.name" size="0.725rem" color="#999" />
                </view>
              </view>
            </view>
          </view>
        </wd-index-bar>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.coin-select-page {
  background-color: #fff;
  height: 100vh;
  overflow: hidden;
}

:deep(.coin-index-bar) {
  height: 100% !important;
  background-color: transparent !important;
}

:deep(.coin-index-bar .wd-index-bar__content) {
  height: 100% !important;
  overflow-y: auto !important;
}

:deep(.coin-index-bar .wd-index-bar__sidebar) {
  right: 0.5rem !important;
  background-color: transparent !important;
}

:deep(.wd-index-bar__sidebar) {
  top: 25% !important;
}

:deep(.wd-index-anchor) {
  background-color: white !important;
  padding: 0 !important;
  font-size: 0.785rem !important;
  color: $uni-text-color-grey !important;
}
</style>
