<script setup lang="ts">
definePage({
  name: 'login',
  style: {
    navigationBarTitleText: '登录',
    navigationStyle: 'custom',
  },
})

const loginForm = ref({
  account: '',
  password: '',
})

const form = ref()

const gap = ref('gap-5')

const rules = ref<Record<string, any[]>>({
  account: [
    { required: true, message: '请填写用户名' },
  ],
  password: [],
})

const buttonText = ref('下一步')
const hasAccount = ref(false)

async function handleSubmit() {
  if (!hasAccount.value) {
    form.value?.validate().then(({ valid, errors }: { valid: boolean, errors: any[] }) => {
      if (valid) {
        hasAccount.value = true
        buttonText.value = '登录'
        rules.value.password = [
          { required: true, message: '请填写密码' },
        ]
        gap.value = 'gap-5'
      }
      console.log(errors, 'errors')
      if (errors.length > 0) {
        gap.value = 'gap-10'
      }
    })
    return
  }

  form.value?.validate().then(({ valid, errors }: { valid: boolean, errors: any[] }) => {
    if (valid) {
      console.log(loginForm.value)
      gap.value = 'gap-5'
    }
    if (errors.length > 0) {
      gap.value = 'gap-10'
    }
  })
}

function handleClick() {
  console.log('点击了按钮')
}

function handleClose() {
  console.log('点击了关闭')
}

const tab = ref(0)

const tabList = [
  {
    title: '邮箱',
    value: 'emailLogin',
  },
  {
    title: '手机号码',
    value: 'phoneLogin',
  },
]
</script>

<template>
  <view class="min-h-screen w-full flex flex-col overflow-hidden bg-white">
    <wd-navbar right-text="注册" class="w-full" :bordered="false" safe-area-inset-top @click="handleClick">
      <template #left>
        <wd-icon name="close" size="0.875rem" @click="handleClose" />
      </template>
    </wd-navbar>
    <view class="box-border w-full flex-1 p-5">
      <!-- <wd-button /> -->
      <wd-text text="登录" size="1.5rem" color="#000" line-height="2rem" class="mt-5" />
      <wd-tabs v-model="tab" class="mb-2 mt-5 w-full" :bordered="false" custom-class="login-tabs">
        <block v-for="item in tabList" :key="item">
          <wd-tab :title="`${item.title}`" />
        </block>
      </wd-tabs>
      <wd-form ref="form" :model="loginForm" :rules="rules" class="flex flex-col" :class="gap">
        <wd-input
          v-model="loginForm.account" size="large" custom-class="ipt-bg" prop="account" :no-border="true"
          clearable placeholder="请输入邮箱" color="#ccc"
        />
        <wd-input
          v-if="hasAccount" v-model="loginForm.password" prop="password" :no-border="true" custom-class="ipt-bg"
          size="large" show-password clearable placeholder="请输入密码"
        />

        <view class="mt-5">
          <wd-button type="primary" size="large" block @click="handleSubmit">
            {{ buttonText }}
          </wd-button>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<style scoped lang="scss">
::v-deep .login-tabs {
  border: none !important;
  width: 100% !important;
}

/* 顶部导航容器，不要左右额外 padding/margin */
::v-deep .login-tabs .wd-tabs__nav-container {
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .login-tabs .wd-tabs__nav {
  display: flex !important;
  align-items: center !important;
  background-color: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}

::v-deep .login-tabs .wd-tabs__nav-item {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 0.5rem !important;
  flex: none;
  text-align: center;
}

.login-tabs {
  margin-left: -0.5rem !important;
}

::v-deep .ipt-bg {
  background-color: #f1f1f1 !important;
  border-radius: 0.5rem !important;
}

::v-deep .wd-input__icon {
  background-color: transparent !important;
}

::v-deep .wd-input__error-message {
  position: absolute !important;
  bottom: -1.5rem !important;
  left: 0 !important;
  width: 100% !important;
  margin: 0 !important;
  font-size: 0.7rem !important;
}

::v-deep .wd-icon {
  background-color: transparent !important;
}
</style>
