import Realibox from "@/utils/realibox";
import { nanoid } from "nanoid";
import GroupNameRules from "./groupNameRules.json"
import ProjectData from "./projectData.json"
import MaterialGroup from "./material_group"
import Color from "./color"
import { getAccessToken, getMaterials, colorSeparation } from "@/utils/color_api"
import { rgb2hex } from "@/utils/image_tools"
import { toRaw } from '@vue/reactivity';
import materialColorData from "../utils/color_data.json"
const FabricColorGroupMapping = {
  1: 'VN01',
  'VN01': 1,
  2: 'CM01',
  'CM01': 2,
  3: 'CT01',
  'CT01': 3,
  4: 'WL01',
  'WL01': 4
}

const FabricNameMapping = {
  1: 'Recycled Viscose Nylon',
  2: 'Cashmere',
  3: 'BCI Cotton',
  4: 'Total Easy Care Merino Wool'
}


class Project {

  singleProject = ""

  constructor(silhouette_id, rules = [], fabric_id = 1) {
    this.project_id = ""
    this.silhouette_id = silhouette_id
    this.fabric_id = fabric_id
    this.fabric_name = FabricColorGroupMapping[fabric_id]
    // this.canvases = canvases
    // this.context = context
    this.projectData = ""
    this.copy_project_id = ""
    this.copy_project_name = ""
    this.realibox = new Realibox({
      base_url: import.meta.env.VITE_APP_REALIBOX_HOST,
      appkey: import.meta.env.VITE_APP_REALIBOX_APPKEY,
      secret: import.meta.env.VITE_APP_REALIBOX_SECRET,
    });
    this.rawMaterials = []
    this.rules = GroupNameRules

    this.material_groups = []
    // all color value name and value
    this.colors = {}
    // all color codes array
    this.color_codes = []

    this.user_colors = []

    this.projectMaskData = []
    this.loadProjectMaskData()
  }

  static getInstance() {
    if (!this.singleProject) {
      return
    }
    return this.singleProject
  }

  loadProjectMaskData() {
    /* 需要改成生产数据 */

    ProjectData.map((item) => {
      if (item.silhouette_id === this.silhouette_id) {
        this.projectMaskData = item
        this.project_id = item.project_id
      }
    })

    if (this.projectMaskData.length === 0) {
      alert('project_data_not_foud')
      return
    }
    console.log('projectMaskData:', this.projectMaskData)


    this.projectMaskData.masks.map((mask, index) => {
      this.rules.map((rule) => {
        if (rule.key === mask.name) {
          var prefixes = []
          rule.materials.map((item) => {
            prefixes.push(item.name)
          })
          mask.prefixes = prefixes
          if (!mask.hasOwnProperty('has_bg')) {
            mask.has_bg = rule.has_bg
          }
          if (!mask.hasOwnProperty('has_image')) {
            mask.has_image = rule.has_image
          }
        }
      })
    })
  }

  // loadCanvases() {
  //   let canvases = []
  //   this.projectMaskData.masks.map((mask, index) => {
  //     canvases.push(this.context.$refs[`canvas-com-${index}`][0])
  //   })
  //   this.canvases = canvases
  // }

  addUserColors(colorArr) {
    if(this.user_colors.length + colorArr.length > 5) {
      alert('5 color selected')
      return
    }
    for (let item of colorArr) {
      var code_name = this.color_codes[item].name
      console.log('item:', item, ', color:', code_name)
      this.user_colors.push(new Color(code_name, this.colors[code_name]))
    }
  }

  getColorByName(name) {
    return toRaw(this.colors[name])
  }

  getColorCodeByName(name) {
    return rgb2hex(this.getColorByName[name])
  }

  getUserColorCodeNames() {
    return this.user_colors.map((item) => {
      return item.code_name
    })
  }
  /* 生成系统分色颜色 */
  generateUserColors(color_res) {
    let color_codes = eval(color_res.data.color_codes)
    let user_colors = []
    color_codes.map((item) => {
      user_colors.push(new Color(item, this.colors[item]))
    })
    this.user_colors = user_colors
  }
  getColorValueByIndex(index) {
    return rgb2hex(this.color_codes[index].value)
  }
  async getColors() {
    // let tokenRes = await getAccessToken()
    // console.log('tokenRes:', tokenRes)
    // if (!tokenRes.status) {
    //   return tokenRes
    // }
    // let headers = {
    //   Authorization: `Bearer ${tokenRes.data.data.access_token}`,
    // };

    // let materialsRes = await getMaterials({material_group: this.fabric_name}, headers)
    let materialsRes = { status: true, data: materialColorData.data }
    if (!materialsRes.status) {
      return materialsRes
    }
    this.colors = materialsRes.data.material_groups[this.fabric_name]
    let color_codes = []
    Object.keys(this.colors).map((item) => {
      color_codes.push({
        name: item,
        value: this.colors[item]
      })
    })
    this.color_codes = color_codes
    return materialsRes
  }

  async createProjectCopy() {
    let project_name = `${this.projectMaskData.fbx_name}[copy-${nanoid(8)}]`
    let result = await this.realibox.copyProject(project_name, this.project_id)
    if (result.data.code == 10000) {
      this.copy_project_id = result.data.info.id
      this.copy_project_name = project_name
      let copyMaterialRes = await this.realibox.getMaterial({ project_id: this.copy_project_id, limit: 1000 })
      console.log('copyMaterialRes:', copyMaterialRes)
    }
  }

  async getMaterialsFromProject() {
    let result = await this.realibox.getMaterial({ project_id: this.project_id, limit: 1000 })
    if (result.data.code == 10000) {
      this.rawMaterials = result.data.list.data
    }
  }

  async getMaterialGroups() {
    let material_groups = []
    for (let item of this.projectMaskData.masks) {
      var material_group = this.createMaterialGroup(item)
      if (material_group.materials.length !== 0) {
        material_groups.push(material_group)
      }
    }
    this.material_groups = material_groups
  }
  createMaterialGroup(item) {
    let materialGroup = new MaterialGroup(item.name, this.rawMaterials, item)
    materialGroup.generateMaterials()
    return materialGroup
  }
  async uploadImages(context) {
    if (!this.copy_project_id) {
      await this.createProjectCopy()
    }

    let uploadTasks = []
    this.material_groups.map(async (item, index) => {
      var task = async () => {
        var canvas = context.$refs[`canvas-com-${item.group_name}`][0]
        var taskResult = await item.uploadCanvasImage(canvas)
        return taskResult
      };
      uploadTasks.push(task);
    })

    let taskResults = [];
    for (let task of uploadTasks) {
      const taskResult = await task();
      taskResults.push(taskResult);
    }
    console.log('taskResults:', taskResults)
    return {
      status: true
    }
  }

  async preview3d() {
    if (!this.copy_project_id) {
      this.createProjectCopy()
    }
    let materials = []
    this.material_groups.map(async (item, index) => {
      materials = [...materials, ...item.generateSimulationData()]
    })
    let result = await this.realibox.sceneSimulation(this.copy_project_id, materials)
    return result
  }
}

export default Project