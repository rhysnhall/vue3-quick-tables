<script>
import { defineComponent } from 'vue';
import QuickTables from '@/quick-tables.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    QuickTables
  },
  data() {
    return {
      headers: ['ID', 'Name'],
      rows: [
        ['1', 'Test User']
      ]
    }
  }
});
</script>

<template>
  <div id="app">
    <quick-tables
      :headers="headers"
      :rows="rows" />
  </div>
</template>

<style>
@import '../src/assets/DefaultTheme.css';
</style>
