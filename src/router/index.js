import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import SearchResults  from '@/views/SearchResults.vue'
import Video from '@/views/Video.vue'
import WatchLaterPlaylist from '@/views/WatchLaterPlaylist.vue'
import History from '@/views/History.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/browsing-history',
    name: 'History',
    component: History,
  },
  {
    path: '/watch-later',
    name: 'WatchLaterPlaylist',
    component: WatchLaterPlaylist,
  },
  {
    path: '/search/:querry',
    name: 'SearchResults',
    component: SearchResults,
  },
  {
    path: '/video/:id',
    name: 'Video',
    component: Video,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
