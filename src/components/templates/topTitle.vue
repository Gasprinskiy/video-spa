<template>
    <div class="top-title-block">
        <div class="text-h6" v-html="title"/>
        <div class="top-title-slot">
            <slot name="top-title-slot"/>
        </div>
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
    .top-title-block {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
</style>