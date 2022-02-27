<template>
  <BaseLayout>
    <template #sidebar>
      <h1>Here might be a page title</h1>
    </template>

    <template #body>
      <p>A paragraph for the main content.</p>
      <p>And another one.</p>
    </template>
  </BaseLayout>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import BaseLayout from "./BaseLayout.vue";

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
