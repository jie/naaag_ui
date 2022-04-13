import axios from 'axios'
import API from "@/services/http_service";


const BaseURL = '/color_separation'

const AuthSettings = {
  "user_id": "vm"
}

const httpRequest = async (url, method = 'POST', params = {}) => {
  let headers = {
    'Content-Type': 'application/json',
    // 'dataType': 'json',
    ...params.headers
  }
  let data = JSON.stringify(params.data)
  console.log('data:', data)

  let result;
  try {
    if (method == 'POST') {
      result = await axios.post(url, data, { headers: headers })
    } else {
      result = await axios({
        url: url, data: data, headers: headers,
      })
    }
  } catch (e) {
    console.error(e)
  }

  if (!result) {
    return {
      status: false,
      data: "fail_request_api"
    }
  }

  return {
    status: true,
    data: result.data
  }
}

const getAccessToken = async function (params, headers = {}) {
  let api = new API("/colorsep/api/get_access_token");
  let result = await api.request({});
  return result
}


const getMaterials = async function (params, headers = {}) {
  let api = new API("/colorsep/api/get_materials");
  let result = await api.request({});
  return result
}

const colorSeparation = async function (params, headers = {}, progress_callback = "") {
  let { color_num, image, material_group, color_mode, use_img_url, width, height, get_masks } = params
  const colorCountMap = {
    2: "two",
    3: "three",
    4: "four",
    5: "five",
  }
  let formData = new FormData();
  formData.append("image", image);
  formData.append("user_id", AuthSettings.user_id);
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

  let url = `${BaseURL}/color_separation_${colorCountMap[color_num]}`
  let config = {
    headers: { ...headers },
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

const changeColor = async function (params, headers = {}) {
  let { image_key, new_materical_group, new_material_codes } = params
  let formData = new FormData();
  formData.append("image_key", image_key);
  formData.append("user_id", AuthSettings.user_id);
  formData.append("new_materical_group", new_materical_group);
  formData.append("new_material_codes", JSON.stringify(new_material_codes));

  let url = `${BaseURL}/change_color`
  let config = {
    headers: { ...headers }
  };

  let result;
  try {
    result = await axios.post(url, formData, config)
    if (result.status != 200) {
      console.log('changeColorStatus:', result.status)
      return {
        status: false,
        data: 'changeColor_status_error'
      }
    }
  } catch (e) {
    console.error('changeColorError:', e)
    return {
      status: false,
      data: 'changeColor_error'
    }
  }

  return result
}



export {
  httpRequest,
  getAccessToken,
  getMaterials,
  colorSeparation,
  changeColor
}