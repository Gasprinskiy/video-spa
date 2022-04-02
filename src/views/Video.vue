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
                    <result-list :small="true" :resultList="currentVideo.similarVideoList"/>
                </template>
            </video-scroll-list>
        </div>
    </div>
        
</template>

<script>

import resultList from '@/components/lists/resultList.vue'
import player from '@/components/playerItems/player.vue'
import videoScrollList from '@/components/templates/videoScrollList.vue'

import { apiRequest, getVideoFullData } from '@/apiWorkers/apiRequest.js'
import { videoToUnifiedView } from '@/helpers/myHelpers.js'
import { db } from '@/db.js'

export default {
    components: { 
        resultList, 
        player,
        videoScrollList,  
    },

    data(){
        return {
            videoId: '',
            currentVideo: {},
            videoInWatchLaterPlaylist: false,
            allRequestsDone: false
        }
    },

    watch: {
        // '$route.path'(){
        //     this.$q.loading.show()
        //     this.getRoutedVideo()
        //         .then(()=>{
        //             this.$q.loading.hide()
        //         })
        // }
        '$route.path'(){
            this.$q.loading.show()
            this.allRequestsDone = false
            this.currentVideo = {}
            const similarVue = JSON.parse(localStorage.getItem('similarVue'))
            this.currentVideo = videoToUnifiedView(similarVue)
            this.saveVideoToBrowseHistory()
                .then(()=>{
                    this.isInWatchLaterPlaylist()
                    this.allRequestsDone = true
                    this.$q.loading.hide()
                })
        }    
    },

    methods: {
        async getRoutedVideo() {
            this.allRequestsDone = false
            this.videoId = this.$route.params.id;
            await apiRequest(getVideoFullData, {request: this.videoId, maxResult: 5})
                .then(response =>{
                    this.allRequestsDone = true
                    if(response.message){
                        this.$q.notify({
                            message: `Сервер вернул: ${response.message}`,
                            color: 'red'
                        })
                    } else {
                        this.currentVideo = response
                    }
                })
        },

        async saveVideoToBrowseHistory(){
            try {
                await db.browsingHistory.put({
                    id: this.currentVideo.id,
                    title: this.currentVideo.title,
                    description: this.currentVideo.description,
                    chanelname: this.currentVideo.chanelname,
                    publishedAt: this.currentVideo.publishedAt,
                    preview: this.currentVideo.preview
                })
            } catch (e) {
                console.log(e);
            }
        },

        async addVideoToWatchLaterPlaylist(video){
            try {
                await db.watchLaterPlaylist.put({
                    id: video.id,
                    title: video.title,
                    description: video.description,
                    chanelname: video.chanelname,
                    publishedAt: video.publishedAt,
                    preview: video.preview
                }).then(()=>{
                    this.videoInWatchLaterPlaylist = true
                    this.$q.notify({
                        message: 'Видео успешно сохранено',
                        color: 'green'
                    })
                })
            } catch (e) {
                this.$q.notify({
                    message: `Не удалось сохранить видео, ошибка: ${e}`,
                    color: 'red'
                })
            }
        },

        async isInWatchLaterPlaylist(){
            try {
                await db.watchLaterPlaylist
                    .filter(video => video.id === "XzLuMtDelGk")
                    .toArray(data => {
                        if(data.length > 0){
                            this.videoInWatchLaterPlaylist = true
                        }
                    }) 
            } catch(e){
                console.log(e);
            }
        }
    },

    beforeMount(){
        this.$q.loading.show()
        this.allRequestsDone = true
        const similarVue = JSON.parse(localStorage.getItem('similarVue'))
        this.currentVideo = videoToUnifiedView(similarVue)
        this.saveVideoToBrowseHistory()
            .then(()=>{
                this.isInWatchLaterPlaylist()
                this.$q.loading.hide()
            })
        // this.$q.loading.show()
        // this.getRoutedVideo()
        //     .then(()=>{
        //         this.$q.loading.hide()
        //     })
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