<template>
    <div class="search-reslut-wrapper">
        <div class="serach-result-list" v-if="!isArrayEmpty(resultList)">
            <resultList
            :resultList="resultList"
            :title="searchTitle"
            />
        </div>
        <div class="search-result-empty-messege" v-if="isArrayEmpty(resultList)">
            <empty :message="errorMessege"/>
        </div>
    </div>
</template>

<script>
import { apiRequest, searchVideo } from '@/serviсes/apiWorkers/apiRequest.js'
import { isArrayEmpty } from '@/serviсes/helpers/'

import messageMixin from '@/mixins/messageMixin.js'
import resultList from '@/components/lists/resultList.vue'
import empty from '@/components/items/empty.vue'


export default {
    components: {resultList, empty},
    mixins: [messageMixin],
    data(){
        return {
            resultList: [],
            options: {
                request: '',
                maxResult: 5,
                sort: 'searchSortUnspecified'
            },
            isArrayEmpty
        }
    },

    computed:{
        searchTitle(){
            return `Результаты поиска по запросу <b>"${this.options.request}"</b>`
        }
    },

    watch: {
        '$route.path'(){
            //// Обращение к api /////////////
            if(this.$route.params.querry){
                this.$q.loading.show()
                this.searchByRouteQuerry()
                    .then(() => {
                        this.$q.loading.hide()
                    })
            }
            //// Обращение к api /////////////
        },

        '$route.path'(){
            //// Mock /////////////
            // if(this.$route.params.querry){
            //     this.options.request = this.$route.params.querry
            //     this.$q.loading.show()
            //     this.resultList = videoListToUnifiedView(JSON.parse(localStorage.getItem('mockData')))
            //     this.$q.loading.hide()
            // }
            //// Mock /////////////
        }
        
    },

    methods: {
        async searchByRouteQuerry(){
            this.options.request = this.$route.params.querry
            const response = await apiRequest(searchVideo, this.options)
            if(response.message){
                this.isError = true
                this.errorMessege = `Ошибка: ${response.message}`
                this.message = this.errorMessege
            } else {
                this.resultList = response
            }
        },
    },

    beforeMount(){
        //// Mock /////////////
        // this.options.request = this.$route.params.querry
        // this.$q.loading.show()
        // this.resultList = videoListToUnifiedView(JSON.parse(localStorage.getItem('mockData')))
        // this.$q.loading.hide()
        //// Mock /////////////

        //// Обращение к api /////////////
        this.$q.loading.show()
        this.searchByRouteQuerry()
            .then(() => {
                this.$q.loading.hide()
            })
        //// Обращение к api /////////////   
    },

}
</script>

<style lang="scss" scoped>
    
</style>