import ffi from 'ffi'
import iconvLite from 'iconv-lite'
import  appConfig  from '@/config'
// 接口连接
const urlVersion = 'http://jfjun.oss-cn-hangzhou.aliyuncs.com/version/version.json'
// JSON对象-标识
const objName = 'bill_assistant'
const objVersion = appConfig.version
// 程序-进程名
const objProcessname = appConfig.name + '.exe'
// 是否启动更新程序:0启动/1不启动[update.exe]
const objOpenUpdate = 0
// 互斥体检测标识
const objMutexname = 'jinxiaoxiangzhushou'

let updateDll
let dllVersion
try {

  updateDll = ffi.Library('static/update', {
    'update': ['int', ['string', 'string', 'string', 'string', 'int']],
    'WriteConfig': ['int', ['string', 'string', 'string', 'string']],
    'mutex': ['int', ['string']]
  })
  dllVersion = 1

} catch (error) {
  
  try {
    updateDll = ffi.Library('static/update', {
      'update': ['int', ['string', 'string', 'string', 'string', 'int']],
      // 'mutex': ['int', ['string']]
    })
    dllVersion = 2
  } catch (error) {
    updateDll = null
    dllVersion = 0
  }
}



export default {

  update () {
    // 0无 1已是最新 2需要更细你调用个update.exe 3接口读取异常 4接口超时
    return updateDll.update(urlVersion, objName, objVersion, iconvLite.encode(objProcessname,'gb2312'), objOpenUpdate)
  },
  WriteConfig () {

    return updateDll.WriteConfig(urlVersion, objName, '0', iconvLite.encode(objProcessname,'gb2312'))
    
  },
  getDllVersion() {
    return dllVersion
  }
  // mutex () {
  //   return updateDll.mutex(objMutexname)
  // }
  
}
