import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { MAINHOST, ISMOCK, conmomPrams } from '@/config'
import requestConfig from '@/config/requestConfig'
import { getToken } from '@/utils/common'
import router from '@/router'

declare type Methods = "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT"
declare interface Datas {
  method?: Methods
  [key: string]: any
}
const baseURL = process.env.NODE_ENV === 'production' ? MAINHOST : location.origin
const token = getToken()

class HttpRequest {
  public queue: any // 请求的url集合
  public constructor() {
    this.queue = {}
  }
  destroy(url: string) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // hide loading
    }
  }
  interceptors(instance: any, url?: string) {
    // 请求拦截
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // show loading
      }
      if (url) {
        this.queue[url] = true
      }
      return config
    }, (error: any) => {
      console.error(error)
    })
    // 响应拦截
    instance.interceptors.response.use((res: AxiosResponse) => {
      if (url) {
        this.destroy(url)
      }
      const { data, status } = res
      if (status === 200 && ISMOCK) { return data } // 如果是mock数据，直接返回
      if (status === 200 && data && data.code === 0) { return data } // 请求成功
      return requestFail(res) // 失败回调
    }, (error: any) => {
      if (url) {
        this.destroy(url)
      }
      console.error(error)
    })
  }
  async request(options: AxiosRequestConfig) {
    const instance = axios.create()
    await this.interceptors(instance, options.url)
    return instance(options)
  }
}

// 请求失败
const requestFail = (res: AxiosResponse) => {
  let errStr = '网络繁忙！'
  // token失效重新登录
  if (res.data.code === 1000001) {
    console.error('token失效重新登录')
    return router.replace({ name: 'login' })
  }

  return {
    err: console.error({
      code: res.data.errcode || res.data.code,
      msg: res.data.errmsg || errStr
    })
  }
}

// 合并axios参数
const conbineOptions = (_opts: any, data: Datas, method: Methods): AxiosRequestConfig => {
  let opts = _opts
  if (typeof opts === 'string') {
    opts = { url: opts }
  }
  const _data = { ...conmomPrams, ...opts.data, ...data }
  const options = {
    method: opts.method || data.method || method || 'GET',
    url: opts.url,
    header: { 'user-token': token },
    baseURL
  }
  return options.method !== 'GET' ? Object.assign(options, { data: _data }) : Object.assign(options, { params: _data })
}

const HTTP = new HttpRequest()

/**
 * 抛出整个项目的api方法
 */
const Api = (() => {
  const apiObj: any = {}
  const requestList: any = requestConfig
  const fun = (opts: AxiosRequestConfig | string) => {
    return async (data = {}, method: Methods = "GET") => {
      if (!token) {
        console.error('No Token')
        return router.replace({ name: 'login' })
      }
      const newOpts = conbineOptions(opts, data, method)
      const res = await HTTP.request(newOpts)
      return res
    }
  }
  Object.keys(requestConfig).forEach((key) => {
    apiObj[key] = fun(requestList[key])
  })

  return apiObj
})()

export default Api as any

