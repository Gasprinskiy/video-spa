<template>
    <modal-window v-model:show="show">
        <template v-slot:title>
            <div class="favorite-modal-title text-h6">{{title}}</div>
        </template>
        <template v-slot:body>
            <form class="favorite-modal-body" @submit.prevent="emitSave">
                    <q-input 
                        outlined
                        v-model="options.request"
                        class="modal-inputs-item"
                        label="*Запрос"
                        :rules="[val => !!val || 'Поле обязательное к заполнению']"
                    />
                    <q-input 
                        outlined 
                        v-model="options.title"
                        class="modal-inputs-item"
                        label="*Название"
                        :rules="[val => !!val || 'Поле обязательное к заполнению']"
                    />
                    
                    <q-select 
                        outlined 
                        v-model="options.sort" 
                        :options="sortOptions" 
                        class="modal-inputs-item"
                        label="Сортировать по" 
                    />
                    <div class="text-subtitle">Максимальное количество</div>
                    <q-slider 
                        v-model="options.maxResult" 
                        class="modal-inputs-item"
                        :min="1" 
                        :max="25"
                        label
                        switch-label-side
                    />
                    <div class="favorites-modal-btns btns">
                        <q-btn
                            class="btns-item"
                            outline
                            color="primary"
                            label="не сохранять"
                            @click="closeModal"
                        />
                        <q-btn
                            type="submit"
                            class="btns-item"
                            color="primary"
                            label="сохранить"
                        />
                    </div>
            </form>
        </template> 
    </modal-window>
</template>

<script>

import modalWindow from '@/components/templates/modalWindow.vue'
import toggleMixin from '@/mixins/toggleMixin.js'

export default {
    components: {modalWindow},
    mixins: [toggleMixin],
    
    props: {
        title: {
            type: String,
            default: ''
        },
        options: {
            type: Object,
            default: {}
        },
        sortOptions: {
            type: Array,
            default: []
        }
    },

    computed:{
        isFormFilled(){
            return this.options.title && this.options.request 
        }
    },

    methods: {
        emitSave(){
            if(this.isFormFilled){
                this.$emit('save', this.options)
            } else {
                this.$q.notify({
                    message: 'Ошибка при чтении полей формы',
                    color: 'red'
                })
            }    
        }
    },


}
</script>

<style lang="scss" scoped>
    .favorite-modal-title {
        text-align: center;
        margin-bottom: 10px;
    }
    .modal-inputs-item {
        margin-bottom: 10px;
    }
    .favorites-modal-btns {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .btns-item {
            width: 49%;
        }
    }
</style>