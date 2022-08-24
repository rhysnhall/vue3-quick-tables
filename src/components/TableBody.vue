<template>
  <tbody>
    <TableBodyRow v-for="(row, index) in preparedRows"
      :key="index"
      :row="row"
      :class="this.rowClass">
      <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="{...scope}" />
      </template>
    </TableBodyRow>
  </tbody>
</template>

<script>
import TableBodyRow from "./TableBodyRow";
export default {
  name: 'TableBody',
  components: {
    TableBodyRow
  },
  inject: ['columns', 'getProperty'],
  props: {
    rows: Array
  },
  data() {
    return {
      rowClass: false
    }
  },
  methods: {
    prepareRow(row) {
      // No need to mutate the data.
      if(this.columns.length < 1) {
        return row;
      }
      let columns = [];
      for(let [index, desc] of Object.entries(this.columns)) {
        let data = {};
        if(typeof desc === 'object') {
          // Value property is a hardcoded value.
          if(desc.value) {
            data['value'] = desc.value;
          }
          // Data property will contain the name of the property from the returned data.
          else if(desc.data) {
            data['value'] = this.getProperty(row, desc.data);
          }
          else {
            data['value'] = this.getProperty(row, index);
          }
          // Check if a custom render method is defined.
          if(desc.render) {
            data['html'] = desc.render({data: data['value'], row});
          }
          // Add any custom classes to the column.
          if(desc.class) {
            data['class'] = desc.class;
          }
          // Check if there is slot content.
          if(desc.slot) {
            data['slot'] = {
              name: desc.slot,
              bind: row
            };
          }
        }
        else {
          data['value'] = this.getProperty(row, desc);
        }
        columns = [...columns, (data || {})];
      }
      if (row._uuid) {
        columns._uuid = row._uuid;
      }
      if(row.rowClass) {
        this.rowClass = row.rowClass;
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
