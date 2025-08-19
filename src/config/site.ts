export const SITE_CONFIG = {
  // 基本信息
  name: "玩机管家",
  englishName: "Android Device Management Tool",
  description: "专为开发者和 IT 专业人士打造的强大 Android 设备管理工具",
  tagline: "重新定义设备管理体验",
  subtitle: "强大、简洁、优雅",
  url: "https://your-software-website.vercel.app",

  // SEO 信息
  keywords: ["Android", "设备管理", "开发者工具", "移动开发", "IT管理", "玩机管家"],
  author: "玩机管家团队",

  // 社交媒体
  social: {
    twitter: "@玩机管家",
    github: "https://github.com/yourcompany/android-device-management-tool",
    linkedin: "https://linkedin.com/company/android-device-management-tool",
    email: "contact@android-device-tool.com"
  },

  // 产品信息
  product: {
    version: "2.1.0",
    releaseDate: "2024-01-15",
    platforms: ["Windows", "macOS", "Linux"],
    license: "商业许可"
  },

  // 下载配置
  downloads: {
    // Windows 下载选项
    windows: {
      installer: {
        name: "安装程序",
        filename: "玩机管家-Setup.exe",
        size: "45 MB",
        url: "https://releases.example.com/windows/玩机管家-Setup.exe",
        description: "推荐：完整安装包，包含所有功能"
      },
      requirements: {
        os: "Windows 10 (64位) 或更高版本",
        ram: "4 GB 内存最低，推荐 8 GB",
        storage: "500 MB 可用磁盘空间",
        other: ["USB 2.0 或更高版本端口", "网络连接用于激活"]
      }
    },

    // macOS 下载选项 - 暂不支持
    macos: {
      status: "unsupported",
      message: "暂不支持下载",
      description: "macOS 版本正在开发中，敬请期待",
      requirements: {
        os: "macOS 11.0 (Big Sur) 或更高版本",
        processor: "Intel 或 Apple Silicon 处理器",
        ram: "4 GB 内存最低，推荐 8 GB",
        storage: "500 MB 可用磁盘空间",
        other: ["USB-C 或 USB-A 端口"]
      }
    },

    // Linux 下载选项 - 暂不支持
    linux: {
      status: "unsupported",
      message: "暂不支持下载",
      description: "Linux 版本正在开发中，敬请期待",
      requirements: {
        os: "Ubuntu 20.04+ / Fedora 35+ 或同等版本",
        architecture: "x86_64 架构",
        ram: "4 GB 内存最低，推荐 8 GB",
        storage: "500 MB 可用磁盘空间",
        other: ["libusb 和 udev 支持"]
      }
    }
  },
  
  // 功能特性
  features: [
    {
      title: "智能设备发现",
      description: "自动发现并连接网络中的 Android 设备，无需繁琐配置",
      icon: "🔍"
    },
    {
      title: "远程控制",
      description: "完整的屏幕镜像和远程控制，如同设备就在手边",
      icon: "📱"
    },
    {
      title: "文件管理",
      description: "设备与电脑间无缝传输文件，拖拽即可完成",
      icon: "📁"
    },
    {
      title: "应用管理",
      description: "跨多设备安装、卸载和管理应用程序，批量操作更高效",
      icon: "📦"
    },
    {
      title: "批量操作",
      description: "同时对多台设备执行操作，大幅提升工作效率",
      icon: "⚡"
    },
    {
      title: "安全隐私",
      description: "企业级安全保护，加密连接确保数据安全",
      icon: "🔒"
    }
  ],
  
  // 定价方案
  pricing: [
    {
      name: "个人版",
      price: "¥199",
      period: "买断制",
      description: "专为个人开发者设计",
      features: [
        "支持 5 台设备",
        "基础远程控制",
        "文件传输功能",
        "邮件技术支持",
        "1 年免费更新"
      ],
      popular: false
    },
    {
      name: "专业版",
      price: "¥699",
      period: "买断制",
      description: "小团队的理想选择",
      features: [
        "支持 25 台设备",
        "高级远程控制",
        "批量操作功能",
        "优先技术支持",
        "2 年免费更新",
        "团队协作工具"
      ],
      popular: true
    },
    {
      name: "企业版",
      price: "¥2099",
      period: "买断制",
      description: "大型组织的完整解决方案",
      features: [
        "无限设备支持",
        "全部功能包含",
        "7×24 电话支持",
        "定制化集成",
        "终身免费更新",
        "私有化部署"
      ],
      popular: false
    }
  ],
  
  // 导航菜单
  navigation: [
    { name: "首页", href: "/" },
    { name: "功能特性", href: "/features" },
    { name: "文档", href: "/docs" },
    { name: "下载", href: "/download" },
    { name: "关于与联系", href: "/about-contact" }
  ]
};
