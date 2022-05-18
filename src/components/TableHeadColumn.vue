<template>
  <th :class="classNames"
    @click.prevent="sortableCallback">
    <div v-if="isSortable"
      :style="theadWrapperStyle">
      {{columnValue}}
      <span :class="classPrefix+'Sortable'"
        :style="sortableStyle">
        <UpCarret
          :active="!orderDir || orderDir === ascKey" />
        <DownCarret
          :active="!orderDir || orderDir === descKey" />
      </span>
    </div>
    <template v-else>
      {{columnValue}}
    </template>
  </th>
</template>

<script>
import DownCarret from './DownCarret';
import UpCarret from './UpCarret';

export default {
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
    theadWrapperStyle() {
      return {
        'display': 'flex',
        'flex-flow': 'row nowrap',
        'align-items': 'center'
      }
    },
    sortableStyle() {
      return {
        'display': 'flex',
        'flex-direction': 'column',
        'margin-left': '8px'
      }
    }
  }
}
</script>
