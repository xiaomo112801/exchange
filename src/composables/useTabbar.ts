export interface TabbarItem {
  name: string
  value: number | null
  active: boolean
  title: string
  icon: string
}

const tabbarItems = ref<TabbarItem[]>([
  { name: 'index', value: null, active: true, title: '首页', icon: 'home' },
  { name: 'market', value: null, active: false, title: '行情', icon: 'chart' },
  { name: 'trade', value: null, active: false, title: '交易', icon: 'chart-bubble' },
  { name: 'assets', value: null, active: false, title: '资产', icon: 'wallet' },
])

export function useTabbar() {
  const tabbarList = computed(() => tabbarItems.value)

  const activeTabbar = computed(() => {
    if (!tabbarItems.value || tabbarItems.value.length === 0) {
      return null
    }
    const item = tabbarItems.value.find(item => item.active)
    return item || tabbarItems.value[0] || null
  })

  const getTabbarItemValue = (name: string) => {
    const item = tabbarItems.value.find(item => item.name === name)
    return item && item.value ? item.value : null
  }

  const setTabbarItem = (name: string, value: number) => {
    const tabbarItem = tabbarItems.value.find(item => item.name === name)
    if (tabbarItem) {
      tabbarItem.value = value
    }
  }

  const setTabbarItemActive = (name: string) => {
    tabbarItems.value.forEach((item) => {
      if (item.name === name) {
        item.active = true
      }
      else {
        item.active = false
      }
    })
  }

  return {
    tabbarList,
    activeTabbar,
    getTabbarItemValue,
    setTabbarItem,
    setTabbarItemActive,
  }
}
