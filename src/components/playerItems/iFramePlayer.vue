<template>
    <div class="video-iframe-player">
        <iframe class="ifarame"  frameborder="0" allowfullscreen  
            :src="url">
        </iframe>
    </div>
</template>

<script>

//https://www.youtube.com/embed/${videoId}?autoplay=1

export default {
    props: {
        url: {
            type: String,
            default: '',
        }
    }
}
</script>

<style lang="scss" scoped>
    .video-iframe-player {
        width: 100%;
        max-height: 520px;
        padding-bottom: 50%;
        // flex-grow: 1;
        position: relative;
       .ifarame {
        position: absolute;
        width: 100%;
        height: 100%;
       } 
    }
</style>