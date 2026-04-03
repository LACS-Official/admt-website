export const SITE_CONFIG = {
  // 基础信息
  name: "玩机管家-ADMT",
  englishName: "Android Device Management Tool",
  description: "专为开发者和 IT 专业人士打造的强大 Android 设备管理工具",
  tagline: "重新定义设备管理体验",
  subtitle: "强大、简洁、优雅",
  url: "https://admt.lacs.cc",
  softwareId: 1, // 后端 API 对应的软件 ID

  // SEO 信息
  keywords: [
    "领创工作室",
    "LACS",
    "Android",
    "设备管理",
    "开发者工具",
    "移动开发",
    "IT管理",
    "玩机管家",
    "ADMT",
    "admt",
    "刷机",
    "安卓刷机",
  ],
  author: "领创工作室",
  copyright: `© 2020-${new Date().getFullYear()} 领创工作室. 保留所有权利。`,

  // 备案信息
  beian: {
    icp: "辽ICP备2025056705号",
    police: "辽公网安备21122402000208号",
  },

  // 社交媒体
  social: {
    email: "admt@lacs.email",
  },

  // 产品信息
  product: {
    version: "1.2.0",
    releaseDate: "2025-08-15",
    platforms: ["Windows", "macOS", "Linux"],
    license: "商业许可",
  },

  // 导航菜单
  navigation: [
    { name: "首页", href: "/" },
    { name: "功能特性", href: "/features" },
    { name: "文档", href: "/docs" },
    { name: "下载", href: "/download" },
    { name: "反馈", href: "/feedback" },
    { name: "关于与联系", href: "https://www.lacs.cc/contact" },
  ],

  // 首页内容配置
  home: {
    hero: {
      ctaDownload: "立即下载",
      ctaLearnMore: "了解详情",
      bgImage: "/img/admt-bg.webp",
    },
    showcase: {
      title: "看见每一处细节",
      description:
        "深度的系统洞察，直观的数据展示。ADMT 让复杂的 Android 系统管理变得如丝般顺滑。",
      image:
        "https://img-g.lacs.cc/file/1770038394235_SnowShot_2026-02-02_18-38-19.webp",
      features: [
        "全方位的设备信息展示",
        "实时的系统日志捕获",
        "全能的手机信息管理",
      ],
    },
    featuresPreview: {
      title: "强大功能",
      subtitle: "一切都为了让设备管理变得简单而高效",
      viewAllText: "探索所有功能",
      items: [
        {
          title: "欢迎使用",
          description: "ADMT，让设备管理变得简单而高效。",
          image:
            "https://img-g.lacs.cc/file/1770038393216_SnowShot_2026-02-02_16-36-04.webp",
        },
        {
          title: "全能的设备信息",
          description: "获取设备的最详尽信息与规格参数。",
          image:
            "https://img-g.lacs.cc/file/1770038394235_SnowShot_2026-02-02_18-38-19.webp",
        },
        {
          title: "设备投屏",
          description: "超低延迟，极致高清画面呈现。",
          image:
            "https://img-g.lacs.cc/file/1770038393162_SnowShot_2026-02-02_18-41-20.webp",
        },
        {
          title: "应用管理",
          description: "批量管理应用，带来极致工作效率。",
          image:
            "https://img-g.lacs.cc/file/1770038395136_SnowShot_2026-02-02_18-51-34.webp",
        },
      ],
    },
    cta: {
      title: "准备好开始使用了吗？",
      description: "强大、简洁、极致的安卓设备跨平台全能玩机管家",
      downloadText: "免费下载",
      docsText: "查看文档",
    },
    gallery: {
      title: "界面预览",
      images: [
        "https://img-g.lacs.cc/file/1770038393216_SnowShot_2026-02-02_16-36-04.webp",
        "https://img-g.lacs.cc/file/1770038395960_SnowShot_2026-02-02_18-55-51.webp",
        "https://img-g.lacs.cc/file/1770038396282_SnowShot_2026-02-02_18-56-00.webp",
        "https://img-g.lacs.cc/file/1770038393568_SnowShot_2026-02-02_18-56-14.webp",
        "https://img-g.lacs.cc/file/1770038400618_SnowShot_2026-02-02_18-56-42.webp",
        "https://img-g.lacs.cc/file/1770038392565_SnowShot_2026-02-02_18-56-54.webp",
        "https://img-g.lacs.cc/file/1770038400278_SnowShot_2026-02-02_18-57-02.webp",
      ],
    },
  },

  // 功能页配置
  featuresPage: {
    hero: {
      title: "强大功能，尽在掌握",
      subtitle: "一切都为了让设备管理变得简单而高效",
    },
    featureDetails: [
      {
        title: "极致连接体验",
        description: "自研智能连接技术，支持 USB 与 无线 双模式。秒识别，瞬时同步，让连接不再是阻碍。",
        image: "https://img-g.lacs.cc/file/1770038394235_SnowShot_2026-02-02_18-38-19.webp",
        badges: ["全自动发现", "断线重连", "多设备并发"],
        color: "bg-white dark:bg-black",
      },
      {
        title: "Fastboot镜像可视化",
        description: "支持查看，导出，让Fastboot镜像管理变得简单高效。",
        image: "https://img-g.lacs.cc/file/1770043646538_SnowShot_2026-02-02_22-46-23.webp",
        badges: ["分类查看", "核心作用详解"],
        color: "bg-gray-50 dark:bg-gray-900/40",
        reverse: true,
      },
      {
        title: "全能的应用管理",
        description: "从安装、提权到卸载等功能。权限深度管控，掌控应用每一个细节。",
        image: "https://img-g.lacs.cc/file/1770038395136_SnowShot_2026-02-02_18-51-34.webp",
        badges: ["批量卸载", "批量冻结/解冻", "强行停止", "导出apk", "清除数据", "导入/导出列表"],
        color: "bg-white dark:bg-black",
      },
      {
        title: "低延时设备投屏",
        description: "基于scrcpy的屏幕镜像。支持多种设置，在电脑上也能享受高帧率顺滑操作。",
        image: "https://img-g.lacs.cc/file/1770038393162_SnowShot_2026-02-02_18-41-20.webp",
        badges: ["高清镜像", "键鼠同步", "剪贴板共享"],
        color: "bg-gray-50 dark:bg-gray-900/40",
        reverse: true,
      },
      {
        title: "全能的应用安装功能",
        description: "支持单个安装、批量安装、遍历文件夹安装包安装",
        image: "https://img-g.lacs.cc/file/1770038385884_SnowShot_2026-02-02_18-50-53.webp",
        badges: ["批量安装", "遍历安装"],
        color: "bg-white dark:bg-black",
      },
      {
        title: "按键模拟",
        description: "支持各种常用按键模拟",
        image: "https://img-g.lacs.cc/file/1770038388771_SnowShot_2026-02-02_18-41-06.webp",
        badges: ["按键模拟"],
        color: "bg-gray-50 dark:bg-gray-900/40",
        reverse: true,
      },
      {
        title: "设备系统设置",
        description: "支持显示控制，动画速度，电源管理，电池模拟",
        image: "https://img-g.lacs.cc/file/1770038393224_SnowShot_2026-02-02_18-51-57.webp",
        badges: ["显示控制", "动画速度", "电源管理", "电池模拟"],
        color: "bg-white dark:bg-black",
      },
      {
        title: "镜像刷入",
        description: "支持常规镜像刷入，到指定的分区，以及强大的刷入模式",
        image: "https://img-g.lacs.cc/file/1770038397996_SnowShot_2026-02-02_18-52-41.webp",
        badges: ["常规刷入", "分区刷入", "刷入模式"],
        color: "bg-gray-50 dark:bg-gray-900/40",
        reverse: true,
      },
      {
        title: "线刷功能",
        description: "支持小米线刷功能",
        image: "https://img-g.lacs.cc/file/1770038390097_SnowShot_2026-02-02_18-55-41.webp",
        badges: ["线刷功能"],
        color: "bg-white dark:bg-black",
      },
      {
        title: "在线资源",
        description: "支持在线资源下载",
        image: "https://img-g.lacs.cc/file/1770038395960_SnowShot_2026-02-02_18-55-51.webp",
        badges: ["在线资源"],
        color: "bg-gray-50 dark:bg-gray-900/40",
        reverse: true,
      },
    ],
    subFeatures: [
      {
        title: "设备概览可视化",
        description: "实时监控电池健康、内存占用及 CPU 负载。",
        image: "https://img-g.lacs.cc/file/1770038394235_SnowShot_2026-02-02_18-38-19.webp",
        span: "md:col-span-2",
      },
      {
        title: "adb/fastboot命令交互",
        description: "深度集成终端。",
        image: "https://img-g.lacs.cc/file/1770038392565_SnowShot_2026-02-02_18-56-54.webp",
        span: "md:col-span-1",
      },
      {
        title: "调试面板",
        description: "Logcat 实时过滤与系统参数查看。",
        image: "https://img-g.lacs.cc/file/1770038393651_SnowShot_2026-02-02_18-51-05.webp",
        span: "md:col-span-1",
      },
      {
        title: "全局通知和提示音",
        description: "界面优雅，声音悦耳",
        span: "md:col-span-1",
      },
    ],
    moreFeatures: [
      "https://img-g.lacs.cc/file/1770038393216_SnowShot_2026-02-02_16-36-04.webp",
      "https://img-g.lacs.cc/file/1770038395960_SnowShot_2026-02-02_18-55-51.webp",
      "https://img-g.lacs.cc/file/1770038396282_SnowShot_2026-02-02_18-56-00.webp",
      "https://img-g.lacs.cc/file/1770038393568_SnowShot_2026-02-02_18-56-14.webp",
      "https://img-g.lacs.cc/file/1770038400618_SnowShot_2026-02-02_18-56-42.webp",
      "https://img-g.lacs.cc/file/1770038392565_SnowShot_2026-02-02_18-56-54.webp",
      "https://img-g.lacs.cc/file/1770038400278_SnowShot_2026-02-02_18-57-02.webp",
    ],
  },

  // 下载页配置
  downloadPage: {
    hero: {
      title: "获取 {SITE_CONFIG.name}",
      subtitle: "跨平台支持，随时随地开启高效设备管理。",
      versionReadyPrefix: "最新版本 ",
      versionReadySuffix: " 已就绪",
    },
    providerIcons: {
      quark: "/img/icons/夸克网盘.svg",
      baidu: "/img/icons/百度网盘.svg",
      thunderPan: "/img/icons/迅雷.svg",
    },
    platforms: {
      windows: {
        id: "windows",
        name: "Windows",
        status: "stable",
        supportText: "稳定版本",
        requirement: "Windows 10/11 x64",
        items: ["官方安装包 (.exe)", "绿色免安装版 (.zip)"],
        icon: "M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.351",
      },
      macos: {
        id: "macos",
        name: "macOS",
        status: "planned",
        supportText: "正在开发中",
        requirement: "macOS 11.0+",
        statusText: "开发中",
        pollButtonText: "我想在 macOS 上使用",
        pollPrefix: "已有 ",
        pollSuffix: " 位用户支持",
        storageKey: "admt_macos_poll_v1",
        poll: {
          title: "macOS 版本发布意愿投票",
          description: "如果您希望我们在 macOS 平台上发布，请点击下方按钮参与投票。您的支持将加快我们的开发进度。",
          apiUrl: "/api/macos-poll",
        },
      },
      linux: {
        id: "linux",
        name: "Linux",
        status: "planned",
        supportText: "正在计划中",
        requirement: "Ubuntu/Debian/Fedora",
        statusText: "计划中",
        pollButtonText: "我想在 Linux 上使用",
        pollPrefix: "已有 ",
        pollSuffix: " 位用户支持",
        storageKey: "admt_linux_poll_v1",
        poll: {
          title: "Linux 版本发布意愿投票",
          description: "如果您希望我们在 Linux 平台上发布，请点击下方按钮参与投票。您的支持将加快我们的开发进度。",
          apiUrl: "/api/linux-poll",
        },
      },
    },
    footerMessage:
      "暂无 macOS 或 Linux 版本发布计划。如需更多下载方式，请查看下方历史版本或第三方源。",
  },

  // 页头配置
  header: {
    groupButtonText: "交流群",
    downloadButtonText: "下载",
  },

  // 群组信息
  group: {
    name: "ADMT 官方交流群",
    number: "1040866704",
    link: "https://qm.qq.com/q/kqY217EUkU",
    qrCode:
      "https://img-g.lacs.cc/file/admtweb/1773804245866_qrcode_1773803395190.webp",
    description: "扫描二维码加入官方交流群，与开发者实时沟通。",
    joinButtonText: "直接加入群聊",
    closeButtonText: "稍后再说",
  },

  // 页脚配置
  footer: {
    sections: [
      {
        title: "产品",
        links: [
          { name: "功能特性", href: "/features" },
          { name: "下载", href: "/download" },
        ],
      },
      {
        title: "支持",
        links: [
          { name: "文档", href: "/docs" },
          { name: "联系我们", href: "/contact" },
        ],
      },
      {
        title: "协议政策",
        links: [
          { name: "用户协议", href: "/agreement#user" },
          { name: "隐私政策", href: "/agreement#privacy" },
          { name: "信息收集说明", href: "/agreement#collection" },
        ],
      },
    ],
  },

  // 统计计数配置
  stats: {
    apiUrl: "https://api-g.lacs.cc/api/admt/stats",
    items: [
      { label: "累计使用", key: "totalUsage", value: 6770, suffix: " 次" },
      { label: "活跃设备", key: "uniqueDevices", value: 2511, suffix: " 台" },
      { label: "累计连接", key: "totalConnections", value: 31088, suffix: " 次" },
      { label: "在线设备", key: "uniqueConnectionDevices", value: 2928, suffix: " 台" },
    ]
  },
};
