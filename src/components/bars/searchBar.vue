<template>
  <form @submit.prevent="emitSearch" class="search-bar-wrapper">
      <q-input
        class="search-input"
        v-model="searchQuery"
        label="Поиск"
        outlined
      >
        <template v-slot:append>
            <q-icon v-if="isSearchDone" @click="openModal" name="favorite"/>
        </template>
      </q-input>

      <q-btn
        class="search-btn" 
        icon="search"
        color="primary"
        type="submit"
        :disabled="searchQuery.length <= 0"
      />
  </form>
</template>

<script>

import toggleMixin from '@/mixins/toggleMixin.js'

export default {

  mixins: [toggleMixin],

  props: {
    searchQuery: {
      type: String,
      default: '',
      requared: false
    }
      
  }, 
  computed: {
    isSearchDone(){
      return this.$route.meta.isSearchDone
    }
  },
  methods: {
    emitSearch(){
      this.$emit('search', this.searchQuery)
    },
  },
}
</script>

<style lang="scss" scoped>
    .search-bar-wrapper {
      width: 100%;
      display: flex;
      background: #fff;
      .search-input {
        width: 85%;
        i {
          cursor: pointer;
        }
      }
      .search-btn {
        width: 15%;
      }
    }

    @media (max-width: 768px) {
      .search-bar-wrapper {
        .search-input {
          width: 100%;
          i {
            cursor: pointer;
          }
        }
        .search-btn {
          width: 0;
          display: none;
        }
      }
    }
</style>