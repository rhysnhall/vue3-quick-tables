<template>
  <tbody>
    <TableBodyRow v-for="(row, index) in preparedRows"
      :key="index"
      :row="row" />
  </tbody>
</template>

<script>
import TableBodyRow from "./TableBodyRow";
export default {
  components: {
    TableBodyRow
  },
  inject: ['columns', 'getProperty'],
  props: {
    rows: Array
  },
  methods: {
    prepareRow(row) {
      // No need to mutate the data.
      if(this.columns.length < 1) {
        return row;
      }
      let columns = [];
      for(let [index, desc] of Object.entries(this.columns)) {
        let data = undefined;
        if(typeof desc === 'object') {
          // Value property is a hardcoded value.
          if(desc.value) {
            data = desc.value;
          }
          // Data property will contain the name of the property from the returned data.
          else if(desc.data) {
            data = this.getProperty(row, desc.data);
          }
          else {
            data = this.getProperty(row, index);
          }
          // Check if a custom render method is defined.
          if(desc.render) {
            data = desc.render({data, row});
          }
          // Add any custom classes to the column.
          if(desc.class) {
            data = {
              value: data,
              class: desc.class
            };
          }
        }
        else {
          data = this.getProperty(row, desc);
        }
        columns = [...columns, (data || {})];
      }
      if (row._uuid) {
        columns._uuid = row._uuid;
      }
      return columns;
    }
  },
  computed: {
    preparedRows() {
      return Object.entries(this.rows).map(([, row]) => {
        if(typeof row !== 'object') {
          return this.prepareRow([row])
        }
        return this.prepareRow(row);
      })
    }
  }
}
</script>
