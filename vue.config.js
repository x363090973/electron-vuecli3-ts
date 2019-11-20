module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
          'productName':'进销项',
          'appId':'org.jinxiaoxiang.zhushou',
          "publish": {
            provider: 'github',
            // repo: 'https://github.com/x363090973/electron-vuecli3-ts.git', // git仓库
            owner: 'x363090973', // 拥有者
            token: 'ec48a133b0a2a61e4daee6cb0d50f4a1c4349329', // gitToken
            releaseType: 'release',
            publishAutoUpdate: true // 发布自动更新（需要配置GH_TOKEN）。 默认true
          }
        }
      }
    }
  }