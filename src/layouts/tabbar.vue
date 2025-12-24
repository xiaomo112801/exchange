<script lang="ts" setup>
const router = useRouter()

const route = useRoute()

const { activeTabbar, getTabbarItemValue, setTabbarItemActive, tabbarList } = useTabbar()

function handleTabbarChange({ value }: { value: string }) {
  setTabbarItemActive(value)
  router.pushTab({ name: value })
}
onMounted(() => {
  // #ifdef APP
  uni.hideTabBar()
  // #endif
  nextTick(() => {
    console.log('tabbarList:', tabbarList.value)
    console.log('activeTabbar:', activeTabbar.value)
    if (route.name && activeTabbar.value && route.name !== activeTabbar.value.name) {
      setTabbarItemActive(route.name)
    }
  })
})
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <slot />
  <wd-gap safe-area-bottom height="var(--wot-tabbar-height, 50px)" />
  <wd-tabbar
    v-if="tabbarList && tabbarList.length > 0 && activeTabbar"
    :model-value="activeTabbar.name" bordered safe-area-inset-bottom fixed
    custom-class="custom-tabbar"
    @change="handleTabbarChange"
  >
    <wd-tabbar-item
      v-for="(item, index) in tabbarList"
      :key="index"
      :name="item.name"
      :value="getTabbarItemValue(item.name)"
      :title="item.title"
      :icon="item.icon"
    />
  </wd-tabbar>
</template>

<style scoped lang="scss">
::v-deep .custom-tabbar {
  z-index: 9999 !important;
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
}
</style>
