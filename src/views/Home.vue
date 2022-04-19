<template>
  <BaseLayout>
    <template #body>
      <div class="flex">
        <input
          type="file"
          id="btn_file"
          style="display: none"
          @change="onUploadFileChange"
        />
        <input
          type="file"
          id="btn_change_file"
          style="display: none"
          @change="onChangeUploadFileChange"
        />
        <div class="parts">
          <div
            class="part"
            v-for="(item, index) in materialGroups"
            :key="index"
          >
            <div class="mask-btn">
              <img
                class="part-image"
                :src="item.mask.thumb_url"
                v-if="item.mask.thumb_url"
                alt=""
                @click="materialIndex = index"
              />
              <img
                class="part-image"
                :src="item.mask.mask_url"
                v-else
                alt=""
                @click="materialIndex = index"
              />
              <span class="">{{ item.group_name }}</span>
            </div>
          </div>
        </div>
        <div class="center relative">
           <div class="outscreen">{{timestamp}}</div>
          <div
            class="global-colors flex"
            v-if="
              project && project.user_colors.length !== 0
            "
          >
         
            <div
              v-for="(item, index) in project.user_colors"
              :key="index"
              class="color-btn"
              :style="{ backgroundColor: item.hexcode }"
            ></div>
          </div>
          <div class="canvas" ref="canvas">
            <div
              v-for="(item, index) in materialGroups"
              :key="index"
              :class="{
                outscreen: index === materialIndex ? false : true,
                'fabric-wrapper': true,
              }"
            >
              <CanvasCom
                :coverIndex="index"
                :canvasId="`myCanvas-${index}`"
                :overlayImage="item.mask.mask_url"
                :canvasWidth="canvasSettings.width"
                :ref="`canvas-com-${item.group_name}`"
                v-on:setImageProperties="setOperateProperties"
                v-on:removeImage="removeImage"
              />
            </div>
            <div class="flex items-center justify-center">
              <div
                class="
                  inline-block
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  cursor-pointer
                "
                @click="useMask"
              >
                Mask
              </div>
              <div
                class="
                  inline-block
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  cursor-pointer
                "
                @click="setUndo"
              >
                <svg-icon
                  name="Undo"
                  style="color: aqua; font-size: 30px"
                ></svg-icon>
              </div>
              <div
                class="
                  inline-block
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  cursor-pointer
                "
                @click="setRedo"
              >
                <svg-icon
                  name="Redo"
                  style="color: aqua; font-size: 30px"
                ></svg-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="rs" style="background-color: #f6f6f6">
          <div class="pt-5">
            <div class="mb-5">
              <div class="operate-tabs flex">
                <div
                  :class="{
                    'operate-tab': true,
                    active: operateMaterialStatus == 'image',
                  }"
                  @click="changeTab('image')"
                >
                  Image
                </div>
                <div
                  :class="{
                    'operate-tab': true,
                    active: operateMaterialStatus == 'colour',
                  }"
                  @click="changeTab('colour')"
                >
                  Colour
                </div>
              </div>
            </div>
            <div class="">
              <div v-if="operateMaterialStatus === 'image'">
                <div v-if="materialGroups.length !== 0">
                  <div
                    class="image-uploader"
                    style="width: 310px; height: 240px; margin: 0 auto"
                    v-if="
                      materialGroups[materialIndex].canvas_settings.image == ''
                    "
                    @click="onClickAddImage"
                  >
                    <div
                      class="
                        border
                        rounded-md
                        h-full
                        w-full
                        border-black
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <div>click or drag image to upload</div>
                      {{ materialGroups[materialIndex].canvas_settings.image }}
                    </div>
                  </div>
                  <div class="operates" v-else>
                    <div class="options-bar flex ml-8 mr-8 mb-4">
                      <div class="flex-1 flex-center" @click="setFlipX">
                        <svg-icon
                          name="Flip H"
                          style="color: #000; font-size: 2em"
                        ></svg-icon>
                      </div>
                      <div class="flex-1 flex-center" @click="setFlipY">
                        <svg-icon
                          name="Flip V"
                          style="color: #000; font-size: 2em"
                        ></svg-icon>
                      </div>
                      <div class="flex-1 flex-center" @click="setCenterH">
                        <svg-icon
                          name="Center H"
                          style="color: #000; font-size: 2em"
                        ></svg-icon>
                      </div>
                      <div class="flex-1 flex-center" @click="setCenterV">
                        <svg-icon
                          name="Center V"
                          style="color: #000; font-size: 2em"
                        ></svg-icon>
                      </div>
                      <div class="flex-1 flex-center" @click="setActualSize">
                        <svg-icon
                          name="Actual"
                          style="color: #000; font-size: 2em"
                        ></svg-icon>
                      </div>
                      <div class="flex-1 flex-center" @click="setFill">
                        <svg-icon
                          name="Fill"
                          style="color: #000; font-size: 2em"
                        ></svg-icon>
                      </div>
                    </div>

                    <div class="operate">
                      <div class="flex">
                        <div class="flex mr-5">
                          <div class="operate-label">w</div>
                          <div>
                            <input
                              class="border"
                              type="text"
                              @change="setWidth"
                              :value="
                                materialGroups[materialIndex].canvas_settings
                                  .width
                              "
                            />
                          </div>
                        </div>
                        <div class="flex">
                          <div class="operate-label">h</div>
                          <div>
                            <input
                              class="border"
                              type="text"
                              @change="setHeight"
                              :value="
                                materialGroups[materialIndex].canvas_settings
                                  .height
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="flex">
                        <div class="flex mr-5">
                          <div class="operate-label">x</div>
                          <div>
                            <input
                              class="border"
                              type="text"
                              @change="setX"
                              :value="
                                materialGroups[materialIndex].canvas_settings.x
                              "
                            />
                          </div>
                        </div>
                        <div class="flex">
                          <div class="operate-label">y</div>
                          <div>
                            <input
                              class="border"
                              type="text"
                              @change="setY"
                              :value="
                                materialGroups[materialIndex].canvas_settings.y
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="flex mr-5">
                        <div class="operate-label">angle</div>
                        <div>
                          <input
                            class="border"
                            type="text"
                            @change="setAngle"
                            :value="
                              materialGroups[materialIndex].canvas_settings
                                .angle
                            "
                          />
                        </div>
                      </div>
                    </div>
                    <div class="operate btn flex items-center pl-8 mt-5">
                      <div class="flex flex-1">
                        <div class="flex-1" @click="setAllOverImage">
                          Remove Background Color
                        </div>
                        <div style="width: 80px">
                          <SwitchButton v-model="switchVal" />
                        </div>
                      </div>
                    </div>
                    <div class="operate btn flex items-center pl-8">
                      <div class="flex flex-1">
                        <div class="flex-1" @click="setAllOverImage">
                          All Over
                        </div>
                        <div style="width: 80px">
                          <SwitchButton v-model="switchVal" />
                        </div>
                      </div>
                    </div>
                    <div class="operate btn flex items-center pl-8">
                      <div class="flex flex-1">
                        <div>Reset</div>
                      </div>
                    </div>
                    <div class="operate btn flex items-center pl-8">
                      <div class="flex flex-1">
                        <div @click="onClickReplaceImage">Change image</div>
                      </div>
                    </div>
                    <div class="operate btn flex items-center pl-8">
                      <div class="flex flex-1">
                        <div class="operate-selection">
                          <select name="" id="" v-model="colorCount">
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>
                      <div class="operate-btn" @click="setColorSeparation">
                        separation
                      </div>
                    </div>
                    <div v-for="(item, index) in materialGroups" :key="index">
                      <div v-if="index === materialIndex">
                        <div class="operate color-panel">
                          <div>
                            <color-panel
                              :ref="`colorPanel-${index}`"
                              :material_colors="
                                materialGroups[materialIndex].user_colors
                              "
                              :color_codes="project.color_codes"
                              :colors_map="project.colors"
                              v-on:set_color="onMaterialGroupColorChange"
                            />
                          </div>
                        </div>
                        <!-- <div @click="testCanvasData">test canvas data</div> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="operateMaterialStatus === 'colour'">
                <div
                  class="operate flex items-center pl-8 mt-5"
                  style="height: 60px"
                >
                  <div class="flex flex-1">
                    <div class="flex-1" @click="setAllOverBg">All Over</div>
                    <div style="width: 80px">
                      <SwitchButton v-model="switchVal" />
                    </div>
                  </div>
                </div>

                <div class="color-btns" v-if="project && project.color_codes">
                  <div
                    :class="{
                      'color-btn': true,
                      'border-black': true,
                      'border-2':
                        index ===
                        materialGroups[materialIndex].canvas_settings
                          .backgroundColor,
                    }"
                    v-for="(color, index) in project.color_codes"
                    :key="index"
                    :style="{
                      'background-color': `rgb(${color.value[0]},${color.value[1]},${color.value[2]})`,
                    }"
                    @click="setBackgroundColor(index)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="flex pl-20 pr-20 pt-6">
          <div class="flex flex-1">
            <div>
              <img
                style="width: 37px"
                src="/static/editor_static/example_cloth.png"
              />
            </div>
            <div>
              <div>Women Cowl Neck Top (M)</div>
              <div>Recycle Viscose Nylon</div>
            </div>
          </div>
          <div>
            <div class="operate-btn">Change Product</div>
            <div class="operate-btn">Save</div>
            <div class="operate-btn" @click="preview3d">
              Finish & 3D Preview
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import BaseLayout from "./BaseLayout.vue";
import MaterialGroupData from "@/data/material_group.json";
import Realibox from "@/utils/realibox";
import CanvasCom from "@/components/canvas-com/index.vue";
import Project from "@/libs/project";
import RealiboxAPI from "@/utils/realibox";
import ColorPanel from "@/components/color_panel.vue";
import { toRaw } from "@vue/reactivity";
import SwitchButton from "@/components/switchui.vue";
import moment from "moment"

function getExtName(name) {
  let myName = name.toLowerCase();
  if (myName.includes(".png")) {
    return "png";
  } else if (myName.includes(".jpg") || myName.includes(".jpeg")) {
    return "jpg";
  } else {
    var arr = myName.split(".");
    return arr[arr.length - 1];
  }
}

export default defineComponent({
  setup() {},
  components: {
    BaseLayout,
    CanvasCom,
    ColorPanel,
    SwitchButton,
  },
  data() {
    return {
      silhouette_id: "",
      fabric_id: 1,
      project_id: "",
      project: "",
      materialGroups: [],
      operateMaterialStatus: "image",
      // operateMaterialStatus: "colour"
      canvasSettings: {
        width: 750,
        height: 750,
      },
      materialIndex: 0,
      upload_images: [],
      imageSettings: [],
      realiboxApiOptions: {
        base_url: import.meta.env.VITE_APP_REALIBOX_HOST,
        appkey: import.meta.env.VITE_APP_REALIBOX_APPKEY,
        secret: import.meta.env.VITE_APP_REALIBOX_SECRET,
      },
      colorCount: 4,
      switchVal: false,
      timestamp: "1"
    };
  },
  async mounted() {
    this.getScreenSize();
    if (this.$route.query.silhouette_id) {
      this.silhouette_id = this.$route.query.silhouette_id;
    } else {
      alert("silhouette_id_required");
      return;
    }
    if (this.$route.query.materialId) {
      this.fabric_id = this.$route.query.materialId;
    }
    if (this.$route.query.color_count) {
      this.colorCount = this.$route.query.color_count;
    }

    await this.searchProject();
    await this.generateProject();

    this.$nextTick(async () => {
      let width = this.$refs.canvas.clientWidth;
      if (this.$refs.canvas.clientWidth > this.canvasSettings.width) {
        this.canvasSettings = {
          ...this.canvasSettings,
          width: width,
          height: width,
        };
      }
      // let canvases = [];
      this.materialGroups.map((item, index) => {
        this.$refs[`canvas-com-${item.group_name}`][0].initCanvas(
          this.canvasSettings.width
        );
        // canvases.push(this.$refs[`canvas-com-${item.name}`][0]);
      });
      // this.project.setGroupCanvas(canvases);
    });
  },
  methods: {
    getScreenSize() {},
    changeTab(status) {
      this.operateMaterialStatus = status;
    },
    onClickAddImage() {
      document.getElementById("btn_file").click();
    },
    onClickReplaceImage() {
      document.getElementById("btn_change_file").click();
    },
    async searchProject() {
      let realiboxApiOptions = {
        base_url: import.meta.env.VITE_APP_REALIBOX_HOST,
        appkey: import.meta.env.VITE_APP_REALIBOX_APPKEY,
        secret: import.meta.env.VITE_APP_REALIBOX_SECRET,
      };
      let realibox = new Realibox(realiboxApiOptions);
      let result = await realibox.getProjects({
        q: this.$route.query.fbx_name,
      });
    },
    async generateProject() {
      let project = new Project(this.silhouette_id, [], this.fabric_id);
      await project.getColors();
      await project.getMaterialsFromProject();
      project.getMaterialGroups();
      this.materialGroups = project.material_groups;
      // let canvases = []
      // this.materialGroups.map((item) => {
      //   canvases.push
      // })
      this.project = project;
      Project.singleProject = project;
    },
    myCanvas(i) {
      if (i === undefined) {
        return this.$refs[
          `canvas-com-${this.materialGroups[this.materialIndex].group_name}`
        ][0];
      } else {
        return this.$refs[`canvas-com-${this.materialGroups[i].group_name}`][0];
      }
    },
    myMaterial(i) {
      if (i === undefined) {
        return this.materialGroups[this.materialIndex];
      } else {
        return this.materialGroups[i];
      }
    },
    curSettings() {
      return this.materialGroups[this.materialIndex].canvas_settings;
    },
    async onUploadFileChange(e) {
      let image_url = window.URL.createObjectURL(e.target.files[0]);
      let extname = getExtName(e.target.files[0].name);
      let image = new Image();
      image.src = image_url;
      image.onload = async () => {
        var curSetting = this.curSettings();
        curSetting.originWidth = image.width;
        curSetting.originHeight = image.height;
        curSetting.image = image_url;
        curSetting.imageFile = e.target.files[0];
        this.myMaterial().img_url = image_url;
        this.myCanvas().onUploadFileChange(image_url);
      };
    },
    async onChangeUploadFileChange(e) {
      let image_url = window.URL.createObjectURL(e.target.files[0]);
      let extname = getExtName(e.target.files[0].name);
      let image = new Image();
      image.src = image_url;
      image.onload = async () => {
        var curSetting = this.curSettings();
        curSetting.originWidth = image.width;
        curSetting.originHeight = image.height;
        curSetting.image = image_url;
        curSetting.imageFile = e.target.files[0];
        this.project.user_colors = [];
        this.myMaterial().img_url = image_url;
        this.myMaterial().user_colors = [];
        this.myCanvas().onUploadFileChange(image_url);
      };
    },
    async onMaterialGroupColorChange(e) {
      let colorCodeMap = {};
      let origin_user_colors = eval(
        this.myMaterial().separated_origin_data.color_codes
      );
      e.material_color_codes.map((item, index) => {
        colorCodeMap[origin_user_colors[index]] = item;
      });
      let result = await this.myMaterial().requestChangeColor(colorCodeMap);
      console.log("result:", result);
      this.myMaterial().separated_data = result.data;
      this.myMaterial().generateUserColors(result, colorCodeMap);
      let changeResult = this.myCanvas().replaceImage(
        this.myMaterial().separated_data.image_url
      );
      if (!changeResult.status) {
        alert("fail_replace_color");
        return;
      }
    },
    setOperateProperties(e) {
      this.materialGroups[this.materialIndex].canvas_settings = {
        ...this.materialGroups[this.materialIndex].canvas_settings,
        ...e,
      };
    },
    setWidth(e) {
      this.myCanvas().setWidth(parseInt(e.target.value));
    },
    setHeight(e) {
      this.myCanvas().setHeight(parseInt(e.target.value));
    },
    setX(e) {
      this.myCanvas().setX(parseInt(e.target.value));
    },
    setY(e) {
      this.myCanvas().setY(parseInt(e.target.value));
    },
    setAngle(e) {
      this.myCanvas().setAngle(parseInt(e.target.value));
    },
    setFlipX(e) {
      this.myCanvas().setFlipX();
    },
    setFlipY(e) {
      this.myCanvas().setFlipY();
    },
    useMask() {
      this.myCanvas().useMask();
    },
    setUndo() {
      this.myCanvas().onClickUndo();
    },
    setRedo() {
      this.myCanvas().onClickRedo();
    },
    setActualSize() {
      this.myCanvas().setActualSize(
        this.curSettings().originWidth,
        this.curSettings().originHeight
      );
    },
    setFill() {
      this.myCanvas().setFill();
    },
    setCenterH() {
      this.myCanvas().setCenterH();
    },
    setCenterV() {
      this.myCanvas().setCenterV();
    },
    removeImage() {
      this.upload_images = [];
    },
    setBackgroundColor(index) {
      let color_names = this.project.getUserColorCodeNames();
      if (color_names.includes(this.project.color_codes[index].name)) {
        this.myMaterial().canvas_settings.backgroundColor = index;
        this.myCanvas().addBackgroundColor(
          this.project.getColorValueByIndex(index)
        );
      } else {
        if (this.project.user_colors.length + 1 > 5) {
          alert("5 color selected");
          return;
        }
        this.myMaterial().canvas_settings.backgroundColor = index;
        this.myCanvas().addBackgroundColor(
          this.project.getColorValueByIndex(index)
        );
        this.project.addUserColors([index]);
      }
    },
    setAllOverImage() {
      this.myMaterial().setAllOverImage(this);
    },
    setAllOverBg() {
      this.myMaterial().setAllOverBg(this);
    },
    async preview3d() {
      let mg = this.materialGroups.find(
        (item) => item.canvas_settings.backgroundColor === ""
      );
      if (mg) {
        alert(`${mg} is not set background`);
        return;
      }
      await this.project.uploadImages(this);
      let result = await this.project.preview3d();
      // if(result.data)
    },
    onColorCountChange(e) {},
    async setColorSeparation() {
      // await this.myMaterial().uploadCanvasImage(this.myCanvas());
      let uploadRes = await this.myMaterial().uploadImage(this.colorCount);
      if (!uploadRes.status) {
        alert(uploadRes.data);
        return;
      }

      // this.myCanvas().onUploadFileChange(this.myMaterial().img_url);
      this.myCanvas().replaceImage(this.myMaterial().img_url);
      document.getElementById("btn_file").value = "";
      this.timestamp = moment().format('YYYYMMDDHHmmss')
    },
    async testCanvasData() {
      let separated_image = await this.myCanvas().onExportFromSeparationImage(
        this.myMaterial().canvas_settings.image
      );
      console.log("separated_image:", separated_image);
      await this.myCanvas().exportDataWithSize("jpeg", 1024, 1024);
    },
    // async testCanvasData() {
    //   let separated_image = await this.myCanvas().exportFileWithSize(
    //     "jpg",
    //     2048,
    //     2048
    //   );
    //   console.log("separated_image:", separated_image);
    //   const timestamp = Date.now().toString();
    //   const a = document.createElement("a");
    //   document.body.append(a);
    //   a.download = `${timestamp}.png`;
    //   a.href = separated_image;
    //   a.click();
    //   a.remove();
    // },
  },
});
</script>

<style scoped>
@import "../assets/layout.css";

.mask-btn {
  @apply flex flex-wrap items-center justify-center;
}

.operate-tabs {
  font-weight: bold;
}
.operate-tab {
  @apply cursor-pointer flex-1 text-center border-b;
  padding: 10px 20px;
  margin-right: -1px;
  margin-bottom: -1px;
  border-color: #dfdfdf;
}

.operate-tab.active {
  border-color: #000;
}
.operate.btn {
  height: 60px;
  border-top: 1px solid #dfdfdf;
}

.operate-title {
  font-weight: bold;
}

.operate input {
  @apply border-solid border-2 rounded-md p-2 w-20;
}
.operate-label {
  height: 100%;
  min-width: 60px;
  text-align: center;
}

.operate-btn {
  @apply inline-block border pl-5 pr-5 pt-2 pb-2 bg-black text-white rounded-md cursor-pointer mr-5;
}

.operate-btn.unselected {
  @apply inline-block border pl-5 pr-5 pt-2 pb-2 bg-white text-black border-black rounded-md cursor-pointer mr-5;
}

.canvas {
  /* background-color: blueviolet; */
}

.parts {
  position: fixed;
  left: 30px;
  top: 30px;
  width: 80px;
  height: 100%;
  overflow-y: auto;
  z-index: 9;
  font-size: 90%;
}

.part-image {
  width: 58px;
  height: 58px;
  border: 1px solid #000;
  border-radius: 5px;
}

.color-btns {
  @apply flex flex-wrap ml-10 mr-8;
}

.color-btn {
  width: 23px;
  height: 23px;
  margin-right: 2px;
  margin-bottom: 2px;
}

.global-colors {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 40px;
  display: flex;
  flex-wrap: wrap;
  z-index: 12
}
.global-colors .color-btn {
  border-radius: 20px;
  margin-bottom: 5px;
}

@media only screen and (min-width: 1920px) {
  .parts {
    width: 340px;
  }
}
</style>
