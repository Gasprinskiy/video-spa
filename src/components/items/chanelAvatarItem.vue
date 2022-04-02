<template>
    <q-avatar
        :size="size"
        color="secondary"
        text-color="white"
    >
        {{firstLetter}}
    </q-avatar>
</template>

<script>
export default {
    props: {
        size: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },
    computed: {
        firstLetter(){
            return this.title[0].toUpperCase()
        }
    }
}
</script>

<style lang="scss" scoped>

</style>