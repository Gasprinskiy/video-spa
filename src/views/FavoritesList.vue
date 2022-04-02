<template>
    <div class="favorite-list-wrapper">
        <div class="favorite-list-title text-h4">Избранные запросы</div>
        <div class="favorite-list-item" v-for="item in list" :key="item.id">
            <favorite-item
            :favorite="item"
            @item-methods="listMethodCaller"
            />
        </div>
    </div>
    <favorites-modal 
        v-model:show="show" 
        :options="chosenItem"
        :sortOptions="sortOptitons"
        title="Редактировать запрос"
        @save="editRequest"
    />
</template>

<script>
import { db } from '@/db.js'
import favoriteItem from '@/components/items/favoriteItem.vue'
import favoritesModal from '@/components/modal/favoritesModal.vue'

export default {
    components: {favoriteItem, favoritesModal},
    data(){
        return {
            list: [],
            chosenItem: {},
            show: false,
            sortOptitons: [
                {label: 'Без сортировки', value: 'searchSortUnspecified'},
                {label: 'Дате', value: 'date'},
                {label: 'Рейтингу', value: 'rating'},
                {label: 'Просмтрам', value: 'viewCount'},
                {label: 'Названию', value: 'title'},
                {label: 'Количеству видео', value: 'videoCount'},
            ]
        }
    },
    methods: {
        async getList(){
            try {
               await db.favorites.reverse().toArray(data => {
                   this.list = data
               })
            } catch(e){
                this.$q.notify({
                    message: 'Ошибка при обращении на сервер, список избарнных запросов не получен',
                    color: 'red'
                })
            }
        },

        async editRequest(data){
            const index = this.list.findIndex(item => item.id === data.id)
            if(JSON.stringify(this.list[index]) !== JSON.stringify(data)){
                this.list[index] = data
                try {
                    await db.favorites.put({
                        id: data.id,
                        request: data.request,
                        title: data.title,
                        maxResult: data.maxResult,
                        sort: {
                            label: data.sort.label,
                            value: data.sort.value
                        }
                    }).then((resp)=>{
                        if(resp){
                            this.$q.notify({
                                message: 'Запрос успешно отредактирован',
                                color: 'green'
                            })
                        }
                    })
                } catch(e){
                    this.$q.notify({
                        message: `Ошибка при обращении на сервер, изменения не сохранены`,
                        color: 'red'
                    })
                } finally {
                    this.show = false
                }
            } else {
                this.$q.notify({
                    message: `Вы ничего не меняли`,
                    color: 'orange'
                })
            }
        },

        listMethodCaller(id, method){
            if(method){
                this[method](id)
            }
        },

        search(id){
            this.$router.push(`/search/favorites=${id}`)
        },

        editMode(id){
            const chosen = JSON.stringify(this.list.find(item => item.id === id))
            this.chosenItem = JSON.parse(chosen)
            this.show = true
        },

        async remove(id){
            this.list = this.list.filter(item => item.id !== id)
            try {
                await db.favorites.delete(id)
                    .then((resp)=>{
                        this.$q.notify({
                            message: 'Запрос удален',
                            color: 'orange'
                        })
                    })
            } catch(e) {
                this.$q.notify({
                   message: `Ошибка при обращении на сервер, изменения не сохранены`,
                    color: 'red'
                })
            }
        },
    },

    beforeMount(){
        this.$q.loading.show()
        this.getList()
            .then(()=>{
                this.$q.loading.hide()
            })
    }

}

</script>

<style lang="scss" scoped>
    .favorite-list-title {
        margin-bottom: 20px;
    }
</style>