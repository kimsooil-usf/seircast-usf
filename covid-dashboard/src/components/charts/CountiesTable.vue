<template>
  <div>
    <b-card header-tag="nav">
      <b-card-text>
        <h6 class="tw-font-bolder tw-mb-1">{{ title }}</h6>
        <div v-if="selectedCounties.length" class="mb-1">
            <b-badge v-for="county in selectedCounties" :key="county.county" class="mx-1">{{county.county}}</b-badge>
        </div>
        <b-table
                ref="countiesTable"
                hover
                :sticky-header="tableHeight"
                responsive
                selectable
                select-mode="multi"
                :items="items"
                :fields="fields"
                @row-selected="onRowSelected"
                class="table-sm tw-text-sm"
                selected-variant="primary"
        >
          <template v-slot:head(county)="data">
            <div class="d-flex justify-content-between">
              <span class="align-self-center">{{ data.label }}</span>
              <span class="h-25">
                <b-button @click="$refs.countiesTable.selectAllRows()" size="sm" variant="outline-secondary" class="mr-1">Select All</b-button>
                <b-button @click="$refs.countiesTable.clearSelected()" size="sm" variant="outline-secondary">Reset</b-button>
              </span>
            </div>

          </template>
          <template v-slot:cell(selected)="{ rowSelected }">
            <template v-if="rowSelected">
              <span aria-hidden="true">&#9745;</span>
              <span class="sr-only">Selected</span>
            </template>
            <template v-else>
              <span aria-hidden="true">&#9744;</span>
              <span class="sr-only">Not selected</span>
            </template>
          </template>
        </b-table>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>

import {
  mapMutations
} from 'vuex';

export default {
  props: {
    counties: Array,
    title: String,
    tableHeight: {
      type: String,
      default: '26.7rem'
    },
    initialSelected: Array,
    state: String
  },
  data() {
    return {
      fields: [
        {
          key: 'selected',
          label: '',
          thStyle: { width: '15px' }
        },
        {
          key: 'county',
          label: 'County'
        }
      ]
    };
  },
  mounted () {
    for (const entry of this.selectedCounties) {
      this.$refs.countiesTable.selectRow(entry.index);
    }
  },
  watch: {
    selectedCounties () {
      this.$refs.countiesTable.clearSelected();
      for (const entry of this.selectedCounties) {
        this.$refs.countiesTable.selectRow(entry.index);
      }
    }
  },
  computed: {
    items () {
      return this.counties.map((entry, index) => ({ county: entry, index: index }));
    },
    selectedCounties: {
      get () {
        return this.$store.state.covid.ui.selectedTableRows;
      },
      set (value) {
        this.setSelectedTableRows(value);
      }
    }
  },
  methods: {
    ...mapMutations('covid', [
      'setSelectedTableRows'
    ]),
    onRowSelected (items) {
      this.selectedCounties = items;
      this.$emit('table-rows-selected', this.selectedCounties)
    }
  }
};
</script>

<style>
nav.card-header {
  border-bottom: none;
  padding: 0.5rem 0 0 0;
}
ul.nav.nav-tabs {
  padding: 0 0.5rem;
}
ul.nav.nav-tabs li.nav-item {
  font-size: 0.7rem;
}
ul.nav.nav-tabs a.nav-link {
  padding: 0.35rem 0.5rem;
}
</style>