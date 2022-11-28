<template>
  <td v-if="html"
    :class="class"
    v-html="html"></td>
  <td v-else
    :class="class">
    <template v-if="slot">
      <slot :name="slot?.name" v-bind="slot?.bind"></slot>
    </template>
    <template v-else>
      {{value}}
    </template>
  </td>
</template>

<script>

export default {
  name: 'TableRowColumn',
  props: ['column'],
  computed: {
    html() {
      return this.column?.html;
    },
    class() {
      return this.column?.class;
    },
    slot() {
      return this.column?.slot;
    },
    value() {
      if(this.column?.value !== null && this.column?.value !== undefined) {
        return this.column?.value;
      }
      return this.column;
    }
  }
}
</script>