<template>
  <nav-bar>
    <template v-slot:search-input>
      <search-bar 
        @search="routeQuerry" 
        v-model:show="show"
        :searchQuery="$store.state.currentSearchQuerry"
      />
    </template>
  </nav-bar>

  <div class="wrapper">
    <router-view/>
  </div>

  <favorites-modal 
    v-model:show="show" 
    :options="options"
    :sortOptions="sortOptitons"
    title="Сохранить запрос"
    @save="saveRequest"
  />

</template>

<script>

import navBar from '@/components/bars/navBar.vue'
import searchBar from '@/components/bars/searchBar.vue'
import favoritesModal from '@/components/modal/favoritesModal.vue'

import { db } from '@/db.js'
import { getMostPopularVideo } from './apiWorkers/youTubeApi.js'
import { searchVideo } from './apiWorkers/apiRequest.js'

export default {
  components: {navBar, searchBar, favoritesModal},
  data(){
    return {
      show: false,
      querry: '',
      options: {
        request: 'vue',
        maxResult: 5,
        sort: {label: 'Без сортировки', value: 'searchSortUnspecified'}
      },
      sortOptitons: [
        {label: 'Дате', value: 'date'},
        {label: 'Рейтингу', value: 'rating'},
        {label: 'Просмтрам', value: 'viewCount'},
        {label: 'Названию', value: 'title'},
        {label: 'Количеству видео', value: 'videoCount'},
      ]
    }
  },

  watch: {
    '$store.state.currentSearchQuerry'(){
      this.options.request = this.$store.state.currentSearchQuerry
    }
  },

  methods: {
    routeQuerry(val){
      const querry = val.replace(/([\/=])/, '')
      this.$store.state.currentSearchQuerry = querry
      this.$router.push(`/search/${querry}`)
    },

    async saveRequest(data){
      try {
        await db.favorites.add({
            request: data.request,
            title: data.title,
            maxResult: data.maxResult,
            sort: {
              value: data.sort.value,
              label: data.sort.label
            }  
        }).then(()=>{
            this.$q.notify({
              message: `Запрос успешно сохранен`,
              color: 'green'
            })
              this.show = false
        })
      } catch(e){
        this.$q.notify({
          message: `Сервер вернул: ${e}`,
          color: 'red'
        })
      }
    } 
  },
  beforeMount(){
    // searchVideo(this.options)
    //   .then(response => {
    //     console.log(response);
    //   })
    // localStorage.setItem('mockData', JSON.stringify([{"kind":"youtube#searchResult","etag":"RlqYyQNVkNxq94iUSIorIVubhqY","id":{"kind":"youtube#video","videoId":"nhBVL41-_Cw"},"snippet":{"publishedAt":"2020-04-03T16:50:03Z","channelId":"UCsBjURrPoezykLs9EqgamOA","title":"Vue.js Explained in 100 Seconds","description":"What is Vue.js? Learn the basics of Vue and build your first reactive UI component in just 100 seconds ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/nhBVL41-_Cw/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/nhBVL41-_Cw/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/nhBVL41-_Cw/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Fireship","liveBroadcastContent":"none","publishTime":"2020-04-03T16:50:03Z"},"statistics":{"viewCount":"711901","likeCount":"24756","favoriteCount":"0","commentCount":"551"}},{"kind":"youtube#searchResult","etag":"IgjtNfkmJ2zYztZEPaOVDDjaxLM","id":{"kind":"youtube#video","videoId":"4xyb_tA-uw0"},"snippet":{"publishedAt":"2021-02-02T21:31:54Z","channelId":"UCW9pyonagDWGMCy7V_Kro6g","title":"#1 Зачем нужен Vue.js? - Vue.js: концепции","description":"Давайте начнём с главного. А зачем вообще нужен Vue.js и ему подобные фреймворки? Вопросы? Пожелания? Мысли о ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/4xyb_tA-uw0/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/4xyb_tA-uw0/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/4xyb_tA-uw0/hqdefault.jpg","width":480,"height":360}},"channelTitle":"JavaScript.Ninja","liveBroadcastContent":"none","publishTime":"2021-02-02T21:31:54Z"},"statistics":{"viewCount":"100866","likeCount":"5618","favoriteCount":"0","commentCount":"273"}},{"kind":"youtube#searchResult","etag":"xJXfaq9smed5995SdVYeVhGNfWU","id":{"kind":"youtube#video","videoId":"FXpIoQ_rT_c"},"snippet":{"publishedAt":"2021-09-07T12:58:33Z","channelId":"UC8butISFwT-Wl7EV0hUK0BQ","title":"Vue.js Course for Beginners [2021 Tutorial]","description":"Learn Vue 3 by in this full course. Vue.js is an open-source model–view–view model front end JavaScript framework for building ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/FXpIoQ_rT_c/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/FXpIoQ_rT_c/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/FXpIoQ_rT_c/hqdefault.jpg","width":480,"height":360}},"channelTitle":"freeCodeCamp.org","liveBroadcastContent":"none","publishTime":"2021-09-07T12:58:33Z"},"statistics":{"viewCount":"391394","likeCount":"7959","favoriteCount":"0","commentCount":"320"}},{"kind":"youtube#searchResult","etag":"4BlqUzso-xRn_JRjKHe49jv6U4g","id":{"kind":"youtube#video","videoId":"XzLuMtDelGk"},"snippet":{"publishedAt":"2021-06-30T10:00:15Z","channelId":"UCDzGdB9TTgFm8jRXn1tBdoA","title":"Vue 3 фундаментальный курс от А до Я","description":"В этом ролике мы разберем все основные концепции Vue 3 и пройдемся по нему от А до Я. Разработаем приложение с ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/XzLuMtDelGk/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/XzLuMtDelGk/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/XzLuMtDelGk/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Ulbi TV","liveBroadcastContent":"none","publishTime":"2021-06-30T10:00:15Z"},"statistics":{"viewCount":"213750","likeCount":"7443","favoriteCount":"0","commentCount":"665"}},{"kind":"youtube#searchResult","etag":"SqDIkNPoopwMtjVvlKcRYAp94RA","id":{"kind":"youtube#video","videoId":"qZXt1Aom3Cs"},"snippet":{"publishedAt":"2021-02-24T16:36:53Z","channelId":"UC29ju8bIPH5as8OGnQzwJyA","title":"Vue JS Crash Course","description":"Learn the fundamentals of Vue JS (v3) in this project-based crash course Task Tracker: ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/qZXt1Aom3Cs/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/qZXt1Aom3Cs/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/qZXt1Aom3Cs/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Traversy Media","liveBroadcastContent":"none","publishTime":"2021-02-24T16:36:53Z"},"statistics":{"viewCount":"738676","likeCount":"14490","favoriteCount":"0","commentCount":"895"}},{"kind":"youtube#searchResult","etag":"zG2UZ_mSLc-C-r8RM_Rw0-YS9Mk","id":{"kind":"youtube#video","videoId":"OrxmtDw4pVI"},"snippet":{"publishedAt":"2020-02-24T18:20:37Z","channelId":"UCsUalyRg43M8D60mtHe6YcA","title":"Vue.js: The Documentary","description":"by honeypot.io | What began as a side project of a Google developer now shares the JS leaderboard with #React and #Angular.","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/OrxmtDw4pVI/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/OrxmtDw4pVI/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/OrxmtDw4pVI/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Honeypot","liveBroadcastContent":"none","publishTime":"2020-02-24T18:20:37Z"},"statistics":{"viewCount":"1226516","likeCount":"43695","favoriteCount":"0","commentCount":"1618"}},{"kind":"youtube#searchResult","etag":"54IrTNLjFzsfOCtOSqqWVJjS4ME","id":{"kind":"youtube#video","videoId":"YrxBCBibVo0"},"snippet":{"publishedAt":"2020-12-02T08:30:01Z","channelId":"UCW5YeuERMmlnqo4oq8vwUpg","title":"Vue JS 3 Tutorial for Beginners #1 - Introduction","description":"Hey gang, in this Vue 3 tutorial series for beginners we'll learn Vue.js (using version 3 - the latest major version) from the ground ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/YrxBCBibVo0/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/YrxBCBibVo0/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/YrxBCBibVo0/hqdefault.jpg","width":480,"height":360}},"channelTitle":"The Net Ninja","liveBroadcastContent":"none","publishTime":"2020-12-02T08:30:01Z"},"statistics":{"viewCount":"267102","likeCount":"4103","favoriteCount":"0","commentCount":"177"}},{"kind":"youtube#searchResult","etag":"6_hBYer5hRqpXoIDC2wkYEjWAsE","id":{"kind":"youtube#video","videoId":"p059z-0JTFg"},"snippet":{"publishedAt":"2021-01-03T16:12:20Z","channelId":"UCg8ss4xW9jASrqWGP30jXiw","title":"Vue 3 Основы для Начинающих - Полный Курс [2021]","description":"Исходники и тема тут: https://t.me/js_by_vladilen/316 Я в соц сетях: Telegram: https://t.me/js_by_vladilen Instagram: ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/p059z-0JTFg/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/p059z-0JTFg/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/p059z-0JTFg/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Владилен Минин","liveBroadcastContent":"none","publishTime":"2021-01-03T16:12:20Z"},"statistics":{"viewCount":"133411","likeCount":"5067","favoriteCount":"0","commentCount":"408"}},{"kind":"youtube#searchResult","etag":"7Z0w2opYpXuZSqrxmcPYoFGc0wc","id":{"kind":"youtube#video","videoId":"0JJPfz5dg20"},"snippet":{"publishedAt":"2021-09-30T20:00:10Z","channelId":"UCa1zuotKU4Weuw_fLRnPv0A","title":"Vue.js 3 Deep Dive with Evan You","description":"Watch the first two lessons of Evan You's Vue 3 Deep Dive tutorial, facilitated by Gregg Pollack of Vue Mastery. Access this ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/0JJPfz5dg20/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/0JJPfz5dg20/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/0JJPfz5dg20/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Vue Mastery","liveBroadcastContent":"none","publishTime":"2021-09-30T20:00:10Z"},"statistics":{"viewCount":"24387","likeCount":"753","favoriteCount":"0","commentCount":"18"}},{"kind":"youtube#searchResult","etag":"ErCcWx4gVFrjYUD-V4oJAjpkMSY","id":{"kind":"youtube#video","videoId":"eEF6Szpda9g"},"snippet":{"publishedAt":"2020-11-23T16:19:00Z","channelId":"UCDzGdB9TTgFm8jRXn1tBdoA","title":"Vue JS БЫСТРЫЙ КУРС 2021 для начинающих. Vue router, vuex, vuetify","description":"В этом ролике мы пройдемся по всем основным возможностям фрэймворка vue js. Рассмотрим vue router для ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/eEF6Szpda9g/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/eEF6Szpda9g/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/eEF6Szpda9g/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Ulbi TV","liveBroadcastContent":"none","publishTime":"2020-11-23T16:19:00Z"},"statistics":{"viewCount":"18903","likeCount":"683","favoriteCount":"0","commentCount":"152"}},{"kind":"youtube#searchResult","etag":"FoyNInUO22SGVT0V0UbsG1t4c8s","id":{"kind":"youtube#video","videoId":"OlnwgS-gk8Y"},"snippet":{"publishedAt":"2019-05-08T12:04:43Z","channelId":"UCg8ss4xW9jASrqWGP30jXiw","title":"Vue JS - Быстрый курс за 50 минут","description":"Полный курс по Vue 3: https://clc.am/vuejs3 Подпишись на меня в Instagram: https://www.instagram.com/vladilen.minin/ ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/OlnwgS-gk8Y/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/OlnwgS-gk8Y/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/OlnwgS-gk8Y/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Владилен Минин","liveBroadcastContent":"none","publishTime":"2019-05-08T12:04:43Z"},"statistics":{"viewCount":"275733","likeCount":"8340","favoriteCount":"0","commentCount":"539"}},{"kind":"youtube#searchResult","etag":"M1ffQSWbDustkiM7X3HT-kS1WHU","id":{"kind":"youtube#video","videoId":"ISv22NNL-aE"},"snippet":{"publishedAt":"2021-05-26T12:58:14Z","channelId":"UC29ju8bIPH5as8OGnQzwJyA","title":"6 Hour Vue.js &amp; Firebase Project - FireBlogs","description":"Build a multi-user blog project with Vue.js, Vuex and Firebase Demo: https://fireblogs-50850.web.app/ Code: ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/ISv22NNL-aE/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/ISv22NNL-aE/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/ISv22NNL-aE/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Traversy Media","liveBroadcastContent":"none","publishTime":"2021-05-26T12:58:14Z"},"statistics":{"viewCount":"114393","likeCount":"3118","favoriteCount":"0","commentCount":"322"}}]))

    // sessionStorage.setItem('test', 'test')
  }

}


</script>



<style lang="scss">
body {
  background-color: #FAFAFA;
}

// #app {
//   width: 100%;
//   max-width: 1440px;
//   margin: auto;
// }
.wrapper {
  max-width: 1440px;
  margin: auto;
  padding: 40px 30px;
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
