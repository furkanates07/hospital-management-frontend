import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";
import AppointmentView from "../views/appointment/index.vue";
import ExaminationView from "../views/examination/index.vue";
import HomeView from "../views/home/index.vue";
import LoginView from "../views/login/index.vue";
import RegisterView from "../views/register/index.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/home", component: HomeView },
  { path: "/create-appointment", component: AppointmentView },
  { path: "/examination", component: ExaminationView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (
    to.path === "/home" &&
    (from.path === "/examination" || from.path === "/create-appointment")
  ) {
    authStore.setSelectedTab("appointments");
  }
  next();
});

export default router;
