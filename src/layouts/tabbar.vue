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
    inactive-color="#666"
    active-color="#000"
    @change="handleTabbarChange"
  >
    <wd-tabbar-item
      v-for="(item, index) in tabbarList"
      :key="index"
      :name="item.name"
      :value="getTabbarItemValue(item.name)"
      :title="item.title"
    >
      <template #icon="{ active }">
        <wd-icon v-if="item.iconPrefix" :class-prefix="item.iconPrefix" size="1.3rem" :name="active ? item.activeIcon : item.icon" :color="active ? '#000' : '#666'" />
        <wd-icon v-else :name="item.icon" size="1.3rem" :color="active ? '#000' : '#666'" />
      </template>
    </wd-tabbar-item>
  </wd-tabbar>
</template>

<style lang="scss">
::v-deep .custom-tabbar {
  z-index: 9999 !important;
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
}
</style>
