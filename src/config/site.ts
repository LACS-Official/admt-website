export const SITE_CONFIG = {
  // 基本信息
  name: "玩机管家-ADMT",
  englishName: "Android Device Management Tool",
  description: "专为开发者和 IT 专业人士打造的强大 Android 设备管理工具",
  tagline: "重新定义设备管理体验",
  subtitle: "强大、简洁、优雅",
  url: "https://admt.lacs.",

  // SEO 信息
  keywords: ["领创工作室", "LACS", "Android", "设备管理", "开发者工具", "移动开发", "IT管理", "玩机管家","ADMT","admt","刷机","安卓刷机"],
  author: "领创工作室",

  // 社交媒体
  social: {
    email: "admt@lacs.email"
  },

  // 产品信息
  product: {
    version: "1.0.0",
    releaseDate: "2025-08-15",
    platforms: ["Windows", "macOS", "Linux"],
    license: "商业许可"
  },

  // 下载配置
  
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
    { name: "关于与联系", href: "https://www.lacs.cc/contact" }
  ]
};