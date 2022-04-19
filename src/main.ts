import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import './index.css';
import { createPinia } from 'pinia'

import SvgIcon from "@/components/SvgIcon.vue";
const app = createApp(App)
app.component("SvgIcon", SvgIcon)
app.use(createPinia()).use(router).mount("#app");
