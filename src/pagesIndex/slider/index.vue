<script setup lang="ts">
definePage({
  name: 'slider',
  style: {
    navigationBarTitleText: 'Slider',
  },
  subPackages: [
    {
      root: 'pagesIndex',
      pages: [
        {
          path: 'slider/index',
          name: 'slider',
        },
      ],
    },
  ],
})
</script>

<template>
  <view class="slider-page">
    <view class="slider-page-title">
      <text>Slider</text>
    </view>
  </view>
</template>
