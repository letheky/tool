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
    name: "kiosk3",
    path: "/kiosk3",
    component: () => import("../views/map3.vue"),
  },
  {
    name: "kiosk8",
    path: "/kiosk8",
    component: () => import("../views/map8.vue"),
  },

];

const router = createRouter({
  history: createWebHashHistory(
    import.meta.env.BASE_URL),
  routes,
});
export default router;