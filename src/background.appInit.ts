import { Updata } from '@/ffidll/index';

const path = require('path');
const fs = require('fs');

/**
 *
 * @param appName
 * @param dllFiles
 */
function checkComplete(appName: string, dllFiles: string[]) {}

/**
 *借助易语言的升级检测
 */
function checkUpdata() {
  Updata.update();
}
export default {
  checkComplete,
  checkUpdata,
};
