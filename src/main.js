import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import { useQuasar } from 'quasar'

const app = createApp(App)

app.config.globalProperties.$q = useQuasar
app
.use(Quasar, quasarUserOptions)
.use(router)
.mount('#app')
