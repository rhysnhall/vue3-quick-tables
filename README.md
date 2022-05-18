# Vue 3 Quick tables

This package is a WIP. Full readme followed by docs and tests to come.

## Usage

### Loading static data

```js
<template>
  <QuickTables
    :headers="headers"
    :rows="rows"
    />
</template>

<script>
  import QuickTables from './vue-quick-tables';
  export default {
    data() {
      return {
        headers: ['ID', 'Name'],
        rows: [
          ['1', 'Rhys Hall']
        ]
      }
    }
  }
</script>
```

### Loading server data

```js
<template>
  <QuickTables
    :request="request"
    :headers="headers"
    :columns="column"
    :pagination="pagination"
    use-axios // Optional if you prefer axios. JS fetch is used by default.
    />
</template>

<script>
  import QuickTables from './vue-quick-tables';
  export default {
    props: {
      headers: ['ID', 'Name', 'Actions'],
      request: {
        url: API_URL,
        headers: {
          Accept: 'application/json'
        },
        dataKey: 'data'
      },
      columns: {
        {
          data: 'id',
          sort: true
        },
        {
          data: 'name',
          sort: true
        },
        {
          render: function({row}) {
            return `<a href="/users/${row.id}">View</a>`
          }
        }
      },
      // Server-side pagination
      pagination: {
        type: 'numbers',
        map: {
          currentPage: 'meta.current_page',
          lastPage: 'meta.last_page',
          from: 'meta.from',
          to: 'meta.to',
          total: 'meta.total'
        }
      }
    }
  }
</script>
```
