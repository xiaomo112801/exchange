/**
 * TradingView Datafeed 简化实现
 * 基于 demo 的思路，使用模拟数据
 */

export interface Bar {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface SymbolInfo {
  name: string
  ticker: string
  description: string
  type: string
  session: string
  timezone: string
  exchange: string
  minmov: number
  pricescale: number
  has_intraday: boolean
  has_weekly_and_monthly: boolean
  supported_resolutions: string[]
  volume_precision: number
  data_status: string
}

export class Datafeed {
  private symbolInfo: SymbolInfo
  private supportedResolutions: string[]

  constructor(symbol: string, supportedResolutions: string[] = ['1', '5', '15', '30', '60', 'D']) {
    this.supportedResolutions = supportedResolutions
    this.symbolInfo = {
      name: symbol,
      ticker: symbol,
      description: symbol,
      type: 'crypto',
      session: '24x7',
      timezone: 'Asia/Shanghai',
      exchange: 'BINANCE',
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_weekly_and_monthly: true,
      supported_resolutions: supportedResolutions,
      volume_precision: 2,
      data_status: 'streaming',
    }
  }

  onReady(callback: (configuration: any) => void) {
    setTimeout(() => {
      callback({
        supported_resolutions: this.supportedResolutions,
        supports_marks: false,
        supports_timescale_marks: true,
        supports_time: true,
      })
    }, 0)
  }

  searchSymbols(_userInput: string, _exchange: string, _symbolType: string, onResult: (symbols: any[]) => void) {
    // 简化实现，返回空数组
    onResult([])
  }

  resolveSymbol(_symbolName: string, onResolve: (symbolInfo: SymbolInfo) => void, _onError: (reason: string) => void) {
    setTimeout(() => {
      onResolve(this.symbolInfo)
    }, 0)
  }

  getBars(
    _symbolInfo: SymbolInfo,
    resolution: string,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: (bars: Bar[], meta: { noData: boolean }) => void,
    _onError: (reason: string) => void,
    _isFirstCall: boolean,
  ) {
    // 生成模拟数据
    const bars: Bar[] = []
    const from = rangeStartDate
    const to = rangeEndDate

    // 计算时间间隔（秒）
    let intervalSeconds = 60
    if (resolution === 'D') {
      intervalSeconds = 86400
    }
    else if (resolution === '240') {
      intervalSeconds = 14400 // 4小时
    }
    else if (resolution === '120') {
      intervalSeconds = 7200 // 2小时
    }
    else if (resolution === '60') {
      intervalSeconds = 3600 // 1小时
    }
    else if (resolution === '30') {
      intervalSeconds = 1800 // 30分钟
    }
    else if (resolution === '15') {
      intervalSeconds = 900 // 15分钟
    }
    else if (resolution === '5') {
      intervalSeconds = 300 // 5分钟
    }
    else if (resolution === '1') {
      intervalSeconds = 60 // 1分钟
    }

    // 生成模拟 K 线数据
    const basePrice = 90000
    let currentTime = from
    let currentPrice = basePrice

    while (currentTime <= to && bars.length < 500) {
      const change = (Math.random() - 0.5) * 200
      const open = currentPrice
      const close = open + change
      const high = Math.max(open, close) + Math.random() * 100
      const low = Math.min(open, close) - Math.random() * 100
      const volume = Math.random() * 100

      bars.push({
        time: currentTime * 1000, // TradingView 使用毫秒
        open,
        high,
        low,
        close,
        volume,
      })

      currentPrice = close
      currentTime += intervalSeconds
    }

    setTimeout(() => {
      onResult(bars, { noData: false })
    }, 100)
  }

  subscribeBars(
    _symbolInfo: SymbolInfo,
    _resolution: string,
    _onTick: (bar: Bar) => void,
    _subscriberUID: string,
    _onResetCacheNeededCallback: () => void,
  ) {
    // 实时数据订阅（简化实现）
    // 实际项目中应该连接 WebSocket
  }

  unsubscribeBars(_subscriberUID: string) {
    // 取消订阅
  }
}
