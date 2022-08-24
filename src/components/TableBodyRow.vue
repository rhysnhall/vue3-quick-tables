<template>
  <tr @[mayDragStart]="startDragEvent(row._uuid)"
    @[mayDrag]="drag($event)"
    @[mayDragStop]="endDragEvent()"
    :uuid="row._uuid"
    :class="[row.dragClass, row.rowClass]"
    :draggable="dragEnabled">
    <template v-for="(column, index) in row"
      :key="index">
      <TableRowColumn :column="column">
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="{...scope}" />
        </template>
      </TableRowColumn>
    </template>
  </tr>
</template>

<script>
import TableRowColumn from "./TableRowColumn";
export default {
  name: 'TableBodyRow',
  components: {
    TableRowColumn
  },
  props: {
    row: [Array, Object]
  },
  inject: ['draggableRows'],
  methods: {
    startDragEvent(id) {
      this.draggableRows().setActive(id);
    },
    drag(event) {
      this.draggableRows().drag(event);
    },
    endDragEvent(id) {
      this.draggableRows().drop();
    }
  },
  computed: {
    dragEnabled() {
      return !!this.draggableRows();
    },
    mayDragStart() {
      return this.dragEnabled ? 'dragstart' : null;
    },
    mayDrag() {
      return this.dragEnabled ? 'drag' : null;
    },
    mayDragStop() {
      return this.dragEnabled ? 'dragend' : null
    }
  }
}
</script>
