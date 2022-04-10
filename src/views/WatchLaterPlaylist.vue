<template>
    <div class="watch-later-playlist-wrapper">
          <div class="watch-later-playlist-title">
            <top-title title="Смотреть позже" v-if="!isArrayEmpty(playListItems)">
                <template v-slot:top-title-slot>
                    <q-btn
                        class="playlist-clear-btn" 
                        flat 
                        label="Очистить плейлист" 
                        padding="xs"
                        icon="clear_all"
                        @click="showClearConfirm = !showClearConfirm"
                    /> 
                </template>
            </top-title>
          </div>
          <div class="watch-later-playlist-list playlist">
              <div 
                class="playlist-item"
                v-for="item in playListItems"
                :key="item.id"
                >   
                    <q-btn 
                        flat
                        class="playlist-item-route-btn" 
                        @click="$router.push(`/video/${item.videoId}`)"
                    />
                    <result-item :result="item">
                        <template v-slot:absolute-slot>
                            <q-btn
                                class="playlist-item-remove-btn"
                                label="Удалить"
                                color="negative"
                                icon="close"
                                flat
                                @click="remove(item.id)"
                            />
                        </template>
                    </result-item>
                </div>
                <div 
                    class="watch-later-playlist-observer observer" 
                    v-intersection="loadMore"
                />
                <div class="watch-later-playlist-empty-msg" v-if="isArrayEmpty(playListItems)">
                    <empty :message="playListEmptyMsg"/>
                </div>
          </div> 
    </div>

    <confirm-modal 
        v-model:show="showClearConfirm"
        title="Вы уверены что хотите очистить плейлист?"
        @confirm="clearPlayList" 
    />
</template>

<script>

import { isArrayEmpty } from '@/helpers/myHelpers.js'
import { dbRequestCaller, getDataFromDbWithLimit, getDbTotalCount, removeDataFromDb } from '@/dbWorker/dbWorkers.js'

import messageMixin from '@/mixins/messageMixin.js'
import intersection from '@/directives/intersection.js'

import resultItem from '@/components/items/resultItem.vue'
import topTitle from '@/components/templates/topTitle.vue'
import empty from '@/components/items/empty.vue'
import confirmModal from '@/components/modal/confirmModal.vue'

export default {
    components: { 
        resultItem, 
        topTitle, 
        empty,
        confirmModal
    },

    mixins: [messageMixin],
    directives: [intersection],

    data(){
        return {
            playListItems: [],
            showClearConfirm: false,
            listTotalCount: 0,
            loadOptions: {
                limit: 12,
                offset: 0
            },
            isArrayEmpty
        }
    },

    computed: {
        playListEmptyMsg(){
            if(this.errorMessege !== ''){
                return this.errorMessege
            }
            return 'Плейлист пуст' 
        }
    },

    methods: {
        async getPlaylistItems(){
            const response = await dbRequestCaller(getDataFromDbWithLimit, {
                target: 'watchLaterPlaylist',
                limit: this.loadOptions.limit,
                offset: this.loadOptions.offset += this.playListItems.length 
            })
            if(!response.hasError){
                this.playListItems = [...this.playListItems, ...response.data]
            } else {
                this.isError = true
                this.errorMessege = `Ошибка: ${response.errorMessage}, список видео из плейлиста не получен`
                this.message = this.errorMessege
            }
        },

        async getPlayListTotalCount(){
           const response = await dbRequestCaller(getDbTotalCount, {
                target: 'watchLaterPlaylist'
           })
           if(!response.hasError){
                this.listTotalCount = response.data
           } else {
               this.listTotalCount = this.playListItems.length
           }
        },

        async loadMore(){
            if(this.listTotalCount > this.playListItems.length){
                this.getPlaylistItems()   
            }
        },

        async remove(id){
            await dbRequestCaller(removeDataFromDb, {
                target: 'watchLaterPlaylist',
                id: id
            }).then(response => {
                if(!response.hasError){
                    this.playListItems = this.playListItems.filter(item => item.id !== id)
                    this.isSuccess = true
                    this.message = 'Видео удалено из плейлиста'
                } else {
                    this.isError = true
                    this.message = `Ошибка: ${response.errorMessage}, изменения не сохранены`
                }
            })
        },

        async clearPlayList(){
            await this.playListItems.forEach(item => {
                dbRequestCaller(removeDataFromDb, {
                    target: 'watchLaterPlaylist',
                    id: item.id
                }).then(response => {
                    if(!response.hasError){
                        this.playListItems = this.playListItems.filter(item => item.id !== id)
                        this.isSuccess = true
                        this.message = 'Плейлист очищен'
                    } else {
                        this.isError = true
                        this.message = `Ошибка: ${response.errorMessage}, не удалось очистить плейлист`
                    }
                })
            })
        },

    },

    beforeMount(){
        this.$q.loading.show()
        this.getPlaylistItems()
            .then(()=>{
                this.getPlayListTotalCount()
                this.$q.loading.hide()
            })
    }
}

</script>

<style lang="scss" scoped>
    .watch-later-playlist-list {
        display: flex;
        flex-direction: column;
        padding: 10px 0px;
        position: relative;
        .playlist-item {
            margin-bottom: 5px;
            position: relative;
            .playlist-item-route-btn {
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: 100;
            }
            .playlist-item-remove-btn {
                z-index: 101;
            }
        }
        .watch-later-playlist-observer {
            position: absolute;
            bottom: 180px;
            z-index: -1;
        }
    }
</style>