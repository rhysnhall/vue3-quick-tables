<template>
  <tr>
    <td v-for="(column, index) in row"
      :key="index"
      :class="getClassNames(column)"
      v-html="formatColumnValue(column)"></td>
  </tr>
</template>

<script>
export default {
  props: {
    row: [Array, Object]
  },
  methods: {
    formatColumnValue: function(column) {
      if(typeof column === 'object') {
        return column.value;
      }
      return column;
    },
    getClassNames: function(column) {
      if(typeof column === 'object') {
        if(column.class !== undefined) {
          return column.class;
        }
      }
      return false;
    }
  }
}
</script>
