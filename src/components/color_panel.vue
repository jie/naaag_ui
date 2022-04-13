<template>
  <div>
    <div class="color-btns separated_codes">
      <div
        v-for="(colorName, index) in separated_codes"
        :key="colorName"
        @click="setTargetColor(index)"
        :class="{
          selected: index === selectedIndex ? true : false,
          'color-btn': true,
        }"
        :style="{
          'background-color': `rgb(${colors[colorName][0]},${colors[colorName][1]},${colors[colorName][2]})`,
        }"
      ></div>
    </div>
    <div class="color-btns" v-if="selectedIndex !== '' && color_codes">
      <div
        class="color-btn"
        v-for="(color, index) in currentColors"
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
export default {
  data() {
    return {
      color_codes: [],
      separated_codes: [],
      colors: [],
      selectedIndex: "",
      changed_codes: [],
    };
  },
  computed: {
    currentColors() {
      return this.color_codes.filter((item) => {
        return !this.separated_codes.includes(item.name)

      })
    }
  },
  methods: {
    initColors(separated_codes, color_codes, colors, changed_codes) {
      this.color_codes = color_codes;
      this.origin_codes = [...separated_codes];
      this.colors = colors;
      if (changed_codes) {
        this.separated_codes = [...changed_codes];
      } else {
        this.separated_codes = [...separated_codes];
      }
    },
    setColor(index) {
      this.separated_codes[this.selectedIndex] = this.currentColors[index].name;
      let color_codes_obj = {};
      this.origin_codes.map((item, i) => {
        color_codes_obj[item] = this.separated_codes[i];
      });
      this.$emit("set_color", {
        separated_codes: this.separated_codes,
        color_codes_obj: color_codes_obj,
      });
      this.selectedIndex = "";
    },
    setTargetColor(index) {
      console.log("index:", index);
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
}
</style>