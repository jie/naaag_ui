import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/test_frame",
    name: "TestIfram",
    component: () => import("@/views/test_frame.vue")
  }
];

const ip = import.meta.env.BASE_URL
const router = createRouter({
  history: createWebHistory(ip),
  routes,
});

export default router;
