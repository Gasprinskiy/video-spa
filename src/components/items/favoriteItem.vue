<template>
    <div class="favorite-item" @click="emitFavotireMethods">
        <saved-item>
            <template v-slot:text>
                {{favorite.title}}
            </template>
            <template v-slot:btns>
                <div class="favorite-btns">
                    <q-btn
                        flat
                        label="Выполнить"
                        color="primary"
                        data-method="search"
                    />
                    <q-btn
                        flat
                        label="Изменить"
                        color="secondary"
                        data-method="editMode"
                    />
                    <q-btn
                        flat
                        label="Удалить"
                        color="negative"
                        data-method="remove"
                    />
                </div>
            </template>
        </saved-item>
    </div>
</template>

<script>

import savedItem from '@/components/templates/savedItem.vue'

export default {
    components: {savedItem},
    props: {
        favorite: {
            type: Object,
            default: {}
        }
    },
    methods: {
        emitFavotireMethods(e){
            const method = e.target.dataset.method
            this.$emit('item-methods', this.favorite.id, method)
        },
    }
}
</script>

<style lang="scss" scoped>
     .favorite-btns {
        position: absolute;
        right: 15px;
    }
    
</style>