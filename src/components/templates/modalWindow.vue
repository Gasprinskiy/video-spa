<template>
    <div class="modal-window-wrapper" @click="closeBlur" :class="{show: show}">  
        <div class="modal-window-container" @click.stop :style="{maxWidth: maxWidth + 'px'}">
            <q-btn v-if="xbtn" @click="closeModal" class="modal-window-close-btn" icon="close"/>
            <slot name="title"/>
            <slot name="body"/>
        </div>
    </div>   
        
    
</template>

<script>

import toggleMixin from '@/mixins/toggleMixin.js'

export default {
    mixins: [toggleMixin],
    props: {
        maxWidth: {
            type: Number,
            default: 400
        },
        closeOnBlur: {
            type: Boolean,
            default: false
        },
        xbtn: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        closeBlur(){
            if(this.closeOnBlur){
                this.closeModal()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .modal-window-wrapper {
        width: 100%;
        height: 100%;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.493);
        opacity: 0;
        visibility: hidden;
        display: flex;
        z-index: 1001;
        top: 0;
        left: 0;
        &.show {
            opacity: 1;
            visibility: visible;
        }
        .modal-window-container {
            width: 100%;
            background-color: #fff;
            margin: auto;
            position: relative;
            padding: 20px;
            border-radius: 10px;
            .modal-window-close-btn {
                position: absolute;
                right: 0;
                top: 0;
                &::before {
                    box-shadow: none;
                }
            }
        }
    }
</style>