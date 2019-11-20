const env = process.env.NODE_ENV ? process.env.NODE_ENV : '';

const url: any = {
  development: 'development',
  dev: 'ssss',
  production: 'production',
};

export default {
  url: url[env],
  src: url[env],
  name: 'USBSHARE_NEW',
  version: 'V0.0.1',
  /** 程序更新检测地址 */
  uploadApi: 'http://jfjun.oss-cn-hangzhou.aliyuncs.com/version/version.json',
  /** 程序下载吧地址 */
  appDownloadApi:
    'http://jfjun.oss-cn-hangzhou.aliyuncs.com/version/invoice/%E8%BF%9B%E9%94%80%E9%A1%B9%E5%8A%A9%E6%89%8B_%E5%AE%89%E8%A3%85%E7%A8%8B%E5%BA%8F.exe',
  /** 程序更新地址匹配名称 */
  uploadName: 'bill_assistant',
  /** 容易被杀毒删除的dll */
  敏感dlls: [
    'usutils.dll',
    'Control.dll',
    'usbip.dll',
    'update.dll',
    'diskControl.dll',
    'CertInfo.dll',
  ],
};
