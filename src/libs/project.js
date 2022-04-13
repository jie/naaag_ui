import Realibox from "@/utils/realibox";
import { nanoid } from "nanoid";
import GroupNameRules from "./groupNameRules.json"
import MaterialGroup from "./material_group"
import {getAccessToken, getMaterials} from "@/utils/color_api"
import {rgb2hex} from "@/utils/image_tools"
import { toRaw } from '@vue/reactivity';

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
  constructor(project_id, rules = [], fabric_id=1) {
    this.project_id = project_id
    this.fabric_id = fabric_id
    this.fabric_name = FabricColorGroupMapping[fabric_id]
    this.projectData = ""
    this.copy_project_id = ""
    this.copy_project_name = ""
    this.realibox = new Realibox({
      base_url: import.meta.env.VITE_APP_REALIBOX_HOST,
      appkey: import.meta.env.VITE_APP_REALIBOX_APPKEY,
      secret: import.meta.env.VITE_APP_REALIBOX_SECRET,
    });
    this.rawMaterials = []
    if (rules && rules.length !== 0) {
      this.rules = rules
    } else {
      this.rules = GroupNameRules
    }
    this.material_groups = []
    // all color value name and value
    this.colors = {}
    // all color codes array
    this.color_codes = []
    // separated color name
    this.separated_colors = []
    // separated color only color code
    this.separated_codes = []
  }

  getColorByName(name) {
    console.log('name:', name)
    return toRaw(this.colors[name])
  }

  getColorCodeByName(name) {
    return rgb2hex(this.getColorByName[name])
  }
  /* 生成系统分色颜色 */
  generateSeparatedColorCode(separated_colors) {
    let separated_codes = []
    separated_colors.map((item) => {
      separated_codes.push(rgb2hex(this.colors[item]))
    })
    this.separated_colors = separated_colors
    this.separated_codes = separated_codes
  }
  getColorValueByIndex(index) {
    console.log('value:', this.color_codes[index].value)
    return rgb2hex(this.color_codes[index].value)
  }
  async getColors() {
    let tokenRes = await getAccessToken()
    if(!tokenRes.status) {
      return tokenRes
    }
    console.log('tokenRes:', tokenRes)
    let headers = {
      Authorization: `Bearer ${tokenRes.data.access_token}`,
    };

    let materialsRes = await getMaterials({}, headers)
    console.log('materialsRes:', materialsRes)
    if(!materialsRes.status) {
      return materialsRes
    }
    this.colors = materialsRes.data.material_groups[this.fabric_name]
    console.log('colors:', this.colors)
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
    // let project_name = `${this.projectData.name}[copy-${nanoid(8)}]`
    // let result = await this.realibox.copyProject(project_name, this.project_id)
    // if (result.data.code == 10000) {
    //   this.copy_project_id = result.data.info.id
    //   this.copy_project_name = project_name
    //   console.log('copy_project_id:', this.copy_project_id)
    //   let copyMaterialRes = await this.realibox.getMaterial({ project_id: this.copy_project_id, limit: 1000 })
    //   console.log('copyMaterialRes:', copyMaterialRes)
    // }
    this.copy_project_id = 34520
  }

  async getMaterialsFromProject() {
    let result = await this.realibox.getMaterial({ project_id: this.project_id, limit: 1000 })
    if (result.data.code == 10000) {
      this.rawMaterials = result.data.list.data
    }
  }

  async getMaterialGroups() {
    let material_groups = []
    for (let item of this.rules) {
      var material_group = this.createMaterialGroup(item)
      if (material_group.materials.length !== 0) {
        material_groups.push(material_group)
      }
    }
    this.material_groups = material_groups
  }

  setGroupCanvas(canvases) {
    canvases.map((item, index) => {
      this.material_groups[index].setCanvas(item)
    })
  }

  createMaterialGroup(item) {
    let materialGroup = new MaterialGroup(item.name, this, this.rawMaterials, item.materials)
    materialGroup.generateMaterials()
    return materialGroup
  }
  // 暂时不用全部上传
  // async uploadImages() {
  //   if (!this.copy_project_id) {
  //     await this.createProjectCopy()
  //   }

  //   let uploadTasks = []
  //   this.material_groups.map(async (item, index) => {
  //     var task = async () => {
  //       var taskResult = await item.uploadImage(this.copy_project_id)
  //       return taskResult
  //     };
  //     uploadTasks.push(task);
  //   })

  //   let taskResults = [];
  //   for (let task of uploadTasks) {
  //     const taskResult = await task();
  //     console.log("taskResult:", taskResult);
  //     taskResults.push(taskResult);
  //   }
  //   console.log("results:", taskResults);
  // }

  async preview3d() {
    if(!this.copy_project_id) {
      this.createProjectCopy()
    }
    let materials = []
    this.material_groups.map(async (item, index) => {
      materials = [...materials, ...item.generateSimulationData()]
    })
    console.log('materials:', materials)
    let result = await this.realibox.sceneSimulation(this.copy_project_id, materials)
    console.log('sceneSimulation:', result)
  }
}

export default Project