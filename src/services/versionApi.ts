/**
 * 版本管理 API 服务
 * 基于 docs/版本管理API文档.md 中定义的API规范
 */

import {
  getApiConfig,
  ApiUrlBuilder,
  ApiCacheManager,
  ApiErrorHandler
} from '@/config/api';
import { SITE_CONFIG } from '@/config/site';

// 类型定义
export interface SoftwareVersionHistory {
  id: number;
  softwareId: number;
  version: string;
  releaseDate: string;
  releaseNotes?: string;
  releaseNotesEn?: string;
  downloadLinks?: {
    official?: string;
    quark?: string;
    pan123?: string;
    baidu?: string;
    thunder?: string;
    thunderPan?: string;
    backup?: string[];
  };
  fileSize?: string;
  fileSizeBytes?: number;
  fileHash?: string;
  isStable: boolean;
  isBeta: boolean;
  isPrerelease: boolean;
  versionType: string;
  changelogCategory?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface VersionApiResponse {
  success: boolean;
  data: SoftwareVersionHistory[];
  meta?: {
    software: {
      id: number;
      name: string;
      currentVersion: string;
    };
    total: number;
  };
  error?: string;
}

export interface SingleVersionApiResponse {
  success: boolean;
  data: SoftwareVersionHistory;
  error?: string;
}

export interface VersionStats {
  totalVersions: number;
  stableVersions: number;
  betaVersions: number;
  prereleaseVersions: number;
  latestVersion: string;
  latestStableVersion: string;
  firstReleaseDate: string;
  lastReleaseDate: string;
  averageReleaseCycle: number;
  versionTypeDistribution: {
    release: number;
    beta: number;
    alpha: number;
    rc: number;
  };
  changelogCategoryStats: {
    feature: number;
    bugfix: number;
    security: number;
    performance: number;
  };
}

export interface VersionStatsResponse {
  success: boolean;
  data: VersionStats;
  error?: string;
}

// 新增软件信息接口
export interface SoftwareInfo {
  id: number;
  name: string;
  nameEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  currentVersion: string;
  officialWebsite: string | null;
  category: string | null;
  tags: string[];
  systemRequirements: {
    os: string[];
  };
  openname: string;
  filetype: string;
  isActive: boolean;
  sortOrder: number;
  viewCount: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  currentVersionId: number;
  latestDownloadUrl: string;
}

export interface SoftwareInfoResponse {
  success: boolean;
  data: SoftwareInfo;
  error?: string;
}

// API 调用类
export class VersionApiService {
  protected config: any;
  protected urlBuilder: ApiUrlBuilder;
  private cacheManager: ApiCacheManager;

  constructor() {
    this.config = getApiConfig();
    this.urlBuilder = new ApiUrlBuilder(this.config.BASE_URL, this.config.SOFTWARE_ID);
    this.cacheManager = new ApiCacheManager();
  }

  /**
   * 通用请求方法
   */
  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.config.REQUEST.HEADERS,
        ...options.headers,
      },
    };

    let lastError: any;

    // 重试机制
    for (let attempt = 0; attempt <= this.config.REQUEST.RETRY_COUNT; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.REQUEST.TIMEOUT);

        const response = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;

        // 如果不应该重试或已达到最大重试次数，抛出错误
        if (!ApiErrorHandler.shouldRetry(error) || attempt === this.config.REQUEST.RETRY_COUNT) {
          break;
        }

        // 等待后重试
        if (attempt < this.config.REQUEST.RETRY_COUNT) {
          await new Promise(resolve => setTimeout(resolve, this.config.REQUEST.RETRY_DELAY * (attempt + 1)));
        }
      }
    }

    throw lastError;
  }

  /**
   * 获取软件信息（包括最新下载链接）
   */
  async getSoftwareInfo(): Promise<SoftwareInfoResponse | null> {
    const cacheKey = 'software_info';

    // 检查缓存
    const cached = this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Returning cached software info');
      return cached;
    }

    try {
      // 构建请求URL - 使用新的API端点
      const url = `${this.config.BASE_URL}/app/software/id/${this.config.SOFTWARE_ID}`;
      console.log('Fetching software info from:', url);

      const result = await this.makeRequest<SoftwareInfoResponse>(url);

      if (result && result.success) {
        // 缓存结果
        this.cacheManager.set(cacheKey, result, this.config.CACHE.VERSION_INFO_TTL);
        console.log('Software info fetched successfully:', result.data);
        return result;
      } else {
        console.error('API returned error:', result?.error);
        return null;
      }
    } catch (error) {
      console.error('Error fetching software info:', error);
      // 不抛出错误，而是返回null，让调用者决定如何处理
      return null;
    }
  }

  /**
   * 获取软件版本历史
   * @param options 查询选项
   */
  async getVersionHistory(options: {
    page?: number;
    limit?: number;
    versionType?: 'release' | 'beta' | 'alpha' | 'rc';
    isStable?: boolean;
    sortBy?: 'releaseDate' | 'version';
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<VersionApiResponse | null> {
    const cacheKey = `version_history_${JSON.stringify(options)}`;

    // 检查缓存
    const cached = this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Returning cached version history');
      return cached;
    }

    try {
      // 转换options为正确的类型
      const urlParams: Record<string, string | number> = {};
      Object.entries(options).forEach(([key, value]) => {
        if (typeof value === 'boolean') {
          urlParams[key] = value ? '1' : '0';
        } else if (value !== undefined) {
          urlParams[key] = value;
        }
      });

      const url = this.urlBuilder.getVersionHistoryUrl(urlParams);
      console.log('Fetching version history from:', url);

      const result = await this.makeRequest<VersionApiResponse>(url);

      if (result && result.success) {
        // 缓存结果
        this.cacheManager.set(cacheKey, result, this.config.CACHE.VERSION_HISTORY_TTL);
        console.log('Version history fetched successfully:', result.data.length, 'versions');
        return result;
      } else {
        console.error('API returned error:', result?.error);
        return null;
      }
    } catch (error) {
      throw ApiErrorHandler.handleError(error, '获取版本历史');
    }
  }

  /**
   * 获取最新版本信息
   */
  async getLatestVersion(): Promise<SoftwareVersionHistory | null> {
    const cacheKey = 'latest_version';

    // 检查缓存
    const cached = this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Returning cached latest version');
      return cached;
    }

    try {
      const result = await this.getVersionHistory({
        page: 1,
        limit: 1,
        versionType: 'release',
        isStable: true,
        sortBy: 'releaseDate',
        sortOrder: 'desc'
      });

      if (result && result.data && result.data.length > 0) {
        const latestVersion = result.data[0];
        // 缓存结果
        this.cacheManager.set(cacheKey, latestVersion, this.config.CACHE.VERSION_INFO_TTL);
        return latestVersion;
      }

      return null;
    } catch (error) {
      throw ApiErrorHandler.handleError(error, '获取最新版本');
    }
  }

  /**
   * 获取特定版本详情
   * @param versionId 版本记录ID
   */
  async getVersionDetails(versionId: number): Promise<SoftwareVersionHistory | null> {
    const cacheKey = `version_details_${versionId}`;

    // 检查缓存
    const cached = this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Returning cached version details');
      return cached;
    }

    try {
      const url = this.urlBuilder.getVersionDetailsUrl(versionId);

      const result = await this.makeRequest<SingleVersionApiResponse>(url);

      if (result && result.success) {
        // 缓存结果
        this.cacheManager.set(cacheKey, result.data, this.config.CACHE.VERSION_INFO_TTL);
        return result.data;
      } else {
        console.error('API returned error:', result?.error);
        return null;
      }
    } catch (error) {
      throw ApiErrorHandler.handleError(error, '获取版本详情');
    }
  }

  /**
   * 获取版本统计信息
   */
  async getVersionStats(): Promise<VersionStats | null> {
    const cacheKey = 'version_stats';

    // 检查缓存
    const cached = this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Returning cached version stats');
      return cached;
    }

    try {
      const url = this.urlBuilder.getVersionManagementUrl({
        action: 'stats',
        softwareId: this.config.SOFTWARE_ID
      });

      const result = await this.makeRequest<VersionStatsResponse>(url);

      if (result && result.success) {
        // 缓存结果
        this.cacheManager.set(cacheKey, result.data, this.config.CACHE.VERSION_STATS_TTL);
        return result.data;
      } else {
        console.error('API returned error:', result?.error);
        return null;
      }
    } catch (error) {
      throw ApiErrorHandler.handleError(error, '获取版本统计');
    }
  }

  /**
   * 建议下一个版本号
   * @param changeType 变更类型
   */
  async suggestNextVersion(changeType: 'major' | 'minor' | 'patch' = 'patch'): Promise<string | null> {
    try {
      const url = this.urlBuilder.getVersionManagementUrl({
        action: 'suggest',
        softwareId: this.config.SOFTWARE_ID,
        changeType
      });

      const result = await this.makeRequest<any>(url);

      if (result && result.success) {
        return result.data.suggestedVersion;
      } else {
        console.error('API returned error:', result?.error);
        return null;
      }
    } catch (error) {
      throw ApiErrorHandler.handleError(error, '建议版本号');
    }
  }

  /**
   * 格式化文件大小
   * @param bytes 字节数
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * 格式化发布日期
   * @param dateString 日期字符串
   */
  static formatReleaseDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * 清除缓存
   */
  clearCache(pattern?: string): void {
    this.cacheManager.clear(pattern);
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): { size: number; keys: string[] } {
    return this.cacheManager.getStats();
  }
}

// 导出默认实例
export const versionApi = new VersionApiService();

/**
 * 软件版本管理专用服务
 * 专门用于获取特定软件的版本信息
 */
export class SoftwareVersionService extends VersionApiService {
  constructor() {
    super();
    // 确保使用正确的软件ID
    const config = getApiConfig();
    this.urlBuilder = new ApiUrlBuilder(config.BASE_URL, config.SOFTWARE_ID);
  }

  /**
   * 获取软件的最新版本信息
   * 包含完整的下载链接和元数据
   */
  async getLatestSoftwareVersion(): Promise<SoftwareVersionHistory | null> {
    try {
      console.log(`Fetching latest version for Software ID: ${this.config.SOFTWARE_ID}...`);

      // 获取所有版本，按创建时间降序排列
      let result = await this.getVersionHistory({
        page: 1,
        limit: 20,
        sortBy: 'releaseDate',
        sortOrder: 'desc'
      });

      if (result && result.data && result.data.length > 0) {
        console.log(`Found ${result.data.length} versions`);

        // 通过 ID 判断最新版本（ID 最大的就是最新版本）
        let latestVersion = result.data.reduce((prev, current) => {
          return (current.id > prev.id) ? current : prev;
        });

        console.log('Latest version found:', latestVersion.version, 'with ID:', latestVersion.id);
        return latestVersion;
      }

      console.warn(`No versions found for Software ID: ${this.config.SOFTWARE_ID}`);
      return null;
    } catch (error) {
      console.error('Failed to fetch software version:', error);
      throw error;
    }
  }

  /**
   * 获取软件的版本统计
   */
  async getSoftwareStats(): Promise<VersionStats | null> {
    try {
      console.log('Fetching software version stats...');
      return await this.getVersionStats();
    } catch (error) {
      console.error('Failed to fetch software stats:', error);
      throw error;
    }
  }



  /**
   * 获取所有版本信息，用于版本历史显示
   * 只有最新版本提供下载链接，其他版本只显示日志
   */
  async getAllVersionsWithDownloadPolicy(): Promise<{ latestVersion: SoftwareVersionHistory | null, allVersions: SoftwareVersionHistory[] }> {
    try {
      // 获取所有版本
      const result = await this.getVersionHistory({
        page: 1,
        limit: 50,
        sortBy: 'releaseDate',
        sortOrder: 'desc'
      });

      if (!result || !result.data || result.data.length === 0) {
        console.warn('No versions found');
        return { latestVersion: null, allVersions: [] };
      }

      // 通过 ID 判断最新版本（ID 最大的就是最新版本）
      const latestVersion = result.data.reduce((prev, current) => {
        return (current.id > prev.id) ? current : prev;
      });

      console.log('Latest version determined by ID:', latestVersion.version, 'with ID:', latestVersion.id);
      
      return {
        latestVersion,
        allVersions: result.data
      };
    } catch (error) {
      console.error('Failed to fetch versions with download policy:', error);
      throw error;
    }
  }

  /**
   * 生成动态下载配置
   * 基于API获取的版本信息生成下载页面配置
   * 只有最新版本提供下载链接
   */
  async generateDynamicDownloadConfig(): Promise<any> {
    try {
      const { latestVersion, allVersions } = await this.getAllVersionsWithDownloadPolicy();

      if (!latestVersion) {
        console.warn('No version data available, returning null config');
        return null;
      }

      const config = {
        version: latestVersion.version,
        releaseDate: latestVersion.releaseDate,
        releaseNotes: latestVersion.releaseNotes,
        fileSize: latestVersion.fileSize,
        isStable: latestVersion.isStable,
        latestVersionId: latestVersion.id,

        // Windows 下载配置 - 只有最新版本提供下载
        windows: {
          installer: {
            name: "安装程序",
            filename: `${SITE_CONFIG.name}-${latestVersion.version}-Setup.exe`,
            size: latestVersion.fileSize || "14MB",
            url: latestVersion.downloadLinks?.official || "#",
            description: "推荐：完整安装包，包含所有功能",
            isLatest: true
          }
        },

        // macOS 下载配置 - 暂不支持
        macos: {
          status: "unsupported",
          message: "暂不支持下载",
          description: "macOS 版本正在开发中，敬请期待"
        },

        // Linux 下载配置 - 暂不支持
        linux: {
          status: "unsupported",
          message: "暂不支持下载",
          description: "Linux 版本正在开发中，敬请期待"
        },

        // 所有版本信息（用于版本历史显示）
        allVersions: allVersions.map(version => ({
          ...version,
          isLatest: version.id === latestVersion.id,
          downloadAvailable: version.id === latestVersion.id // 只有最新版本可下载
        })),

        // 所有下载链接
        allDownloadLinks: latestVersion.downloadLinks || {},

        // 元数据
        metadata: {
          fileHash: latestVersion.fileHash,
          versionType: latestVersion.versionType,
          changelogCategory: latestVersion.changelogCategory,
          ...latestVersion.metadata
        }
      };

      console.log('Generated dynamic download config:', config);
      return config;
    } catch (error) {
      console.error('Failed to generate dynamic download config:', error);
      return null;
    }
  }

  /**
   * 计算便携版文件大小（通常比安装版大一些）
   */
  private calculatePortableSize(originalSize: string): string {
    try {
      const sizeMatch = originalSize.match(/(\d+(?:\.\d+)?)\s*(MB|GB)/i);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();
        const newSize = size + 7; // 便携版通常大7MB左右
        return `${newSize} ${unit}`;
      }
    } catch (error) {
      console.warn('Failed to calculate portable size:', error);
    }
    return originalSize;
  }

  /**
   * 计算macOS版本文件大小（通常比Windows版小一些）
   */
  private calculateMacSize(originalSize: string): string {
    try {
      const sizeMatch = originalSize.match(/(\d+(?:\.\d+)?)\s*(MB|GB)/i);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();
        const newSize = Math.max(size - 7, 1); // macOS版通常小7MB左右
        return `${newSize} ${unit}`;
      }
    } catch (error) {
      console.warn('Failed to calculate macOS size:', error);
    }
    return originalSize;
  }

  /**
   * 计算Linux版本文件大小
   */
  private calculateLinuxSize(originalSize: string): string {
    try {
      const sizeMatch = originalSize.match(/(\d+(?:\.\d+)?)\s*(MB|GB)/i);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();
        const newSize = Math.max(size - 3, 1); // Linux版通常小3MB左右
        return `${newSize} ${unit}`;
      }
    } catch (error) {
      console.warn('Failed to calculate Linux size:', error);
    }
    return originalSize;
  }


}

// 导出软件管理专用实例
export const softwareVersionApi = new SoftwareVersionService();

// ==================== 公告系统 API 服务 ====================

// 公告系统类型定义
export interface SoftwareAnnouncement {
  id: number;
  softwareId: number;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  type: string;
  priority: string;
  version?: string;
  isPublished: boolean;
  publishedAt: string;
  expiresAt?: string;
  metadata?: {
    urgent?: boolean;
    targetUsers?: string;
    showInApp?: boolean;
    clickCount?: number;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementApiResponse {
  success: boolean;
  data: SoftwareAnnouncement[];
  meta?: {
    software: {
      id: number;
      name: string;
    };
    total: number;
    filters: {
      type: string;
      priority: string;
      published: boolean;
    };
  };
}

export interface AnnouncementQueryParams {
  type?: string;
  priority?: string;
  published?: boolean;
  limit?: number;
}

// 公告类型枚举
export const ANNOUNCEMENT_TYPES = {
  UPDATE: 'update',
  FEATURE: 'feature',
  BUGFIX: 'bugfix',
  MAINTENANCE: 'maintenance',
  SECURITY: 'security',
  GENERAL: 'general',
  PROMOTION: 'promotion',
  DEPRECATION: 'deprecation'
} as const;

export const ANNOUNCEMENT_PRIORITIES = {
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low'
} as const;

// 公告类型配置
export const ANNOUNCEMENT_TYPE_CONFIG = {
  [ANNOUNCEMENT_TYPES.UPDATE]: { icon: '🔄', label: '更新通知', color: 'blue' },
  [ANNOUNCEMENT_TYPES.FEATURE]: { icon: '✨', label: '新功能', color: 'green' },
  [ANNOUNCEMENT_TYPES.BUGFIX]: { icon: '🐛', label: '修复通知', color: 'orange' },
  [ANNOUNCEMENT_TYPES.MAINTENANCE]: { icon: '🔧', label: '维护通知', color: 'gray' },
  [ANNOUNCEMENT_TYPES.SECURITY]: { icon: '🔒', label: '安全警告', color: 'red' },
  [ANNOUNCEMENT_TYPES.GENERAL]: { icon: '📢', label: '一般通知', color: 'blue' },
  [ANNOUNCEMENT_TYPES.PROMOTION]: { icon: '🎉', label: '促销活动', color: 'purple' },
  [ANNOUNCEMENT_TYPES.DEPRECATION]: { icon: '⚠️', label: '停用通知', color: 'yellow' }
};

export const ANNOUNCEMENT_PRIORITY_CONFIG = {
  [ANNOUNCEMENT_PRIORITIES.HIGH]: { color: 'red', label: '高优先级' },
  [ANNOUNCEMENT_PRIORITIES.NORMAL]: { color: 'yellow', label: '普通' },
  [ANNOUNCEMENT_PRIORITIES.LOW]: { color: 'green', label: '低优先级' }
};

/**
 * 公告系统 API 服务
 * 基于 docs/公告系统API详细文档.md 中定义的API规范
 */
export class AnnouncementApiService {
  protected config: any;
  protected urlBuilder: ApiUrlBuilder;
  private cacheManager: ApiCacheManager;

  constructor() {
    const config = getApiConfig();
    this.config = config;
    this.urlBuilder = new ApiUrlBuilder(config.BASE_URL, config.SOFTWARE_ID);
    this.cacheManager = new ApiCacheManager();
  }

  /**
   * 通用请求方法
   */
  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.config.REQUEST.HEADERS,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw ApiErrorHandler.handleError(error);
    }
  }

  /**
   * 获取公告列表
   */
  async getAnnouncements(params: AnnouncementQueryParams = {}): Promise<AnnouncementApiResponse> {
    const cacheKey = `announcements_${this.config.SOFTWARE_ID}_${JSON.stringify(params)}`;

    // 尝试从缓存获取
    const cached = this.cacheManager.get(cacheKey) as AnnouncementApiResponse;
    if (cached) {
      console.log('Returning cached announcements');
      return cached;
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append('type', params.type);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.published !== undefined) queryParams.append('published', params.published.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const url = `${this.config.BASE_URL}/app/software/id/${this.config.SOFTWARE_ID}/announcements?${queryParams.toString()}`;

      console.log(`Fetching announcements from: ${url}`);

      const response = await this.makeRequest<AnnouncementApiResponse>(url);

      // 缓存结果（5分钟）
      this.cacheManager.set(cacheKey, response, 5 * 60 * 1000);

      return response;
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      throw error;
    }
  }

  /**
   * 获取活跃公告（已发布且未过期）
   */
  async getActiveAnnouncements(limit: number = 10): Promise<SoftwareAnnouncement[]> {
    try {
      const response = await this.getAnnouncements({
        published: true,
        limit
      });

      if (!response.success || !response.data) {
        return [];
      }

      // 过滤未过期的公告
      const now = new Date();
      const activeAnnouncements = response.data.filter(announcement => {
        if (!announcement.expiresAt) return true;
        return new Date(announcement.expiresAt) > now;
      });

      // 按优先级和发布时间排序
      return activeAnnouncements.sort((a, b) => {
        // 优先级排序：high > normal > low
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;

        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }

        // 相同优先级按发布时间排序
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });
    } catch (error) {
      console.error('Failed to get active announcements:', error);
      return [];
    }
  }

  /**
   * 获取高优先级公告
   */
  async getHighPriorityAnnouncements(): Promise<SoftwareAnnouncement[]> {
    try {
      const response = await this.getAnnouncements({
        published: true,
        priority: 'high',
        limit: 5
      });

      return response.success ? response.data : [];
    } catch (error) {
      console.error('Failed to get high priority announcements:', error);
      return [];
    }
  }

  /**
   * 清除公告缓存
   */
  clearCache(): void {
    this.cacheManager.clear();
  }
}

/**
 * 软件专用公告服务
 * 专门用于获取软件ID对应的公告信息
 */
export class DeviceManagerAnnouncementService extends AnnouncementApiService {
  constructor() {
    super();
    // 确保使用正确的软件ID
    const config = getApiConfig();
    this.urlBuilder = new ApiUrlBuilder(config.BASE_URL, config.SOFTWARE_ID);
  }

  /**
   * 获取软件的主页公告
   * 返回适合在主页显示的公告列表
   */
  async getHomepageAnnouncements(): Promise<SoftwareAnnouncement[]> {
    try {
      console.log(`Fetching ${SITE_CONFIG.name} homepage announcements (Software ID: ${this.config?.SOFTWARE_ID || 'current'})...`);

      // 获取活跃的公告，限制数量为3条
      const announcements = await this.getActiveAnnouncements(3);

      // 优先显示高优先级和更新类型的公告
      const prioritizedAnnouncements = announcements.filter(announcement => {
        return announcement.priority === 'high' ||
               announcement.type === 'update' ||
               announcement.type === 'security' ||
               announcement.type === 'feature';
      });

      // 如果高优先级公告不足3条，补充其他公告
      if (prioritizedAnnouncements.length < 3) {
        const remainingCount = 3 - prioritizedAnnouncements.length;
        const otherAnnouncements = announcements
          .filter(a => !prioritizedAnnouncements.includes(a))
          .slice(0, remainingCount);

        return [...prioritizedAnnouncements, ...otherAnnouncements];
      }

      return prioritizedAnnouncements.slice(0, 3);
    } catch (error) {
      console.error('Failed to get homepage announcements:', error);
      return [];
    }
  }

  /**
   * 获取与特定版本相关的公告
   */
  async getVersionRelatedAnnouncements(version?: string): Promise<SoftwareAnnouncement[]> {
    try {
      const allAnnouncements = await this.getActiveAnnouncements(20);

      if (!version) return allAnnouncements;

      // 筛选与指定版本相关的公告
      return allAnnouncements.filter(announcement => {
        return announcement.version === version ||
               announcement.type === 'update' ||
               announcement.type === 'bugfix';
      });
    } catch (error) {
      console.error('Failed to get version related announcements:', error);
      return [];
    }
  }

  /**
   * 格式化公告显示数据
   */
  formatAnnouncementForDisplay(announcement: SoftwareAnnouncement) {
    const typeConfig = ANNOUNCEMENT_TYPE_CONFIG[announcement.type as keyof typeof ANNOUNCEMENT_TYPE_CONFIG];
    const priorityConfig = ANNOUNCEMENT_PRIORITY_CONFIG[announcement.priority as keyof typeof ANNOUNCEMENT_PRIORITY_CONFIG];

    return {
      ...announcement,
      displayType: typeConfig || { icon: '📢', label: '通知', color: 'blue' },
      displayPriority: priorityConfig || { color: 'gray', label: '普通' },
      isUrgent: announcement.metadata?.urgent || announcement.priority === 'high',
      formattedDate: this.formatDate(announcement.publishedAt),
      isExpiringSoon: this.isExpiringSoon(announcement.expiresAt)
    };
  }

  /**
   * 格式化日期显示
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return '今天';
      if (diffDays === 1) return '昨天';
      if (diffDays < 7) return `${diffDays}天前`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;

      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '未知时间';
    }
  }

  /**
   * 检查公告是否即将过期
   */
  private isExpiringSoon(expiresAt?: string): boolean {
    if (!expiresAt) return false;

    try {
      const expireDate = new Date(expiresAt);
      const now = new Date();
      const diffTime = expireDate.getTime() - now.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return diffDays <= 7 && diffDays > 0;
    } catch (error) {
      return false;
    }
  }
}

// 导出DeviceManager Pro专用公告服务实例
export const deviceManagerAnnouncementApi = new DeviceManagerAnnouncementService();
