<template>
  <div
    class="dialog w-full h-full overflow-hidden fixed top-0 left-0"
    :style="{
      width: `${coverSize[0]}px`,
      'margin-left': `-${coverSize[0] / 2}px`,
    }"
    v-if="isShowDialog"
    @click="onClickDialogLayer"
  >
    <ColorDialog
      ref="colorDialog"
      :selections="colors"
      v-on:colorChanged="colorChanged"
    />
    <div
      class="
        dialog-inner
        border-black border-2
        animate__animated animate__slideInUp animate__faster
      "
      @click.stop="
        (e) => {
          e.preventDefault();
        }
      "
    >
      <div class="h-full overflow-y-auto p-5">
        <div class="w-full h-7 flex justify-between text-sm">
          <div
            class="
              cursor-pointer
              pr-2
              pl-2
              bg-cobalt-graylight
              hover:bg-cobaltorange
              hover:text-white
              text-cobalt-gray
              leading-7
              text-center
              rounded-sm
            "
            @click="onCancel"
          >
            {{ $t("base.cancel") }}
          </div>
          <div
            class="
              cursor-pointer
              pr-2
              pl-2
              bg-black
              hover:bg-cobaltorange
              text-cobalt-graylight
              leading-7
              text-center
              rounded-sm
            "
            @click="onConfirm"
          >
            {{ $t("base.confirm") }}
          </div>
        </div>
        <div class="p-2">
          <div class="p-2 text-left">{{ $t("home.text") }}</div>
          <textarea
            class="p-2 w-full border-2 flex-1 border-cobalt-black"
            v-model="customText"
            type="text"
            :style="{
              'font-family': fonts[fontIndex].name_cn,
              color: colors[colorIndex].value,
              'background-color':
                colors[colorIndex].value === 'rgb(255,255,255)'
                  ? '#f9f9f9'
                  : '#fff',
            }"
          />
        </div>
        <div class="p-2">
          <div class="p-2 text-left">{{ $t("home.font") }}</div>
          <div class="grid grid-cols-3 gap-4 flex-1">
            <div
              :class="{
                'item-btn': true,
                selected: index === fontIndex,
                ellipsis: true,
              }"
              v-for="(item, index) in fonts"
              :key="item.value"
              @click="onChooseFont(index)"
              :style="{ 'font-family': item.name_cn }"
            >
              {{ item.name_cn }}
            </div>
          </div>
        </div>
        <div class="p-2">
          <div class="p-2 text-left">{{ $t("home.font_size") }}</div>
          <div class="grid grid-cols-3 gap-4 flex-1">
            <div
              :class="{ 'item-btn': true, selected: index === sizeIndex }"
              v-for="(item, index) in sizes"
              :key="item.value"
              @click="onChooseSize(index)"
              :style="{ 'font-family': `'${item.value}'` }"
            >
              {{ $i18n.locale == "en" ? item.name : item.name_cn }}
            </div>
          </div>
        </div>
        <div class="p-2">
          <div class="p-2 text-left">{{ $t("home.color") }}</div>
          <div class="grid grid-cols-3 gap-4 flex-1">
            <div
              :class="{ 'item-btn': true, selected: true }"
              @click="onChooseColor"
            >
              {{
                $i18n.locale == "en"
                  ? colors[colorIndex].name
                  : colors[colorIndex].name_cn
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ColorDialog from "@/components/color_picker";
export default {
  props: {
    fonts: {
      type: Array,
      default: () => {
        return [];
      },
    },
    colors: {
      type: Array,
      default: () => {
        return [];
      },
    },
    sizes: {
      type: Array,
      default: () => {
        return [];
      },
    },
    coverSize: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultFontIndex: {
      type: Number,
      default: () => {
        return 0;
      },
    },
    defaultColorIndex: {
      type: Number,
      default: () => {
        return 0;
      },
    },
    defaultSizeIndex: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
  components: {
    ColorDialog,
  },
  created() {
    this.fontIndex = this.defaultFontIndex;
    this.colorIndex = this.colors.length - 1;
    this.sizeIndex = this.defaultSizeIndex;
    this.customText = "";
  },
  data() {
    return {
      fontIndex: 0,
      colorIndex: 0,
      sizeIndex: 0,
      isShowDialog: false,
      customText: "",
    };
  },
  methods: {
    onChooseFont(index) {
      this.fontIndex = index;
    },
    onChooseColor(index) {
      this.$refs.colorDialog.openDialog();
    },
    onChooseSize(index) {
      this.sizeIndex = index;
    },
    onClickDialogLayer(e) {
      this.isShowDialog = false;
      e.preventDefault();
    },
    onClickDialogInner(e) {
      e.preventDefault();
    },
    openDialog() {
      this.isShowDialog = true;
    },
    onConfirm() {
      console.log("customText:", this.customText);
      this.$emit("textChanged", {
        font: this.fontIndex,
        color: this.colorIndex,
        text: this.customText,
        size: this.sizeIndex,
      });
      this.isShowDialog = false;
      return {};
    },
    onCancel() {
      this.isShowDialog = false;
    },
    colorChanged(e) {
      this.colorIndex = e.index;
    },
  },
};
</script>

<style scoped>
@import "../../assets/style.css";
.dialog {
  top: 0;
  left: 0;
  z-index: 10;
}

.dialog-inner {
  background-color: white;
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  max-height: 80%;
  overflow-y: auto;
}
.tool-btn {
  @apply p-2 m-auto flex items-center justify-center;
  width: 100%;
}

.item-btn {
  @apply leading-10 bg-black hover:bg-cobaltorange pl-2 pr-2 text-white cursor-pointer font-bold;
}

.item-btn.selected {
  @apply leading-10 bg-cobaltorange text-white;
}
</style>