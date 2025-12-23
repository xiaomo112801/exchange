<script setup lang="ts">
definePage({
  name: 'search',
  style: {
    navigationBarTitleText: '搜索',
    navigationStyle: 'custom',
    globalStyle: {
      'app-plus': {
        animationType: 'slide-in-bottom',
        animationDuration: 300,
      },
    },
  },
})

const router = useRouter()

const search = ref<string>('')

const coinList = ref<any[]>([
  {
    code: 'BTC',
    price: 89273.1,
    increase: 5.25,
    tag: '永续',
  },
  {
    code: 'ETH',
    price: 3021.5,
    increase: 4.44,
    tag: '永续',
  },
])

function cancel() {
  router.back()
}
</script>

<template>
  <!-- <wd-navbar :safe-area-inset-top="true" :bordered="false" /> -->

  <view class="search-page min-h-screen w-full flex flex-col justify-start gap-5 bg-white">
    <!-- #ifdef APP-PLUS -->
    <wd-gap bg-color="#fff" />
    <!-- #endif -->
    <view class="w-full">
      <wd-search v-model="search" placeholder-left placeholder="搜索币对" @cancel="cancel" />
    </view>
    <view class="flex flex-1 flex-col gap-5 px-5">
      <view class="flex items-center justify-start">
        <wd-icon name="icon-hot" size="0.875rem" color="#000" line-height="1rem" />
        <wd-text text="热门推荐" size="0.975rem" bold color="#000" line-height="1rem" />
      </view>
      <view class="flex flex-col justify-between gap-5">
        <template v-for="(item, index) in coinList" :key="item.code">
          <view class="flex items-center justify-between">
            <view class="px-2">
              <wd-text :text="index + 1" size="18px" />
            </view>
            <view class="flex flex-1 items-center justify-between">
              <view class="flex flex-col items-start justify-center">
                <wd-text :text="item.code" size="0.875rem" color="#000" line-height="1rem" />
                <wd-text :text="item.tag" size="0.575rem" color="#000" line-height="1rem" />
              </view>
              <view class="flex flex-col items-end justify-end">
                <wd-text :text="item.price" size="0.875rem" color="#000" line-height="1rem" />
                <wd-text :text="`${item.increase}%`" size="0.575rem" color="#000" line-height="1rem" />
              </view>
            </view>
            <view class="px-2">
              <wd-icon name="star" size="22px" />
            </view>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.search-page {
  // padding: 1rem;
}

::v-deep .wd-search__cancel {
  font-size: 0.775rem !important;
}
</style>
