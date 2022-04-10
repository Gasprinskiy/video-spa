<template>
    <div class="browse-history-wrapper">
        <div class="browse-history-title">
            <top-title title="История просмотров" v-if="!isArrayEmpty(browseHistoryList)">
                <template v-slot:top-title-slot>
                    <q-btn
                        class="history-clear-btn" 
                        flat 
                        label="Очистить историю" 
                        padding="xs"
                        icon="clear_all"
                        @click="showConfirmModal = !showConfirmModal"
                    /> 
                </template>
            </top-title>
        </div>
        <div class="browse-history-list history">
            <div 
             class="history-item"
             v-for="item in browseHistoryList"
             :key="item.id"
            >   
                <q-btn 
                    flat
                    class="history-item-route-btn" 
                    @click="$router.push(`/video/${item.videoId}`)"
                />
                    <result-item :result="item">
                        <template v-slot:absolute-slot>
                            <q-btn
                                class="history-item-menu"
                                icon="more_vert"
                                flat
                            >
                                <q-menu
                                    anchor="center left"
                                    self="center left"
                                >
                                    <q-list style="min-width: 100px;" >
                                        <q-item 
                                         @click="addVideoToWatchLaterPlaylist(item)" 
                                         :clickable="!playListItemsVideosId .includes(item.videoId)" 
                                         v-close-popup
                                        >
                                            <q-item-section side>
                                                <q-icon 
                                                 v-if="!playListItemsVideosId.includes(item.videoId)" 
                                                 name="watch_later"
                                                />
                                                <q-icon 
                                                 v-if="playListItemsVideosId.includes(item.videoId)" 
                                                 name="done"
                                                />
                                            </q-item-section>
                                            <q-item-section >
                                                Смотреть позже
                                            </q-item-section>
                                        </q-item>
                                        <q-item @click="remove(item.id)" clickable v-close-popup >
                                            <q-item-section side>
                                                <q-icon name="close"/>
                                            </q-item-section>
                                            <q-item-section>
                                                Удалить
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-menu>
                            </q-btn>
                        </template>
                    </result-item>
            </div>
            <div 
             class="browse-history-observer observer" 
             v-intersection="loadMore"
            />
            <div class="history-empty-msg" v-if="isArrayEmpty(browseHistoryList)">
                <empty :message="historyEmptyMessage"/>
            </div>
        </div> 
    </div>

    <confirm-modal 
        v-model:show="showConfirmModal"
        title="Вы уверены что хотите очистить историю просмотров?"
        @confirm="clearHistory" 
    />
</template>

<script>

import { isArrayEmpty, videoListToUnifiedView } from '@/helpers/myHelpers.js'
import { dbRequestCaller, getDataFromDbWithLimit, 
getDataFromDb, addDataToDb, removeDataFromDb, getDbTotalCount } from '@/dbWorker/dbWorkers.js'

import messageMixin from '@/mixins/messageMixin.js'
import intersection from '@/directives/intersection.js'

import empty from '@/components/items/empty.vue'
import resultItem from '@/components/items/resultItem.vue'
import topTitle from '@/components/templates/topTitle.vue'
import confirmModal from '@/components/modal/confirmModal.vue'

export default {
    components: {resultItem, topTitle, empty, confirmModal},
    mixins: [messageMixin],
    directives: [intersection],
    data(){
        return {
            browseHistoryList: [],
            playListItemsVideosId: [],
            showConfirmModal: false,
            listTotalCount: 0,
            loadOptions: {
                limit: 12,
                offset: 0
            },
            isArrayEmpty,
        }
    },

    computed: {
        historyEmptyMessage(){
            if(this.errorMessege !== ''){
                return this.errorMessege
            }
            return 'История просмотров пуста' 
        }
    },

    methods: {
        async getBrowseHistoryList() {
            const response = await dbRequestCaller(getDataFromDbWithLimit, {
                target: 'browsingHistory',
                limit: this.loadOptions.limit,
                offset: this.loadOptions.offset += this.browseHistoryList.length 
            })
            if(!response.hasError){
                this.browseHistoryList = [...this.browseHistoryList, ...response.data]
            } else {
                this.isError = true
                this.errorMessege = `Ошибка: ${response.errorMessage}, история просмотров не получена`
                this.message = this.errorMessege
            }
        },

        async getBrowseHistoryListTotalCount(){
           const response = await dbRequestCaller(getDbTotalCount, {
                target: 'browsingHistory'
           })
           if(!response.hasError){
                this.listTotalCount = response.data
           } else {
               this.listTotalCount = this.browseHistoryList.length
           }
        },

        async loadMore(){
            if(this.listTotalCount > this.browseHistoryList.length){
                this.getBrowseHistoryList()   
            }
        },
        
        async getPlaylistItemsVideosId(){
            const response = await dbRequestCaller(getDataFromDb, {target: 'watchLaterPlaylist'})
            if(!response.hasError){
                this.playListItemsVideosId = response.data.map(item => item.videoId)
            } else {
                this.isError = true
                this.message = `Ошибка: ${response.errorMessage}, при получении информации о плейлисте `
            }
        },

        async addVideoToWatchLaterPlaylist(video) {
            const addingData = {
                videoId: video.videoId,
                title: video.title,
                description: video.description,
                chanelname: video.chanelname,
                publishedAt: video.publishedAt,
                preview: video.preview
            }
            await dbRequestCaller(addDataToDb, {
                target: 'watchLaterPlaylist',
                payload: addingData
            }).then(response => {
                if(!response.hasError){
                    this.playListItemsVideosId.push(video.videoId)
                    this.isSuccess = true
                    this.message = 'Видео успешно добавлено'
                } else {
                    this.isError = true
                    this.message = `Ошибка: ${response.errorMessage}, не удалось добавить видео в плейлист`
                }
            })
            
        },

        async remove(id){
            await dbRequestCaller(removeDataFromDb, {
                target: 'browsingHistory',
                id: id
            }).then(response => {
                if(!response.hasError){
                    this.browseHistoryList = this.browseHistoryList.filter(video => video.id !== id)
                    this.isSuccess = true
                    this.message = 'Видео удалено из истории просмотров'
                } else {
                    this.isError = true
                    this.message = `Ошибка: ${response.errorMessage}, не удалось удалить видео из истории просмотров`
                }
            })
        },

        async clearHistory(){
            await this.browseHistoryList.forEach(item => {
                dbRequestCaller(removeDataFromDb, {
                    target: 'browsingHistory',
                    id: item.id
                })
                .then(response => {
                    if(!response.hasError){
                        this.browseHistoryList = this.browseHistoryList.filter(video => video.id !== item.id)
                        this.showConfirmModal = false
                        this.isSuccess = true
                        this.message = 'История просмотров очищена'
                    } else {
                        this.isError = true
                        this.message  = `Ошибка: ${response.errorMessage}, не удалось очистить историю`
                    }
                })
            })
        }
    },

    beforeMount(){
        const mock = videoListToUnifiedView(JSON.parse(localStorage.getItem('mockData')))
        this.$q.loading.show()
        this.getBrowseHistoryList()
            .then(()=> {
                this.getBrowseHistoryListTotalCount()
                this.getPlaylistItemsVideosId()
                this.$q.loading.hide()
            })
            
    }
}

</script>

<style lang="scss" scoped>
    .browse-history-list {
        display: flex;
        flex-direction: column;
        padding: 10px 0px;
        position: relative;
        .history-item {
            margin-bottom: 5px;
            position: relative;
            .history-item-route-btn {
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: 100;
            }
            .history-item-menu {
                z-index: 101;
            }
        }
        .browse-history-observer {
            position: absolute;
            bottom: 180px;
            z-index: -1;
        }
    }
</style>