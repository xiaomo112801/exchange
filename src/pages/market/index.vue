<script setup lang="ts">
import CoinList from '@/components/CoinList.vue'

definePage({
  name: 'market',
  type: 'page',
  style: {
    navigationBarTitleText: '市场',
    navigationStyle: 'custom',
  },
  layout: 'tabbar',
})

// 主导航标签
const mainTab = ref(1) // 合约被选中
const mainTabs = ['自选', '合约', '热币严选']

// 子导航标签
const subTab = ref(0) // USDT本位被选中
const subTabs = ['USDT本位', 'USDC本位', '币本位']

// 搜索关键词
const searchKeyword = ref('')

// 头部高度（用于计算内容区域的 padding-top）
const headerHeight = ref(0)
const instance = getCurrentInstance()
const newCoinCardHeight = ref(0)
const scrollTop = ref(0)

onMounted(() => {
  // 计算头部高度
  nextTick(() => {
    uni.createSelectorQuery().in(instance).select('.fixed-header').boundingClientRect((data: any) => {
      if (data) {
        headerHeight.value = data.height
      }
    }).exec()

    // 计算新币卡片高度
    setTimeout(() => {
      uni.createSelectorQuery().in(instance).select('.new-coin-card').boundingClientRect((data: any) => {
        if (data) {
          newCoinCardHeight.value = data.height
        }
      }).exec()
    }, 100)
  })
})

// 监听滚动，传递滚动位置给 CoinList
function handleScroll(e: any) {
  scrollTop.value = e.detail.scrollTop
}

// 新币数据
const newCoin = ref({
  symbol: 'LIT',
  pair: 'LIT / USDT',
  label: '永续',
  expiryDate: '2025-12-24',
  price: '3.453',
  priceCny: '¥ 24.26',
  changePercent: '+3.33%',
})
</script>

<template>
  <view class="market-page min-h-screen w-full flex flex-col bg-white">
    <!-- 顶部区域：搜索 + 两排导航，固定定位，禁止滚动 -->
    <view class="fixed-header w-full bg-white">
      <!-- 顶部搜索条（占满整行） -->
      <view class="box-border w-full flex flex-col bg-white px-3 pt-[var(--status-bar-height)]">
        <view class="h-full flex items-center">
          <wd-search
            v-model="searchKeyword"
            custom-class="market-search-input"
            placeholder-left
            placeholder="USDT"
            hide-cancel
          />
        </view>
      </view>

      <!-- 主导航标签 -->
      <view class="w-full border-b border-gray-100 bg-white px-2">
        <view class="w-full flex items-center gap-0.2 overflow-x-auto">
          <view
            v-for="(tab, index) in mainTabs"
            :key="index"
            class="flex-shrink-0 cursor-pointer border-b-2 px-2 py-3 transition-colors"
            :class="mainTab === index ? 'border-black font-bold' : 'border-transparent text-gray-500'"
            @click="mainTab = index"
          >
            <wd-text
              :text="tab"
              :size="mainTab === index ? '1.15rem' : '1.0rem'"
              :color="mainTab === index ? '#000' : '#666'"
              :bold="mainTab === index"
            />
          </view>
        </view>
      </view>

      <!-- 子导航标签 -->
      <view class="w-full border-b border-gray-100 bg-white px-2">
        <view class="w-full flex items-center gap-0.2">
          <view
            v-for="(tab, index) in subTabs"
            :key="index"
            class="cursor-pointer border-b-2 px-2 py-2 transition-colors"
            :class="subTab === index ? 'border-green-500 font-bold' : 'border-transparent text-gray-500'"
            @click="subTab = index"
          >
            <wd-text
              :text="tab"
              :size="subTab === index ? '0.9rem' : '0.9rem'"
              :color="subTab === index ? '#000' : '#666'"
              :bold="subTab === index"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 主要内容：从新币上线开始允许滚动 -->
    <scroll-view
      class="content-scroll flex-1"
      :style="{ paddingTop: `${headerHeight}px` }"
      scroll-y
      @scroll="handleScroll"
    >
      <view class="flex flex-col">
        <!-- 新币上线卡片：灰色底 + 左上角 tag，价格与涨跌幅水平排列 -->
        <view class="new-coin-card relative m-1.5 mx-4 flex items-center justify-center rounded-lg bg-[#f5f5f5] px-4 py-4">
          <!-- 左上角 tag，做成绝对定位的小角标 -->
          <view class="absolute left-0 top-0 flex items-center justify-center rounded-br-lg rounded-tl-lg bg-[#e8f8ec] px-2 py-0.5">
            <wd-text text="新币上线" size="0.55rem" color="#00c853" />
          </view>

          <view class="flex flex-1 items-center justify-between">
            <view class="flex flex-1 items-center justify-start gap-3">
              <view class="h-6 w-6 flex items-center justify-center">
                <wd-img
                  src="https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/bitcoin.png"
                  width="100%"
                  height="100%"
                  mode="aspectFill"
                />
              </view>
              <view class="flex flex-1 flex-col">
                <wd-text :text="newCoin.pair" size="0.875rem" color="#000" :bold="true" />
                <view class="mt-0.5 flex inline-flex items-center justify-start">
                  <wd-text :text="newCoin.label" size="0.6rem" color="#666" custom-class="bg-[#e0e0e0] px-1 py-0.2 rounded-sm mr-0.4" />
                  <wd-text :text="newCoin.expiryDate" size="0.65rem" color="#666" />
                </view>
              </view>
            </view>
            <view class="flex flex-col items-end">
              <view class="flex items-center gap-2">
                <view class="flex flex-col items-end">
                  <wd-text :text="newCoin.price" size="0.875rem" color="#000" :bold="true" />
                  <wd-text :text="newCoin.priceCny" size="0.675rem" color="#999" />
                </view>
                <view class="flex items-center justify-center rounded bg-[#00c853] px-2 py-0.5 py-1.5">
                  <wd-text :text="newCoin.changePercent" size="0.75rem" color="#fff" />
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 币种列表 -->
        <view class="px-3 pb-4">
          <CoinList
            :header-height="headerHeight"
            :scroll-top="scrollTop"
            :threshold="newCoinCardHeight + 8"
            :enable-sticky="true"
          />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.market-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

// 固定头部：搜索栏 + 两个导航
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100vw;
  box-sizing: border-box;
}

// 内容滚动区域
.content-scroll {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

::v-deep .market-navbar {
  background-color: white !important;
}

::v-deep .market-search-input {
  width: 100vw !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
