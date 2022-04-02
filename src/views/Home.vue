<template>
  <div class="home-wrapper">
      <div class="recomendations" v-if="hasRecomendations">
          <div class="recomendations-title text-h5">Рекомендации</div>
          <div class="recomendations-list">
              <result-list 
                :resultList="recomendationVideoList"
              />
          </div>
      </div>
      <div class="recomendations">
          <div class="recomendations-title text-h5">Сейчас популярно</div>
          <div class="recomendations-list">
              <result-list 
                :resultList="popularVideoList"
              />
          </div>
      </div>

  </div>
</template>

<script>

import resultList from '@/components/lists/resultList.vue'
import { videoListToUnifiedView, videoToUnifiedView } from '@/helpers/myHelpers.js'
import { apiRequest, getMostPopularVideo, getRecomendationVideo } from '@/apiWorkers/apiRequest.js'
import { db } from '@/db.js'

export default {
  components: {resultList},
  data(){
    return {
      popularVideoList: [],
      recomendationVideoList: [],
      resentWatchedVideosid: [],
      hasRecomendations: false
    }
  },

  methods: {

    getPopularVideoList(){
      apiRequest(getMostPopularVideo, {request: 'mostPopular', maxResult: 5})
        .then(response => {
                if(response.message){
                  this.$q.notify({
                    message: `Сервер вернул: ${response.message}`,
                    color: 'red'
                  })
                } else {
                  this.popularVideoList = response
                }
        })
    },

    async getRecentWatchedVideosId(){
        try {
          await db.browsingHistory
          .reverse()
          .limit(5)
          .toArray(data => {
            this.resentWatchedVideosid = data.map(video => video.id)
          })
        } catch (e){
          console.log(e);
        }
    },

    async getRecomendationVideoList(){
        if(this.resentWatchedVideosid.length > 0) {
          this.resentWatchedVideosid.forEach(id => {
            apiRequest(getRecomendationVideo, {request: 'recomendations', maxResult: 5, videoId: id})
              .then(response => {
                      if(response.message){
                        this.$q.notify({
                          message: `Сервер вернул: ${response.message}`,
                          color: 'red'
                        })
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
