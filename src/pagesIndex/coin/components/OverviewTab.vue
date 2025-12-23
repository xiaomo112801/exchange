<script setup lang="ts">
import BaseTabs from '@/components/BaseTabs.vue'

// 概况页子标签
const overviewTabIndex = ref(0)
const overviewTabList = ref([
  { title: '币种信息' },
  // { title: '合约信息' },
  // { title: '仓位档位' },
  // { title: '资金费率历史' },
])

// 币种详细信息（示例数据，实际应从API获取）
const coinDetailInfo = computed(() => ({
  name: 'Bitcoin',
  code: 'BTC',
  rank: 1,
  marketCap: '12.71万亿',
  fullyDilutedMarketCap: '13.37万亿',
  tradingVolumeToMarketCap: '3.00%',
  marketShare: '58.65%',
  circulatingSupply: '1,995.95万',
  maxSupply: '2,100.00万',
  totalSupply: '1,995.95万',
  issueDate: '2010-07-13',
  historicalHigh: { price: '¥892,435.14', date: '2025-10-07' },
  historicalLow: { price: '¥0.34', date: '2010-07-15' },
  description: 'BTC是目前使用最为广泛的一种数字货币,它诞生于2009年1月3日,是一种点对点(P2P)传输的数字加密货币,总量2100万枚。比特币网络每10分钟释放出一定数量币,预计在2140年达到极限。比特币被投资为"数字黄金"。比特币依据特定算法,通过大量的产生,不依靠特定货币机构发行,其使用整个P2P网络中众多节点构成的分布式数据库来确认并记录所有的交易行为,并使用密码学设计确保货币流通各个环节安全性,可确保无法通过大量制造比特币来人为操控币值。基于密码学的设计可以使比特币只能被真实拥有者转移、支付及兑现。同样确保了货币所有权与流通交易的匿名性。',
  officialLinks: [
    { name: '官网', icon: '🌐', url: 'https://bitcoin.org' },
    { name: '白皮书', icon: '📄', url: 'https://bitcoin.org/bitcoin.pdf' },
    { name: 'Github', icon: '💻', url: 'https://github.com/bitcoin' },
    { name: '区块浏览器', icon: '🔍', url: 'https://blockchain.info' },
  ],
  socialLinks: [
    { name: 'Reddit', icon: '💬', url: 'https://reddit.com/r/bitcoin' },
  ],
}))
</script>

<template>
  <view class="min-h-[calc(100vh-200px)] bg-white">
    <!-- 子标签 -->

    <!-- 币种信息子标签内容 -->
    <view class="pb-8">
      <!-- 币种标题 -->
      <view class="flex items-center gap-2 border-b border-gray-200 pb-4">
        <image :src="coinData.icon" class="h-8 w-8" mode="aspectFit" />
        <wd-text :text="`${coinDetailInfo.name} ${coinDetailInfo.code}`" size="18px" color="#000" :bold="true" />
      </view>

      <!-- 币种详细信息 -->
      <view class="mt-4">
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="排名" size="14px" color="#666" />
          <wd-text :text="`No.${coinDetailInfo.rank}`" size="14px" color="#000" />
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="市值" size="14px" color="#666" />
          <wd-text :text="`¥${coinDetailInfo.marketCap}`" size="14px" color="#000" />
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="完全稀释市值" size="14px" color="#666" />
          <wd-text :text="`¥${coinDetailInfo.fullyDilutedMarketCap}`" size="14px" color="#000" />
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="交易额/市值(24小时)" size="14px" color="#666" />
          <wd-text :text="coinDetailInfo.tradingVolumeToMarketCap" size="14px" color="#000" />
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="市场占有率" size="14px" color="#666" />
          <wd-text :text="coinDetailInfo.marketShare" size="14px" color="#000" />
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="流通供应量" size="14px" color="#666" />
          <wd-text :text="coinDetailInfo.circulatingSupply" size="14px" color="#000" />
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="最大供应量" size="14px" color="#666" />
          <wd-text :text="coinDetailInfo.maxSupply" size="14px" color="#000" />
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="总供应量" size="14px" color="#666" />
          <wd-text :text="coinDetailInfo.totalSupply" size="14px" color="#000" />
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="发行日期" size="14px" color="#666" />
          <wd-text :text="coinDetailInfo.issueDate" size="14px" color="#000" />
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="历史最高价" size="14px" color="#666" />
          <view class="flex flex-col items-end">
            <wd-text :text="coinDetailInfo.historicalHigh.price" size="14px" color="#000" />
            <wd-text :text="coinDetailInfo.historicalHigh.date" size="12px" color="#999" />
          </view>
        </view>
        <view class="min-h-[24px] flex items-center justify-between border-b border-gray-100 py-3">
          <wd-text text="历史最低价" size="14px" color="#666" />
          <view class="flex flex-col items-end">
            <wd-text :text="coinDetailInfo.historicalLow.price" size="14px" color="#000" />
            <wd-text :text="coinDetailInfo.historicalLow.date" size="12px" color="#999" />
          </view>
        </view>
      </view>

      <!-- 官方链接 -->
      <!-- <view class="mt-6">
        <wd-text text="官方链接" size="16px" color="#000" :bold="true" class="mb-3 block" />
        <view class="grid grid-cols-4 gap-3">
          <view
            v-for="link in coinDetailInfo.officialLinks" :key="link.name"
            class="min-h-[80px] flex flex-col items-center justify-center rounded-lg bg-gray-50 p-3 transition-colors active:bg-gray-200"
          >
            <wd-text :text="link.icon" size="24px" />
            <wd-text :text="link.name" size="12px" color="#666" class="mt-1" />
          </view>
        </view>
      </view> -->

      <!-- 社交媒体 -->
      <!-- <view class="mt-6">
        <wd-text text="社交媒体" size="16px" color="#000" :bold="true" class="mb-3 block" />
        <view class="grid grid-cols-4 gap-3">
          <view
            v-for="link in coinDetailInfo.socialLinks" :key="link.name"
            class="min-h-[80px] flex flex-col items-center justify-center rounded-lg bg-gray-50 p-3 transition-colors active:bg-gray-200"
          >
            <wd-text :text="link.icon" size="24px" />
            <wd-text :text="link.name" size="12px" color="#666" class="mt-1" />
          </view>
        </view>
      </view> -->

      <!-- BTC简介 -->
      <view class="mt-6 leading-relaxed">
        <wd-text :text="`${coinDetailInfo.code}简介`" size="16px" color="#000" :bold="true" class="mb-3 block" />
        <wd-text :text="coinDetailInfo.description" size="14px" color="#666" class="leading-relaxed" />
      </view>
    </view>

    <!-- 其他子标签内容（已注释） -->
    <!-- <view v-else class="px-4 py-4">
      <wd-text :text="`${overviewTabList[overviewTabIndex].title} 内容`" size="14px" color="#666" />
    </view> -->
  </view>
</template>

<style scoped lang="scss">
/* 无需额外样式，已使用 UnoCSS */
</style>
