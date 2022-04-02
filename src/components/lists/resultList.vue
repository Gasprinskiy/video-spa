<template>
        <div class="result-list" :class="{small: small}">
            <div 
                class="result-list-item"

                v-for="result in resultList"
                :key="result.id"
                @click="$router.push(`/video/${result.id}`)"
                >
                <result-item :small="small" :result="result"/>
            </div>
        </div>
</template>

<script>

import resultItem from '@/components/items/resultItem.vue'

export default {
    components: {resultItem},
    props: {
        resultList: {
            type: Array,
            default: []
        },
        small: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        emitId(id){
            this.$emit('clicked-video', id)
        }
    }
}
</script>

<style lang="scss" scoped>
    .result-list {
        width: 100%;
        padding: 20px 10px 0px 10px;
        .result-list-item {
            cursor: pointer;
            .result-item {
                pointer-events: none;
            }
        }
        .result-list-item:not(:last-child){
            margin-bottom: 20px;
        }
        &.small {
            padding: 0;
           .result-list-item:not(:last-child){
                margin-bottom: 10px;
            }
        }
    }
</style>