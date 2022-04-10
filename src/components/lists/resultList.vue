<template>
    <div class="result-list-wrapper" :class="{small: small}">
        <top-title class="result-list-title" :title="title"/>
        <div class="result-list" :class="{small: small}">
            <div 
                class="result-list-item"
                v-for="result in resultList"
                :key="result.id"
                @click="$emit('result-methods', result.videoId)"
                >
                <q-btn 
                    flat
                    class="result-list-item-route-btn" 
                    @click="$router.push(`/video/${result.videoId}`)"
                />
                <result-item :small="small" :result="result"/>
            </div>
        </div>
    </div>
        
</template>

<script>

import resultItem from '@/components/items/resultItem.vue'
import topTitle from '@/components/templates/topTitle.vue'

export default {
    components: {resultItem, topTitle},
    props: {
        resultList: {
            type: Array,
            default: []
        },
        small: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
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
    .result-list-wrapper {
        padding: 20px 10px 0px 10px;
        .result-list-title {
            margin-bottom: 10px;
        }
        &.small {
            padding: 0;
            .result-list-title {
                margin-bottom: 0px;
            }
        }
    }
    .result-list {
        width: 100%;
        .result-list-item {
            position: relative;
            display: flex;
            align-items: center;
            .result-item {
                pointer-events: none;
            }
            .result-slot {
                position: absolute;
                right: 5px;
                z-index: 101;
            }
            .result-list-item-route-btn {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 100;
            }
        }
        .result-list-item:not(:last-child){
            margin-bottom: 20px;
        }
        &.small {
           .result-list-item:not(:last-child){
                margin-bottom: 10px;
            }
        }
    }
</style>