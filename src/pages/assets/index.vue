<script setup lang="ts">
definePage({
  name: 'assets',
  style: {
    navigationBarTitleText: '资产',
    navigationStyle: 'custom',
  },
  layout: 'tabbar',
  middlewares: [
    'auth',
  ],
})

// 顶部导航标签
const topTab = ref(0) // 总览被选中
const topTabs = ['总览', '理财', '平台', '合约']

// 总资产显示
const totalAssets = ref('0.00')
const totalAssetsCny = ref('¥0.00')
const showAssets = ref(true) // 是否显示资产

const router = useRouter()

// 资产分类数据
const assetCategories = ref([
  {
    name: '现货',
    percent: '0.00%',
    value: '0.00',
    cnyValue: '¥0.00',
    color: '#00c853', // 绿色
  },
  {
    name: '合约(永续)',
    percent: '0.00%',
    value: '0.00',
    cnyValue: '¥0.00',
    color: '#ffc107', // 黄色
  },
  {
    name: '合约(交割)',
    percent: '0.00%',
    value: '0.00',
    cnyValue: '¥0.00',
    color: '#00c853', // 绿色
  },
])

// 每周收益/资产趋势标签
const chartTab = ref(0) // 每周收益被选中
const chartTabs = ['每周收益', '资产趋势']

// 跟单收益
const followEarnings = ref(['0.00', '0.00'])

// 日期列表
const dates = ref(['12-18', '12-19', '12-20', '12-21', '12-22', '12-23', '12-24'])

function toggleAssetsVisibility() {
  showAssets.value = !showAssets.value
}

// 统一的页面跳转函数
function navigateToPage(type: 'deposit' | 'withdraw' | 'transfer' | 'exchange') {
  const routeMap = {
    deposit: { name: 'coinSelect' },
    withdraw: { name: 'withdrawCoinSelect' },
    transfer: { name: 'transfer' },
    exchange: { name: 'mutual' },
  }
  router.push(routeMap[type])
}

function handleDeposit() {
  navigateToPage('deposit')
}

function handleWithdraw() {
  navigateToPage('withdraw')
}

function handleTransfer() {
  navigateToPage('transfer')
}

function handleExchange() {
  navigateToPage('exchange')
}
</script>

<template>
  <view class="assets-page min-h-screen flex flex-col bg-white">
    <!-- 顶部深色导航栏 -->
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
      fixed
      custom-style="background-color: #1a1a2e !important;"
      custom-class="assets-navbar fixed-header"
    >
      <template #title>
        <view class="w-full flex items-center justify-center">
          <wd-tabs
            v-model="topTab"
            :bordered="false"
            custom-class="top-nav-tabs"
          >
            <wd-tab
              v-for="(tab, index) in topTabs"
              :key="index"
              :title="tab"
              :name="index"
            />
          </wd-tabs>
        </view>
      </template>
    </wd-navbar>

    <!-- 主内容区 -->
    <view class="relative flex flex-1 flex-col bg-[#f5f5f5] pt-4">
      <!-- navbar 下方的背景色区域（作为背景） -->
      <view class="navbar-bg-area absolute left-0 right-0 top-0 bg-[#1a1a2e]" />
      <!-- 总资产到充值按钮的卡片 -->
      <view class="relative z-10 mx-4 mb-4 rounded-lg bg-white px-4 py-6 shadow-sm">
        <!-- 总资产显示区域 -->
        <view class="relative mb-4 overflow-hidden">
          <!-- 总资产标题和图标 -->
          <view class="relative z-10 flex items-center justify-center gap-2 pb-2">
            <wd-text text="总资产 USDT" size="0.875rem" color="#666" />
            <wd-icon name="arrow-down" size="0.75rem" color="#666" />
            <view @click="toggleAssetsVisibility">
              <wd-icon v-if="showAssets" name="browse" size="1rem" color="#666" />
              <wd-icon v-else name="browse-off" size="1rem" color="#666" />
            </view>
          </view>

          <!-- 总资产数值区域（包含半圆弧线） -->
          <view class="relative flex flex-col items-center justify-center py-4">
            <!-- 半圆形弧线 -->
            <view class="absolute inset-x-0 top-0 h-32 overflow-hidden">
              <view
                class="absolute left-1/2 h-64 w-[200%] border-4 border-gray-200 rounded-full -translate-x-1/2"
                style="top: -6rem;"
              />
            </view>

            <!-- 数值内容 -->
            <view class="relative z-10 flex flex-col items-center justify-center">
              <wd-text :text="showAssets ? totalAssets : '****'" size="2rem" color="#000" :bold="true" />
              <wd-text :text="showAssets ? totalAssetsCny : '****'" size="0.875rem" color="#999" class="mt-1" />
            </view>
          </view>
        </view>

        <!-- 资产分类 -->
        <view class="mb-4 flex items-start gap-1 rounded-lg bg-[#f5f5f5] px-0.8 py-1">
          <view
            v-for="(category, index) in assetCategories"
            :key="index"
            class="flex flex-1 items-center"
          >
            <!-- 分割线（第一项不显示） -->
            <wd-divider v-if="index > 0" vertical />
            <view class="flex flex-1 flex-col px-1 py-1">
              <view class="flex items-center gap-1">
                <!-- 色条（只在文字前面） -->
                <view
                  class="h-3 w-1 rounded"
                  :style="{ backgroundColor: category.color }"
                />
                <wd-text :text="category.name" size="0.58rem" color="#666" />
                <wd-text :text="category.percent" size="0.58rem" color="#666" />
              </view>
              <wd-text :text="showAssets ? category.value : '****'" size="1rem" color="#000" :bold="true" class="mt-2" />
              <wd-text :text="showAssets ? category.cnyValue : '****'" size="0.75rem" color="#999" class="mt-1" />
            </view>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="w-full flex items-center gap-2">
          <view class="min-w-0 flex flex-1" @click="handleDeposit">
            <wd-button
              custom-class="action-btn deposit-btn"
              block
            >
              充值
            </wd-button>
          </view>
          <view class="min-w-0 flex flex-1" @click="handleWithdraw">
            <wd-button
              custom-class="action-btn withdraw-btn"
              block
            >
              提币
            </wd-button>
          </view>
          <view class="min-w-0 flex flex-1" @click="handleTransfer">
            <wd-button
              custom-class="action-btn transfer-btn"
              block
            >
              划转
            </wd-button>
          </view>
          <view class="min-w-0 flex flex-1" @click="handleExchange">
            <wd-button
              custom-class="action-btn exchange-btn"
              block
            >
              互转
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 每周收益/资产趋势 -->
      <view class="mx-4 mb-4 flex flex-col rounded-lg bg-white px-4 py-4 shadow-sm">
        <view class="mb-3 flex items-center gap-4 border-b border-gray-100 pb-2">
          <view
            v-for="(tab, index) in chartTabs"
            :key="index"
            class="relative pb-2"
            :class="chartTab === index ? 'border-b-2 border-[#00c853]' : ''"
            @click="chartTab = index"
          >
            <wd-text
              :text="tab"
              size="0.875rem"
              :color="chartTab === index ? '#00c853' : '#666'"
              :bold="chartTab === index"
            />
          </view>
        </view>

        <!-- 图表区域（空白，带水平线） -->
        <view class="relative h-40 w-full overflow-hidden rounded">
          <view
            v-for="i in 5"
            :key="i"
            class="absolute left-0 right-0 border-t border-gray-100"
            :style="{ top: `${(i - 1) * 25}%` }"
          />
        </view>

        <!-- 日期列表 -->
        <view class="mt-4 flex items-center justify-between">
          <wd-text
            v-for="(date, index) in dates"
            :key="index"
            :text="date"
            size="0.75rem"
            color="#999"
          />
        </view>
      </view>

      <!-- 跟单收益 -->
      <view class="mx-4 mb-20 flex flex-col rounded-lg bg-white px-4 py-4 shadow-sm">
        <view class="flex items-center justify-between pb-3">
          <wd-text text="跟单收益 (USDT)" size="0.875rem" color="#000" :bold="true" />
          <wd-icon name="arrow-right" size="0.875rem" color="#666" />
        </view>
        <view class="flex items-center gap-4">
          <view class="flex flex-col">
            <wd-text :text="showAssets ? followEarnings[0] : '****'" size="1rem" color="#000" :bold="true" />
            <view class="mt-1">
              <wd-icon name="chart" size="1rem" color="#999" />
            </view>
          </view>
          <view class="flex flex-col">
            <wd-text :text="showAssets ? followEarnings[1] : '****'" size="1rem" color="#000" :bold="true" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

  <style scoped lang="scss">
  .assets-page {
    background-color: #f5f5f5;
  }

  ::v-deep .fixed-header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 100 !important;
    background-color: #1a1a2e !important;
  }

  .navbar-bg-area {
    height: 6rem !important;
    z-index: 0 !important;
  }

  /* 确保总资产卡片在背景上方 */
  .mx-4.mb-4.rounded-lg {
    position: relative;
    z-index: 1;
  }

  ::v-deep .assets-navbar {
    background-color: #1a1a2e !important;
  }

  ::v-deep .assets-navbar .wd-navbar__title {
    width: 100% !important;
    padding: 0 !important;
  }

  ::v-deep .top-nav-tabs {
    width: 100% !important;
    background-color: transparent !important;
  }

  ::v-deep .top-nav-tabs .wd-tabs__nav {
    background-color: transparent !important;
    justify-content: space-around !important;
  }

  ::v-deep .top-nav-tabs .wd-tabs__nav-item {
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 1rem !important;
  }

  ::v-deep .top-nav-tabs .wd-tabs__nav-item.is-active {
    color: #fff !important;
    font-weight: bold !important;
  }

  ::v-deep .top-nav-tabs .wd-tabs__line {
    background-color: #fff !important;
    height: 2px !important;
  }

  ::v-deep .action-btn {
    flex: 1 !important;
    min-width: 0 !important;
    width: 100% !important;
  }

  ::v-deep .deposit-btn {
    background-color: #000 !important;
    color: #fff !important;
    border: none !important;
    height: 2rem !important;
  }

  ::v-deep .deposit-btn .wd-button__content {
    color: #fff !important;
  }

  ::v-deep .withdraw-btn,
  ::v-deep .transfer-btn,
  ::v-deep .exchange-btn {
    background-color: #fff !important;
    color: #000 !important;
    border: 1px solid #e0e0e0 !important;
    height: 2rem !important;
  }

  ::v-deep .withdraw-btn .wd-button__content,
  ::v-deep .transfer-btn .wd-button__content,
  ::v-deep .exchange-btn .wd-button__content {
    color: #000 !important;
  }

  /* 分割线样式调整 */
  ::v-deep .wd-divider--vertical {
    width: 0.03125rem !important;
    min-width: 0.03125rem !important;
    height: 100% !important;
    align-self: stretch !important;
    background-color: #9ca3af !important;
    border: none !important;
    margin: 0 !important;
  }
  </style>
