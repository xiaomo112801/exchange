<script setup lang="ts">
/* eslint-disable */
import { BarChart, CandlestickChart, LineChart } from 'echarts/charts'
import { DataZoomComponent, GridComponent, LegendComponent, MarkLineComponent, MarkPointComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import type { Bar } from '@/utils/tradingview-datafeed'
import { Datafeed } from '@/utils/tradingview-datafeed'
import { onMounted, ref, watch } from 'vue'

// 注册 ECharts 组件
echarts.use([
  GridComponent,
  LegendComponent,
  TooltipComponent,
  MarkLineComponent,
  MarkPointComponent,
  DataZoomComponent,
  VisualMapComponent,
  BarChart,
  CandlestickChart,
  LineChart,
  CanvasRenderer,
])

interface Props {
  symbol: string
  timeInterval: string
  indicatorIndex: number
  indicators: string[]
}

const props = defineProps<Props>()

// 指标数据显示
const indicatorData = ref<Array<{ name: string; value: string; color: string }>>([])

// 保持 AppKlineChart 的颜色方案（更柔和的交易所绿）
const upColor = '#0ECB81' // 涨的颜色
const downColor = '#ef5350' // 跌的颜色

// 保存bars数据
const currentBars = ref<Bar[]>([])

// 使用 shuaxuan.ts 的方式处理数据
function splitData(bars: Bar[]) {
  const categoryData: string[] = []
  const values: number[][] = []
  const volumes: number[][] = []

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i]
    const date = new Date(bar.time)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    // 格式化时间标签
    let timeLabel: string
    if (bars.length > 50) {
      timeLabel = `${hours}:${minutes}`
    } else {
      timeLabel = `${month}-${day} ${hours}:${minutes}`
    }

    categoryData.push(timeLabel)
    values.push([bar.open, bar.close, bar.low, bar.high])
    // volumes格式: [index, volume, direction] direction: 1=跌, -1=涨 (与shuaxuan.ts相反，因为颜色方案不同)
    volumes.push([i, bar.volume, bar.close >= bar.open ? -1 : 1])
  }

  return {
    categoryData,
    values,
    volumes,
  }
}

// 计算移动平均线（使用 shuaxuan.ts 的方式）
function calculateMA(dayCount: number, data: { values: number[][] }) {
  const result: (number | string)[] = []
  for (let i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1] // close price
    }
    result.push(+(sum / dayCount).toFixed(3))
  }
  return result
}

const option = ref<any>({
  animation: false,
  backgroundColor: '#fff',
  legend: { show: false },
  // 恢复十字光标和信息提示（中文、小号信息框）
  tooltip: {
    trigger: 'axis',
    // 支持移动和点击触发，允许再次点击/移出图表时自动关闭
    triggerOn: 'mousemove|click',
    alwaysShowContent: false,
    axisPointer: {
      type: 'cross',
    },
    borderWidth: 1,
    borderColor: '#ccc',
    padding: [4, 6],
    textStyle: {
      color: '#000',
      fontSize: 9,
    },
    // 自定义内容：时间 / 开高低收 / 涨跌额 / 涨跌幅 / 振幅 / 成交量 / 成交额（中文）
    formatter(params: any[]) {
      if (!params || !params.length) return ''
      const category = params[0].axisValue || ''
      const kItem = params.find(p => p.seriesType === 'candlestick')
      const volItem = params.find(p => p.seriesName === '成交量')

      let lines: string[] = []
      lines.push(`时间：${category}`)

      if (kItem && Array.isArray(kItem.data)) {
        const [open, close, low, high] = kItem.data
        const o = Number(open)
        const c = Number(close)
        const l = Number(low)
        const h = Number(high)
        const change = c - o
        const changePct = o !== 0 ? (change / o) * 100 : 0
        const amplitude = o !== 0 ? ((h - l) / o) * 100 : 0

        lines.push(`开：${o.toFixed(2)}`)
        lines.push(`高：${h.toFixed(2)}`)
        lines.push(`低：${l.toFixed(2)}`)
        lines.push(`收：${c.toFixed(2)}`)
        lines.push(`涨跌额：${change >= 0 ? '+' : ''}${change.toFixed(2)}`)
        lines.push(`涨跌幅：${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`)
        lines.push(`振幅：${amplitude.toFixed(2)}%`)
      }

      if (volItem) {
        const vol = Array.isArray(volItem.data) ? volItem.data[1] : volItem.data
        if (vol !== undefined && vol !== null) {
          const v = Number(vol)
          // 这里将成交额近似为 收盘价 * 成交量
          const kItem = params.find(p => p.seriesType === 'candlestick')
          let amount = 0
          if (kItem && Array.isArray(kItem.data)) {
            const close = Number(kItem.data[1])
            amount = close * v
          }
          lines.push(`成交量：${v.toFixed(2)}`)
          lines.push(`成交额：${amount.toFixed(2)}`)
        }
      }

      // 使用换行符而不是 HTML，避免显示 <br/> 文本
      return lines.join('\n')
    },
    position(pos: number[], _params: any, _el: any, _rect: any, size: any) {
      const obj: Record<string, number> = { top: 10 }
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
      return obj
    },
  },
  axisPointer: {
    show: true,
    type: 'cross',
    link: [
      {
        xAxisIndex: 'all',
      },
    ],
    label: {
      backgroundColor: '#777',
    },
    lineStyle: {
      type: 'dashed',
      color: '#ccc',
      width: 1,
    },
    crossStyle: {
      type: 'dashed',
      color: '#ccc',
      width: 1,
    },
  },
  visualMap: {
    show: false,
    seriesIndex: 5, // 成交量series的索引
    dimension: 2,
    pieces: [
      {
        value: 1,
        color: downColor, // 跌
      },
      {
        value: -1,
        color: upColor, // 涨
      },
    ],
  },
  grid: [
    {
      left: 10,
      right: 50,
      top: '5%',
      bottom: 'auto',
      height: '70%',
      containLabel: false,
    },
    {
      left: 10,
      right: 50,
      top: '75%',
      bottom: '5%',
      height: '20%',
      containLabel: false,
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0, 1],
      start: 0,
      end: 100,
      minSpan: 5,
      maxSpan: 100,
      zoomOnMouseWheel: true,
      moveOnMouseMove: true,
      moveOnMouseWheel: true,
      preventDefaultMouseMove: true,
    },
  ],
  xAxis: [
    {
      type: 'category',
      gridIndex: 0,
      data: [],
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#ccc' }, onZero: false },
      axisTick: { show: false },
      axisLabel: { color: '#999', show: false },
      splitLine: { lineStyle: { color: '#f5f5f5', width: 0.5 } },
      min: 'dataMin',
      max: 'dataMax',
      axisPointer: {
        z: 100,
      },
    },
    {
      type: 'category',
      gridIndex: 1,
      data: [],
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#ccc' }, onZero: false },
      axisTick: { show: false },
      axisLabel: { color: '#999' },
      // 成交量区域需要横向/纵向网格线，提升可读性
      splitLine: { lineStyle: { color: '#f5f5f5', width: 0.5 } },
      min: 'dataMin',
      max: 'dataMax',
    },
  ],
  yAxis: [
    {
      scale: true,
      position: 'right',
      gridIndex: 0,
      splitArea: {
        show: false,
      },
      axisLine: { lineStyle: { color: '#ccc' } },
      axisTick: { show: false },
      // K 线价格坐标：文字稍微偏上线之上，避免和下方放量坐标挤在一起
      axisLabel: {
        color: '#999',
        padding: [-4, 0, 0, 0], // 往上移一点
      },
      splitLine: { lineStyle: { color: '#f5f5f5', width: 0.5 } },
    },
    {
      scale: true,
      position: 'right',
      gridIndex: 0,
      axisLine: { lineStyle: { color: '#ccc' } },
      axisTick: { show: false },
      axisLabel: { color: '#999', show: false },
      splitLine: { show: false },
    },
    {
      scale: true,
      position: 'right',
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: {
        show: false,
      },
      axisLine: {
        // 隐藏放量区域最右侧的灰色纵轴线
        show: false,
        lineStyle: { color: '#ccc' },
      },
      axisTick: { show: false },
      // 横向网格线（对应成交量柱高度）
      splitLine: { lineStyle: { color: '#f5f5f5', width: 0.5 } },
    },
  ],
  series: [
    {
      type: 'candlestick',
      data: [],
      itemStyle: {
        color: upColor,
        color0: downColor,
        borderColor: undefined,
        borderColor0: undefined,
      },
    },
  ],
})

function mapInterval(interval: string) {
  // 映射中文时间周期到 Datafeed 分辨率
  if (interval === '1日' || interval === 'D') return 'D'
  if (interval === '4小时' || interval === '4H') return '240'
  if (interval === '2小时' || interval === '2H') return '120'
  if (interval === '1小时' || interval === '1H') return '60'
  if (interval === '30分' || interval === '30m') return '30'
  if (interval === '15分' || interval === '15m') return '15'
  if (interval === '5分' || interval === '5m') return '5'
  return '60'
}

async function loadKlineData() {
  try {
    console.log('[KlineChartDemo] loading kline data, symbol:', props.symbol, 'interval:', props.timeInterval)
    const feed = new Datafeed(props.symbol)
    const symbolInfo = await new Promise((resolve) => {
      feed.resolveSymbol(props.symbol, info => resolve(info), () => resolve(null))
    })
    if (!symbolInfo) return

    const now = Math.floor(Date.now() / 1000)
    const resolution = mapInterval(props.timeInterval)

    // 根据时间周期调整数据加载范围
    let from: number
    if (resolution === '5' || resolution === '15') {
      from = now - 1 * 24 * 3600
    }
    else if (resolution === '30' || resolution === '60') {
      from = now - 3 * 24 * 3600
    }
    else if (resolution === '120' || resolution === '240') {
      from = now - 7 * 24 * 3600
    }
    else if (resolution === 'D') {
      from = now - 30 * 24 * 3600
    }
    else {
      from = now - 7 * 24 * 3600
    }

    const bars = await new Promise<Bar[]>((resolve) => {
      feed.getBars(
        symbolInfo as any,
        resolution,
        from,
        now,
        rows => resolve(rows),
        () => resolve([]),
        true,
      )
    })

    console.log('[KlineChartDemo] bars length:', bars.length)

    if (!bars.length) {
      console.warn('[KlineChartDemo] no bars data')
      return
    }

    // 保存bars数据
    currentBars.value = bars

    // 使用 shuaxuan.ts 的方式处理数据
    const data = splitData(bars)

    // 计算指标
    const indicatorSeries = calculateIndicators(bars, data)

    // 更新指标数据显示
    updateIndicatorDisplay(bars, indicatorSeries)

    // 计算初始显示范围
    const dataCount = bars.length
    let defaultStart: number
    let defaultEnd = 100

    if (resolution === '5') {
      const targetBars = Math.min(80, dataCount)
      defaultStart = dataCount > targetBars ? Math.max(0, 100 - (targetBars / dataCount * 100)) : 0
    }
    else if (resolution === '15') {
      const targetBars = Math.min(64, dataCount)
      defaultStart = dataCount > targetBars ? Math.max(0, 100 - (targetBars / dataCount * 100)) : 0
    }
    else if (resolution === '30') {
      const targetBars = Math.min(48, dataCount)
      defaultStart = dataCount > targetBars ? Math.max(0, 100 - (targetBars / dataCount * 100)) : 0
    }
    else if (resolution === '60') {
      const targetBars = Math.min(72, dataCount)
      defaultStart = dataCount > targetBars ? Math.max(0, 100 - (targetBars / dataCount * 100)) : 0
    }
    else if (resolution === '120') {
      const targetBars = Math.min(84, dataCount)
      defaultStart = dataCount > targetBars ? Math.max(0, 100 - (targetBars / dataCount * 100)) : 0
    }
    else if (resolution === '240') {
      const targetBars = Math.min(42, dataCount)
      defaultStart = dataCount > targetBars ? Math.max(0, 100 - (targetBars / dataCount * 100)) : 0
    }
    else if (resolution === 'D') {
      const targetBars = Math.min(30, dataCount)
      defaultStart = dataCount > targetBars ? Math.max(0, 100 - (targetBars / dataCount * 100)) : 0
    }
    else {
      const targetBars = Math.min(50, dataCount)
      defaultStart = dataCount > targetBars ? Math.max(0, 100 - (targetBars / dataCount * 100)) : 0
    }

    // 计算K线宽度
    const visibleRange = defaultEnd - defaultStart
    const visibleDataCount = Math.ceil(dataCount * (visibleRange / 100))
    const barWidthPx = Math.max(4, Math.min(10, 350 / Math.max(visibleDataCount, 1) * 0.7))

    // 计算当前周期的最高价 / 最低价 / 最新价，用于在 K 线上标注
    const highs = bars.map(b => b.high)
    const lows = bars.map(b => b.low)
    const maxHigh = Math.max(...highs)
    const minLow = Math.min(...lows)
    const maxHighIndex = highs.indexOf(maxHigh)
    const minLowIndex = lows.indexOf(minLow)
    const lastIndex = bars.length - 1
    const lastClose = bars[lastIndex].close

    // 计算成交量 series 的索引（candlestick + indicatorSeries）
    const volumeSeriesIndex = 1 + indicatorSeries.length

    option.value = {
      ...option.value,
      visualMap: {
        ...option.value.visualMap,
        seriesIndex: volumeSeriesIndex,
      },
      xAxis: [
        {
          ...option.value.xAxis[0],
          data: data.categoryData,
          axisLabel: {
            ...option.value.xAxis[0].axisLabel,
            rotate: 0,
            interval: 'auto',
            showMinLabel: true,
            showMaxLabel: true,
          },
          splitLine: {
            show: true,
            lineStyle: { color: '#f5f5f5', width: 0.5 },
          },
        },
        {
          ...option.value.xAxis[1],
          data: data.categoryData,
          axisLabel: {
            ...option.value.xAxis[1].axisLabel,
            rotate: 0,
            interval: 'auto',
            showMinLabel: true,
            showMaxLabel: true,
          },
          splitLine: {
            show: true,
            lineStyle: { color: '#f5f5f5', width: 0.5 },
          },
        },
      ],
      dataZoom: [
        {
          ...option.value.dataZoom[0],
          start: defaultStart,
          end: defaultEnd,
        },
      ],
      series: [
        {
          ...(option.value.series?.[0] || {}),
          type: 'candlestick',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: data.values,
          barWidth: barWidthPx,
          barMinWidth: 2,
          barMaxWidth: 15,
          // 当前价格红色虚线（无文字），加上当期最高/最低价标注
          markLine: {
            symbol: 'none',
            animation: false,
            lineStyle: {
              color: '#ef5350',
              width: 1,
              type: 'dashed',
            },
            data: [
              {
                yAxis: lastClose,
                label: {
                  show: true,
                  // 放在右端点，向右微移，红底白字
                  position: 'end',
                  backgroundColor: '#ef5350',
                  color: '#fff',
                  borderWidth: 0,
                  padding: [2, 6],
                  borderRadius: 4,
                  fontSize: 9,
                  distance: 8,
                  align: 'left',
                  verticalAlign: 'middle',
                  formatter(p: any) {
                    const v = Number(p.value)
                    if (Number.isNaN(v)) return ''
                    return v.toFixed(2)
                  },
                },
              },
            ],
          },
          markPoint: {
            symbol: 'circle',
            symbolSize: 6,
            label: {
              show: true,
              color: '#555',
              fontSize: 9,
              padding: [2, 3, 2, 3],
              formatter(p: any) {
                const v = Number(p.value)
                if (Number.isNaN(v)) return p.name || ''
                return `${p.name}:${v.toFixed(4)}`
              },
            },
            data: [
              {
                name: '高',
                coord: [maxHighIndex, maxHigh],
                value: maxHigh,
                label: { position: 'top' },
              },
              {
                name: '低',
                coord: [minLowIndex, minLow],
                value: minLow,
                label: { position: 'bottom' },
              },
            ],
          },
        },
        ...indicatorSeries.map(s => ({ ...s, xAxisIndex: 0, yAxisIndex: s.yAxisIndex || 0 })),
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 2,
          data: data.volumes,
          barWidth: barWidthPx,
          barMinWidth: 2,
          barMaxWidth: 15,
        },
      ],
    }

    console.log('[KlineChartDemo] option updated, barWidth:', barWidthPx)
  }
  catch (err) {
    console.error('[KlineChartDemo] loadKlineData failed:', err)
  }
}

// 更新指标数据显示
function updateIndicatorDisplay(bars: Bar[], indicatorSeries: any[]) {
  if (!bars.length || !indicatorSeries.length) {
    indicatorData.value = []
    return
  }

  const lastIndex = bars.length - 1
  const currentIndicator = props.indicators[props.indicatorIndex]
  const items: Array<{ name: string; value: string; color: string }> = []

  if (currentIndicator === 'MA') {
    const colors = ['#FFD700', '#00FF00', '#800080']
    indicatorSeries.forEach((series, index) => {
      const value = series.data[lastIndex]
      if (value !== null && value !== undefined && value !== '-') {
        items.push({
          name: series.name,
          value: typeof value === 'number' ? value.toFixed(2) : value.toString(),
          color: colors[index] || '#666',
        })
      }
    })
  }
  else if (currentIndicator === 'EMA') {
    const colors = ['#FF6B6B', '#0ECB81', '#45B7D1']
    indicatorSeries.forEach((series, index) => {
      const value = series.data[lastIndex]
      if (value !== null && value !== undefined && value !== '-') {
        items.push({
          name: series.name,
          value: typeof value === 'number' ? value.toFixed(2) : value.toString(),
          color: colors[index] || '#666',
        })
      }
    })
  }
  else if (currentIndicator === 'BOLL') {
    const colors = ['#ff9800', '#2196f3', '#ff9800']
    indicatorSeries.forEach((series, index) => {
      const value = series.data[lastIndex]
      if (value !== null && value !== undefined && value !== '-') {
        items.push({
          name: series.name,
          value: typeof value === 'number' ? value.toFixed(2) : value.toString(),
          color: colors[index] || '#666',
        })
      }
    })
  }
  else if (currentIndicator === 'MACD') {
    const colors = ['#ff0000', '#00ff00']
    indicatorSeries.forEach((series, index) => {
      const value = series.data[lastIndex]
      if (value !== null && value !== undefined && value !== '-') {
        items.push({
          name: series.name,
          value: typeof value === 'number' ? value.toFixed(4) : value.toString(),
          color: colors[index] || '#666',
        })
      }
    })
  }
  else if (currentIndicator === 'RSI') {
    const value = indicatorSeries[0]?.data[lastIndex]
    if (value !== null && value !== undefined && value !== '-') {
      items.push({
        name: 'RSI',
        value: typeof value === 'number' ? value.toFixed(2) : value.toString(),
        color: '#9c27b0',
      })
    }
  }
  else if (currentIndicator === 'WR') {
    const value = indicatorSeries[0]?.data[lastIndex]
    if (value !== null && value !== undefined && value !== '-') {
      items.push({
        name: 'WR',
        value: typeof value === 'number' ? value.toFixed(2) : value.toString(),
        color: '#f44336',
      })
    }
  }
  else if (currentIndicator === 'VOL') {
    const volume = bars[lastIndex]?.volume
    if (volume !== null && volume !== undefined) {
      items.push({
        name: 'VOL',
        value: volume.toFixed(2),
        color: '#999',
      })
    }
  }

  indicatorData.value = items
}

// 计算指标数据
function calculateIndicators(bars: Bar[], data: { values: number[][], categoryData: string[], volumes: number[][] }) {
  const indicatorSeries: any[] = []
  const currentIndicator = props.indicators[props.indicatorIndex]

  if (!currentIndicator || !bars.length) {
    return indicatorSeries
  }

  const closes = bars.map(bar => bar.close)
  const highs = bars.map(bar => bar.high)
  const lows = bars.map(bar => bar.low)

  if (currentIndicator === 'MA') {
    // 移动平均线：MA5, MA10, MA30（使用 shuaxuan.ts 的方式）
    const ma5 = calculateMA(5, data)
    const ma10 = calculateMA(10, data)
    const ma30 = calculateMA(30, data)
    indicatorSeries.push(
      { name: 'MA5', type: 'line', data: ma5, smooth: true, lineStyle: { color: '#FFD700', width: 1, opacity: 0.5 }, symbol: 'none' },
      { name: 'MA10', type: 'line', data: ma10, smooth: true, lineStyle: { color: '#00FF00', width: 1, opacity: 0.5 }, symbol: 'none' },
      { name: 'MA30', type: 'line', data: ma30, smooth: true, lineStyle: { color: '#800080', width: 1, opacity: 0.5 }, symbol: 'none' },
    )
  }
  else if (currentIndicator === 'EMA') {
    const ema5 = calculateEMA(closes, 5)
    const ema10 = calculateEMA(closes, 10)
    const ema30 = calculateEMA(closes, 30)
    indicatorSeries.push(
      { name: 'EMA5', type: 'line', data: ema5, smooth: true, lineStyle: { color: '#FF6B6B', width: 1 }, symbol: 'none' },
      { name: 'EMA10', type: 'line', data: ema10, smooth: true, lineStyle: { color: '#4ECDC4', width: 1 }, symbol: 'none' },
      { name: 'EMA30', type: 'line', data: ema30, smooth: true, lineStyle: { color: '#45B7D1', width: 1 }, symbol: 'none' },
    )
  }
  else if (currentIndicator === 'BOLL') {
    const boll = calculateBOLL(closes, 20, 2)
    indicatorSeries.push(
      { name: '上轨', type: 'line', data: boll.upper, smooth: true, lineStyle: { color: '#ff9800', width: 1 }, symbol: 'none' },
      { name: '中轨', type: 'line', data: boll.middle, smooth: true, lineStyle: { color: '#2196f3', width: 1 }, symbol: 'none' },
      { name: '下轨', type: 'line', data: boll.lower, smooth: true, lineStyle: { color: '#ff9800', width: 1 }, symbol: 'none' },
    )
  }
  else if (currentIndicator === 'MACD') {
    const macd = calculateMACD(closes)
    indicatorSeries.push(
      {
        name: 'DIF',
        type: 'line',
        yAxisIndex: 1,
        data: macd.dif,
        smooth: true,
        lineStyle: { color: '#ff0000', width: 1 },
        symbol: 'none',
      },
      {
        name: 'DEA',
        type: 'line',
        yAxisIndex: 1,
        data: macd.dea,
        smooth: true,
        lineStyle: { color: '#00ff00', width: 1 },
        symbol: 'none',
      },
    )
  }
  else if (currentIndicator === 'RSI') {
    const rsi = calculateRSI(closes, 14)
    indicatorSeries.push(
      {
        name: 'RSI',
        type: 'line',
        yAxisIndex: 1,
        data: rsi,
        smooth: true,
        lineStyle: { color: '#9c27b0', width: 1 },
        symbol: 'none',
      },
    )
  }
  else if (currentIndicator === 'WR') {
    const wr = calculateWR(highs, lows, closes, 14)
    indicatorSeries.push(
      {
        name: 'WR',
        type: 'line',
        yAxisIndex: 1,
        data: wr,
        smooth: true,
        lineStyle: { color: '#f44336', width: 1 },
        symbol: 'none',
      },
    )
  }
  else if (currentIndicator === 'VOL') {
    // 成交量已经在主series中显示，不需要额外处理
  }

  return indicatorSeries
}

// 计算简单移动平均线（AppKlineChart 的方式）
function calculateMA_App(data: number[], period: number): number[] {
  const result: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null as any)
    }
    else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
      result.push(sum / period)
    }
  }
  return result
}

// 计算指数移动平均线
function calculateEMA(data: number[], period: number): number[] {
  const result: number[] = []
  const multiplier = 2 / (period + 1)
  let ema = data[0]
  result.push(ema)
  for (let i = 1; i < data.length; i++) {
    ema = (data[i] - ema) * multiplier + ema
    result.push(ema)
  }
  return result
}

// 计算布林带
function calculateBOLL(data: number[], period: number, stdDev: number) {
  const ma = calculateMA_App(data, period)
  const upper: number[] = []
  const lower: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      upper.push(null as any)
      lower.push(null as any)
    }
    else {
      const slice = data.slice(i - period + 1, i + 1)
      const avg = ma[i]
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / period
      const sd = Math.sqrt(variance)
      upper.push(avg + stdDev * sd)
      lower.push(avg - stdDev * sd)
    }
  }
  return { upper, middle: ma, lower }
}

// 计算 MACD
function calculateMACD(data: number[]) {
  const ema12 = calculateEMA(data, 12)
  const ema26 = calculateEMA(data, 26)
  const dif: number[] = []
  for (let i = 0; i < data.length; i++) {
    dif.push(ema12[i] - ema26[i])
  }
  const dea = calculateEMA(dif, 9)
  return { dif, dea }
}

// 计算 RSI
function calculateRSI(data: number[], period: number): number[] {
  const result: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      result.push(null as any)
    }
    else {
      let gains = 0
      let losses = 0
      for (let j = i - period + 1; j <= i; j++) {
        const change = data[j] - data[j - 1]
        if (change > 0) gains += change
        else losses += Math.abs(change)
      }
      const avgGain = gains / period
      const avgLoss = losses / period
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
      result.push(100 - (100 / (1 + rs)))
    }
  }
  return result
}

// 计算 Williams %R
function calculateWR(highs: number[], lows: number[], closes: number[], period: number): number[] {
  const result: number[] = []
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      result.push(null as any)
    }
    else {
      const sliceHigh = highs.slice(i - period + 1, i + 1)
      const sliceLow = lows.slice(i - period + 1, i + 1)
      const highest = Math.max(...sliceHigh)
      const lowest = Math.min(...sliceLow)
      const wr = ((highest - closes[i]) / (highest - lowest)) * -100
      result.push(wr)
    }
  }
  return result
}

onMounted(() => {
  loadKlineData()
})

watch(() => props.timeInterval, () => {
  loadKlineData()
})

watch(() => props.indicatorIndex, () => {
  if (currentBars.value.length) {
    const data = splitData(currentBars.value)
    const indicatorSeries = calculateIndicators(currentBars.value, data)

    updateIndicatorDisplay(currentBars.value, indicatorSeries)

    const dataCount = currentBars.value.length

    const currentDataZoom = option.value.dataZoom || []
    const currentStart = currentDataZoom[0]?.start ?? Math.max(0, 100 - (dataCount > 50 ? 30 : 50))
    const currentEnd = currentDataZoom[0]?.end ?? 100

    const visibleRange = currentEnd - currentStart
    const visibleDataCount = Math.ceil(dataCount * (visibleRange / 100))
    const barWidthPx = Math.max(4, Math.min(10, 350 / Math.max(visibleDataCount, 1) * 0.7))

    // 计算当前周期的最高价 / 最低价 / 最新价，用于在 K 线上标注
    const highs = currentBars.value.map(b => b.high)
    const lows = currentBars.value.map(b => b.low)
    const maxHigh = Math.max(...highs)
    const minLow = Math.min(...lows)
    const maxHighIndex = highs.indexOf(maxHigh)
    const minLowIndex = lows.indexOf(minLow)
    const lastIndex = currentBars.value.length - 1
    const lastClose = currentBars.value[lastIndex].close

    // 计算成交量 series 的索引（candlestick + indicatorSeries）
    const volumeSeriesIndex = 1 + indicatorSeries.length

    option.value = {
      ...option.value,
      visualMap: {
        ...option.value.visualMap,
        seriesIndex: volumeSeriesIndex,
      },
      xAxis: [
        {
          ...option.value.xAxis[0],
          data: data.categoryData,
          axisLabel: {
            ...option.value.xAxis[0].axisLabel,
            rotate: 0,
            interval: 'auto',
            showMinLabel: true,
            showMaxLabel: true,
          },
          splitLine: {
            show: true,
            lineStyle: { color: '#f5f5f5', width: 0.5 },
          },
        },
        {
          ...option.value.xAxis[1],
          data: data.categoryData,
          axisLabel: {
            ...option.value.xAxis[1].axisLabel,
            rotate: 0,
            interval: 'auto',
            showMinLabel: true,
            showMaxLabel: true,
          },
          splitLine: {
            show: true,
            lineStyle: { color: '#f5f5f5', width: 0.5 },
          },
        },
      ],
      dataZoom: [
        {
          ...option.value.dataZoom[0],
          start: currentStart,
          end: currentEnd,
        },
      ],
      series: [
        {
          ...(option.value.series?.[0] || {}),
          type: 'candlestick',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: data.values,
          barWidth: barWidthPx,
          barMinWidth: 2,
          barMaxWidth: 15,
          // 当前价格红色虚线（无文字），加上当期最高/最低价标注
          markLine: {
            symbol: 'none',
            animation: false,
            lineStyle: {
              color: '#ef5350',
              width: 1,
              type: 'dashed',
            },
            data: [
              {
                yAxis: lastClose,
                label: {
                  show: true,
                  // 放在右端点，向右微移，红底白字
                  position: 'end',
                  backgroundColor: '#ef5350',
                  color: '#fff',
                  borderWidth: 0,
                  padding: [2, 6],
                  borderRadius: 4,
                  fontSize: 9,
                  distance: 8,
                  align: 'left',
                  verticalAlign: 'middle',
                  formatter(p: any) {
                    const v = Number(p.value)
                    if (Number.isNaN(v)) return ''
                    return v.toFixed(2)
                  },
                },
              },
            ],
          },
          markPoint: {
            symbol: 'circle',
            symbolSize: 6,
            label: {
              show: true,
              color: '#555',
              fontSize: 9,
              padding: [2, 3, 2, 3],
              formatter(p: any) {
                const v = Number(p.value)
                if (Number.isNaN(v)) return p.name || ''
                return `${p.name}:${v.toFixed(4)}`
              },
            },
            data: [
              {
                name: '高',
                coord: [maxHighIndex, maxHigh],
                value: maxHigh,
                label: { position: 'top' },
              },
              {
                name: '低',
                coord: [minLowIndex, minLow],
                value: minLow,
                label: { position: 'bottom' },
              },
            ],
          },
        },
        ...indicatorSeries.map(s => ({ ...s, xAxisIndex: 0, yAxisIndex: s.yAxisIndex || 0 })),
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 2,
          data: data.volumes,
          barWidth: barWidthPx,
          barMinWidth: 2,
          barMaxWidth: 15,
        },
      ],
    }
  }
  else {
    loadKlineData()
  }
})
</script>

<template>
  <view class="app-kline-container">
    <view v-if="indicatorData.length > 0" class="indicator-display">
      <text
        v-for="(item, index) in indicatorData"
        :key="index"
        class="indicator-item"
      >
        <text class="indicator-name" :style="{ color: item.color }">{{ item.name }}:</text>
        <text class="indicator-value" :style="{ color: item.color }">{{ item.value }}</text>
        <text v-if="index < indicatorData.length - 1" class="indicator-separator">  </text>
      </text>
    </view>
    <view
      class="chart-wrapper"
    >
      <uni-echarts
        custom-class="app-kline-echarts"
        :option="option"
      />
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-kline-container {
  width: 100%;
  height: 400px;
  position: relative;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.indicator-display {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  background: transparent;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 10px;
  line-height: 1.4;
  pointer-events: none;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.indicator-item {
  display: inline-flex;
  align-items: center;
}

.indicator-name {
  font-size: 10px;
  margin-right: 2px;
  font-weight: 500;
}

.indicator-value {
  font-size: 10px;
  font-weight: 500;
}

.indicator-separator {
  color: #ccc;
}

.app-kline-echarts {
  width: 100%;
  height: 100%;
}
</style>

