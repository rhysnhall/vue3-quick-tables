<template>
  <nav>
    <div v-if="showCount"
      :class="classPrefix+'RowCounter'">
      {{rowCounter}}
    </div>
    <!-- Simple pagination -->
    <PaginationList v-if="type === 'simple'"
      :items="simplePagination" />
    <PaginationList v-if="type === 'numbers'"
      :items="numberedPagination" />
    <PaginationList v-if="type === 'full'"
      :items="fullPagination" />
    <PaginationList v-if="type === 'simple_numbers'"
      :items="simpleNumberedPagination" />
    <PaginationList v-if="type === 'full_numbers'"
      :items="fullNumberedPagination" />
    <PaginationList v-if="type === 'first_last_numbers'"
      :items="firstLastNumberedPagination" />
  </nav>
</template>

<script>
import PaginationList from './PaginationList.vue';
export default {
  name: 'PaginationNav',
  components: {
    PaginationList
  },
  inject: ['getPage', 'language', 'classPrefix'],
  props: {
    type: String,
    meta: Object,
    tabs: Number,
    showCount: Boolean
  },
  provide() {
    return {
      link: this.makeLink
    }
  },
  methods: {
    makeLink({
      label = '1',
      page = 1,
      active = false,
      disabled = false
    }) {
      return {
        label: label,
        active: active,
        disabled: disabled,
        callback: (active || disabled) ? () => {} : () => this.getPage(page)
      };
    }
  },
  computed: {
    rowCounter() {
      if(typeof this.language.counter === 'string') {
        return this.language.counter;
      }
      else if(typeof this.language.counter === 'function') {
        return this.language.counter({...this.meta});
      }
      return false;
    },
    currentPage() {
      return this.meta?.currentPage || 1;
    },
    lastPage() {
      return this.meta?.lastPage;
    },
    nextPage() {
      return this.currentPage + 1;
    },
    previousPage() {
      if(this.currentPage === 1) {
        return 1;
      }
      return this.currentPage - 1;
    },
    isFirstPage() {
      return this.currentPage === 1;
    },
    isLastPage() {
      return this.currentPage === this.lastPage;
    },
    prevPageLink() {
      return this.makeLink({
        label: this.language.prev,
        page: this.previousPage,
        disabled: this.isFirstPage
      });
    },
    nextPageLink() {
      return this.makeLink({
        label: this.language.next,
        page: this.nextPage,
        disabled: this.isLastPage
      });
    },
    firstPageLink() {
      return this.makeLink({
        label: this.language.first,
        page: 1,
        disabled: this.isFirstPage
      });
    },
    lastPageLink() {
      return this.makeLink({
        label: this.language.last,
        page: this.lastPage,
        disabled: this.isLastPage
      });
    },
    fullNumberedPagination() {
      return [
        this.firstPageLink,
        this.prevPageLink,
        ...this.numberedPagination,
        this.nextPageLink,
        this.lastPageLink
      ];
    },
    fullPagination() {
      return [
        this.firstPageLink,
        this.prevPageLink,
        this.nextPageLink,
        this.lastPageLink
      ];
    },
    simpleNumberedPagination() {
      return [
        this.prevPageLink,
        ...this.numberedPagination,
        this.nextPageLink
      ];
    },
    simplePagination() {
      return [
        this.prevPageLink,
        this.nextPageLink
      ];
    },
    firstLastNumberedPagination() {
      return [
        this.firstPageLink,
        ...this.numberedPagination,
        this.lastPageLink
      ];
    },
    numberedPagination() {
      let tabs = (this.lastPage < this.tabs)
        ? this.lastPage
        : this.tabs;
      let offset = ((tabs / 2) % 2) == 0
        ? Math.floor(tabs / 2) - 1
        : Math.floor(tabs / 2);
      let links = [];
      if(!this.meta?.currentPage) {
        return [];
      }
      // If we are on page 1.
      if(this.isFirstPage) {
        for(let i = 1; i <= tabs; i++) {
          links = [...links, this.makeLink({
            label: i.toString(),
            page: i,
            active: i === 1
          })]
        }
      }
      // If we are not on page 1 but there are not enough results to make up all tabs.
      else if((this.currentPage - Math.floor(tabs / 2)) <= 0) {
        // Start from 1 and add as many tabs as possible.
        for(let i = 1; i <= tabs; i++) {
          links = [...links, this.makeLink({
            label: i.toString(),
            page: i,
            active: i === this.currentPage
          })]
        }
      }
      // If there are not enough pages left to make up the remaining tabs.
      else if((this.currentPage + offset) >= this.lastPage) {
        for(let i = (this.lastPage - tabs) + 1; i <= this.lastPage; i++) {
          links = [...links, this.makeLink({
            label: i.toString(),
            page: i,
            active: i === this.currentPage
          })]
        }
      }
      // For all other cases.
      else {
        for(let i = this.currentPage - offset; i <= (this.currentPage + Math.floor(tabs / 2)); i++) {
          links = [...links, this.makeLink({
            label: i.toString(),
            page: i,
            active: i === this.currentPage
          })]
        }
      }
      return links;
    }
  }
}
</script>
