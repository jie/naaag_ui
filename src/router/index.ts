import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue")
  }
];

const ip = import.meta.env.BASE_URL
const router = createRouter({
  history: createWebHistory(ip),
  routes,
});

export default router;
