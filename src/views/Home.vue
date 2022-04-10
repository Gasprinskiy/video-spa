<template>
  <div class="home-wrapper">
      <div class="home-recomendations recomendations" >
          <div class="recomendations-list"  v-if="!isArrayEmpty(recomendationVideoList)">
              <result-list 
                :resultList="recomendationVideoList"
                title="Рекомендации"
              />
          </div>
          <div class="recomendations-popular-list" v-if="!isArrayEmpty(popularVideoList)">
              <result-list 
                :resultList="popularVideoList"
                title="Сейчас популярно"
              />
          </div>
          <div class="recomendations-empty-message" v-if="noDataCounter >= 2">
            <empty :message="errorMessege"/>
          </div>
      </div>
  </div>
</template>

<script>

import { isArrayEmpty } from '@/helpers/myHelpers.js'
import { apiRequest, getMostPopularVideo, getRecomendationVideo } from '@/apiWorkers/apiRequest.js'
import { dbRequestCaller, getDataFromDbWithLimit } from '@/dbWorker/dbWorkers.js'

import messageMixin from '@/mixins/messageMixin.js'
import resultList from '@/components/lists/resultList.vue'
import empty from '@/components/items/empty.vue'


export default {
  components: {resultList, empty},
  mixins: [messageMixin],
  data(){
    return {
      popularVideoList: [],
      recomendationVideoList: [],
      resentWatchedVideosid: [],
      noDataCounter: 0,
      isArrayEmpty
    }
  },

  methods: {

    getPopularVideoList(){
      apiRequest(getMostPopularVideo, {
        request: 'mostPopular', 
        maxResult: 5
      })
        .then(response => {
                if(response.message){
                  this.isError = true
                  this.errorMessege = `Ошибка: ${response.message}`
                  this.message = this.errorMessege
                  this.noDataCounter += 1;
                } else {
                  this.popularVideoList = response
                }
        })
    },

    async getRecentWatchedVideosId(){
      const response = await dbRequestCaller(getDataFromDbWithLimit, {
        target: 'browsingHistory',
        limit: 5,
      })
      if(!response.hasError){
        this.resentWatchedVideosid = response.data.map(video => video.videoId)
      }
    },

    async getRecomendationVideoList(){
        if(this.resentWatchedVideosid.length > 0) {
          this.resentWatchedVideosid.forEach(id => {
            apiRequest(getRecomendationVideo, {
              request: 'recomendations', 
              maxResult: 5, 
              videoId: id
            })
              .then(response => {
                      if(response.message){
                        this.isError = true
                        this.errorMessege = `Ошибка: ${response.message}`
                        this.message = this.errorMessege
                        this.noDataCounter += 1;
                      } else {
                        this.recomendationVideoList = response
                        this.hasRecomendations = true
                      }
              })
          })
        }
    }
  },

  beforeMount(){
    this.$q.loading.show()
    this.getRecentWatchedVideosId()
      .then(()=>{
        this.getRecomendationVideoList()
          .then(()=>{
            this.getPopularVideoList()
            this.$q.loading.hide()
          })
      })
  },
  
}

</script>

<style lang="scss" scoped>
  .recomendations {
    margin-bottom: 20px;
  }
</style>
