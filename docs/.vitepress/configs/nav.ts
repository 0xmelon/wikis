import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  { text: '导航', link: '/nav', activeMatch: '^/nav' },
  {
    text: '学习周报',
    items: [
      { text: '2023年', link: '/weekly/2023/2023年第1周' },
    ],
    activeMatch: '^/weekly'
  },
  { text: '源码阅读', link: '/analysis/utils/only-allow', activeMatch: '^/analysis' },
  {
    text: 'Workflow',
    items: [
      {
        text: '基础知识',
        items: [
          { text: '计算机网络', link: '/workflow/computer-network/' },
          { text: '软考网络知识', link: '/workflow/soft-exam/' },
          { text: '计算机组成原理', link: '/workflow/computer-principles/' },
          { text: '操作系统', link: '/workflow/sass/' }
        ]
      },
      { text: 'Git 相关技巧', link: '/workflow/git/' },
      { text: 'Git 命令清单', link: '/workflow/git/command' }
    ],
    activeMatch: '^/workflow'
  },
  { text: '踩坑记录', link: '/pit/npm', activeMatch: '^/pit' },
  {
    text: '提效工具',
    items: [
      {
        text: '软件推荐与配置',
        items: [
          { text: '多平台软件', link: '/efficiency/software/cross-platform' },
          { text: 'Mac 平台', link: '/efficiency/software/mac' },
          { text: 'Windows 平台', link: '/efficiency/software/windows' },
          { text: '浏览器设置与扩展', link: '/efficiency/software/browser' },
          { text: 'Visual Studio Code 配置', link: '/efficiency/software/vscode' },
          { text: 'WebStorm 配置', link: '/efficiency/software/webstorm' }
        ]
      },
      { text: '在线工具', link: '/efficiency/online-tools' },
      { text: '书签脚本', link: '/efficiency/bookmark-scripts' }
    ],
    activeMatch: '^/efficiency'
  },
  {
    text: 'Xmelon',
    items: [
      { text: '个人主页', link: 'https://home.xmelon.cafe' }
    ]
  }
]
