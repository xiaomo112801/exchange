<script setup lang="ts">
import PairSelector from '@/components/PairSelector.vue'
import { useFavoriteCoins } from '@/composables/useFavoriteCoins'
import { useGlobalToast } from '@/composables/useGlobalToast'
// 导入标签页组件
import MarketTab from './components/MarketTab.vue'
import OverviewTab from './components/OverviewTab.vue'

definePage({
  name: 'coinDetail',
  style: {
    navigationBarTitleText: '币种详情',
    navigationStyle: 'custom',
  },
})

const router = useRouter()
const route = useRoute()
const coinId = computed(() => (route.query?.id as string) || '1')

// 使用自选列表 composable
const { isFavorite, toggleFavorite: toggleFavoriteCoin } = useFavoriteCoins()

// 使用全局 Toast
const toast = useGlobalToast()

const coinDataMap: Record<string, {
  name: string
  code: string
  icon: string
  price: number
  change: number
  changePercent: number
  high24h: number
  low24h: number
  volume24h: string
  markPrice: number
}> = {
  1: {
    name: '比特币',
    code: 'BTC',
    icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/bitcoin.png',
    price: 90870.2,
    change: 1.71,
    changePercent: 1.71,
    high24h: 91721.0,
    low24h: 87688.1,
    volume24h: '1.63万',
    markPrice: 90864.9,
  },
  2: {
    name: '以太坊',
    code: 'ETH',
    icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/ethereum.png',
    price: 3420.5,
    change: 2.15,
    changePercent: 2.15,
    high24h: 3450.8,
    low24h: 3350.2,
    volume24h: '2.45万',
    markPrice: 3418.3,
  },
  3: {
    name: 'USDT',
    code: 'USDT',
    icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
    price: 7.08,
    change: 0.01,
    changePercent: 0.14,
    high24h: 7.10,
    low24h: 7.05,
    volume24h: '10.5万',
    markPrice: 7.08,
  },
}

const coinData = computed(() => coinDataMap[coinId.value] || coinDataMap[1])

// 根据 coinId 映射交易对符号
const symbolMap: Record<string, string> = {
  1: 'BINANCE:BTCUSDT',
  2: 'BINANCE:ETHUSDT',
  3: 'BINANCE:USDTUSDT',
}

const tradingSymbol = computed(() => {
  return symbolMap[coinId.value] || 'BINANCE:BTCUSDT'
})

// 标签页
const tabIndex = ref(0)

// 检查当前币对是否在自选列表中
const isFavorited = computed(() => isFavorite(coinId.value))

// 交易对弹窗
const showPairPopup = ref(false)
const pairTabIndex = ref(1) // 0自选 1合约 2现货
const pairSubTabIndex = ref(0) // 0 USDT本位 1 USDC本位 2 币本位
const pairList = ref([
  { name: 'POWER', pair: 'POWER/USDT', price: '0.21037', cny: '¥ 1.48', change: '+0.25%', badge: '新币上线' },
  { name: 'BTC', pair: 'BTC/USDT', price: '92,062.4', cny: '¥ 650,890.37', change: '+3.10%' },
  { name: 'ETH', pair: 'ETH/USDT', price: '3,168.9', cny: '¥ 22,404.43', change: '+4.44%' },
  { name: 'LTC', pair: 'LTC/USDT', price: '83.82', cny: '¥ 592.61', change: '+1.98%' },
  { name: 'XRP', pair: 'XRP/USDT', price: '2.104', cny: '¥ 14.87', change: '+3.61%' },
  { name: 'ETC', pair: 'ETC/USDT', price: '13.543', cny: '¥ 95.75', change: '+2.29%' },
  { name: 'BSV', pair: 'BSV/USDT', price: '20.5', cny: '¥ 144.93', change: '+1.44%' },
  { name: 'BCH', pair: 'BCH/USDT', price: '601.74', cny: '¥ 4,254.36', change: '+1.71%' },
  { name: 'DOGE', pair: 'DOGE/USDT', price: '0.14399', cny: '¥ 1.04', change: '+3.44%' },
])

function handlePairSelect(_item: any) {
  showPairPopup.value = false
}

function toggleFavorite() {
  // 将当前币对数据转换为 CoinListItem 格式
  const coinItem = {
    id: Number.parseInt(coinId.value),
    symbol: coinData.value.code,
    pair: `${coinData.value.code} / USDT`,
    label: '永续',
    volumeText: coinData.value.volume24h || '0',
    lastPrice: String(coinData.value.price),
    lastPriceCny: `¥ ${coinData.value.price}`,
    changePercent: `${coinData.value.changePercent > 0 ? '+' : ''}${coinData.value.changePercent}%`,
  }
  toggleFavoriteCoin(coinItem)
}

function handleOpenPosition() {
  // 开仓逻辑
  console.log('开仓')
}

function handleClosePosition() {
  // 平仓逻辑
  console.log('平仓')
}

// 分享相关
const showSharePopup = ref(false)
const shareCanvasId = 'share-canvas'
const instance = getCurrentInstance()

// 生成页面图片并分享
async function handleShare() {
  try {
    // 显示分享弹窗
    showSharePopup.value = true
  }
  catch (error) {
    console.error('分享失败:', error)
    uni.showToast({
      title: '分享失败',
      icon: 'none',
    })
  }
}

// 生成页面截图
async function capturePageImage(): Promise<string> {
  return new Promise((resolve, reject) => {
    // 获取系统信息
    const systemInfo = uni.getSystemInfoSync()
    const width = systemInfo.windowWidth
    const height = systemInfo.windowHeight

    // 创建 canvas 上下文
    const ctx = uni.createCanvasContext(shareCanvasId, instance)

    // 设置 canvas 尺寸
    const canvasWidth = width
    const canvasHeight = height * 2 // 增加高度以包含滚动内容

    // 绘制背景
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // 绘制导航栏
    ctx.setFillStyle('#ffffff')
    ctx.fillRect(0, 0, canvasWidth, 44)

    // 绘制币对信息
    ctx.setFillStyle('#000000')
    ctx.setFontSize(16)
    ctx.fillText(`${coinData.value.code}/USDT`, 50, 30)

    // 绘制价格信息
    ctx.setFontSize(28)
    ctx.fillText(String(coinData.value.price), 20, 100)

    ctx.setFontSize(14)
    ctx.setFillStyle('#666666')
    ctx.fillText(`≈¥${(coinData.value.price * 7.08).toFixed(2)}`, 20, 130)

    const changeColor = coinData.value.changePercent > 0 ? '#00c853' : '#f44336'
    ctx.setFillStyle(changeColor)
    ctx.fillText(
      `${coinData.value.changePercent > 0 ? '+' : ''}${coinData.value.changePercent}%`,
      20,
      150,
    )

    // 绘制 24H 数据
    ctx.setFontSize(12)
    ctx.setFillStyle('#999999')
    ctx.fillText('24H最高', canvasWidth - 120, 100)
    ctx.setFillStyle('#000000')
    ctx.fillText(String(coinData.value.high24h), canvasWidth - 120, 120)

    ctx.setFillStyle('#999999')
    ctx.fillText('24H最低', canvasWidth - 120, 150)
    ctx.setFillStyle('#000000')
    ctx.fillText(String(coinData.value.low24h), canvasWidth - 120, 170)

    // 绘制提示文字
    ctx.setFontSize(12)
    ctx.setFillStyle('#999999')
    ctx.fillText('（图表区域）', canvasWidth / 2 - 40, 300)

    // 执行绘制
    ctx.draw(false, () => {
      // 将 canvas 转换为临时文件
      uni.canvasToTempFilePath({
        canvasId: shareCanvasId,
        success: (res) => {
          resolve(res.tempFilePath)
        },
        fail: (err) => {
          reject(err)
        },
      }, instance)
    })
  })
}

// 下载图片
async function handleDownloadImage() {
  try {
    toast.show({
      msg: '正在生成图片...',
      iconName: 'loading',
      duration: 2000,
    })

    // 关闭分享弹窗
    showSharePopup.value = false

    // 等待一下确保页面渲染完成
    await new Promise(resolve => setTimeout(resolve, 500))

    // 生成截图
    const imagePath = await capturePageImage()

    // 保存到相册
    uni.saveImageToPhotosAlbum({
      filePath: imagePath,
      success: () => {
        toast.success('保存成功')
      },
      fail: (err: any) => {
        console.error('保存失败:', err)
        toast.error('保存失败')
      },
    })
  }
  catch (error) {
    console.error('下载图片失败:', error)
    toast.error('操作失败')
  }
}

// 分享图片
async function handleShareImage() {
  try {
    toast.show({
      msg: '正在生成图片...',
      iconName: 'loading',
      duration: 2000,
    })

    // 关闭分享弹窗
    showSharePopup.value = false

    // 等待一下确保页面渲染完成
    await new Promise(resolve => setTimeout(resolve, 500))

    // 生成截图
    const imagePath = await capturePageImage()

    // 使用 uni.share 分享
    // #ifdef APP-PLUS
    uni.share({
      provider: 'weixin',
      scene: 'WXSceneSession',
      type: 2, // 分享图片
      imagePath,
      success: () => {
        toast.success('分享成功')
      },
      fail: (err: any) => {
        console.error('分享失败:', err)
        toast.error('分享失败')
      },
    })
    // #endif

    // #ifdef H5
    // H5 环境使用 Web Share API
    if (navigator.share) {
      try {
        // 将图片转换为 Blob
        const response = await fetch(imagePath)
        const blob = await response.blob()
        const file = new File([blob], 'share.png', { type: 'image/png' })

        await navigator.share({
          title: `${coinData.value.code}/USDT 行情`,
          text: `当前价格: ${coinData.value.price}，涨跌幅: ${coinData.value.changePercent}%`,
          files: [file],
        })
        toast.success('分享成功')
      }
      catch (err: any) {
        console.error('分享失败:', err)
        toast.error('分享失败')
      }
    }
    else {
      toast.error('当前环境不支持分享')
    }
    // #endif

    // #ifdef MP-WEIXIN
    // 微信小程序使用分享功能
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
    // #endif
  }
  catch (error) {
    console.error('分享图片失败:', error)
    toast.error('分享失败')
  }
}
</script>

<template>
  <view class="detail-page mx-auto h-full min-h-screen w-full flex flex-col bg-gray-50">
    <wd-navbar
      safe-area-inset-top
      placeholder
      :bordered="false"
      fixed
      custom-style="background-color: white !important;"
      custom-class="coin-detail-navbar"
    >
      <template #left>
        <wd-icon name="arrow-left" size="20px" color="#000" @click="router.back()" />
      </template>
      <template #title>
        <view class="flex items-center justify-center gap-2" @click="showPairPopup = true">
          <wd-img :src="coinData.icon" width="24px" height="24px" />
          <wd-text :text="`${coinData.code}/USDT`" size="16px" color="#000" :bold="true" />
          <view class="inline-flex items-center justify-center rounded-md bg-gray-100 px-2 py-1 leading-none">
            <wd-text text="永续" size="12px" color="#666" />
          </view>
          <wd-icon name="arrow-down" size="12px" color="#666" />
        </view>
      </template>
      <template #right>
        <view class="relative z-2 min-w-[88px] flex items-center justify-end gap-3">
          <wd-icon
            :name="isFavorited ? 'star-filled' : 'star'"
            size="18px"
            :color="isFavorited ? '#ffd700' : '#666'"
            @click="toggleFavorite"
          />
          <wd-icon name="share" size="18px" color="#666" @click="handleShare" />
        </view>
      </template>
    </wd-navbar>
    <view class="box-border w-full flex flex-col pt-9">
      <!-- 标签页 -->
      <view class="bg-white px-4">
        <BaseTabs v-model="tabIndex" :bordered="false" custom-class="login-tabs">
          <wd-tab title="行情" :name="0">
            <MarketTab :coin-data="coinData" :trading-symbol="tradingSymbol" />
          </wd-tab>
          <wd-tab title="概况" :name="1">
            <OverviewTab :coin-data="coinData" />
          </wd-tab>
          <!-- 数据标签页内容 -->
          <!-- <wd-tab title="数据" :name="2">
            <view class="px-5 py-4">
              <wd-text text="数据 内容" size="14px" color="#666" />
            </view>
          </wd-tab> -->

          <!-- 热币严选标签页内容 -->
          <!-- <wd-tab title="热币严选" :name="3">
            <view class="px-5 py-4">
              <wd-text text="热币严选 内容" size="14px" color="#666" />
            </view>
          </wd-tab> -->
        </BaseTabs>
      </view>
    </view>

    <!-- 底部操作栏（弹窗显示时隐藏） -->
    <view
      v-if="!showPairPopup && !showSharePopup"
      class="fixed bottom-0 left-0 right-0 z-100 h-[60px] flex items-center justify-between border-t border-gray-200 bg-white px-3 py-2"
    >
      <view class="flex flex-nowrap items-center gap-3 px-1">
        <wd-icon name="more" size="20px" color="#666" />
        <wd-text text="杠杆" size="14px" color="#666" class="whitespace-nowrap" />
        <wd-text text="现货" size="14px" color="#666" class="whitespace-nowrap" />
      </view>
      <view class="flex flex-nowrap items-center gap-2 px-1">
        <wd-button type="success" size="large" custom-class="action-btn shrink-0" @click="handleOpenPosition">
          <wd-text text="开仓" size="14px" color="#fff" custom-class="whitespace-nowrap" />
        </wd-button>
        <wd-button type="error" size="large" custom-class="action-btn shrink-0" @click="handleClosePosition">
          <wd-text text="平仓" size="14px" color="#fff" custom-class="whitespace-nowrap" />
        </wd-button>
      </view>
    </view>

    <!-- 交易对选择弹窗（公共组件） -->
    <wd-popup
      v-model="showPairPopup"
      position="bottom"
      round
      radius="12px 12px 0 0"
      custom-class="pair-popup"
      custom-style="height: 65vh; max-height: 65vh;"
    >
      <PairSelector
        :active-tab="pairTabIndex"
        :active-sub-tab="pairSubTabIndex"
        :pairs="pairList"
        :selected-code="coinData.code"
        @update:active-tab="pairTabIndex = $event"
        @update:active-sub-tab="pairSubTabIndex = $event"
        @select="handlePairSelect"
      />
    </wd-popup>

    <!-- 分享弹窗 -->
    <wd-popup
      v-model="showSharePopup"
      position="bottom"
      round
      radius="12px 12px 0 0"
      custom-class="share-popup"
      custom-style="z-index: 1000 !important;"
    >
      <view class="flex flex-col p-4 pb-6">
        <view class="mb-4 text-center">
          <wd-text text="分享图片" size="1rem" color="#000" :bold="true" />
        </view>
        <view class="flex items-center justify-around gap-4">
          <view class="flex flex-col items-center gap-2" @click="handleDownloadImage">
            <view class="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
              <wd-icon name="download" size="24px" color="#666" />
            </view>
            <wd-text text="下载图片" size="0.875rem" color="#666" />
          </view>
          <view class="flex flex-col items-center gap-2" @click="handleShareImage">
            <view class="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
              <wd-icon name="share" size="24px" color="#666" />
            </view>
            <wd-text text="分享图片" size="0.875rem" color="#666" />
          </view>
        </view>
      </view>
    </wd-popup>

    <!-- 隐藏的 canvas 用于生成图片 -->
    <canvas
      :canvas-id="shareCanvasId"
      :style="{ position: 'fixed', top: '-9999px', width: '100%', height: '100%' }"
    />
  </view>
</template>

<style scoped lang="scss">
::v-deep .login-tabs {
  border: none !important;
  width: 100% !important;

}

::v-deep .login-tabs .wd-tabs__nav-container {
  padding: 0 !important; /* 使用父级 px-4 的留白 */
  margin-left: -0.3rem !important;
  box-sizing: border-box !important;
}

/* 去掉头部包裹层的默认内边距，确保与内容左侧对齐 */
::v-deep .login-tabs .wd-tabs__header {
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .login-tabs .wd-tabs__nav-wrap {
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .login-tabs .wd-tabs__nav {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .login-tabs .wd-tabs__nav-item {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 6px !important; /* 留少量间距 */
  flex: none;
  text-align: center;
}

::v-deep .login-tabs .wd-tabs__nav-item.is-active {
  color: #00c853 !important;
  font-weight: bold !important;
}

::v-deep .login-tabs .wd-tabs__line {
  background-color: #00c853 !important;
  height: 2px !important;
}

/* 调整 navbar 标题与左侧间距，使标题更靠左且不遮挡返回键 */
::v-deep .coin-detail-navbar .wd-navbar__left {
  padding-left: 0.5rem !important;
  min-width: 40px !important;
}

::v-deep .coin-detail-navbar .wd-navbar__content {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
  min-height: 44px !important;
  flex: 1;
  box-sizing: border-box !important;
  background-color: white !important;
}

::v-deep .coin-detail-navbar .wd-navbar__title {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  flex: 1 !important;
  margin-left: 1.75rem !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* 防止 navbar 内容溢出视口宽度 */
::v-deep .coin-detail-navbar {
  width: 100% !important;
  box-sizing: border-box !important;
  background-color: white !important;
}

::v-deep .coin-detail-navbar .wd-navbar {
  background-color: white !important;
}

::v-deep .coin-detail-navbar .wd-navbar__wrapper {
  background-color: white !important;
}

::v-deep .coin-detail-navbar .wd-navbar__content {
  background-color: white !important;
}

/* 交易对选择弹窗高度 */
::v-deep .pair-popup {
  height: 75vh !important;
  max-height: 75vh !important;
  border-top-left-radius: 1.2rem !important;
  border-top-right-radius: 1.2rem !important;
}

::v-deep .action-btn {
  min-width: 80px !important;
  height: 40px !important;
  border-radius: 4px !important;
}

::v-deep .action-btn.wd-button--success {
  background-color: #00c853 !important;
}

::v-deep .action-btn.wd-button--error {
  background-color: #f44336 !important;
}

/* 分享弹窗样式 */
::v-deep .share-popup {
  z-index: 1000 !important;
}

::v-deep .share-popup .wd-popup {
  z-index: 1000 !important;
}
</style>
