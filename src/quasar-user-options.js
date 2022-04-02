
import './styles/quasar.scss'
import lang from 'quasar/lang/ru.js'
import '@quasar/extras/material-icons/material-icons.css'
import { Notify, Loading } from 'quasar'


// To be used on app.use(Quasar, { ... })
export default {
  config: {},
  plugins: {
    Notify, Loading
  },
  lang: lang
}