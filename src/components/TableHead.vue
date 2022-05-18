<template>
  <thead>
    <tr>
      <TableHeadColumn v-for="(column, index) in headers"
        :key="index"
        :index="index"
        :column="column" />
    </tr>
  </thead>
</template>

<script>
import TableHeadColumn from "./TableHeadColumn";
export default {
  inject: ['columns'],
  components: {
    TableHeadColumn
  },
  props: {
    headers: {
      type: Array
    }
  }
}
</script>
