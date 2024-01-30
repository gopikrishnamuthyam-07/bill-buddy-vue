import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import './assets/main.scss';
import "vue-toastification/dist/index.css";
import Toast from 'vue-toastification'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { auth0 } from './config/config'



import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(Toast);
app.use(auth0)

app.use(createPinia())
app.use(router)

app.mount('#app')
