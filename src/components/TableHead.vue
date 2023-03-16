<template>
  <thead>
    <tr :class="rowClass">
      <TableHeadColumn v-for="(column, index) in prepareHeaders"
        :key="index"
        :index="index"
        :column="column">
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="{...scope}" />
        </template>
      </TableHeadColumn>
    </tr>
  </thead>
</template>

<script>
import TableHeadColumn from "./TableHeadColumn";
export default {
  name: 'TableHead',
  components: {
    TableHeadColumn
  },
  data() {
    return {
      rowClass: false
    }
  },
  props: {
    headers: {
      type: Array,
      default: () => {[]}
    }
  },
  computed: {
    prepareHeaders() {
      let headers = [];
      for(const[k,i] of Object.entries(this.headers)) {
        let header = i;
        if(typeof i === 'object') {
          if(header?.rowClass) {
            this.rowClass = i?.rowClass;
            continue;
          }
          // Check if there is slot content.
          if(header.slot) {
            let slot = {
              name: header.slot
            };
            if(header.data) {
              slot.bind = header.data;
            }
            header.customSlot = slot;
          }
        }
        headers.push(header);
      }
      return headers;
    }
  }
}
</script>
