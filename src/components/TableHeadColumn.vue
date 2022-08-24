<template>
  <th :class="classNames"
    @click.prevent="sortableCallback">
    <template v-if="slot">
      <slot :name="slot"></slot>
    </template>
    <template v-else-if="isSortable">
      <span>{{columnValue}}</span>
      <span :class="classPrefix+'Sortable'"
        :style="sortableStyle">
        <UpCarret
          :active="!orderDir || orderDir === ascKey" />
        <DownCarret
          :active="!orderDir || orderDir === descKey" />
      </span>
    </template>
    <template v-else>
      {{columnValue}}
    </template>
  </th>
</template>

<script>
import DownCarret from './DownCarret';
import UpCarret from './UpCarret';

export default {
  name: 'TableHeadColumn',
  components: {
    UpCarret,
    DownCarret
  },
  inject: ['columns', 'columnKeys', 'setOrder', 'reload', 'sortConfig', 'classPrefix'],
  data() {
    return {
      orderDir: false,
      ascKey: this.sortConfig.ascKey,
      descKey: this.sortConfig.descKey
    }
  },
  props: {
    column: [String,Object],
    index: Number
  },
  methods: {
    sortColumn: function() {
      let key = this.isSortable;
      this.setOrder(key, this.nextOrderDir);
      this.reload();
      // Swap the order direction.
      this.orderDir = this.nextOrderDir;
    }
  },
  computed: {
    classNames() {
      if(typeof this.column === 'object') {
        if(this.column.class !== undefined) {
          return this.column.class;
        }
      }
      return false;
    },
    columnValue() {
      if(typeof this.column === 'object') {
        return this.column.value;
      }
      return this.column;
    },
    slot() {
      if(typeof this.column === 'object') {
        return this.column?.slot;
      }
      return false;
    },
    nextOrderDir() {
      return this.orderDir === this.ascKey
        ? this.descKey : this.ascKey;
    },
    sortableCallback() {
      return this.isSortable
        ? this.sortColumn
        : () => {}
    },
    isSortable() {
      let sortKey = this.column?.sort
        || this.columns[this.index]?.sort;
      // If the sort key is specified by set to true then get the column name from the data key or direct value.
      if(sortKey === true) {
        sortKey = this.columns[this.index]?.data || this.columns[this.index];
      }
      if(!sortKey || typeof sortKey === 'object') {
        return false;
      }
      return sortKey;
    },
    sortableStyle() {
      return {
        'display': 'inline-grid',
        'margin-left': '8px',
        'vertical-align': 'middle'
      }
    }
  }
}
</script>
