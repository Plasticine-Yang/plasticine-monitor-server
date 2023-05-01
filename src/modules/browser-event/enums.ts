/** 上报的事件类型 */
export enum EventTypeEnum {
  /** JS 运行时错误 */
  JSError = 'js-error',
  /** 性能指标 */
  Performance = 'performance',
  /** 用户行为 */
  UserBehavior = 'user-behavior',
}

/** 性能指标种类 */
export enum PerformanceMetricsEnum {
  /** First Paint */
  FP = 'FP',
  /** First Contentful Paint */
  FCP = 'FCP',
  /** Largest Contentful Paint */
  LCP = 'LCP',
  /** First Input Delay */
  FID = 'FID',
  /** Time To Interactive */
  TTI = 'TTI',
}

/** 用户行为指标种类 */
export enum UserBehaviorMetricsEnum {
  /** PV */
  PageView = 'page-view',
  /** JS 运行时错误 */
  JSError = 'js-error',
  /** 网络请求 */
  Network = 'network',
  /** 路由变更 */
  RouteChange = 'route-change',
  /** 点击行为 */
  Click = 'click',
}
