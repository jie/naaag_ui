

import Material from "./material"
import Project from "./project"
import Color from "./color"
import Realibox from "@/utils/realibox";
import { dataURLtoFile } from "@/utils/image_tools";
import { nanoid } from "nanoid";
import { getAccessToken, colorSeparation, colorSeparationDirect, changeColor } from "@/utils/color_api"
import { uploadRequestDeco } from "./api_tools"

const RealiboxImageSize = [2048, 2048]

class MaterialGroup {
  constructor(group_name, raw_materials = [], mask = "") {
    this.group_name = group_name
    this.raw_materials = raw_materials
    this.mask_prefixes = mask.prefixes || []
    this.mask = mask
    this.materials = []
    // this.context = context
    // this.canvas = context.$refs[`canvas-com-${group_name}`][0]
    this.realiboxApiOptions = {
      base_url: import.meta.env.VITE_APP_REALIBOX_HOST,
      appkey: import.meta.env.VITE_APP_REALIBOX_APPKEY,
      secret: import.meta.env.VITE_APP_REALIBOX_SECRET,
    }

    /*上传给realibox的图片*/
    this.img_url = ""
    this.img_uid = ""
    this.img_cache = {}

    /* 原始图片 */
    this.image_src = ""
    this.image_file = ""

    /* 单独上传分色后的图片 */
    this.separated_origin_data = ""
    this.separated_data = ""

    this.color_codes = []
    this.color_codes_str = ""
    this.color_count = ""
    this.changed_codes = []
    this.canvas_settings = {
      width: "",
      height: "",
      x: "",
      y: "",
      angle: "",
      is_transparent: false,
      originWidth: "",
      originHeight: "",
      backgroundColor: "",
      image: "",
      imageFile: ""
    }

    this.user_colors = []
  }

  addMaterial(material) {
    this.materials.push(material)
  }

  setCanvas(canvas) {
    this.canvas = canvas
  }

  async uploadImage(color_num = 4, size = "") {
    let project = Project.getInstance()
    let image_file = this.canvas_settings.imageFile
    let image_url = this.canvas_settings.image_url
    if (!size) {
      size = [this.canvas_settings.originWidth, this.canvas_settings.originHeight]
    }
    let colorRes;
    if (project.user_colors.length === 0) {
      colorRes = await this.requestColorSeparation(image_file, color_num, "", size)
    } else {
      let project_user_colors = []
      project.user_colors.map((item) => {
        project_user_colors.push(item.code_name)
      })
      colorRes = await this.requestColorSeparation(image_file, "", project_user_colors, size)
    }

    if (!colorRes.status) {
      alert('fail_color_separation')
      return
    }
    // let colorRes = {"color_codes": "['NV704', 'NV900B', 'NV733', 'NV706']", "image_url": "https://cloud-cube-us2.s3.amazonaws.com/y8bun47nf5du/public/b30edd960a67f6330ed889bd09d1eff2726a614b1833890f.jpg", "bmp_image_url": "https://cloud-cube-us2.s3.amazonaws.com/y8bun47nf5du/public/bd80fa73ae2d91dd7d213c25822d5285e24c3c73988e1aeb.bmp", "image_key": "bd80fa73ae2d91dd7d213c25822d5285e24c3c73988e1aeb", "new_km_codes_type": "<class 'numpy.ndarray'>"}
    // colorRes = { 'data': colorRes }
    if (project.user_colors.length === 0) {
      this.separated_origin_data = colorRes.data;
      project.generateUserColors(colorRes)
      // update all group user_colors
      project.material_groups.map((item) => {
        item.generateUserColors(colorRes)
      })
    }
    this.separated_data = colorRes.data
    // this.canvas_settings.image = image_url;
    // this.canvas_settings.imageFile = image_file;
    this.img_url = colorRes.data.image_url
    return colorRes
  }

  setAllOverImage(context) {
    let project = Project.getInstance()
    project.material_groups.map((item) => {
      if (item.group_name !== this.group_name && item.mask.has_image) {
        item.separated_data = {...this.separated_data}
        item.canvas_settings.image = this.canvas_settings.image;
        item.canvas_settings.imageFile = this.canvas_settings.imageFile;
        item.img_url = this.img_url
        context.$refs[`canvas-com-${item.group_name}`][0].onUploadFileChange(
          this.img_url
        );
      }
    });
  }
  setAllOverBg(context) {
    if (this.canvas_settings.backgroundColor === "") {
      alert('backgroundColor required')
      return
    }
    let project = Project.getInstance()
    let rgb_color = project.getColorValueByIndex(this.canvas_settings.backgroundColor)
    project.material_groups.map((item) => {
      if (item.group_name !== this.group_name && item.mask.has_bg) {
        item.canvas_settings.backgroundColor = this.canvas_settings.backgroundColor
        context.$refs[`canvas-com-${item.group_name}`][0].addBackgroundColor(rgb_color)
      }
    });
  }

  generateUserColors(color_res, colorCodeMap) {
    let color_codes = []
    if(colorCodeMap) {
      let origin_codes = eval(this.separated_origin_data.color_codes)
      for(let item of origin_codes) {
        color_codes.push(colorCodeMap[item])
      }
      console.log('origin_codes:', origin_codes)
    } else {
      color_codes = eval(color_res.data.color_codes)
    }
    let user_colors = []
    
    console.log('color_codes:', color_codes)
    color_codes.map((item) => {
      user_colors.push(new Color(item, Project.getInstance().colors[item]))
    })

    this.color_codes = color_codes
    this.user_colors = user_colors
    this.color_count = user_colors.length
  }

  async uploadCanvasImage(canvas) {
    if (!this.img_url) {
      return {status: false, data: "img_url_not_set"}
    }

    if (this.canvas_settings.backgroundColor === "") {
      return {status: false, data: "background_not_set"}
    }

    let bg_color = Project.getInstance().color_codes.find((item, index) => {
      return this.canvas_settings.backgroundColor === index
    })

    let imageSrc = await canvas.onExportFromSeparationImage(this.canvas_settings.image);

    let filename = `${nanoid()}.png`
    let imageFile = dataURLtoFile(imageSrc, filename)

    let color_count = this.user_colors.length + 1
    let direct_colors = [bg_color.name, ...this.user_colors.map(item => item.code_name)]

    let colorRes = await this.requestColorSeparation(imageFile, color_count, direct_colors, RealiboxImageSize)
    if (!colorRes.status) {
      return colorRes
    }

    let tmp_image_src = await this.generateImageFile(colorRes.data.image_url, RealiboxImageSize[0], RealiboxImageSize[1])
    // console.log('tmp_image_src---')
    // console.log(tmp_image_src)
    var tmp_name = `${nanoid()}.png`
    var tmp_image_file = dataURLtoFile(tmp_image_src, tmp_name)

    let uploadRes = await this.requestUploadImage(tmp_image_file)
    if(!uploadRes.status) {
      return uploadRes
    }
    this.img_uid = uploadRes.data.img_uid
    return uploadRes
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


  async requestChangeColor(codes) {
    let tokenRes = await getAccessToken()
    if (!tokenRes.status) {
      return tokenRes
    }
    let headers = {
      Authorization: `Bearer ${tokenRes.data.data.access_token}`,
    };

    let params = {
      user_id: 'vm',
      image_key: this.separated_origin_data.image_key,
      new_materical_group: Project.getInstance().fabric_name,
      new_material_codes: codes,
      width: this.canvas_settings.originWidth,
      height: this.canvas_settings.originHeight
    }

    let result = await changeColor(params, headers);
    if (!result.status) {
      return result
    }
    return result
  }

  async requestColorSeparation(image_file, color_num, direct_colors, size) {
    let tokenRes = await getAccessToken()
    if (!tokenRes.status) {
      return tokenRes
    }
    let headers = {
      Authorization: `Bearer ${tokenRes.data.data.access_token}`,
    };

    let params = {
      color_num: color_num,
      image: image_file,
      material_group: Project.getInstance().fabric_name,
      color_mode: 2,
      use_img_url: 1,
      get_masks: 0,
      user_id: 'vm',
      width: size[0],
      height: size[1],
      bmp_width: 750,
      bmp_height: 750,
    }

    let result;
    if (direct_colors) {
      params.direct_colors = direct_colors
      result = await colorSeparationDirect(params, headers);
    } else {
      params.color_num = color_num
      result = await colorSeparation(params, headers);
    }
    return result
  }

  async requestUploadImage(image_file) {
    if (!Project.getInstance().copy_project_id) {
      await Project.getInstance().createProjectCopy()
    }

    let api = new Realibox(this.realiboxApiOptions)
    var policyRes = await api.getPolicy({
      name: image_file.name, project_id: Project.getInstance().copy_project_id
    })
    if (!policyRes.status) {
      return policyRes
    }
    var uploadRes = await api.uploadFile(policyRes.data, image_file, 0)
    return uploadRes
  }

  generateMaterials() {
    for (let prefix of this.mask_prefixes) {
      var materials = this.raw_materials.filter((item) => {
        return item.name.startsWith(prefix)
      })
      if (materials.length !== 0) {
        materials.map((item) => {
          this.materials.push(new Material(item.name, this.mask.has_bg, this.mask.has_image, item))
        })
      }
    }
  }

  generateSimulationData() {
    let simulation_data = []
    this.materials.map((item) => {
      var item_data = {
        name: item.name
      }
      if (this.img_uid) {
        item_data['img_uid'] = this.img_uid
      } else {
        item_data['color'] = Project.getInstance().getColorValueByIndex(this.canvas_settings.backgroundColor)
      }

      simulation_data.push(item_data)
    })
    return simulation_data
  }

  toString() {
    return '(group-' + this.group_name + ')';
  }
}

export default MaterialGroup