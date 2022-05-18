<script>
import { defineComponent } from 'vue';
import QuickTables from '@/quick-tables.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    QuickTables
  }
});
</script>

<template>
  <div id="app">
    <quick-tables />
  </div>
</template>
