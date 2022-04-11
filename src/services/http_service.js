import axios from 'axios'

class API {
  constructor(url, method = "POST", headers = {}, withSession = true) {
    this.url = url
    this.method = method
    let _headers = {
      'Content-Type': 'application/json',
      'dataType': 'json',
    }
    if (withSession) {
      this.headers = { ..._headers, ...headers, sessionid:  import.meta.env.VITE_APP_API_SESSIONID, sessiontp: 'uuid4' }
    } else {
      this.headers = { ..._headers, ...headers }
    }
  }

  async request(data) {
    let method = this.method.toLocaleLowerCase()
    let result;
    if (method == 'post') {
      result = await axios.post(this.url, data, { headers: this.headers })
      if (result.data.code == '0') {
        return {
          status: true,
          data: result.data.data,
          message: result.data.message
        }
      } else {
        return {
          status: false,
          message: result.data.message
        }
      }
    } else if (method == 'get') {
      var url;
      if (data.length !== 0) {
        url = `${this.url}?${encodeURIComponent(data)}`
      }
      result = await axios.get(url, { headers: this.headers })
      if (result.data.code == '0') {
        return {
          status: true,
          data: result.data.data,
          message: result.data.message
        }
      } else {
        return {
          status: false,
          message: result.data.message
        }
      }
    } else {
      return {
        status: false,
        message: "unsupported_method"
      }
    }
  }
}


export default API