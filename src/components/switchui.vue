<script>
export default {
  props: {
    modelValue: {
      type: [Number, String, Boolean],
    },
    width: {
      //switch 的宽度（像素）
      type: String,
      default: "40px",
    },
    trueValue: {
      //switch 打开时的值
      type: [Number, String, Boolean],
      default: true,
    },
    falseValue: {
      //	switch 关闭时的值
      type: [Number, String, Boolean],
      default: false,
    },
    activeColor: {
      //switch 打开时的背景色
      type: [String],
      default: "#000",
    },
  },
  computed: {
    checked() {
      return this.modelValue === this.trueValue;
    },
  },
  methods: {
    handleInput() {
      console.log(this.$refs.input.checked);
      const val = this.$refs.input.checked;
      this.$emit("update:modelValue", val);
      this.$emit("change", val);
    },
  },
};
</script>


<template>
  <div class="d-switch" :class="{ 'is-checked': checked }">
    <input
      class="d-switch__input"
      ref="input"
      type="checkbox"
      :checked="checked"
      @change="handleInput"
      :true-value="trueValue"
      :false-value="falseValue"
    />
    <span class="d-switch_action"></span>
  </div>
</template>

<style scoped lang="less">
.d-switch {
  position: relative;
  height: 20px;
  transition: background 0.2s;
  width: 40px;
  background: #fff;
  border: 1px solid #000;
  box-sizing: border-box;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  .d-switch__input {
    position: relative;
    z-index: 1;
    margin: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .d-switch_action {
    position: absolute;
    transition: 0.2s;
    left: 2px;
    top: 2px;
    z-index: 0;
    height: 14px;
    width: 14px;
    background: #000;
    border-radius: 50%;
  }
  &.is-checked {
    background: #000;
    .d-switch_action {
      left: 100%;
      background: #fff;
      margin-left: -18px;
    }
  }
}
</style>