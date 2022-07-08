<script>
import TableHead from './components/TableHead';
import TableBody from './components/TableBody';
import PaginationNav from './components/PaginationNav';
import Draggable from './utils/_draggable';
import { defineComponent } from 'vue';

export default /*#__PURE__*/defineComponent({
  name: 'QuickTables', // vue component name
  components: {
    TableHead,
    TableBody,
    PaginationNav
  },
  // Set state data.
  data() {
    return {
      isStatic: !this.request?.url,
      isLoading: false,
      bodyRows: [],
      requestConfig: {
        url: this.request?.url,
        headers: this.request?.headers || {},
        method: this.request?.method || 'GET',
        dataKey: this.request?.dataKey,
        extend: this.request?.extend || {},
        queries: this.request?.queries || {}
      },
      paginationConfig: {
        disabled: true,
        page: this.page,
        pageKey: this.pagination?.pageKey || 'page',
        type: this.pagination?.type || 'simple',
        tabs: this.pagination?.tabs || 4,
        showCount: this.pagination?.showCount === undefined
          ? true
          : this.pagination?.showCount,
        meta: {},
        map: {
          currentPage: this.pagination?.map?.currentPage,
          lastPage: this.pagination?.map?.lastPage,
          from: this.pagination?.map?.from,
          to: this.pagination?.map?.to,
          total: this.pagination?.map?.total
        }
      },
      filterConfig: {
        search: this.filter?.search || false,
        searchKey: this.filter?.searchKey || 'search',
        orderBy: this.filter?.orderBy || false,
        orderDir: this.filter?.orderDir || (this.filter?.map?.asc || 'asc'),
        orderByKey: this.filter?.orderByKey || 'order_by',
        orderDirKey: this.filter?.orderDirKey || 'order_dir',
        limit: this.filter?.limit || 0,
        limitKey: this.filter?.limitKey || 'limit',
        map: {
          asc: this.filter?.map?.asc || 'asc',
          desc: this.filter?.map?.desc || 'desc'
        }
      },
      language: {
        ...{
          loading: 'Fetching new data..',
          noRows: 'No results found.',
          prev: 'Previous',
          next: 'Next',
          first: 'First',
          last: 'Last',
          counter: function({total, to, from}) {
            return `Showing ${from} to ${to} of ${total} entries`
          }
        },
        ...this.messages
      },
      draggableRowsUtil: false
    }
  },

  // Define available props.
  props: {
    rows: {
      type: Array,
      default: () => ([])
    },
    headers: {
      type: Array,
      default: () => ([])
    },
    columns: {
      type: Array,
      default: () => ([])
    },
    request: Object,
    useAxios: Boolean,
    requestOnMount: Boolean,
    filter: Object,
    pagination: Object,
    page: {
      type: Number,
      default: 1
    },
    messages: Object,
    classPrefix: {
      type: String,
      default: 'QuickTables'
    },
    onBuildRows: Function,
    draggableRows: {
      type: [Object, Boolean],
      default: false
    }
  },

  // Provide specific data to children components.
  provide() {
    return {
      columns: this.columns,
      columnKeys: this.columnKeys,
      language: this.language,
      getPage: this.getPage,
      sortConfig: {
        key: this.filterConfig.orderBy,
        dir: this.filterConfig.orderDir,
        ascKey: this.filterConfig.map.asc,
        descKey: this.filterConfig.map.desc
      },
      setOrder: this.setOrder,
      reload: this.loadTable,
      classPrefix: this.classPrefix,
      getProperty: this.getProperty,
      draggableRows: this.getDraggableRowsUtil
    }
  },

  // Validate and load the table on mount.
  mounted() {
    // Enable draggable rows.
    if(this.draggableRows || Object.keys(this.draggableRows).length > 0) {
      this.draggableRowsUtil = new Draggable(this.$refs.quickTable, this.draggableRows);
    }

    this.validatePaginationConfig();
    if(this.isStatic || this.requestOnMount) {
      this.loadTable();
    }
  },

  methods: {
    validatePaginationConfig() {
      this.paginationConfig.disabled = true;
      if(!this.pagination || this.pagination === undefined || Object.keys(this.pagination).length < 1) {
        return;
      }
      let config = this.paginationConfig;
      if(typeof config.pageKey !== 'string') {
        console.error('Pagination page key must be a string.');
        return false;
      }
      if(!['simple', 'numbers', 'full', 'simple_numbers', 'full_numbers', 'first_last_numbers'].includes(config.type)) {
        console.error('Pagination type is invalid. Please refer to the documentation for a full list of valid types.');
        return false;
      }
      if(config.type !== 'simple' && config.type !== 'full') {
        if(typeof config.tabs !== 'number') {
          console.error('Pagination tab amount must be a valid number.');
          return false;
        }
        else if(config.tabs < 0) {
          console.error('Pagination tab amount must be greater than 0 for the selected pagination type.');
          return false;
        }
        // Floor the tab amount to remove floats.
        this.paginationConfig.tabs = Math.floor(config.tabs);
      }
      this.paginationConfig.disabled = false;
    },
    setOrder(orderBy, orderDir = false) {
      if(orderDir) {
        this.filterConfig.orderDir = orderDir;
      }
      this.filterConfig.orderBy = orderBy;
    },
    setSearch(string) {
      this.filterConfig.search = string;
    },
    loadTable() {
      this.isStatic ? this.getStaticData() : this.getData();
    },
    getPage(page) {
      this.paginationConfig.page = page;
      this.loadTable();
    },
    getDraggableRowsUtil() {
      return this.draggableRowsUtil;
    },
    setBodyRows(rows) {
      this.bodyRows = rows;
      if(this.getDraggableRowsUtil()) {
        this.draggableRowsUtil.setTableRows(this.bodyRows);
      }
    },
    getData() {
      this.setBodyRows([]);
      this.isLoading = true;
      this.useAxios
        ? this.axiosRequest()
        : this.fetchRequest();
    },
    getStaticData() {
      let page = this.paginationConfig.page;
      let rows = this.rows;

      if(!rows.length) {
        this.setBodyRows([]);
        return;
      }

      if(this.filterConfig.orderBy) {
        // Check that the first two actually contains the comparable values.
        let firstRow = rows[0];
        if(firstRow[this.filterConfig.orderBy] !== undefined) {
          rows.sort((a, b) => {
            // Sort in ascending order.
            if(this.filterConfig.orderDir === this.filterConfig.map.asc) {
              return a[this.filterConfig.orderBy]
                .localeCompare(b[this.filterConfig.orderBy]);
            }
            // Sort in descending order.
            else if(this.filterConfig.orderDir === this.filterConfig.map.desc) {
              return b[this.filterConfig.orderBy]
                .localeCompare(a[this.filterConfig.orderBy]);
            }
          });
        }
      }

      if(this.filterConfig.limit > 0) {
        let offset = this.filterConfig.limit * (page - 1);
        let totalPages = Math.ceil(rows.length / this.filterConfig.limit);
        rows = rows.slice(offset, this.filterConfig.limit * page);

        this.paginationConfig.meta = {
          currentPage: page,
          lastPage: totalPages,
          from: offset + 1,
          to: this.filterConfig.limit * page,
          total: this.rows.length
        };
      }

      this.setBodyRows(rows);
    },
    getProperty(obj, prop) {
      // Split the prop into an array.
      if(typeof prop !== 'object') {
        prop = prop.toString().split('.');
      }
      obj = obj[prop[0]];
      prop.shift();
      return prop.length > 0
        ? this.getProperty(obj, prop)
        : obj;
    },
    setPaginationMetaData(data) {
      let meta = this.paginationConfig?.map || {};
      this.paginationConfig.meta = {};
      for(let [key, re] of Object.entries(meta)) {
        if(re !== undefined) {
          this.paginationConfig.meta[key] = this.getProperty(data, re);
        }
      }
    },
    handleResponse(data) {
      if(!this.paginationConfig.disabled) {
        this.setPaginationMetaData(data);
      }
      if(typeof data === 'object') {
        // Some endpoints return the data in a key.
        let rows = this.requestConfig.dataKey !== undefined
          ? this.getProperty(data, this.requestConfig.dataKey)
          : data;
        if(this.onBuildRows !== undefined) {
          rows = this.onBuildRows(rows) || [];
        }
        this.setBodyRows(rows || []);
      }
      this.isLoading = false;
    },
    failedResponse() {
      this.setBodyRows([]);
      this.isLoading = false;
    },
    axiosRequest() {
      // Get the request conf.
      let axiosConf = this.requestSetup;
      // Add the url to the conf.
      axiosConf.url = this.requestUrl;
      this.axiosClient(axiosConf)
        .then(response => {
          let data = response.data;
          this.handleResponse(data);
        })
        .catch(error => {
          console.error(error);
          this.failedResponse();
        });
    },
    fetchRequest() {
      let fetchConf = this.requestSetup;
      fetch(this.requestUrl, fetchConf)
        .then(response => {
          if(response.status >= 300 || response.status < 200) {
            throw `Request failed with status code ${response.status}.`;
          }
          // Check if the response needs to be returned as JSON.
          if(fetchConf.headers?.Accept === 'application/json') {
            return response.json();
          }
          return response.text()
        })
        .then(data => {
          this.handleResponse(data);
        })
        .catch(error => {
          console.error(error);
          this.failedResponse();
        });
    }
  },
  computed: {
    axiosClient() {
      let axios = require('axios');
      if(this.requestConfig.headers !== undefined) {
        axios.defaults.headers.common = this.requestConfig.headers;
      }
      return axios;
    },
    requestUrl() {
      return this.requestConfig.url + this.querySetup;
    },
    querySetup() {
      let queries = {};
      if(!this.paginationConfig.disabled) {
        queries[this.paginationConfig.pageKey] = this.paginationConfig.page;
      }
      if(this.filterConfig.limit > 0) {
        queries[this.filterConfig.limitKey] = this.filterConfig.limit;
      }
      if(this.filterConfig.search) {
        queries[this.filterConfig.searchKey] = this.filterConfig.search;
      }
      if(this.filterConfig.orderBy) {
        queries[this.filterConfig.orderByKey] = this.filterConfig.orderBy;
        if(this.filterConfig.orderDirKey) {
          queries[this.filterConfig.orderDirKey] = this.filterConfig.orderDir;
        }
      }
      for(let [key, value] of Object.entries(this.requestConfig.queries)) {
        queries[key] = value;
      }
      if(Object.keys(queries).length < 1) {
        return '';
      }
      return '?' + Object.entries(queries)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    },
    requestSetup() {
      let conf = {};
      conf.method = this.requestConfig.method || 'GET';
      conf.headers = this.requestConfig.headers;
      for(let [key, value] of Object.entries(this.requestConfig.extend)) {
        conf[key] = value;
      }
      return conf;
    },
    columnKeys() {
      let keys = [];
      for(let [, column] of Object.entries(this.columns)) {
        if(typeof column === 'object') {
          // Data property will contain the name of the property from the returned data.
          keys = [...keys, column.data];
        }
        else if(typeof column === 'string') {
          keys = [...keys, column];
        }
        else {
          keys = [...keys, undefined];
        }
      }
      return keys;
    },
    showPaginationCount() {
      if(!this.bodyRows.length) {
        return false;
      }
      return this.paginationConfig.showCount ? true : null;
    }
  },
});
</script>

<template>
  <div :class="classPrefix+' qtw'">
    <div :class="classPrefix+'Container qtc'">
      <table :class="classPrefix+'Table'"
        ref="quickTable">
        <TableHead v-if="headers.length > 0"
          :headers="headers"
          :class="classPrefix+'Thead'" />
        <TableBody v-if="bodyRows.length > 0"
          :rows="bodyRows"
          :class="classPrefix+'Tbody'" />
        <tbody v-if="isLoading"
          :class="classPrefix+'Loading'">
          <tr><td :colspan="headers.length">{{language.loading}}</td></tr>
        </tbody>
        <tbody v-if="!isLoading && bodyRows.length === 0">
          <tr><td :colspan="headers.length">{{language.noRows}}</td></tr>
        </tbody>
      </table>
    </div>
    <PaginationNav v-if="!paginationConfig.disabled"
      :type="paginationConfig.type"
      :meta="paginationConfig.meta"
      :tabs="paginationConfig.tabs"
      :showCount="showPaginationCount"
      :class="classPrefix+'PaginationContainer qtp'" />
  </div>
</template>
