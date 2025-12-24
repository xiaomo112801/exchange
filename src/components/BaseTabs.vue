<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: any
  tabs?: Array<Record<string, any>>
  customClass?: string
  bordered?: boolean
  color?: string
  activeColor?: string
  lineWidth?: string
  lineHeight?: string
  size?: string
  sticky?: boolean
  offsetTop?: number
  animated?: boolean
  duration?: number
  swipeable?: boolean
  ellipsis?: boolean
  scrollable?: boolean
  navBottom?: boolean
  type?: string
  titleAlign?: string
  lazyRender?: boolean
  titleActiveColor?: string
  titleInactiveColor?: string
  navBackground?: string
  navShadow?: boolean
}>(), {
  tabs: () => [],
  bordered: true,
  animated: false,
  swipeable: false,
  ellipsis: true,
  scrollable: false,
})

const emit = defineEmits(['update:modelValue', 'change'])

const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const passThroughProps = computed(() => {
  const {
    modelValue,
    tabs,
    customClass,
    ...rest
  } = props
  return rest
})

function handleChange(val: any) {
  emit('change', val)
}
</script>

<template>
  <wd-tabs
    v-model="innerValue"
    v-bind="passThroughProps"
    :custom-class="customClass"
    @change="handleChange"
  >
    <slot>
      <wd-tab
        v-for="item in tabs"
        :key="item.name ?? item.title"
        :title="item.title"
        :name="item.name"
        v-bind="item"
      />
    </slot>
  </wd-tabs>
</template>

