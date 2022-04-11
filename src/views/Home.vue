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
        <div class="ls">
          <div class="parts">
            <div
              class="part relative"
              v-for="(item, index) in materialGroups"
              :key="index"
            >
              <span class="absolute top-0 right-0"
                >{{ item.group_name }} - {{ index + 1 }}</span
              >
              <img
                :src="item.mask_url"
                alt=""
                @click="materialIndex = index"
                style="width: 100%"
              />
            </div>
          </div>
        </div>
        <div class="center">
          <div class="canvas" ref="canvas">
            <div class="operate-btn" @click="useMask">Mask</div>
            <div class="operate-btn" @click="setUndo">undo</div>
            <div class="operate-btn" @click="setRedo">redo</div>
            <div
              v-for="(item, index) in materialGroups"
              :key="index"
              :class="{
                outscreen: index === materialIndex ? false : true,
                'fabric-wrapper': true,
              }"
            >
              {{ materialGroups[materialIndex].group_name }} -
              {{ materialIndex + 1 }}
              <CanvasCom
                :coverIndex="index"
                :canvasId="`myCanvas-${index}`"
                :overlayImage="item.mask_url"
                :canvasWidth="canvasSettings.width"
                :ref="`canvas-com-${index}`"
                :bgColor="bgColor"
                v-on:setImageProperties="setOperateProperties"
                v-on:removeImage="removeImage"
              />
            </div>
            <div
              class=""
              v-if="
                materialGroups[materialIndex] && materialGroups[materialIndex]
              "
            >
              <div
                v-for="item in materialGroups[materialIndex].materials"
                :key="item.name"
              >
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div class="rs">
          <div>
            <div class="mb-5">
              <div class="operate-tabs flex border-b">
                <div class="operate-tab ml-16" @click="changeTab('image')">
                  Image
                </div>
                <div class="operate-tab" @click="changeTab('colour')">
                  Colour
                </div>
              </div>
            </div>
            <div class="p-5">
              <div v-if="operateMaterialStatus === 'image'">
                <div v-if="imageSettings.length !== 0">
                  <div
                    class="image-uploader"
                    v-if="imageSettings[materialIndex].image == ''"
                    @click="onClickAddImage"
                  >
                    <div
                      class="
                        h-48
                        w-full
                        border border-dashed
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <div>click or drag image to upload</div>
                      {{ imageSettings[materialIndex].image }}
                    </div>
                  </div>
                  <div class="operates" v-else>
                    <div class="operate">
                      <div class="operate-title">size</div>
                      <div class="flex">
                        <div class="flex mr-5">
                          <div class="operate-label">w</div>
                          <div>
                            <input
                              class="border"
                              type="text"
                              @change="setWidth"
                              :value="imageSettings[materialIndex].width"
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
                              :value="imageSettings[materialIndex].height"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">position</div>
                      <div class="flex">
                        <div class="flex mr-5">
                          <div class="operate-label">x</div>
                          <div>
                            <input
                              class="border"
                              type="text"
                              @change="setX"
                              :value="imageSettings[materialIndex].x"
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
                              :value="imageSettings[materialIndex].y"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">rotate</div>
                      <div class="flex mr-5">
                        <div class="operate-label">angle</div>
                        <div>
                          <input
                            class="border"
                            type="text"
                            @change="setAngle"
                            :value="imageSettings[materialIndex].angle"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">actual</div>
                      <div class="operate-btn" @click="setActualSize">
                        actual
                      </div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">fill</div>
                      <div class="operate-btn" @click="setFill">fill</div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">align</div>
                      <div class="flex">
                        <div class="operate-btn" @click="setCenterH">
                          horizontal
                        </div>
                        <div class="operate-btn" @click="setCenterV">
                          Vertical
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">flip</div>
                      <div class="flex">
                        <div class="operate-btn" @click="setFlipX">X flip</div>
                        <div class="operate-btn" @click="setFlipY">Y flip</div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">All over</div>
                      <div class="flex">
                        <div class="operate-btn" @click="setAllOver">
                          All over
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">Replace Image</div>
                      <div class="flex">
                        <div class="operate-btn" @click="onClickAddImage">
                          replace
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">3D preview</div>
                      <div class="flex">
                        <div class="operate-btn" @click="preview3d">
                          3D preview
                        </div>
                      </div>
                    </div>

                    <div class="operate">
                      <div class="operate-title">Color count</div>
                      <div class="flex">
                        <div class="operate-selection">
                          <select name="" id="" v-model="colorCount">
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="operate">
                      <div class="operate-title">Color Separation</div>
                      <div class="flex">
                        <div class="operate-btn" @click="setColorSeparation">
                          separation
                        </div>
                      </div>
                    </div>
                    <div class="operate color-panel">
                      <div class="operate-title">Color Separation</div>
                      <div>count: {{ color_count }}</div>
                      <div class="flex" v-if="project && project.separated_colors">
                        {{project.separated_colors}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="operateMaterialStatus === 'colour'">
                <div class="color-btns">
                  <div
                    class="color-btn"
                    v-for="(color, index) in colors"
                    :key="color.value"
                    :style="{ 'background-color': color.value }"
                    @click="setBackgroundColor(index)"
                  ></div>
                </div>
              </div>
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

const exampleMapping = {
  "Right Selve": "/static/material/SELVE-R.png",
  "Left Selve": "/static/material/SELVE-L.png",
  Front: "/static/material/BODY-F.png",
  Back: "/static/material/BODY-B.png",
  Trims: "/static/material/VCOE2100109-S1R2-RIB-B.png",
  HOOD: "/static/material/VCDP2200176-BODY-POCKET-L.png",
};

const exampleImageSetting = {
  width: "",
  height: "",
  x: "",
  y: "",
  angle: "",
  is_transparent: false,
  originWidth: "",
  originHeight: "",
  backgroundColor: 0,
  image: "",
  imageFile: "",
};

export default defineComponent({
  setup() {},
  components: {
    BaseLayout,
    CanvasCom,
  },
  data() {
    return {
      fbxName: "knUP2200069",
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
      colors: [
        {
          name: "black",
          value: "#000000",
        },
        {
          name: "red",
          value: "#e81e25",
        },
        {
          name: "blue",
          value: "#1d6a96",
        },
        {
          name: "green",
          value: "#028c6a",
        },
        {
          name: "yellow",
          value: "#f2dd66",
        },
      ],
      colorCount: 5
    };
  },
  async mounted() {
    if (this.$route.query.fbxName) {
      this.fbxName = this.$route.query.fbxName;
    }
    if (this.$route.query.materialId) {
      this.fabric_id = this.$route.query.materialId;
    }

    await this.searchProject();

    if (this.project_id) {
      await this.generateProject();
    }

    this.$nextTick(async () => {
      console.log("clientWidth:", this.$refs.canvas.clientWidth);
      let width = this.$refs.canvas.clientWidth;
      if (this.$refs.canvas.clientWidth > this.canvasSettings.width) {
        this.canvasSettings = {
          ...this.canvasSettings,
          width: width,
          height: width,
        };
      }
      let canvases = [];
      this.materialGroups.map((item, index) => {
        console.log(this.$refs[`canvas-com-${index}`]);
        this.$refs[`canvas-com-${index}`][0].initCanvas(
          this.canvasSettings.width
        );
        canvases.push(this.$refs[`canvas-com-${index}`][0]);
      });
      this.project.setGroupCanvas(canvases);
    });
  },
  methods: {
    changeTab(status) {
      this.operateMaterialStatus = status;
    },
    onClickAddImage() {
      document.getElementById("btn_file").click();
    },
    async searchProject() {
      let realiboxApiOptions = {
        base_url: import.meta.env.VITE_APP_REALIBOX_HOST,
        appkey: import.meta.env.VITE_APP_REALIBOX_APPKEY,
        secret: import.meta.env.VITE_APP_REALIBOX_SECRET,
      };
      let realibox = new Realibox(realiboxApiOptions);
      let result = await realibox.getProjects({
        q: this.fbxName,
      });
      if (result.data.code === 10000) {
        this.project_id = result.data.list.data[0].id;
        console.log(this.project_id);
      }
      console.log("searchProject:", result);
    },
    async generateProject() {
      let imageSettings = [];
      let project = new Project(this.project_id, [], this.fabric_id);
      await project.getColors();
      await project.getMaterialsFromProject();
      project.getMaterialGroups();
      this.materialGroups = project.material_groups;
      this.materialGroups.map((item, index) => {
        item.mask_url = exampleMapping[item.group_name];
        imageSettings.push({ ...exampleImageSetting });
      });
      this.project = project;
      this.imageSettings = imageSettings;
    },
    myCanvas(i) {
      if (i === undefined) {
        return this.$refs[`canvas-com-${this.materialIndex}`][0];
      } else {
        return this.$refs[`canvas-com-${i}`][0];
      }
    },
    curSettings() {
      return this.imageSettings[this.materialIndex];
    },
    async onUploadFileChange(e) {
      let imgURL = window.URL.createObjectURL(e.target.files[0]);
      let extname = getExtName(e.target.files[0].name);
      let image = new Image();
      image.src = imgURL;
      image.onload = async () => {
        console.log("currentSettings:", this.curSettings());
        var curSetting = this.curSettings();
        curSetting.originWidth = image.width;
        curSetting.originHeight = image.height;
      };
      this.upload_images.push({
        canvas: `canvas-com-${this.materialIndex}`,
        imgFile: imgURL,
      });
      this.myCanvas().onUploadFileChange(imgURL);
      this.imageSettings[this.materialIndex].image = imgURL;
      this.imageSettings[this.materialIndex].imageFile = e.target.files[0];
      document.getElementById("btn_file").value = "";
      console.log("imageURL:", this.imageSettings[this.materialIndex].image);
    },
    setOperateProperties(e) {
      console.log(e);
      this.imageSettings[this.materialIndex] = {
        ...this.imageSettings[this.materialIndex],
        ...e,
      };
    },
    setWidth(e) {
      console.log(e);
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
      this.imageSettings[index].backgroundColor = index;
      this.myCanvas().addBackgroundColor(this.colors[index].value);
    },
    setAllOver() {
      if (!this.curSettings().image) {
        return;
      }
      this.materialGroups.map((item, index) => {
        if (index !== this.materialIndex) {
          this.$refs[`canvas-com-${index}`][0].onUploadFileChange(
            this.curSettings().image
          );
          this.imageSettings[index] = this.curSettings().image;
        }
      });
    },
    generateMaterialsImage() {
      this.materialGroups[this.materialIndex].uploadImage();
    },
    async preview3d() {
      // await this.project.uploadImages();
      await this.project.preview3d();
    },
    onColorCountChange(e) {
      console.log(e);
    },
    async setColorSeparation() {
      await this.materialGroups[this.materialIndex].uploadImage(
        this.colorCount
      );
      console.log('project.separated_colors:', this.project.separated_colors)
      // this.$forceUpdate()
    },
  },
});
</script>

<style scoped>
@import "../assets/layout.css";

.operate-tab {
  @apply border cursor-pointer;
  padding: 10px 20px;
  margin-right: -1px;
}
.operate {
  margin-bottom: 20px;
}

.operate-title {
  font-size: 120%;
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
.canvas {
  /* background-color: blueviolet; */
}

.parts {
  position: fixed;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
  overflow-y: auto;
}

.color-btns {
  @apply flex;
}

.color-btn {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  margin-bottom: 12px;
}

@media only screen and (min-width: 1920px) {
  .parts {
    width: 340px;
  }
}
</style>
