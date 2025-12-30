import { ref } from 'vue'

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

// 全局自选币对列表
const favoriteCoins = ref<CoinListItem[]>([])

export function useFavoriteCoins() {
  // 检查币对是否在自选列表中
  const isFavorite = (coinId: number | string) => {
    const id = typeof coinId === 'string' ? Number.parseInt(coinId) : coinId
    return favoriteCoins.value.some(coin => coin.id === id)
  }

  // 添加币对到自选列表
  const addFavorite = (coin: CoinListItem) => {
    if (!isFavorite(coin.id)) {
      favoriteCoins.value.push(coin)
    }
  }

  // 从自选列表移除币对
  const removeFavorite = (coinId: number | string) => {
    const id = typeof coinId === 'string' ? Number.parseInt(coinId) : coinId
    const index = favoriteCoins.value.findIndex(coin => coin.id === id)
    if (index > -1) {
      favoriteCoins.value.splice(index, 1)
    }
  }

  // 切换收藏状态
  const toggleFavorite = (coin: CoinListItem) => {
    if (isFavorite(coin.id)) {
      removeFavorite(coin.id)
    }
    else {
      addFavorite(coin)
    }
  }

  return {
    favoriteCoins,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}
