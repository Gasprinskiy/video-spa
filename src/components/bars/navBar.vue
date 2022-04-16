<template>
    <div class="nav-bar-wrapper">
        <div class="nav-bar-container nav-bar">
            <div class="nav-bar-logo" @click="$router.push('/')">
                <q-img src="@/assets/logo.svg"/>
            </div>
            <div class="nav-bar-search-input">
                <slot name="search-input"/>
            </div>
            <div class="nav-bar-links">
                <div class="nav-bar-link">
                    <router-link class="nav-bar-router-link" to="/browsing-history">
                        <q-icon name="history"/>
                    </router-link>
                </div>
                <div class="nav-bar-link">
                    <router-link class="nav-bar-router-link" to="/watch-later">
                        <q-icon name="watch_later"/>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>


export default {
    computed: {
        isSearch(){
            return this.$route.meta.search
        }
    },
}
</script>

<style lang="scss" scoped>
    .nav-bar-wrapper {
        width: 100%;
        background-color: #fff;
        padding: 0px 20px;
    }
    .nav-bar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0px;
        .nav-bar-logo {
            width: 75px;
            cursor: pointer;
            .q-img {
                pointer-events: none;
            }
        }
        .nav-bar-search-input {
            width: 40%;
        }
        .nav-bar-links {
            display: flex;
            .nav-bar-link {
                padding: 10px;
                .nav-bar-router-link {
                    text-decoration: none;
                    color: inherit;
                    font-size: 25px;
                    &.router-link-active,
                    &.searchPages {
                        color: $primary;
                        text-decoration: underline;
                    }
                }
            }
        }
    }
</style>