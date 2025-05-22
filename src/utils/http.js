import axios from 'axios' // 引入
import JSEncrypt from 'jsencrypt' // 引入模块
import { Message } from 'element-ui'
import { getUserId } from '@/utils/SpUtil.js' // 获取token
import router from '@/router'
import { removeToken } from '@/utils/auth'
import { getUniqueid, getAesToken, setAesToken } from '@/utils/SpUtil.js'
import { logAction } from '@/utils/StatisticUtil'
const $a = require('./js/a.js')
const cryptFirst = new JSEncrypt()
const util = require('./js/util.js')
cryptFirst.setPublicKey(util.get_public_key())// 引入公钥
function rsa(data) { // rsa加密
  var res = cryptFirst.encrypt(data)
  return res
}

function encrypt(data) { // aes+rsa加密
  console.log(' encrypt ', localStorage.getItem('token'))
  var res = rsa($a.encrypt(data, localStorage.getItem('token')))
  return res
}
let baseURL = ''
// 这一步的目的是判断出当前是开发环境还是生成环境，方法不止一种，达到目的就行
if (process.env.NODE_ENV === 'development') {
  baseURL = ''
} else {
  baseURL = 'https://qh.qihe-cloud.com/qhactivity/public/index.php/'
}
const config = {
  baseURL: baseURL,
  timeout: 30000 // 设置最大请求时间
}
const _axios = axios.create(config)
/* 请求拦截器（请求之前的操作） */
_axios.interceptors.request.use(
  config => {
    // 如果有需要在这里开启请求时的loading动画效果
    // console.log(config.data.bjmc)
    // 如果有需要在这里开启请求时的loading动画效果
    // if (config.method === 'get') {
    //   // loading = Loading.service({
    //   //     lock: true,
    //   //     text: 'Loading...',
    //   //     spinner: 'el-icon-loading',
    //   //     background: 'rgba(0, 0, 0, 0.7)'
    //   // });
    // } else {
    //   // jzycpd = 2
    //   // if (config.data.bjmc) {
    //   // } else {
    //   //   jzycpd = 1
    //   //   // loading = Loading.service({
    //   //   //     lock: true,
    //   //   //     text: 'Loading...',
    //   //   //     spinner: 'el-icon-loading',
    //   //   //     background: 'rgba(0, 0, 0, 0.7)'
    //   //   // });
    //   // }
    // }
    //   config.headers.Authorization = getToken;  //添加token,需要结合自己的实际情况添加，
    return config
  },
  err => Promise.reject(err)
)
/* 请求之后的操作 */
_axios.interceptors.response.use(
  res => {
    // if (config.method === 'get') {
    //   // loading.close();
    // } else {
    //   if (jzycpd == 1) {
    //     // loading.close();
    //   }
    // }
    // 在这里关闭请求时的loading动画效果
    // 这里用于处理返回的结果，比如如果是返回401无权限，可能会是跳回到登录页的操作，结合自己的业务逻辑写
    // if (res.data.code === 401 ) {
    //     Toast("无权限操作")
    // }
    // if (res.data.code === 400 ) {
    //     Toast("请求网络失败")
    // }

    return res
  },
  err => {
    if (err) {
      // 在这里关闭请求时的loading动画效果
      // Toast("请求网络失败")
      // loading.close();
      // this.$toast("请求网络失败");
      Message.error('请求网络失败')
    }
    return Promise.reject(err)
  }
)
// 封装post,get方法
const http = {
  get(url = '', params = {}) {
    return new Promise((resolve, reject) => {
      _axios({
        url,
        params,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        method: 'GET'
      }).then(res => {
        resolve(res.data)
        return res
      }).catch(error => {
        reject(error)
      })
    })
  },
  post(url = '', params = {}) {
    return new Promise((success, reject) => {
      const data = {}
      // params.appid = 'ghfxyl'
      const bjmc = params.jzcgb
      console.log('【请求接口】10000 ' + url + ' 【参数】 ' + JSON.stringify(params))

      // const parameter = JSON.parse(localStorage.getItem('params'))
      params.activityid = process.env.VUE_APP_ACTIVITY_ID// parameter.activityid
      params.eid = getUserId()// parameter.activityid

      for (const key in params) {
        if (key === 'long_data') {
          data[key] = params[key]
        } else {
          data[key] = encrypt(this.toString(params[key]))
        }
      }
      console.log('【请求接口】1111 ' + url + ' 【参数】 ' + JSON.stringify(params))
      _axios({
        url,
        data: data,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        method: 'POST'
      }).then(res => {
        console.log('【接口返回】1111res.statusCode ', res)

        let zhenshu = ''
        if (res.data.data) {
          zhenshu = JSON.parse($a.decrypt(res.data.data, localStorage.getItem('token')))
        }
        const datas = { data: zhenshu }
        datas.code = res.data.code
        datas.msg = res.data.msg
        datas.res = res.data
        console.log('【接口返回】 ', datas)
        if (datas.code === 100) {
          Message.error('登录状态已过期，请重新登录')
          removeToken()
          router.push(`/login?redirect=${router.history.current.fullPath}`)
          return
        //   //  Toast(res.data.msg)
        }
        success(datas)
        return res
      }).catch(error => {
        console.log('【接口返回】error ', error)
        logAction('服务请求失败', { url: url, params: params, error: error })
        reject(error)
      })
    })
  },
  postWithoutEncrypt(url = '', params = {}) {
    return new Promise((success, reject) => {
      const data = {}
      // params.appid = 'ghfxyl'
      const bjmc = params.jzcgb
      // const parameter = JSON.parse(localStorage.getItem('params'))
      params.activityid = process.env.VUE_APP_ACTIVITY_ID// parameter.activityid

      for (const key in params) {
        if (key !== 'long_data') {
          data[key] = encrypt(this.toString(params[key]))
        }
      }
      data.data = JSON.stringify(params.long_data)
      data.bjmc = bjmc
      // console.log('【请求接口】 统计 ' + url + ' 【参数】 ' + JSON.stringify(params, null, 2))
      _axios({
        url,
        data: data,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        method: 'POST'
      }).then(res => {
        // console.log('【接口返回】统计 ', res)
        success(res)
        return res
      }).catch(error => {
        reject(error)
      })
    })
  },
  postMock(url = '', params = {}) {
    return new Promise((success, reject) => {
      // const data = {}
      // params.appid = 'ghfxyl'
      // const parameter = JSON.parse(localStorage.getItem('params'))
      _axios({
        url,
        data: params,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        method: 'POST'
      }).then(res => {
        console.log('【接口返回】 ', res)
        success(res)
        return res
      }).catch(error => {
        logAction('服务请求失败', { url: url, params: params, error: error })
        reject(error)
      })
    })
  },
  aesEncrypt(data) {
    return $a.encrypt(data, getAesToken())
  },
  aesDecrypt(data) {
    return $a.decrypt(data, getAesToken())
  },
  postNew(url = '', params = {}) {
    return new Promise((resolve, reject) => {
      try {
        // Prepare request data
        const data = {}
        const enrichedParams = {
          ...params,
          activityid: process.env.VUE_APP_ACTIVITY_ID,
          admin_id: getUserId(),
          uniqueid: getUniqueid()
        }

        // Encrypt all parameters
        Object.keys(enrichedParams).forEach(key => {
          data[key] = this.aesEncrypt(this.toString(enrichedParams[key]))
        })

        console.log('【请求接口】 ' + url + ' 【参数】 ' + JSON.stringify(enrichedParams, null, 2))

        // Make the request
        _axios({
          url,
          data,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          method: 'POST'
        }).then(res => {
          console.log('【接口返回】未解密 ', res)
          // Process response
          const responseData = res.data.data ? this.aesDecrypt(decodeURIComponent(res.data.data)) : ''

          const formattedResponse = {
            data: responseData ? this.safeJSONParse(responseData) : null,
            code: res.data.code,
            msg: res.data.msg,
            res: res.data
          }
          console.log('【接口返回】11111 ', formattedResponse)
          // Handle session timeout
          if (formattedResponse.code === 100) {
            Message.error('登录状态已过期，请重新登录')
            setAesToken('')
            router.push('/login')
            return
          }
          resolve(formattedResponse)
        }).catch(error => {
          logAction('服务请求失败', { url, params: enrichedParams, error })
          reject(error)
        })
      } catch (error) {
        logAction('请求准备失败', { url, params, error })
        reject(error)
      }
    })
  },
  // *参数FormData 必须是FormData格式
  uploadImg(url = '', formData) {
    return new Promise((success, reject) => {
      formData.append('activityid', process.env.VUE_APP_ACTIVITY_ID)
      formData.append('admin_id', getUserId())
      // let urltemp = config.baseURL + url;
      // console.log(urltemp);
      _axios({
        url,
        data: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        method: 'POST'
      }).then(res => {
        console.log('【接口返回】 ', res.data)
        success(res.data)
      }).catch(error => {
        logAction('上传文件失败', { url: url, error: error })
        reject(error)
      })
    })
  },
  safeJSONParse(jsonString) {
    try {
      return JSON.parse(jsonString)
    } catch (error) {
      console.error('JSON解析错误:', error, '原始字符串:', jsonString)
      logAction('JSON解析错误', { error: error.message, data: jsonString })
      return null
    }
  },
  toString(obj) {
    if (typeof obj !== 'string') {
      return String(obj)
    }
    return obj
  }
}

export default http
