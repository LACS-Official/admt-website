/**
 * API 配置文件
 * 管理版本管理API的相关配置
 */

// API 基础配置
export const API_CONFIG = {
  // 基础URL
  BASE_URL: 'https://api-g.lacs.cc',
  
  // 玩机管家 (Android Device Management Tool) 的软件ID
  SOFTWARE_ID: 1,
  
  // API 端点
  ENDPOINTS: {
    // 获取版本历史
    VERSION_HISTORY: '/app/software/id/{softwareId}/versions',

    // 获取特定版本详情
    VERSION_DETAILS: '/app/software/id/{softwareId}/versions/{versionId}',

    // 版本管理操作
    VERSION_MANAGEMENT: '/app/software/version-management',

    // 添加新版本
    ADD_VERSION: '/app/software/id/{softwareId}/versions',

    // 更新版本信息
    UPDATE_VERSION: '/app/software/id/{softwareId}/versions/{versionId}',

    // 公告系统端点
    ANNOUNCEMENTS: '/app/software/id/{softwareId}/announcements',

    // 获取特定公告详情
    ANNOUNCEMENT_DETAILS: '/app/software/id/{softwareId}/announcements/{announcementId}',

    // 添加新公告
    ADD_ANNOUNCEMENT: '/app/software/id/{softwareId}/announcements',

    // 更新公告信息
    UPDATE_ANNOUNCEMENT: '/app/software/id/{softwareId}/announcements/{announcementId}',

    // 删除公告
    DELETE_ANNOUNCEMENT: '/app/software/id/{softwareId}/announcements/{announcementId}'
  },
  
  // 请求配置
  REQUEST: {
    // 默认超时时间 (毫秒)
    TIMEOUT: 10000,
    
    // 重试次数
    RETRY_COUNT: 3,
    
    // 重试延迟 (毫秒)
    RETRY_DELAY: 1000,
    
    // 默认请求头
    HEADERS: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://admt.lacs.cc'
    }
  },
  
  // 缓存配置
  CACHE: {
    // 版本信息缓存时间 (毫秒)
    VERSION_INFO_TTL: 5 * 60 * 1000, // 5分钟
    
    // 版本历史缓存时间 (毫秒)
    VERSION_HISTORY_TTL: 10 * 60 * 1000, // 10分钟
    
    // 版本统计缓存时间 (毫秒)
    VERSION_STATS_TTL: 15 * 60 * 1000, // 15分钟
    
    // 是否启用缓存
    ENABLED: true
  },
  
  // 错误处理配置
  ERROR_HANDLING: {
    // 是否显示详细错误信息
    SHOW_DETAILED_ERRORS: true,
    
    // 错误重试的HTTP状态码
    RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
    
    // 默认错误消息
    DEFAULT_ERROR_MESSAGE: '服务暂时不可用，请稍后重试'
  }
};

// 环境配置
export const ENV_CONFIG = {
  // 开发环境配置
  development: {
    ...API_CONFIG,
    REQUEST: {
      ...API_CONFIG.REQUEST,
      TIMEOUT: 30000, // 开发环境延长超时时间
    },
    ERROR_HANDLING: {
      ...API_CONFIG.ERROR_HANDLING,
      SHOW_DETAILED_ERRORS: true
    }
  },
  
  // 生产环境配置
  production: {
    ...API_CONFIG,
    ERROR_HANDLING: {
      ...API_CONFIG.ERROR_HANDLING,
      SHOW_DETAILED_ERRORS: false
    }
  },
  
  // 测试环境配置
  test: {
    ...API_CONFIG,
    BASE_URL: 'https://test-api-g.lacs.cc',
    CACHE: {
      ...API_CONFIG.CACHE,
      ENABLED: false // 测试环境禁用缓存
    }
  }
};

// 获取当前环境配置
export function getApiConfig() {
  const env = import.meta.env.MODE || 'development';
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development;
}

// URL 构建工具
export class ApiUrlBuilder {
  private baseUrl: string;
  private softwareId: number;

  constructor(baseUrl: string = API_CONFIG.BASE_URL, softwareId: number = API_CONFIG.SOFTWARE_ID) {
    this.baseUrl = baseUrl;
    this.softwareId = softwareId;
  }

  /**
   * 构建版本历史URL
   */
  getVersionHistoryUrl(params?: Record<string, string | number>): string {
    const endpoint = API_CONFIG.ENDPOINTS.VERSION_HISTORY.replace('{softwareId}', this.softwareId.toString());
    const url = `${this.baseUrl}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });
      return `${url}?${searchParams}`;
    }
    
    return url;
  }

  /**
   * 构建版本详情URL
   */
  getVersionDetailsUrl(versionId: number): string {
    const endpoint = API_CONFIG.ENDPOINTS.VERSION_DETAILS
      .replace('{softwareId}', this.softwareId.toString())
      .replace('{versionId}', versionId.toString());
    
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * 构建版本管理URL
   */
  getVersionManagementUrl(params?: Record<string, string | number>): string {
    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.VERSION_MANAGEMENT}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });
      return `${url}?${searchParams}`;
    }
    
    return url;
  }

  /**
   * 构建添加版本URL
   */
  getAddVersionUrl(): string {
    const endpoint = API_CONFIG.ENDPOINTS.ADD_VERSION.replace('{softwareId}', this.softwareId.toString());
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * 构建更新版本URL
   */
  getUpdateVersionUrl(versionId: number): string {
    const endpoint = API_CONFIG.ENDPOINTS.UPDATE_VERSION
      .replace('{softwareId}', this.softwareId.toString())
      .replace('{versionId}', versionId.toString());
    
    return `${this.baseUrl}${endpoint}`;
  }
}

// 缓存管理器
export class ApiCacheManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

  constructor() {
    this.cache = new Map();
  }

  /**
   * 设置缓存
   */
  set(key: string, data: any, ttl: number): void {
    if (!getApiConfig().CACHE.ENABLED) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * 获取缓存
   */
  get(key: string): any | null {
    if (!getApiConfig().CACHE.ENABLED) return null;
    
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  /**
   * 清除缓存
   */
  clear(pattern?: string): void {
    if (pattern) {
      const keys = Array.from(this.cache.keys()).filter(key => key.includes(pattern));
      keys.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  /**
   * 获取缓存统计
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// 错误处理工具
export class ApiErrorHandler {
  /**
   * 处理API错误
   */
  static handleError(error: any, context?: string): Error {
    const config = getApiConfig();
    
    let message = config.ERROR_HANDLING.DEFAULT_ERROR_MESSAGE;
    
    if (config.ERROR_HANDLING.SHOW_DETAILED_ERRORS) {
      if (error.response) {
        // HTTP错误响应
        message = `API错误 ${error.response.status}: ${error.response.statusText}`;
        if (error.response.data?.error) {
          message += ` - ${error.response.data.error}`;
        }
      } else if (error.request) {
        // 网络错误
        message = '网络连接错误，请检查网络设置';
      } else {
        // 其他错误
        message = error.message || '未知错误';
      }
      
      if (context) {
        message = `${context}: ${message}`;
      }
    }
    
    console.error('API Error:', error);
    return new Error(message);
  }

  /**
   * 判断是否应该重试
   */
  static shouldRetry(error: any): boolean {
    const config = getApiConfig();
    
    if (error.response) {
      return config.ERROR_HANDLING.RETRY_STATUS_CODES.includes(error.response.status);
    }
    
    // 网络错误通常可以重试
    return !error.response;
  }
}

// 导出默认实例
export const apiUrlBuilder = new ApiUrlBuilder();
export const apiCacheManager = new ApiCacheManager();
