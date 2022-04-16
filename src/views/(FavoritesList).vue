<template>
    <div class="favorite-list-wrapper">
        <div class="favorite-list-title" v-if="!isArrayEmpty(favoritesList)">
            <top-title title="Избранные запросы">
                <template v-slot:top-title-slot>
                    <q-btn
                        class="playlist-clear-btn" 
                        flat 
                        label="Очистить запросы" 
                        padding="xs"
                        icon="clear_all"
                        @click="showConfirmModal = !showConfirmModal"
                    /> 
                </template>
            </top-title>
        </div>
        <div class="favorite-list-item" v-for="item in favoritesList" :key="item.id">
            <favorite-item
                :favorite="item"
                @item-methods="listMethodCaller"
            />
        </div>
        <div class="favorite-list-observer" v-intersection="loadMore" />
        <div class="favorite-list-empty-messege" v-if="isArrayEmpty(favoritesList)">
            <empty :message="listEmptyMassege"/>
        </div>
    </div>

    <favorites-modal 
        v-model:show="showEditModal" 
        :options="chosenItem"
        :sortOptions="sortOptitons"
        title="Редактировать запрос"
        @save="editRequest"
    />

    <confirm-modal 
        v-model:show="showConfirmModal"
        title="Вы уверены что хотите очистить список избранных запросов?"
        @confirm="clearFavoritesList" 
    />
</template>

<script>

import {
    dbRequestCaller,
    getDataFromDbWithLimit, 
    getDataFromDb, 
    getDbTotalCount,
    putDataToDb,
    removeDataFromDb
} from '@/serviсes/dbWorker/'
import { isArrayEmpty } from '@/serviсes/helpers/'

import intersection from '@/directives/intersection.js'
import messegeMixin from '@/mixins/messageMixin.js'
import favoriteItem from '@/components/items/favoriteItem.vue'
import favoritesModal from '@/components/modal/favoritesModal.vue'
import confirmModal from '@/components/modal/confirmModal.vue'
import topTitle from '@/components/templates/topTitle.vue'
import empty from '@/components/items/empty.vue'


export default {
    components: {
        favoriteItem, 
        favoritesModal, 
        topTitle,
        confirmModal,
        empty
    },
    mixins: [messegeMixin],
    directives: [intersection],
    data(){
        return {
            favoritesList: [],
            chosenItem: {},
            showEditModal: false,
            showConfirmModal: false,
            sortOptitons: [
                {label: 'Без сортировки', value: 'searchSortUnspecified'},
                {label: 'Дате', value: 'date'},
                {label: 'Рейтингу', value: 'rating'},
                {label: 'Просмтрам', value: 'viewCount'},
                {label: 'Названию', value: 'title'},
                {label: 'Количеству видео', value: 'videoCount'},
            ],
            listTotalCount: 0,
            loadOptions: {
                limit: 20,
                page: 1
            },
            isArrayEmpty
        }
    },

    computed: {
        listEmptyMassege(){
            if(this.errorMessege !== '') {
                return this.errorMessege
            } 
            return 'Список избранных запросов пуст'
        },
        
    },

    methods: {
        listMethodCaller(id, method){
            if(method){
                this[method](id)
            }
        },

        async getFavoritesList(){
            const response = await dbRequestCaller(getDataFromDbWithLimit, {
                target: 'favorites',
                limit: this.loadOptions.limit * this.loadOptions.page
            })
            if(!response.hasError){
                this.favoritesList = response.data
            } else {
                this.isError = true
                this.errorMessege = `Ошибка: ${response.errorMessage}, список избранных запросов не получен`
                this.message = this.errorMessege
            }
        },

        async loadMore(){
            if(this.listTotalCount > this.favoritesList.length){
                this.loadOptions.page += 1
                this.getFavoritesList()
            }
        },

        async getFavoritesListTotalCount(){
            const response = await dbRequestCaller(getDbTotalCount, {
                target: 'favorites'
            })
            if(!response.hasError){
                this.listTotalCount = response.data
           } else {
               this.listTotalCount = this.favoritesList.length
           }
        },

        async editRequest(data){
            const index = this.favoritesList.findIndex(item => item.id === data.id)
            if(JSON.stringify(this.favoritesList[index]) !== JSON.stringify(data)){
                const editedData = {
                    id: data.id,
                    request: data.request,
                    title: data.title,
                    maxResult: data.maxResult,
                    sort: {
                        label: data.sort.label,
                        value: data.sort.value
                    }
                }

                await dbRequestCaller(putDataToDb, {
                    target: 'favorites',
                    payload: editedData
                })
                .then(response =>{

                    if(!response.hasError){
                        this.favoritesList[index] = data
                        this.showEditModal = false
                        this.isSuccess = true
                        this.message = 'Изменения сохранены'
                    } else {
                        this.isError = true
                        this.message = `Ошибка: ${response.errorMessage}, изменеия не сохранены`
                    }

                })
                
            } else {
                this.isWarn = true;
                this.message = 'Вы ничего не меняли'
            }
        },

        search(id){
            this.$router.push(`/search/favorites=${id}`)
        },

        editMode(id){
            const chosen = JSON.stringify(this.favoritesList.find(item => item.id === id))
            this.chosenItem = JSON.parse(chosen)
            this.showEditModal = true
        },

        async remove(id){
            await dbRequestCaller(removeDataFromDb, {
                target: 'favorites',
                id: id
            })
            .then(response => {
                if(!response.hasError){
                    this.favoritesList = this.favoritesList.filter(item => item.id !== id)
                    this.showEditModal = false
                    this.isSuccess = true
                    this.message = 'Запрос удален'
                } else {
                    this.isError = true
                    this.message = `Ошибка: ${response.errorMessage}, не удалось удалить запрос`
                }
            })
        },

        async clearFavoritesList(){
            await this.favoritesList.forEach(item => {
                dbRequestCaller(removeDataFromDb, {
                    target: 'favorites',
                    id: item.id
                })
                .then(response => {
                    if(!response.hasError){
                        this.favoritesList = this.favoritesList.filter(video => video.id !== item.id)
                        this.showConfirmModal = false
                        this.isSuccess = true
                        this.message = 'Список избранных запросов очищен'
                    } else {
                        this.isError = true
                        this.message = `Ошибка: ${response.errorMessage}, не удалось очистить список`
                    }
                })
            })
        }
    },

    beforeMount(){
        this.$q.loading.show()
        this.getFavoritesList()
            .then(()=>{
                this.getFavoritesListTotalCount()
                this.$q.loading.hide()
            })
    }

}

</script>

<style lang="scss" scoped>
    .favorite-list-wrapper {
        position: relative;
        .favorite-list-title {
            margin-bottom: 10px;
        }
        .favorite-list-item {
            margin-bottom: 5px;
        }
        .favorite-list-observer {
            position: absolute;
            background-color: $primary;
            bottom: 0px;
            z-index: -1;
        }
    }
    
</style>