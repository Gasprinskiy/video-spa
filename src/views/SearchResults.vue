<template>
    <div class="search-reslut-wrapper">
        <div class="search-result-querry">
            <div class="text-h6">Результаты поиска по запросу <b>"{{options.request}}"</b></div>
        </div>
        <div class="serach-result-list">
            <resultList
            :resultList="resultList"
            />
        </div>
    </div>
</template>

<script>

import resultList from '@/components/lists/resultList.vue'

import { db } from '@/db.js'
import { apiRequest, searchVideo } from '@/apiWorkers/apiRequest.js'
import { videoListToUnifiedView } from '@/helpers/myHelpers.js'

export default {
    components: {resultList},
    data(){
        return {
            resultList: [],
            options: {
                request: '',
                maxResult: 5,
                sort: 'searchSortUnspecified'
            },
        }
    },

    computed:{
        isRequestEmpty(){
            return this.options.request.length <= 0
        }
    },

    watch: {
        // '$route.path'(){
        //     this.$q.loading.show()
        //     this.searchByDefinedOptions()
                    // .then(() => {
                    //     this.$q.loading.hide()
                    // })
        // }
    },

    methods: {
       async defineOptions (){
            const id = Number(this.$route.params.querry.split('=')[1]);
            if(id){
                try {
                    await db.favorites.get(id)
                        .then((resp)=>{
                            if(resp){
                                this.options.request = resp.request
                                this.options.maxResult = resp.maxResult
                                this.options.sort = resp.sort
                            } else {
                                this.$q.notify({
                                    message: `Запрос с таким ID не найден`,
                                    color: 'orange'
                                })
                                // this.$router.push('/')
                            }
                        })
                } catch(e){
                    this.$q.notify({
                        message: `Сервер вернул: ${e}`,
                        color: 'red'
                    })
                }    
            } else {
                this.options.request = this.$route.params.querry;
                this.options.maxResult = 5;
                this.options.sort = 'searchSortUnspecified'
            }
            this.$store.state.currentSearchQuerry = this.options.request
        },

        async searchByDefinedOptions(){
            this.defineOptions ()
            .then(()=>{
                if(!this.isRequestEmpty){
                    apiRequest(searchVideo, this.options)
                        .then(response =>{
                            // const isError = response instanceof Object;
                            if(response.message){
                                this.$q.notify({
                                    message: `Сервер вернул: ${response.message}`,
                                    color: 'red'
                                })
                            } else {
                                this.resultList = response
                            }
                        })
                }    
            }) 
        },
    },

    beforeMount(){
        this.$q.loading.show()
        this.resultList = videoListToUnifiedView(JSON.parse(localStorage.getItem('mockData')))
        this.defineOptions()
            .then(() => {
                this.$q.loading.hide()
            })
        // this.searchByDefinedOptions()
        //     .then(() => {
        //         this.$q.loading.hide()
        //     })   
    },

}
</script>

<style lang="scss" scoped>
    
</style>