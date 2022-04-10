<template>
    <div class="video-watcher-wrapper video" v-if="allRequestsDone">
        <div class="video-iframa-wrapper">
            <player 
            :video="currentVideo"
            :isBtnDisabled="videoInWatchLaterPlaylist"
            @watch-later="addVideoToWatchLaterPlaylist"
            />
        </div>
        <div class="video-similar-scroll-area video-similar">
            <video-scroll-list title="Похожие видео">
                <template v-slot:list>
                    <result-list 
                        :small="true" :resultList="currentVideo.similarVideoList"
                    />
                </template>
            </video-scroll-list>
        </div>
    </div>
    <div class="video-watcher-empty-message" v-if="!allRequestsDone">
        <empty :message="errorMessege"/>
    </div>
</template>

<script>
import messageMixin from '@/mixins/messageMixin.js'
import resultList from '@/components/lists/resultList.vue'
import player from '@/components/playerItems/player.vue'
import videoScrollList from '@/components/templates/videoScrollList.vue'
import empty from '@/components/items/empty.vue'

import { apiRequest, getVideoFullData } from '@/apiWorkers/apiRequest.js'
import { dbRequestCaller, addDataToDb, removeDataFromDb, getFilteredDataFromDb} from '@/dbWorker/dbWorkers.js'
import { videoToUnifiedView } from '@/helpers/myHelpers.js'

export default {
    components: { 
        resultList, 
        player,
        videoScrollList,
        empty  
    },
    mixins: [messageMixin],
    data(){
        return {
            videoId: '',
            currentVideo: {},
            videoInWatchLaterPlaylist: false,
            allRequestsDone: false
        }
    },

    watch: {
        '$route.path'(){
            if(this.$route.params.id){
                this.$q.loading.show()
                this.getRoutedVideo()
                    .then(()=>{
                        if(this.allRequestsDone){
                            this.isInWatchLaterPlaylist()
                            this.removeVideoIfItWasSavedBefore()
                            this.saveVideoToBrowseHistory()
                            .then(()=>{
                                this.$q.loading.hide()
                            })
                        }
                    })
            }
        },   
    },

    methods: {
        async getRoutedVideo() {
            this.allRequestsDone = false
            this.videoId = this.$route.params.id;
            await apiRequest(getVideoFullData, {request: this.videoId, maxResult: 5})
                .then(response =>{
                    if(response.message){
                        this.$q.loading.hide()
                        this.errorMessege = `Ошибка: ${response.message}`
                        this.isError = true
                        this.message = this.errorMessege
                    } else {
                        this.allRequestsDone = true
                        this.currentVideo = response
                    }
                })
        },

        async saveVideoToBrowseHistory(){
            const toAddData = {
                videoId: this.currentVideo.videoId,
                title: this.currentVideo.title,
                description: this.currentVideo.description,
                chanelname: this.currentVideo.chanelname,
                publishedAt: this.currentVideo.publishedAt,
                preview: this.currentVideo.preview
            }
            await dbRequestCaller(addDataToDb, {
                target: 'browsingHistory',
                payload: toAddData
            })
        },

        async addVideoToWatchLaterPlaylist(video){
            const toAddData = {
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                chanelname: video.chanelname,
                publishedAt: video.publishedAt,
                preview: video.preview
            }
            await dbRequestCaller(addDataToDb, {
                target: 'watchLaterPlaylist',
                payload: toAddData
            }) 
            .then(response => {
                if(!response.hasError){
                    this.videoInWatchLaterPlaylist = true
                    this.isSuccess = true
                    this.message = 'Видео успешно сохранено'
                } else {
                    this.isError = true
                    this.message = 'Не удалось сохранить видео'
                }
            })
        },

        async isInWatchLaterPlaylist(){
            const response = await dbRequestCaller(getFilteredDataFromDb, {
                target: 'watchLaterPlaylist',
                filterOptions: video => video.videoId === this.videoId
            })
            if(!response.hasError && response.data.length > 0){
                this.videoInWatchLaterPlaylist = true 
            }
        },
        async removeVideoIfItWasSavedBefore(){
            const response = await dbRequestCaller(getFilteredDataFromDb, {
                target: 'browsingHistory',
                filterOptions: video => video.videoId === this.videoId
            })
            if(!response.hasError && response.data.length > 0) {
                const id = response.data[0].id
                await dbRequestCaller(removeDataFromDb, {
                    target: 'browsingHistory',
                    id: id
                })
            }
        },
    },

    beforeMount(){
        this.$q.loading.show()
        this.getRoutedVideo()
            .then(()=>{
                if(this.allRequestsDone){
                    this.isInWatchLaterPlaylist()
                    this.removeVideoIfItWasSavedBefore()
                    this.saveVideoToBrowseHistory()
                    .then(()=>{
                        this.$q.loading.hide()
                    })
                }
            })
    },
}
</script>

<style lang="scss" scoped>
    .video-watcher-wrapper {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .video-iframa-wrapper {
        width: 70%;
        
    }
    .video-similar-scroll-area {
        width: 29%;
    }
</style>