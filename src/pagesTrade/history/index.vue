<script setup lang="ts">
definePage({
  name: 'tradeHistory',
  style: {
    navigationBarTitleText: '交易历史委托',
    navigationStyle: 'custom',
  },
})

const router = useRouter()

// 导航栏高度
const navbarHeight = ref(44) // 默认高度
const instance = getCurrentInstance()

// z-paging 引用
const paging = ref<any>(null)

// 历史委托列表
const historyList = ref<any[]>([])

onMounted(() => {
  // 动态计算导航栏高度
  nextTick(() => {
    setTimeout(() => {
      uni.createSelectorQuery().in(instance).select('.wd-navbar').boundingClientRect((data: any) => {
        if (data) {
          navbarHeight.value = data.height
        }
      }).exec()
    }, 200)
  })

  // 延迟一下确保 z-paging 组件已经挂载
  nextTick(() => {
    setTimeout(() => {
      // 如果 @query 没有自动触发，手动调用一次
      if (historyList.value.length === 0) {
        queryList(1, 10)
      }
    }, 300)
  })
})

// Tabs 状态
const activeTab = ref(0)
const tabs = ['全部', '待成交', '部分成交', '已完成', '已撤单']

// 生成模拟数据
function generateMockData(pageNo: number, pageSize: number) {
  const mockData = []
  const types = ['买入', '卖出']
  const orderTypes = ['限价委托', '市价委托']
  const statuses = [
    { text: '待成交', color: '#666' },
    { text: '已完成', color: '#00c853' },
    { text: '已撤单', color: '#999' },
    { text: '部分成交', color: '#ffc107' },
  ]
  const prices = ['0.00946', '0.00950', '0.00943', '0.00960', '0.00940', '0.00945', '0.00935', '0.00955']

  for (let i = 0; i < pageSize; i++) {
    const index = (pageNo - 1) * pageSize + i
    const type = types[index % 2]
    const orderType = orderTypes[index % 2]
    const status = statuses[index % 4]
    const price = prices[index % prices.length]
    const quantity = String((Math.floor(Math.random() * 3000) + 500))
    const filledQuantity = status.text === '已撤单' ? '0' : (status.text === '部分成交' ? String(Math.floor(Number.parseFloat(quantity) * 0.6)) : (status.text === '待成交' ? '0' : quantity))
    const filledPrice = (status.text === '已撤单' || status.text === '待成交') ? '-' : price
    const amount = (Number.parseFloat(price) * Number.parseFloat(quantity)).toFixed(2)

    const date = new Date()
    date.setDate(date.getDate() - Math.floor(index / 3))
    date.setHours(14 - (index % 8), 30 - (index % 30), 25 - (index % 25))
    const time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`

    mockData.push({
      id: String(index + 1),
      pair: 'STABLE/USDT',
      type,
      orderType,
      price: orderType === '市价委托' ? '-' : price,
      quantity,
      filledQuantity,
      filledPrice,
      status: status.text,
      statusColor: status.color,
      time,
      amount,
    })
  }

  return mockData
}

// 根据选中的 tab 过滤数据
const filteredHistoryList = computed(() => {
  if (activeTab.value === 0) {
    // 全部：显示所有数据
    return historyList.value
  }
  else if (activeTab.value === 1) {
    return historyList.value.filter(item => item.status === '待成交')
  }
  else if (activeTab.value === 2) {
    return historyList.value.filter(item => item.status === '部分成交')
  }
  else if (activeTab.value === 3) {
    return historyList.value.filter(item => item.status === '已完成')
  }
  else if (activeTab.value === 4) {
    return historyList.value.filter(item => item.status === '已撤单')
  }
  return historyList.value
})

// 加载历史委托数据
function queryList(pageNo: number, pageSize: number) {
  // 模拟接口延迟
  setTimeout(() => {
    const data = generateMockData(pageNo, pageSize)

    if (pageNo === 1) {
      historyList.value = data
    }
    else {
      historyList.value.push(...data)
    }

    // 通知 z-paging 数据加载完成
    if (paging.value && typeof paging.value.complete === 'function') {
      paging.value.complete(data)
    }
  }, 500)
}

// 切换 tab
function handleTabChange(index: number) {
  activeTab.value = index
}
</script>

<template>
  <view class="trade-history-page min-h-screen w-full flex flex-col bg-white">
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
        <wd-text text="历史委托" size="1rem" color="#000" :bold="true" />
      </template>
    </wd-navbar>

    <!-- Tabs -->

    <wd-tabs
      v-model="activeTab"
      swipeable
      :sticky="true"
      :bordered="true"
      animated
      custom-class="history-tabs" @change="handleTabChange"
    >
      <wd-tab
        v-for="(tab, index) in tabs"
        :key="index"
        :title="tab"
        :name="index"
      >
        <template #default>
          <!-- <z-paging> -->
          <view class="tab-content-wrapper flex flex-col px-4">
            <template v-for="(item, itemIndex) in filteredHistoryList" :key="item.id || itemIndex">
              <view class="history-item py-4.5" :class="{ 'pt-0': itemIndex === 0 }">
                <!-- 头部：交易对和类型 -->
                <view class="mb-2 flex items-center justify-between">
                  <view class="flex items-center gap-2">
                    <wd-text :text="item.pair" size="0.875rem" color="#000" :bold="true" />
                    <view
                      class="flex items-center justify-center rounded px-1.5 py-0.5"
                      :style="{ backgroundColor: item.type === '买入' ? '#00c853' : '#f44336' }"
                    >
                      <wd-text :text="item.type" size="0.75rem" :bold="true" color="#fff" />
                    </view>
                  </view>
                  <wd-text :text="item.status" size="0.75rem" :style="{ color: item.statusColor }" />
                </view>

                <!-- 订单信息 -->
                <view class="mb-2 flex flex-col gap-1">
                  <view class="flex items-center justify-between">
                    <wd-text text="订单类型" size="0.75rem" color="#666" />
                    <wd-text :text="item.orderType" size="0.75rem" color="#000" />
                  </view>
                  <view class="flex items-center justify-between">
                    <wd-text text="委托价格" size="0.75rem" color="#666" />
                    <wd-text :text="item.price" size="0.75rem" color="#000" />
                  </view>
                  <view class="flex items-center justify-between">
                    <wd-text text="委托数量" size="0.75rem" color="#666" />
                    <wd-text :text="item.quantity" size="0.75rem" color="#000" />
                  </view>
                  <view class="flex items-center justify-between">
                    <wd-text text="成交数量" size="0.75rem" color="#666" />
                    <wd-text :text="item.filledQuantity" size="0.75rem" color="#000" />
                  </view>
                  <view class="flex items-center justify-between">
                    <wd-text text="成交均价" size="0.75rem" color="#666" />
                    <wd-text :text="item.filledPrice" size="0.75rem" color="#000" />
                  </view>
                  <view class="flex items-center justify-between">
                    <wd-text text="委托金额" size="0.75rem" color="#666" />
                    <wd-text :text="`${item.amount} USDT`" size="0.75rem" color="#000" />
                  </view>
                </view>

                <!-- 时间 -->
                <view class="flex items-center justify-between pt-2">
                  <wd-text text="时间" size="0.75rem" color="#666" />
                  <wd-text :text="item.time" size="0.75rem" color="#999" />
                </view>
              </view>
              <wd-divider v-if="itemIndex < filteredHistoryList.length - 1" custom-class="divider-line" />
            </template>
          </view>
          <!-- </z-paging> -->
        </template>
      </wd-tab>
    </wd-tabs>
  </view>
</template>

<style scoped lang="scss">
.trade-history-page {
  padding-bottom: 2rem;
}

::v-deep .history-tabs {
  border: none !important;
}

::v-deep .wd-tabs__nav-container{
  column-gap: 1rem !important;
}

::v-deep .history-tabs .wd-tabs__nav {
  background-color: transparent !important;
  justify-content: flex-start !important;
  padding-left: 1rem !important;
}

::v-deep .history-tabs .wd-tabs__nav-item {
   flex:none !important;
   color: #666 !important;
   font-size: 0.875rem !important;
}

::v-deep .history-tabs .wd-tabs__content {
  width: 100vw !important;
  overflow: hidden !important;
}

.tab-content-wrapper {
  width: 100vw;
  min-width: 100vw;
  max-width: 100vw;
  box-sizing: border-box;
}

::v-deep .history-tabs .wd-tabs__nav-item.is-active {
  color: #00c853 !important;
  font-weight: bold !important;
}

::v-deep .history-tabs .wd-tabs__line {
  display:none !important;
}

::v-deep .wd-divider {
  margin: 0 !important;
  padding: 0 !important;
  height: 1px !important;
  min-height: 1px !important;
  max-height: 1px !important;
  line-height: 1px !important;
  overflow: hidden !important;
  background: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.05) 20%,
      rgba(0, 0, 0, 0.08) 50%,
      rgba(0, 0, 0, 0.05) 80%,
      transparent 100%
    ) !important;
  background-color: transparent !important;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
  box-shadow: none !important;
  color:transparent !important;
  -webkit-box-shadow: none !important;
  text-shadow: none !important;

  &::before {
    color:transparent !important;
  }

  * {
    display: none !important;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
    text-shadow: none !important;
  }
}
</style>
