import Realibox from "@/utils/realibox";
import { nanoid } from "nanoid";
import GroupNameRules from "./groupNameRules.json"
import MaterialGroup from "./material_group"
import {getAccessToken, getMaterials} from "@/utils/color_api"
import {rgb2hex} from "@/utils/image_tools"

const FabricColorGroupMapping = {
  1: 'CT01',
  'CT01': 1
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
    // separated color name
    this.separated_colors = []
    // separated color only color code
    this.separated_codes = []
  }

  getColorByName(name) {
    return this.colors[name]
  }

  getColorCodeByName(name) {
    return rgb2hex(this.getColorByName[name])
  }

  getSeparatedColorCode() {
    let separated_codes = []
    this.separated_colors.map((item) => {
      separated_codes.push(this.getColorCodeByName(item))
    })
    this.separated_codes = separated_codes
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