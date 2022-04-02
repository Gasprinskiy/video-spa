<template>
    <q-separator/>
    <div class="description-wrapper">
        <div class="description-chanel-title">
             <chanel-avatar size="md" :title="chanelname"/> {{chanelname}}
        </div>
        <div 
            class="description" 
            :class="{showAll: showAll}" 
            ref="description"
            >
                <span 
                    class="desription-item"
                    v-for="text in parsedDescription"
                    :key="text"
                    v-html="text"
                />
            </div>
        <q-btn 
            flat 
            color="grey"
            padding="none"
            v-if="isDescriptionOverfloved"
            @click="showAll = !showAll">
            {{descriptionBtnStatus}}
        </q-btn>
    </div>
    <q-separator/>    
</template>

<script>

import chanelAvatar from '../items/chanelAvatarItem.vue'

export default {
    components: {chanelAvatar},
    data(){
        return {
            showAll: false,
            isDescriptionOverfloved: false
        }
    },
    props: {
        description: {
            type: String,
            default: ''
        },
        chanelname: {
            type: String,
            default: ''
        }
    },

    computed:{
        parsedDescription(){
            const linkRegEx = /(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.[a-z\d]))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/
            const innerElements = this.description.split('\n')
            const result = []
            innerElements.forEach(element => {
                const htmlElement = element
                    .replace("", '<br>')
                    .replace(linkRegEx, '<a class="description-link" target="_blank" href="$&">$&</a>')
                result.push(htmlElement)
            });
            return result
        },

        descriptionBtnStatus(){
            if(this.showAll){
                return 'Свернуть'
            } else {
                return 'Развернуть'
            }
        },

        isOverflowing() {
            const el = this.$refs.description
            const parentHeight = el.offsetHeight;
            const childreHeight = [...el.children]
                .reduce((total, child)=> total + child.offsetHeight, 0)

            if(childreHeight > parentHeight + 16){
                return true
            } else {
                return false
            }
        }
    },

    mounted(){
        this.isDescriptionOverfloved = this.isOverflowing
    }
}
</script>

<style lang="scss" scoped>
    .description-wrapper {
        padding: 15px;
        position: relative;
    }
    .description {
        width: 100%;
        font-size: 14px;
        line-height: 20px;
        max-height: 80px;
        overflow: hidden;
        &.showAll {
            max-height: unset;
        }
    }
</style>