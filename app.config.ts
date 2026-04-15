export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/constellation/home/index',
    'pages/match/index',
    'pages/daily-test/index',
    'pages/couple-match/index',
    'pages/test-type/index',
    'pages/test/index',
    'pages/result/index',
  ],
  window: {
    navigationBarTitleText: 'SBTI+ 探索平台',
    navigationBarBackgroundColor: '#f6faf6',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f6faf6',
    backgroundTextStyle: 'light',
    enablePullDownRefresh: false,
  },
  tabBar: {
    color: '#6a786f',
    selectedColor: '#6c8d71',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [],
  },
  sitemapLocation: 'sitemap.json',
  lazyCodeLoading: 'requiredComponents',
})
