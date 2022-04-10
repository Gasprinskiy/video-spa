<template>
    <modal-window v-model:show="show">
        <template v-slot:title>
            <div class="confirm-modal-title text-h6">{{title}}</div>
        </template>
        <template v-slot:body>
            <div class="confirm-modal-btns btns">
                <q-btn
                    class="btns-item"
                    color="primary"
                    label="Отмена"
                    @click="closeModal"
                    flat
                />
                <q-btn
                    @click="$emit('confirm')"
                    class="btns-item"
                    color="primary"
                    label="Да"
                />
            </div>
        </template> 
    </modal-window>
</template>

<script>

import modalWindow from '@/components/templates/modalWindow.vue'
import toggleMixin from '@/mixins/toggleMixin.js'

export default {
    components: { modalWindow },
    mixins: [ toggleMixin ],
    props: {
        title: {
            type: String,
            default: ''
        },
    },
}

</script>

<style lang="scss" scoped>
    .confirm-modal-title {
        text-align: center;
        margin-bottom: 20px;
    }
    .confirm-modal-btns {
        display: flex;
        justify-content: space-between;
        .btns-item {
            width: 49%;
        }
    }
</style>