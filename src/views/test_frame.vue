<template>
  <div style="height: 100vh; overflow-y: hidden">
    <div style="height: 72px; border-bottom: 1px solid #000"></div>
    <iframe
      :src="`/?silhouette_id=${silhouette_id }`"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>



<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  setup() {},
  data() {
    return {
      silhouette_id: "",
    };
  },
  async mounted() {
      this.silhouette_id = this.$route.query.silhouette_id
  },
});
</script>
