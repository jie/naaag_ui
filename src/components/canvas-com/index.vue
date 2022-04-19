<template>
  <div
    class="relative ml-5"
    :style="{
      width: `${canvasWidth}px`,
      height: `${canvasWidth}px`,
    }"
  >
    <div
      id="canvasLoading"
      class="canvasLoading"
      v-if="isLoading"
      :style="{
        width: `${canvasWidth}px`,
        height: `${canvasWidth}px`,
      }"
    >
      <div class="load8">
        <div class="loader" style="color: #ddd">Loading...</div>
      </div>
    </div>
    <canvas
      type="2d"
      :id="canvasId"
      :height="canvasWidth"
      :width="canvasWidth"
    ></canvas>
  </div>
</template>

<script>
import { rgb2hex } from "@/utils/image_tools";
import moment from "moment";
import uuid from "@/utils/uuid";
import { fabric } from "fabric";
import OperationHistory from "./operation_history";
import { markRaw } from "vue";
import { deleteIcon } from "./icons";
// user image will scale to 1/3 of canvas size
const UserUploadImageSizeCoe = 0.3;

function formatImageSize(
  width,
  height,
  screenWidth = 600,
  maxWidth = null,
  maxHeight = null,
  canvasPadding = 0
) {
  if (maxWidth === null) {
    maxWidth = screenWidth / 2 - 2 * canvasPadding;
  }
  if (maxHeight === null) {
    maxHeight = screenWidth / 2 - 2 * canvasPadding;
  }

  if (width > height) {
    if (width > maxWidth) {
      return [maxWidth, (maxWidth * height) / width];
    } else {
      return [width, height];
    }
  } else {
    if (height > maxHeight) {
      return [(width / height) * maxHeight, maxHeight];
    } else {
      return [width, height];
    }
  }
}

function renderIcon(icon) {
  return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}

function deleteObject(eventData, transform) {
  var target = transform.target;
  var canvas = target.canvas;
  canvas.remove(target);
  canvas.requestRenderAll();
}

export default {
  name: "fabricCanvas",
  components: {},
  props: {
    graph: {
      type: Object,
      value: {},
    },
    customizeColor: {
      type: Object,
      value: {},
    },
    signatureFontStyle: {
      type: Object,
      value: {},
    },
    signatureFontSize: {
      type: Object,
      value: {},
    },
    overlayImage: {
      type: String,
      value: "",
    },
    settings: {
      type: Object,
      value: {},
    },
    colorCount: {
      type: Object,
    },
    canvasWidth: {
      type: Number,
    },
    canvasId: {
      type: String,
    },
    coverIndex: {
      type: Number,
    },
    bgColor: {
      type: String,
      default: () => {
        return "#ffffff";
      },
    },
  },
  data() {
    return {
      coverSize: "",
      ctx: "",
      mainCanvas: "",
      history: [],
      operate: "do",
      canvasIndex: 0,
      canvases: [],
      color_count: 5,
      originCanvasData: [],
      operation_history: "",
      imageDataUrlMapping: {},
      isLoading: false,
      isMaskTransparent: false,
      imageCoe: "",
      // current upload image object, only one on on canvas
      imageObject: "",
      imageCoe: "",
    };
  },
  mounted() {
    this.operation_history = new OperationHistory();
    this.coverSize = [this.canvasWidth, this.canvasWidth];
  },
  methods: {
    initCanvas(width) {
      this.coverSize[(width, width)];
      var deleteImg = new Image();
      deleteImg.src = deleteIcon;

      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = "blue";
      fabric.Object.prototype.cornerStyle = "circle";

      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: 16,
        cursorStyle: "pointer",
        mouseUpHandler: deleteObject,
        render: renderIcon(deleteImg),
        cornerSize: 24,
      });

      fabric.Textbox.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: 16,
        cursorStyle: "pointer",
        mouseUpHandler: deleteObject,
        render: renderIcon(deleteImg),
        cornerSize: 24,
      });

      this.$nextTick(() => {
        var canvas = markRaw(new fabric.Canvas(this.canvasId));
        this.canvases.push(canvas);
        var bg = "rgb(0,0,0)";
        // this.addBackgroundColor(rgb2hex(bg));

        this.addOverlayImage(this.overlayImage);

        canvas.on("object:modified", (options) => {
          if (this.operate == "do") {
            this.operation_history.set(JSON.stringify(canvas));
            let t = canvas.getActiveObject();
            this.$emit("setImageProperties", {
              x: t.left,
              y: t.top,
              width: (t.width * t.scaleX).toFixed(2),
              height: (t.height * t.scaleY).toFixed(2),
              scaleX: t.scaleX,
              scaleY: t.scaleY,
              angle: t.angle,
            });
          }
        });
        canvas.on("object:added", (options) => {
          if (this.operate == "do") {
            this.operation_history.set(JSON.stringify(canvas));
          }
        });
        canvas.on("object:removed", (options) => {
          if (this.operate == "do") {
            this.setRemoveImage();
            this.operation_history.set(JSON.stringify(canvas));
          }
        });

        canvas.on("object:scaled", (options) => {});

        canvas.on("selection:created", (options) => {
          let t = canvas.getActiveObject();
          this.$emit("setImageProperties", {
            x: t.left,
            y: t.top,
            width: (t.width * t.scaleX).toFixed(2),
            height: (t.height * t.scaleY).toFixed(2),
            scaleX: t.scaleX,
            scaleY: t.scaleY,
            angle: t.angle,
          });
        });
      });
    },

    currentCanvas() {
      return this.canvases[this.canvasIndex];
    },
    addBackgroundImage(url) {
      this.currentCanvas().setBackgroundImage(url, () => {
        this.currentCanvas().renderAll.bind(this.currentCanvas());
      });
    },
    addBackgroundColor(color) {
      this.currentCanvas().backgroundColor = color;
      this.currentCanvas().renderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    addOverlayImage(url, opacity = 1) {
      var target = this.currentCanvas();
      return new Promise((resolve) => {
        target.setOverlayImage(
          url,
          () => {
            target.overlayImage &&
              target.overlayImage.scaleToWidth(this.canvasWidth);
            target.overlayImage.scaleToHeight(this.canvasWidth);
            target.overlayImage.opacity = opacity;
            target.renderAll();
            this.originCanvasData.push(JSON.stringify(target));
            this.operation_history.set(JSON.stringify(target));
            resolve();
          },
          {
            crossOrigin: "Anonymous",
          }
        );
      });
    },
    removeOverlayImage() {
      var target = this.currentCanvas();
      return new Promise((resolve) => {
        target.overlayImage = null;
        target.renderAll.bind(target);
        resolve();
      });
    },
    addText(textObj = {}) {
      var obj = {
        ...{
          left: 50,
          top: 50,
          width: 150,
          size: 20,
          textAlign: "center",
        },
        ...textObj,
      };

      var textbox = new fabric.Textbox(
        textObj.text || "Lorum ipsum dolor sit amet",
        obj
      );
      this.currentCanvas().add(textbox).setActiveObject(textbox);
    },
    onClickUndo() {
      this.operate = "undo";
      if (this.operation_history.current <= 0) {
        this.operate = "do";
        return;
      }
      var data = this.operation_history.prev();
      if (data) {
        this.currentCanvas().loadFromJSON(JSON.parse(data), () => {
          this.operate = "do";
        });
      } else {
        this.operate = "do";
      }
    },
    onClickRedo() {
      this.operate = "redo";
      if (
        this.operation_history.current >= this.operation_history.queue.length
      ) {
        return;
      }

      if (
        this.operation_history.current === 0 &&
        (this.operation_history.queue.length === 1 ||
          this.operation_history.queue.length === 0)
      ) {
        return;
      }
      var data = this.operation_history.next();
      if (data) {
        this.currentCanvas().loadFromJSON(JSON.parse(data), () => {
          this.operate = "do";
        });
      } else {
        this.operate = "do";
      }
    },
    onClickClear() {
      this.operation_history.clear();
      this.currentCanvas().loadFromJSON(
        JSON.parse(this.originCanvasData[this.canvasIndex]),
        () => {
          this.operate = "do";
        }
      );
    },
    onClickColorCount() {
      this.$refs.colorCountDialog.openDialog();
    },
    onClickBackgroundColor() {
      this.$refs.colorDialog.openDialog();
    },
    onClickAddText() {
      this.$refs.textDialog.openDialog();
    },
    onClickPreview() {
      this.$refs.previewDialog.openDialog();
    },
    async onExportImage(type = "jpeg") {
      await this.removeOverlayImage();
      var image = this.currentCanvas().toDataURL(type);
      // var image = this.currentCanvas().toDataURL({format: type, width: 2048, height: 2048});
      await this.addOverlayImage(this.overlayImage);
      return new Promise((resolve) => {
        resolve(image);
      });
    },

    get_img_width(img) {
      return parseFloat(img.width * img.scaleX).toFixed(2);
    },

    get_img_height(img) {
      return parseFloat(img.height * img.scaleY).toFixed(2);
    },

    async replaceImage(url) {
      const img = this.currentCanvas().getObjects()[0];
      return new Promise(async (resolve, reject) => {
        img.setSrc(url, async (target) => {
          target.setCoords();
          this.currentCanvas().renderAll();
          resolve();
        });
      });
    },

    async onExportFromSeparationImage(url, type = "jpeg") {
      await this.removeOverlayImage();
      const img = this.currentCanvas().getObjects()[0];
      let curSrc = img.getSrc();
      return new Promise(async (resolve, reject) => {
        img.setSrc(url, async (target) => {
          target.setCoords();
          this.currentCanvas().renderAll();
          var image = this.currentCanvas().toDataURL(type);
          await this.replaceImage(curSrc)
          await this.addOverlayImage(this.overlayImage);
          resolve(image);
        });
      });
    },

    async exportDataWithSize(format, width, height) {
      let imgdata = await this.onExportImage(format);
      return new Promise(async (resolve, reject) => {
        var img = document.createElement("img");
        img.setAttribute("crossOrigin",'Anonymous')
        img.onload = function () {
          var tmpCanvas = document.createElement("canvas");
          var tmpCtx = tmpCanvas.getContext("2d");
          tmpCanvas.width = width;
          tmpCanvas.height = height;
          tmpCtx.drawImage(this, 0, 0, width, height);
          var dataURI = tmpCanvas.toDataURL();
          resolve(dataURI);
        };
        img.src = imgdata;
      });
    },
    async exportFileWithSize(format, width, height) {
      let imgdata = await this.onExportImage(format);
      return new Promise(async (resolve, reject) => {
        var img = document.createElement("img");
        img.setAttribute("crossOrigin",'Anonymous')
        img.onload = function () {
          var tmpCanvas = document.createElement("canvas");
          var tmpCtx = tmpCanvas.getContext("2d");
          tmpCanvas.width = width;
          tmpCanvas.height = height;
          tmpCtx.drawImage(this, 0, 0, width, height);
          tmpCanvas.toBlob((blob) => {
            resolve(window.URL.createObjectURL(blob));
          })
        };
        img.src = imgdata;
      });
    },
    onClickAddImage() {
      document.getElementById("btn_file").click();
    },
    async onUploadFileChange(url) {
      fabric.Image.fromURL(
        url,
        (img) => {
          var coe = UserUploadImageSizeCoe;
          console.log("mywidth:", img.width);
          var imageCoe = ((this.canvasWidth * coe) / img.width).toFixed(2);
          this.imageCoe = imageCoe;
          img.scale(imageCoe);
          img.left = this.canvasWidth / 2 - (img.width * imageCoe) / 2;
          img.top = this.canvasWidth / 2 - (img.height * imageCoe) / 2;
          img.padding = 0;
          img.crossOrigin = "Anonymous";
          img.setCoords();
          this.currentCanvas().add(img).setActiveObject(img);
          let t = this.currentCanvas().getActiveObject();
          if (this.imageObject) {
            for (let o of this.currentCanvas().getObjects()) {
              if (this.imageObject.cacheKey === o.cacheKey) {
                this.currentCanvas().remove(o);
                break;
              }
            }
          }
          this.imageObject = t;
          console.log("imageObject:", this.imageObject);
          this.$emit("setImageProperties", {
            x: t.left,
            y: t.top,
            width: (t.width * t.scaleX).toFixed(2),
            height: (t.height * t.scaleY).toFixed(2),
            scaleX: t.scaleX,
            scaleY: t.scaleY,
            angle: t.angle,
          });
        },
        { crossOrigin: "Anonymous" }
      );
    },
    exportData(settings) {
      let data = this.currentCanvas();
      data = JSON.stringify(data);
      data = JSON.parse(data);

      if (settings.userResources) {
        if (data.objects) {
          for (let item of data.objects) {
            for (let ur of settings.userResources) {
              if (ur.blobid === item.src) {
                item.src = ur.url;
                break;
              }
            }
          }
        }
      }
      return JSON.stringify(data);
    },
    loadData(data) {
      this.currentCanvas().loadFromJSON(data, () => {
        this.operation_history.set(JSON.stringify(this.currentCanvas()));
      });
    },
    colorChanged(e) {
      this.addBackgroundColor(e.color.value);
      this.$emit("setBackgroundColorMap", {
        index: this.coverIndex,
        img_uid: e.color.data[1].replace("texture:", ""),
        img_url: e.color.data[0],
      });
    },
    textChanged(e) {
      this.addText({
        text: e.text,
        size: this.signatureFontSize.selection[e.size].value,
        fontFamily: this.signatureFontStyle.selection[e.font].name_cn,
        fill: this.customizeColor.selection[e.color].value,
      });
    },

    setWidth(w) {
      this.currentCanvas().getActiveObject().scaleToWidth(w).setCoords();
      this.currentCanvas().requestRenderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    setHeight(h) {
      this.currentCanvas().getActiveObject().scaleToHeight(h).setCoords();
      this.currentCanvas().requestRenderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    setActualSize(w, h) {
      this.currentCanvas().getActiveObject().scale(1).setCoords();
      this.currentCanvas().requestRenderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },

    getFillFix(o) {
      let obj = this.currentCanvas().getActiveObject();
      if (o.width) {
        return -Math.abs((o.width * obj.scaleX - this.canvasWidth) / 2);
      } else {
        return -Math.abs((o.height * obj.scaleY - this.canvasWidth) / 2);
      }
    },
    setFill() {
      let obj = this.currentCanvas().getActiveObject();
      if (obj.width >= obj.height) {
        obj
          .scaleToHeight(this.canvasWidth)
          .setCoords()
          .set("left", this.getFillFix({ width: obj.width }))
          .set("top", 0)
          .setCoords();
      } else {
        obj
          .scaleToWidth(this.canvasWidth)
          .setCoords()
          .set("left", 0)
          .set("top", this.getFillFix({ height: obj.height }))
          .setCoords();
      }
      this.currentCanvas().requestRenderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    setX(x) {
      this.currentCanvas().getActiveObject().set("left", x).setCoords();
      this.currentCanvas().requestRenderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    setY(y) {
      this.currentCanvas().getActiveObject().set("top", y).setCoords();
      this.currentCanvas().requestRenderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    setAngle(angle) {
      this.currentCanvas().getActiveObject().rotate(angle).setCoords();
      this.currentCanvas().requestRenderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    useMask() {
      if (this.isMaskTransparent === true) {
        this.isMaskTransparent = false;
        this.addOverlayImage(this.overlayImage, 1);
      } else {
        this.isMaskTransparent = true;
        this.addOverlayImage(this.overlayImage, 0.8);
      }
    },
    setFlipX() {
      let currObj = this.currentCanvas().getActiveObject();
      if (currObj.flipX === true) {
        this.currentCanvas().getActiveObject().set("flipX", false).setCoords();
      } else {
        this.currentCanvas().getActiveObject().set("flipX", true).setCoords();
      }
      this.currentCanvas().requestRenderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    setFlipY() {
      let currObj = this.currentCanvas().getActiveObject();
      if (currObj.flipY === true) {
        this.currentCanvas().getActiveObject().set("flipY", false).setCoords();
      } else {
        this.currentCanvas().getActiveObject().set("flipY", true).setCoords();
      }
      this.currentCanvas().requestRenderAll();
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    setCenterH() {
      this.currentCanvas().centerObjectH(
        this.currentCanvas().getActiveObject()
      );
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    setCenterV() {
      this.currentCanvas().centerObjectV(
        this.currentCanvas().getActiveObject()
      );
      this.operation_history.set(JSON.stringify(this.currentCanvas()));
    },
    setRemoveImage() {
      this.$emit("removeImage", {});
    },
  },
};
</script>


<style scoped>
.canvasLoading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: #f1f8ff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}
</style>