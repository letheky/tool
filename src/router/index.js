import {
  createRouter,
  createWebHashHistory
} from "vue-router";

const routes = [{
    name: "home",
    path: "/",
    component: () => import("../views/Home.vue"),
  },
  {
    name: "Kiosk 3",
    path: "/kiosk3",
    component: () => import("../views/map3.vue"),
  },
  {
    name: "Kiosk 4",
    path: "/k4.1",
    component: () => import("../views/map4.vue"),
  },
  {
    name: "Kiosk 5",
    path: "/kiosk5",
    component: () => import("../views/map5.vue"),
  },
  {
    name: "Kiosk 6",
    path: "/kiosk6",
    component: () => import("../views/map6.vue"),
  },
  {
    name: "Kiosk 8",
    path: "/kiosk8",
    component: () => import("../views/map8.vue"),
  },
  {
    name: "Kiosk 10",
    path: "/kiosk10",
    component: () => import("../views/map10.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(
    import.meta.env.BASE_URL),
  routes,
});
export default router;