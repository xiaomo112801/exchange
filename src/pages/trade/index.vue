<script setup lang="ts">
definePage({
  name: 'trade',
  style: {
    navigationBarTitleText: '交易',
  },
})

const paging = ref({
  page: 1,
  pageSize: 10,
})

function query() {
  console.log('query')
}

const search = ref<string>('')
</script>

<template>
  <z-paging v-model="paging" @query="query">
    <template #top>
      <view class="w-full">
        <wd-search v-model="search" placeholder-left placeholder="搜索币对" @cancel="cancel" />
      </view>
    </template>
  </z-paging>
</template>

<style scoped lang="scss">
.trade-page {
  padding: 1rem;
}
</style>
