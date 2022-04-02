<template>
    <div class="saved-item-wrapper" >
        <div class="saved-item-text test-subtitle">
            <slot name="text"/>
        </div>
        <slot name="btns"/>
    </div>
</template>

<script>

export default {}

</script>

<style lang="scss" scoped>
.saved-item-wrapper {
    width: 100%;
    background: #fff;
    padding: 15px 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    outline: 1px solid rgba(143, 143, 143, 0.24);
    cursor: pointer;
    margin-bottom: 1px;
    overflow: hidden;
        .test-subtitle {
            font-weight: 600;
        }
    }
</style>