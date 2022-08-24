<template>
  <li :active="active"
    :disabled="disabled"
    @click.prevent="callback">
    <a href="#">
      {{label}}
    </a>
  </li>
</template>
<script>
export default {
  name: 'PaginationItem',
  props: {
    active: Boolean,
    callback: Function,
    label: String,
    disabled: Boolean
  }
}
</script>
