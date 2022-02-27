<script>
export default {
  props: {
    entity: Object,
  },
  data() {
    return {
      types: ["parameter", "server", "upstream", "location"],
    };
  },
  methods: {
    close(i) {
      this.$emit("close-entity-form", {});
    },
    save() {
      this.$emit("save-entity-form", { entity: this.entity });
    },
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
    v-if="entity"
    @click="close"
    style="background-color: rgba(255, 255, 255, 0.8)"
  >
    <div class="form-wrapper" @click.stop="">
      <div class="mb-5 font-bold">
        <div class="mb-2">Type</div>
        <div>
          <select class="select w-full max-w-xs select-bordered">
            <option disabled selected></option>
            <option v-for="item in types" :key="item">{{ item }}</option>
          </select>
        </div>
      </div>

      <div class="mb-5 font-bold">
        <div class="mb-2">Name</div>
        <div>
          <input
            type="text"
            class="input input-bordered w-full"
            v-model="entity.name"
          />
        </div>
      </div>
      <div class="mb-5 font-bold">
        <div class="mb-2">Remarks</div>
        <div>
          <textarea
            class="textarea textarea-bordered w-full"
            v-model="entity.remark"
          ></textarea>
        </div>
      </div>
      <div class="mb-5 font-bold">
        <div class="mb-2">Remarks/EN</div>
        <div>
          <textarea
            class="textarea textarea-bordered w-full"
            v-model="entity.remark_en"
          ></textarea>
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