<template>
  <div class='simple-view'>
    <file-viewer :url="url" />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute();
const url = ref('')

onMounted(() => {
  url.value = route.query.url || 'https://flyfish.dev/%E6%95%B0%E6%8D%AE%E4%B8%AD%E5%8F%B0%E7%AC%94%E8%AE%B0(1).docx';
})
</script>
<style scoped>
.simple-view {
  height: 100vh;
}
</style>