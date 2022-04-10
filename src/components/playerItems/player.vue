<template>
    <div class="player-wrapper player">
        <div class="player-iframe">
            <frame-player :url="video.url"/>
        </div>
        <div class="player-text">
            <div class="player-info">
                <video-info 
                    :title="video.title"
                    :viewCount="video.views"
                    :publishedData="video.publishedAt"
                >
                    <template v-slot:btns>
                        <q-btn 
                            @click="emitAddToWatchLater" 
                            :icon="addBtnIcon" 
                            label="смотреть позже"
                            flat
                            :disabled="isBtnDisabled"
                            />
                    </template>
                </video-info>
            </div>
            <div class="player-description">
                <video-decription
                    :chanelname="video.chanelname"
                    :description="video.description"
                />
            </div>
        </div>
    </div>
</template>

<script>

import framePlayer from './iFramePlayer.vue'
import videoInfo from './videoInfo.vue'
import videoDecription from './videoDecription.vue'

export default {
    components: {
        framePlayer,
        videoInfo,
        videoDecription
    },

    props: {
        video: {
            type: Object,
            default: {}
        },
        isBtnDisabled: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        addBtnIcon(){
            if(this.isBtnDisabled){
                return 'done'
            } else {
                return 'watch_later'
            }
        }
    },

    methods: {
        emitAddToWatchLater(){
            this.$emit('watch-later', this.video)
        }
    }
}
</script>

<style lang="scss" scoped>
    .player-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        .player-text {
            padding: 5px 15px;
            .player-info {
                padding: 10px 0px;
            }
        }
    }
</style>