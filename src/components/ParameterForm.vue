<script>
export default {
  props: {
    parameter: Object,
  },
  data() {
    return {
      isShowNewOption: false,
      targetOptionIndex: "",
      newOption: {
        remark: "",
        remark_en: "",
        value: "",
        variables: [],
      },
      isShowNewVariable: false,
      targetVariableIndex: "",
      newVariable: ""
    };
  },
  methods: {
    close(i) {
      this.targetOptionIndex = ""
      this.targetVariableIndex = ""
      this.$emit("close-parameter-form", {});
    },
    save() {
      this.$emit("save-parameter-form", { parameter: this.parameter });
    },
    chooseTargetOptionIndex(index) {
      console.log("index:", index);
      // this.isShowNewOption = true
      this.targetOptionIndex = index;
      this.isShowNewOption = false;
    },
    toggleNewOption() {
      this.isShowNewOption = !this.isShowNewOption;
      this.targetOptionIndex = "";
      this.newOption = {
        remark: "",
        remark_en: "",
        value: "",
        variables: []
      };
      this.targetVariableIndex = "";
    },
    chooseTargetVariableIndex(index) {
      this.targetVariableIndex = index;
    },
    addNewOption() {
      this.parameter.options.push({ ...this.newOption });
      this.newOption = {
        remark: "",
        remark_en: "",
        value: "",
        variables: []
      };
    },
    removeOption(index) {
      this.parameter.options.splice(index, 1)
      this.targetOptionIndex = ""
    },
    addVariable() {
      if(this.newVariable!=='') {
        this.parameter.options[this.targetOptionIndex].variables.push({
          key: this.newVariable
        })
        this.newVariable = ''
        this.isShowNewVariable = false
      }
    },
    removeVariable(index) {
      this.parameter.options[this.targetOptionIndex].variables.splice(index, 1)
      this.targetVariableIndex = ""
    }
  },
};
</script>
 
<template>
  <div
    class="
      fixed
      top-0
      left-0
      w-full
      h-full
      overflow-hidden
      flex
      justify-center
      items-center
      z-20
    "
    v-if="parameter"
    @click="close"
    style="background-color: rgba(255, 255, 255, 0.8)"
  >
    <div class="form-wrapper" @click.stop="">
      <div class="mb-5 font-bold">
        <div class="mb-2">Key</div>
        <div>
          <input
            type="text"
            class="input input-bordered w-full"
            v-model="parameter.key"
          />
        </div>
      </div>

      <div class="mb-5 font-bold">
        <div class="mb-2">Type</div>
        <div>
          <input
            type="text"
            class="input input-bordered w-full"
            v-model="parameter.type"
          />
        </div>
      </div>
      <div class="mb-5 font-bold">
        <div class="mb-2">Options</div>
        <div class="flex flex-wrap">
          <button
            class="option btn btn-sm btn-outline ellipsis"
            v-for="(option, index) in parameter.options"
            :key="option.value"
            @click="chooseTargetOptionIndex(index)"
          >
            {{ option.value }}
          </button>
          <button
            class="option btn btn-sm btn-primary"
            @click="toggleNewOption"
          >
            New option
          </button>
        </div>
        <div class="border-t pt-2" v-if="targetOptionIndex !== ''">
          <label class="input-group input-group-sm">
            <input
              type="text"
              class="input input-bordered input-sm w-full"
              v-model="parameter.options[targetOptionIndex].value"
            />
            <span @click="removeOption(targetOptionIndex)">Remove</span>
          </label>
          <div
            class="ml-10 mt-2"
            v-if="
              parameter.options[targetOptionIndex].variables &&
              parameter.options[targetOptionIndex].variables.length !== 0
            "
          >
            <div class="text-sm font-normal">Variables</div>
            <div class="flex flex-wrap">
              <button
                class="option btn btn-xs btn-outline ellipsis"
                v-for="(item, variableIndex) in parameter.options[
                  targetOptionIndex
                ].variables"
                :key="item"
                @click="chooseTargetVariableIndex(variableIndex)"
              >
                {{ item.key }}
              </button>
              <button
                class="option btn btn-xs btn-primary"
                @click="isShowNewVariable = !isShowNewVariable"
              >
                New variable
              </button>
            </div>
            <div class="border-t pt-2" v-if="targetVariableIndex !== ''">
              <label class="input-group input-group-xs">
                <input
                  type="text"
                  class="input input-bordered input-xs w-full"
                  v-model="
                    parameter.options[targetOptionIndex].variables[
                      targetVariableIndex
                    ].key
                  "
                />
                <span @click="removeVariable(targetVariableIndex)">Remove</span>
              </label>
            </div>
            <div class="border-t pt-2 mt-2" v-if="isShowNewVariable">
              <label class="input-group input-group-xs">
                <input
                  type="text"
                  class="input input-bordered input-xs w-full"
                  v-model="newVariable"
                />
                <span class="w-36" @click="addVariable">New variable</span>
              </label>
            </div>
          </div>
        </div>
        <div class="border-t pt-2" v-if="isShowNewOption">
          <label class="input-group input-group-sm">
            <input
              type="text"
              class="input input-bordered input-sm w-full"
              v-model="newOption.value"
            />
            <span class="w-32" @click="addNewOption">Add option</span>
          </label>
        </div>
      </div>
      <div class="mb-5 font-bold">
        <div class="mb-2">Default</div>
        <div>
          <input
            type="text"
            class="input input-bordered w-full"
            v-model="parameter.default"
          />
        </div>
      </div>
      <div class="mb-5 font-bold">
        <div class="mb-2">Category</div>
        <div>
          <input
            type="text"
            class="input input-bordered w-full"
            v-model="parameter.category"
          />
        </div>
      </div>
      <div class="mb-5 font-bold">
        <div class="mb-2">Is multiple</div>
        <div>
          <input
            type="checkbox"
            :checked="parameter.multiple === true ? true : false"
            v-model="parameter.multiple"
            class="checkbox"
          />
        </div>
      </div>
      <div class="mb-5 font-bold">
        <div class="mb-2">Remarks</div>
        <div>
          <textarea class="textarea textarea-bordered w-full" v-model="parameter.remark"></textarea>
        </div>
      </div>
      <div class="mb-5 font-bold">
        <div class="mb-2">Remarks/EN</div>
        <div>
          <textarea class="textarea textarea-bordered w-full" v-model="parameter.remark_en"></textarea>
        </div>
      </div>

      <div class="mb-5 font-bold">
        <div class="btn btn-primary" @click="save">Save</div>
        <div class="btn btn-danger float-right" @click="close">Close</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.form-wrapper {
  @apply bg-white border-2 border-gray-300 p-10 rounded-xl lg:w-4/6 shadow-lg overflow-y-auto;
  min-width: 420px;
  max-width: 800px;
  max-height: 90%;
}
.option {
  @apply pl-2 pr-2 mr-2 mb-2;
  max-width: 240px;
  border: 1px solid #ddd;
}
</style>