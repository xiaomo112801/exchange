import router from '@/router'
/**
 * 获取当前页面路径
 * @returns 当前页面路径
 */
export function getCurrentPath() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.route || ''
}

/**
 * 页面跳转封装，支持携带参数
 * - name/path 至少提供一个
 * - query/params 均可选
 */
type NavigateOptions
  = | { name: string, path?: string, query?: Record<string, any>, params?: Record<string, any> }
    | { path: string, name?: string, query?: Record<string, any>, params?: Record<string, any> }

export function navigateTo(options: NavigateOptions) {
  const payload: any = {}

  if ('name' in options && options.name)
    payload.name = options.name
  if ('path' in options && options.path)
    payload.path = options.path
  if (options.query)
    payload.query = options.query
  if (options.params)
    payload.params = options.params

  router.push(payload)
}
