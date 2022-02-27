<script>
export default {
  props: {
    total_page: Number,
    page: Number,
  },
  data() {
    return {
    };
  },
  methods: {
    onClickPage(i) {
      this.$emit('change-page', {page: i})
    }
  }
};
</script>

<template>
  <div class="btn-group">
    <button class="btn btn-outline">«</button>
    <button
      :class="{ 'btn-outline': true, btn: true, 'btn-active': i == page }"
      v-for="i in total_page"
      :key="i"
      @click="onClickPage(i)"
    >
      {{ i }}
    </button>
    <button class="btn-outline btn">»</button>
  </div>
</template>

<style scoped>
.btn {
  @apply border-2 border-gray-200
}
</style>