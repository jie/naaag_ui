

import Material from "./material"
import Realibox from "@/utils/realibox";
import { dataURLtoFile } from "@/utils/image_tools";
import { nanoid } from "nanoid";
import { getAccessToken, colorSeparation, changeColor } from "@/utils/color_api"


const RealiboxImageSize = [2048, 2048]

class MaterialGroup {
  constructor(group_name, project, raw_materials = [], rules = [], canvas = "") {
    this.group_name = group_name
    this.raw_materials = raw_materials
    this.project = project
    this.rules = rules
    this.materials = []
    this.canvas = canvas
    this.realiboxApiOptions = {
      base_url: import.meta.env.VITE_APP_REALIBOX_HOST,
      appkey: import.meta.env.VITE_APP_REALIBOX_APPKEY,
      secret: import.meta.env.VITE_APP_REALIBOX_SECRET,
    }
    /*上传给realibox的图片*/
    this.img_before_separated_src = ""
    this.img_url = ""
    this.img_uid = ""
    this.img_cache = {}

    /* 原始图片 */
    this.image_src = ""
    this.image_file = ""
  
    /* 单独上传分色后的图片 */
    this.separated_img_key = ""

    this.color_codes = []
    this.color_codes_str = ""
    this.color_count = ""
    this.changed_codes = []

  }

  addMaterial(material) {
    this.materials.push(material)
  }

  setCanvas(canvas) {
    this.canvas = canvas
  }

  async uploadImage(color_count) {
    
    var imageSrc = await this.canvas.onExportImage();
    // 预览分色前的图片
    this.img_before_separated_src = imageSrc
    console.log('img_before_separated_src:', this.img_before_separated_src)
    //如果不使用分色需要设置realibox布片的图片尺寸为2048
    // var imageSrc = await this.canvas.exportDataWithSize('jpeg', 2048, 2048)

    var filename = `${nanoid()}.png`
    var imageFile = dataURLtoFile(imageSrc, filename)

    // 先查看缓存中是否有数据
    // if(color_codes_str && this.image_src && imageSrc === this.image_src) {
    //   this.img_cache[color_codes_str] = 
    //   if(this.img_cache[this.color_codes_str]) {

    //   }
    // }

    let colorRes = await this.requestColorSeparation(color_count, imageFile)
    if (!colorRes.status) {
      return colorRes
    }

    let tmp_image_src = await this.generateImageFile(colorRes.data.image_url, RealiboxImageSize[0], RealiboxImageSize[1])
    var tmp_name = `${nanoid()}.png`
    var tmp_image_file = dataURLtoFile(tmp_image_src, tmp_name)

    let uploadRes = await this.requestUploadImage(tmp_image_file)
    if (uploadRes.status) {
      this.img_uid = uploadRes.data.img_uid
      this.img_url = uploadRes.data.img_url
    } else {
      this.img_uid = ""
      this.img_url = uploadRes.data.img_url
    }
  }
  /* 在调用完分色后设置当前group的颜色参数 */
  updateMaterialColors(colorRes) {
    this.project.generateSeparatedColorCode(colorRes.data.color_codes_values)
    this.color_codes = colorRes.data.color_codes_values
    this.color_codes_str = JSON.stringify(this.project.separated_colors)
    this.img_cache[this.color_codes_str] = colorRes.data
    this.color_count = colorRes.data.color_codes_values.length
  }
  async generateImageFile(image_src, width, height) {
    return new Promise(async (resolve, reject) => {
      var img = document.createElement("img");
      img.crossOrigin = 'Anonymous'
      img.onload = function () {
        var tmpCanvas = document.createElement("canvas");
        var tmpCtx = tmpCanvas.getContext("2d");
        tmpCanvas.width = width;
        tmpCanvas.height = height;
        tmpCtx.drawImage(this, 0, 0, width, height);
        var dataURI = tmpCanvas.toDataURL();
        resolve(dataURI);
      };
      img.src = image_src;
    });
  }


  async requestChangeColor(image_key, codes) {
    let tokenRes = await getAccessToken()
    if (!tokenRes.status) {
      return tokenRes
    }
    console.log('tokenRes:', tokenRes)
    let headers = {
      Authorization: `Bearer ${tokenRes.data.access_token}`,
    };

    let params = {
      user_id: 'vm',
      image_key: image_key,
      new_materical_group: this.project.fabric_name,
      new_material_codes: codes
    }

    let result = await changeColor(params, headers);
    if (!result.status) {
      return result
    }
    console.log('result:', result)
    let changed_codes = []
    this.color_codes.map((item) => {
      changed_codes.push(codes[item])
    })
    this.changed_codes = changed_codes
    console.log('img_url:', this.img_url)
    this.img_url = result.data.image_url
    console.log('result.data.image_url:', result.data.image_url)
    // this.separated_img_key = result.data.image_key
    return result
  }

  async requestColorSeparation(color_count, image_file, target_codes) {
    let tokenRes = await getAccessToken()
    if (!tokenRes.status) {
      return tokenRes
    }
    console.log('tokenRes:', tokenRes)
    let headers = {
      Authorization: `Bearer ${tokenRes.data.access_token}`,
    };

    let params = {
      color_num: color_count,
      image: image_file,
      material_group: this.project.fabric_name,
      color_mode: 2,
      use_img_url: 1,
      // width: 311,
      // height: 234,
      get_masks: 1,
      user_id: 'vm',
    }
    if(target_codes) {
      params = {...params, direct_colors: target_codes}
    }

    let result = await colorSeparation(params, headers);
    if (!result.status) {
      return result
    }
    console.log('result:', result)
    return result
  }

  async requestUploadImage(image_file) {
    let api = new Realibox(this.realiboxApiOptions)
    var policyRes = await api.getPolicy({
      name: image_file.name, project_id: this.project.project_id
    })
    if (!policyRes.status) {
      return policyRes
    }
    var uploadRes = await api.uploadFile(policyRes.data, image_file, 0)
    return uploadRes
  }

  generateMaterials() {
    for (let rule of this.rules) {
      var materials = this.raw_materials.filter((item) => {
        return item.name.startsWith(rule.name)
      })
      if (materials) {
        var materialObjs = []
        materials.map((item) => {
          materialObjs.push(new Material(item.name, rule.has_bg, rule.has_image, { ...item }))
        })
        this.materials = [...this.materials, ...materialObjs]
      }
    }
  }

  generateSimulationData(byImgId = true) {
    let simulation_data = []
    if (this.img_uid) {
      this.materials.map((item) => {
        var item_data = {
          name: item.name
        }
        if (byImgId === true) {
          item_data['img_uid'] = this.img_uid
        } else {
          item_data['img_url'] = this.img_url
          // item_data['img_url'] = this.img_url+'?x-oss-process=image/resize,m_pad,h_2048,w_2048'
        }

        simulation_data.push(item_data)
      })
    }

    return simulation_data
  }

  toString() {
    return '(group-' + this.group.group_name + ')';
  }
}

export default MaterialGroup