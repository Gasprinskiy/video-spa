<template>
  <q-scroll-area style="height: 100vh">
    <nav-bar>
      <template v-slot:search-input>
        <search-bar 
          @search="routeAndSaveRequest"
          @inputed="getRequestByInputedVal"
          @inFocus="getSearchHistory"
          @removeRequest="removeRequest"
          :searchHistory="searchHistoryOptions"
        />
      </template>
    </nav-bar>
  
    <div class="wrapper">
      <router-view/>
    </div>
  </q-scroll-area>
    
</template>

<script>
import {dbRequestCaller, 
        getDataFromDbWithLimit, 
        addDataToDb, 
        removeDataFromDb, 
        getFilteredDataFromDb, 
        searchByValInDb
} from '@/dbWorker/dbWorkers.js'

import navBar from '@/components/bars/navBar.vue'
import searchBar from '@/components/bars/searchBar.vue'
import messageMixin from '@/mixins/messageMixin.js'

export default {
  components: {navBar, searchBar},
  mixins: [messageMixin],
  data(){
    return {
      searchHistoryOptions: [],
    }
  },

  methods: {
    async saveRequestToSearchHistory(querry){
      await dbRequestCaller(addDataToDb, {
        target: 'searchHistory',
        payload: {
          request: querry
        }
      })
    },

    async removeRequestIfItWasSavedBefore(querry){
      const response = await dbRequestCaller(getFilteredDataFromDb, {
        target: 'searchHistory',
        filterOptions: item => item.request === querry
      })
      if(!response.hasError && response.data.length > 0) {
        const id = response.data[0].id
        await dbRequestCaller(removeDataFromDb, {
          target: 'searchHistory',
          id: id
        })
      }
    },

    async getSearchHistory(){
      const response = await dbRequestCaller(getDataFromDbWithLimit, {
        target: 'searchHistory',
        limit: 10
      })
      if(!response.hasError){
        this.searchHistoryOptions = response.data
      }
    },

    async routeAndSaveRequest(val){
      const querry = val.replace(/([\/=])/, '')
      await this.$router.push(`/search/${querry}`)
      await this.removeRequestIfItWasSavedBefore(querry)
      await this.saveRequestToSearchHistory(querry)
    },

    async getRequestByInputedVal(val){
      if(val !== ''){
        const response = await dbRequestCaller(searchByValInDb, {
          target: 'searchHistory',
          where: 'request',
          val: val
        })
        if(!response.hasError){
          this.searchHistoryOptions = response.data
        }
      } else {
        this.getSearchHistory()
      }
    },

    async removeRequest(id){
      const response = await dbRequestCaller(removeDataFromDb, {
        target: 'searchHistory',
        id: id
      })
      if(!response.hasError){
        this.searchHistoryOptions = this.searchHistoryOptions.filter(item => item.id !== id)
        this.isSuccess = true
        this.message = 'Запрос удален'
      } else {
        this.isError = true
        this.message = `Ошибка: ${response.message}, не удалос удалить запрос`
      }
    }

  },

 
}


</script>



<style lang="scss">
body {
  background-color: #FAFAFA;
}


.wrapper {
  max-width: 1440px;
  margin: auto;
  padding: 40px 30px;
  position: relative;
}

a {
  color: $primary;
  text-decoration: none;
}

.q-btn {
  span {
    pointer-events: none;
  }
}

.video-similar-scroll-area {
    div.absolute {
      position: relative;
    }
}

</style>
