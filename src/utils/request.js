import axios from 'axios'
import { BASEURL, LOGINURL } from './config.js'
import { getCookieToken } from './utils'
import { message, Modal } from 'antd'

const { confirm } = Modal;
const errorHandle = status => {
  // 判断状态码
  switch (status) {
    case 500:
      message.error('找不到此服务，可能是在路上~');
      break
    case 503:
      message.error('服务器开小差了~请稍后');
      break
    case 404:
      message.error('找不到此服务');
      break
    default:
      message.error('网络错误');
  }
  return { data: '' }
}


// 新建了一个 axios 实例
const request = axios.create({
  baseURL: BASEURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true
})

request.interceptors.request.use(
  
  config => {
    config.headers['Authorization'] = encodeURIComponent(getCookieToken()) 
    // config.headers['Authorization'] = 'TNA5UAgSS%2FkKw8d45RcoONS5dduywYxfXT8diDnatAo%2FFrfUHWu65%2BM2rR0O9mZUcrAvQCUxQnFZv2UqHFGoQ0ddCSzgA4VRfSbjsqwreBtZQnWguAGEMeimICPE7aPh'
    return config
  },
  // 请求错误
  error => {
    Promise.reject(error)
  }
)

// 处理响应数据
request.interceptors.response.use(
  // 请求成功
  res => { 
    if (res.data.code === 0) {
      return res.data
    }else if(res.data.code === 10){
      confirm({
        title: '提示',
        content: '无权限，需要登录，将页面跳转至登录页',
        okText: '确定',
        okType: 'warning',
        cancelText: '取消',
        onOk() {
          window.location.href = LOGINURL + '/user/login.html?redirect=' + encodeURIComponent(window.location.href);
        },
        onCancel() {
          console.log('取消去登录')
        }
      })
    }else if(res.data.code){
      message.error(res.data.msg);
    }
    
    return Promise.resolve(res.data)
  },
  err => {
    const { response } = err
    if (response) {
      errorHandle(response.status, response.data)
      return Promise.reject(response.data)
    }
    return { data: '' }
  }
)

export default request
