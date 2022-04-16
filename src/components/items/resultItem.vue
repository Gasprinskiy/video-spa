<template>
    <div class="result-item" :class="{small: small}">
        <div class="result-preview" >
            <q-img :src="result.preview"/>
        </div>
        <div class="result-text">
            <div class="text-subtitle result-title overflow-elips">
                {{result.title}}
            </div>
            <div class="text-subtitle result-published-day" :class="{'overflow-elips': small}">
               <span v-if="!small">Дата публикации:</span> {{definePublishedDay(result.publishedAt)}}
            </div>
            <div class="text-subtitle result-chanel-title" :class="{'overflow-elips': small}">
               <chanel-avatar v-if="!small" size="sm" :title="result.chanelname"/> {{result.chanelname}}
            </div>
            <div class="text-subtitle result-description overflow-elips">
                {{result.description}}
            </div>
        </div>
        <div class="result-item-absolute-slot">
            <slot name="absolute-slot"></slot>
        </div>
    </div>
</template>

<script>

import {definePublishedDay} from '@/serviсes/helpers/'
import chanelAvatar from './chanelAvatarItem.vue'

export default {
    components: {chanelAvatar},
    data(){
        return {
            definePublishedDay
        }
    },
    props: {
        result: {
            type: Object,
            default: {}
        },
        small: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="scss" scoped>
    .result-item {
        width: 100%;
        display: flex;
        cursor: pointer;
        position: relative;
        align-items: center;
        background-color: #FFF;
        border-radius: 5px;
        overflow: hidden;
        .result-preview {
            width: 22%;
            margin-right: 25px;
            max-width: 260px;
            min-width: 180px;
            overflow: hidden;
            border-radius: 5px;
            overflow: hidden;
        }
        .result-text {
            width: 77%;
            .result-title {
                font-weight: 600;
                font-size: 18px;
                max-width: 80%;
            }
            .result-published-day {
                margin-bottom: 10px;
                opacity: 0.8;
            }
            .result-chanel-title {
                opacity: 0.7;
                font-size: 14px;
            }
            .result-description {
                opacity: 0.5;
                max-width: 80%;
                margin-top: 10px;
            }
        }
        .result-item-absolute-slot {
            position: absolute;
            right: 0;
        }
    }
    .result-item {
        &.small {
            .result-preview {
                margin-right: 15px;
            }
            .result-text {
                .result-title {
                    font-size: 14px;
                    max-width: 65%;
                }
                .result-published-day {
                    margin-bottom: 5px;
                    font-size: 12px;
                }
                .result-chanel-title {
                    font-size: 12px;
                }
                .result-description {
                    display: none;
                }
            }
        }
    }
    .overflow-elips {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>