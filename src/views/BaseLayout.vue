<template>
  <div>
    <div class="w-full h-16">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<style scoped>
.body {
  min-height: calc(100vh - 64px);
}

</style>