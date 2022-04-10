<template>
    <div class="empty-wrapper">
        <div class="empty">
            <q-icon v-if="message !== ''" class="empty-icon" name="folder_off" size="40px" color="grey"/>
            <div class="empty-message text-subtitle">{{message}}</div>
        </div> 
    </div>
        
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
    .empty-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }
    .empty {
        width: 100%;
        text-align: center;
        max-width: 350px;
        .empty-icon {
            margin-bottom: 15px;
        }
        .empty-message {
            font-size: 17px;
            color: grey;
        }
    }
</style>