<template>
  <form 
  class="search-bar-wrapper"
  @submit.prevent="emitSearch"  
  >
      <q-input
        class="search-input"
        ref="searchinput"
        v-model="searchQuery"
        @update:modelValue="val => { emitInputedValue(val) }"
        @focus.prevent="emitFocus"
        @blur="changeVisibility"
        label="Поиск"
        outlined
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <div
        class="search-bar-promptly promptly" 
        :class="{show: focused}"
      >
        <div 
          class="promptly-item"
          v-for="item in searchHistory"
          :key="item.id"
          @click="searchPromptlyItem(item.request)"
          @mouseover="chosing = true"
          @mouseout="chosing = false"
        >
          <q-icon class="promptly-item-icon" name="history"/>
          <span class="promptly-item-title">{{item.request}}</span>
          <q-btn
            @click.stop="emitRemove(item.id)" 
            class="promptly-item-remove-btn" 
            color="negative" 
            size="sm" 
            padding="xs"
            icon="close"
            flat
          />
        </div> 
      </div>
  </form>
</template>

<script>


export default {
  props: {
    searchHistory: {
      type: Array,
      default: []
    }
  },

  data(){
    return {
      searchQuery: '',
      focused: false,
      chosing: false,
    }
  },

  methods: {
    emitSearch(){
      if(this.searchQuery !== ''){
        this.focused = false
        this.counter = -1
        this.$refs.searchinput.blur()
        this.$emit('search', this.searchQuery)
      }
    },

    emitFocus(){
      this.focused = true
      this.$emit('inFocus')
    },

    changeVisibility(){
      if(!this.chosing){
        this.focused = false
      }
    },

    emitInputedValue(val){
      this.$emit('inputed', val)
    },
    
    searchPromptlyItem(val){
      this.searchQuery = val
      this.emitSearch()
    },

    emitRemove(id){
      this.$emit('removeRequest', id)
    }
  },
}
</script>

<style lang="scss" scoped>
    .search-bar-wrapper {
      width: 100%;
      background: #fff;
      position: relative;
      .search-input {
        width: 100%;
        position: relative;
      }
      .search-bar-promptly {
        width: 100%;
        height: auto;
        max-height: 350px;
        overflow-y: auto;
        position: absolute;
        background-color: #fff;
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        &.show {
          opacity: 1;
          visibility: visible;
        }
        .promptly-item {
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 5px 12px;
          font-size: 15px;
          text-align: left;
          background-color: inherit;
          border: none;
          outline: none;
          position: relative;
          z-index: 100;
          .promptly-item-icon {
            margin-right: 5px;
            font-size: 18px;
          }
          .promptly-item-icon,
          .promptly-item-title {
            pointer-events: none;
          }
          .promptly-item-title {
            font-weight: 600;
          }
          .promptly-item-remove-btn {
            position: absolute;
            right: 5px;
            z-index: 101;
            i {
              font-weight: 300;
            }
          }
          &:focus {
            border: none;
            outline: none;
            background-color: #DCDCDC;
          }
          &:hover {
            background-color: #DCDCDC;
          }
        }
      }
    }
</style>