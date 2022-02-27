<template>
  <BaseLayout>
    <template #body>
      <p>Site</p>
    </template>
  </BaseLayout>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import BaseLayout from "@/views/BaseLayout.vue";

export default defineComponent({
  setup() {},
  components: {
    BaseLayout,
  },
  data() {
    return;
  },
});
</script>
