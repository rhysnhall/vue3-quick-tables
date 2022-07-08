<template>
  <tr @[mayDragStart]="startDragEvent(row._uuid)"
    @[mayDrag]="drag($event)"
    @[mayDragStop]="endDragEvent()"
    :uuid="row._uuid"
    :class="row.dragClass"
    :draggable="dragEnabled">
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
  inject: ['draggableRows'],
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
    },
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
