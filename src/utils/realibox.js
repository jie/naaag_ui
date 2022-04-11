import axios from 'axios'
import moment from "moment"
import md5 from "@/utils/md5.js"


class BaseAPI {
  constructor(options, progress_callback) {
    this.options = options
    this.progress_callback = progress_callback
  }

  async uploadFiles(data) {
    return {
      status: false,
      data: 'not_implemented'
    }
  }
}



function createSignature(secret, urlMap) {
  var keys = Object.keys(urlMap).sort()
  var signurl = ''
  var urlArr = []
  for (let key of keys) {
    urlArr.push(`${key}=${urlMap[key]}`)
  }
  signurl = urlArr.join('&')
  console.log('signurl:', signurl)
  var cipher = encodeURIComponent(signurl + secret)
  var sign = md5.hexMD5(`${cipher.toString()}`).toUpperCase();
  return { urlStr: signurl, sign: sign }
}

function createSignatureForSimulation(secret, urlMap) {
  var keys = Object.keys(urlMap).sort()
  var signurl = ''
  var urlArr = []
  for (let key of keys) {
    urlArr.push(`${key}=${encodeURIComponent(JSON.stringify(urlMap[key]))}`)
  }
  signurl = urlArr.join('&')
  console.log('signurl:', signurl)
  var cipher = signurl + secret
  var sign = md5.hexMD5(`${cipher.toString()}`).toUpperCase();
  return { urlStr: signurl, sign: sign }
}



export default class RealiboxAPI extends BaseAPI {
  genTimestamp() {
    return 1751328000
    // return parseInt(Math.floor(Date.now() / 1000 + 1));
  }

  createSign(params) {
    return createSignature(this.options.secret, params)
  }

  async getMaterial(params) {
    // {project_id}
    let timestamp = this.genTimestamp()
    console.log('timestamp:', timestamp)
    let urlData = {
      appkey: this.options.appkey,
      timestamp: timestamp,
      limit: 100,
      ...params
    }
    let signInfo = createSignature(this.options.secret, urlData)
    let url = `${this.options.base_url}/api/application/lifung/v1/materials?${signInfo.urlStr}&sign=${signInfo.sign}&limit=100`
    console.log('url:', url)
    let headers = {
      'content-type': 'text/html',
    }

    let result;
    try {
      result = await axios.get(url, { headers: headers })
      console.log('result:', result)
      if (result.data.code != 10000) {
        return {
          status: false,
          data: result.data.message
        }
      }
    } catch (e) {
      console.error('getMaterialError:', e)
      return {
        status: false,
        data: 'fail_get_materials'
      }
    }
    return {
      status: true,
      data: result.data
    }
  }

  async getProjects(params) {

    let timestamp = this.genTimestamp()
    let urlData = {
      appkey: this.options.appkey,
      timestamp: timestamp,
      ...params
    }
    console.log('urlData:', urlData)
    let signInfo = createSignature(this.options.secret, urlData)
    console.log('signInfo:', signInfo)
    let url = `${this.options.base_url}/api/application/lifung/v1/projects?${signInfo.urlStr}&sign=${signInfo.sign}`
    console.log('url:', url)
    let headers = {
      'content-type': 'text/html',
    }

    let result;
    try {
      result = await axios.get(url, { headers: headers })
      console.log('result:', result)
      if (result.data.code != 10000) {
        return {
          status: false,
          data: result.data.message
        }
      }
    } catch (e) {
      console.error('getProjectsError:', e)
      return {
        status: false,
        data: 'fail_get_projects'
      }
    }
    return {
      status: true,
      data: result.data
    }
  }


  async copyProject(name, project_id) {
    let timestamp = this.genTimestamp()
    let urlData = {
      appkey: this.options.appkey,
      timestamp: timestamp,
      project_id: project_id,
      name: name
    }
    let signInfo = createSignature(this.options.secret, urlData)
    urlData.sign = signInfo.sign.toUpperCase()
    let url = `${this.options.base_url}/api/application/lifung/v1/projects/copy`
    let headers = {
      'content-type': 'application/json',
    }

    let result;
    try {
      result = await axios.post(url, urlData, { headers: headers })
      if (result.data.code != 10000) {
        return {
          status: false,
          data: result.data.message
        }
      }
    } catch (e) {
      console.error('copyProjectError:', e)
      return {
        status: false,
        data: 'fail_copy_project'
      }
    }
    return {
      status: true,
      data: result.data
    }
  }


  async getPolicy(params) {
    let timestamp = this.genTimestamp()
    let urlData = {
      appkey: this.options.appkey,
      timestamp: timestamp,
      name: params.name,
      project_id: params.project_id
    }
    let signInfo = createSignature(this.options.secret, urlData)
    let url = `${this.options.base_url}/api/application/lifung/v1/upload_policy?${signInfo.urlStr}&sign=${signInfo.sign}`
    console.log('url:', url)
    let headers = {
      'content-type': 'text/html'
    }

    let result;
    try {
      result = await axios.get(url, { headers: headers })
      console.log('result:', result)
      if (result.data.code != 10000) {
        return {
          status: false,
          data: result.data.message
        }
      }
    } catch (e) {
      console.error('getPolicyError:', e)
      return {
        status: false,
        data: 'fail_get_policy'
      }
    }
    return {
      status: true,
      data: result.data
    }
  }

  async uploadFile(policy, file, index) {
    let formData = new FormData();
    formData.append('Content-Length', file.size)
    formData.append("OSSAccessKeyId", policy.info.param.OSSAccessKeyId)
    formData.append("name", policy.info.param.name)
    formData.append("key", policy.info.param.key)
    formData.append("policy", policy.info.param.policy)
    formData.append("signature", policy.info.param.signature)
    formData.append("callback", policy.info.param.callback)
    formData.append("success_action_status", policy.info.param.success_action_status)
    formData.append("file", file);
    let config = {
      headers: { "Content-Type": "multipart/form-data;boundary=" + new Date().getTime() },
      transformRequest: [function (data) {
        return data
      }],
      onUploadProgress: progressEvent => {
        let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
        console.log('complete:', complete)
        if (this.progress_callback) {
          this.progress_callback(index, (progressEvent.loaded / progressEvent.total * 100 | 0))
        }
      }
    };

    let uploadRes;
    try {
      uploadRes = await axios.post(policy.info.upload_host, formData, config)
      console.log('uploadRes:', uploadRes)
      if (uploadRes.status != 200) {
        console.log('uploadErrorStatus:', uploadRes.status)
        return {
          status: false,
          data: 'aliyun_upload_status_error'
        }
      }
    } catch (e) {
      console.error('uploadError:', e)
      return {
        status: false,
        data: 'aliyun_error'
      }
    }
    return {
      status: true,
      data: { img_uid: uploadRes.data.data.img_uid, img_url: `${policy.info.upload_host}/${policy.info.param.key}` }
    }
  }


  async createSimulationSign(params) {
    var payload = {
      "appkey": this.options.appkey,
      "timestamp": this.genTimestamp(),
      "secret": this.options.secret,
      ...params
    }
    let result;
    try {
      result = await axios.post('/realBoxApi/api/application/lifung/v1/sign', payload)
      console.log('result:', result)
      if (result.data.code !== 10000) {
        console.log('realiboxSignStatus:', result.status)
        return {
          status: false,
          data: 'realibox_sign_error'
        }
      }
    } catch (e) {
      console.error('realibox_sign_error:', e)
      return {
        status: false,
        data: 'realibox_sign_error'
      }
    }
    return {
      status: true,
      data: result.data.info
    }

  }

  async sceneSimulation(project_id, materials, sign = null) {
    let timestamp = this.genTimestamp()
    let postData = {
      project_id: project_id,
      timestamp: timestamp,
      materials: materials
    }

    let signInfo = await this.createSimulationSign(postData)
    if (!signInfo.status) {
      return signInfo
    }
    postData.sign = signInfo.data.sign.toUpperCase()
    postData.appkey = this.options.appkey
    let url = `${this.options.base_url}/api/application/lifung/v2/simulation`
    let headers = {
      'content-type': 'application/json'
    }

    let result;
    try {
      result = await axios.post(url, postData, { headers: headers })
      console.log('result:', result)
      if (result.data.code != 10000) {
        return {
          status: false,
          data: result.data.message
        }
      }
    } catch (e) {
      console.error('simulationError:', e)
      return {
        status: false,
        data: 'fail_simulation'
      }
    }
    return {
      status: true,
      data: result.data
    }
  }

  async getColors(fabricId) {
    var payload = { materialId: fabricId }
    let result;
    try {
      result = await axios.post('/stripe/getColorList', payload)
      console.log('result:', result)
      if (result.data.resultCode !== '00') {
        console.log('getColorsResult:', result.status)
        return {
          status: false,
          data: 'get_colors_error'
        }
      }
    } catch (e) {
      console.error('get_colors_error:', e)
      return {
        status: false,
        data: 'get_colors_error'
      }
    }
    return {
      status: true,
      data: result.data
    }
  }

  async colorSeparation(params, headers = {}, progress_callback = "") {
    let { _color_num, image, material_group, color_mode, use_img_url, width, height, get_masks, user_id, base_url } = params

    let formData = new FormData();
    formData.append("image", image);
    formData.append("user_id", user_id);
    formData.append("material_group", material_group);
    formData.append("color_mode", color_mode);
    if (use_img_url) {
      formData.append("use_img_url", use_img_url);
    }
    if (width) {
      formData.append("width", width);
    }
    if (height) {
      formData.append("height", height);
    }
    if (get_masks) {
      formData.append("get_masks", get_masks);
    }

    let url = `${base_url}/color_separation_${_color_num}`
    let config = {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      transformRequest: [function (data) {
        return data
      }],
      onUploadProgress: progressEvent => {
        let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
        console.log('complete:', complete)
        if (progress_callback) {
          progress_callback((progressEvent.loaded / progressEvent.total * 100 | 0))
        }
      }
    };

    let uploadRes;
    try {
      uploadRes = await axios.post(url, formData, config)
      if (uploadRes.status != 200) {
        console.log('uploadErrorStatus:', uploadRes.status)
        return {
          status: false,
          data: 'color_api_upload_status_error'
        }
      }
    } catch (e) {
      console.error('uploadError:', e)
      return {
        status: false,
        data: 'color_api_error'
      }
    }

    return uploadRes
  }

}



