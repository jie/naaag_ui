<template>
  <BaseLayout>
    <template #body>
      <div class="">
        <div class="section">
          <div class="font-bold text-2xl">{{ entity.name }}</div>
        </div>
        <div class="configs" v-if="entity && entity.configs.length !== 0">
          <div
            class="config"
            v-for="(config, index) in entity.configs"
            :key="index"
          >
            <div class="section border-t relative">
              <div class="section-btn" @click="addConfig(index)">
                Add config
              </div>
            </div>
            <div>
              <div>{{ config.name }}</div>
              <div>{{ config.remark }}</div>
            </div>
          </div>
        </div>
        <div class="section border-t relative">
          <div class="section-btn" @click="addConfig(-1)">Add config</div>
        </div>
        <ConfigForm
          :entity="currentConfig"
          v-on:close-entity-form="onCloseConfigFrom"
          v-on:save-entity-form="onSaveConfigForm"
        />
      </div>
    </template>
  </BaseLayout>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import BaseLayout from "./BaseLayout.vue";
import ConfigForm from "@/components/ConfigForm.vue";
import API from "@/services/http_service";
import { IconPark } from "@icon-park/vue-next/es/all";

export default defineComponent({
  setup() {},
  components: {
    BaseLayout,
    IconPark,
    ConfigForm,
  },
  data() {
    return {
      entity: "",
      currentConfig: "",
    };
  },
  created() {
    this.getEntity();
  },
  methods: {
    async getEntity() {
      let api = new API("/naaag/api/gateway/get");
      let res = await api.request({ uid: this.$route.params.uid });
      if (res.status) {
        this.entity = res.data.entity;
      }
    },
    addConfig(index) {
      console.log(index);
      if (index !== -1) {
        this.currentConfig = this.entity.configs[index];
      } else {
        this.currentConfig = {
          name: "",
          type: "",
          remark: "",
          remark_en: "",
        };
      }
      console.log(this.currentConfig);
    },
    onCloseConfigFrom(e) {
      this.currentConfig = "";
    },
    onSaveConfigForm(e) {
      this.entity.configs.push(e.entity);
      this.currentConfig = ""
    },
  },
});
</script>

<style scoped>
.section {
  margin-bottom: 20px;
}
.section-btn {
  @apply rounded-md bg-white text-black border inline-block pl-2 pr-2 pt-1 pb-1 w-32 -ml-16 text-center absolute left-1/2 -top-3 font-bold text-xs cursor-pointer select-none;
}
</style>