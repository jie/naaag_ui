import axios from 'axios'
import API from "@/services/http_service";


const BaseURL = '/colorSeparationApi'
// const BaseURL = '/color_separation'

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
  let api_url = `${BaseURL}/login`;
  let result;
  try {
    result = await axios.post(api_url, {
      username: import.meta.env.VITE_APP_COLORSEP_USER_ID,
      password: import.meta.env.VITE_APP_COLORSEP_PASSWORD
    })
    if (result.status != 200) {
      console.log('getAccessTokenStatus:', result.status)
      return {
        status: false,
        data: 'color_api_getAccessToken_status_error'
      }
    }
  } catch (e) {
    console.error('getAccessTokenError:', e)
    return {
      status: false,
      data: 'color_api_get_access_token_error'
    }
  }

  return {status: true, data: result}
}


const getMaterials = async function (params, headers = {}) {
  let api_url = `${BaseURL}/materials`;

  let formData = new FormData();
  formData.append("material_group", params.material_group);
  formData.append("user_id", AuthSettings.user_id);

  let config = {
    headers: { ...headers },
  };
  console.log('config:', config)

  let result;
  try {
    result = await axios.post(api_url, formData, config)
    if (result.status != 200) {
      console.log('GetMaterialsErrorStatus:', result.status)
      return {
        status: false,
        data: 'color_api_materials_status_error'
      }
    }
  } catch (e) {
    console.error('getMaterialsError:', e)
    return {
      status: false,
      data: 'color_api_get_materials_error'
    }
  }

  return {status: true, data: result}
}


const colorSeparationDirect = async function (params, headers = {}, progress_callback = "") {
  let { image, material_group, color_mode, use_img_url, width, height, get_masks, direct_colors, bmp_width, bmp_height } = params

  let formData = new FormData();
  formData.append("image", image);
  formData.append("user_id", AuthSettings.user_id);
  formData.append("material_group", material_group);
  formData.append("color_mode", color_mode);
  formData.append("direct_colors", JSON.stringify(direct_colors));
  formData.append("n_color", direct_colors.length);

  if (use_img_url) {
    formData.append("use_img_url", use_img_url);
  }
  if (width) {
    formData.append("width", width);
  }
  if (height) {
    formData.append("height", height);
  }
  if (bmp_width) {
    formData.append("bmp_width", bmp_width);
  }
  if (bmp_height) {
    formData.append("bmp_height", bmp_height);
  }
  if (get_masks) {
    formData.append("get_masks", get_masks);
  }

  let url = `${BaseURL}/color_separation_direct`
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


const colorSeparation = async function (params, headers = {}, progress_callback = "") {
  let { color_num, image, material_group, color_mode, use_img_url, width, height, bmp_width, bmp_height, get_masks } = params
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
  if (bmp_width) {
    formData.append("bmp_width", bmp_width);
  }
  if (bmp_height) {
    formData.append("bmp_height", bmp_height);
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
  let { image_key, new_materical_group, new_material_codes, width, height, get_masks } = params
  let formData = new FormData();
  formData.append("color_separation_id", image_key);
  formData.append("user_id", AuthSettings.user_id);
  formData.append("new_materical_group", new_materical_group);
  formData.append("new_material_codes", JSON.stringify(new_material_codes));
  formData.append("width", width);
  formData.append("height", height);
  formData.append("use_img_url", 1);
  formData.append("bmp_width", params.width);
  formData.append("bmp_height", params.height);
  formData.append("get_masks", '1');


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
  colorSeparationDirect,
  changeColor
}