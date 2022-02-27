import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/ui/dashboard",
    name: "Dashboard",
    component: () => import("@/views/Dashboard.vue")
  },
  {
    path: "/ui/gateway",
    name: "Gateway",
    component: () => import("@/views/Gateway.vue")
  },
  {
    path: "/ui/gateway_detail/:uid",
    name: "GatewayDetail",
    component: () => import("@/views/GatewayDetail.vue")
  },
  {
    path: "/ui/configs",
    name: "Configs",
    component: () => import("@/views/Configs.vue"),
    children: [
      {
        path: "parameter",
        name: "Parameter",
        component: () => import("@/views/configs/Parameter.vue")
      },
      {
        path: "site",
        name: "Site",
        component: () => import("@/views/configs/Site.vue")
      },
      {
        path: "server",
        name: "Server",
        component: () => import("@/views/configs/Server.vue")
      },
      {
        path: "location",
        name: "Location",
        component: () => import("@/views/configs/Location.vue")
      },
      {
        path: "upstream",
        name: "Upstream",
        component: () => import("@/views/configs/Upstream.vue")
      },
    ]
  },
  {
    path: "/account/regist",
    name: "Regist",
    component: () => import("@/views/Regist.vue")
  },
  {
    path: "/account/login",
    name: "Login",
    component: () => import("@/views/Login.vue")
  },
];

const ip = import.meta.env.BASE_URL
const router = createRouter({
  history: createWebHistory(ip),
  routes,
});

export default router;
