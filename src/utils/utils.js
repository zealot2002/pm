import JSEncrypt from 'jsencrypt' // 引入模块
import axios from 'axios'
const $a = require('./js/a.js')
const cryptFirst = new JSEncrypt()
const util = require('./js/util.js')
cryptFirst.setPublicKey(util.get_public_key())// 引入公钥
let token = ''
export default {
  rsa(data) { // rsa加密
    var res = cryptFirst.encrypt(data)
    return res
  },
  encrypt(data) { // aes+rsa加密
    var res = this.rsa($a.encrypt(data, token))
    return res
  },
  mounted(that) {
    this.deleteParams()

    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = $chars.length
    var token2 = ''
    for (var i = 0; i < 16; i++) {
      token2 += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    if (token === '') {
      token = token2
    }
    const jm_token = this.rsa(token)
    localStorage.setItem('token', token)
    const urlHost = process.env.VUE_APP_BASE_API
    console.log('zzy settoken ： url ', urlHost)
    axios.post(urlHost + 'qhapi/Tokendata/settoken', {
      token: jm_token
    }).then(res => {
      that.onTokenUpdated()
    })
  },
  deleteParams(name) {
    var str = location.href
    var num = str.indexOf('#')
    str = str.substr(num + 1)
    // console.log(str.slice(1))

    var loca = window.location
    var baseUrl = loca.origin + loca.pathname + '?'
    var query = loca.search.substr(1)
    var obj = {}
    var arr = query.split('&')
    var i = 0
    if (query.indexOf(name) > -1) {
      for (; i < arr.length; i++) {
        arr[i] = arr[i].split('=')
        obj[arr[i][0]] = arr[i][1]
      }
      delete obj[name]
      localStorage.setItem('params', JSON.stringify(obj))
      var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&')
      return url + '#/' + str.slice(1)
    } else {
      for (; i < arr.length; i++) {
        arr[i] = arr[i].split('=')
        obj[arr[i][0]] = arr[i][1]
      }
      localStorage.setItem('params', JSON.stringify(obj))
    }
  }

}
