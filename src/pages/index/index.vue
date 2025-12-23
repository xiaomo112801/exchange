<script setup lang="ts">
definePage({
  name: 'index',
  style: {
    navigationStyle: 'custom',
  },
})

const router = useRouter()
// const search = ref<string>('')
const notificationCount = ref<number>(12)

const swiperList = ref<any[]>([
  [
    {
      icon: 'i-carbon:gift',
      title: '福利中心',
    },
    {
      icon: 'i-carbon:collaborate',
      title: '邀请奖励',
    },
    {
      icon: 'i-carbon:piggy-bank',
      title: '热币严选',
    },
    {
      icon: 'i-carbon:ibm-secure-infrastructure-on-vpc-for-regulated-industries',
      title: 'web3钱包',
    },
  ],
  [
    {
      icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
      title: 'nav 5',
    },
    {
      icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
      title: 'nav 6',
    },

    {
      icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
      title: 'nav 7',
    },

    {
      icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
      title: 'nav 8',
    },
  ],
])

// 类型转换，用于 swiper 组件
const swiperListForComponent = computed(() => swiperList.value as unknown as any[])

const bannerList = ref<any[]>([
  {
    img: '/static/images/banner1.png',
    title: 'banner 1',
  },
  {
    img: '/static/images/banner2.png',
    title: 'banner 2',
  },
])

const bannerIndicator = ref<any>({
  type: 'dots-bar',
  customClass: 'nav-swiper-indicator',
})

const mainCoinList = ref<any[]>([
  {
    id: 1,
    icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/bitcoin.png',
    coinName: '比特币',
    coinCode: 'BTC',
    total: 10000.31,
    increase: 5.25,
    tag: '主流币',
    tag2: '永续',
  },
  {
    id: 2,
    icon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/ethereum.png',
    coinName: '以太坊',
    coinCode: 'ETH',
    total: 10000.21,
    increase: 5.25,
    tag: '主流币',
    tag2: '永续',
  },
  {
    id: 3,
    icon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
    coinName: 'USDT',
    coinCode: 'USDT',
    total: 0,
    increase: 5.25,
    tag: '理财赚币-定期宝',
    tag2: '永续',
  },
])
const mainCoinListForSwiper = computed(() => mainCoinList.value as unknown as any[])

const tabIndex = ref<number>(0)

const tabList = ref<any[]>([
  {

    title: '我的',
  },
  {

    title: '热门合约',
  },
  {

    title: '榜单',
  },
  {

    title: '新币',
  },
])

function focus() {
  router.push({ path: '/pages/index/search' })
}

function coinItem(item: unknown) {
  return item as Record<string, any>
}

// 辅助函数：获取导航项数组
function getNavItems(item: any): any[] {
  return Array.isArray(item) ? item : []
}

function handleChange(item: any) {
  console.log(item)
}

const selectIconItem = ref<number[]>([
  1,
  2,
  3,
])
</script>

<template>
  <view class="index-page h-full min-h-screen flex flex-col bg-white">
    <wd-navbar
      safe-area-inset-top
      placeholder
      title="首页" :bordered="false" fixed
      custom-style="background-color: white !important; font-weight:normal !important;"
    >
      <template #left>
        <wd-img
          src="https://s2023.oss-cn-qingdao.aliyuncs.com/resource/svg/light/user.svg?2.0.1764298912568" width="30"
          height="30"
        />
      </template>
      <template #right>
        <wd-badge v-model="notificationCount" is-dot :top="10">
          <wd-icon name="notification" size="23" color="#000" @click="navigateTo({ name: 'notice' })" />
        </wd-badge>
      </template>
    </wd-navbar>
    <view class="box-border w-full flex flex-col p-3 pt-2">
      <view class="h-full flex items-center justify-start pb-5">
        <wd-search custom-class="search-input" placeholder-left hide-cancel @focus="focus" />
        <wd-icon name="scan" size="20" class="search-scan-icon pl-3" />
      </view>
      <view class="relative flex flex-1 items-center justify-start">
        <wd-img src="/static/images/recharge.png" width="100%" height="100%" mode="widthFix" />
        <view class="absolute ml-3 flex flex-1 flex-col items-start justify-start">
          <view>
            <wd-text text="总资产" size="10px" color="#9f9f9f" line-height="1rem" class="mr-1" />
            <wd-icon name="view" size="10px" color="#9f9f9f" />
          </view>
          <view class="mt-5 flex items-end justify-center">
            <wd-text text="0.00" mode="price" size="24px" color="#fff" line-height="1rem" />
            <wd-text text="USDT" size="12px" color="#fff" line-height="1rem" class="ml-2" />
            <wd-icon name="fill-arrow-down" size="16px" color="#fff" />
          </view>
          <view class="mt-2 flex items-end justify-center">
            <wd-text
              text="今日盈亏" size="10px" color="#9f9f9f" line-height="1rem" class="mr-2"
              custom-class="profit-label"
            />
            <wd-text text="0.00" mode="10px" size="12px" color="#9f9f9f" line-height="1rem" />
          </view>
        </view>
        <view>
          <wd-button type="success" size="large" custom-class="recharge-btn" @click="navigateTo({ name: 'recharge' })">
            <wd-text text="充值" size="14px" color="#000" />
            <wd-icon name="arrow-up1" size="14px" custom-class="arrow-up1-icon" />
          </wd-button>
        </view>
      </view>
      <view class="relative w-full flex items-center">
        <wd-swiper
          :circular="true" :autoplay="false" text-key="title" value-key="img" class="flex-1"
          :list="swiperListForComponent" custom-class="nav-swiper" :indicator="{ type: 'dots-bar' }" height="5rem"
          :loop="false" custom-indicator-class="nav-swiper-indicator"
        >
          <template #default="{ item }">
            <view class="w-full flex items-center justify-start">
              <view
                v-for="navItem in getNavItems(item)" :key="navItem.img"
                class="flex flex-1 flex-col items-center justify-center px-3"
              >
                <text :class="navItem.icon" class="text-20px" />
                <wd-text
                  :text="navItem.title" size="11px" color="#000" line-height="1rem" class="mt-1 text-center"
                  custom-class="nav-text"
                />
              </view>
            </view>
          </template>
        </wd-swiper>
        <view class="ml-3 flex flex-col items-center justify-center px-3 pt-1">
          <wd-icon name="app" size="20px" />
          <wd-text text="更多" size="11px" color="#000" line-height="1rem" class="mt-1" custom-class="nav-text" />
        </view>
      </view>
      <view class="border-1 border-gray-300 rounded-lg border-solid">
        <wd-swiper
          :list="bannerList" value-key="img" height="5rem" :indicator="bannerIndicator" class="w-full"
          custom-indicator-class="nav-swiper-indicator"
        />
      </view>
      <view class="mt-3 w-full">
        <wd-swiper
          :circular="false" :autoplay="false" :loop="false" :display-multiple-items="2.1" height="7rem"
          :list="mainCoinListForSwiper" :indicator="false" custom-class="coin-swiper"
        >
          <template #default="{ item }">
            <view
              class="ml-0 flex flex-1 flex-col items-start justify-center gap-1 rounded-lg bg-gray-100 p-3"
              @click="navigateTo({ name: 'coinDetail', query: { id: String(coinItem(item).id) } })"
            >
              <view class="flex items-center justify-start">
                <wd-img :src="coinItem(item).icon" width="20px" height="20px" />
                <wd-text
                  :text="coinItem(item).tag" size="0.6rem" color="#000"
                  class="ml-1 whitespace-nowrap rounded-1 bg-gray-200 px-1 py-0.5"
                />
              </view>
              <view class="flex items-center justify-start">
                <wd-text
                  :text="coinItem(item).coinCode" size="0.8rem" :bold="true" color="#b5b5b5"
                  line-height="1rem"
                />
                <wd-text
                  :text="coinItem(item).tag2" size="0.5rem" color="#000"
                  class="ml-1 rounded-0.5 bg-gray-200 px-1"
                />
              </view>
              <wd-text
                :text="String(coinItem(item).total)" size="0.9rem" mode="price" color="#000"
                line-height="1rem"
              />
              <wd-text :text="`${coinItem(item).increase}%`" size="0.9rem" color="#000" line-height="1rem" />
            </view>
          </template>
        </wd-swiper>
      </view>
      <view class="w-full">
        <wd-tabs v-model="tabIndex" :bordered="false" custom-class="login-tabs" class="w-full">
          <block v-for="item in tabList" :key="item.title">
            <wd-tab :title="item.title">
              <view class="tab-content mt-2">
                <wd-checkbox-group v-model="selectIconItem" class="w-full">
                  <view class="tab-grid grid grid-cols-2 gap-2">
                    <template v-for="item in mainCoinListForSwiper" :key="item">
                      <view class="relative">
                        <view
                          class="ml-0 flex flex-1 flex-col items-start justify-center gap-1 rounded-lg bg-gray-100 p-3"
                        >
                          <view class="mr-1 flex items-center justify-start">
                            <wd-text
                              :text="coinItem(item).coinCode" size="0.8rem" :bold="true" color="#000"
                              line-height="1rem"
                            />
                            <wd-text
                              :text="coinItem(item).tag2" size="0.5rem" color="#000"
                              class="ml-1 rounded-0.5 bg-gray-200 px-1"
                            />
                          </view>
                          <view class="flex items-center justify-start">
                            <view>
                              <wd-text
                                :text="String(coinItem(item).total)" size="0.7rem" mode="price" color="#000"
                                line-height="1rem"
                              />
                            </view>

                            <view>
                              <wd-text text="-" size="0.7rem" color="#000" line-height="1rem" />
                              <wd-text
                                :text="`${coinItem(item).increase}%`" size="0.7rem" color="#000"
                                line-height="1rem"
                              />
                            </view>
                          </view>
                        </view>
                        <view class="absolute right-0 top-1/2 -translate-y-1/2">
                          <wd-checkbox
                            :model-value="coinItem(item).id" checked-color="#000"
                            @change="handleChange(coinItem(item))"
                          />
                        </view>
                      </view>
                    </template>
                  </view>
                </wd-checkbox-group>
              </view>
            </wd-tab>
          </block>
        </wd-tabs>
      </view>
    </view>
    <wd-gap bg-color="#fff" :safe-area-inset-bottom="true" height="var(--wot-tabbar-height, 50px)" />
  </view>
</template>

<style scoped lang="scss">
.index-page {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: flex-start;
}

::v-deep .search-input {
  background-color: #f1f1f1 !important;
  border-radius: 2rem !important;
  padding: 0 1rem !important;
  height: 1.875rem !important;
  line-height: 1.875rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

::v-deep .search-input .wd-search__input {
  display: flex;
  align-items: center;
  height: 100%;
}

::v-deep .search-input .wd-search__input-placeholder {
  display: flex;
  align-items: center;
  line-height: 1.875rem;
  height: 1.875rem;
}

::v-deep .recharge-btn {
  border: none !important;
  background: #97e763 !important;
  color: #000 !important;
  padding: 0.95rem 1.5rem !important;
  border-radius: 0.9rem 0.5rem 0.9rem 0.5rem !important;
  height: 1.9rem !important;
  min-width: 5.5rem;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  position: absolute;
  right: 0;
  bottom: 0;
}

::v-deep .profit-label .wd-text__inner {
  text-decoration: underline;
  text-decoration-style: dotted;
  text-underline-offset: 2px;
}

/* navbar 内容左右边距与页面内容一致 */
::v-deep .wd-navbar__left {
  padding-left: 1.25rem !important;
}

::v-deep .wd-navbar__right {
  padding-right: 1.25rem !important;
}

/* 让指示器相对整行容器居中：外层 view 使用 relative，这里把 swiper 本身设为 static，避免成为定位参照 */
::v-deep .nav-swiper {
  position: static !important;
  padding-left: 0 !important;
}

::v-deep .nav-swiper .wd-swiper__item {
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .coin-swiper {
  width: 100%;
}

::v-deep .coin-swiper .wd-swiper__item {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem !important;
  padding-right: 0.25rem;
  padding-left: 0.25rem;
}

/* Tabs 样式沿用登录页 */
::v-deep .login-tabs {
  border: none !important;
  width: 100% !important;
}

// ::v-deep .login-tabs .wd-tabs__nav-container {
//   padding: 0 !important;
//   margin: 0 !important;
// }

::v-deep .login-tabs .wd-tabs__nav {
  display: flex !important;
  align-items: center !important;
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .login-tabs .wd-tabs__nav-item {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 0.5rem !important;
  flex: none;
  text-align: center;
  font-weight: bolder !important;
  color: #9f9f9f !important;
}

::v-deep .login-tabs .wd-tabs__nav-item.is-active {
  color: #000 !important;
}

/* Tabs 内容整体居中 */
.tab-content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.tab-grid {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

::v-deep .nav-swiper-indicator {
  position: absolute;
  top: 4.5rem;
  left: 50%;
  transform: translateX(-50%);
}

/* 导航文案不换行 */
::v-deep .nav-text {
  white-space: nowrap !important;
  word-break: keep-all !important;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  min-width: max-content;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .nav-text .wd-text__inner {
  white-space: nowrap !important;
  word-break: keep-all !important;
  display: inline-block !important;
}

::v-deep .wd-swiper-nav__item--dots-bar {
  background-color: #ccc !important;
  width: var(--wot-swiper-nav-dot-size, 0.1rem);
  height: var(--wot-swiper-nav-dot-size, 0.1rem);
}

::v-deep .wd-swiper-nav__item--dots-bar.is-active {
  background-color: #000 !important;
  width: var(--wot-swiper-nav-dot-size, 0.5rem);
}

::v-deep .arrow-up1-icon {
  transform: rotate(45deg);
  transform-origin: center;
}

/* 重置 checkbox 的 margin */
.tab-grid .relative ::v-deep .wd-checkbox {
  margin: 0 !important;
  margin-bottom: 0 !important;
}

.tab-grid .relative ::v-deep .wd-checkbox__wrapper {
  margin: 0 !important;
  margin-bottom: 0 !important;
}

.tab-grid .relative {
  margin-bottom: 0 !important;
}

::v-deep .wd-checkbox-group {
  margin: 0 !important;
}

::v-deep .wd-checkbox-group .wd-checkbox {
  margin: 0 !important;
  margin-bottom: 0 !important;
}
</style>
