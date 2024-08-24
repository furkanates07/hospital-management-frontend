import { createRouter, createWebHistory } from "vue-router";
import DoctorView from "../views/doctor/index.vue";
import LoginView from "../views/login/index.vue";
import PatientView from "../views/patient/index.vue";
import RegisterView from "../views/register/index.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/doctor", component: DoctorView },
  { path: "/patient", component: PatientView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
