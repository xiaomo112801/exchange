<script setup lang="ts">
const router = useRouter()

definePage({
  name: 'record',
  style: {
    navigationBarTitleText: '充值记录',
    navigationStyle: 'custom',
  },
})

// 筛选标签
const activeTab = ref(0)
const tabs = ['全部', '进行中', '已完成', '已失败']

// 充值记录数据
interface RechargeRecord {
  id: number
  coinCode: string
  coinName: string
  coinIcon: string
  amount: string
  amountCny: string
  network: string
  address: string
  txHash?: string
  status: 'pending' | 'completed' | 'failed'
  createTime: string
  completeTime?: string
}

const allRecords = ref<RechargeRecord[]>([
  {
    id: 1,
    coinCode: 'AAPLX',
    coinName: 'Apple xStock',
    coinIcon: 'https://via.placeholder.com/40',
    amount: '100.00',
    amountCny: '¥700.00',
    network: 'Solana',
    address: '8GPWgMLDtPAjAGXhFdyHbDU3y8BthXqnFXSWk1LgHbW9',
    txHash: '0x1234567890abcdef',
    status: 'completed',
    createTime: '2024-12-24 10:30:00',
    completeTime: '2024-12-24 10:45:00',
  },
  {
    id: 2,
    coinCode: 'USDT',
    coinName: 'Tether',
    coinIcon: 'https://s2023.oss-cn-qingdao.aliyuncs.com/echo2.0794b6dfaacb24a51b9e33beeea30db00.png',
    amount: '500.00',
    amountCny: '¥3,500.00',
    network: 'TRC20',
    address: 'TXYZabcdefghijklmnopqrstuvwxyz123456',
    status: 'pending',
    createTime: '2024-12-24 14:20:00',
  },
  {
    id: 3,
    coinCode: 'BTC',
    coinName: 'Bitcoin',
    coinIcon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/bitcoin.png',
    amount: '0.01',
    amountCny: '¥908.70',
    network: 'Bitcoin',
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    status: 'failed',
    createTime: '2024-12-24 09:15:00',
  },
  {
    id: 4,
    coinCode: 'ETH',
    coinName: 'Ethereum',
    coinIcon: 'https://echo-abc.oss-cn-hongkong.aliyuncs.com/waihui/ethereum.png',
    amount: '1.50',
    amountCny: '¥5,130.75',
    network: 'ERC20',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    txHash: '0xabcdef1234567890',
    status: 'completed',
    createTime: '2024-12-23 16:45:00',
    completeTime: '2024-12-23 17:00:00',
  },
])

// 根据状态筛选记录
const filteredRecords = computed(() => {
  if (activeTab.value === 0) {
    return allRecords.value
  }
  const statusMap = ['', 'pending', 'completed', 'failed']
  return allRecords.value.filter(record => record.status === statusMap[activeTab.value])
})

// 状态文本和颜色
function getStatusInfo(status: string) {
  const statusMap: Record<string, { text: string, color: string }> = {
    pending: { text: '进行中', color: '#ff9800' },
    completed: { text: '已完成', color: '#00c853' },
    failed: { text: '已失败', color: '#f44336' },
  }
  return statusMap[status] || { text: '未知', color: '#999' }
}

function handleTabChange(index: number) {
  activeTab.value = index
}

function handleRecordClick(record: RechargeRecord) {
  // 可以跳转到详情页
  console.log('点击记录:', record)
}
</script>

<template>
  <view class="recharge-record-page min-h-screen flex flex-col bg-white">
    <!-- 顶部导航栏 -->
    <wd-navbar
      safe-area-inset-top
      placeholder
      fixed
      :bordered="false"
      title="充值记录"
    >
      <template #left>
        <wd-icon name="arrow-left" size="1.25rem" color="#000" @click="router.back()" />
      </template>
      templ
    </wd-navbar>

    <!-- 筛选标签 -->
    <view class="sticky-tabs-wrapper">
      <view class="sticky-tabs-content px-4">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          class="relative pb-2"
          :class="activeTab === index ? 'border-b-2 border-[#00c853]' : ''"
          @click="handleTabChange(index)"
        >
          <wd-text
            :text="tab"
            size="0.875rem"
            :color="activeTab === index ? '#00c853' : '#666'"
            :bold="activeTab === index"
          />
        </view>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="flex flex-1 flex-col px-4 pb-3 pt-3">
      <view v-if="filteredRecords.length > 0" class="flex flex-col gap-3">
        <view
          v-for="record in filteredRecords"
          :key="record.id"
          class="flex flex-col gap-2 border border-gray-100 rounded-lg bg-white px-3 py-3 shadow-sm"
          @click="handleRecordClick(record)"
        >
          <!-- 币种信息和状态 -->
          <view class="flex items-center justify-between">
            <view class="flex items-center gap-2">
              <wd-img :src="record.coinIcon" width="1.5rem" height="1.5rem" mode="aspectFill" />
              <view class="flex flex-col">
                <wd-text :text="record.coinCode" size="0.875rem" color="#000" :bold="true" />
                <wd-text :text="record.network" size="0.75rem" color="#999" />
              </view>
            </view>
            <view
              class="rounded px-2 py-0.5"
              :style="{ backgroundColor: `${getStatusInfo(record.status).color}20` }"
            >
              <wd-text
                :text="getStatusInfo(record.status).text"
                size="0.75rem"
                :color="getStatusInfo(record.status).color"
              />
            </view>
          </view>

          <!-- 金额信息 -->
          <view class="flex items-center justify-between border-t border-gray-100 pt-2">
            <view class="flex flex-col">
              <wd-text :text="`${record.amount} ${record.coinCode}`" size="1rem" color="#000" :bold="true" />
              <wd-text :text="record.amountCny" size="0.75rem" color="#999" class="mt-1" />
            </view>
            <view class="flex flex-col items-end">
              <wd-text text="充值地址" size="0.75rem" color="#999" />
              <wd-text :text="`${record.address.slice(0, 8)}...${record.address.slice(-8)}`" size="0.75rem" color="#666" class="mt-1" />
            </view>
          </view>

          <!-- 时间信息 -->
          <view class="flex items-center justify-between border-t border-gray-100 pt-2">
            <wd-text :text="`创建时间: ${record.createTime}`" size="0.7rem" color="#999" />
            <wd-text
              v-if="record.completeTime"
              :text="`完成时间: ${record.completeTime}`"
              align="right"
              size="0.7rem"
              color="#999"
            />
          </view>

          <!-- 交易哈希（如果有） -->
          <view v-if="record.txHash" class="flex items-center justify-between border-t border-gray-100 pt-2">
            <wd-text text="交易哈希" size="0.75rem" color="#999" />
            <wd-text :text="`${record.txHash.slice(0, 10)}...${record.txHash.slice(-10)}`" size="0.75rem" color="#666" />
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="flex flex-1 items-center justify-center">
        <view class="flex flex-col items-center gap-2">
          <wd-icon name="file" size="3rem" color="#ccc" />
          <wd-text text="暂无充值记录" size="0.875rem" color="#999" />
        </view>
      </view>
    </view>
  </view>
</template>

  <style scoped lang="scss">
  .recharge-record-page {
    background-color: #f5f5f5;
  }

  .sticky-tabs-wrapper {
    position: sticky;
    top: 0;
    z-index: 10;
    width: 100%;
    background-color: transparent;
  }

  .sticky-tabs-content {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    // padding: 0.75rem 1rem 0.5rem;
    margin-top: 0.75rem;
    box-sizing: border-box;
  }
  </style>
