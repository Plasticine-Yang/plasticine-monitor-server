export class EventQuery {
  /** 项目 id */
  projectId: string

  /**
   * 筛选指定时间段的数据
   *
   * @example
   * 1h - 过去 1 小时内的数据
   * 1d - 过去 1 天内的数据
   */
  timeRange?: string

  /** 用户 id */
  userId?: string

  /** 会话 id */
  sessionId?: string

  /** 页面路径 */
  pagePath?: string
}
