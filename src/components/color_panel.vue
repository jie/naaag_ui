<template>
  <div>
    <div class="color-btns">
      <div
        v-for="(color, index) in material_colors"
        :key="color.code_name"
        @click="setTargetColor(index)"
        :class="{
          selected: index === selectedIndex ? true : false,
          'color-btn': true,
        }"
        :style="{
          'background-color': color.hexcode,
        }"
      ></div>
    </div>
    <div class="color-btns" v-if="selectedIndex !== ''">
      <div
        class="color-btn"
        v-for="(color, index) in color_codes"
        :key="index"
        :style="{
          'background-color': `rgb(${color.value[0]},${color.value[1]},${color.value[2]})`,
        }"
        @click="setColor(index)"
      ></div>
    </div>
  </div>
</template>


<script>
import Color from "@/libs/color";
export default {
  props: {
    color_codes: [],
    material_colors: [],
    colors_map: "",
  },
  data() {
    return {
      selectedIndex: "",
    };
  },
  computed: {
    colorPalette() {
      let current_color_names = [];
      for (let item of this.material_colors) {
        current_color_names.push(item.code_name);
      }
      return this.color_codes
    },
  },
  methods: {
    setColor(index) {
      let origin_color_codes = this.material_colors.map((item) => {
        return item.code_name;
      });

      if(origin_color_codes.includes(this.color_codes[index].name)) {
        return
      }
      
      let color = new Color(
        this.color_codes[index].name,
        this.colors_map[this.color_codes[index].name]
      );
      this.material_colors[this.selectedIndex] = color;
      console.log('material_colors:', this.material_colors)
      let material_color_codes = this.material_colors.map((item) => {
        return item.code_name;
      });
      this.$emit("set_color", {
        material_color_codes: material_color_codes,
      });
      this.selectedIndex = "";
    },

    setTargetColor(index) {
      this.selectedIndex = index;
    },
  },
};
</script>

<style scoped>
.color-btns {
  @apply flex flex-wrap;
}
.color-btn.selected {
  border: 1px solid #000;
}
.color-btn {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  margin-bottom: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  
}
</style>