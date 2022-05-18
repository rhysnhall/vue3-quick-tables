<template>
  <ul>
    <PaginationItem v-for="(item, index) in items"
      :key="index"
      :active="item.active"
      :disabled="item.disabled"
      :callback="item.callback"
      :label="item.label" />
  </ul>
</template>
<script>
import PaginationItem from './PaginationItem.vue';
export default {
  components: {
    PaginationItem
  },
  props: {
    items: Array
  }
}
</script>
