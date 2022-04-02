<template>
    <div class="video-info-wrapper">
        <div class="video-info-text">
            <div class="video-info-title text-h4">{{title}}</div>
            <div class="video-info-views text-subtitle">Просмотры: {{formatNumber(viewCount)}}</div>
            <div class="video-info-published-data text-subtitle">Дата публикации: {{definePublishedDay(publishedData)}}</div>
        </div>
        <div class="video-info-btns">
            <slot name="btns"/>    
        </div>    
    </div>
</template>

<script>

import {definePublishedDay, formatNumber} from '@/helpers/myHelpers.js'

export default {
    data(){
        return {
            definePublishedDay,
            formatNumber
        }
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        viewCount: {
            type: String,
            default: ''
        },
        publishedData: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
    .video-info-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .video-info-title {
            font-size: 22px;
        }
        .video-info-views,
        .video-info-published-data {
            opacity: 0.6;
        }
    }
</style>