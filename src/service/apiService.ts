import axios, { AxiosRequestConfig } from 'axios';
import config from '../config';
import Debug from '../until/debug';

const httpDebug = new Debug('httpDebug');
const RESPONSE_SERVICE = '没有找到该服务';
const RESPONSE_DUPLICATE_REQUEST = '该请求正在处理中，请耐心等待。';
const RESPONSE_NOERROR = '服务器没有返回指定错误信息';

axios.defaults.timeout = 10000;

//api请求队列
const apiQueue = {} as any;

//日志格式配置

function logTraffic(
  type: 'log' | 'error',
  direction: 'in' | 'out',
  colorCode: string,
  api: string,
  payload: any,
  timestamp: number = 0,
) {
  const legend = '  ';
  const prefix = direction === 'in' ? '<=' : '=>';
  const interval = timestamp !== 0 ? `- ${timestamp}ms` : '';
  const index = `background-color: ${colorCode}`;
  const font = 'font-weight: bold';

  if (type === 'log') {
    httpDebug.log(`${api}\r\n%c${legend}%c ${prefix}  ${interval}\r\n`, index, font, payload);
  } else {
    httpDebug.error(`${api}\r\n%c${legend}%c ${prefix}  ${interval}\r\n`, index, font, payload);
  }
}

axios.interceptors.request.use(
  config => {
    // loading
    let requestInfo = <string>config.baseURL + <string>config.url;

    if (apiQueue[requestInfo]) {
      alert(RESPONSE_DUPLICATE_REQUEST + requestInfo);
      throw new Error(RESPONSE_DUPLICATE_REQUEST + requestInfo);
    } else {
      apiQueue[requestInfo] = {
        startTime: Date.now(),
        logColor: httpDebug.colorCode(),
      };
      logTraffic('log', 'out', apiQueue[requestInfo].logColor, requestInfo, config.data);
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    let requestInfo = <string>response.config.url;
    let timestamp = Date.now() - apiQueue[requestInfo].startTime;

    logTraffic('log', 'in', apiQueue[requestInfo].logColor, requestInfo, response.data, timestamp);

    delete apiQueue[requestInfo];

    return response;
  },
  error => {
    let errorMsg = !error.response
      ? error.message
      : error.response.status === 404
      ? RESPONSE_SERVICE
      : error.response.data.error || RESPONSE_NOERROR;

    let requestInfo = error.config.url;
    let timestamp = Date.now() - apiQueue[requestInfo].startTime;
    logTraffic('error', 'in', apiQueue[requestInfo].logColor, requestInfo, errorMsg, timestamp);
    if (apiQueue[requestInfo]) {
      delete apiQueue[requestInfo];
    }

    return Promise.reject(errorMsg);
  },
);

export default {
  post: (url: string, data: any) => {
    return axios({
      method: 'post',
      baseURL: `${config.httpApi}/api/post/`,
      url,
      data: data,
    });
  },
  get: (url: string, params?: any) => {
    return axios({
      method: 'get',
      baseURL: `${config.httpApi}/api/get/`,
      url,
      params, // get 请求时带的参数
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
  },
};
