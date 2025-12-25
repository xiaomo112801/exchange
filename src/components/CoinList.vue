<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

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

// Props：表头固定相关参数
interface Props {
  // 固定头部高度（px）
  headerHeight?: number
  // 滚动位置（如果传了则使用，不传则内部监听）
  scrollTop?: number
  // 锁定阈值（滚动超过此值后锁定表头）
  threshold?: number
  // 是否启用表头固定功能
  enableSticky?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  headerHeight: 0,
  scrollTop: undefined,
  threshold: 0,
  enableSticky: false,
})

// 表头是否锁定
const isTableHeaderSticky = ref(false)
const internalScrollTop = ref(0)
const tableContentLeft = ref(0)
const tableContentWidth = ref(0)
const instance = getCurrentInstance()

// 计算表格容器的位置和宽度，用于表头固定时对齐
function updateTableContentRect() {
  if (!props.enableSticky)
    return

  nextTick(() => {
    // 获取表格容器（coin-list-table）的位置和宽度，确保表头与表格容器对齐
    uni.createSelectorQuery().in(instance).select('.coin-list-table').boundingClientRect((tableData: any) => {
      if (tableData && tableData.width > 0) {
        // 获取表格容器的父容器（coin-list-wrapper）的位置，用于计算相对位置
        uni.createSelectorQuery().in(instance).select('.coin-list-wrapper').boundingClientRect((wrapperData: any) => {
          if (wrapperData) {
            // 使用表格容器的宽度，确保表头宽度与表格一致
            // left 位置相对于视口，但我们需要相对于父容器的位置
            tableContentLeft.value = tableData.left
            tableContentWidth.value = tableData.width
          }
        }).exec()
      }
    }).exec()
  })
}

// 当表头变为固定状态时，更新表格容器的位置和宽度
let updateInterval: ReturnType<typeof setInterval> | null = null
watch(() => isTableHeaderSticky.value, (newVal: boolean) => {
  if (newVal) {
    // 表头固定时立即更新
    updateTableContentRect()
    // 延迟再次更新，确保布局稳定
    setTimeout(() => {
      updateTableContentRect()
    }, 50)
    // 表头固定后，定期更新位置和宽度（因为滚动时位置可能变化）
    if (updateInterval) {
      clearInterval(updateInterval)
    }
    updateInterval = setInterval(() => {
      if (isTableHeaderSticky.value) {
        updateTableContentRect()
      }
      else {
        if (updateInterval) {
          clearInterval(updateInterval)
          updateInterval = null
        }
      }
    }, 200)
  }
  else {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }
})

// 清理定时器
onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
    updateInterval = null
  }
})

// 更新表头锁定状态
function updateStickyState() {
  if (!props.enableSticky) {
    isTableHeaderSticky.value = false
    return
  }

  // 如果 threshold 为 0 或未设置，不启用表头固定
  if (props.threshold <= 0) {
    isTableHeaderSticky.value = false
    return
  }

  const currentScrollTop = props.scrollTop !== undefined ? props.scrollTop : internalScrollTop.value
  if (currentScrollTop >= props.threshold) {
    isTableHeaderSticky.value = true
  }
  else {
    isTableHeaderSticky.value = false
  }
}

// 监听滚动位置变化
watch(() => props.scrollTop, (newVal: number | undefined) => {
  if (newVal !== undefined) {
    internalScrollTop.value = newVal
    updateStickyState()
  }
}, { immediate: true })

// 监听 threshold 变化
watch(() => props.threshold, () => {
  updateStickyState()
}, { immediate: true })

// 如果启用固定且没有外部传入 scrollTop，则监听页面滚动
if (props.enableSticky && props.scrollTop === undefined) {
  onPageScroll(() => {
    uni.createSelectorQuery().in(instance).selectViewport().scrollOffset((res: any) => {
      internalScrollTop.value = res.scrollTop
      updateStickyState()
    }).exec()
  })
}

// 初始化时更新一次状态
onMounted(() => {
  updateStickyState()
  updateTableContentRect()
})

// 初始化时更新一次状态
onMounted(() => {
  updateStickyState()
})

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
  return Number.isNaN(n) ? Number.NaN : n
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
  <view
    class="coin-list-wrapper w-full bg-white"
    :class="{ 'sticky-header': isTableHeaderSticky }"
    :style="{
      '--header-height': `${headerHeight}px`,
      '--table-content-left': `${tableContentLeft}px`,
      '--table-content-width': `${tableContentWidth}px`,
    }"
  >
    <!-- 表格列表：3 列 = 左（市值/成交额）| 中（最新价）| 右（24H涨跌幅），使用表头 -->
    <view class="">
      <wd-table
        :data="coins"
        size="small"
        :border="false"
        :stripe="false"
        :fixed-header="true"
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
        <wd-table-col prop="lastPrice" width="35%" label="最新价" align="right" sortable>
          <template #value="{ row }">
            <view class="flex flex-col items-end">
              <wd-text :text="row.lastPrice" size="14px" color="#000" :bold="true" />
              <wd-text :text="row.lastPriceCny" size="0.7rem" color="#999" />
            </view>
          </template>
        </wd-table-col>

        <!-- 列 3：右列 = 24H 涨跌幅（可排序），约占 30% -->
        <wd-table-col prop="changePercent" width="25%" label="24H涨跌幅" align="right" sortable>
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

    // 表头固定样式
    .coin-list-wrapper {
      position: relative;
    }

    // 使用 wd-table 的 fixed-header，结合滚动逻辑锁定表头
    .coin-list-wrapper.sticky-header {
      :deep(.wd-table__header) {
        position: fixed !important;
        top: var(--header-height, 0) !important;
        // 使用表格容器的位置和宽度，确保与表格对齐
        left: var(--table-content-left, 0) !important;
        width: var(--table-content-width, 100%) !important;
        max-width: var(--table-content-width, 100%) !important;
        min-width: var(--table-content-width, 100%) !important;
        z-index: 50 !important;
        background-color: white !important;
        box-sizing: border-box !important;
        // 确保表头始终可见
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
        // 确保表头不超出容器，限制右侧延伸
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        overflow: hidden !important;
        // 防止宽度变化
        flex-shrink: 0 !important;
        flex-grow: 0 !important;
      }

      // 确保表头 scroll-view 宽度正确
      :deep(.wd-table__header scroll-view) {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        overflow: hidden !important;
        flex-shrink: 0 !important;
        flex-grow: 0 !important;
      }

      // 确保表头内容区域宽度正确，与表格内容保持一致
      :deep(.wd-table__header .wd-table__content) {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        // 移除可能导致宽度增加的样式
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        overflow: hidden !important;
        flex-shrink: 0 !important;
        flex-grow: 0 !important;
      }

      // 确保表头单元格宽度正确
      :deep(.wd-table__header .wd-table__cell) {
        box-sizing: border-box !important;
        flex-shrink: 0 !important;
        flex-grow: 0 !important;
      }

      // 当表头固定时，给表格内容添加 padding-top，避免内容被遮挡
      :deep(.wd-table__body) {
        padding-top: 2rem;
      }
    }
  </style>
