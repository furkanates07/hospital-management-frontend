import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/home/index.vue";
import LoginView from "../views/login/index.vue";
import RegisterView from "../views/register/index.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/home", component: HomeView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
