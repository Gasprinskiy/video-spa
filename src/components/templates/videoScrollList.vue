<template>
    <div class="similar-video-scroll-area similar-video">
        <div class="video-similar-title text-h6">{{title}}</div>
        <q-scroll-area style="height: 90vh; width: 100%;">
            <slot name="list"/>
        </q-scroll-area>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
    .similar-video-scroll-area {
        width: 100%;
        .video-similar-title {
            margin-bottom: 10px;
        }
    }
</style>
