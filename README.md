# Vue 3 QuickTables
QuickTables is a quick table component for Vue 3. This package is still in development. Tests are still to come. Use at your own discretion.

[![npm](https://img.shields.io/npm/v/vue3-quick-tables.svg?color=%236e45e2)](https://www.npmjs.com/package/vue3-quick-tables)

## Installation
### Install via NPM

```
npm install vue3-quick-tables
```

## Usage

#### Global
You can register QuickTables globally:
```js
import { createApp } from 'vue';
import QuickTables from 'vue3-quick-tables';
const app = createApp(App);
app.component('QuickTables', QuickTables);
```

#### Local
Locally install QuickTables by importing the component.
```js
import QuickTables from 'vue3-quick-tables';

export default {
  components: {
    QuickTables
  }
}
```

### Basic Usage

#### Loading static data

The component accepts static data as an **array** via the `rows` property.

```js
<template>
  <QuickTables
    :headers="headers"
    :rows="rows"
    />
</template>

<script>
  import QuickTables from './vue3-quick-tables';
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

#### Loading server data

You can pull data from your backend server using the `request` property.

```js
request: {
  url: {your_API_endpoint}, // The URL to your data endpoint
  headers: {Accept: 'application/json'}, // Request headers
  method: 'GET', // The request method
  dataKey: 'data', // The data key in your response. (i.e. Laravel collections return data in the 'data' key.)
  extend: {withCredentials: true}, // Pass additional properties to FETCH or Axios
  queries: {} // Pass additional query params for the request
}
```

Without the `headers` or `columns` properties every item in the returned data rows will be dumped into the table.

```js
<template>
  <QuickTables
    :request="request"
    />
</template>
```

Use the `columns` property to manage the returned data.
```js
columns: [
  {
    data: 'name', // The data key of the column in each row
    sort: true, // Determines if the column is sortable
    class: 'text-center', // Custom class is applied to the <td> element
    value: false, // Hardcoded column value
  },

  'name', // A string instead of an object acts as a data key. Use this if you don't need any of the above customization
]
```

The `headers` property will set the table headers.
```js
headers: [
  {
    value: 'Name', // The header label
    class: 'text-center', // Custom class is applied to the <th> element
    sort: true // Determines if the column is sortable. This overrides the sort key in the `columns` property
  },
  'Name' // Use a string instead of an object if you don't need the class or sort properties
]
```

##### Custom HTML
You can define a custom callback to manipulate the rendered output as raw HTML. The callback will have access to the column `data` and the entire `row`. The render method is only available to columns and not headers.

```js
columns: [
  {
    data: 'name',
    render: ({data, row}) => `<a href="/item/${row.id}">${data.toUpperCase()}</a>`
  }
]
```

##### Slots
Both columns and headers can parse in custom Vue Slots. For this to work you need to define a slot name using the `slot` property.

```js
import Button from './Button';

columns: [
  {
    slot: 'button'
  }
]

<quick-tables 
  :columns="columns">
  <template #button="{id, name}">
    <Button :item-id="id"
      :item-name="name" />
  </template>
</quick-tables>
```

Your component will have full access to the rows data.

```js
<template #button="row">
  <Button :item-id="row.id" />
</template>
```

This also works for the table headers.

```js
headers: [
  {
    slot: 'item'
  }
]

<quick-tables 
  :headers="headers">
  <template #item>
    <span>Custom header!</span>
  </template>
</quick-table>
```

You can load custom data into the header by adding a `data` property to the header object.

```js
headers: [
  {
    slot: 'item',
    data: {
      title: 'Custom title'
    }
  }
]

<quick-tables 
  :headers="headers">
  <template #item="{title}">
    <span>{{title}}</span>
  </template>
</quick-table>
```

##### Row Classes
You can add a custom class to the table header row using the `rowClass` property in your header setup.

```js
headers: [
  {
    rowClass: 'bg-cool-gray',
  },
  'ID',
  'Name'
]
```

The positioning of the `rowClass` property does not matter as it will not be rendered with the other headers.

Setting a custom class on a body row works a littler differently. You'll need to set a value against the `rowClass` property of each row using the `onBuildRows` callback.

```js
<template>
  <QuickTables
    :onBuildRows="onBuildRowsCallback"
    />
</template>

<script>
  export default {
    data() {
      return {
        onBuildRowsCallback: (rows) => {
          for(const[,i] of Object.entries(rows)) {
            i.rowClass = i.archived ? 'text-muted' : 'text-body';
          }
          return rows;
        }
      }
    }
  }
</script>
```

##### Using Axios
The component uses [JS Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) by default. If you prefer Axios then add the `use-axios` property.

```js
<template>
  <QuickTables
    :request="request"
    use-axios
    />
</template>
```

##### Loading data on mount
By default the component will not fetch any data until it has been told to. The `request-on-mount` property will tell the component to fetch data as soon as it has finished mounting.
```js
<template>
  <QuickTables
    :request="request"
    request-on-mount
    />
</template>
```

#### Pagination
The `pagination` property allows you to enable server-side pagination for your data.
```js
pagination: {
  pageKey: 'page', // The query key used by your endpoint
  type: 'numbers', // Sets the pagination type. See all options below
  tabs: 4, // The number of tabs to display when using numbered pagination
  showCount: true, // Shows the number of results
  map: {
    currentPage: 'meta.current_page', // The data key for the current page
    lastPage: 'meta.last_page', // The data key for the last page
    from: 'meta.from',  // The data key for the current page from (start)
    to: 'meta.to', // The data key for the current page to (end)
    total: 'meta.total' // The data key for the total number of pages
  }
}
```

You can fetch a specific page with the `page` property.
```js
<template>
  <QuickTables
    :request="request"
    :page="2"
    />
</template>
```

##### Types of pagination
| Value     | Description |
|-----------|-------------|
| `simple`  | Includes a previous and next button. This is the default option.
| `numbers`  | Numbered pagination. The `tab` option can be used to set the number of buttons.
| `full`  | Includes first, last, previous and next buttons.
| `simple_numbers`  | Numbered pagination with previous and net buttons.
| `full_numbers`  | Numbered pagination with first, last, previous and next buttons.
| `first_last_numbers`  | Numbered pagination with first and last buttons.

#### Filtering data
The `filter` property can be used to filter data through searching, sorting and limiting.

##### Search
```js
filter: {
  search: 'Your search string', // The string to search
  searchKey: 'search' // The search query key used by your endpoint
}
```

##### Sorting
```js
filter: {
  orderBy: 'created_at', // The column on your endpoint to sort by
  orderDir: 'desc', // The direction to sort. Accepts either asc or desc
  orderByKey: 'order_by', // The order by query key used by your endpoint
  orderDirKey: 'order_dir', // The order direction query key used by your endpoint
  map: {
    asc: 'asc', // The value used by your endpoint to represent ascending order
    desc: 'desc' // The value used by your endpoint to represent descending order
  }
}
```

##### Limiting results
```js
filter: {
  limit: 20, // The number of results to return
  limitKey: 'limit' // The limit query key used by your endpoint
}
```

#### Language
You can change the default language used across the table with the `messages` property.
```js
messages: {
  loading: 'Fetching new data..',
  noRows: 'No results found.',
  prev: 'Previous',
  next: 'Next',
  first: 'First',
  last: 'Last',
  counter: function({total, to, from}) {
    return `Showing ${from} to ${to} of ${total} entries`
  }
}
```

#### Styling the table
The component includes a basic theme located in `assets/DefaultTheme.css`.

You can set a class prefix for each part of the component which will make writing a custom theme easier.
```js
<template>
  <QuickTables
    :classPrefix="QuickTables"
    />
</template>
```

#### Manipulating server data
Use the `onBuildRows` property to manipulate data before it is rendered. You must ensure your callback returns the rows as an **array**.

```js
<template>
  <QuickTables
    :onBuildRows="onBuildRowsCallback"
    />
</template>

<script>
  export default {
    data() {
      return {
        onBuildRowsCallback: (rows) => {
          // Do something with the rows.
          return updatedRows;
        }
      }
    }
  }
</script>
```

---

## Draggable Rows

Basic support for draggable table rows is available as an optional setting.

Enable draggable rows with the `draggable-rows` attributes.

```js
<template>
  <QuickTables
    draggable-rows />
</template>
```

The `draggable-rows` attribute supports the following properties.

| Property     | Default | Description |
|-----------|-------------|-------------|
| `draggingClass`  | is-dragging | The class applied to a row while it is being dragged. Use this to apply any styling.
| `onDrop`  | (row) => {} | Is called when the row is dropped.
| `onDragStart`  | (row) => {} | Is called when the drag is first initiated.

Both the `onDrop` and `onDragStart` callbacks return the current rows data. Because this data is a proxy you can mutate it in your callbacks which will result in a re-render of that specific row.

```js
<template>
  <QuickTables
    :draggable-rows="draggableConfig" />
</template>

<script>
  export default {
    data() {
      return {
        draggableConfig: {
          onDrop: this.onDrop
        }
      }
    },
    methods: {
      onDrop(rowData) {
        rowData[0] = 'A new value for the first column!'
      }
    }
  }
</script>
```

---

## Contributing
Help improve this package by contributing.

Before opening a pull request, please first discuss the proposed changes via Github issue or <a href="mailto:hello@rhyshall.com">email</a>.

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/rhysnhall/vue3-quick-tables/blob/master/LICENSE.md) file for details
